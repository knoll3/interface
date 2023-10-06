import { FLOCK_CREDITS_ABI } from '../contracts/flockCredits';
import { useContractRead } from 'wagmi';

type UserDataType = {
    exists: boolean;
    wallet: string;
    NFTIssued: boolean;
    balance: bigint;
}

export const useCreditsData = ({
  userAddress,
}: {
  userAddress?: `0x${string}`;
}) => {

  const { data: userData } = useContractRead({
    address: process.env.NEXT_PUBLIC_FLOCK_CREDITS_ADDRESS as `0x${string}`,
    abi: FLOCK_CREDITS_ABI,
    functionName: 'users',
    args: [userAddress],
    watch: true,
  }) as { data: UserDataType };

  const { data: researchPrice } = useContractRead({
    address: process.env.NEXT_PUBLIC_FLOCK_CREDITS_ADDRESS as `0x${string}`,
    abi: FLOCK_CREDITS_ABI,
    functionName: 'FIXED_PRICE',
    watch: true,
  }) as { data: number };

  return {
    userData,
    researchPrice,
  };
};

export default useCreditsData;
