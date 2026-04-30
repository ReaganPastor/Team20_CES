import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import "./CheckoutPage.css";

const STORAGE_KEY = "pendingCheckout";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState("");
  const [loadingEmailAction, setLoadingEmailAction] = useState(false);

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [editedEmail, setEditedEmail] = useState("");

  const [confirmEmail, setConfirmEmail] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:8080/api/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUserEmail(data.email))
      .catch((err) => console.error("Email fetch failed:", err));
  }, []);

  const checkoutState = useMemo(() => {
    if (location.state && Object.keys(location.state).length > 0) {
      return location.state;
    }

    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  }, [location.state]);

  if (!checkoutState) {
    return (
      <div className="checkout-page">
        <Navigation />
        <div className="checkout-container">
          <div className="checkout-left">
            <h1>Checkout</h1>
            <p>No checkout information found.</p>

            <button className="secondary-btn" onClick={() => navigate("/")}>
              Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const {
    movieTitle = "Movie Title",
    showtime = "Showtime not selected",
    showDate = "Show date not selected",
    showId,
    seats = [],
    tickets = { adult: 0, child: 0, senior: 0 },
    totalPrice = 0,
    email = "",
  } = checkoutState;

  const selectedSeats = seats.map(
    (seat) => `${seat.seatRow}${seat.seatNumber}`
  );

  const serviceFee = selectedSeats.length * 1.5;
  const tax = (totalPrice + serviceFee) * 0.07;
  const orderTotal = totalPrice + serviceFee + tax;

  const totalTickets =
    (tickets.adult || 0) +
    (tickets.child || 0) +
    (tickets.senior || 0);

  const formatShowDate = (dateStr) => {
    if (!dateStr) return "";

    const [year, month, day] = dateStr.split("-");

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const monthName = months[parseInt(month, 10) - 1];

    return `${monthName} ${parseInt(day, 10)}, ${year}`;
  };

  const formatShowTime = (time) => {
    if (!time) return "";

    const [hourStr, minute] = time.split(":");
    let hour = parseInt(hourStr, 10);

    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;

    return `${hour}:${minute} ${ampm}`;
  };

  const handleConfirmEmail = async () => {
    try {
      setLoadingEmailAction(true);

      if (isEditingEmail) {
        setUserEmail(editedEmail);
        setIsEditingEmail(false);
      }

      setConfirmEmail(true);
    } catch (err) {
      console.error(err);
      alert("Failed to confirm email.");
    } finally {
      setLoadingEmailAction(false);
    }
  };

  const handleCompleteOrder = () => {
    if (!confirmEmail) {
      alert("Please confirm your email before completing the order.");
      return;
    }

    const order = {
      confirmationNumber: `CES-${Date.now()}`,
      movieTitle,
      showtime,
      showDate,
      showId,
      selectedSeats,
      tickets,
      email: userEmail || email,
      ticketTotal: totalPrice,
      serviceFee,
      tax,
      orderTotal,
      orderDate: new Date().toLocaleString(),
    };

    const oldOrders = JSON.parse(localStorage.getItem("orderHistory")) || [];
    const updatedOrders = [order, ...oldOrders];

    localStorage.setItem("orderHistory", JSON.stringify(updatedOrders));
    sessionStorage.setItem("lastOrder", JSON.stringify(order));
    sessionStorage.removeItem("pendingCheckout");

    navigate("/order-confirmation", {
      state: order,
    });
  };

  return (
    <div className="checkout-page">
      <Navigation />

      <div className="checkout-container">
        <div className="checkout-left">
          <p className="checkout-step">Checkout • Payment Mockup</p>
          <h1>Payment Information</h1>

          <div className="mock-card">
            <h2>Card Details</h2>

            <label>Cardholder Name</label>
            <input type="text" placeholder="Sara Ghadrdan" disabled />

            <label>Card Number</label>
            <input type="text" placeholder="4242 4242 4242 4242" disabled />

            <div className="mock-row">
              <div>
                <label>Expiration Date</label>
                <input type="text" placeholder="08/28" disabled />
              </div>

              <div>
                <label>CVV</label>
                <input type="text" placeholder="123" disabled />
              </div>
            </div>

            <label>Billing ZIP Code</label>
            <input type="text" placeholder="30602" disabled />
          </div>

          <div className="checkout-actions">
            <button
              className="secondary-btn"
              onClick={() =>
                navigate(`/movies/${checkoutState.movieId}/book`, {
                  state: {
                    selectedShowtime: checkoutState.showtime,
                    selectedShowDate: checkoutState.showDate,
                    showId: checkoutState.showId,
                  },
                })
              }
            >
              Back
            </button>

            <button
              className="primary-btn"
              onClick={handleCompleteOrder}
              disabled={!confirmEmail}
            >
              Complete Order
            </button>
          </div>
        </div>

        <div className="checkout-right">
          <div className="order-summary">
            <h2>Order Summary</h2>

            <div className="summary-block">
              <p><strong>Movie:</strong> {movieTitle}</p>
              <p><strong>Show Date:</strong> {formatShowDate(showDate)}</p>
              <p><strong>Showtime:</strong> {formatShowTime(showtime)}</p>
              <p><strong>Showroom:</strong> {showId}</p>

              <p>
                <strong>Seats:</strong>{" "}
                {selectedSeats.length
                  ? selectedSeats.join(", ")
                  : "None selected"}
              </p>

              <p><strong>Total Tickets:</strong> {totalTickets}</p>

              <div style={{ marginTop: "10px" }}>
                <strong>Email:</strong>{" "}
                {isEditingEmail ? (
                  <input
                    type="email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                  />
                ) : (
                  userEmail || email || "Loading..."
                )}
              </div>

              {!confirmEmail ? (
                <div style={{ marginTop: "10px" }}>
                  {isEditingEmail ? (
                    <button
                      className="primary-btn"
                      disabled={loadingEmailAction}
                      onClick={handleConfirmEmail}
                    >
                      Confirm
                    </button>
                  ) : (
                    <>
                      <button
                        className="primary-btn"
                        onClick={handleConfirmEmail}
                      >
                        Confirm
                      </button>

                      <button
                        className="secondary-btn"
                        onClick={() => {
                          setIsEditingEmail(true);
                          setEditedEmail(userEmail || email);
                        }}
                      >
                        Edit
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <p style={{ color: "green", marginTop: "10px" }}>
                  Email Confirmed
                </p>
              )}
            </div>

            <div className="summary-block">
              <p><strong>Adult:</strong> {tickets.adult || 0}</p>
              <p><strong>Child:</strong> {tickets.child || 0}</p>
              <p><strong>Senior:</strong> {tickets.senior || 0}</p>
            </div>

            <div className="price-breakdown">
              <div>
                <span>Tickets</span>
                <span>${Number(totalPrice).toFixed(2)}</span>
              </div>

              <div>
                <span>Service Fee</span>
                <span>${serviceFee.toFixed(2)}</span>
              </div>

              <div>
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div className="total-line">
                <span>Total</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>

            <p className="mock-note">
              No real payment is processed on this screen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}