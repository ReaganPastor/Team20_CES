package com.team20ces.moviebooking.service;

import com.team20ces.moviebooking.dto.BookingRequest;
import com.team20ces.moviebooking.dto.BookingResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
public class BookingService {

    private final JdbcTemplate jdbcTemplate;

    public BookingService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional
    public BookingResponse createBooking(BookingRequest req) {

        // Convert IDs to SQL IN clause
        String ids = req.getShowSeatIds().stream()
                .map(String::valueOf)
                .collect(Collectors.joining(","));

        // 1. Validate seats
        String checkSql = """
            SELECT COUNT(*)
            FROM show_seats
            WHERE id IN (%s)
            AND show_id = ?
            AND reservation_status = 'AVAILABLE'
        """;

        Integer validCount = jdbcTemplate.queryForObject(
                String.format(checkSql, ids),
                Integer.class,
                req.getShowId()
        );

        if (validCount == null || validCount != req.getShowSeatIds().size()) {
            throw new IllegalStateException("One or more seats are already taken or invalid for this show");
        }

        // 2. Total price
        double total = req.getShowSeatIds().size() * 12.99;

        // 3. Create booking
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

        // 4. Reserve seats
        String updateSql = "UPDATE show_seats " +
                "SET is_reserved = TRUE, reservation_status = 'RESERVED' " +
                "WHERE id IN (" + ids + ")";

        jdbcTemplate.update(updateSql);

        // 🔥 FIX #1: get ticket_price_id BEFORE inserting tickets
        Long ticketPriceId = jdbcTemplate.queryForObject("""
            SELECT id
            FROM ticket_prices
            WHERE ticket_type = 'ADULT'
            LIMIT 1
        """, Long.class);

        // 5. Insert tickets (FIXED)
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

        return new BookingResponse(bookingId, total);
    }
}