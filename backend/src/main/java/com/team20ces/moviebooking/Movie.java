package com.team20ces.moviebooking;

public class Movie {
    private Long id;
    private String title;
    private int year;
    private String genre;

    public Movie(Long id, String title, int year, String genre) {
        this.id = id;
        this.title = title;
        this.year = year;
        this.genre = genre;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public int getYear() { return year; }
    public String getGenre() { return genre; }
}
