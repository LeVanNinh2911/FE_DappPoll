export interface CandidateInput{
  name: string;
  decription: string;
  image: string;
  imported?: boolean
  errors?: string[]
}

export interface VoterInput {
  name: string;
  addressWallet: `0x${string}`;
  shares?: number
}

export interface PositionInput {
  name: string;
  description?: string;
  voteType: number;
  candidates: CandidateInput[];
  voters: VoterInput[];
  multiType?: "unlimited" | "exact" | "range"
  minSelect?: number
  maxSelect?: number
  seats?: number
  // shares?: number[]
}
