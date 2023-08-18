import { useContractRead, useAccount } from 'wagmi';
import { FLOCK_TASK_MANAGER_ABI } from '../contracts/flockTaskManager';
import { Anchor, Avatar, Box, Heading, Layer, Meter, Stack, Text } from 'grommet';
import { use, useEffect, useState } from 'react';
import { UserFemale, Favorite, View, Group, Chat, Scorecard, CreditCard, Image } from 'grommet-icons';
import { PrimaryButton } from './PrimaryButton';
import { web3AuthInstance, userDataHook } from '../hooks';


export interface ModelData {
  id: string;
  name: string;
  type: string;
  creator: string;
  description: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  shares: number;
  link: string;
};

type CardColors = {
  [key: string]: TaskCardProps;
}

interface TaskCardProps {
  cardColor: string;
  cardIcon: JSX.Element;
}

const cardColors: CardColors = {
  "Large Language Model Finetuning": {
    cardColor: "#A4C0FF", cardIcon: <Chat color="black" size="20px" />
  },
  "NLP": {
    cardColor: "#E69FBD", cardIcon: <Scorecard color="black" size="20px" />
  },
  "Time series prediction": {
    cardColor: "#D9D9D9", cardIcon: <CreditCard color="black" size="20px" />
  },
  "Classification": {
    cardColor: "#BDD4DA", cardIcon: <Image color="black" size="20px" />
  },
}

export const MarketplaceItems = ({
  filterItems,
}: {
  filterItems: string[];
}) => {
  const [models, setModels] = useState<ModelData[]>([] as ModelData[]);
  const [likes, setLikes] = useState<string[]>([] as string[]);
  const {
    userEmail,
    userToken,
    publicKey,
  } = userDataHook();



  const likeTask = async (modelId: string) => {
    if (web3AuthInstance.connected) {
      try {
        const likeTaskRequest = await fetch('/api/updateModelLikes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            modelId: modelId,
            publicKey: publicKey,
            userToken: userToken,
            userEmail: userEmail,
          }),
        });
        const models = await likeTaskRequest.json();
        setModels(models);
      } catch (e) {
        console.log(e);
      }
    }
  }

  const getLikes = async () => {
    try {
      const user = await web3AuthInstance.getUserInfo();
      const getLikesRequest = await fetch('/api/getUserLikes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: user.email,
        }), 
      });
      const loadedLikes = await getLikesRequest.json();
      setLikes(loadedLikes);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (web3AuthInstance.connected) {
      getLikes();
    }
  }, [web3AuthInstance.connected, models]);

  const loadModels = async () => {
    try {
      const getModelsRequest = await fetch('/api/getModelData', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const loadedModels = await getModelsRequest.json();
      setModels(loadedModels);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  const viewTask = async (modelId: string) => {
    if (web3AuthInstance.connected) {
      try {
        const viewTaskRequest = await fetch('/api/updateModelViews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            modelId: modelId,
            publicKey: publicKey,
            userToken: userToken,
            userEmail: userEmail,
          }),
        });
        const models = await viewTaskRequest.json();
        setModels(models);
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <>
      <Box
        direction="row-responsive"
        wrap
        width="100%"
        align="center"
        justify='center'
        gap="small"
      >
        {models
          ?.filter((model) => filterItems.length === 0 || filterItems.includes(model.type))
          .map((model: ModelData, index: number) => {
          return (
            <Box
              background="#FFFFFF"
              key={index}
              align="start"
              justify="center"
              round="small"
              elevation="large"
              pad="medium"
              margin={{ top: 'small' }}
              height={{ min: 'small' }}
              width="440px"
              border={{ color: 'black', size: 'small' }}
            >
                <Heading level="3" margin="none">
                    {model.name}
                </Heading>
                <Text margin={{ bottom: 'medium' }}>{model.description}</Text>
                <Box 
                    direction="row" 
                    width="100%" 
                    justify="between" 
                    align="center" 
                    border={{
                        color: 'black',
                        size: 'small',
                        style: 'solid',
                        side: 'bottom'
                    }}
                    pad={{ bottom: 'xsmall' }}
                    >
                    <Box
                        border={{ color: 'black', size: 'small' }}
                        round="small"
                        pad="xsmall"
                        background={cardColors[model.type]?.cardColor}
                        direction="row"
                        gap="small"
                        align="center"
                    >
                        <Chat color="black" size="20px" /><Text weight="bold" truncate={true}>{model.type}</Text>
                    </Box>
                    <Box direction="row" gap="small">
                        <Box direction="row" gap="1px"><Favorite color={ likes.includes(model.id) ? "red" : "black"} onClick={() => likeTask(model.id)} /> {model.likes}</Box>
                        <Box direction="row" gap="1px"><View color="black" /> {model.views}</Box>
                        <Box direction="row" gap="1px"><Group color="black" /> {model.shares}</Box>
                    </Box>
                </Box>
                <Box direction="row" width="100%" justify="between" margin={{ top: 'small'}}>
                    <Box direction="row" gap="small">
                        <UserFemale color='brand' />
                        <Text>{model.creator}</Text>
                    </Box>
                    <Box direction="row" align="center" gap="small">
                        <Text weight="bold">FLC {model.price}</Text>
                        <PrimaryButton label="Use" href={model.link} target="blank" onClick={() => viewTask(model.id)} />
                    </Box>
                </Box>
            </Box>
          );
        })}
      </Box>
    </>
  );
};
