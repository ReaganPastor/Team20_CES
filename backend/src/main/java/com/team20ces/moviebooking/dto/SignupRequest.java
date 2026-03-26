package com.team20ces.moviebooking.dto;

public class SignupRequest {
    private String username;
    private String email;
    private String password;
    private String role;
    
    public String setUsername(String username) { this.username = username; return username; }
    public String getUsername() { return username; }
    public String setEmail(String email) { this.email = email; return email; }
    public String getEmail() { return email; }
    public String setPassword(String password) { this.password = password; return password; }
    public String getPassword() { return password; }
    public String setRole(String role) { this.role = role; return role; }
    public String getRole() { return role; }
}