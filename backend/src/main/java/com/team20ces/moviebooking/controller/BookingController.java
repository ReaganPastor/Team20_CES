package com.team20ces.moviebooking.controller;

import com.team20ces.moviebooking.dto.BookingRequest;
import com.team20ces.moviebooking.dto.BookingResponse;
import com.team20ces.moviebooking.dto.BookingSummaryResponse;
import com.team20ces.moviebooking.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest req) {

        try {
            return ResponseEntity.ok(bookingService.createBooking(req));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{bookingId}/summary")
    public ResponseEntity<BookingSummaryResponse> getSummary(@PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.getBookingSummary(bookingId));
    }

    @PostMapping("/{bookingId}/checkout")
    public ResponseEntity<?> checkout(@PathVariable Long bookingId) {
        return ResponseEntity.ok(
            bookingService.checkout(bookingId)
        );
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<BookingSummaryResponse>> getCustomerBookings(
            @PathVariable Long customerId) {
        return ResponseEntity.ok(bookingService.getBookingsByCustomer(customerId));
    }
}