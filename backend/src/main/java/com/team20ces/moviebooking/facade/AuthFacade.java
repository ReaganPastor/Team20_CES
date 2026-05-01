package com.team20ces.moviebooking.facade;

import com.team20ces.moviebooking.dto.SignupRequest;
import com.team20ces.moviebooking.model.User;
import com.team20ces.moviebooking.service.EmailService;
import com.team20ces.moviebooking.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class AuthFacade {

    private final UserService userService;
    private final EmailService emailService;
    private final PasswordEncoder encoder;

    public AuthFacade(UserService userService,
                      EmailService emailService,
                      PasswordEncoder encoder) {
        this.userService = userService;
        this.emailService = emailService;
        this.encoder = encoder;
    }

    public Map<String, Object> signup(SignupRequest req) {

        long newId = userService.getAllUsers().stream()
                .mapToLong(User::getId)
                .max()
                .orElse(0L) + 1;

        User user = new User(
                newId,
                req.getUsername(),
                req.getEmail(),
                encoder.encode(req.getPassword()),
                req.getRole() == null ? "user" : req.getRole(),
                "unverified",
                null
        );

        String verificationToken = UUID.randomUUID().toString();
        user.setVerificationToken(verificationToken);

        String loginToken = UUID.randomUUID().toString();
        user.setLoginToken(loginToken);

        userService.getAllUsers().add(user);

        String link = "http://localhost:3000/email-verified?token=" +
                URLEncoder.encode(verificationToken, StandardCharsets.UTF_8);

        emailService.sendEmail(
                user.getEmail(),
                "Verify Account",
                "<h1>Click here:</h1><a href='" + link + "'>Verify</a>"
        );

        return Map.of(
                "message", "User created",
                "token", loginToken,
                "username", user.getUsername()
        );
    }

    public Map<String, Object> login(String username, String password) {

        User user = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!encoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        if (!user.getStatus().equals("verified") && !user.getStatus().equals("active")) {
            throw new RuntimeException("Account not verified");
        }

        String token = UUID.randomUUID().toString();
        user.setLoginToken(token);

        return Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "role", user.getRole(),
                "token", token
        );
    }

    public boolean verifyEmail(String token) {

        Optional<User> userOpt = userService.getAllUsers().stream()
                .filter(u -> token.equals(u.getVerificationToken()))
                .findFirst();

        if (userOpt.isEmpty()) return false;

        User user = userOpt.get();
        user.setStatus("verified");
        user.setVerificationToken(null);

        return true;
    }

    public void sendPasswordReset(User user) {

        String token = UUID.randomUUID().toString();
        user.setResetToken(token);

        String link = "http://localhost:3000/reset-password?token=" + token;

        emailService.sendEmail(
                user.getEmail(),
                "Reset Password",
                "<a href='" + link + "'>Reset Password</a>"
        );
    }
}