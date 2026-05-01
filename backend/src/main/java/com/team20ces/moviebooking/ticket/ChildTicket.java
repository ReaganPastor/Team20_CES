package com.team20ces.moviebooking.ticket;

public class ChildTicket implements Ticket {
    @Override
    public String getType() {
        return "CHILD";
    }

    @Override
    public double getPrice() {
        return 8.99;
    }
}