"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [userData, setUserData] = useState(null);
  const [lands, setLands] = useState([]);

  useEffect(() => {
    fetch("/api/lands")
      .then((res) => res.json())
      .then((data) => {
        const sorted = [...data].sort((a, b) => a.y - b.y || a.x - b.x);
        setLands(sorted);
      });
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

  async function buyLand(x, y) {
    const res = await fetch("/api/buy-land", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        x,
        y,
        userId: userData.id,
      }),
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    setLands((prev) =>
      prev.map((l) =>
        l.x === x && l.y === y ? { ...l, owner_id: userData.id } : l
      )
    );

    setUserData((prev) => ({
      ...prev,
      balance: prev.balance - data.price,
    }));
  }

  if (!userData) return <div style={{ color: "white" }}>Loading...</div>;

  return (
    <main style={{ padding: "20px", textAlign: "center" }}>
      <h1>Hi {userData.first_name}!</h1>

      <div
        style={{ background: "#222", padding: "20px", borderRadius: "15px" }}
      >
        <p>Current Balance:</p>
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
            key={`${land.x}-${land.y}`}
            onClick={() => buyLand(land.x, land.y)}
            style={{
              width: 20,
              height: 20,
              backgroundColor: land.owner_id ? "gold" : "#ddd",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </main>
  );
}
