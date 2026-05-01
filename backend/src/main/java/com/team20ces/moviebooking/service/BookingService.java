package com.team20ces.moviebooking.service;

import com.team20ces.moviebooking.dto.BookingRequest;
import com.team20ces.moviebooking.dto.BookingResponse;
import com.team20ces.moviebooking.dto.BookingSummaryResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.team20ces.moviebooking.service.EmailService;

import java.util.stream.Collectors;
import java.util.List;
import java.util.Map;

@Service
public class BookingService {

    private final JdbcTemplate jdbcTemplate;
    private final EmailService emailService;

    public BookingService(JdbcTemplate jdbcTemplate, EmailService emailService) {
        this.jdbcTemplate = jdbcTemplate;
        this.emailService = emailService;
    }

    @Transactional
    public BookingResponse createBooking(BookingRequest req) {

        // Convert IDs to SQL IN clause
        String ids = req.getShowSeatIds().stream()
                .map(String::valueOf)
                .collect(Collectors.joining(","));

        // Validate seats
        String checkSql = """
            SELECT COUNT(*)
            FROM show_seats
            WHERE id IN (%s)
            AND show_id = ?
            AND reservation_status IN ('HELD', 'RESERVED')
        """;

        Integer validCount = jdbcTemplate.queryForObject(
                String.format(checkSql, ids),
                Integer.class,
                req.getShowId()
        );

        if (validCount == null || validCount != req.getShowSeatIds().size()) {
            throw new IllegalStateException("One or more seats are already taken or invalid for this show");
        }

        // Total price
        double total = req.getShowSeatIds().size() * 12.99;

        // Create booking
        Long bookingId = jdbcTemplate.queryForObject("""
            INSERT INTO bookings (customer_id, movie_id, booking_date, total_amount, booking_status)
            VALUES (?, ?, NOW(), ?, 'CONFIRMED')
            RETURNING id
        """,
        Long.class,
        req.getCustomerId(),
        req.getMovieId(),
        total
        );

        // Reserve seats
        String updateSql = "UPDATE show_seats " +
                "SET is_reserved = TRUE, reservation_status = 'RESERVED' " +
                "WHERE id IN (" + ids + ")";

        jdbcTemplate.update(updateSql);
        Long ticketPriceId = jdbcTemplate.queryForObject("""
            SELECT id
            FROM ticket_prices
            WHERE ticket_type = 'ADULT'
            LIMIT 1
        """, Long.class);

        // Insert tickets
        for (Long showSeatId : req.getShowSeatIds()) {
            jdbcTemplate.update("""
                INSERT INTO tickets (booking_id, show_seat_id, ticket_price_id, ticket_type, price_paid)
                VALUES (?, ?, ?, ?, ?)
            """,
            bookingId,
            showSeatId,
            ticketPriceId,
            "ADULT",
            12.99
            );
        }

        BookingSummaryResponse summary = getBookingSummary(bookingId);

        // build simple HTML
        String html = """
            <h2>🎬 Your Booking is Confirmed!</h2>
            <p><strong>Movie:</strong> %s</p>
            <p><strong>Date:</strong> %s</p>
            <p><strong>Time:</strong> %s</p>
            <p><strong>Seats:</strong> %s</p>
            <p><strong>Total Tickets:</strong> %d</p>
            <p><strong>Total Paid:</strong> $%.2f</p>
            <br/>
            <p>Enjoy your movie! 🍿</p>
        """.formatted(
                summary.getMovieTitle(),
                summary.getShowDate(),
                summary.getStartTime(),
                String.join(", ", summary.getSeats()),
                summary.getTicketCount(),
                summary.getTotal()
        );

        // Send confirmation email
        emailService.sendEmail(req.getEmail(), "Booking Confirmation", html);

        return new BookingResponse(bookingId, total);
    }


    public BookingSummaryResponse getBookingSummary(Long bookingId) {

        String sql = """
            SELECT
                b.id AS booking_id,
                m.title AS movie_title,
                sh.show_date,
                sh.start_time,
                s.seat_row,
                s.seat_number,
                t.price_paid
            FROM bookings b
            JOIN movies m ON b.movie_id = m.id
            JOIN tickets t ON t.booking_id = b.id
            JOIN show_seats ss ON t.show_seat_id = ss.id
            JOIN seats s ON ss.seat_id = s.id
            JOIN shows sh ON ss.show_id = sh.id
            WHERE b.id = ?
        """;

        return jdbcTemplate.query(sql, rs -> {

            String movieTitle = null;
            String showDate = null;
            String startTime = null;
            double total = 0;
            double pricePerTicket = 12.99;

            List<String> seats = new java.util.ArrayList<>();

            while (rs.next()) {
                movieTitle = rs.getString("movie_title");
                showDate = rs.getString("show_date");
                startTime = rs.getString("start_time");

                String seat = rs.getString("seat_row")
                        + rs.getInt("seat_number");

                seats.add(seat);

                total += rs.getDouble("price_paid");
            }

            return new BookingSummaryResponse(
                    bookingId,
                    movieTitle,
                    showDate,
                    startTime,
                    seats,
                    seats.size(),
                    pricePerTicket,
                    total
            );
        }, bookingId);
    }

    public Map<String, Object> checkout(Long bookingId) {

        String sql = """
            SELECT id, total_amount
            FROM bookings
            WHERE id = ?
        """;

        Map<String, Object> booking = jdbcTemplate.queryForMap(sql, bookingId);

        return Map.of(
                "bookingId", booking.get("id"),
                "status", "READY_FOR_PAYMENT",
                "total", booking.get("total_amount"),
                "message", "Proceed to mock payment page"
        );
    }
}