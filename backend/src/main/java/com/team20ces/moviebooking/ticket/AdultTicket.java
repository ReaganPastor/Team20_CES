package com.team20ces.moviebooking.ticket;

public class AdultTicket implements Ticket {
    @Override
    public String getType() {
        return "ADULT";
    }

    @Override
    public double getPrice() {
        return 12.99;
    }
}