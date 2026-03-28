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

        // Validate required fields
        if (req.getUsername() == null || req.getUsername().isEmpty() ||
            req.getEmail() == null || req.getEmail().isEmpty() ||
            req.getPassword() == null || req.getPassword().isEmpty()) {

            return ResponseEntity.badRequest().body(Map.of("error", "Fill all fields"));
        }

        // Check if username or email already exists
        if (userService.findByUsername(req.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already taken"));
        }
        if (userService.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
        }

        // Generate new ID
        long newId = userService.getAllUsers().stream()
                .mapToLong(User::getId)
                .max()
                .orElse(0L) + 1;

        // Create new User object
        User newUser = new User(
                newId,
                req.getUsername(),
                req.getEmail(),
                encoder.encode(req.getPassword()),
                (req.getRole() == null || req.getRole().isEmpty() ? "user" : req.getRole()),
                "unverified"
        );

        // Generate unique verification token
        String token = UUID.randomUUID().toString();
        newUser.setVerificationToken(token);

        // Add user to in-memory list
        userService.getAllUsers().add(newUser);

        // Send verification email
        String verificationLink = "http://localhost:8080/api/auth/verify?token=" + token;

        String emailBody = "<!DOCTYPE html>" +
                "<html>" +
                "<body style='font-family:Arial,sans-serif;color:#f1f5f9;background-color:#0a0f22;padding:20px;'>" +
                "<p>Hi " + newUser.getUsername() + ",</p>" +
                "<p>Thank you for signing up! Please verify your account by copying and pasting the following URL into your browser:</p>" +
                "<p style='color:#2563eb;'>" + verificationLink + "</p>" +
                "<p>Welcome aboard!</p>" +
                "</body>" +
                "</html>";

        emailService.sendEmail(
                newUser.getEmail(),
                "Verify Your Account",
                emailBody
        );

        // Return success message
        return ResponseEntity.ok(Map.of(
                "message", "User registered successfully. Please check your email to verify the account"
        ));
    }

    // ---------- VERIFY EMAIL ----------
    @GetMapping("/verify")
    public ResponseEntity<Void> verifyEmail(@RequestParam String token) {
        Optional<User> userOpt = userService.findByVerificationToken(token);

        if (userOpt.isEmpty()) {
            // Redirect to a generic error page in React
            return ResponseEntity.status(302)
                    .header("Location", "http://localhost:3000/email-verified?status=error")
                    .build();
        }

        User user = userOpt.get();
        user.setStatus("verified");
        user.setVerificationToken(null);

        // Redirect to React page with success status
        return ResponseEntity.status(302)
                .header("Location", "http://localhost:3000/email-verified?status=success&username=" + user.getUsername())
                .build();
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

    // ---------- FORGOT PASSWORD ----------
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }

        Optional<User> userOpt = userService.findByEmail(email);
        if (userOpt.isEmpty()) {
            // Don't reveal that email doesn't exist for security
            return ResponseEntity.ok(Map.of("message", "If that email exists, a reset link has been sent"));
        }

        User user = userOpt.get();

        // Generate reset token
        String token = UUID.randomUUID().toString();
        user.setResetToken(token);

        // Email link to React page
        String resetLink = "http://localhost:3000/reset-password?token=" + token + "&email=" + user.getEmail();

        String emailBody = "<!DOCTYPE html>" +
                "<html>" +
                "<body style='font-family:Arial,sans-serif;color:#f1f5f9;background-color:#0a0f22;padding:20px;'>" +
                "<p>Hi " + user.getUsername() + ",</p>" +
                "<p>We received a request to reset your password. Click the link below to set a new password:</p>" +
                "<p style='color:#2563eb;'><a href='" + resetLink + "'>Reset Password</a></p>" +
                "<p>If you didn't request this, please ignore this email.</p>" +
                "</body>" +
                "</html>";

        emailService.sendEmail(
                user.getEmail(),
                "Reset Your Password",
                emailBody
        );

        return ResponseEntity.ok(Map.of("message", "If that email exists, a reset link has been sent"));
    }

    // ---------- RESET PASSWORD ----------
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        String token = req.get("token");
        String newPassword = req.get("newPassword");

        if (email == null || token == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing required fields"));
        }

        Optional<User> userOpt = userService.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid token or email"));
        }

        User user = userOpt.get();

        if (!token.equals(user.getResetToken())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid token"));
        }

        // Update password and clear token
        user.setPasswordHash(encoder.encode(newPassword));
        user.setResetToken(null);

        return ResponseEntity.ok(Map.of("message", "Password updated successfully! You can now log in."));
    }
}