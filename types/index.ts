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