package com.team20ces.moviebooking.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CheckoutService {

    private final JdbcTemplate jdbcTemplate;

    public CheckoutService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    // For simplicity, this just returns booking details. In a real app, you'd integrate with a payment gateway here.
    public Map<String, Object> checkout(Long bookingId) {

        String sql = """
            SELECT id, total_amount, booking_status
            FROM bookings
            WHERE id = ?
        """;

        Map<String, Object> booking = jdbcTemplate.queryForMap(sql, bookingId);

        return Map.of(
                "bookingId", booking.get("id"),
                "status", "READY_FOR_PAYMENT",
                "total", booking.get("total_amount"),
                "message", "Proceed to payment"
        );
    }
}