package com.team20ces.moviebooking.service;

import com.team20ces.moviebooking.dto.ShowtimeCreateRequest;
import com.team20ces.moviebooking.dto.ShowtimeResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;


import java.sql.Date;
import java.sql.Time;
import java.time.LocalTime;
import java.util.List;

/**
 * Service layer for showtime-related database operations.
 */
@Service
public class ShowtimeService {

    private final JdbcTemplate jdbcTemplate;

    public ShowtimeService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static final List<String> TIME_SLOTS = List.of(
        "10:00", "10:30", "11:00", "11:30",
        "12:00", "12:30", "13:00", "13:30",
        "14:00", "14:30", "15:00", "15:30",
        "16:00", "16:30", "17:00", "17:30",
        "18:00", "18:30", "19:00", "19:30",
        "20:00", "20:30", "21:00", "21:30",
        "22:00"
    );

    /**
     * Checks whether the given movie exists.
     */
    public boolean movieExists(Long movieId) {
        Integer count = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM movies WHERE id = ?",
            Integer.class,
            movieId
        );
        return count != null && count > 0;
    }

    /**
     * Checks whether the given showroom exists.
     */
    public boolean showroomExists(Long showroomId) {
        Integer count = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM showrooms WHERE id = ?",
            Integer.class,
            showroomId
        );
        return count != null && count > 0;
    }

    /**
     * Gets the duration of a movie in minutes.
     * Used to calculate end time for a show.
     */
    public int getMovieDuration(Long movieId) {
        Integer duration = jdbcTemplate.queryForObject(
            "SELECT duration_mins FROM movies WHERE id = ?",
            Integer.class,
            movieId
        );
        return duration == null ? 0 : duration;
    }

    /**
     * Checks if a new showtime overlaps with an existing one
     * in the same showroom on the same date.
     */
    public boolean hasSchedulingConflict(Long showroomId, Date showDate, Time startTime, Time endTime) {
        Integer count = jdbcTemplate.queryForObject(
            """
            SELECT COUNT(*)
            FROM shows
            WHERE showroom_id = ?
              AND show_date = ?
              AND (? < end_time AND ? > start_time)
            """,
            Integer.class,
            showroomId, showDate, startTime, endTime
        );
        return count != null && count > 0;
    }

    /**
     * Inserts a showtime into the database and returns the created object.
     */
    public ShowtimeResponse addShowtime(ShowtimeCreateRequest req) {
        Date showDate = Date.valueOf(req.getShowDate());

        // Accepts either HH:mm or HH:mm:ss
        LocalTime parsedStart = LocalTime.parse(
            req.getStartTime().length() == 5 ? req.getStartTime() + ":00" : req.getStartTime()
        );

        int duration = getMovieDuration(req.getMovieId());
        LocalTime parsedEnd = parsedStart.plusMinutes(duration);

        Time startTime = Time.valueOf(parsedStart);
        Time endTime = Time.valueOf(parsedEnd);

        String sql = """
            INSERT INTO shows (movie_id, showroom_id, show_date, start_time, end_time)
            VALUES (?, ?, ?, ?, ?)
            RETURNING id, movie_id, showroom_id, show_date, start_time, end_time
            """;

        return jdbcTemplate.queryForObject(
            sql,
            (rs, rowNum) -> {
                Long movieId = rs.getLong("movie_id");

                String movieTitle = jdbcTemplate.queryForObject(
                    "SELECT title FROM movies WHERE id = ?",
                    String.class,
                    movieId
                );

                return new ShowtimeResponse(
                    rs.getLong("id"),
                    movieId,
                    movieTitle,
                    rs.getLong("showroom_id"),
                    rs.getDate("show_date").toString(),
                    rs.getTime("start_time").toString(),
                    rs.getTime("end_time").toString()
                );
            },
            req.getMovieId(),
            req.getShowroomId(),
            showDate,
            startTime,
            endTime
        );
    }

    public List<ShowtimeResponse> getShowtimesByShowroom(Long showroomId) {

        String sql = """
            SELECT id, movie_id, showroom_id, show_date, start_time, end_time
            FROM shows
            WHERE showroom_id = ?
            ORDER BY show_date, start_time
        """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {

            Long movieId = rs.getLong("movie_id");

            String movieTitle = jdbcTemplate.queryForObject(
                "SELECT title FROM movies WHERE id = ?",
                String.class,
                movieId
            );

            return new ShowtimeResponse(
                rs.getLong("id"),
                movieId,
                movieTitle,
                rs.getLong("showroom_id"),
                rs.getDate("show_date").toString(),
                rs.getTime("start_time").toString(),
                rs.getTime("end_time").toString()
            );
        }, showroomId);
    }

    public List<String> getTimeSlots() {
        return TIME_SLOTS;
    }

    // 👇 ADD THIS METHOD HERE
    public List<String> getEndTimesAfter(String startTime) {

        LocalTime start = LocalTime.parse(startTime);

        return TIME_SLOTS.stream()
            .map(LocalTime::parse)
            .filter(t -> t.isAfter(start))
            .map(LocalTime::toString)
            .toList();
    }
    
    public List<String> getAvailableStartTimes(Long showroomId, String showDate) {

        Date date = Date.valueOf(showDate);

        // get all existing shows for that room + date
        String sql = """
            SELECT start_time, end_time
            FROM shows
            WHERE showroom_id = ?
            AND show_date = ?
        """;

        List<TimeRange> existingShows = jdbcTemplate.query(
            sql,
            (rs, rowNum) -> new TimeRange(
                rs.getTime("start_time").toLocalTime(),
                rs.getTime("end_time").toLocalTime()
            ),
            showroomId,
            date
        );

        return TIME_SLOTS.stream()
            .map(LocalTime::parse)
            .filter(slot -> {

                // check if slot overlaps ANY existing show
                for (TimeRange show : existingShows) {
                    if (!slot.isBefore(show.end()) && slot.isBefore(show.start())) {
                        return false;
                    }

                    boolean overlaps =
                        slot.equals(show.start()) ||
                        (slot.isAfter(show.start()) && slot.isBefore(show.end()));

                    if (overlaps) return false;
                }

                return true;
            })
            .map(LocalTime::toString)
            .toList();
    }

    private static record TimeRange(LocalTime start, LocalTime end) {}
}