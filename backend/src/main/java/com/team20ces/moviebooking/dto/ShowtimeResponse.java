package com.team20ces.moviebooking.dto;

/**
 * DTO returned after a showtime is successfully created.
 * This gives the frontend a clean response object.
 */
public class ShowtimeResponse {

    private Long id;
    private Long movieId;
    private String movieTitle;
    private Long showroomId;
    private String showDate;
    private String startTime;
    private String endTime;

    public ShowtimeResponse() {}

    public ShowtimeResponse(Long id, Long movieId, String movieTitle,
                            Long showroomId, String showDate,
                            String startTime, String endTime) {
        this.id = id;
        this.movieId = movieId;
        this.movieTitle = movieTitle;
        this.showroomId = showroomId;
        this.showDate = showDate;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public Long getId() {
        return id;
    }

    public Long getMovieId() {
        return movieId;
    }

    public String getMovieTitle() {
        return movieTitle;
    }

    public Long getShowroomId() {
        return showroomId;
    }

    public String getShowDate() {
        return showDate;
    }

    public String getStartTime() {
        return startTime;
    }

    public String getEndTime() {
        return endTime;
    }
}