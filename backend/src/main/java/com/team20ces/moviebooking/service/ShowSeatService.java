package com.team20ces.moviebooking.service;

import com.team20ces.moviebooking.dto.ShowSeatResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShowSeatService {

    private final JdbcTemplate jdbcTemplate;

    public ShowSeatService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // =========================================
    // GET SEATS FOR SHOW
    // =========================================
    public List<ShowSeatResponse> getSeatsForShow(Long showId) {

        String sql = """
            SELECT 
                ss.id AS show_seat_id,
                s.seat_row,
                s.seat_number,
                s.seat_type,
                ss.is_reserved,
                ss.reservation_status
            FROM show_seats ss
            JOIN seats s ON ss.seat_id = s.id
            WHERE ss.show_id = ?
            ORDER BY s.seat_row, s.seat_number
        """;

        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new ShowSeatResponse(
                        rs.getLong("show_seat_id"),
                        rs.getString("seat_row"),
                        rs.getInt("seat_number"),
                        rs.getString("seat_type"),
                        rs.getBoolean("is_reserved"),
                        rs.getString("reservation_status")
                ),
                showId
        );
    }

    // =========================================
    // HOLD SEATS (AVAILABLE → HELD)
    // =========================================
    public boolean holdSeats(Long showId, List<Long> seatIds) {

        for (Long seatId : seatIds) {

            int updated = jdbcTemplate.update("""
                UPDATE show_seats
                SET is_reserved = TRUE,
                    reservation_status = 'HELD'
                WHERE id = ?
                  AND show_id = ?
                  AND reservation_status = 'AVAILABLE'
            """, seatId, showId);

            if (updated == 0) {
                return false;
            }
        }

        return true;
    }

    // =========================================
    // CONFIRM SEATS (HELD → RESERVED)
    // =========================================
    public boolean confirmSeats(Long showId, List<Long> seatIds) {

        for (Long seatId : seatIds) {

            int updated = jdbcTemplate.update("""
                UPDATE show_seats
                SET reservation_status = 'RESERVED'
                WHERE id = ?
                  AND show_id = ?
                  AND reservation_status = 'HELD'
            """, seatId, showId);

            if (updated == 0) {
                return false;
            }
        }

        return true;
    }

    // =========================================
    // RELEASE SEATS (HELD → AVAILABLE)
    // =========================================
    public void releaseSeats(Long showId, List<Long> seatIds) {

        for (Long seatId : seatIds) {

            jdbcTemplate.update("""
                UPDATE show_seats
                SET is_reserved = FALSE,
                    reservation_status = 'AVAILABLE'
                WHERE id = ?
                  AND show_id = ?
                  AND reservation_status = 'HELD'
            """, seatId, showId);
        }
    }
}