-- Drop tables in dependency order
DROP TABLE IF EXISTS recommendations CASCADE;
DROP TABLE IF EXISTS preferences CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS show_seats CASCADE;
DROP TABLE IF EXISTS shows CASCADE;
DROP TABLE IF EXISTS seats CASCADE;
DROP TABLE IF EXISTS payment_cards CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS promotions CASCADE;
DROP TABLE IF EXISTS ticket_prices CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS showrooms CASCADE;
DROP TABLE IF EXISTS movies CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =========================================
-- USERS / CUSTOMER / ADMIN
-- =========================================

CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    phone_number    VARCHAR(20),
    user_type       VARCHAR(20) NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_users_user_type
        CHECK (user_type IN ('CUSTOMER', 'ADMIN'))
);

CREATE TABLE customers (
    id                BIGSERIAL PRIMARY KEY,
    user_id           BIGINT NOT NULL UNIQUE,
    customer_status   VARCHAR(20) NOT NULL,
    is_registered     BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_customers_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_customers_status
        CHECK (customer_status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED'))
);

CREATE TABLE admins (
    id          BIGSERIAL PRIMARY KEY,
    user_id      BIGINT NOT NULL UNIQUE,
    admin_role   VARCHAR(50),

    CONSTRAINT fk_admins_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

-- =========================================
-- MOVIES / SHOWROOMS / SEATS / SHOWS
-- =========================================

CREATE TABLE movies (
    id              BIGSERIAL PRIMARY KEY,
    title           VARCHAR(255) NOT NULL UNIQUE,
    description     TEXT NOT NULL,
    rating          VARCHAR(10) NOT NULL,
    genre           VARCHAR(50) NOT NULL,
    duration_mins   INT NOT NULL,
    poster_path     TEXT NOT NULL,
    trailer_path    TEXT NOT NULL,
    status          VARCHAR(30) NOT NULL,
    release_date    DATE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_movies_rating
        CHECK (rating IN ('G', 'PG', 'PG-13', 'R', 'NC-17')),

    CONSTRAINT chk_movies_status
        CHECK (status IN ('CURRENTLY_RUNNING', 'COMING_SOON', 'ARCHIVED')),

    CONSTRAINT chk_movies_duration
        CHECK (duration_mins > 0)
);

CREATE TABLE showrooms (
    id               BIGSERIAL PRIMARY KEY,
    showroom_number  INT NOT NULL UNIQUE,
    capacity         INT NOT NULL,
    screen_type      VARCHAR(30),

    CONSTRAINT chk_showrooms_capacity
        CHECK (capacity > 0),

    CONSTRAINT chk_showrooms_screen_type
        CHECK (
            screen_type IS NULL OR
            screen_type IN ('STANDARD', 'IMAX', 'THREE_D')
        )
);

CREATE TABLE seats (
    id             BIGSERIAL PRIMARY KEY,
    showroom_id     BIGINT NOT NULL,
    seat_row        VARCHAR(5) NOT NULL,
    seat_number     INT NOT NULL,
    seat_type       VARCHAR(20) NOT NULL,
    is_accessible   BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_seats_showroom
        FOREIGN KEY (showroom_id) REFERENCES showrooms(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_seats_location
        UNIQUE (showroom_id, seat_row, seat_number),

    CONSTRAINT chk_seats_number
        CHECK (seat_number > 0),

    CONSTRAINT chk_seats_type
        CHECK (seat_type IN ('REGULAR', 'PREMIUM', 'VIP', 'ACCESSIBLE'))
);

CREATE TABLE shows (
    id              BIGSERIAL PRIMARY KEY,
    movie_id         BIGINT NOT NULL,
    showroom_id      BIGINT NOT NULL,
    show_date        DATE NOT NULL,
    start_time       TIME NOT NULL,
    end_time         TIME NOT NULL,
    created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_shows_movie
        FOREIGN KEY (movie_id) REFERENCES movies(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_shows_showroom
        FOREIGN KEY (showroom_id) REFERENCES showrooms(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_shows_room_datetime
        UNIQUE (showroom_id, show_date, start_time),

    CONSTRAINT chk_shows_time_order
        CHECK (end_time > start_time)
);

CREATE TABLE show_seats (
    id                   BIGSERIAL PRIMARY KEY,
    show_id              BIGINT NOT NULL,
    seat_id              BIGINT NOT NULL,
    is_reserved          BOOLEAN NOT NULL DEFAULT FALSE,
    reservation_status   VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT fk_show_seats_show
        FOREIGN KEY (show_id) REFERENCES shows(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_show_seats_seat
        FOREIGN KEY (seat_id) REFERENCES seats(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_show_seats
        UNIQUE (show_id, seat_id),

    CONSTRAINT chk_show_seats_status
        CHECK (reservation_status IN ('AVAILABLE', 'HELD', 'RESERVED'))
);

-- =========================================
-- PRICING / PROMOTIONS
-- =========================================

CREATE TABLE ticket_prices (
    id            BIGSERIAL PRIMARY KEY,
    ticket_type    VARCHAR(20) NOT NULL,
    price          DECIMAL(6,2) NOT NULL,
    description    VARCHAR(100),

    CONSTRAINT chk_ticket_prices_type
        CHECK (ticket_type IN ('ADULT', 'CHILD', 'SENIOR')),

    CONSTRAINT chk_ticket_prices_price
        CHECK (price > 0)
);

CREATE TABLE promotions (
    id                BIGSERIAL PRIMARY KEY,
    promo_code        VARCHAR(50) NOT NULL UNIQUE,
    promotion_type    VARCHAR(20) NOT NULL,
    discount_value    DECIMAL(5,2) NOT NULL,
    start_date        DATE NOT NULL,
    end_date          DATE NOT NULL,
    is_active         BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT chk_promotions_type
        CHECK (promotion_type IN ('PERCENT', 'FIXED')),

    CONSTRAINT chk_promotions_discount
        CHECK (discount_value > 0),

    CONSTRAINT chk_promotions_dates
        CHECK (end_date >= start_date)
);

-- =========================================
-- CUSTOMER DETAILS
-- =========================================

CREATE TABLE addresses (
    id            BIGSERIAL PRIMARY KEY,
    customer_id    BIGINT NOT NULL UNIQUE,
    street         VARCHAR(255) NOT NULL,
    city           VARCHAR(100) NOT NULL,
    state          VARCHAR(50) NOT NULL,
    zip_code       VARCHAR(20) NOT NULL,

    CONSTRAINT fk_addresses_customer
        FOREIGN KEY (customer_id) REFERENCES customers(id)
        ON DELETE CASCADE
);

CREATE TABLE payment_cards (
    id                      BIGSERIAL PRIMARY KEY,
    customer_id             BIGINT NOT NULL,
    cardholder_name         VARCHAR(255) NOT NULL,
    encrypted_card_number   TEXT NOT NULL,
    encrypted_cvv           TEXT NOT NULL,
    expiration_date         VARCHAR(10) NOT NULL,
    last_four               VARCHAR(4) NOT NULL,
    card_brand              VARCHAR(20),
    billing_address         VARCHAR(255),

    CONSTRAINT fk_payment_cards_customer
        FOREIGN KEY (customer_id) REFERENCES customers(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_last_four
        CHECK (char_length(last_four) = 4)
);

-- =========================================
-- BOOKINGS / TICKETS
-- =========================================

CREATE TABLE bookings (
    id              BIGSERIAL PRIMARY KEY,
    customer_id      BIGINT NOT NULL,
    movie_id         BIGINT NOT NULL,
    promotion_id     BIGINT,
    booking_date     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_amount     DECIMAL(8,2) NOT NULL,
    booking_status   VARCHAR(20) NOT NULL,

    CONSTRAINT fk_bookings_customer
        FOREIGN KEY (customer_id) REFERENCES customers(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_bookings_movie
        FOREIGN KEY (movie_id) REFERENCES movies(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_bookings_promotion
        FOREIGN KEY (promotion_id) REFERENCES promotions(id)
        ON DELETE SET NULL,

    CONSTRAINT chk_bookings_total
        CHECK (total_amount >= 0),

    CONSTRAINT chk_bookings_status
        CHECK (booking_status IN ('PENDING', 'CONFIRMED', 'CANCELLED'))
);

CREATE TABLE tickets (
    id               BIGSERIAL PRIMARY KEY,
    booking_id        BIGINT NOT NULL,
    show_seat_id      BIGINT NOT NULL UNIQUE,
    ticket_price_id   BIGINT NOT NULL,
    ticket_type       VARCHAR(20) NOT NULL,
    price_paid        DECIMAL(6,2) NOT NULL,

    CONSTRAINT fk_tickets_booking
        FOREIGN KEY (booking_id) REFERENCES bookings(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_tickets_show_seat
        FOREIGN KEY (show_seat_id) REFERENCES show_seats(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_tickets_price
        FOREIGN KEY (ticket_price_id) REFERENCES ticket_prices(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_tickets_type
        CHECK (ticket_type IN ('ADULT', 'CHILD', 'SENIOR')),

    CONSTRAINT chk_tickets_price_paid
        CHECK (price_paid >= 0)
);

-- =========================================
-- PREFERENCES / RECOMMENDATIONS
-- =========================================

CREATE TABLE preferences (
    id            BIGSERIAL PRIMARY KEY,
    customer_id    BIGINT NOT NULL,
    movie_id       BIGINT NOT NULL,

    CONSTRAINT fk_preferences_customer
        FOREIGN KEY (customer_id) REFERENCES customers(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_preferences_movie
        FOREIGN KEY (movie_id) REFERENCES movies(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_preferences_customer_movie
        UNIQUE (customer_id, movie_id)
);

CREATE TABLE recommendations (
    id               BIGSERIAL PRIMARY KEY,
    customer_id       BIGINT NOT NULL,
    movie_id          BIGINT NOT NULL,
    recommended_on    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_recommendations_customer
        FOREIGN KEY (customer_id) REFERENCES customers(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_recommendations_movie
        FOREIGN KEY (movie_id) REFERENCES movies(id)
        ON DELETE CASCADE
);

-- =========================================
-- INDEXES
-- =========================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_movies_status ON movies(status);
CREATE INDEX idx_movies_genre ON movies(genre);
CREATE INDEX idx_movies_title_lower ON movies ((LOWER(title)));

CREATE INDEX idx_shows_movie_id ON shows(movie_id);
CREATE INDEX idx_shows_showroom_id ON shows(showroom_id);
CREATE INDEX idx_shows_date ON shows(show_date);
CREATE INDEX idx_shows_movie_date ON shows(movie_id, show_date);

CREATE INDEX idx_seats_showroom_id ON seats(showroom_id);
CREATE INDEX idx_show_seats_show_id ON show_seats(show_id);

CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_movie_id ON bookings(movie_id);
CREATE INDEX idx_tickets_booking_id ON tickets(booking_id);

CREATE INDEX idx_preferences_customer_id ON preferences(customer_id);
CREATE INDEX idx_preferences_movie_id ON preferences(movie_id);

CREATE INDEX idx_recommendations_customer_id ON recommendations(customer_id);
CREATE INDEX idx_recommendations_movie_id ON recommendations(movie_id);