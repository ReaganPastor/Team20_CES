package com.team20ces.moviebooking.model;

public class User {
    private Long id;
    private String username;
    private String email;
    private String passwordHash;
    private String role;
    private String status;
    private String verificationToken;
    private String resetToken;

    public User(Long id, String username, String email, String passwordHash, String role, String status) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        this.status = status;
        this.verificationToken = null;
        this.resetToken = null;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
    public String getRole() { return role; }
    public String getStatus() { return status; }
    public String getVerificationToken() { return verificationToken; }
    public String getResetToken() { return resetToken; }

    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public void setStatus(String status) { this.status = status; }
    public void setVerificationToken(String verificationToken) { this.verificationToken = verificationToken; }
    public void setResetToken(String resetToken) { this.resetToken = resetToken; }
}