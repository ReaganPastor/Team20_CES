package com.team20ces.moviebooking.controller;

import com.team20ces.moviebooking.dto.ShowSeatResponse;
import com.team20ces.moviebooking.service.ShowSeatService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/show-seats")
@CrossOrigin(origins = "http://localhost:3000")
public class ShowSeatController {

    private final ShowSeatService showSeatService;

    public ShowSeatController(ShowSeatService showSeatService) {
        this.showSeatService = showSeatService;
    }

    @GetMapping("/{showId}")
    public List<ShowSeatResponse> getSeats(@PathVariable Long showId) {
        return showSeatService.getSeatsForShow(showId);
    }

    @PostMapping("/reserve/{id}")
    public ResponseEntity<?> reserve(@PathVariable Long id) {
        boolean ok = showSeatService.reserveSeat(id);

        if (!ok) {
            return ResponseEntity.status(409).body("Seat already reserved");
        }

        return ResponseEntity.ok().build();
    }

    @PostMapping("/release/{id}")
    public ResponseEntity<?> release(@PathVariable Long id) {
        showSeatService.releaseSeat(id);
        return ResponseEntity.ok().build();
    }
}