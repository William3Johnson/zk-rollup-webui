export const useSetMaxAmount = (
  tokenBalance: {
    count: string;
    isZero: boolean;
  },
  cb: (maxAmount: string) => void,
) => {
  return () => {
    if (!tokenBalance.isZero) {
      const maxAmount = tokenBalance.count;
      return cb(maxAmount);
    }
  };
};
