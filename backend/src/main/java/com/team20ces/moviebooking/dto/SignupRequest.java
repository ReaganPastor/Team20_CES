package com.team20ces.moviebooking.dto;

public class SignupRequest {

    private String username;
    private String email;
    private String password;
    private String role;
    private boolean receivePromotions;

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPassword() {
        return password;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }

    public boolean isReceivePromotions() {
        return receivePromotions;
    }

    public void setReceivePromotions(boolean receivePromotions) {
        this.receivePromotions = receivePromotions;
    }
}
