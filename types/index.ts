export type User = {
    id: string;
    image: string;
    name: string;
    username: string;
    wallet: string;
    points?: number;
    boost?: number;
  };
  
  export type Invite = {
    id: string;
    code: string;
    claimed: boolean;
    claimedUsername: string | null;
    claimedImage: string | null;
    claimedPoints: number | null;
  };

  export type LeaderboardItem = {
    id: string;
    image: string;
    name: string;
    points: number;
    rank: number;
    invitedBy: string;
  }

  export type Player = {
    id: string;
    username: string;
    image: string;
    wallet: string | null;
    points: number;
    boxes: number;
  };

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
    altitude: number | null;
    altitudeAccuracy: number | null;
    timestamp: number;
  };

  export type MarkersObject = {
    [id: string]: mapboxgl.Marker;
  };

  export type GameDate = {
    month: number;
    day: number;
    year: number;
  }

  export enum Page {
    LEADERBOARD,
    TRANSACTIONS,
    CHAT,
    POWERUPS
  }