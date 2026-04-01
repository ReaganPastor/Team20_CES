package com.team20ces.moviebooking.dto;

public class CardResponse {

    private Long id;
    private String cardholderName;
    private String lastFour;
    private String expirationDate;

    public CardResponse() {
    }

    public CardResponse(Long id, String cardholderName, String lastFour, String expirationDate) {
        this.id = id;
        this.cardholderName = cardholderName;
        this.lastFour = lastFour;
        this.expirationDate = expirationDate;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCardholderName() { return cardholderName; }
    public void setCardholderName(String cardholderName) { this.cardholderName = cardholderName; }

    public String getLastFour() { return lastFour; }
    public void setLastFour(String lastFour) { this.lastFour = lastFour; }

    public String getExpirationDate() { return expirationDate; }
    public void setExpirationDate(String expirationDate) { this.expirationDate = expirationDate; }
}