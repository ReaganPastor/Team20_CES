package com.team20ces.moviebooking.dto;

import java.util.List;

public class BookingRequest {

    private Long customerId;
    private Long movieId;
    private Long showId;
    private List<Long> showSeatIds;
    private String email;

    public Long getCustomerId() { return customerId; }
    public Long getMovieId() { return movieId; }
    public Long getShowId() { return showId; }
    public List<Long> getShowSeatIds() { return showSeatIds; }
    public String getEmail() { return email;}

    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public void setMovieId(Long movieId) { this.movieId = movieId; }
    public void setShowId(Long showId) { this.showId = showId; }
    public void setShowSeatIds(List<Long> showSeatIds) { this.showSeatIds = showSeatIds; }
    public void setEmail(String email) { this.email = email; }
}