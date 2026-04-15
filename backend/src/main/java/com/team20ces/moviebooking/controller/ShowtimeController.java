package com.team20ces.moviebooking.controller;

import com.team20ces.moviebooking.dto.ApiResponse;
import com.team20ces.moviebooking.dto.ShowtimeCreateRequest;
import com.team20ces.moviebooking.dto.ShowtimeResponse;
import com.team20ces.moviebooking.service.ShowtimeService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Controller for showtime endpoints.
 */
@RestController
@RequestMapping("/showtimes")
@CrossOrigin(origins = "http://localhost:3000")
public class ShowtimeController {

    private final ShowtimeService showtimeService;

    public ShowtimeController(ShowtimeService showtimeService) {
        this.showtimeService = showtimeService;
    }

    /**
     * POST /showtimes
     * Creates a new showtime after validation and conflict checks.
     */
    @PostMapping
    public ResponseEntity<?> addShowtime(@RequestBody ShowtimeCreateRequest req) {

        // Required field validation
        if (req.getMovieId() == null ||
            req.getShowroomId() == null ||
            req.getShowDate() == null || req.getShowDate().isBlank() ||
            req.getStartTime() == null || req.getStartTime().isBlank()) {

            return ResponseEntity.badRequest().body(
                new ApiResponse<>(false, "Missing required fields", null)
            );
        }

        // Validate referenced movie
        if (!showtimeService.movieExists(req.getMovieId())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ApiResponse<>(false, "Movie not found", null)
            );
        }

        // Validate referenced showroom
        if (!showtimeService.showroomExists(req.getShowroomId())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ApiResponse<>(false, "Showroom not found", null)
            );
        }

        try {
            java.sql.Date showDate = java.sql.Date.valueOf(req.getShowDate());

            java.time.LocalTime start = java.time.LocalTime.parse(
                req.getStartTime().length() == 5 ? req.getStartTime() + ":00" : req.getStartTime()
            );

            int duration = showtimeService.getMovieDuration(req.getMovieId());
            java.sql.Time startTime = java.sql.Time.valueOf(start);
            java.sql.Time endTime = java.sql.Time.valueOf(start.plusMinutes(duration));

            // Logic-based conflict prevention
            if (showtimeService.hasSchedulingConflict(req.getShowroomId(), showDate, startTime, endTime)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    new ApiResponse<>(false, "Scheduling conflict: showroom already has a show during that time", null)
                );
            }

            ShowtimeResponse saved = showtimeService.addShowtime(req);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>(true, "Showtime created successfully", saved)
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                new ApiResponse<>(false, "Invalid date or time format", null)
            );
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                new ApiResponse<>(false, "Database conflict while creating showtime", null)
            );
        }
    }

    @GetMapping("/showroom/{showroomId}")
    public ResponseEntity<List<ShowtimeResponse>> getShowtimesByShowroom(
            @PathVariable Long showroomId) {
        return ResponseEntity.ok(showtimeService.getShowtimesByShowroom(showroomId));
    }
}