package com.team20ces.moviebooking.controller;

import com.team20ces.moviebooking.dto.SignupRequest;
import com.team20ces.moviebooking.model.User;
import com.team20ces.moviebooking.service.EmailService;
import com.team20ces.moviebooking.service.UserService;
import com.team20ces.moviebooking.dto.UserProfileResponse;
import com.team20ces.moviebooking.dto.UserProfileUpdate;
import com.team20ces.moviebooking.model.Address;
import com.team20ces.moviebooking.dto.ChangePasswordRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

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
        newUser.setReceivePromotions(req.isReceivePromotions());

        // Email verification token
        String verificationToken = UUID.randomUUID().toString();
        newUser.setVerificationToken(verificationToken);

        // Login token (temporary)
        String loginToken = UUID.randomUUID().toString();
        newUser.setLoginToken(loginToken);

        // Add to in-memory list
        userService.getAllUsers().add(newUser);

        // Send verification email
        String encodedUsername = URLEncoder.encode(newUser.getUsername(), StandardCharsets.UTF_8);
        String encodedToken = URLEncoder.encode(verificationToken, StandardCharsets.UTF_8);

        String verificationLink = "http://localhost:3000/email-verified?token=" 
            + encodedToken + "&username=" + encodedUsername;

        String emailBody = "<html>" +
            "<body style=\"font-family: Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 0;\">" +
            "  <div style=\"max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">" +
            "    <h2 style=\"color: #1a73e8;\">Welcome to Movie Booking, " + newUser.getUsername() + "!</h2>" +
            "    <p>Thank you for signing up. To complete your registration, please verify your account by clicking the button below:</p>" +
            "    <p style=\"text-align: center; margin: 30px 0;\">" +
            "      <a href=\"" + verificationLink + "\" " +
            "         style=\"background-color: #1a73e8; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;\">Verify Email</a>" +
            "    </p>" +
            "    <p>If the button doesn’t work, copy and paste this URL into your browser:</p>" +
            "    <p style=\"word-break: break-all;\"><a href=\"" + verificationLink + "\" style=\"color: #1a73e8;\">" + verificationLink + "</a></p>" +
            "    <hr style=\"margin: 30px 0; border: none; border-top: 1px solid #ddd;\">" +
            "    <p style=\"color: #555; font-size: 14px;\">If you did not sign up for Movie Booking, you can safely ignore this email.</p>" +
            "  </div>" +
            "</body>" +
            "</html>";

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
        String encodedEmail = URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8);
        String encodedToken = URLEncoder.encode(token, StandardCharsets.UTF_8);

        String resetLink = "http://localhost:3000/reset-password?token=" 
        + encodedToken + "&email=" + encodedEmail;
        
        String emailBody = "<html>" +
            "<body style=\"font-family: Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 0;\">" +
            "  <div style=\"max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">" +
            "    <h2 style=\"color: #1a73e8;\">Password Reset Request</h2>" +
            "    <p>Hi " + user.getUsername() + ",</p>" +
            "    <p>We received a request to reset your password. Click the button below to set a new password:</p>" +
            "    <p style=\"text-align: center; margin: 30px 0;\">" +
            "      <a href=\"" + resetLink + "\" " +
            "         style=\"background-color: #1a73e8; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;\">Reset Password</a>" +
            "    </p>" +
            "    <p>If the button doesn’t work, copy and paste this URL into your browser:</p>" +
            "    <p style=\"word-break: break-all;\"><a href=\"" + resetLink + "\" style=\"color: #1a73e8;\">" + resetLink + "</a></p>" +
            "    <hr style=\"margin: 30px 0; border: none; border-top: 1px solid #ddd;\">" +
            "    <p style=\"color: #555; font-size: 14px;\">If you did not request a password reset, you can safely ignore this email.</p>" +
            "  </div>" +
            "</body>" +
            "</html>";

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

    // ---------- REQUEST PASSWORD CHANGE (for logged-in users) ----------
    @PostMapping("/request-password-change")
    public ResponseEntity<?> requestPasswordChange(@RequestBody ChangePasswordRequest req) {
        System.out.println("[RequestPasswordChange] Received request for email: " + req.getEmail());

        if (req.getEmail() == null || req.getEmail().isEmpty()) {
            System.err.println("[RequestPasswordChange] Email is missing in request");
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }

        // Look up user by email
        Optional<User> optionalUser = userService.findByEmail(req.getEmail());
        if (optionalUser.isEmpty()) {
            System.err.println("[RequestPasswordChange] No user found with email: " + req.getEmail());
            return ResponseEntity.badRequest().body(Map.of("error", "No user with this email"));
        }

        User user = optionalUser.get();
        System.out.println("[RequestPasswordChange] Found user: " + user.getUsername() + ", email: " + user.getEmail());

        // Generate a secure token for password reset
        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken); // store in user object / DB
        System.out.println("[RequestPasswordChange] Generated reset token: " + resetToken);

        // Encode for URL
        String encodedEmail = URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8);
        String encodedToken = URLEncoder.encode(resetToken, StandardCharsets.UTF_8);

        // Build frontend reset password link
        //String resetLink = "http://localhost:3000/reset-password?token=" + encodedToken + "&email=" + encodedEmail;
        String resetLink = "http://localhost:3000/change-password?token=" + encodedToken + "&email=" + encodedEmail;
        System.out.println("[RequestPasswordChange] Reset link: " + resetLink);

        // Build HTML email matching signup style
        String emailBody = "<html>" +
            "<body style=\"font-family: Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 0;\">" +
            "  <div style=\"max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">" +
            "    <h2 style=\"color: #1a73e8;\">Reset Your Password, " + user.getUsername() + "!</h2>" +
            "    <p>You requested a password reset. Click the button below to set a new password:</p>" +
            "    <p style=\"text-align: center; margin: 30px 0;\">" +
            "      <a href=\"" + resetLink + "\" " +
            "         style=\"background-color: #1a73e8; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;\">Reset Password</a>" +
            "    </p>" +
            "    <p>If the button doesn’t work, copy and paste this URL into your browser:</p>" +
            "    <p style=\"word-break: break-all;\"><a href=\"" + resetLink + "\" style=\"color: #1a73e8;\">" + resetLink + "</a></p>" +
            "    <hr style=\"margin: 30px 0; border: none; border-top: 1px solid #ddd;\">" +
            "    <p style=\"color: #555; font-size: 14px;\">If you did not request a password reset, you can safely ignore this email.</p>" +
            "  </div>" +
            "</body>" +
            "</html>";

        // Send email
        try {
            System.out.println("[RequestPasswordChange] Sending password reset email to: " + user.getEmail());
            emailService.sendEmail(user.getEmail(), "Reset Your Password", emailBody);
            System.out.println("[RequestPasswordChange] Email send initiated successfully");
        } catch (Exception e) {
            System.err.println("[RequestPasswordChange] Failed to send email: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to send password reset email"));
        }

        return ResponseEntity.ok(Map.of("message", "Password reset email sent successfully"));
    }

    // ---------- CHANGE PASSWORD (logged-in users) ----------
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> req) {

        String token = req.get("token");
        String email = req.get("email");
        String newPassword = req.get("newPassword");

        System.out.println("[ChangePassword] email=" + email);

        if (token == null || email == null || newPassword == null || newPassword.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Missing required fields"));
        }

        // Find user by email
        Optional<User> userOpt = userService.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();

        // Validate reset token
        if (user.getResetToken() == null || !user.getResetToken().equals(token)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid or expired token"));
        }

        // Update password
        user.setPasswordHash(encoder.encode(newPassword));

        // Clear token so it can't be reused
        user.setResetToken(null);

        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
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