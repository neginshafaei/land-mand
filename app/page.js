"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [userData, setUserData] = useState(null);

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

  if (!userData)
    return <div style={{ color: "white" }}>Loading...</div>;

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
    </main>
  );
}
