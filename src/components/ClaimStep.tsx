import { Box, Text } from 'grommet';
import { Checkmark } from 'grommet-icons';
import { ReactNode } from 'react';

export type ClaimStepProps = {
  step: number;
  label: string;
  status: 'active' | 'disabled' | 'complete';
  children?: ReactNode;
  actions?: JSX.Element | JSX.Element[];
};

const colors = {
  content: {
    active: 'white',
    disabled: 'disabled',
    complete: 'black',
  },
  wrapperBorder: {
    active: 'black',
    disabled: 'disabled',
    complete: 'black',
  },
  wrapperBg: {
    active: 'brand',
    disabled: 'white',
    complete: 'white',
  },
};

export default function ClaimStep({
  step,
  label,
  status,
  children,
}: ClaimStepProps) {
  return (
    <Box
      direction="row"
      align="center"
      gap="small"
      border={{ color: colors.wrapperBorder[status], size: 'small' }}
      pad="small"
      round="large"
      key={`step-${step}`}
      background={colors.wrapperBg[status]}
    >
      {status === 'complete' ? (
        <Box
          align="center"
          justify="center"
          border={{ color: colors.content[status], size: 'small' }}
          round="large"
          width="24px"
          height="24px"
          background="brand"
        >
          <Checkmark color="white" size="small" />
        </Box>
      ) : (
        <Box
          align="center"
          justify="center"
          border={{ color: colors.content[status], size: 'small' }}
          round="large"
          width="24px"
          height="24px"
        >
          <Text
            weight={600}
            size="16px"
            textAlign="center"
            color={colors.content[status]}
          >
            {step}
          </Text>
        </Box>
      )}
      <Text weight={600} color={colors.content[status]}>
        {label}
      </Text>
      <Box margin={{left: 'auto'}} gap="small">{children}</Box>
    </Box>
  );
}
