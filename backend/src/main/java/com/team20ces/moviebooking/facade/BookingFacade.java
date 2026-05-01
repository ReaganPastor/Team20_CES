package com.team20ces.moviebooking.facade;

import com.team20ces.moviebooking.dto.*;
import com.team20ces.moviebooking.service.BookingService;
import com.team20ces.moviebooking.service.CheckoutService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingFacade {

    private final BookingService bookingService;
    private final CheckoutService checkoutService;

    public BookingFacade(BookingService bookingService,
                         CheckoutService checkoutService) {
        this.bookingService = bookingService;
        this.checkoutService = checkoutService;
    }

    public BookingResponse createBooking(BookingRequest req) {
        return bookingService.createBooking(req);
    }

    public BookingSummaryResponse getSummary(Long id) {
        return bookingService.getBookingSummary(id);
    }

    public Object checkout(Long bookingId) {
        return checkoutService.checkout(bookingId);
    }

    public List<BookingSummaryResponse> getCustomerBookings(Long customerId) {
        return bookingService.getBookingsByCustomer(customerId);
    }
}