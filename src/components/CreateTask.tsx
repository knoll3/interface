import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { FLOCK_TASK_MANAGER_ABI } from '../contracts/flockTaskManager';
import {
  Box,
  Form,
  FormField,
  Heading,
  Paragraph,
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
};

export const CreateTask = ({
  setShowCreateTask,
}: {
  setShowCreateTask: (show: boolean) => void;
}) => {
  const [value, setValue] = useState<FormValues>({} as FormValues);

  const { config } = usePrepareContractWrite({
    address: process.env
      .NEXT_PUBLIC_FLOCK_TASK_MANAGER_ADDRESS as `0x${string}`,
    abi: FLOCK_TASK_MANAGER_ABI,
    functionName: 'createTask',
    args: [value.name, value.description, 120, 'dsadasdsadasdasdas', 100],
  });

  const { data, isLoading, isSuccess, writeAsync } = useContractWrite(config);

  const handleContinue = async () => {
    await writeAsync?.();
    setShowCreateTask(false);
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
            <DocumentText size="medium" />
            <Heading level="4">1. Task Definition</Heading>
          </Box>
          <Box direction="row" align="center" gap="small">
            <Table size="medium" />
            <Heading level="4">2. Data Definition</Heading>
          </Box>
          <Box direction="row" align="center" gap="small">
            <SettingsOption size="medium" />
            <Heading level="4">3. Training Settings</Heading>
          </Box>
        </Box>
        <Box width="70%">
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
          </Form>
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
          onClick={handleContinue}
          margin={{ top: 'large' }}
          label="Continue"
          size="medium"
          pad={{ vertical: 'small', horizontal: 'large' }}
        />
      </Box>
    </Box>
  );
};
