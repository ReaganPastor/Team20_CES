package com.team20ces.moviebooking.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

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
        http
            // Disable CSRF for REST API (token-based auth)
            .csrf().disable()

            // Endpoint authorization
            .authorizeRequests()
                // Public endpoints
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/movies/**").permitAll()
                .requestMatchers("/profile/**").permitAll()
                // Only authenticated users with ROLE_USER can add cards
                .requestMatchers("/api/users/*/cards").hasRole("USER")
                // Everything else requires authentication
                .anyRequest().authenticated()
            .and()
            // Disable default login form (we use REST API + frontend login)
            .formLogin().disable();

        return http.build();
    }

    // CORS configuration for frontend
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000") // frontend URL
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowCredentials(true);
            }
        };
    }
}