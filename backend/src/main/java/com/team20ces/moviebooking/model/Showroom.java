package com.team20ces.moviebooking.model;

public class Showroom {

    private Long id;
    private int showroomNumber;
    private int capacity;
    private String screenType;

    public Showroom() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public int getShowroomNumber() { return showroomNumber; }
    public void setShowroomNumber(int showroomNumber) { this.showroomNumber = showroomNumber; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public String getScreenType() { return screenType; }
    public void setScreenType(String screenType) { this.screenType = screenType; }
}