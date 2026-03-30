package com.team20ces.moviebooking.dto;

// Response sent back with safe card info only
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

    public Long getId() {
        return id;
    }

    public String getCardholderName() {
        return cardholderName;
    }

    public String getLastFour() {
        return lastFour;
    }

    public String getExpirationDate() {
        return expirationDate;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setCardholderName(String cardholderName) {
        this.cardholderName = cardholderName;
    }

    public void setLastFour(String lastFour) {
        this.lastFour = lastFour;
    }

    public void setExpirationDate(String expirationDate) {
        this.expirationDate = expirationDate;
    }
}