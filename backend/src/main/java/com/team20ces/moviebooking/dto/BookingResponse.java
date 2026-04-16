package com.team20ces.moviebooking.dto;

public class BookingResponse {

    private Long bookingId;
    private double total;

    public BookingResponse(Long bookingId, double total) {
        this.bookingId = bookingId;
        this.total = total;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public double getTotal() {
        return total;
    }
}