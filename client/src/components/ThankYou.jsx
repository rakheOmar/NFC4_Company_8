import React from "react";

function ThankYouPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fefce8",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        color: "#374151",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>🎉 Thank You!</h1>
      <p style={{ fontSize: "1.2rem", marginTop: "1rem" }}>
        Your response has been recorded. We appreciate your input towards improving mining safety
        and sustainability.
      </p>
    </div>
  );
}

export default ThankYouPage;
