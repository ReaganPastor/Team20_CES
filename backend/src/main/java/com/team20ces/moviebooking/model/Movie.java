package com.team20ces.moviebooking.model;

/*
 * This class represents a Movie object in our system.
 * This is the "shape" of the movie that gets converted into JSON
 * and sent to the frontend.
 */
public class Movie {

    // Unique identifier for each movie
    private Long id;

    // Movie title (ex: Dune)
    private String title;

    // Status of movie (NOW_PLAYING or COMING_SOON)
    private String status;

    // Movie genre/category (ex: Sci-Fi, Comedy)
    private String genre;

    // Official MPAA rating (PG, PG-13, R, etc.)
    private String mpaaRating;

    // URL for the movie poster image
    private String posterUrl;

    /*
     * Default constructor (required for Spring Boot / JSON mapping)
     */
    public Movie() { }

    /*
     * Constructor to easily create movie objects
     */
    public Movie(Long id, String title, String status,
                 String genre, String mpaaRating, String posterUrl) {

        this.id = id;
        this.title = title;
        this.status = status;
        this.genre = genre;
        this.mpaaRating = mpaaRating;
        this.posterUrl = posterUrl;
    }

    // Getters 

    public Long getId() { return id; }

    public String getTitle() { return title; }

    public String getStatus() { return status; }

    public String getGenre() { return genre; }

    public String getMpaaRating() { return mpaaRating; }

    public String getPosterUrl() { return posterUrl; }

    // Setters

    public void setId(Long id) { this.id = id; }

    public void setTitle(String title) { this.title = title; }

    public void setStatus(String status) { this.status = status; }

    public void setGenre(String genre) { this.genre = genre; }

    public void setMpaaRating(String mpaaRating) { this.mpaaRating = mpaaRating; }

    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }
}