package com.team20ces.moviebooking.controller;

import com.team20ces.moviebooking.dto.SignupRequest;
import com.team20ces.moviebooking.model.User;
import com.team20ces.moviebooking.service.EmailService;
import com.team20ces.moviebooking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

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

        // 3️⃣ Generate new ID
        long newId = userService.getAllUsers().stream()
                .mapToLong(User::getId)
                .max()
                .orElse(0L) + 1;

        // 4️⃣ Create new User object
        User newUser = new User(
                newId,
                req.getUsername(),
                req.getEmail(),
                encoder.encode(req.getPassword()),
                (req.getRole() == null || req.getRole().isEmpty() ? "user" : req.getRole()),
                "unverified"
        );

        // 5️⃣ Generate unique verification token
        String token = UUID.randomUUID().toString();
        newUser.setVerificationToken(token);

        // 6️⃣ Add user to in-memory list
        userService.getAllUsers().add(newUser);

        // 7️⃣ Send verification email
        String verificationLink = "http://localhost:8080/api/auth/verify?token=" + token;
        String emailBody = "Hi " + newUser.getUsername() + ",\n\n" +
                "Please verify your account by clicking the link below:\n" +
                verificationLink;

        emailService.sendEmail(
                newUser.getEmail(),
                "Verify Your Account",
                emailBody
        );

        // 8️⃣ Return success message
        return ResponseEntity.ok(Map.of(
                "message", "User registered successfully. Please check your email to verify the account"
        ));
    }

    // ---------- VERIFY EMAIL ----------
    @GetMapping("/verify")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {

        Optional<User> userOpt = userService.findByVerificationToken(token);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid or expired token");
        }

        User user = userOpt.get();

        // mark user as verified
        user.setStatus("verified");

        // clear the token
        user.setVerificationToken(null);

        return ResponseEntity.ok("Email verified successfully!");
    }

    // ---------- GET ALL USERS (for Postman testing) ----------
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // ---------- GET SINGLE USER BY EMAIL (optional) ----------
    @GetMapping("/user")
    public ResponseEntity<?> getUserByEmail(@RequestParam String email) {
        Optional<User> userOpt = userService.findByEmail(email);

        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        } else {
            return ResponseEntity.badRequest().body("User not found");
        }
    }

    // In AuthController.java
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {
        String username = req.get("username");
        String password = req.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing username or password"));
        }

        Optional<User> userOpt = userService.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid username or password"));
        }

        User user = userOpt.get();

        // Check password using encoder
        if (!encoder.matches(password, user.getPasswordHash())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid username or password"));
        }

        // Optional: check if email is verified
        if (!user.getStatus().equals("verified") && !user.getStatus().equals("active")) {
            return ResponseEntity.status(403).body(Map.of("error", "Account not verified"));
        }

        // Return success JSON
        return ResponseEntity.ok(Map.of(
            "role", user.getRole(),
            "username", user.getUsername()
        ));
    }
}