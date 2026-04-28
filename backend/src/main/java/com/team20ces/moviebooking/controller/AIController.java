package com.team20ces.moviebooking.controller;

import org.springframework.web.bind.annotation.*;
import com.team20ces.moviebooking.service.GeminiService;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class AIController {

    private final GeminiService geminiService;

    public AIController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/chat")
    public Map<String, String> chat(@RequestBody Map<String, String> request) {

        String userMessage = request.get("message");
        String reply = geminiService.askGemini(userMessage);

        return Map.of("reply", reply);
    }
}