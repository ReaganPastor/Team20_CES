package com.team20ces.moviebooking.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {

    // Password encoder for user registration/login
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Security rules
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        /*http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for REST API
            .cors()                        // Allow CORS (frontend requests)
            .and()
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/movies/**").permitAll()
                // Allow all methods (GET/POST/PUT/DELETE) on profile
                .requestMatchers("/profile/**").permitAll()
                // Everything else requires authentication
                .anyRequest().authenticated()
            )
            .formLogin(form -> form.disable()); // Disable default login form
        */
       http
            .csrf().disable() // for testing only
            .authorizeRequests()
            .anyRequest().permitAll();
        return http.build();
    }
}