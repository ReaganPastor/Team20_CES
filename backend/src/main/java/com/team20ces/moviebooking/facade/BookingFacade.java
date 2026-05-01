package com.team20ces.moviebooking.facade;

import com.team20ces.moviebooking.dto.*;
import com.team20ces.moviebooking.service.BookingService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingFacade {

    private final BookingService bookingService;

    public BookingFacade(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    public BookingResponse createBooking(BookingRequest req) {
        return bookingService.createBooking(req);
    }

    public BookingSummaryResponse getSummary(Long bookingId) {
        return bookingService.getBookingSummary(bookingId);
    }

    public Object checkout(Long bookingId) {
        return bookingService.checkout(bookingId);
    }

    public List<BookingSummaryResponse> getCustomerBookings(Long customerId) {
        return bookingService.getBookingsByCustomer(customerId);
    }
}