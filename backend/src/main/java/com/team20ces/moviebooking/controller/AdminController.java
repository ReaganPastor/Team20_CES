package com.team20ces.moviebooking.controller;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;

import java.util.Map;
import java.util.List;


@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @GetMapping("/dashboard")
    public ResponseEntity<?> getAdminMenu() {
        return ResponseEntity.ok(Map.of(
            "menu", List.of(
                "Manage Movies",
                "Promotions",
                "Users",
                "Showtimes"
            )
        ));
    }
}