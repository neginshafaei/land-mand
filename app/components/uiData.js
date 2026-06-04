export const rarityMeta = {
  Common: { color: "#a7b0bb", glow: "rgba(167, 176, 187, 0.18)" },
  Rare: { color: "#20b7e8", glow: "rgba(32, 183, 232, 0.2)" },
  Epic: { color: "#b970ff", glow: "rgba(185, 112, 255, 0.22)" },
  Legendary: { color: "#f5a524", glow: "rgba(245, 165, 36, 0.24)" },
};

export function formatCoins(value) {
  return Number(value || 0).toLocaleString("en-US");
}

export function formatIncomePerSecond(hourlyIncome) {
  const perSecond = Number(hourlyIncome || 0) / 3600;

  if (perSecond >= 1) return `${perSecond.toFixed(1)}/s`;
  if (perSecond >= 0.01) return `${perSecond.toFixed(2)}/s`;

  return `${perSecond.toFixed(3)}/s`;
}

export function getEffectiveIncome(land) {
  const multiplier = 1.8 ** ((land.level || 1) - 1);

  return Math.round((land.income_per_hour || 0) * multiplier);
}

export function getLevelMultiplier(level) {
  return 1.8 ** ((level || 1) - 1);
}

export function getPendingLandIncome(land, lastClaim) {
  if (!lastClaim) return 0;

  const elapsedMs = Math.max(0, Date.now() - new Date(lastClaim).getTime());
  const elapsedHours = elapsedMs / (1000 * 60 * 60);

  return Math.floor(getEffectiveIncome(land) * elapsedHours);
}

export function getPendingTotalIncome(lands, lastClaim) {
  return lands.reduce(
    (sum, land) => sum + getPendingLandIncome(land, lastClaim),
    0,
  );
}
