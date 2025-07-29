import config from "@/config/solana";

export default {
  address: config.dolla_contract,
  metadata: {
    name: "dolla",
    version: "0.1.0",
    spec: "0.1.0",
    description: "Created with Anchor"
  },
  instructions: [
    {
      name: "bid",
      discriminator: [199, 56, 85, 38, 146, 243, 37, 158],
      accounts: [
        {
          name: "dolla_state",
          writable: true
        },
        {
          name: "pool_state",
          writable: true
        },
        {
          name: "buyer_state",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  100, 111, 108, 108, 97, 95, 98, 117, 121, 101, 114, 95, 115,
                  116, 97, 116, 101
                ]
              },
              {
                kind: "account",
                path: "pool_state"
              },
              {
                kind: "account",
                path: "user"
              }
            ]
          }
        },
        {
          name: "randomness_account"
        },
        {
          name: "quote_mint"
        },
        {
          name: "paid_mint"
        },
        {
          name: "user_quote_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "user"
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169
                ]
              },
              {
                kind: "account",
                path: "quote_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89
              ]
            }
          }
        },
        {
          name: "pool_quote_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "pool_state"
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169
                ]
              },
              {
                kind: "account",
                path: "quote_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89
              ]
            }
          }
        },
        {
          name: "user_paid_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "user"
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169
                ]
              },
              {
                kind: "account",
                path: "paid_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89
              ]
            }
          }
        },
        {
          name: "operator_paid_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "operator"
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169
                ]
              },
              {
                kind: "account",
                path: "paid_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89
              ]
            }
          }
        },
        {
          name: "token_program"
        },
        {
          name: "associated_token_program",
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          name: "user",
          writable: true,
          signer: true
        },
        {
          name: "operator",
          writable: true,
          signer: true
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111"
        }
      ],
      args: [
        {
          name: "bid_count",
          type: "u32"
        },
        {
          name: "gas_amount",
          type: "u64"
        }
      ]
    },
    {
      name: "cancel_pool",
      discriminator: [211, 11, 27, 100, 252, 115, 57, 77],
      accounts: [
        {
          name: "dolla_state",
          writable: true
        },
        {
          name: "pool_state",
          writable: true
        },
        {
          name: "base_mint"
        },
        {
          name: "quote_mint"
        },
        {
          name: "user_base_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "user"
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169
                ]
              },
              {
                kind: "account",
                path: "base_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89
              ]
            }
          }
        },
        {
          name: "user_quote_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "user"
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169
                ]
              },
              {
                kind: "account",
                path: "quote_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89
              ]
            }
          }
        },
        {
          name: "protocol_quote_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "dolla_state"
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169
                ]
              },
              {
                kind: "account",
                path: "quote_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89
              ]
            }
          }
        },
        {
          name: "pool_base_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "pool_state"
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169
                ]
              },
              {
                kind: "account",
                path: "base_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89
              ]
            }
          }
        },
        {
          name: "pool_quote_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "pool_state"
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169
                ]
              },
              {
                kind: "account",
                path: "quote_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89
              ]
            }
          }
        },
        {
          name: "token_program"
        },
        {
          name: "associated_token_program",
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          name: "user",
          writable: true,
          signer: true
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111"
        }
      ],
      args: []
    },
    {
      name: "claim_funds",
      discriminator: [145, 36, 143, 242, 168, 66, 200, 155],
      accounts: [
        {
          name: "dolla_state"
        },
        {
          name: "pool_state",
          writable: true
        },
        {
          name: "quote_mint"
        },
        {
          name: "user_quote_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "user"
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169
                ]
              },
              {
                kind: "account",
                path: "quote_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89
              ]
            }
          }
        },
        {
          name: "pool_quote_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "pool_state"
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169
                ]
              },
              {
                kind: "account",
                path: "quote_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89
              ]
            }
          }
        },
        {
          name: "protocol_quote_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "dolla_state"
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169
                ]
              },
              {
                kind: "account",
                path: "quote_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89
              ]
            }
          }
        },
        {
          name: "token_program"
        },
        {
          name: "associated_token_program",
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          name: "user",
          writable: true,
          signer: true
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111"
        }
      ],
      args: []
    },
    {
      name: "claim_pool_fee",
      discriminator: [201, 205, 15, 168, 196, 41, 123, 175],
      accounts: [
        {
          name: "dolla_state"
        },
        {
          name: "pool_state",
          writable: true
        },
        {
          name: "quote_mint"
        },
        {
          name: "pool_quote_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "pool_state"
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169
                ]
              },
              {
                kind: "account",
                path: "quote_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89
              ]
            }
          }
        },
        {
          name: "protocol_quote_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "dolla_state"
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169
                ]
              },
              {
                kind: "account",
                path: "quote_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89
              ]
            }
          }
        },
        {
          name: "token_program"
        },
        {
          name: "associated_token_program",
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          name: "user",
          writable: true,
          signer: true
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111"
        }
      ],
      args: []
    },
    {
      name: "claim_reward",
      discriminator: [149, 95, 181, 242, 94, 90, 158, 162],
      accounts: [
        {
          name: "dolla_state"
        },
        {
          name: "pool_state",
          writable: true
        },
        {
          name: "base_mint"
        },
        {
          name: "user_base_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "user"
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169
                ]
              },
              {
                kind: "account",
                path: "base_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89
              ]
            }
          }
        },
        {
          name: "pool_base_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "pool_state"
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169
                ]
              },
              {
                kind: "account",
                path: "base_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89
              ]
            }
          }
        },
        {
          name: "token_program"
        },
        {
          name: "associated_token_program",
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          name: "user",
          writable: true,
          signer: true
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111"
        }
      ],
      args: []
    },
    {
      name: "claim_slash_funds",
      discriminator: [54, 100, 244, 102, 73, 237, 91, 172],
      accounts: [
        {
          name: "dolla_state"
        },
        {
          name: "pool_state",
          writable: true
        },
        {
          name: "buyer_state",
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  100, 111, 108, 108, 97, 95, 98, 117, 121, 101, 114, 95, 115,
                  116, 97, 116, 101
                ]
              },
              {
                kind: "account",
                path: "pool_state"
              },
              {
                kind: "account",
                path: "user"
              }
            ]
          }
        },
        {
          name: "quote_mint"
        },
        {
          name: "paid_mint"
        },
        {
          name: "user_quote_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "user"
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169
                ]
              },
              {
                kind: "account",
                path: "quote_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89
              ]
            }
          }
        },
        {
          name: "pool_quote_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "pool_state"
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169
                ]
              },
              {
                kind: "account",
                path: "quote_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89
              ]
            }
          }
        },
        {
          name: "user_paid_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "user"
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169
                ]
              },
              {
                kind: "account",
                path: "paid_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89
              ]
            }
          }
        },
        {
          name: "operator_paid_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "operator"
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169
                ]
              },
              {
                kind: "account",
                path: "paid_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89
              ]
            }
          }
        },
        {
          name: "token_program"
        },
        {
          name: "associated_token_program",
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          name: "user",
          writable: true,
          signer: true
        },
        {
          name: "operator",
          writable: true,
          signer: true
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111"
        }
      ],
      args: [
        {
          name: "gas_amount",
          type: "u64"
        }
      ]
    },
    {
      name: "create_pool",
      discriminator: [233, 146, 209, 142, 207, 104, 64, 188],
      accounts: [
        {
          name: "dolla_state",
          writable: true
        },
        {
          name: "pool_state",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [100, 111, 108, 108, 97, 95, 112, 111, 111, 108]
              },
              {
                kind: "account",
                path: "dolla_state"
              },
              {
                kind: "account",
                path: "dolla_state.next_order_id",
                account: "DollaState"
              }
            ]
          }
        },
        {
          name: "base_mint"
        },
        {
          name: "quote_mint"
        },
        {
          name: "paid_mint"
        },
        {
          name: "user_base_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "user"
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169
                ]
              },
              {
                kind: "account",
                path: "base_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89
              ]
            }
          }
        },
        {
          name: "pool_base_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "pool_state"
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169
                ]
              },
              {
                kind: "account",
                path: "base_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89
              ]
            }
          }
        },
        {
          name: "user_paid_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "user"
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169
                ]
              },
              {
                kind: "account",
                path: "paid_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89
              ]
            }
          }
        },
        {
          name: "operator_paid_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "operator"
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169
                ]
              },
              {
                kind: "account",
                path: "paid_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89
              ]
            }
          }
        },
        {
          name: "token_program"
        },
        {
          name: "associated_token_program",
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          name: "user",
          writable: true,
          signer: true
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111"
        },
        {
          name: "operator",
          writable: true,
          signer: true
        }
      ],
      args: [
        {
          name: "create_pool_param",
          type: {
            defined: {
              name: "CreatePoolParam"
            }
          }
        }
      ]
    },
    {
      name: "initialize",
      docs: ["initializing the whole protocol,"],
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237],
      accounts: [
        {
          name: "admin"
        },
        {
          name: "dolla_state",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [100, 111, 108, 108, 97, 95, 115, 116, 97, 116, 101]
              }
            ]
          }
        },
        {
          name: "user",
          writable: true,
          signer: true
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111"
        }
      ],
      args: [
        {
          name: "net_fee_percent_level",
          type: {
            vec: "u16"
          }
        },
        {
          name: "net_fee_rate_level",
          type: {
            vec: "u16"
          }
        },
        {
          name: "quote_tokens",
          type: {
            vec: "pubkey"
          }
        },
        {
          name: "quote_amounts",
          type: {
            vec: "u64"
          }
        },
        {
          name: "quote_gas_fees",
          type: {
            vec: "u64"
          }
        }
      ]
    },
    {
      name: "pause",
      discriminator: [211, 22, 221, 251, 74, 121, 193, 47],
      accounts: [
        {
          name: "dolla_state",
          writable: true
        },
        {
          name: "user",
          writable: true,
          signer: true
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111"
        }
      ],
      args: []
    },
    {
      name: "set_cancel_slash_rate",
      discriminator: [0, 210, 128, 238, 245, 192, 247, 108],
      accounts: [
        {
          name: "dolla_state",
          writable: true
        },
        {
          name: "user",
          writable: true,
          signer: true
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111"
        }
      ],
      args: [
        {
          name: "cancel_slash_rate",
          type: "u16"
        }
      ]
    },
    {
      name: "set_net_fee_rate",
      discriminator: [26, 138, 238, 205, 44, 84, 235, 182],
      accounts: [
        {
          name: "dolla_state",
          writable: true
        },
        {
          name: "user",
          writable: true,
          signer: true
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111"
        }
      ],
      args: [
        {
          name: "net_fee_percent_level",
          type: {
            vec: "u16"
          }
        },
        {
          name: "net_fee_rate_level",
          type: {
            vec: "u16"
          }
        }
      ]
    },
    {
      name: "set_owner",
      discriminator: [72, 202, 120, 52, 77, 128, 96, 197],
      accounts: [
        {
          name: "new_account_id"
        },
        {
          name: "dolla_state",
          writable: true
        },
        {
          name: "user",
          writable: true,
          signer: true
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111"
        }
      ],
      args: []
    },
    {
      name: "set_protocol_fee_rate",
      discriminator: [95, 7, 4, 50, 154, 79, 156, 131],
      accounts: [
        {
          name: "dolla_state",
          writable: true
        },
        {
          name: "user",
          writable: true,
          signer: true
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111"
        }
      ],
      args: [
        {
          name: "protocol_fee_rate",
          type: "u16"
        }
      ]
    },
    {
      name: "set_quote_tokens",
      discriminator: [238, 96, 131, 67, 96, 186, 229, 244],
      accounts: [
        {
          name: "dolla_state",
          writable: true
        },
        {
          name: "user",
          writable: true,
          signer: true
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111"
        }
      ],
      args: [
        {
          name: "quote_tokens",
          type: {
            vec: "pubkey"
          }
        },
        {
          name: "quote_amounts",
          type: {
            vec: "u64"
          }
        },
        {
          name: "quote_gas_fees",
          type: {
            vec: "u64"
          }
        }
      ]
    },
    {
      name: "settle_bid",
      discriminator: [39, 141, 108, 215, 181, 98, 229, 171],
      accounts: [
        {
          name: "dolla_state",
          writable: true
        },
        {
          name: "pool_state",
          writable: true
        },
        {
          name: "user"
        },
        {
          name: "buyer_state",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  100, 111, 108, 108, 97, 95, 98, 117, 121, 101, 114, 95, 115,
                  116, 97, 116, 101
                ]
              },
              {
                kind: "account",
                path: "pool_state"
              },
              {
                kind: "account",
                path: "user"
              }
            ]
          }
        },
        {
          name: "randomness_account"
        },
        {
          name: "quote_mint"
        },
        {
          name: "user_quote_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "user"
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169
                ]
              },
              {
                kind: "account",
                path: "quote_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89
              ]
            }
          }
        },
        {
          name: "pool_quote_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "pool_state"
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169
                ]
              },
              {
                kind: "account",
                path: "quote_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89
              ]
            }
          }
        },
        {
          name: "token_program"
        },
        {
          name: "associated_token_program",
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          name: "operator",
          writable: true,
          signer: true
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111"
        }
      ],
      args: []
    },
    {
      name: "shutdown",
      discriminator: [146, 204, 241, 213, 86, 21, 253, 211],
      accounts: [
        {
          name: "dolla_state",
          writable: true
        },
        {
          name: "user",
          writable: true,
          signer: true
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111"
        }
      ],
      args: []
    },
    {
      name: "start",
      discriminator: [62, 15, 117, 236, 47, 1, 89, 139],
      accounts: [
        {
          name: "dolla_state",
          writable: true
        },
        {
          name: "user",
          writable: true,
          signer: true
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111"
        }
      ],
      args: []
    },
    {
      name: "transfer_helper",
      discriminator: [91, 127, 17, 103, 187, 1, 7, 59],
      accounts: [
        {
          name: "dolla_state"
        },
        {
          name: "token_mint"
        },
        {
          name: "paid_mint"
        },
        {
          name: "user_token_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "user"
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169
                ]
              },
              {
                kind: "account",
                path: "token_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89
              ]
            }
          }
        },
        {
          name: "to_token_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "to_user"
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169
                ]
              },
              {
                kind: "account",
                path: "token_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89
              ]
            }
          }
        },
        {
          name: "user_paid_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "user"
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169
                ]
              },
              {
                kind: "account",
                path: "paid_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89
              ]
            }
          }
        },
        {
          name: "operator_paid_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "operator"
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169
                ]
              },
              {
                kind: "account",
                path: "paid_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89
              ]
            }
          }
        },
        {
          name: "token_program"
        },
        {
          name: "associated_token_program",
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          name: "spl_memo_program",
          address: "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
        },
        {
          name: "user",
          writable: true,
          signer: true
        },
        {
          name: "to_user"
        },
        {
          name: "operator",
          writable: true,
          signer: true
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111"
        }
      ],
      args: [
        {
          name: "transfer_amount",
          type: "u64"
        },
        {
          name: "gas_amount",
          type: "u64"
        },
        {
          name: "memo",
          type: {
            option: "string"
          }
        }
      ]
    },
    {
      name: "withdraw_protocol_fee",
      discriminator: [158, 201, 158, 189, 33, 93, 162, 103],
      accounts: [
        {
          name: "dolla_state"
        },
        {
          name: "token_mint"
        },
        {
          name: "to_user",
          writable: true
        },
        {
          name: "protocol_token_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "dolla_state"
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169
                ]
              },
              {
                kind: "account",
                path: "token_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89
              ]
            }
          }
        },
        {
          name: "token_program"
        },
        {
          name: "user",
          writable: true,
          signer: true
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111"
        }
      ],
      args: [
        {
          name: "amount",
          type: "u64"
        }
      ]
    }
  ],
  accounts: [
    {
      name: "BuyerState",
      discriminator: [196, 226, 50, 172, 9, 123, 201, 250]
    },
    {
      name: "DollaState",
      discriminator: [68, 159, 215, 144, 25, 5, 96, 112]
    },
    {
      name: "PoolState",
      discriminator: [247, 237, 227, 245, 215, 195, 222, 70]
    }
  ],
  events: [
    {
      name: "BidEvent",
      discriminator: [244, 161, 131, 196, 237, 176, 164, 118]
    },
    {
      name: "CancelEvent",
      discriminator: [71, 137, 239, 100, 220, 3, 242, 47]
    },
    {
      name: "ClaimFeeEvent",
      discriminator: [173, 80, 235, 15, 116, 19, 144, 33]
    },
    {
      name: "ClaimFundsEvent",
      discriminator: [112, 97, 127, 107, 254, 149, 241, 18]
    },
    {
      name: "ClaimRewardEvent",
      discriminator: [207, 16, 14, 170, 176, 71, 40, 53]
    },
    {
      name: "ClaimSlashEvent",
      discriminator: [76, 67, 59, 211, 212, 85, 207, 64]
    },
    {
      name: "CreateEvent",
      discriminator: [27, 114, 169, 77, 222, 235, 99, 118]
    },
    {
      name: "SettleEvent",
      discriminator: [14, 166, 206, 248, 35, 1, 134, 48]
    },
    {
      name: "TransferEvent",
      discriminator: [100, 10, 46, 113, 8, 28, 179, 125]
    },
    {
      name: "TransferHelperEvent",
      discriminator: [160, 90, 93, 153, 247, 62, 63, 186]
    },
    {
      name: "WithdrawEvent",
      discriminator: [22, 9, 133, 26, 160, 44, 71, 192]
    }
  ],
  errors: [
    {
      code: 6000,
      name: "InvalidProgramId",
      msg: "InvalidProgramId"
    },
    {
      code: 6001,
      name: "InvalidProgramStatus",
      msg: "InvalidProgramStatus"
    },
    {
      code: 6002,
      name: "InvalidParamArraySize",
      msg: "InvalidParamArraySize"
    },
    {
      code: 6003,
      name: "InvalidNetFeeRate",
      msg: "InvalidNetFeeRate"
    },
    {
      code: 6004,
      name: "InvalidNetFeePercent",
      msg: "InvalidNetFeePercent"
    },
    {
      code: 6005,
      name: "InvalidQuote",
      msg: "InvalidQuote"
    },
    {
      code: 6006,
      name: "InvalidBase",
      msg: "InvalidBase"
    },
    {
      code: 6007,
      name: "WaitingSettle",
      msg: "WaitingSettle"
    },
    {
      code: 6008,
      name: "InvalidRandonAccount",
      msg: "InvalidRandonAccount"
    },
    {
      code: 6009,
      name: "RandomnessNotResolved",
      msg: "RandomnessNotResolved"
    },
    {
      code: 6010,
      name: "InvalidStatus",
      msg: "InvalidStatus"
    },
    {
      code: 6011,
      name: "RandomnessAlreadyRevealed",
      msg: "RandomnessAlreadyRevealed"
    },
    {
      code: 6012,
      name: "InvalidGasAmount",
      msg: "InvalidGasAmount"
    },
    {
      code: 6013,
      name: "UnexpectedAccount",
      msg: "UnexpectedAccount"
    },
    {
      code: 6014,
      name: "NotAllowed",
      msg: "NotAllowed"
    },
    {
      code: 6015,
      name: "HadShutdown",
      msg: "HadShutdown"
    },
    {
      code: 6016,
      name: "InvalidFeeRate",
      msg: "InvalidFeeRate"
    },
    {
      code: 6017,
      name: "InvalidToken",
      msg: "InvalidToken"
    },
    {
      code: 6018,
      name: "InvalidUser",
      msg: "InvalidUser"
    },
    {
      code: 6019,
      name: "InvalidAmount",
      msg: "InvalidAmount"
    },
    {
      code: 6020,
      name: "NumberCastError",
      msg: "Unable to cast number into BigInt"
    }
  ],
  types: [
    {
      name: "BidEvent",
      type: {
        kind: "struct",
        fields: [
          {
            name: "pool_id",
            type: "u32"
          },
          {
            name: "bid_count",
            type: "u32"
          },
          {
            name: "user",
            type: "pubkey"
          },
          {
            name: "bid_quote_amount",
            type: "u64"
          },
          {
            name: "protocol_fee",
            type: "u64"
          },
          {
            name: "quote_token",
            type: "pubkey"
          },
          {
            name: "sequence_number",
            type: "u64"
          },
          {
            name: "gas_token",
            type: "pubkey"
          },
          {
            name: "gas_fee",
            type: "u64"
          }
        ]
      }
    },
    {
      name: "BuyerState",
      type: {
        kind: "struct",
        fields: [
          {
            name: "waiting_settle",
            type: "bool"
          },
          {
            name: "randomness_account",
            type: "pubkey"
          },
          {
            name: "last_win_rate",
            type: "u32"
          },
          {
            name: "last_bid_count",
            type: "u32"
          },
          {
            name: "execute_unit_count",
            type: "u32"
          },
          {
            name: "last_commit_slot",
            type: "u64"
          },
          {
            name: "last_quote_amount",
            type: "u64"
          },
          {
            name: "last_fee_amount",
            type: "u64"
          },
          {
            name: "last_sequence_num",
            type: "u64"
          }
        ]
      }
    },
    {
      name: "CancelEvent",
      type: {
        kind: "struct",
        fields: [
          {
            name: "pool_id",
            type: "u32"
          },
          {
            name: "slash_amount",
            type: "u64"
          },
          {
            name: "base_amount",
            type: "u64"
          },
          {
            name: "quote_amount",
            type: "u64"
          },
          {
            name: "base_token",
            type: "pubkey"
          },
          {
            name: "quote_token",
            type: "pubkey"
          },
          {
            name: "creator",
            type: "pubkey"
          }
        ]
      }
    },
    {
      name: "ClaimFeeEvent",
      type: {
        kind: "struct",
        fields: [
          {
            name: "pool_id",
            type: "u32"
          },
          {
            name: "user",
            type: "pubkey"
          },
          {
            name: "fee_amount",
            type: "u64"
          },
          {
            name: "quote_token",
            type: "pubkey"
          }
        ]
      }
    },
    {
      name: "ClaimFundsEvent",
      type: {
        kind: "struct",
        fields: [
          {
            name: "pool_id",
            type: "u32"
          },
          {
            name: "user",
            type: "pubkey"
          },
          {
            name: "amount",
            type: "u64"
          },
          {
            name: "fee_amount",
            type: "u64"
          },
          {
            name: "quote_token",
            type: "pubkey"
          }
        ]
      }
    },
    {
      name: "ClaimRewardEvent",
      type: {
        kind: "struct",
        fields: [
          {
            name: "pool_id",
            type: "u32"
          },
          {
            name: "user",
            type: "pubkey"
          },
          {
            name: "amount",
            type: "u64"
          },
          {
            name: "base_token",
            type: "pubkey"
          }
        ]
      }
    },
    {
      name: "ClaimSlashEvent",
      type: {
        kind: "struct",
        fields: [
          {
            name: "pool_id",
            type: "u32"
          },
          {
            name: "user",
            type: "pubkey"
          },
          {
            name: "amount",
            type: "u64"
          },
          {
            name: "quote_token",
            type: "pubkey"
          },
          {
            name: "gas_token",
            type: "pubkey"
          },
          {
            name: "gas_fee",
            type: "u64"
          }
        ]
      }
    },
    {
      name: "CreateEvent",
      type: {
        kind: "struct",
        fields: [
          {
            name: "pool_id",
            type: "u32"
          },
          {
            name: "creator",
            type: "pubkey"
          },
          {
            name: "base",
            type: "pubkey"
          },
          {
            name: "quote",
            type: "pubkey"
          },
          {
            name: "base_amount",
            type: "u64"
          },
          {
            name: "expected_quote_amount",
            type: "u64"
          },
          {
            name: "quote_amount_unit",
            type: "u64"
          },
          {
            name: "gas_token",
            type: "pubkey"
          },
          {
            name: "gas_fee",
            type: "u64"
          }
        ]
      }
    },
    {
      name: "CreatePoolParam",
      type: {
        kind: "struct",
        fields: [
          {
            name: "base_amount",
            type: "u64"
          },
          {
            name: "expected_quote_amount",
            type: "u64"
          },
          {
            name: "gas_amount",
            type: "u64"
          }
        ]
      }
    },
    {
      name: "DollaState",
      type: {
        kind: "struct",
        fields: [
          {
            name: "admin",
            type: "pubkey"
          },
          {
            name: "net_fee_percent_level",
            type: {
              vec: "u16"
            }
          },
          {
            name: "net_fee_rate_level",
            type: {
              vec: "u16"
            }
          },
          {
            name: "protocol_fee_rate",
            type: "u16"
          },
          {
            name: "cancel_slash_rate",
            type: "u16"
          },
          {
            name: "floating_rate",
            type: "u16"
          },
          {
            name: "status",
            type: {
              defined: {
                name: "DollaStatus"
              }
            }
          },
          {
            name: "quote_tokens",
            type: {
              vec: "pubkey"
            }
          },
          {
            name: "quote_amounts",
            type: {
              vec: "u64"
            }
          },
          {
            name: "quote_gas_fees",
            type: {
              vec: "u64"
            }
          },
          {
            name: "next_order_id",
            type: "u32"
          },
          {
            name: "sequence_number",
            type: "u64"
          },
          {
            name: "bump",
            type: {
              array: ["u8", 1]
            }
          }
        ]
      }
    },
    {
      name: "DollaStatus",
      type: {
        kind: "enum",
        variants: [
          {
            name: "NotInitial"
          },
          {
            name: "Running"
          },
          {
            name: "Paused"
          },
          {
            name: "Shutdown"
          }
        ]
      }
    },
    {
      name: "PoolState",
      type: {
        kind: "struct",
        fields: [
          {
            name: "pool_id",
            type: "u32"
          },
          {
            name: "pool_id_bytes",
            type: {
              array: ["u8", 4]
            }
          },
          {
            name: "owner",
            type: "pubkey"
          },
          {
            name: "winner",
            type: "pubkey"
          },
          {
            name: "quote_token",
            type: "pubkey"
          },
          {
            name: "base_token",
            type: "pubkey"
          },
          {
            name: "base_amount",
            type: "u64"
          },
          {
            name: "expected_quote_amount",
            type: "u64"
          },
          {
            name: "quote_amount",
            type: "u64"
          },
          {
            name: "fee_amount",
            type: "u64"
          },
          {
            name: "slash_amount",
            type: "u64"
          },
          {
            name: "quote_amount_unit",
            type: "u64"
          },
          {
            name: "execute_count",
            type: "u32"
          },
          {
            name: "execute_unit_count",
            type: "u32"
          },
          {
            name: "once_win_rate",
            type: "u32"
          },
          {
            name: "floating_rate",
            type: "u16"
          },
          {
            name: "status",
            type: {
              defined: {
                name: "PoolStatus"
              }
            }
          },
          {
            name: "bump",
            type: {
              array: ["u8", 1]
            }
          }
        ]
      }
    },
    {
      name: "PoolStatus",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Opened"
          },
          {
            name: "Cancelled"
          },
          {
            name: "Won"
          },
          {
            name: "Finalized"
          }
        ]
      }
    },
    {
      name: "SettleEvent",
      type: {
        kind: "struct",
        fields: [
          {
            name: "pool_id",
            type: "u32"
          },
          {
            name: "settle_user",
            type: "pubkey"
          },
          {
            name: "result",
            type: "bool"
          },
          {
            name: "cancelled",
            type: "bool"
          },
          {
            name: "random_number",
            type: "u64"
          },
          {
            name: "bid_count",
            type: "u32"
          },
          {
            name: "sequence_number",
            type: "u64"
          },
          {
            name: "base_token",
            type: "pubkey"
          },
          {
            name: "base_amount",
            type: "u64"
          },
          {
            name: "quote_token",
            type: "pubkey"
          },
          {
            name: "sell_amount",
            type: "u64"
          }
        ]
      }
    },
    {
      name: "TransferEvent",
      type: {
        kind: "struct",
        fields: [
          {
            name: "from",
            type: "pubkey"
          },
          {
            name: "to",
            type: "pubkey"
          },
          {
            name: "amount",
            type: "u64"
          },
          {
            name: "token_id",
            type: "pubkey"
          }
        ]
      }
    },
    {
      name: "TransferHelperEvent",
      type: {
        kind: "struct",
        fields: [
          {
            name: "user",
            type: "pubkey"
          },
          {
            name: "to_user",
            type: "pubkey"
          },
          {
            name: "operator",
            type: "pubkey"
          },
          {
            name: "token_mint",
            type: "pubkey"
          },
          {
            name: "transfer_amount",
            type: "u64"
          },
          {
            name: "gas_token",
            type: "pubkey"
          },
          {
            name: "gas_fee",
            type: "u64"
          }
        ]
      }
    },
    {
      name: "WithdrawEvent",
      type: {
        kind: "struct",
        fields: [
          {
            name: "to",
            type: "pubkey"
          },
          {
            name: "amount",
            type: "u64"
          },
          {
            name: "token_mint",
            type: "pubkey"
          }
        ]
      }
    }
  ]
};
