package com.team20ces.moviebooking;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Movie {
    private Long id;
    private String title;
    private int year;
    private String genre;

    @JsonProperty("posterUrl") // ensures JSON key is posterUrl
    private String posterUrl;

    // ADDED: rating field
    private double rating;

    // ADDED: description field
    private String description;

    // ADDED: duration in minutes
    private int durationMinutes;

    public Movie(Long id, String title, int year, String genre, String posterUrl,
                 double rating, String description, int durationMinutes) { // ADDED durationMinutes to constructor
        this.id = id;
        this.title = title;
        this.year = year;
        this.genre = genre;
        this.posterUrl = posterUrl; // assign it here

        this.rating = rating; // ADDED
        this.description = description; // ADDED
        this.durationMinutes = durationMinutes; // ADDED
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public int getYear() { return year; }
    public String getGenre() { return genre; }
    public String getPosterUrl() { return posterUrl; }

    // ADDED getter
    public double getRating() { return rating; }

    // ADDED getter
    public String getDescription() { return description; }

    // ADDED getter
    public int getDurationMinutes() { return durationMinutes; }
}