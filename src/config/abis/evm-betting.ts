export default [
  {
    inputs: [
      {
        internalType: "address",
        name: "_wormholeAddress",
        type: "address"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [],
    name: "ECDSAInvalidSignature",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "length",
        type: "uint256"
      }
    ],
    name: "ECDSAInvalidSignatureLength",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32"
      }
    ],
    name: "ECDSAInvalidSignatureS",
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
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes16",
        name: "userType",
        type: "bytes16"
      },
      {
        indexed: false,
        internalType: "address",
        name: "userAddress",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "nftId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "address",
        name: "nftContract",
        type: "address"
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "payload",
        type: "bytes"
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "sequence",
        type: "uint64"
      }
    ],
    name: "CrossChainMessageSent",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "nftContract",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "userAddress",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "nftId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "address",
        name: "signer",
        type: "address"
      }
    ],
    name: "MessageProcessed",
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
    inputs: [
      {
        internalType: "uint8",
        name: "v",
        type: "uint8"
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32"
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32"
      }
    ],
    name: "assembleSignature",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      }
    ],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [],
    name: "currentNonce",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "payload",
        type: "bytes"
      }
    ],
    name: "decodeCrossChainMessage",
    outputs: [
      {
        internalType: "bytes16",
        name: "userType",
        type: "bytes16"
      },
      {
        internalType: "address",
        name: "userAddress",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "nftId",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "nftContract",
        type: "address"
      }
    ],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "message",
        type: "bytes"
      }
    ],
    name: "decodeMessage",
    outputs: [
      {
        internalType: "address",
        name: "userAddress",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "nftId",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "nftContract",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "nearBlock",
        type: "uint256"
      }
    ],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes16",
        name: "userType",
        type: "bytes16"
      },
      {
        internalType: "address",
        name: "userAddress",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "nftId",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "nftContract",
        type: "address"
      }
    ],
    name: "encodeCrossChainMessage",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      }
    ],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "message",
        type: "bytes"
      }
    ],
    name: "getEthSignedMessageHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [],
    name: "getMessageFee",
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
        internalType: "bytes",
        name: "message",
        type: "bytes"
      }
    ],
    name: "isMessageProcessed",
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
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    name: "processedMessages",
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
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "nftContract",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "nftId",
        type: "uint256"
      }
    ],
    name: "sendCrossChainMessage",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newSigner",
        type: "address"
      }
    ],
    name: "setSigner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "signer",
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
        internalType: "bytes",
        name: "message",
        type: "bytes"
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes"
      }
    ],
    name: "verifyAndProcessMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "messageHash",
        type: "bytes32"
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes"
      },
      {
        internalType: "address",
        name: "expectedSigner",
        type: "address"
      }
    ],
    name: "verifySignature",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "message",
        type: "bytes"
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes"
      },
      {
        internalType: "address",
        name: "expectedSigner",
        type: "address"
      }
    ],
    name: "verifySignatureWithEIP191",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [],
    name: "wormhole",
    outputs: [
      {
        internalType: "contract IWormhole",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];
