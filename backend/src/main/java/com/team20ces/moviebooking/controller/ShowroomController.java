package com.team20ces.moviebooking.controller;

import com.team20ces.moviebooking.model.Showroom;
import com.team20ces.moviebooking.service.ShowroomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/showrooms")
@CrossOrigin(origins = "http://localhost:3000")
public class ShowroomController {

    private final ShowroomService showroomService;

    public ShowroomController(ShowroomService showroomService) {
        this.showroomService = showroomService;
    }

    @GetMapping
    public ResponseEntity<List<Showroom>> getAllShowrooms() {
        return ResponseEntity.ok(showroomService.getAllShowrooms());
    }
}