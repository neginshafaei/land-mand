"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [userData, setUserData] = useState(null);
  const [lands, setLands] = useState([]);

  useEffect(() => {
    fetch("/api/lands")
      .then((res) => res.json())
      .then((data) => setLands(data));
  }, []);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();

      fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData: tg?.initData || null }),
      })
        .then((res) => res.json())
        .then((data) => setUserData(data));
    }
  }, []);

  if (!userData) return <div style={{ color: "white" }}>Loading...</div>;

  return (
    <main style={{ padding: "20px", textAlign: "center" }}>
      <h1>Hi {userData.first_name}!</h1>
      <div
        style={{ background: "#222", padding: "20px", borderRadius: "15px" }}
      >
        <p>Current Ballance:</p>
        <h2 style={{ color: "#00d1ff" }}>{userData.balance} Coins 🪙</h2>
      </div>
      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          borderRadius: "10px",
          border: "none",
          background: "#0088cc",
          color: "white",
        }}
        onClick={() => alert("Buy Land Feature will be available soon!")}
      >
        All Lands
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(20, 20px)",
          gap: "2px",
          marginTop: "30px",
          justifyContent: "center",
        }}
      >
        {lands.map((land) => (
          <div
            key={land.id}
            style={{
              width: 20,
              height: 20,
              backgroundColor: land.owner_id ? "gold" : "#ddd",
            }}
          />
        ))}
      </div>
    </main>
  );
}
