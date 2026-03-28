package com.team20ces.moviebooking.service;

import com.team20ces.moviebooking.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final PasswordEncoder encoder;
    private List<User> users = new ArrayList<>();

    @Autowired
    public UserService(PasswordEncoder encoder) {
        this.encoder = encoder;

        // Test users
        users.add(new User(1L, "admin", "admin@email.com",
                encoder.encode("Admin@123"), "admin", "active"));
        users.add(new User(2L, "user", "user@email.com",
                encoder.encode("User@123"), "user", "active"));
        users.add(new User(3L, "suspended", "s@email.com",
                encoder.encode("Test@123"), "user", "suspended"));
        users.add(new User(4L, "unverified", "u@email.com",
                encoder.encode("Test@123"), "user", "unverified"));
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
}