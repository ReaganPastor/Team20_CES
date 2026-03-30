package com.team20ces.moviebooking.controller;

import com.team20ces.moviebooking.dto.SignupRequest;
import com.team20ces.moviebooking.model.User;
import com.team20ces.moviebooking.service.EmailService;
import com.team20ces.moviebooking.service.UserService;
import com.team20ces.moviebooking.dto.UserProfileResponse;
import com.team20ces.moviebooking.dto.UserProfileUpdate;
import com.team20ces.moviebooking.model.Address;
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
        if (req.getUsername() == null || req.getUsername().isEmpty() ||
            req.getEmail() == null || req.getEmail().isEmpty() ||
            req.getPassword() == null || req.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Fill all fields"));
        }

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
            "unverified",
            null
        );

        // Email verification token
        String verificationToken = UUID.randomUUID().toString();
        newUser.setVerificationToken(verificationToken);

        // Login token (temporary)
        String loginToken = UUID.randomUUID().toString();
        newUser.setLoginToken(loginToken);

        // Add to in-memory list
        userService.getAllUsers().add(newUser);

        // Send verification email
        String verificationLink = "http://localhost:3000/email-verified?token=" + verificationToken + "&username=" + newUser.getUsername();
        String emailBody = "<p>Hi " + newUser.getUsername() + ",</p>" +
                "<p>Thank you for signing up! Please verify your account by clicking the link below:</p>" +
                "<a href='" + verificationLink + "'>Verify Email</a>";

        emailService.sendEmail(newUser.getEmail(), "Verify Your Account", emailBody);

        return ResponseEntity.ok(Map.of(
                "message", "User registered successfully. Please check your email to verify the account",
                "token", loginToken,
                "username", newUser.getUsername(),
                "role", newUser.getRole()
        ));
    }

    // ---------- VERIFY EMAIL ----------
    @GetMapping("/verify")
    public ResponseEntity<Void> verifyEmail(@RequestParam String token) {
        Optional<User> userOpt = userService.getAllUsers().stream()
                .filter(u -> token.equals(u.getVerificationToken()) || "verified".equals(u.getStatus()))
                .findFirst();

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(302)
                    .header("Location", "http://localhost:3000/email-verified?status=error")
                    .build();
        }

        User user = userOpt.get();

        if (!"verified".equals(user.getStatus())) {
            user.setStatus("verified");
            user.setVerificationToken(null);
        }

        return ResponseEntity.status(302)
                .header("Location", "http://localhost:3000/email-verified?status=success&username=" + user.getUsername())
                .build();
    }

    // ---------- LOGIN ----------
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

        if (!encoder.matches(password, user.getPasswordHash())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid username or password"));
        }

        if (!user.getStatus().equals("verified") && !user.getStatus().equals("active")) {
            return ResponseEntity.status(403).body(Map.of("error", "Account not verified"));
        }

        // Generate a fresh login token for this session
        String loginToken = UUID.randomUUID().toString();
        user.setLoginToken(loginToken);

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "role", user.getRole(),
                "username", user.getUsername(),
                "token", loginToken
        ));
    }

    // ---------- LOGOUT ----------
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, String> req) {
        String token = req.get("token");
        if (token == null || token.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing token"));
        }

        Optional<User> userOpt = userService.getAllUsers().stream()
                .filter(u -> token.equals(u.getLoginToken()))
                .findFirst();

        userOpt.ifPresent(user -> user.setLoginToken(null));

        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
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
            return ResponseEntity.ok(Map.of("message", "If that email exists, a reset link has been sent"));
        }

        User user = userOpt.get();
        String token = UUID.randomUUID().toString();
        user.setResetToken(token);

        String resetLink = "http://localhost:3000/reset-password?token=" + token + "&email=" + user.getEmail();
        String emailBody = "<p>Hi " + user.getUsername() + ",</p>" +
                "<p>Click here to reset your password:</p>" +
                "<a href='" + resetLink + "'>Reset Password</a>";

        emailService.sendEmail(user.getEmail(), "Reset Your Password", emailBody);

        return ResponseEntity.ok(Map.of("message", "If that email exists, a reset link has been sent"));
    }

    // ---------- RESET PASSWORD ----------
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> req) {
        String token = req.get("token");
        String email = req.get("email");
        String newPassword = req.get("newPassword");

        if (token == null || email == null || newPassword == null || newPassword.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing required fields"));
        }

        Optional<User> userOpt = userService.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();

        if (!token.equals(user.getResetToken())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired reset link"));
        }

        user.setPasswordHash(encoder.encode(newPassword));
        user.setResetToken(null);

        return ResponseEntity.ok(Map.of("message", "Password reset successfully!"));
    }

    // ---------- GET USER FROM TOKEN ----------
    private User getUserFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        String token = authHeader.substring(7);

        return userService.getAllUsers().stream()
                .filter(u -> token.equals(u.getLoginToken()))
                .findFirst()
                .orElse(null);
    }
    
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String authHeader) {
        User user = getUserFromToken(authHeader);
        if (user == null) return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
        return ResponseEntity.ok(new UserProfileResponse(user));
    }

        @PutMapping("/profile/update")
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UserProfileUpdate req
    ) {
        // Get user from token
        User user = getUserFromToken(authHeader);
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
        }

        // Update basic profile fields
        if (req.getFirstName() != null) user.setFirstName(req.getFirstName());
        if (req.getLastName() != null) user.setLastName(req.getLastName());
        if (req.getPhoneNumber() != null) user.setPhoneNumber(req.getPhoneNumber());

        // Ensure Address object exists
        if (user.getAddress() == null) user.setAddress(new Address());

        // Update address safely
        if (req.getAddress() != null) {
            Address reqAddr = req.getAddress();
            Address userAddr = user.getAddress();

            if (reqAddr.getStreet() != null) userAddr.setStreet(reqAddr.getStreet());
            if (reqAddr.getCity() != null) userAddr.setCity(reqAddr.getCity());
            if (reqAddr.getState() != null) userAddr.setState(reqAddr.getState());
            if (reqAddr.getZipCode() != null) userAddr.setZipCode(reqAddr.getZipCode());
        }

        // Handle password change
        if (req.getCurrentPassword() != null && !req.getCurrentPassword().isEmpty() &&
            req.getNewPassword() != null && !req.getNewPassword().isEmpty()) {

            if (!encoder.matches(req.getCurrentPassword(), user.getPasswordHash())) {
                return ResponseEntity.status(400).body(Map.of("error", "Current password is incorrect"));
            }
            user.setPasswordHash(encoder.encode(req.getNewPassword()));
        }

        // Return updated profile
        return ResponseEntity.ok(new UserProfileResponse(user));
    }

    // ---------- GET ALL USERS ----------
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
}