package com.team20ces.moviebooking.model;

public class PaymentCard {

    private Long id;
    private Long customerId;
    private String cardholderName;
    private String encryptedCardNumber;
    private String encryptedCvv;
    private String expirationDate;
    private String lastFour;
    private String cardBrand;      
    private String billingAddress;

    public PaymentCard() {
}

    public PaymentCard(Long id, Long customerId, String cardholderName,
                       String encryptedCardNumber, String encryptedCvv,
                       String expirationDate, String lastFour,
                       String cardBrand, String billingAddress) {
        this.id = id;
        this.customerId = customerId;
        this.cardholderName = cardholderName;
        this.encryptedCardNumber = encryptedCardNumber;
        this.encryptedCvv = encryptedCvv;
        this.expirationDate = expirationDate;
        this.lastFour = lastFour;
        this.cardBrand = cardBrand;
        this.billingAddress = billingAddress;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCardholderName() { return cardholderName; }
    public void setCardholderName(String cardholderName) { this.cardholderName = cardholderName; }

    public String getEncryptedCardNumber() { return encryptedCardNumber; }
    public void setEncryptedCardNumber(String encryptedCardNumber) { this.encryptedCardNumber = encryptedCardNumber; }

    public String getEncryptedCvv() { return encryptedCvv; }
    public void setEncryptedCvv(String encryptedCvv) { this.encryptedCvv = encryptedCvv; }

    public String getExpirationDate() { return expirationDate; }
    public void setExpirationDate(String expirationDate) { this.expirationDate = expirationDate; }

    public String getLastFour() { return lastFour; }
    public void setLastFour(String lastFour) { this.lastFour = lastFour; }

    public String getCardBrand() { return cardBrand; }
    public void setCardBrand(String cardBrand) { this.cardBrand = cardBrand; }

    public String getBillingAddress() { return billingAddress; }
    public void setBillingAddress(String billingAddress) { this.billingAddress = billingAddress; }
}