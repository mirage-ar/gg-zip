export type Player = {
  id: string;
  username: string;
  image: string;
  wallet: string;
  points: number;
  boxes: number;
  gamePoints?: number;
  rank?: number;
  buyPrice?: number;
  sellPrice?: number;
  amount?: number;
  cardCount?: number;
};

export type Sponsor = {
  id: string;
  username: string;
  image: string;
  wallet: string;
  points: number;
  gamePoints?: number;
  rank?: number;
  holdings?: SponsorHoldings[];
};

export type TwitterUser = {
  id: string;
  username: string;
  image: string;
  wallet: string;
};

export type SponsorHoldings = {
  wallet: string;
  amount: number;
  percentage?: number;
};

export type ChatMessage = {
  message: string;
  timestamp: number;
  username: string;
  image: string;
  source: string;
  type: string;
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
  SPONSORS,
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
