package com.team20ces.moviebooking.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO used when admin creates a movie.
 * This matches the JSON body from the frontend/Postman.
 */
public class MovieCreateRequest {

    private String title;
    private String description;
    private String rating;
    private String genre;

    @JsonProperty("duration_mins")
    private Integer durationMins;

    @JsonProperty("poster_path")
    private String posterPath;

    @JsonProperty("trailer_path")
    private String trailerPath;

    private String status;

    @JsonProperty("release_date")
    private String releaseDate;

    public MovieCreateRequest() {}

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public Integer getDurationMins() {
        return durationMins;
    }

    public void setDurationMins(Integer durationMins) {
        this.durationMins = durationMins;
    }

    public String getPosterPath() {
        return posterPath;
    }

    public void setPosterPath(String posterPath) {
        this.posterPath = posterPath;
    }

    public String getTrailerPath() {
        return trailerPath;
    }

    public void setTrailerPath(String trailerPath) {
        this.trailerPath = trailerPath;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(String releaseDate) {
        this.releaseDate = releaseDate;
    }
}