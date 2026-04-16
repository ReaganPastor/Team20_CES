package com.team20ces.moviebooking.dto;

public class ShowSeatResponse {

    private Long showSeatId;
    private String seatRow;
    private int seatNumber;
    private String seatType;
    private boolean isReserved;

    public ShowSeatResponse(Long showSeatId, String seatRow, int seatNumber, String seatType, boolean isReserved) {
        this.showSeatId = showSeatId;
        this.seatRow = seatRow;
        this.seatNumber = seatNumber;
        this.seatType = seatType;
        this.isReserved = isReserved;
    }

    public Long getShowSeatId() { return showSeatId; }
    public String getSeatRow() { return seatRow; }
    public int getSeatNumber() { return seatNumber; }
    public String getSeatType() { return seatType; }
    public boolean isReserved() { return isReserved; }
}