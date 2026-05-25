
export interface Candidate {
  id: number;
  name: string;
  votes: number;
}

export interface VoterInfo {
  weight: number;
  voted: boolean;
  delegate: string;
  vote?: number;
  isRegistered?: boolean;
}

export interface Position {
  id: number;
  name: string;
  candidateCount: number;
  voter: VoterInfo | null;
  candidates: Candidate[];
}


export type ElectionInfoItem = {
  address: `0x${string}`
  title: string
  description: string
  startTime: number
  endTime: number
  electionType: number
  positionsCount: number
}