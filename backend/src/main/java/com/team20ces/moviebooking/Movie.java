package com.team20ces.moviebooking;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Movie {
    private Long id;
    private String title;
    private int year;
    private String genre;

    @JsonProperty("posterUrl") // ensures JSON key is posterUrl
    private String posterUrl;

    public Movie(Long id, String title, int year, String genre, String posterUrl) {
        this.id = id;
        this.title = title;
        this.year = year;
        this.genre = genre;
        this.posterUrl = posterUrl; // assign it here
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public int getYear() { return year; }
    public String getGenre() { return genre; }
    public String getPosterUrl() { return posterUrl; }
}