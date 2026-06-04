export const DISCOVER_STANDARD_PRICE = 100;
export const DISCOVER_PREMIUM_PRICE = 500;
export const MARKETPLACE_FEE_RATE = 0.05;

export const RARITY_INCOME = {
  Common: 1,
  Rare: 3,
  Epic: 7,
  Legendary: 20,
};

const STANDARD_RARITY_TABLE = [
  { rarity: "Common", max: 70 },
  { rarity: "Rare", max: 90 },
  { rarity: "Epic", max: 99 },
  { rarity: "Legendary", max: 100 },
];

const PREMIUM_RARITY_TABLE = [
  { rarity: "Rare", max: 40 },
  { rarity: "Epic", max: 80 },
  { rarity: "Legendary", max: 100 },
];

export function normalizeDiscoverPrice(price) {
  const numericPrice = Number(price);

  if (numericPrice === DISCOVER_STANDARD_PRICE) return DISCOVER_STANDARD_PRICE;
  if (numericPrice === DISCOVER_PREMIUM_PRICE) return DISCOVER_PREMIUM_PRICE;

  return null;
}

export function rollRarity(price) {
  const table =
    price === DISCOVER_PREMIUM_PRICE ? PREMIUM_RARITY_TABLE : STANDARD_RARITY_TABLE;
  const roll = Math.random() * 100;

  return table.find((entry) => roll < entry.max)?.rarity || "Common";
}

export function getIncomeByRarity(rarity) {
  return RARITY_INCOME[rarity] || RARITY_INCOME.Common;
}

export function getUpgradeCost(level) {
  return Number(level || 1) * 200;
}

export function getLevelIncome(baseIncome, level) {
  const multiplier = 1.8 ** (Number(level || 1) - 1);

  return Math.round(Number(baseIncome || 0) * multiplier);
}

export function calculateLandIncome(land) {
  return getLevelIncome(land.income_per_hour, land.level);
}

export function calculateClaimAmount(lands, lastClaim, now = new Date()) {
  const claimFrom = lastClaim ? new Date(lastClaim) : now;
  const elapsedMs = Math.max(0, now.getTime() - claimFrom.getTime());
  const elapsedHours = elapsedMs / (1000 * 60 * 60);
  const hourlyIncome = lands.reduce(
    (sum, land) => sum + calculateLandIncome(land),
    0,
  );

  return Math.floor(hourlyIncome * elapsedHours);
}

export function calculateSellerPayout(price) {
  return Math.floor(Number(price) * (1 - MARKETPLACE_FEE_RATE));
}
