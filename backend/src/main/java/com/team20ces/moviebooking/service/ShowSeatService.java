package com.team20ces.moviebooking.service;

import com.team20ces.moviebooking.dto.ShowSeatResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Service
public class ShowSeatService {

    private final JdbcTemplate jdbcTemplate;

    public ShowSeatService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<ShowSeatResponse> getSeatsForShow(Long showId) {

        String sql = """
            SELECT 
                ss.id AS show_seat_id,
                s.seat_row,
                s.seat_number,
                s.seat_type,
                ss.is_reserved
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
                        rs.getBoolean("is_reserved")
                ),
                showId
        );
    }

    public boolean reserveSeat(Long showSeatId) {
        int updated = jdbcTemplate.update("""
            UPDATE show_seats
            SET is_reserved = TRUE
            WHERE id = ?
            AND is_reserved = FALSE
        """, showSeatId);

        return updated > 0;
    }

    public boolean releaseSeat(Long showSeatId) {
        int updated = jdbcTemplate.update("""
            UPDATE show_seats
            SET is_reserved = FALSE
            WHERE id = ?
        """, showSeatId);

        return updated > 0;
    }


}