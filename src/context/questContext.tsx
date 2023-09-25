import { ReactNode, createContext, useEffect, useMemo, useState } from 'react';

interface QuestContextProviderProps {
  children: ReactNode;
}

export interface IUser {
  wallet?: string;
  discordName?: string;
  twitterName?: string;
}

export type TClaimStatus = 'active' | 'disabled' | 'complete';

interface IStepsStatus {
  [key: string]: TClaimStatus;
}

interface IReturnGetStepInfo {
  step: number;
  status: TClaimStatus;
}

interface IQuestContext {
  user: IUser;
  stepsStatus: IStepsStatus;
  saveQuestProgress([], user: IUser): void;
  getStepInfo(stepName: string): IReturnGetStepInfo;
  nextStep(stepName: string, user?: IUser): void;
}

const stepFlow = [
  'wallet_connect',
  'discord_connect',
  'discord_join_get_role',
  'twitter_connect',
  'twitter_follow',
  'twitter_share',
  'claim_reward',
];

const initialStepsStatus: IStepsStatus = {
  wallet_connect: 'active',
  discord_connect: 'disabled',
  discord_join_get_role: 'disabled',
  twitter_connect: 'disabled',
  twitter_follow: 'disabled',
  twitter_share: 'disabled',
  claim_reward: 'disabled',
};

export const QuestContext = createContext<IQuestContext>({
  user: {},
  stepsStatus: {},
} as IQuestContext);

export default function QuestContextProvider({
  children,
}: QuestContextProviderProps) {
  const [user, setUser] = useState<IUser>({} as IUser);
  const [stepsStatus, setStepsStatus] =
    useState<IStepsStatus>(initialStepsStatus);

  const saveQuestProgress = (tasks: string[], user: IUser) => {
    setUser(user);

    const newState = stepsStatus;
    newState.wallet_connect = 'complete';
    tasks.forEach((task: string) => (newState[task] = 'complete'));
    for (let i = 0; i <= stepFlow.length; i++) {
      if (newState[stepFlow[i]] !== 'complete') {
        newState[stepFlow[i]] = 'active';
        break;
      }
    }
    setStepsStatus(newState);
  };

  const nextStep = (stepName: string, user: IUser) => {
    setUser((prevState) => ({ ...prevState, ...user }));

    const newState = stepsStatus;
    newState[stepName] = 'complete';
    for (let i = 0; i <= stepFlow.length; i++) {
      if (newState[stepFlow[i]] !== 'complete') {
        newState[stepFlow[i]] = 'active';
        break;
      }
    }
    setStepsStatus(newState);
  };

  const getStepInfo = (stepName: string) => {
    return { step: stepFlow.indexOf(stepName), status: stepsStatus[stepName] };
  };

  const value = useMemo(
    () => ({ user, stepsStatus, saveQuestProgress, getStepInfo, nextStep }),
    [user, stepsStatus]
  );

  useEffect(() => {
    console.log('CONTEXT', value);
  }, [value]);

  return (
    <QuestContext.Provider value={value}>{children}</QuestContext.Provider>
  );
}
