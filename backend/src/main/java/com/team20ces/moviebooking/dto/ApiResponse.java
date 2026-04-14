package com.team20ces.moviebooking.dto;

/**
 * Generic wrapper for API responses.
 * This helps the frontend always receive the same structure.
 */
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;

    // Empty constructor required for Java objects 
    public ApiResponse() {}

    // Main constructor used in controllers
    public ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}