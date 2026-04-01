package com.team20ces.moviebooking.service;

import com.team20ces.moviebooking.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.team20ces.moviebooking.dto.*;
import com.team20ces.moviebooking.model.Address;
import com.team20ces.moviebooking.model.Movie;
import com.team20ces.moviebooking.model.PaymentCard;
import com.team20ces.moviebooking.util.EncryptionUtil;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final PasswordEncoder encoder;
    private List<User> users = new ArrayList<>();

    @Autowired
    public UserService(PasswordEncoder encoder) {
        this.encoder = encoder;

        // Test users
        // Create users first
        User adminUser = new User(1L, "admin", "admin@email.com",
                encoder.encode("Admin@123"), "admin", "active", UUID.randomUUID().toString());

        User verifiedUser = new User(2L, "user", "user@email.com",
                encoder.encode("User@123"), "user", "active", UUID.randomUUID().toString());

        User suspendedUser = new User(3L, "suspended", "s@email.com",
                encoder.encode("Test@123"), "user", "suspended", UUID.randomUUID().toString());

        User unverifiedUser = new User(4L, "unverified", "u@email.com",
                encoder.encode("Test@123"), "user", "unverified", UUID.randomUUID().toString());

// Create a favorite movie
        Movie favoriteMovie = new Movie(
                101L,
                "Dune: Part Two",
                "Epic sci-fi film",
                "PG-13",
                "Sci-Fi",
                "/images/dune2.jpg",
                null,
                "CURRENTLY_RUNNING"
        );

// Add favorite movie to verified user
        verifiedUser.getFavoriteMovies().add(favoriteMovie);

// Add users to list
        users.add(adminUser);
        users.add(verifiedUser);
        users.add(suspendedUser);
        users.add(unverifiedUser);
        /*
        users.add(new User(5L, "rpastor", "reaganelizabeth@gmail.com",
                encoder.encode("MyPassword"), "admin", "active"));*/
    }

    public Optional<User> findById(Long id) {
        return users.stream()
                    .filter(u -> u.getId().equals(id))
                    .findFirst();
    }

    public Optional<User> findByUsername(String username) {
        return users.stream()
                .filter(u -> u.getUsername().equals(username))
                .findFirst();
    }

    public Optional<User> findByEmail(String email) {
        return users.stream()
                .filter(u -> u.getEmail().equals(email))
                .findFirst();
    }

    public Optional<User> findByVerificationToken(String token) {
        return users.stream()
                .filter(u -> token.equals(u.getVerificationToken()))
                .findFirst();
    }

    public void updateUser(User updatedUser) {
        users = users.stream()
                .map(u -> u.getId().equals(updatedUser.getId()) ? updatedUser : u)
                .toList();
    }

    public List<User> getAllUsers() {
        return users;
    }

    // Get one user's full profile using their id
    public Optional<ProfileResponse> getProfileById(Long userId) {
        Optional<User> userOptional = users.stream()
                .filter(u -> u.getId().equals(userId))
                .findFirst();

        if (userOptional.isEmpty()) {
            return Optional.empty();
        }

        User user = userOptional.get();
        return Optional.of(buildProfileResponse(user));
    }

    // Update profile fields the user is allowed to edit
    public Optional<ProfileResponse> updateProfile(Long userId, ProfileUpdateRequest request) {
        Optional<User> userOptional = users.stream()
                .filter(u -> u.getId().equals(userId))
                .findFirst();

        if (userOptional.isEmpty()) {
            return Optional.empty();
        }

        User user = userOptional.get();

        // Only editable fields are updated
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());

        // Email is intentionally NOT updated
        updateUser(user);

        return Optional.of(buildProfileResponse(user));
    }

    // Add or update the single address for a user
    public Optional<AddressResponse> saveOrUpdateAddress(Long userId, AddressRequest request) {
        Optional<User> userOptional = users.stream()
                .filter(u -> u.getId().equals(userId))
                .findFirst();

        if (userOptional.isEmpty()) {
            return Optional.empty();
        }

        User user = userOptional.get();

        Address address = new Address(
                request.getStreet(),
                request.getCity(),
                request.getState(),
                request.getZipCode()
        );

        user.setAddress(address);
        updateUser(user);

        return Optional.of(new AddressResponse(
                address.getStreet(),
                address.getCity(),
                address.getState(),
                address.getZipCode()
        ));
    }

    // Add a payment card for the user, with encryption for sensitive data
    public Optional<CardResponse> addPaymentCard(Long userId, PaymentCardRequest request) {
        Optional<User> userOptional = users.stream()
                .filter(u -> u.getId().equals(userId))
                .findFirst();

        if (userOptional.isEmpty()) {
            return Optional.empty();
        }

        User user = userOptional.get();

        if (user.getPaymentCards().size() >= 3) {
            throw new RuntimeException("User cannot have more than 3 payment cards");
        }

        String cardNumber = request.getCardNumber();
        String encryptedCard;
        String encryptedCvv;

        try {
            encryptedCard = EncryptionUtil.encrypt(cardNumber);
            encryptedCvv = EncryptionUtil.encrypt(request.getCvv());
        } catch (Exception e) {
            throw new RuntimeException("Failed to encrypt card data", e);
        }

        String lastFour = cardNumber.substring(cardNumber.length() - 4);

        PaymentCard card = new PaymentCard(
                System.currentTimeMillis(),
                userId,
                request.getCardholderName(),
                encryptedCard,
                encryptedCvv,
                request.getExpirationDate(),
                lastFour,
                null, // cardBrand optional
                null // billingAddress optional
        );

        user.getPaymentCards().add(card);
        updateUser(user); // persist to DB

        return Optional.of(new CardResponse(
                card.getId(),
                card.getCardholderName(),
                card.getLastFour(),
                card.getExpirationDate()
        ));
    }

    // Remove a payment card by card ID
    public Optional<String> removePaymentCard(Long userId, Long cardId) {
        Optional<User> userOptional = users.stream()
                .filter(u -> u.getId().equals(userId))
                .findFirst();

        if (userOptional.isEmpty()) {
            return Optional.empty();
        }

        User user = userOptional.get();

        boolean removed = user.getPaymentCards().removeIf(c -> c.getId().equals(cardId));
        if (!removed) {
            return Optional.empty();
        }

        updateUser(user);
        return Optional.of("Card removed successfully");
    }

    // Returns favorite movies for a given userId
    public List<MovieResponse> getFavoriteMovies(Long userId) {
        Optional<User> userOpt = users.stream().filter(u -> u.getId().equals(userId)).findFirst();
        if (userOpt.isEmpty()) {
            return new ArrayList<>();
        }

        User user = userOpt.get();
        List<MovieResponse> response = new ArrayList<>();
        for (Movie movie : user.getFavoriteMovies()) {
            response.add(new MovieResponse(
                    movie.getId(),
                    movie.getTitle(),
                    movie.getPosterPath(), // make sure this is the correct path stored in your Movie object
                    movie.getGenre(),
                    movie.getRating() // now a string like "PG", "R", etc.
            ));
        }
        return response;
    }

    // Return favorite movies for a user
    public List<MovieResponse> getFavoriteMoviesForUser(User user) {
        List<MovieResponse> response = new ArrayList<>();

        for (Movie movie : user.getFavoriteMovies()) {
            // Parse rating to Double safely
            Double rating = null;
            try {
                rating = movie.getRating() != null ? Double.valueOf(movie.getRating()) : null;
            } catch (NumberFormatException e) {
                rating = null; // fallback if rating is invalid
            }

            // Use full 5-arg constructor
            MovieResponse mr = new MovieResponse(
                    movie.getId(),
                    movie.getTitle(),
                    movie.getPosterPath(),
                    movie.getGenre(),
                    movie.getRating()
            );

            response.add(mr);
        }

        return response;
    }

    // Add a movie to favorites using a movie object passed in
    public Optional<String> addFavoriteMovie(Long userId, Movie movie) {
        Optional<User> userOptional = users.stream()
                .filter(u -> u.getId().equals(userId))
                .findFirst();

        if (userOptional.isEmpty()) {
            return Optional.empty();
        }

        User user = userOptional.get();

        boolean alreadyExists = user.getFavoriteMovies().stream()
                .anyMatch(m -> m.getId().equals(movie.getId()));

        if (!alreadyExists) {
            user.getFavoriteMovies().add(movie);
            updateUser(user);
        }

        return Optional.of("Movie added to favorites");
    }

    // Remove a favorite movie for a user
    public boolean removeFavoriteMovie(Long userId, Long movieId) {
        Optional<User> userOptional = users.stream()
                .filter(u -> u.getId().equals(userId))
                .findFirst();

        if (userOptional.isEmpty()) {
            return false;
        }

        User user = userOptional.get();
        boolean removed = user.getFavoriteMovies().removeIf(m -> m.getId().equals(movieId));

        if (removed) {
            updateUser(user); // persist changes

                }return removed;
    }

    // Helper method to turn a User into a ProfileResponse
    private ProfileResponse buildProfileResponse(User user) {
        ProfileResponse response = new ProfileResponse();

        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setRole(user.getRole());
        response.setStatus(user.getStatus());

        // Address
        if (user.getAddress() != null) {
            response.setAddress(new AddressResponse(
                    user.getAddress().getStreet(),
                    user.getAddress().getCity(),
                    user.getAddress().getState(),
                    user.getAddress().getZipCode()
            ));
        }

        // Cards
        List<CardResponse> cards = new ArrayList<>();
        for (PaymentCard card : user.getPaymentCards()) {
            cards.add(new CardResponse(
                    card.getId(),
                    card.getCardholderName(),
                    card.getLastFour(),
                    card.getExpirationDate()
            ));
        }
        response.setPaymentCards(cards);

        // Favorites — full 5-arg MovieResponse
        List<MovieResponse> favorites = new ArrayList<>();
        for (Movie movie : user.getFavoriteMovies()) {
            Double rating = null;
            try {
                rating = movie.getRating() != null ? Double.valueOf(movie.getRating()) : null;
            } catch (NumberFormatException e) {
                rating = null;
            }

            favorites.add(new MovieResponse(
                    movie.getId(),
                    movie.getTitle(),
                    movie.getPosterPath(),
                    movie.getGenre(),
                    movie.getRating()
            ));
        }
        response.setFavoriteMovies(favorites);

        return response;
    }
}
