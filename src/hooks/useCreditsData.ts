import { FLOCK_CREDITS_ABI } from '../contracts/flockCredits';
import { FLOCK_V2_ABI } from '../contracts/flockV2';
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
  }) as { data: any[] };

  const { data: researchPrice } = useContractRead({
    address: process.env.NEXT_PUBLIC_FLOCK_CREDITS_ADDRESS as `0x${string}`,
    abi: FLOCK_CREDITS_ABI,
    functionName: 'FIXED_PRICE',
    watch: true,
  }) as { data: number };

  const { data: tokenAllowance } = useContractRead({
    address: process.env.NEXT_PUBLIC_FLOCK_TOKEN_V2_ADDRESS as `0x${string}`,
    abi: FLOCK_V2_ABI,
    functionName: 'allowance',
    args: [userAddress, process.env.NEXT_PUBLIC_FLOCK_CREDITS_ADDRESS as `0x${string}`],
    watch: true,
  }) as { data: bigint };

  const { data: isWhitelisted } = useContractRead({
    address: process.env.NEXT_PUBLIC_FLOCK_CREDITS_ADDRESS as `0x${string}`,
    abi: FLOCK_CREDITS_ABI,
    functionName: 'checkIfWhiteListed',
    args: [userAddress],
    watch: true,
  }) as { data: boolean };

  return {
    userData,
    researchPrice,
    tokenAllowance,
    isWhitelisted,
  };
};

export default useCreditsData;
