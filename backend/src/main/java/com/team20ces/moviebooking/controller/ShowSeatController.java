package com.team20ces.moviebooking.controller;

import com.team20ces.moviebooking.dto.ShowSeatResponse;
import com.team20ces.moviebooking.dto.HoldSeatRequest;
import com.team20ces.moviebooking.service.ShowSeatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/show-seats")
@CrossOrigin(origins = "http://localhost:3000")
public class ShowSeatController {

    private final ShowSeatService showSeatService;

    public ShowSeatController(ShowSeatService showSeatService) {
        this.showSeatService = showSeatService;
    }

    // =========================================
    // GET SEATS
    // =========================================
    @GetMapping("/{showId}")
    public List<ShowSeatResponse> getSeats(@PathVariable Long showId) {
        return showSeatService.getSeatsForShow(showId);
    }

    // =========================================
    // HOLD SEATS
    // =========================================
    @PostMapping("/hold")
    public ResponseEntity<?> holdSeats(@RequestBody HoldSeatRequest request) {

        boolean ok = showSeatService.holdSeats(
                request.getShowId(),
                request.getSeatIds()
        );

        if (!ok) {
            return ResponseEntity.status(409)
                    .body("One or more seats are already taken");
        }

        return ResponseEntity.ok().build();
    }

    // =========================================
    // CONFIRM SEATS
    // =========================================
    @PostMapping("/confirm")
    public ResponseEntity<?> confirmSeats(@RequestBody HoldSeatRequest request) {

        boolean ok = showSeatService.confirmSeats(
                request.getShowId(),
                request.getSeatIds()
        );

        if (!ok) {
            return ResponseEntity.status(409)
                    .body("Seats are not in HELD state");
        }

        return ResponseEntity.ok().build();
    }

    // =========================================
    // RELEASE SEATS
    // =========================================
    @PostMapping("/release")
    public ResponseEntity<?> releaseSeats(@RequestBody HoldSeatRequest request) {

        showSeatService.releaseSeats(
                request.getShowId(),
                request.getSeatIds()
        );

        return ResponseEntity.ok().build();
    }
}