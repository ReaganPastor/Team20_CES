package com.team20ces.moviebooking.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Movie {

    private Long id;
    private String title;
    private String description;
    private String rating;
    private String genre;
    private String poster_path;
    private String trailer_path;
    private String status;


    private int durationMinutes;

    public Movie() {}

    /**
     * Older constructor style already used in your project.
     * Kept for compatibility in case other files still call it.
     */
    public Movie(Long id, String title, String status,
                 String genre, String mpaaRating, String posterUrl,
                 int year, double rating, String description, int durationMinutes) {

        this.id = id;
        this.title = title;
        this.description = description;
        this.rating = String.valueOf(rating);
        this.genre = genre;
        this.poster_path = posterUrl;
        this.trailer_path = null;
        this.status = status;
        this.durationMinutes = durationMinutes;
    }

    /**
     * Main constructor for database queries.
     * Includes durationMinutes so MovieService can map it.
     */
    public Movie(Long id, String title, String description,
                 String rating, String genre, String poster_path,
                 String trailer_path, String status, int durationMinutes) {

        this.id = id;
        this.title = title;
        this.description = description;
        this.rating = rating;
        this.genre = genre;
        this.poster_path = poster_path;
        this.trailer_path = trailer_path;
        this.status = status;
        this.durationMinutes = durationMinutes;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    /**
     * This lets JSON return "duration_mins" to the frontend
     * even though the Java field is named durationMinutes.
     */
    @JsonProperty("duration_mins")
    public int getDurationMinutes() {
        return durationMinutes;
    }

    public String getRating() {
        return rating;
    }

    public String getGenre() {
        return genre;
    }

    @JsonProperty("poster_path")
    public String getPosterPath() {
        return poster_path;
    }

    @JsonProperty("trailer_path")
    public String getTrailerPath() {
        return trailer_path;
    }

    public String getStatus() {
        return status;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @JsonProperty("duration_mins")
    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public void setPosterPath(String posterPath) {
        this.poster_path = posterPath;
    }

    public void setTrailerPath(String trailerPath) {
        this.trailer_path = trailerPath;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}