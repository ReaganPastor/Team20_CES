package com.team20ces.moviebooking.dto;

// Response for favorite movie info
public class MovieResponse {

    private Long id;
    private String title;

    public MovieResponse() {
    }

    public MovieResponse(Long id, String title) {
        this.id = id;
        this.title = title;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}