export default [
  {
    inputs: [
      {
        internalType: "address",
        name: "_admin",
        type: "address"
      },
      {
        internalType: "address",
        name: "_entropy",
        type: "address"
      },
      {
        internalType: "address",
        name: "_entropyProvider",
        type: "address"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address"
      }
    ],
    name: "AddressEmptyCode",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "AddressInsufficientBalance",
    type: "error"
  },
  {
    inputs: [],
    name: "BaseDenominatorNotSet",
    type: "error"
  },
  {
    inputs: [],
    name: "FailedInnerCall",
    type: "error"
  },
  {
    inputs: [],
    name: "InsufficientBalance",
    type: "error"
  },
  {
    inputs: [],
    name: "InsufficientFee",
    type: "error"
  },
  {
    inputs: [],
    name: "InvalidDepositType",
    type: "error"
  },
  {
    inputs: [],
    name: "InvalidDrawTimes",
    type: "error"
  },
  {
    inputs: [],
    name: "InvalidPoolId",
    type: "error"
  },
  {
    inputs: [],
    name: "NoFundsToWithdraw",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "OwnableInvalidOwner",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error"
  },
  {
    inputs: [],
    name: "PoolNotEnded",
    type: "error"
  },
  {
    inputs: [],
    name: "PrizeClaimed",
    type: "error"
  },
  {
    inputs: [],
    name: "ReentrancyGuardReentrantCall",
    type: "error"
  },
  {
    inputs: [],
    name: "RewardAlreadyDeposited",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address"
      }
    ],
    name: "SafeERC20FailedOperation",
    type: "error"
  },
  {
    inputs: [],
    name: "TokenAlreadyInWhitelist",
    type: "error"
  },
  {
    inputs: [],
    name: "TokenNotInWhitelist",
    type: "error"
  },
  {
    inputs: [],
    name: "TokenNotWhitelisted",
    type: "error"
  },
  {
    inputs: [],
    name: "Unauthorized",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "poolId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "address",
        name: "penaltyToken",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "penalty",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "address",
        name: "rewardToken",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "rewardAmount",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "nftIds",
        type: "uint256[]"
      },
      {
        indexed: false,
        internalType: "address",
        name: "creator",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalSpent",
        type: "uint256"
      }
    ],
    name: "ActivityCancelled",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "poolId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "address",
        name: "purchaseToken",
        type: "address"
      }
    ],
    name: "AdminFeesWithdrawn",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "poolId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "address",
        name: "claimant",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "ClaimedERC20",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "poolId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "address",
        name: "claimant",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "nft",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "tokenIds",
        type: "uint256[]"
      }
    ],
    name: "ClaimedERC721",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "poolId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "address",
        name: "purchaseToken",
        type: "address"
      }
    ],
    name: "CreatorFundsWithdrawn",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "poolId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "address",
        name: "nft",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "tokenIds",
        type: "uint256[]"
      },
      {
        indexed: false,
        internalType: "address",
        name: "depositor",
        type: "address"
      }
    ],
    name: "DepositedERC721",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "poolId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "address",
        name: "depositor",
        type: "address"
      }
    ],
    name: "DepositedToken",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "poolId",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "times",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "entropyFee",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "sequenceNumber",
        type: "uint64"
      },
      {
        indexed: false,
        internalType: "address",
        name: "purchaseToken",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "drawFee",
        type: "uint256"
      }
    ],
    name: "DrawAttempt",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "poolId",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "times",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isWinner",
        type: "bool"
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "randomNumber",
        type: "bytes32"
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "status",
        type: "uint8"
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "sequenceNumber",
        type: "uint64"
      },
      {
        indexed: false,
        internalType: "address",
        name: "purchaseToken",
        type: "address"
      }
    ],
    name: "DrawResult",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        indexed: false,
        internalType: "bool",
        name: "allowed",
        type: "bool"
      }
    ],
    name: "ERC20RewardTokenWhitelistUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        indexed: false,
        internalType: "bool",
        name: "allowed",
        type: "bool"
      }
    ],
    name: "ERC721RewardTokenWhitelistUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "entropy",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "entropyProvider",
        type: "address"
      }
    ],
    name: "EntropyAndProviderUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "poolId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "address",
        name: "purchaseToken",
        type: "address"
      }
    ],
    name: "PenaltyClaimed",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "poolId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "PenaltyWithdrawn",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "poolId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "address",
        name: "purchaseToken",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "rewardToken",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "rewardAmount",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "nftIds",
        type: "uint256[]"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "drawFee",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "anchorPrice",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "address",
        name: "creator",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "baseDenominator",
        type: "uint256"
      }
    ],
    name: "PoolCreated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "poolId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "lockStartTime",
        type: "uint256"
      }
    ],
    name: "PoolLocked",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "poolId",
        type: "uint256"
      }
    ],
    name: "PoolUnlocked",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        indexed: false,
        internalType: "bool",
        name: "allowed",
        type: "bool"
      }
    ],
    name: "PurchaseTokenWhitelistUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "poolId",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "times",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "entropyFee",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "sequenceNumber",
        type: "uint64"
      },
      {
        indexed: false,
        internalType: "address",
        name: "purchaseToken",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "drawFee",
        type: "uint256"
      }
    ],
    name: "SponsoredDrawAttempt",
    type: "event"
  },
  {
    inputs: [],
    name: "K",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "sequence",
        type: "uint64"
      },
      {
        internalType: "address",
        name: "provider",
        type: "address"
      },
      {
        internalType: "bytes32",
        name: "randomNumber",
        type: "bytes32"
      }
    ],
    name: "_entropyCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "admin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "poolIds",
        type: "uint256[]"
      }
    ],
    name: "adminExtractPenalty",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "poolIds",
        type: "uint256[]"
      }
    ],
    name: "batchExtractAdminFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "poolIds",
        type: "uint256[]"
      }
    ],
    name: "batchExtractCreatorFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "poolId",
        type: "uint256"
      }
    ],
    name: "calculateFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "times",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "baseDenominator",
        type: "uint256"
      },
      {
        internalType: "bytes32",
        name: "randomNumber",
        type: "bytes32"
      }
    ],
    name: "calculateWinProbabilities",
    outputs: [
      {
        internalType: "uint256",
        name: "actualProb",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "threshold",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "error",
        type: "uint256"
      },
      {
        internalType: "bool",
        name: "isWinner",
        type: "bool"
      }
    ],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "poolId",
        type: "uint256"
      }
    ],
    name: "cancelActivity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "poolId",
        type: "uint256"
      }
    ],
    name: "claimPenalty",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "poolId",
        type: "uint256"
      }
    ],
    name: "claimReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_purchaseToken",
        type: "address"
      },
      {
        internalType: "address",
        name: "_rewardToken",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "_rewardAmount",
        type: "uint256"
      },
      {
        internalType: "uint256[]",
        name: "_nftIds",
        type: "uint256[]"
      },
      {
        internalType: "uint256",
        name: "_drawFee",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "_anchorPrice",
        type: "uint256"
      }
    ],
    name: "createPool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "poolId",
        type: "uint256"
      }
    ],
    name: "depositReward",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "poolId",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "times",
        type: "uint256"
      },
      {
        internalType: "bytes32",
        name: "userRandomNumber",
        type: "bytes32"
      }
    ],
    name: "drawMultiple",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "poolId",
        type: "uint256"
      },
      {
        internalType: "bytes32",
        name: "userRandomNumber",
        type: "bytes32"
      }
    ],
    name: "drawOnce",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint64",
        name: "",
        type: "uint64"
      }
    ],
    name: "drawRequests",
    outputs: [
      {
        internalType: "address",
        name: "user",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "times",
        type: "uint256"
      },
      {
        internalType: "bytes32",
        name: "randomNumber",
        type: "bytes32"
      },
      {
        internalType: "bool",
        name: "isWinner",
        type: "bool"
      },
      {
        internalType: "uint8",
        name: "status",
        type: "uint8"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "entropy",
    outputs: [
      {
        internalType: "contract IEntropy",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "entropyFund",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "entropyProvider",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "feeTiers",
    outputs: [
      {
        internalType: "uint256",
        name: "percentage",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "rate",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getAllWhitelistedTokens",
    outputs: [
      {
        internalType: "address[]",
        name: "purchaseTokens",
        type: "address[]"
      },
      {
        internalType: "address[]",
        name: "erc20RewardTokens",
        type: "address[]"
      },
      {
        internalType: "address[]",
        name: "erc721RewardTokens",
        type: "address[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "poolId",
        type: "uint256"
      }
    ],
    name: "getConfig",
    outputs: [
      {
        internalType: "address",
        name: "purchaseToken",
        type: "address"
      },
      {
        internalType: "address",
        name: "rewardToken",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "rewardAmount",
        type: "uint256"
      },
      {
        internalType: "uint256[]",
        name: "nftIds",
        type: "uint256[]"
      },
      {
        internalType: "uint256",
        name: "drawFee",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "anchorPrice",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "creator",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getFlipFee",
    outputs: [
      {
        internalType: "uint256",
        name: "fee",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "poolId",
        type: "uint256"
      }
    ],
    name: "getPenalty",
    outputs: [
      {
        internalType: "uint256",
        name: "penalty",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "poolId",
        type: "uint256"
      }
    ],
    name: "getPoolState",
    outputs: [
      {
        internalType: "uint256",
        name: "baseDenominator",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "totalSpent",
        type: "uint256"
      },
      {
        internalType: "bool",
        name: "isCanceled",
        type: "bool"
      },
      {
        internalType: "uint8",
        name: "purchaseTokenDecimals",
        type: "uint8"
      },
      {
        internalType: "address",
        name: "winner",
        type: "address"
      },
      {
        internalType: "bool",
        name: "prizeClaimed",
        type: "bool"
      },
      {
        internalType: "bool",
        name: "isRewardDeposited",
        type: "bool"
      },
      {
        internalType: "bool",
        name: "isCreatorFundsClaimed",
        type: "bool"
      },
      {
        internalType: "bool",
        name: "isAdminFeesClaimed",
        type: "bool"
      },
      {
        internalType: "uint256",
        name: "adminPenalty",
        type: "uint256"
      },
      {
        internalType: "bool",
        name: "isLocked",
        type: "bool"
      },
      {
        internalType: "uint256",
        name: "lockStartTime",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "poolId",
        type: "uint256"
      }
    ],
    name: "getRefundableRequestsPaginated",
    outputs: [
      {
        internalType: "uint64[]",
        name: "allSequenceNumbers",
        type: "uint64[]"
      },
      {
        internalType: "uint64[]",
        name: "refundable",
        type: "uint64[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "poolId",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "user",
        type: "address"
      }
    ],
    name: "getUserPendingPenalty",
    outputs: [
      {
        internalType: "uint256",
        name: "pendingAmount",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "lockDuration",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "poolId",
        type: "uint256"
      }
    ],
    name: "lockPool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "nextPoolId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "penaltyClaimed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "poolConfigs",
    outputs: [
      {
        internalType: "address",
        name: "purchaseToken",
        type: "address"
      },
      {
        internalType: "address",
        name: "rewardToken",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "rewardAmount",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "drawFee",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "anchorPrice",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "creator",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "poolStates",
    outputs: [
      {
        internalType: "uint256",
        name: "baseDenominator",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "totalSpent",
        type: "uint256"
      },
      {
        internalType: "bool",
        name: "isCanceled",
        type: "bool"
      },
      {
        internalType: "uint8",
        name: "purchaseTokenDecimals",
        type: "uint8"
      },
      {
        internalType: "address",
        name: "winner",
        type: "address"
      },
      {
        internalType: "bool",
        name: "prizeClaimed",
        type: "bool"
      },
      {
        internalType: "bool",
        name: "isRewardDeposited",
        type: "bool"
      },
      {
        internalType: "bool",
        name: "isCreatorFundsClaimed",
        type: "bool"
      },
      {
        internalType: "bool",
        name: "isAdminFeesClaimed",
        type: "bool"
      },
      {
        internalType: "uint256",
        name: "adminPenalty",
        type: "uint256"
      },
      {
        internalType: "bool",
        name: "isLocked",
        type: "bool"
      },
      {
        internalType: "uint256",
        name: "lockStartTime",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "poolId",
        type: "uint256"
      },
      {
        internalType: "uint64",
        name: "sequenceNumber",
        type: "uint64"
      }
    ],
    name: "refundDraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64"
      }
    ],
    name: "sequenceToPoolId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newDuration",
        type: "uint256"
      }
    ],
    name: "setLockDuration",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_paused",
        type: "bool"
      }
    ],
    name: "setPaused",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "poolId",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "times",
        type: "uint256"
      },
      {
        internalType: "bytes32",
        name: "userRandomNumber",
        type: "bytes32"
      }
    ],
    name: "sponsoredDraw",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "poolId",
        type: "uint256"
      }
    ],
    name: "unlockPool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        internalType: "bool",
        name: "allowed",
        type: "bool"
      }
    ],
    name: "updateERC20RewardTokenWhitelist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        internalType: "bool",
        name: "allowed",
        type: "bool"
      }
    ],
    name: "updateERC721RewardTokenWhitelist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newEntropy",
        type: "address"
      },
      {
        internalType: "address",
        name: "newEntropyProvider",
        type: "address"
      }
    ],
    name: "updateEntropyAndProvider",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "percentages",
        type: "uint256[]"
      },
      {
        internalType: "uint256[]",
        name: "rates",
        type: "uint256[]"
      }
    ],
    name: "updateFeeTiers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        internalType: "bool",
        name: "allowed",
        type: "bool"
      }
    ],
    name: "updatePurchaseTokenWhitelist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "userDrawRequests",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "withdrawEntropyFund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    stateMutability: "payable",
    type: "receive"
  }
];