package com.team20ces.moviebooking.controller;

import org.springframework.web.bind.annotation.*;
import com.team20ces.moviebooking.service.GeminiService;
import com.team20ces.moviebooking.service.MovieService;
import com.team20ces.moviebooking.model.Movie;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AIController {

    private final GeminiService geminiService;
    private final MovieService movieService;

    public AIController(GeminiService geminiService, MovieService movieService) {
        this.geminiService = geminiService;
        this.movieService = movieService;
    }

    @PostMapping("/chat")
    public Map<String, String> chat(@RequestBody Map<String, String> request) {

        String userMessage = request.get("message");

        List<Movie> movies = movieService.getAllMovies()
                .stream()
                .filter(m -> "CURRENTLY_RUNNING".equals(m.getStatus()))
                .toList();

        StringBuilder context = new StringBuilder();

        context.append("You are a movie assistant for a cinema website.\n");
        context.append("Use ONLY the movies listed below.\n\n");
        context.append("MOVIES DATABASE:\n");

        for (Movie m : movies) {
            context.append("- ")
                    .append(m.getTitle())
                    .append(" (")
                    .append(m.getGenre())
                    .append(", ")
                    .append(m.getStatus())
                    .append(")\n");
        }

        context.append("\nUSER QUESTION: ").append(userMessage);

        String reply = geminiService.askGemini(context.toString());

        return Map.of("reply", reply);
    }
}