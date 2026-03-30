package com.team20ces.moviebooking.controller;

import com.team20ces.moviebooking.dto.*;
import com.team20ces.moviebooking.model.Movie;
import com.team20ces.moviebooking.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

// Controller for profile feature
@RestController
@RequestMapping("/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    private final UserService userService;

    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    // Get full profile by user id
    @GetMapping("/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable Long userId) {
        Optional<ProfileResponse> profile = userService.getProfileById(userId);

        if (profile.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(profile.get());
    }

    // Update editable profile fields
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long userId,
            @RequestBody ProfileUpdateRequest request) {

        Optional<ProfileResponse> updatedProfile = userService.updateProfile(userId, request);

        if (updatedProfile.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedProfile.get());
    }

    // Add or update address
    @PostMapping("/{userId}/address")
    public ResponseEntity<?> saveOrUpdateAddress(
            @PathVariable Long userId,
            @RequestBody AddressRequest request) {

        Optional<AddressResponse> address = userService.saveOrUpdateAddress(userId, request);

        if (address.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(address.get());
    }

    // Add payment card
    @PostMapping("/{userId}/cards")
    public ResponseEntity<?> addPaymentCard(
            @PathVariable Long userId,
            @RequestBody PaymentCardRequest request) {

        Optional<CardResponse> card = userService.addPaymentCard(userId, request);

        if (card.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(card.get());
    }

    // Get favorite movies
    @GetMapping("/{userId}/favorites")
    public ResponseEntity<?> getFavoriteMovies(@PathVariable Long userId) {
        Optional<List<MovieResponse>> favorites = userService.getFavoriteMovies(userId);

        if (favorites.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(favorites.get());
    }

    // Add a favorite movie
    // For now this accepts a simple Movie object in the request body
    @PostMapping("/{userId}/favorites")
    public ResponseEntity<?> addFavoriteMovie(
            @PathVariable Long userId,
            @RequestBody Movie movie) {

        Optional<String> result = userService.addFavoriteMovie(userId, movie);

        if (result.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(result.get());
    }
}