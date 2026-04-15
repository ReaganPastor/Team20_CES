package com.team20ces.moviebooking.service;

import com.team20ces.moviebooking.model.Showroom;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShowroomService {

    private final JdbcTemplate jdbcTemplate;

    public ShowroomService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Showroom> getAllShowrooms() {
        String sql = "SELECT id, showroom_number, capacity, screen_type FROM showrooms";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Showroom s = new Showroom();
            s.setId(rs.getLong("id"));
            s.setShowroomNumber(rs.getInt("showroom_number"));
            s.setCapacity(rs.getInt("capacity"));
            s.setScreenType(rs.getString("screen_type"));
            return s;
        });
    }
}