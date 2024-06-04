export type Player = {
  id: string;
  username: string;
  image: string;
  wallet: string;
  points: number;
  boxes: number;
  rank?: number;
  buyPrice?: number;
  sellPrice?: number;
  holdingAmount?: number;
};

export type SponsorHoldings = {
  wallet: string;
  amount: number;
};

export type ChatMessage = {
  message: string;
  timestamp: number;
  username: string;
  image: string;
};

export type BoxNotification = {
  player?: Player | null;
  points: number;
  show: boolean;
};

export type MarkersObject = {
  [id: string]: mapboxgl.Marker;
};

export type GameDate = {
  month: number;
  day: number;
  year: number;
};

export type LocationData = {
  id: string;
  image: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  altitudeAccuracy?: number;
  timestamp: number;
};

export type TransactionData = {
  type: string;
  amount: string;
  subject: string;
  buyer: string;
  timestamp: number;
  signature: string;
};

export enum Page {
  LEADERBOARD,
  TRANSACTIONS,
  CHAT,
  POWERUPS,
  PROFILE,
}

export enum Tab {
  LEADERBOARD,
  CARDS,
}

export enum Sort {
  ASCENDING,
  DESCENDING,
  NONE,
}

export enum Powerup {
  KILL = "killshot",
  MULTIPLIER = "boost",
  MAGNETISM = "magnet",
}

// ---------- DEPRECATED ----------
export type LeaderboardItem = {
  id: string;
  image: string;
  name: string;
  points: number;
  rank: number;
  invitedBy: string;
};
