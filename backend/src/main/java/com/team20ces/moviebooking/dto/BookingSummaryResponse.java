package com.team20ces.moviebooking.dto;
import com.team20ces.moviebooking.dto.BookingResponse;
import java.util.List;

public class BookingSummaryResponse {

    private Long bookingId;
    private String movieTitle;
    private String showDate;
    private String startTime;
    private List<String> seats;
    private int ticketCount;
    private double pricePerTicket;
    private double total;

    public BookingSummaryResponse(Long bookingId,
                                  String movieTitle,
                                  String showDate,
                                  String startTime,
                                  List<String> seats,
                                  int ticketCount,
                                  double pricePerTicket,
                                  double total) {
        this.bookingId = bookingId;
        this.movieTitle = movieTitle;
        this.showDate = showDate;
        this.startTime = startTime;
        this.seats = seats;
        this.ticketCount = ticketCount;
        this.pricePerTicket = pricePerTicket;
        this.total = total;
    }

    public Long getBookingId() { return bookingId; }
    public String getMovieTitle() { return movieTitle; }
    public String getShowDate() { return showDate; }
    public String getStartTime() { return startTime; }
    public List<String> getSeats() { return seats; }
    public int getTicketCount() { return ticketCount; }
    public double getPricePerTicket() { return pricePerTicket; }
    public double getTotal() { return total; }
}