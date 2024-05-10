export const ChainWorkBenchABI = {
  "version": "0.1.0",
  "name": "chain_work_bench",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createTokenAccount",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolTokenAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "setClaimToken",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemConfig",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tokenMint",
          "type": "publicKey"
        },
        {
          "name": "claimVersion",
          "type": "u64"
        },
        {
          "name": "timeline",
          "type": "i64"
        }
      ]
    },
    {
      "name": "setMerkleTreesRoot",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemConfig",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "merkleTreeRoot",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "claim",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "recipient",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "claimConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolTokenAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "version",
          "type": "u64"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "proof",
          "type": {
            "vec": {
              "array": [
                "u8",
                32
              ]
            }
          }
        }
      ]
    },
    {
      "name": "transferToken",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "recipient",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolTokenAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "closeAccount",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolTokenAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "accountType",
          "type": {
            "defined": "AccountType"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "ClaimConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "claimed",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "SystemConfigData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "poolTokenAuthority",
            "type": "publicKey"
          },
          {
            "name": "poolTokenAuthorityBumpSeed",
            "type": "u8"
          },
          {
            "name": "merkleTreeRoot",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "timeline",
            "type": "i64"
          },
          {
            "name": "claimVersion",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "ClaimData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "AccountType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "TokenAccount"
          },
          {
            "name": "SystemConfigAccount"
          },
          {
            "name": "ClaimConfig"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidProof",
      "msg": "Invalid proof"
    },
    {
      "code": 6001,
      "name": "AlreadyCliamed",
      "msg": "Already cliamed"
    },
    {
      "code": 6002,
      "name": "InvalidMangerAccount",
      "msg": "Invalid manger account"
    },
    {
      "code": 6003,
      "name": "ClaimEnded",
      "msg": "The event has ended"
    },
    {
      "code": 6004,
      "name": "ClaimVersionMismatch",
      "msg": "Claim version mismatch"
    }
  ],
  "metadata": {
    "address": "GDTrePtt7tmGZ5tzk8w6tYdDamY2TzYXozowWnRLsB3k"
  }
}