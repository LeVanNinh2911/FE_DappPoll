import { readContract } from "wagmi/actions"
import type { Address } from "viem"

import { config } from "../config/config"

import { ElectionABI } from "../config/ElectionPollABI"
import { ElectionCompanyABI } from "../config/ElectionCompanyABIs"

export async function readElectionInfo(
  address: `0x${string}`
) {

  const data = await readContract(config, {
    address,
    abi: ElectionABI,
    functionName: "getElectionInfo",
  }) as readonly [
    string,
    string,
    bigint,
    bigint,
    Address,
    Address,
    bigint,
    bigint
  ]

  return {
    address,

    title: data[0],
    description: data[1],

    startTime: Number(data[2]),
    endTime: Number(data[3]),

    creator: data[4],
    factory: data[5],

    electionType: Number(data[6]),

    positionsCount: Number(data[7]),
  }
}

export async function readPositionsCount(
  address: `0x${string}`
): Promise<number> {

  const count = await readContract(config, {
    address,
    abi: ElectionABI,
    functionName: "getPositionsCount",
  }) as bigint

  return Number(count)
}


export async function readPosition(
  address: `0x${string}`,
  positionId: number
) {


  try {

    const data = await readContract(config, {
      address,
      abi: ElectionCompanyABI,
      functionName: "getCulcumlatePosition",
      args: [BigInt(positionId)],
    }) as readonly [string, bigint, bigint,bigint, bigint,bigint]

    return {
      id: positionId,

      name: data[0],

      // company
      seats: Number(data[1]),

      // voteType: Number(data[2]),

      // minSelect: Number(data[3]),

      // maxSelect: Number(data[4]),

      // shared
      candidatesCount: Number(data[5]),

      contractType: "COMPANY",
    }

  } catch (error){
    console.log(error)
  }

  const data = await readContract(config, {
    address,
    abi: ElectionABI,
    functionName: "getPosition",
    args: [BigInt(positionId)],
  }) as readonly [string, bigint, bigint,bigint, bigint]

  return {
    id: positionId,

    name: data[0],

    // basic
    voteType: Number(data[1]),

    // shared
    minSelect: Number(data[2]),

    maxSelect: Number(data[3]),

    candidatesCount: Number(data[4]),

    // company fallback
    seats: null,

    contractType: "BASIC",
  }
}

export async function readCandidates(
  address: `0x${string}`,
  positionId: number
) {

  const data = await readContract(config, {
    address,
    abi: ElectionABI,
    functionName: "getCandidates",
    args: [BigInt(positionId)],
  }) as readonly {
    name: string
    voteCount: bigint
  }[]

  return data.map((c, index) => ({
    id: index,
    name: c.name,
    voteCount: Number(c.voteCount),
  }))
}

export async function readCandidate(
  address: `0x${string}`,
  positionId: number,
  candidateId: number
) {

  const candidates = await readCandidates(address, positionId)

  return candidates[candidateId]
}

export async function readVoter(
  address: `0x${string}`,
  positionId: number,
  voter: Address
) {

  try {

    const data = await readContract(config, {
      address,
      abi: ElectionCompanyABI,
      functionName: "getVoter",
      args: [BigInt(positionId), voter],
    }) as readonly [
      bigint,
      bigint,
      boolean,
      Address,
      readonly {
        candidateId: bigint
        votes: bigint
      }[]
    ]

    return {
      // company
      shares: Number(data[0]),
      totalVotingPower: Number(data[1]),

      // shared
      voted: data[2],
      delegate: data[3],

      allocations: data[4].map((a) => ({
        candidateId: Number(a.candidateId),
        votes: Number(a.votes),
      })),

      // basic fallback
      weight: null,
      votedCandidateIds: [],

      contractType: "COMPANY",
    }

  } catch (error){
    console.log(error)
  }

  const data = await readContract(config, {
    address,
    abi: ElectionABI,
    functionName: "getVoter",
    args: [BigInt(positionId), voter],
  }) as readonly [
    bigint,
    boolean,
    Address,
    bigint[]
  ]

  return {
    // basic
    weight: Number(data[0]),

    // shared
    voted: data[1],
    delegate: data[2],

    votedCandidateIds: data[3].map(Number),

    // company fallback
    shares: null,
    totalVotingPower: null,
    allocations: [],

    contractType: "BASIC",
  }
}

export async function readWinner(
  address: `0x${string}`,
  positionId: number
) {

  try {

    const data = await readContract(config, {
      address,
      abi: ElectionCompanyABI,
      functionName: "getWinners",
      args: [BigInt(positionId)],
    }) as readonly [
      bigint[],
      string[],
      bigint[]
    ]

    return {
      winnerIds: data[0].map(Number),
      names: data[1],
      votes: data[2].map(Number),

      contractType: "COMPANY",
    }

  } catch (error){
    console.log(error)
  }

  const data = await readContract(config, {
    address,
    abi: ElectionABI,
    functionName: "getWinner",
    args: [BigInt(positionId)],
  }) as readonly [
    bigint,
    string,
    bigint
  ]

  return {
    winnerIds: [Number(data[0])],
    names: [data[1]],
    votes: [Number(data[2])],

    contractType: "BASIC",
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
      ...pos,
      candidates,
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
    positions,
  }
}