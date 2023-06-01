import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { FLOCK_TASK_MANAGER_ABI } from '../contracts/flockTaskManager';
import {
  Box,
  Form,
  FormField,
  Heading,
  Paragraph,
  RangeInput,
  Select,
  Text,
  TextArea,
  TextInput,
} from 'grommet';
import { DocumentText, SettingsOption, Table } from 'grommet-icons';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';
import { useState } from 'react';

type FormValues = {
  name: string;
  description: string;
  input: string;
  output: string;
  modelName: string;
  taskType: string;
  sizeMemory: number;
  outputDescription: string;
  minParticipants: number;
  maxParticipants: number;
  rounds: number;
  accuracy: number;
  stake: number;
  rewardPool: number;
};

const TrainingSettingsForm = ({
  value,
  setValue,
}: {
  value: any;
  setValue: (value: any) => void;
}) => {
  return (
    <Form value={value} onChange={(nextValue) => setValue(nextValue)}>
      <Box>
        <Heading level="4">Criteria to start training task:</Heading>
        <Box direction="row" align="center" justify="between">
          <Box>
            <Text>Limit minimum number of participants</Text>
            <Box direction="row" align="center" gap="xsmall">
              <RangeInput
                id="minParticipants"
                name="minParticipants"
                step={1}
                max={1000}
                min={3}
              />
              <Box>{value.minParticipants}</Box>
            </Box>
          </Box>
          <Box>
            <Text>Limit maximum number of participants</Text>
            <Box direction="row" align="center" gap="xsmall">
              <RangeInput
                id="maxParticipants"
                name="maxParticipants"
                step={1}
                min={3}
                max={1000}
              />
              <Box>{value.maxParticipants}</Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box>
        <Heading level="4">Criteria to end training task:</Heading>
        <Box direction="row" align="center" justify="between">
          <FormField
            name="roundsField"
            htmlFor="rounds"
            label="Number of training rounds in total"
          >
            <TextInput id="rounds" name="rounds" type="number" />
          </FormField>
          <Box>
            <Text>Expected training accuracy</Text>
            <Box direction="row" align="center" gap="xsmall">
              <RangeInput
                id="accuracy"
                name="accuracy"
                step={1}
                min={0}
                max={100}
              />
              <Box>{value.accuracy}%</Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        direction="row"
        align="center"
        justify="between"
        margin={{ top: 'medium' }}
      >
        <FormField
          name="stakeField"
          htmlFor="stake"
          label="Initial Stake Requirement"
        >
          <TextInput id="stake" name="stake" type="number" />
        </FormField>
        <FormField
          name="rewardPoolField"
          htmlFor="rewardPool"
          label="Rewards Pool"
        >
          <TextInput id="rewardPool" name="rewardPool" type="number" />
        </FormField>
      </Box>
    </Form>
  );
};

const TaskDefinitionForm = ({
  value,
  setValue,
}: {
  value: any;
  setValue: (value: any) => void;
}) => {
  return (
    <Form value={value} onChange={(nextValue) => setValue(nextValue)}>
      <FormField name="nameField" htmlFor="name" label="Name">
        <TextInput id="name" name="name" />
      </FormField>
      <FormField
        name="descriptionField"
        htmlFor="description"
        label="Description"
      >
        <TextArea id="description" name="description" />
      </FormField>
      <FormField name="inputField" htmlFor="input" label="Input">
        <TextInput id="input" name="input" />
      </FormField>
      <FormField name="outputField" htmlFor="output" label="Output">
        <TextInput id="output" name="output" />
      </FormField>
      <Box direction="row" align="center" justify="between">
        <FormField name="modelNameField" htmlFor="modelName" label="Model Name">
          <Select
            id="modelName"
            name="modelName"
            options={[
              'Linear Regression',
              'MLP',
              'Three-layer CNN',
              'ResNet18',
              'ResNet20',
              'ResNet56',
              'VGG16',
            ]}
          />
        </FormField>
        <FormField name="taskTypeField" htmlFor="taskType" label="Task Type">
          <Select
            id="taskType"
            name="taskType"
            options={['Time series prediction', 'Classification']}
          />
        </FormField>
      </Box>
      <Box direction="row" align="center" justify="between">
        <Box gap="medium">
          <Text>Model Size in Memory</Text>
          <Box direction="row" align="center" gap="xsmall">
            <RangeInput
              id="sizeMemory"
              name="sizeMemory"
              step={4}
              max={1024}
              min={128}
            />
            <Box>{value.sizeMemory}MB</Box>
          </Box>
        </Box>

        <FormField
          name="outputDescriptionField"
          htmlFor="outputDescription"
          label="Output Description"
        >
          <TextInput id="outputDescription" name="outputDescription" />
        </FormField>
      </Box>
    </Form>
  );
};

export const CreateTask = ({
  setShowCreateTask,
}: {
  setShowCreateTask: (show: boolean) => void;
}) => {
  const [value, setValue] = useState<FormValues>({} as FormValues);
  const [step, setStep] = useState(1);

  const { config } = usePrepareContractWrite({
    address: process.env
      .NEXT_PUBLIC_FLOCK_TASK_MANAGER_ADDRESS as `0x${string}`,
    abi: FLOCK_TASK_MANAGER_ABI,
    functionName: 'createTask',
    args: [
      JSON.stringify(value),
      120,
      'dsadasdsadasdasdas',
      value.rounds,
      value.minParticipants,
      value.maxParticipants,
      value.stake * 10 ** 18,
    ],
  });

  const { data, isLoading, isSuccess, writeAsync } = useContractWrite(config);

  const handleCreate = async () => {
    await writeAsync?.();
    setShowCreateTask(false);
  };

  const handleContinue = () => {
    setStep(step + 1);
  };

  return (
    <Box width="xlarge">
      <Box
        background="#EEEEEE"
        direction="row"
        align="center"
        justify="start"
        width="100%"
        pad={{ horizontal: 'xlarge', vertical: 'medium' }}
      >
        <Box>
          <Box direction="row" gap="xsmall">
            <Heading level="2">Create your</Heading>
            <Heading level="2" color="#6C94EC">
              task
            </Heading>
          </Box>
          <Paragraph>Fill in the following information step by step</Paragraph>
        </Box>
      </Box>
      <Box
        pad={{ horizontal: 'xlarge', vertical: 'large' }}
        direction="row-responsive"
        align="start"
        justify="start"
      >
        <Box width="30%">
          <Box direction="row" align="center" gap="small">
            <DocumentText size="medium" color={step === 1 ? '#6C94EC' : ''} />
            <Heading level="4" color={step === 1 ? '#6C94EC' : ''}>
              1. Task Definition
            </Heading>
          </Box>
          <Box direction="row" align="center" gap="small">
            <Table size="medium" color={step === 2 ? '#6C94EC' : ''} />
            <Heading level="4" color={step === 2 ? '#6C94EC' : ''}>
              2. Data Definition
            </Heading>
          </Box>
          <Box direction="row" align="center" gap="small">
            <SettingsOption size="medium" color={step === 3 ? '#6C94EC' : ''} />
            <Heading level="4" color={step === 3 ? '#6C94EC' : ''}>
              3. Training Settings
            </Heading>
          </Box>
        </Box>
        <Box width="70%">
          {step === 1 && (
            <TaskDefinitionForm value={value} setValue={setValue} />
          )}
          {step === 2 && <></>}
          {step === 3 && (
            <TrainingSettingsForm value={value} setValue={setValue} />
          )}
        </Box>
      </Box>
      <Box
        direction="row"
        gap="large"
        alignSelf="end"
        pad={{ horizontal: 'xlarge', vertical: 'large' }}
      >
        <SecondaryButton
          onClick={() => setShowCreateTask(false)}
          margin={{ top: 'large' }}
          label="Cancel"
          size="medium"
          pad={{ vertical: 'small', horizontal: 'large' }}
        />
        <PrimaryButton
          onClick={step === 3 ? handleCreate : handleContinue}
          margin={{ top: 'large' }}
          label={step === 3 ? 'Create' : 'Continue'}
          size="medium"
          pad={{ vertical: 'small', horizontal: 'large' }}
        />
      </Box>
    </Box>
  );
};
