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
};

export type SponsorHoldings = {
  wallet: string;
  amount: number;
};

// export type Sponsor = {
//   id: string;
//   username: string;
//   image: string;
//   wallet: string;
//   boxes: number;
// };

export type ChatMessage = {
  message: string;
  timestamp: number;
  username: string;
  image: string;
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

export type MarkersObject = {
  [id: string]: mapboxgl.Marker;
};

export type GameDate = {
  month: number;
  day: number;
  year: number;
};

export enum Page {
  LEADERBOARD,
  TRANSACTIONS,
  CHAT,
  POWERUPS,
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

export type TransactionData = {
  type: string;
  amount: string;
  subject: string;
  buyer: string;
  timestamp: number;
  signature: string;
};

// ---------- DEPRECATED ----------
export type LeaderboardItem = {
  id: string;
  image: string;
  name: string;
  points: number;
  rank: number;
  invitedBy: string;
};