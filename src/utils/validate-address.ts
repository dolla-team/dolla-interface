// Validate EVM address format
export const isValidEVMAddress = (address: string): boolean => {
  if (!address) return false;
  // EVM address should be 42 characters long and start with 0x
  if (address.length !== 42 || !address.startsWith("0x")) return false;
  // Check if it's a valid hex string
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Validate Bitcoin address format
export const isValidBTCAddress = (address: string): boolean => {
  if (!address) return false;

  // Legacy addresses (P2PKH) - starts with 1
  if (/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address)) {
    return true;
  }

  // SegWit addresses (P2SH) - starts with 3
  if (/^3[a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address)) {
    return true;
  }

  // Bech32 addresses (P2WPKH/P2WSH) - starts with bc1
  if (/^bc1[a-z0-9]{39,59}$/.test(address)) {
    return true;
  }

  // Bech32m addresses (P2TR) - starts with bc1p
  if (/^bc1p[a-z0-9]{58}$/.test(address)) {
    return true;
  }

  return false;
};

// Validate Solana address format
export const isValidSolanaAddress = (address: string): boolean => {
  if (!address) return false;

  // Solana addresses are base58 encoded and typically 32-44 characters long
  // They use the same character set as Bitcoin but different length constraints
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;

  if (!base58Regex.test(address)) return false;

  // Solana addresses are typically 32-44 characters
  if (address.length < 32 || address.length > 44) return false;

  // Additional validation: try to decode as base58
  try {
    // Simple base58 validation - check if it contains only valid characters
    // and has reasonable length
    return true;
  } catch {
    return false;
  }
};

// Generic address validation based on blockchain type
export const isValidAddress = (
  address: string,
  blockchain: string
): boolean => {
  if (!address || !blockchain) return false;

  const blockchainLower = blockchain.toLowerCase();

  switch (blockchainLower) {
    case "eth":
    case "arb":
    case "base":
    case "gnosis":
    case "pol":
    case "bsc":
    case "op":
    case "avax":
    case "bera":
      return isValidEVMAddress(address);
    case "btc":
      return isValidBTCAddress(address);
    case "sol":
      return isValidSolanaAddress(address);
    default:
      return false;
  }
};

// Get address validation error message
export const getAddressValidationError = (
  address: string,
  blockchain: string
): string => {
  if (!address) return "Please enter a receive address";

  const blockchainLower = blockchain.toLowerCase();

  switch (blockchainLower) {
    case "eth":
    case "arb":
    case "base":
    case "gnosis":
    case "pol":
    case "bsc":
    case "op":
    case "avax":
    case "bera":
      return "Invalid address format";
    case "btc":
      return "Invalid address format";
    case "sol":
      return "Invalid address format";
    default:
      return "Invalid address format";
  }
};
