import { Box, Text } from 'grommet';
import { Checkmark } from 'grommet-icons';
import { ReactNode } from 'react';
import { TClaimStatus } from '../context/questContext';


export type ClaimStepProps = {
  step: number;
  label: string;
  status: TClaimStatus;
  children?: ReactNode;
  actions?: JSX.Element | JSX.Element[];
  minWidth?: string;
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
  minWidth,
}: ClaimStepProps) {
  return (
    <Box
      direction="row"
      align="center"
      gap="small"
      border={{ color: colors.wrapperBorder[status], size: 'small' }}
      pad={{ vertical: '7px', horizontal: '15px' }}
      round="50px"
      key={`step-${step}`}
      background={colors.wrapperBg[status]}
      style={{ minHeight: '58px' }}
    >
      {status === 'complete' ? (
        <Box
          align="center"
          justify="center"
          border={{ color: colors.content[status], size: 'small' }}
          round="50px"
          background="brand"
          width="24px"
          height="24px"
          style={{ minWidth: '24px', minHeight: '24px' }}
        >
          <Checkmark color="white" size="small" />
        </Box>
      ) : (
        <Box
          align="center"
          justify="center"
          border={{ color: colors.content[status], size: 'small' }}
          round="50px"
          width="24px"
          height="24px"
          style={{ minWidth: '24px', minHeight: '24px' }}
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
      <Box flex={!children ? 'grow' : undefined}>
        <Text weight={600} color={colors.content[status]} size="16px">
          {label}
        </Text>
      </Box>
      {children && (
        <Box
          margin={{ left: 'auto' }}
          width={{ min: minWidth || '110px' }}
          justify="end"
        >
          <Box gap="small" margin={{ left: 'auto' }}>
            {children}
          </Box>
        </Box>
      )}
    </Box>
  );
}
