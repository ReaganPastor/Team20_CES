package com.team20ces.moviebooking.dto;

import com.team20ces.moviebooking.model.Address;
import com.team20ces.moviebooking.model.User;

public class UserProfileResponse {
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private Address address; 
    private Long id;
    
    public UserProfileResponse(User user) {
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.phoneNumber = user.getPhoneNumber();
        this.address = user.getAddress();
        this.id = user.getId();
    }

    // Getters
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getPhoneNumber() { return phoneNumber; }
    public Address getAddress() { return address; }
    public Long getId() { return id; }
}