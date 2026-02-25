package com.team20ces.moviebooking;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class MovieController {

    private final List<Movie> mockMovies = Arrays.asList(
        new Movie(1L, "Inception", 2010, "Sci-Fi", "https://m.media-amazon.com/images/I/51s+Z3kz2bL._AC_.jpg",
            8.8, "A thief who steals secrets through dream-sharing technology is given a chance to erase his past by planting an idea.", 148),
        new Movie(2L, "Titanic", 1997, "Romance", "https://m.media-amazon.com/images/I/41hK8S+RZBL._AC_.jpg",
            7.9, "A romance blooms aboard the Titanic between two passengers from different worlds as disaster strikes.", 195),
        new Movie(3L, "Avatar", 2009, "Sci-Fi", "https://m.media-amazon.com/images/I/41kTVLeW1CL._AC_.jpg",
            7.9, "A former marine is torn between orders and protecting Pandora, the world he comes to call home.", 162),
        new Movie(4L, "Interstellar", 2014, "Sci-Fi", "https://m.media-amazon.com/images/I/71nM+FVRQdL._AC_SL1181_.jpg",
            8.7, "Explorers travel through a wormhole to find a new home for humanity as Earth becomes uninhabitable.", 169),
        new Movie(5L, "Jaws", 1975, "Thriller", "https://m.media-amazon.com/images/I/51t30H2PEyL._AC_.jpg",
            8.1, "A great white shark terrorizes a beach town, forcing an urgent hunt to stop it.", 124),
        new Movie(6L, "La La Land", 2016, "Romance", "https://m.media-amazon.com/images/I/51Plls7NTaL._AC_.jpg",
            8.0, "A jazz musician and an aspiring actress fall in love while chasing dreams in Los Angeles.", 128),
        new Movie(7L, "The Matrix", 1999, "Sci-Fi", "https://m.media-amazon.com/images/I/51EG732BV3L._AC_.jpg",
            8.7, "A hacker learns reality is a simulation and joins a rebellion against the machines controlling humanity.", 136),
        new Movie(8L, "The Godfather", 1972, "Crime", "https://m.media-amazon.com/images/I/51rOnIjLqzL._AC_.jpg",
            9.2, "The aging patriarch of a crime dynasty transfers control of his empire to his reluctant son.", 175)
    );

    @GetMapping("/movies")
    public List<Movie> getMoviesByGenres(@RequestParam(required = false) List<String> genres){
        if (genres == null || genres.isEmpty()) {
            // No genre filter, return all movies
            // NOTE: change to movies when database is finished
            return mockMovies;
        }

        return mockMovies.stream().filter(movie -> genres.stream()
        .anyMatch(g -> g.equalsIgnoreCase(movie.getGenre())))
        .collect(Collectors.toList());

    }

    @GetMapping("/movies/{id}")
    public Movie getMovieById(@PathVariable Long id) {
        System.out.println("Looking for movie id: " + id); // debug
        return mockMovies.stream()
            .filter(m -> m.getId().longValue() == id.longValue()) // works even if Long
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Movie not found with id " + id));
    }
}