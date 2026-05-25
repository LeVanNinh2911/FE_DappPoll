import { readContract } from "wagmi/actions"
import { config } from "../config/config"
import type { Address } from "viem"
import { ElectionCompanyABI } from "../config/ElectionCompanyABIs"

export async function readElectionInfo(address: `0x${string}`) {
  const positionsCount = await readPositionsCount(address)
  const data = await readContract(config, {
    address,
    abi: ElectionCompanyABI,
    functionName: "getElectionInfo",
  }) as readonly [
    string,
    string,
    bigint,
    bigint,
    Address,
    Address,
    number,
    bigint
  ]

  return {
    title: data[0],
    description: data[1],
    startTime: Number(data[2]),
    endTime: Number(data[3]),
    creator: data[4],
    electionType: Number(data[6]),
    positionsCount: positionsCount,
  }
}

export async function readPositionsCount(
  address: `0x${string}`
): Promise<number> {

  const count = await readContract(config, {
    address,
    abi: ElectionCompanyABI,
    functionName: "getPositionsCount",
  }) as bigint

  return Number(count)
}


export async function readPosition(
  address: `0x${string}`,
  positionId: number
) {

  const data = await readContract(config, {
    address,
    abi: ElectionCompanyABI,
    functionName: "getPosition",
    args: [BigInt(positionId)],
  }) as readonly [string,number,number,number, bigint]

  return {
    id: positionId,
    name: data[0],
    voteType: data[1],
    minSelect: data[2],
    maxSelect: data[3],
    candidatesCount: Number(data[4]),
  }
}

export async function readCandidates(
  address: `0x${string}`,
  positionId: number
) {

  const data = await readContract(config, {
    address,
    abi: ElectionCompanyABI,
    functionName: "getCandidates",
    args: [BigInt(positionId)],
  }) as readonly { name: string; voteCount: bigint }[]

  return data.map((c) => ({
    name: c.name,
    voteCount: Number(c.voteCount),
  }))
}


export async function readCandidate(
  address: `0x${string}`,
  positionId: number,
  candidateId: number
) {

  const data = await readContract(config, {
    address,
    abi: ElectionCompanyABI,
    functionName: "getCandidate",
    args: [BigInt(positionId), BigInt(candidateId)],
  }) as readonly [string, bigint]

  return {
    name: data[0],
    voteCount: Number(data[1]),
  }
}

export async function readVoter(
  address: `0x${string}`,
  positionId: number,
  voter: Address
) {

  const data = await readContract(config, {
    address,
    abi: ElectionCompanyABI,
    functionName: "getVoter",
    args: [BigInt(positionId), voter],
  }) as readonly [bigint, boolean, Address, bigint,boolean]

  return {
    weight: Number(data[0]),
    voted: data[1],
    delegate: data[2],
    vote: Number(data[3]),
    isRegistered: data[4]
  }
}

export async function readWinner(
  address: `0x${string}`,
  positionId: number
) {

  const data = await readContract(config, {
    address,
    abi: ElectionCompanyABI,
    functionName: "getWinner",
    args: [BigInt(positionId)],
  }) as readonly [bigint, string, bigint]

  return {
    winnerId: Number(data[0]),
    name: data[1],
    votes: Number(data[2]),
  }
}


export async function readPositionList(
  address: `0x${string}`
) {

  const count = await readPositionsCount(address)

  const positions = []

  for (let i = 0; i < count; i++) {

    const pos = await readPosition(address, i)

    const candidates = await readCandidates(address, i)

    positions.push({
      id: pos.id,
      name: pos.name,
      voteType: pos.voteType,
      minSelect: pos.minSelect,
      maxSelect: pos.maxSelect,
      candidates
    })

  }

  return positions
}


export async function readFullElection(
  address: `0x${string}`
) {

  const election = await readElectionInfo(address)

  const positions = await readPositionList(address)

  return {
    ...election,
    positions
  }
}
