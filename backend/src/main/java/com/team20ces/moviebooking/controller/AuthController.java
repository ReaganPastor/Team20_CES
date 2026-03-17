package com.team20ces.moviebooking.controller;

import com.team20ces.moviebooking.service.UserService;
import com.team20ces.moviebooking.model.User;
import com.team20ces.moviebooking.dto.LoginRequest;
import com.team20ces.moviebooking.dto.ResetRequest;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder encoder; // Use the Spring bean

    public AuthController(UserService userService, PasswordEncoder encoder) {
        this.userService = userService;
        this.encoder = encoder;
    }

    private Map<String, Long> resetTokens = new HashMap<>();

    // ---------- LOGIN ----------
   @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        System.out.println("Login attempt: " + req.getUsername() + " / " + req.getPassword());
        if (req.getUsername() == null || req.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Fill all fields"));
        }

        Optional<User> userOpt = userService.findByUsername(req.getUsername());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid credentials"));
        }

        User user = userOpt.get();

        // Check user status
        switch (user.getStatus()) {
            case "suspended":
                return ResponseEntity.status(403).body(Map.of("error", "Account suspended"));
            case "unverified":
                return ResponseEntity.status(403).body(Map.of("error", "Please verify your account"));
        }

        // Check password
        if (!encoder.matches(req.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid credentials"));
        }

        // Success! Return role or token if needed
        return ResponseEntity.ok(Map.of("role", user.getRole()));
    }

    // ---------- FORGOT PASSWORD ----------
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String,String> body) {

        String email = body.get("email");
        Optional<User> userOpt = userService.findByEmail(email);

        if (userOpt.isEmpty())
            return ResponseEntity.badRequest().body(Map.of("error","No account with this email"));

        String token = UUID.randomUUID().toString();
        resetTokens.put(token, userOpt.get().getId());

        return ResponseEntity.ok(Map.of(
                "message","Reset token generated",
                "token", token   // demo only
        ));
    }

    // ---------- RESET PASSWORD ----------
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetRequest req) {

        if (!resetTokens.containsKey(req.getToken()))
            return ResponseEntity.badRequest().body(Map.of("error","Invalid token"));

        Long userId = resetTokens.get(req.getToken());

        User user = userService.getAllUsers().stream()
                .filter(u -> u.getId().equals(userId))
                .findFirst()
                .orElse(null);

        if (user == null)
            return ResponseEntity.badRequest().body(Map.of("error","User not found"));

        user.setPasswordHash(encoder.encode(req.getPassword()));
        userService.updateUser(user);

        resetTokens.remove(req.getToken());

        return ResponseEntity.ok(Map.of("message","Password updated"));
    }

    // ---------- TEST: Show all users (temporary, for debugging) ----------
    @GetMapping("/test-users")
    public ResponseEntity<List<User>> testUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
}