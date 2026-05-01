package com.team20ces.moviebooking.facade;

import com.team20ces.moviebooking.dto.*;
import com.team20ces.moviebooking.model.Movie;
import com.team20ces.moviebooking.model.User;
import com.team20ces.moviebooking.service.EmailService;
import com.team20ces.moviebooking.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserFacade {

    private final UserService userService;
    private final EmailService emailService;

    public UserFacade(UserService userService,
                      EmailService emailService) {
        this.userService = userService;
        this.emailService = emailService;
    }

    public UserProfileResponse getProfile(Long userId) {
        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserProfileResponse(user);
    }

    public UserProfileResponse updateProfile(Long userId, UserProfileUpdate req) {

        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (req.getFirstName() != null) user.setFirstName(req.getFirstName());
        if (req.getLastName() != null) user.setLastName(req.getLastName());
        if (req.getPhoneNumber() != null) user.setPhoneNumber(req.getPhoneNumber());

        // address update
        if (req.getAddress() != null) {
            if (user.getAddress() == null) {
                user.setAddress(new com.team20ces.moviebooking.model.Address());
            }

            var addr = user.getAddress();
            var reqAddr = req.getAddress();

            if (reqAddr.getStreet() != null) addr.setStreet(reqAddr.getStreet());
            if (reqAddr.getCity() != null) addr.setCity(reqAddr.getCity());
            if (reqAddr.getState() != null) addr.setState(reqAddr.getState());
            if (reqAddr.getZipCode() != null) addr.setZipCode(reqAddr.getZipCode());
        }

        // password change (optional)
        if (req.getCurrentPassword() != null && req.getNewPassword() != null) {
            if (!user.getPasswordHash().equals(req.getCurrentPassword())) {
                throw new RuntimeException("Current password incorrect");
            }
            user.setPasswordHash(req.getNewPassword());
        }

        userService.updateUser(user);

        return new UserProfileResponse(user);
    }


    public AddressResponse updateAddress(Long userId, AddressRequest req) {

        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        com.team20ces.moviebooking.model.Address address =
                user.getAddress() == null ? new com.team20ces.moviebooking.model.Address()
                        : user.getAddress();

        address.setStreet(req.getStreet());
        address.setCity(req.getCity());
        address.setState(req.getState());
        address.setZipCode(req.getZipCode());

        user.setAddress(address);
        userService.updateUser(user);

        return new AddressResponse(
                address.getStreet(),
                address.getCity(),
                address.getState(),
                address.getZipCode()
        );
    }

    public CardResponse addCard(Long userId, PaymentCardRequest req) {
        return userService.addPaymentCard(userId, req)
                .orElseThrow(() -> new RuntimeException("Failed to add card"));
    }

    public String removeCard(Long userId, Long cardId) {
        return userService.removePaymentCard(userId, cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));
    }

    public List<MovieResponse> getFavorites(Long userId) {
        return userService.getFavoriteMovies(userId);
    }

    public String addFavorite(Long userId, Movie movie) {
        return userService.addFavoriteMovie(userId, movie)
                .orElseThrow(() -> new RuntimeException("Failed to add favorite"));
    }

    public boolean removeFavorite(Long userId, Long movieId) {
        return userService.removeFavoriteMovie(userId, movieId);
    }

    public void sendProfileUpdateEmail(User user) {
        emailService.sendEmail(
                user.getEmail(),
                "Profile Updated",
                "<h2>Your profile was updated successfully</h2>"
        );
    }
}