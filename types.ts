
export type TournamentType = 'ESPORTS' | 'SPORTS';
export type GameFormat = 'SOLO' | 'DUO' | 'SQUAD';
export type TournamentStatus = 'UPCOMING' | 'LIVE' | 'COMPLETED';

export interface User {
  id: string;
  email: string;
  name: string;
  bio: string;
  avatar: string;
  joinedAt: string;
}

export interface Participant {
  userId: string;
  name: string;
  avatar?: string;
  teamId?: string;
  teamName?: string;
  registeredAt: string;
}

export interface Team {
  id: string;
  name: string;
  captainId: string;
  members: string[]; // User IDs
  tournamentId: string;
}

export interface Tournament {
  id: string;
  hostId: string;
  title: string;
  description: string;
  type: TournamentType;
  gameName: string;
  format: GameFormat;
  startDate: string;
  startTime: string;
  maxParticipants: number; // Max individuals or Max Teams depending on format
  entryFee: number;
  participants: Participant[];
  teams: Team[];
  status: TournamentStatus;
  prizes: {
    first: string;
    second: string;
    third: string;
  };
  roomId?: string;
  roomPassword?: string;
  winner?: Participant | null; // Or winner team
  rules?: string;
  hypeMessage?: string;
  createdAt: string;
}

export interface Match {
  id: string;
  round: number;
  position: number;
  status: 'SCHEDULED' | 'LIVE' | 'COMPLETED';
  winnerId?: string | null;
  p1Id: string | null;
  p2Id: string | null;
  p1Score?: string | number;
  p2Score?: string | number;
}

export interface CreateTournamentDTO {
  title: string;
  description: string;
  type: TournamentType;
  gameName: string;
  format: GameFormat;
  startDate: string;
  startTime: string;
  maxParticipants: number;
  entryFee: number;
  prizes: {
    first: string;
    second: string;
    third: string;
  };
  roomId?: string;
  roomPassword?: string;
}
