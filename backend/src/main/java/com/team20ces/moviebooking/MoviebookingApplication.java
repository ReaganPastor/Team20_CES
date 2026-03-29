package com.team20ces.moviebooking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class MoviebookingApplication {
    public static void main(String[] args) {
        SpringApplication.run(MoviebookingApplication.class, args);
    }
}