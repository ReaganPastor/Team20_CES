package com.team20ces.moviebooking.model;

public class Movie {

    private Long id;
    private String title;

    // NOW_PLAYING / COMING_SOON
    private String status;
    private String mpaaRating;
    private String genre;
    private String posterUrl;
    private int year;
    private double rating;
    private String description;
    private int durationMinutes;

    // Implement later
    // private String country;
    // private String production;
    // private String cast;

    public Movie() {}

   
    public Movie(Long id, String title, String status,
                 String genre, String mpaaRating, String posterUrl,
                 int year, double rating, String description, int durationMinutes) {

        this.id = id;
        this.title = title;
        this.status = status;
        this.genre = genre;
        this.mpaaRating = mpaaRating;
        this.posterUrl = posterUrl;
        this.year = year;
        this.rating = rating;
        this.description = description;
        this.durationMinutes = durationMinutes;
    }

    // implement later
    /* 
    public Movie(Long id, String title, String status,
                 String genre, String mpaaRating, String posterUrl,
                 int year, double rating, String description, int durationMinutes,
                 String country, String production, String cast) {

        this(id, title, status, genre, mpaaRating, posterUrl, year, rating, description, durationMinutes);
        this.country = country;
        this.production = production;
        this.cast = cast;
    }
   */

    // Getters

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getStatus() { return status; }
    public String getGenre() { return genre; }
    public String getMpaaRating() { return mpaaRating; }
    public String getPosterUrl() { return posterUrl; }
    public int getYear() { return year; }
    public double getRating() { return rating; }
    public String getDescription() { return description; }
    public int getDurationMinutes() { return durationMinutes; }

   // implement later 
   // public String getCountry() { return country; }
   // public String getProduction() { return production; }
   // public String getCast() { return cast; }

    // Setters

    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setStatus(String status) { this.status = status; }
    public void setGenre(String genre) { this.genre = genre; }
    public void setMpaaRating(String mpaaRating) { this.mpaaRating = mpaaRating; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }
    public void setYear(int year) { this.year = year; }
    public void setRating(double rating) { this.rating = rating; }
    public void setDescription(String description) { this.description = description; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }

    // implement later
    // public void setCountry(String country) { this.country = country; }
    // public void setProduction(String production) { this.production = production; }
    // public void setCast(String cast) { this.cast = cast; }
}