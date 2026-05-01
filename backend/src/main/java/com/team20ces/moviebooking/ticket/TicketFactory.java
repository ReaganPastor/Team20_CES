package com.team20ces.moviebooking.ticket;

public class TicketFactory {

    public static Ticket createTicket(String ticketType) {
        if (ticketType == null) {
            throw new IllegalArgumentException("Ticket type cannot be null");
        }

        return switch (ticketType.toUpperCase()) {
            case "ADULT" -> new AdultTicket();
            case "CHILD" -> new ChildTicket();
            case "SENIOR" -> new SeniorTicket();
            default -> throw new IllegalArgumentException("Invalid ticket type: " + ticketType);
        };
    }
}