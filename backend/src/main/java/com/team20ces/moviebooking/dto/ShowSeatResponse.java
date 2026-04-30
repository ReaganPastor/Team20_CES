package com.team20ces.moviebooking.dto;

public class ShowSeatResponse {

    private final Long showSeatId;
    private final String seatRow;
    private final int seatNumber;
    private final String seatType;
    private final boolean reserved;
    private final String reservationStatus;

    public ShowSeatResponse(Long showSeatId,
                            String seatRow,
                            int seatNumber,
                            String seatType,
                            boolean reserved,
                            String reservationStatus) {
        this.showSeatId = showSeatId;
        this.seatRow = seatRow;
        this.seatNumber = seatNumber;
        this.seatType = seatType;
        this.reserved = reserved;
        this.reservationStatus = reservationStatus;
    }

    public Long getShowSeatId() {
        return showSeatId;
    }

    public String getSeatRow() {
        return seatRow;
    }

    public int getSeatNumber() {
        return seatNumber;
    }

    public String getSeatType() {
        return seatType;
    }

    public boolean isReserved() {
        return reserved;
    }

    public String getReservationStatus() {
        return reservationStatus;
    }
}