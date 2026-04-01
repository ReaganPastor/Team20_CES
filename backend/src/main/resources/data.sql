-- =========================================
-- DATA.SQL FOR CINEMA E-BOOKING SYSTEM
-- Sample data for users, movies, showtimes, bookings, and more
-- This file is intended to populate the database with realistic demo data
-- =========================================

-- =========================================
-- USERS
-- =========================================
INSERT INTO users (first_name, last_name, email, password_hash, phone_number, user_type, receive_promotions)
VALUES
('John', 'Doe', 'john.doe@email.com', '$2a$10$exampleCustomerHash1', '404-555-1001', 'CUSTOMER', TRUE),
('Jane', 'Smith', 'jane.smith@email.com', '$2a$10$exampleCustomerHash2', '404-555-1002', 'CUSTOMER', FALSE),
('Michael', 'Brown', 'michael.brown@email.com', '$2a$10$exampleCustomerHash3', '404-555-1003', 'CUSTOMER', TRUE),
('Emily', 'Davis', 'emily.davis@email.com', '$2a$10$exampleCustomerHash4', '404-555-1004', 'CUSTOMER', FALSE),
('Admin', 'One', 'admin1@ces.com', '$2a$10$exampleAdminHash1', '404-555-2001', 'ADMIN', FALSE),
('Admin', 'Two', 'admin2@ces.com', '$2a$10$exampleAdminHash2', '404-555-2002', 'ADMIN', FALSE);

-- =========================================
-- CUSTOMERS
-- =========================================
INSERT INTO customers (user_id, customer_status, is_registered)
VALUES
(1, 'ACTIVE', TRUE),
(2, 'ACTIVE', TRUE),
(3, 'ACTIVE', TRUE),
(4, 'INACTIVE', TRUE);

-- =========================================
-- ADMINS
-- =========================================
INSERT INTO admins (user_id, admin_role)
VALUES
(5, 'SYSTEM_ADMIN'),
(6, 'CONTENT_MANAGER');

-- =========================================
-- MOVIES
-- Updated from your original movie seed data
-- =========================================
INSERT INTO movies (
    title, description, rating, genre, duration_mins,
    poster_path, trailer_path, status, release_date
)
VALUES
('Interstellar',
 'A team travels through a wormhole in space to ensure humanity''s survival.',
 'PG-13', 'Sci-Fi', 169,
 '/posters/Interstellar.png', '/trailers/Intersellar_Trailer.mp4',
 'CURRENTLY_RUNNING', '2014-11-07'),

('The Dark Knight',
 'Batman faces the Joker, a criminal mastermind causing chaos in Gotham City.',
 'PG-13', 'Action', 152,
 '/posters/The_Dark_Knight.png', '/trailers/Dark_Knight_Trailer.mp4',
 'CURRENTLY_RUNNING', '2008-07-18'),

('Jaws',
 'A great white shark terrorizes a beach town, forcing an unlikely team to hunt it.',
 'PG', 'Thriller', 124,
 '/posters/Jaws.png', '/trailers/Jaws_Trailer.mp4',
 'CURRENTLY_RUNNING', '1975-06-20'),

('Titanic',
 'A romance unfolds aboard the ill-fated Titanic.',
 'PG-13', 'Romance', 195,
 '/posters/Titanic.png', '/trailers/Titanic_Trailer.mp4',
 'CURRENTLY_RUNNING', '1997-12-19'),

('The Matrix',
 'A hacker discovers reality is a simulation and joins a rebellion.',
 'R', 'Sci-Fi', 136,
 '/posters/The_Matrix.png', '/trailers/Matrix_Trailer.mp4',
 'CURRENTLY_RUNNING', '1999-03-31'),

('Avengers: Endgame',
 'The Avengers assemble for one final stand to undo catastrophic events.',
 'PG-13', 'Action', 181,
 '/posters/Avengers_Endgame.png', '/trailers/Avengers_Endgame_Trailer.mp4',
 'COMING_SOON', '2019-04-26'),

('Dirty Dancing',
 'A coming-of-age story set to unforgettable music and dance.',
 'PG-13', 'Drama', 100,
 '/posters/Dirty_Dancing.png', '/trailers/Dirty_Dancing_Trailer.mp4',
 'COMING_SOON', '1987-08-21'),

('The Lion King',
 'A young lion prince learns what it means to be a king.',
 'G', 'Animation', 88,
 '/posters/The_Lion_King.png', '/trailers/Lion_King_Trailer.mp4',
 'COMING_SOON', '1994-06-24'),

('Cinderella',
 'A classic fairy tale of kindness, courage, and transformation.',
 'G', 'Family', 75,
 '/posters/Cinderella.png', '/trailers/Cinderella_Trailer.mp4',
 'COMING_SOON', '1950-02-15'),

('Cars',
 'A race car learns humility and friendship in a small town.',
 'G', 'Animation', 117,
 '/posters/Cars.png', '/trailers/Cars_1_Trailer.mp4',
 'COMING_SOON', '2006-06-09');

-- =========================================
-- SHOWROOMS
-- =========================================
INSERT INTO showrooms (showroom_number, capacity, screen_type)
VALUES
(1, 20, 'STANDARD'),
(2, 20, 'IMAX'),
(3, 20, 'THREE_D');

-- =========================================
-- SEATS
-- 20 seats per showroom: rows A-D, seats 1-5
-- =========================================
INSERT INTO seats (showroom_id, seat_row, seat_number, seat_type, is_accessible)
VALUES
-- Showroom 1
(1, 'A', 1, 'REGULAR', FALSE),
(1, 'A', 2, 'REGULAR', FALSE),
(1, 'A', 3, 'REGULAR', FALSE),
(1, 'A', 4, 'REGULAR', FALSE),
(1, 'A', 5, 'REGULAR', FALSE),
(1, 'B', 1, 'REGULAR', FALSE),
(1, 'B', 2, 'REGULAR', FALSE),
(1, 'B', 3, 'REGULAR', FALSE),
(1, 'B', 4, 'REGULAR', FALSE),
(1, 'B', 5, 'REGULAR', FALSE),
(1, 'C', 1, 'PREMIUM', FALSE),
(1, 'C', 2, 'PREMIUM', FALSE),
(1, 'C', 3, 'PREMIUM', FALSE),
(1, 'C', 4, 'PREMIUM', FALSE),
(1, 'C', 5, 'PREMIUM', FALSE),
(1, 'D', 1, 'ACCESSIBLE', TRUE),
(1, 'D', 2, 'ACCESSIBLE', TRUE),
(1, 'D', 3, 'VIP', FALSE),
(1, 'D', 4, 'VIP', FALSE),
(1, 'D', 5, 'VIP', FALSE),

-- Showroom 2
(2, 'A', 1, 'REGULAR', FALSE),
(2, 'A', 2, 'REGULAR', FALSE),
(2, 'A', 3, 'REGULAR', FALSE),
(2, 'A', 4, 'REGULAR', FALSE),
(2, 'A', 5, 'REGULAR', FALSE),
(2, 'B', 1, 'REGULAR', FALSE),
(2, 'B', 2, 'REGULAR', FALSE),
(2, 'B', 3, 'REGULAR', FALSE),
(2, 'B', 4, 'REGULAR', FALSE),
(2, 'B', 5, 'REGULAR', FALSE),
(2, 'C', 1, 'PREMIUM', FALSE),
(2, 'C', 2, 'PREMIUM', FALSE),
(2, 'C', 3, 'PREMIUM', FALSE),
(2, 'C', 4, 'PREMIUM', FALSE),
(2, 'C', 5, 'PREMIUM', FALSE),
(2, 'D', 1, 'ACCESSIBLE', TRUE),
(2, 'D', 2, 'ACCESSIBLE', TRUE),
(2, 'D', 3, 'VIP', FALSE),
(2, 'D', 4, 'VIP', FALSE),
(2, 'D', 5, 'VIP', FALSE),

-- Showroom 3
(3, 'A', 1, 'REGULAR', FALSE),
(3, 'A', 2, 'REGULAR', FALSE),
(3, 'A', 3, 'REGULAR', FALSE),
(3, 'A', 4, 'REGULAR', FALSE),
(3, 'A', 5, 'REGULAR', FALSE),
(3, 'B', 1, 'REGULAR', FALSE),
(3, 'B', 2, 'REGULAR', FALSE),
(3, 'B', 3, 'REGULAR', FALSE),
(3, 'B', 4, 'REGULAR', FALSE),
(3, 'B', 5, 'REGULAR', FALSE),
(3, 'C', 1, 'PREMIUM', FALSE),
(3, 'C', 2, 'PREMIUM', FALSE),
(3, 'C', 3, 'PREMIUM', FALSE),
(3, 'C', 4, 'PREMIUM', FALSE),
(3, 'C', 5, 'PREMIUM', FALSE),
(3, 'D', 1, 'ACCESSIBLE', TRUE),
(3, 'D', 2, 'ACCESSIBLE', TRUE),
(3, 'D', 3, 'VIP', FALSE),
(3, 'D', 4, 'VIP', FALSE),
(3, 'D', 5, 'VIP', FALSE);

-- =========================================
-- SHOWS
-- 2 shows per movie for demo
-- showrooms rotate between 1, 2, and 3
-- =========================================
INSERT INTO shows (movie_id, showroom_id, show_date, start_time, end_time)
VALUES
-- Interstellar
(1, 1, '2026-03-27', '14:00', '16:49'),
(1, 2, '2026-03-28', '18:00', '20:49'),

-- The Dark Knight
(2, 2, '2026-03-27', '15:00', '17:32'),
(2, 3, '2026-03-28', '19:00', '21:32'),

-- Jaws
(3, 3, '2026-03-27', '13:00', '15:04'),
(3, 1, '2026-03-28', '17:00', '19:04'),

-- Titanic
(4, 1, '2026-03-27', '16:00', '19:15'),
(4, 2, '2026-03-28', '20:00', '23:15'),

-- The Matrix
(5, 2, '2026-03-27', '14:30', '16:46'),
(5, 3, '2026-03-28', '18:30', '20:46'),

-- Avengers: Endgame
(6, 3, '2026-03-29', '15:00', '18:01'),
(6, 1, '2026-03-30', '19:00', '22:01'),

-- Dirty Dancing
(7, 1, '2026-03-29', '13:00', '14:40'),
(7, 2, '2026-03-30', '17:00', '18:40'),

-- The Lion King
(8, 2, '2026-03-29', '12:00', '13:28'),
(8, 3, '2026-03-30', '16:00', '17:28'),

-- Cinderella
(9, 3, '2026-03-29', '11:00', '12:15'),
(9, 1, '2026-03-30', '15:00', '16:15'),

-- Cars
(10, 1, '2026-03-29', '14:00', '15:57'),
(10, 2, '2026-03-30', '18:00', '19:57');

-- =========================================
-- SHOW_SEATS
-- Create a show_seat for every seat in the correct showroom for every show
-- =========================================
INSERT INTO show_seats (show_id, seat_id, is_reserved, reservation_status)
SELECT
    sh.id,
    se.id,
    FALSE,
    'AVAILABLE'
FROM shows sh
JOIN seats se
    ON sh.showroom_id = se.showroom_id;

-- Mark a few seats as reserved/held for demo purposes
UPDATE show_seats SET is_reserved = TRUE, reservation_status = 'RESERVED' WHERE show_id = 1 AND seat_id IN (1, 2, 3);
UPDATE show_seats SET is_reserved = TRUE, reservation_status = 'RESERVED' WHERE show_id = 2 AND seat_id IN (21, 22);
UPDATE show_seats SET is_reserved = TRUE, reservation_status = 'RESERVED' WHERE show_id = 3 AND seat_id IN (41, 42, 43);
UPDATE show_seats SET is_reserved = FALSE, reservation_status = 'HELD'     WHERE show_id = 4 AND seat_id IN (44, 45);
UPDATE show_seats SET is_reserved = TRUE, reservation_status = 'RESERVED' WHERE show_id = 5 AND seat_id IN (46);
UPDATE show_seats SET is_reserved = TRUE, reservation_status = 'RESERVED' WHERE show_id = 6 AND seat_id IN (4, 5);
UPDATE show_seats SET is_reserved = FALSE, reservation_status = 'HELD'     WHERE show_id = 7 AND seat_id IN (11, 12);
UPDATE show_seats SET is_reserved = TRUE, reservation_status = 'RESERVED' WHERE show_id = 8 AND seat_id IN (25, 26);

-- =========================================
-- TICKET PRICES
-- =========================================
INSERT INTO ticket_prices (ticket_type, price, description)
VALUES
('ADULT', 12.99, 'Standard adult ticket'),
('CHILD', 8.99, 'Children under 12'),
('SENIOR', 9.99, 'Senior citizen ticket');

-- =========================================
-- PROMOTIONS
-- =========================================
INSERT INTO promotions (promo_code, promotion_type, discount_value, start_date, end_date, is_active)
VALUES
('SAVE10', 'PERCENT', 10.00, '2026-03-01', '2026-03-31', TRUE),
('WELCOME5', 'FIXED', 5.00, '2026-03-01', '2026-04-15', TRUE),
('SPRING15', 'PERCENT', 15.00, '2026-03-20', '2026-04-05', TRUE);

-- =========================================
-- ADDRESSES
-- One address max per customer
-- =========================================
INSERT INTO addresses (customer_id, street, city, state, zip_code)
VALUES
(1, '123 Peachtree St', 'Atlanta', 'Georgia', '30303'),
(2, '456 Oak Lane', 'Athens', 'Georgia', '30601'),
(3, '789 Pine Ave', 'Savannah', 'Georgia', '31401');

-- =========================================
-- PAYMENT CARDS
-- Encrypted values are placeholders for demo
-- =========================================
INSERT INTO payment_cards (
    customer_id, cardholder_name, encrypted_card_number, encrypted_cvv,
    expiration_date, last_four, card_brand, billing_address
)
VALUES
(1, 'John Doe',    'enc_card_1_abc123', 'enc_cvv_1_xyz', '12/27', '4242', 'VISA',       '123 Peachtree St'),
(1, 'John Doe',    'enc_card_2_def456', 'enc_cvv_2_xyz', '08/28', '1111', 'MASTERCARD', '123 Peachtree St'),
(2, 'Jane Smith',  'enc_card_3_ghi789', 'enc_cvv_3_xyz', '11/26', '2222', 'VISA',       '456 Oak Lane'),
(3, 'Michael Brown','enc_card_4_jkl012','enc_cvv_4_xyz', '09/29', '3333', 'AMEX',       '789 Pine Ave');

-- =========================================
-- BOOKINGS
-- =========================================
INSERT INTO bookings (customer_id, movie_id, promotion_id, booking_date, total_amount, booking_status)
VALUES
(1, 1, 1, '2026-03-25 10:15:00', 25.98, 'CONFIRMED'),
(2, 2, 2, '2026-03-25 11:00:00', 20.98, 'CONFIRMED'),
(3, 4, NULL, '2026-03-25 12:30:00', 38.97, 'PENDING'),
(1, 5, 3, '2026-03-26 09:45:00', 12.99, 'CONFIRMED');

-- =========================================
-- TICKETS
-- Each ticket reserves one show_seat
-- show_seat ids below are chosen from rows that already exist
-- =========================================
INSERT INTO tickets (booking_id, show_seat_id, ticket_price_id, ticket_type, price_paid)
VALUES
-- Booking 1: Interstellar, show 1, seats 1 and 2
(1, 1, 1, 'ADULT', 12.99),
(1, 2, 1, 'ADULT', 12.99),

-- Booking 2: The Dark Knight, show 3, seats 41 and 42
(2, 41, 1, 'ADULT', 12.99),
(2, 42, 3, 'SENIOR', 9.99),

-- Booking 3: Titanic, show 7, seats 121, 122, 123
(3, 121, 1, 'ADULT', 12.99),
(3, 122, 1, 'ADULT', 12.99),
(3, 123, 2, 'CHILD', 8.99),

-- Booking 4: The Matrix, show 9, seat 161
(4, 161, 1, 'ADULT', 12.99);

-- =========================================
-- Sync ticketed seats to RESERVED
-- =========================================
UPDATE show_seats
SET is_reserved = TRUE,
    reservation_status = 'RESERVED'
WHERE id IN (1, 2, 41, 42, 121, 122, 123, 161);

-- =========================================
-- PREFERENCES
-- Fixes missing Preference relationship from professor feedback
-- =========================================
INSERT INTO preferences (customer_id, movie_id)
VALUES
(1, 1),
(1, 5),
(1, 8),
(2, 2),
(2, 6),
(3, 4),
(3, 7),
(4, 9);

-- =========================================
-- RECOMMENDATIONS
-- =========================================
INSERT INTO recommendations (customer_id, movie_id, recommended_on)
VALUES
(1, 6, '2026-03-25 08:00:00'),
(1, 8, '2026-03-25 08:05:00'),
(2, 1, '2026-03-25 08:10:00'),
(2, 5, '2026-03-25 08:15:00'),
(3, 7, '2026-03-25 08:20:00'),
(4, 9, '2026-03-25 08:25:00');
