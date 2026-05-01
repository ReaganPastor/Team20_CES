package com.team20ces.moviebooking.ticket;

public class SeniorTicket implements Ticket {
    @Override
    public String getType() {
        return "SENIOR";
    }

    @Override
    public double getPrice() {
        return 10.99;
    }
}