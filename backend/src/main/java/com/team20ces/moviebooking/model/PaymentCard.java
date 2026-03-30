package com.team20ces.moviebooking.model;

// Simple model class for storing payment card info
public class PaymentCard {

    private Long id;
    private String cardholderName;
    private String encryptedCardNumber;
    private String encryptedCvv;
    private String expirationDate;
    private String lastFour;

    public PaymentCard() {
    }

    public PaymentCard(Long id, String cardholderName, String encryptedCardNumber,
                       String encryptedCvv, String expirationDate, String lastFour) {
        this.id = id;
        this.cardholderName = cardholderName;
        this.encryptedCardNumber = encryptedCardNumber;
        this.encryptedCvv = encryptedCvv;
        this.expirationDate = expirationDate;
        this.lastFour = lastFour;
    }

    public Long getId() {
        return id;
    }

    public String getCardholderName() {
        return cardholderName;
    }

    public String getEncryptedCardNumber() {
        return encryptedCardNumber;
    }

    public String getEncryptedCvv() {
        return encryptedCvv;
    }

    public String getExpirationDate() {
        return expirationDate;
    }

    public String getLastFour() {
        return lastFour;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setCardholderName(String cardholderName) {
        this.cardholderName = cardholderName;
    }

    public void setEncryptedCardNumber(String encryptedCardNumber) {
        this.encryptedCardNumber = encryptedCardNumber;
    }

    public void setEncryptedCvv(String encryptedCvv) {
        this.encryptedCvv = encryptedCvv;
    }

    public void setExpirationDate(String expirationDate) {
        this.expirationDate = expirationDate;
    }

    public void setLastFour(String lastFour) {
        this.lastFour = lastFour;
    }
}