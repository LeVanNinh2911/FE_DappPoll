export const ElectionFactoryABI= [
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "_accessControl",
						"type": "address"
					}
				],
				"stateMutability": "nonpayable",
				"type": "constructor"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "electionId",
						"type": "uint256"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "electionAddress",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "creator",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "enum Types.ResultVisibility",
						"name": "resultVisibility",
						"type": "uint8"
					}
				],
				"name": "ElectionCreated",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "voter",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "electionAddress",
						"type": "address"
					}
				],
				"name": "ParticipationRecorded",
				"type": "event"
			},
			{
				"inputs": [],
				"name": "accessControl",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "string",
						"name": "title",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "startTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "endTime",
						"type": "uint256"
					},
					{
						"internalType": "enum Types.ElectionType",
						"name": "electionType",
						"type": "uint8"
					},
					{
						"components": [
							{
								"internalType": "string",
								"name": "name",
								"type": "string"
							},
							{
								"internalType": "enum Types.VoteType",
								"name": "voteType",
								"type": "uint8"
							},
							{
								"internalType": "uint256",
								"name": "minSelect",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "maxSelect",
								"type": "uint256"
							},
							{
								"internalType": "string[]",
								"name": "candidates",
								"type": "string[]"
							},
							{
								"internalType": "address[]",
								"name": "voters",
								"type": "address[]"
							}
						],
						"internalType": "struct Types.PositionInput[]",
						"name": "positions",
						"type": "tuple[]"
					},
					{
						"internalType": "enum Types.ResultVisibility",
						"name": "resultVisibility",
						"type": "uint8"
					}
				],
				"name": "createElection",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "electionCount",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"name": "electionOwner",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"name": "elections",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "user",
						"type": "address"
					}
				],
				"name": "getCreatedElectionsByUser",
				"outputs": [
					{
						"internalType": "address[]",
						"name": "",
						"type": "address[]"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					}
				],
				"name": "getElection",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "user",
						"type": "address"
					}
				],
				"name": "getParticipatedElectionsByUser",
				"outputs": [
					{
						"internalType": "address[]",
						"name": "",
						"type": "address[]"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "electionAddr",
						"type": "address"
					}
				],
				"name": "getResultVisibility",
				"outputs": [
					{
						"internalType": "enum Types.ResultVisibility",
						"name": "",
						"type": "uint8"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"name": "isValidElection",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "voter",
						"type": "address"
					}
				],
				"name": "recordParticipation",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"name": "resultVisibilityByElection",
				"outputs": [
					{
						"internalType": "enum Types.ResultVisibility",
						"name": "",
						"type": "uint8"
					}
				],
				"stateMutability": "view",
				"type": "function"
			}
		]

export const ElectionABI = [
			{
				"inputs": [
					{
						"internalType": "string",
						"name": "_title",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "_description",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "_startTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_endTime",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "_creator",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "_factory",
						"type": "address"
					},
					{
						"internalType": "enum Types.ElectionType",
						"name": "_type",
						"type": "uint8"
					},
					{
						"components": [
							{
								"internalType": "string",
								"name": "name",
								"type": "string"
							},
							{
								"internalType": "enum Types.VoteType",
								"name": "voteType",
								"type": "uint8"
							},
							{
								"internalType": "uint256",
								"name": "minSelect",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "maxSelect",
								"type": "uint256"
							},
							{
								"internalType": "string[]",
								"name": "candidates",
								"type": "string[]"
							},
							{
								"internalType": "address[]",
								"name": "voters",
								"type": "address[]"
							}
						],
						"internalType": "struct Types.PositionInput[]",
						"name": "_positions",
						"type": "tuple[]"
					},
					{
						"internalType": "address",
						"name": "_accessControl",
						"type": "address"
					}
				],
				"stateMutability": "nonpayable",
				"type": "constructor"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "positionId",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "address",
						"name": "from",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "address",
						"name": "to",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "weight",
						"type": "uint256"
					}
				],
				"name": "Delegated",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "positionId",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "uint256[]",
						"name": "candidateIds",
						"type": "uint256[]"
					},
					{
						"indexed": false,
						"internalType": "address",
						"name": "voter",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "weight",
						"type": "uint256"
					}
				],
				"name": "VoteCast",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "positionId",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "address",
						"name": "voter",
						"type": "address"
					}
				],
				"name": "VoterAdded",
				"type": "event"
			},
			{
				"inputs": [],
				"name": "accessControl",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "positionId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "voter",
						"type": "address"
					}
				],
				"name": "addVoter",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "creator",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "positionId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "to",
						"type": "address"
					}
				],
				"name": "delegateVote",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "description",
				"outputs": [
					{
						"internalType": "string",
						"name": "",
						"type": "string"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "electionType",
				"outputs": [
					{
						"internalType": "enum Types.ElectionType",
						"name": "",
						"type": "uint8"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "endTime",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "factory",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "positionId",
						"type": "uint256"
					}
				],
				"name": "getCandidates",
				"outputs": [
					{
						"components": [
							{
								"internalType": "string",
								"name": "name",
								"type": "string"
							},
							{
								"internalType": "uint256",
								"name": "voteCount",
								"type": "uint256"
							}
						],
						"internalType": "struct Types.Candidate[]",
						"name": "",
						"type": "tuple[]"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "getElectionInfo",
				"outputs": [
					{
						"internalType": "string",
						"name": "_title",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "_description",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "_startTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_endTime",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "_creator",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "_factory",
						"type": "address"
					},
					{
						"internalType": "enum Types.ElectionType",
						"name": "_type",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "positionsCount",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "positionId",
						"type": "uint256"
					}
				],
				"name": "getPosition",
				"outputs": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "enum Types.VoteType",
						"name": "voteType",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "minSelect",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "maxSelect",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "candidatesCount",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "getPositionsCount",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "positionId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "voter",
						"type": "address"
					}
				],
				"name": "getVoter",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "weight",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "voted",
						"type": "bool"
					},
					{
						"internalType": "address",
						"name": "delegate",
						"type": "address"
					},
					{
						"internalType": "uint256[]",
						"name": "votedCandidateIds",
						"type": "uint256[]"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "positionId",
						"type": "uint256"
					}
				],
				"name": "getWinner",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "winnerId",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "votes",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "startTime",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "title",
				"outputs": [
					{
						"internalType": "string",
						"name": "",
						"type": "string"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "positionId",
						"type": "uint256"
					},
					{
						"internalType": "uint256[]",
						"name": "candidateIds",
						"type": "uint256[]"
					}
				],
				"name": "vote",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			}
		]

export const ElectionAccessControlABI =  [
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "election",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "positionId",
						"type": "uint256"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "voter",
						"type": "address"
					}
				],
				"name": "AccessApproved",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "election",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "positionId",
						"type": "uint256"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "voter",
						"type": "address"
					}
				],
				"name": "AccessRejected",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "election",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "positionId",
						"type": "uint256"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "voter",
						"type": "address"
					}
				],
				"name": "AccessRequested",
				"type": "event"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "election",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "positionId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "voter",
						"type": "address"
					}
				],
				"name": "approveVoter",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "election",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "positionId",
						"type": "uint256"
					}
				],
				"name": "getPendingRequestsCount",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "election",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "positionId",
						"type": "uint256"
					}
				],
				"name": "getRequests",
				"outputs": [
					{
						"internalType": "address[]",
						"name": "",
						"type": "address[]"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "election",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "positionId",
						"type": "uint256"
					}
				],
				"name": "getRequestsWithCount",
				"outputs": [
					{
						"internalType": "address[]",
						"name": "",
						"type": "address[]"
					},
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "election",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "positionId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "voter",
						"type": "address"
					}
				],
				"name": "getVoterStatus",
				"outputs": [
					{
						"internalType": "bool",
						"name": "requested",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "approved",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"name": "hasRequested",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"name": "isApproved",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "election",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "positionId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "voter",
						"type": "address"
					}
				],
				"name": "rejectVoter",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "election",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "positionId",
						"type": "uint256"
					}
				],
				"name": "requestAccess",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			}
		]