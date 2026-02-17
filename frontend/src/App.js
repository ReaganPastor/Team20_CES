import React, { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState(""); // state to store backend response

  useEffect(() => {
    // call the backend when component loads
    fetch("http://localhost:8080/hello") // your backend endpoint
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => setMessage("Error connecting to backend"));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Movie Booking App Frontend!!</h1>
      <p>Backend says: {message}</p>
    </div>
  );
}

export default App;
