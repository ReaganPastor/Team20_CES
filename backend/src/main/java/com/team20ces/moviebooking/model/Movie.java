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

    
    // added because get/setDurationMinutes was using a field that did not exist
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
        this.description = description;
        this.rating = String.valueOf(rating);
        this.genre = genre;
        this.poster_path = posterUrl;
        this.trailer_path = null;
        this.status = status;
        this.durationMinutes = durationMinutes;
    }
    
    // added overloaded constructor to match MovieService.java
    public Movie(Long id, String title, String description,
                 String rating, String genre, String poster_path,
                 String trailer_path, String status) {

        this.id = id;
        this.title = title;
        this.description = description;
        this.rating = rating;
        this.genre = genre;
        this.poster_path = poster_path;
        this.trailer_path = trailer_path;
        this.status = status;
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
    public String getDescription() { return description; }
    public int getDurationMinutes() { return durationMinutes; }

   // implement later 
   // public String getCountry() { return country; }
   // public String getProduction() { return production; }
   // public String getCast() { return cast; }

    // Setters
    public String getRating() { return rating; }
    public String getGenre() { return genre; }
    @JsonProperty("poster_path")
    public String getPosterPath() { return poster_path; }
    @JsonProperty("trailer_path")
    public String getTrailerPath() { return trailer_path; }
    public String getStatus() { return status; }

    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }

    // implement later
    // public void setCountry(String country) { this.country = country; }
    // public void setProduction(String production) { this.production = production; }
    // public void setCast(String cast) { this.cast = cast; }
    public void setRating(String rating) { this.rating = rating; }
    public void setGenre(String genre) { this.genre = genre; }
    public void setPosterPath(String posterPath) { this.poster_path = posterPath; }
    public void setTrailerPath(String trailerPath) { this.trailer_path = trailerPath; }
    public void setStatus(String status) { this.status = status; }
}