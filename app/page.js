"use client";

import { useEffect, useState } from "react";
import ControlDock from "./components/ControlDock";
import HeroPanel from "./components/HeroPanel";
import LandMap from "./components/LandMap";
import MarketplacePanel from "./components/MarketplacePanel";
import PortfolioPanel from "./components/PortfolioPanel";
import StatStrip from "./components/StatStrip";
import StatusBanner from "./components/StatusBanner";
import {
  formatCoins,
  getEffectiveIncome,
  getPendingTotalIncome,
} from "./components/uiData";

export default function Home() {
  const [userData, setUserData] = useState(null);
  const [lands, setLands] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const activeUserId = userData?.id;
  const ownedLands = lands.filter(
    (land) => String(land.owner_id) === String(activeUserId),
  );
  const marketLands = lands.filter(
    (land) => land.for_sale,
  );
  const availableLands = lands.filter((land) => !land.owner_id).length;
  const hourlyIncome = ownedLands.reduce(
    (sum, land) => sum + getEffectiveIncome(land),
    0,
  );
  const pendingIncome = getPendingTotalIncome(ownedLands, userData?.last_claim);

  useEffect(() => {
    let active = true;

    bootApp().then(({ authData, bootError, landsData }) => {
      if (!active) return;

      if (bootError) setError(bootError);
      if (landsData?.error) setError(landsData.error);
      else if (landsData) setLands(landsData);

      if (authData?.error) setError(authData.error);
      else if (authData) setUserData(authData);
    });

    return () => {
      active = false;
    };
  }, []);

  async function refreshLands() {
    const data = await fetchJson("/api/lands");

    if (data.error) {
      setError(data.error);
      return;
    }

    setLands(data);
  }

  function replaceLand(updatedLand) {
    setLands((currentLands) =>
      currentLands.map((land) =>
        land.id === updatedLand.id ? { ...land, ...updatedLand } : land,
      ),
    );
  }

  async function mutate(url, payload) {
    setBusy(true);
    setMessage("");
    setError("");

    try {
      const data = await postJson(url, payload);

      if (data.error) {
        setError(data.error);
        return null;
      }

      return data;
    } catch (requestError) {
      setError(requestError.message);
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function discover(price) {
    const data = await mutate("/api/discover", {
      userId: userData.id,
      price,
    });

    if (!data) return;

    setUserData(data.user);
    await refreshLands();
    setMessage(`Discovered ${data.rarity} land with ${data.income}/h income.`);
  }

  async function claimIncome() {
    const data = await mutate("/api/claim-income", {
      userId: userData.id,
    });

    if (!data) return;

    setUserData(data.user);
    setMessage(`Claimed ${formatCoins(data.claimed)} coins.`);
  }

  async function upgradeLand(landId) {
    const data = await mutate("/api/upgrade-land", {
      userId: userData.id,
      landId,
    });

    if (!data) return;

    setUserData(data.user);
    await refreshLands();
    setMessage(`Upgraded land to level ${data.land.level}.`);
  }

  async function listLand(landId) {
    const salePrice = Number(window.prompt("Sale price in coins"));

    if (!salePrice) return;

    const data = await mutate("/api/marketplace/list", {
      userId: userData.id,
      landId,
      salePrice,
    });

    if (!data) return;

    replaceLand(data.land);
    await refreshLands();
    setMessage("Land listed on marketplace.");
  }

  async function cancelListing(landId) {
    const data = await mutate("/api/marketplace/cancel", {
      userId: userData.id,
      landId,
    });

    if (!data) return;

    replaceLand(data.land);
    await refreshLands();
    setMessage("Listing canceled.");
  }

  async function buyMarketLand(landId) {
    const data = await mutate("/api/marketplace/buy", {
      buyerId: userData.id,
      landId,
    });

    if (!data) return;

    setUserData(data.user);
    await refreshLands();
    setMessage(`Bought land. Marketplace burned ${data.fee} coins.`);
  }

  if (!userData && !error) {
    return (
      <main className="grid min-h-screen place-content-center justify-items-center gap-4 text-slate-400">
        <div className="loadingMark" />
        <p>Loading command center...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-295 p-3.5 text-stone-50 md:p-6">
      <HeroPanel hourlyIncome={hourlyIncome} userData={userData} />
      <ControlDock
        busy={busy}
        onClaim={claimIncome}
        onDiscover={discover}
        pendingIncome={pendingIncome}
        userData={userData}
      />
      <StatusBanner error={error} message={message} />
      <StatStrip
        availableCount={availableLands}
        listingCount={marketLands.length}
        ownedCount={ownedLands.length}
      />
      <section className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
        <LandMap activeUserId={activeUserId} lands={lands} />
        <div className="grid gap-3">
          <PortfolioPanel
            busy={busy}
            hourlyIncome={hourlyIncome}
            lands={ownedLands}
            lastClaim={userData?.last_claim}
            onCancelListing={cancelListing}
            onList={listLand}
            onUpgrade={upgradeLand}
          />
          <MarketplacePanel
            activeUserId={activeUserId}
            busy={busy}
            lands={marketLands}
            onBuy={buyMarketLand}
          />
        </div>
      </section>
    </main>
  );
}

async function bootApp() {
  try {
    const tg = window.Telegram?.WebApp;

    if (tg) {
      tg.ready();
      tg.expand();
    }

    const authData = await postJson("/api/auth", {
      initData: tg?.initData || null,
    });
    const landsData = await fetchJson("/api/lands");

    return { authData, landsData };
  } catch (error) {
    return { bootError: error.message };
  }
}

async function fetchJson(url) {
  const res = await fetch(url);

  return res.json();
}

async function postJson(url, payload) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return res.json();
}
