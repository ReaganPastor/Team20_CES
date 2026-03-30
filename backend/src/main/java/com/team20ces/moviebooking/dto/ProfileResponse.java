package com.team20ces.moviebooking.dto;

import java.util.List;

// Full profile response sent to frontend
public class ProfileResponse {

    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String role;
    private String status;
    private AddressResponse address;
    private List<CardResponse> paymentCards;
    private List<MovieResponse> favoriteMovies;

    public ProfileResponse() {
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getRole() {
        return role;
    }

    public String getStatus() {
        return status;
    }

    public AddressResponse getAddress() {
        return address;
    }

    public List<CardResponse> getPaymentCards() {
        return paymentCards;
    }

    public List<MovieResponse> getFavoriteMovies() {
        return favoriteMovies;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setAddress(AddressResponse address) {
        this.address = address;
    }

    public void setPaymentCards(List<CardResponse> paymentCards) {
        this.paymentCards = paymentCards;
    }

    public void setFavoriteMovies(List<MovieResponse> favoriteMovies) {
        this.favoriteMovies = favoriteMovies;
    }
}