package com.team20ces.moviebooking.model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class User {
    private Long id;
    private String username;
    private String email;
    private String passwordHash;
    private String role;
    private String status;
    private String verificationToken;
    private String resetToken;

    // New login token field
    private String loginToken;

    // Editable profile fields
    private String firstName;
    private String lastName;
    private String phoneNumber;

    // One saved address per user
    private Address address;

    // Up to 3 saved payment cards
    private List<PaymentCard> paymentCards = new ArrayList<>();

    // Favorite movies
    private List<Movie> favoriteMovies = new ArrayList<>();

    // Updated constructor to include loginToken
    public User(Long id, String username, String email, String passwordHash, String role, String status, String loginToken) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        this.status = status;
        this.verificationToken = null;
        this.resetToken = null;
        this.loginToken = loginToken;
    }

    // Existing getters and setters
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
    public String getRole() { return role; }
    public String getStatus() { return status; }
    public String getVerificationToken() { return verificationToken; }
    public String getResetToken() { return resetToken; }
    public String getLoginToken() { return loginToken; }  // new getter

    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public void setStatus(String status) { this.status = status; }
    public void setVerificationToken(String verificationToken) { this.verificationToken = verificationToken; }
    public void setResetToken(String resetToken) { this.resetToken = resetToken; }
    public void setLoginToken(String loginToken) { this.loginToken = loginToken; }  // new setter

    // Editable profile fields
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    // Address
    public Address getAddress() { return address; }
    public void setAddress(Address address) { this.address = address; }

    // Payment cards
    public List<PaymentCard> getPaymentCards() { return paymentCards; }
    public void setPaymentCards(List<PaymentCard> paymentCards) { this.paymentCards = paymentCards; }

    // Favorite movies
    public List<Movie> getFavoriteMovies() { return favoriteMovies; }
    public void setFavoriteMovies(List<Movie> favoriteMovies) { this.favoriteMovies = favoriteMovies; }
}