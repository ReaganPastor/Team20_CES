package com.team20ces.moviebooking.dto;

public class MovieResponse {
    private Long id;
    private String title;
    private String posterPath;
    private String genre;
    private String rating; // <- was Double, now String

    public MovieResponse() {
    }

    public MovieResponse(Long id, String title, String posterPath, String genre, String rating) {
        this.id = id;
        this.title = title;
        this.posterPath = posterPath;
        this.genre = genre;
        this.rating = rating;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getPosterPath() { return posterPath; }
    public void setPosterPath(String posterPath) { this.posterPath = posterPath; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public String getRating() { return rating; }
    public void setRating(String rating) { this.rating = rating; }
}