import { useAccount } from 'wagmi';

export default function useQuest() {
  const { address } = useAccount();
  const isWindowLoaded = () => typeof window !== 'undefined';

  const getLocalStorageJSON = (key: string) => {
    const storage = isWindowLoaded() && localStorage.getItem(key);
    return storage ? JSON.parse(storage) : {};
  };

  const setQuestInfo = (value: any) => {
    if (isWindowLoaded()) {
      const prevState = getLocalStorageJSON('questInfo');
      localStorage.setItem(
        'questInfo',
        JSON.stringify({ ...prevState, ...value })
      );
    }
  };

  const getQuestInfo = () => getLocalStorageJSON('questInfo');

  return { setQuestInfo, getQuestInfo };
}
