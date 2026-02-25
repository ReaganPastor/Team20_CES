package com.team20ces.moviebooking.service;

import com.team20ces.moviebooking.model.Movie;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MovieService {

    private final List<Movie> movies = new ArrayList<>();

    public MovieService() {

        movies.add(new Movie(1L, "Dune", "NOW_PLAYING", "Sci-Fi", "PG-13", "https://example.com/dune.jpg", 2021, 8.0, "A noble family becomes embroiled in a war for control over a desert planet.", 155));
        movies.add(new Movie(2L, "Barbie", "NOW_PLAYING", "Comedy", "PG-13", "https://example.com/barbie.jpg", 2023, 7.0, "Barbie begins to question her perfect world.", 114));
        movies.add(new Movie(3L, "Kung Fu Panda 4", "NOW_PLAYING", "Animation", "PG", "https://example.com/kfp4.jpg", 2024, 0.0, "Po faces a new villain and must train a successor.", 100));
        movies.add(new Movie(4L, "The Batman", "NOW_PLAYING", "Action", "PG-13", "https://example.com/batman.jpg", 2022, 7.5, "Gotham faces a new threat as Batman uncovers a conspiracy.", 120));
        movies.add(new Movie(5L, "Everything Everywhere All At Once", "NOW_PLAYING", "Sci-Fi", "R", "https://example.com/eeaao.jpg", 2022, 8.5, "A woman discovers alternate versions of herself in the multiverse.", 140));
        movies.add(new Movie(6L, "Top Gun: Maverick", "NOW_PLAYING", "Action", "PG-13", "https://example.com/topgun.jpg", 2022, 8.3, "Maverick returns to train a new generation of pilots.", 131));
        movies.add(new Movie(7L, "Avatar: The Way of Water", "NOW_PLAYING", "Sci-Fi", "PG-13", "https://example.com/avatar2.jpg", 2022, 7.9, "Jake Sully and Neytiri explore Pandora's oceans.", 192));
        movies.add(new Movie(8L, "Nope", "NOW_PLAYING", "Horror", "R", "https://example.com/nope.jpg", 2022, 6.9, "Residents of a small town witness a mysterious UFO.", 130));
        movies.add(new Movie(9L, "Thor: Love and Thunder", "NOW_PLAYING", "Action", "PG-13", "https://example.com/thor4.jpg", 2022, 6.5, "Thor faces a cosmic threat and reunites with old allies.", 119));
        movies.add(new Movie(10L, "Black Panther: Wakanda Forever", "NOW_PLAYING", "Action", "PG-13", "https://example.com/bpwf.jpg", 2022, 7.2, "Wakanda mourns their king and faces new dangers.", 161));
        movies.add(new Movie(11L, "Spider-Man: No Way Home", "NOW_PLAYING", "Action", "PG-13", "https://example.com/spiderman3.jpg", 2021, 8.4, "Peter Parker navigates multiverse chaos with Spider-Men.", 148));
        movies.add(new Movie(12L, "Doctor Strange in the Multiverse of Madness", "NOW_PLAYING", "Action", "PG-13", "https://example.com/doctorstrange2.jpg", 2022, 7.3, "Doctor Strange battles a dark multiverse threat.", 126));
        movies.add(new Movie(13L, "Lightyear", "NOW_PLAYING", "Animation", "PG", "https://example.com/lightyear.jpg", 2022, 6.7, "The origin story of Buzz Lightyear.", 105));
        movies.add(new Movie(14L, "Turning Red", "NOW_PLAYING", "Animation", "PG", "https://example.com/turningred.jpg", 2022, 7.0, "A girl discovers her emotions turn her into a giant red panda.", 100));
        movies.add(new Movie(15L, "Minions: The Rise of Gru", "NOW_PLAYING", "Animation", "PG", "https://example.com/minions2.jpg", 2022, 6.5, "Young Gru teams up with the Minions for mischief.", 105));

        // COMING_SOON
        movies.add(new Movie(16L, "Spider-Man: Beyond the Spider-Verse", "COMING_SOON", "Animation", "PG", "https://example.com/spidermanbeyond.jpg", 2024, 0.0, "Miles Morales explores new multiverse adventures.", 110));
        movies.add(new Movie(17L, "Mission: Impossible 8", "COMING_SOON", "Action", "PG-13", "https://example.com/mi8.jpg", 2024, 0.0, "Ethan Hunt takes on another impossible mission.", 145));
        movies.add(new Movie(18L, "Guardians of the Galaxy Vol. 3", "COMING_SOON", "Action", "PG-13", "https://example.com/gotg3.jpg", 2023, 0.0, "The Guardians face new cosmic challenges.", 150));
        movies.add(new Movie(19L, "The Marvels", "COMING_SOON", "Action", "PG-13", "https://example.com/themarvels.jpg", 2023, 0.0, "Carol Danvers teams up with Kamala Khan and Monica.", 130));
        movies.add(new Movie(20L, "Wonka", "COMING_SOON", "Comedy", "PG", "https://example.com/wonka.jpg", 2023, 0.0, "A young Willy Wonka embarks on his chocolate adventures.", 115));
        movies.add(new Movie(21L, "Haunted Mansion", "COMING_SOON", "Horror", "PG-13", "https://example.com/hauntedmansion.jpg", 2023, 0.0, "A family explores a spooky mansion with secrets.", 105));
        movies.add(new Movie(22L, "Elemental", "COMING_SOON", "Animation", "PG", "https://example.com/elemental.jpg", 2023, 0.0, "Fire and Water live together in a bustling city.", 100));
        movies.add(new Movie(23L, "The Hunger Games: The Ballad of Songbirds & Snakes", "COMING_SOON", "Action", "PG-13", "https://example.com/hungergames2.jpg", 2023, 0.0, "The origin story of President Snow.", 142));
        movies.add(new Movie(24L, "Oppenheimer", "COMING_SOON", "Drama", "R", "https://example.com/oppenheimer.jpg", 2023, 0.0, "The life of J. Robert Oppenheimer and the atomic bomb.", 180));
        movies.add(new Movie(25L, "The Little Mermaid", "COMING_SOON", "Animation", "PG", "https://example.com/littlemermaid.jpg", 2023, 0.0, "A retelling of Ariel's adventures under the sea.", 120));
        movies.add(new Movie(26L, "Barbie 2", "COMING_SOON", "Comedy", "PG-13", "https://example.com/barbie2.jpg", 2024, 0.0, "Barbie navigates new challenges in her world.", 114));
        movies.add(new Movie(27L, "Captain America: New World Order", "COMING_SOON", "Action", "PG-13", "https://example.com/captainamerica5.jpg", 2024, 0.0, "Sam Wilson faces new threats as Captain America.", 140));
        movies.add(new Movie(28L, "Ant-Man and the Wasp: Quantumania 2", "COMING_SOON", "Action", "PG-13", "https://example.com/antman2.jpg", 2024, 0.0, "Scott Lang and Hope van Dyne return for more adventures.", 125));
        movies.add(new Movie(29L, "The Flash", "COMING_SOON", "Action", "PG-13", "https://example.com/flash2.jpg", 2024, 0.0, "Barry Allen travels through multiverse timelines.", 130));
        movies.add(new Movie(30L, "Frozen 3", "COMING_SOON", "Animation", "PG", "https://example.com/frozen3.jpg", 2024, 0.0, "Elsa and Anna face a new magical threat in Arendelle.", 110));
    }

        public List<Movie> getAll(Optional<String> status, List<String> genres) {
        return movies.stream()
                // Filter by status
                .filter(m -> status.isEmpty() || status.get().isBlank() ||
                        (m.getStatus() != null &&
                        m.getStatus().equalsIgnoreCase(status.get().trim())))
                // Filter by genre (match ANY selected genre)
                .filter(m -> genres.isEmpty() || genres.stream()
                        .anyMatch(g -> g.equalsIgnoreCase(m.getGenre())))
                .collect(Collectors.toList());
        } 

    public Optional<Movie> getById(Long id) {
        return movies.stream()
                .filter(m -> m.getId().equals(id))
                .findFirst();
    }

    public List<Movie> searchByTitle(String title, Optional<String> status) {

        String query = title.trim().toLowerCase(Locale.ROOT);

        return movies.stream()
                .filter(m -> m.getTitle() != null &&
                        m.getTitle().toLowerCase(Locale.ROOT).contains(query))

                .filter(m -> status.isEmpty() ||
                        status.get().isBlank() ||
                        (m.getStatus() != null &&
                         m.getStatus().equalsIgnoreCase(
                             status.get().trim().toUpperCase(Locale.ROOT))))

                .collect(Collectors.toList());
    }
}