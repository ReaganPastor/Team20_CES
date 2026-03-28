package com.team20ces.moviebooking.controller;

import com.team20ces.moviebooking.model.User;
import com.team20ces.moviebooking.dto.SignupRequest;
import com.team20ces.moviebooking.service.EmailService;
import com.team20ces.moviebooking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private EmailService emailService;

    // ---------- SIGNUP ----------
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest req) {

        // 1️⃣ Validate required fields
        if (req.getUsername() == null || req.getUsername().isEmpty() ||
            req.getEmail() == null || req.getEmail().isEmpty() ||
            req.getPassword() == null || req.getPassword().isEmpty()) {

            return ResponseEntity.badRequest().body(Map.of("error", "Fill all fields"));
        }

        // 2️⃣ Check if username or email already exists
        if (userService.findByUsername(req.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already taken"));
        }
        if (userService.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
        }

        // 3️⃣ Generate new ID (simulate auto-increment)
        long newId = userService.getAllUsers().stream()
                .mapToLong(User::getId)
                .max()
                .orElse(0L) + 1;

        // 4️⃣ Create new User object
        User newUser = new User(
                newId,
                req.getUsername(),
                req.getEmail(),
                encoder.encode(req.getPassword()), // password hash
                (req.getRole() == null || req.getRole().isEmpty() ? "user" : req.getRole()),
                "unverified" // default status
        );

        // 5️⃣ Add user to in-memory list
        userService.getAllUsers().add(newUser);

        // 6️⃣ Send verification email (asynchronously)
        String verificationLink = "http://localhost:8080/verify?email=" + newUser.getEmail(); // placeholder link
        String emailBody = "Hi " + newUser.getUsername() + ",\n\n" +
                "Please verify your account by clicking the link below:\n" +
                verificationLink;

        emailService.sendEmail(
                newUser.getEmail(),
                "Verify Your Account",
                emailBody
        );

        // 7️⃣ Return success message
        return ResponseEntity.ok(Map.of(
                "message", "User registered successfully. Please verify your email to activate the account"
        ));
    }
}