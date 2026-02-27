package com.team20ces.moviebooking.model;

public class Movie {

    private Long id;
    private String title;
    private String description;
    private String rating;
    private String genre;
    private String poster_path;
    private String trailer_path;
    private String status;

    public Movie() {}

    public Movie(Long id,
                 String title,
                 String description,
                 String rating,
                 String genre,
                 String poster_path,
                 String trailer_path,
                 String status) {

        this.id = id;
        this.title = title;
        this.description = description;
        this.rating = rating;
        this.genre = genre;
        this.poster_path = poster_path;
        this.trailer_path = trailer_path;
        this.status = status;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getRating() { return rating; }
    public String getGenre() { return genre; }
    public String getPosterPath() { return poster_path; }
    public String getTrailerPath() { return trailer_path; }
    public String getStatus() { return status; }

    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setRating(String rating) { this.rating = rating; }
    public void setGenre(String genre) { this.genre = genre; }
    public void setPosterPath(String posterPath) { this.poster_path = posterPath; }
    public void setTrailerPath(String trailerPath) { this.trailer_path = trailerPath; }
    public void setStatus(String status) { this.status = status; }
}