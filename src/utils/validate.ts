// Validate EVM address format
export const isValidEVMAddress = (address: string): boolean => {
  if (!address) return false;
  // EVM address should be 42 characters long and start with 0x
  if (address.length !== 42 || !address.startsWith("0x")) return false;
  // Check if it's a valid hex string
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};
