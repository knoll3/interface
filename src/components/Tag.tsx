import styled from 'styled-components';

interface ITagProps {
  label: string;
  type?: string;
  timer?: boolean;
}

interface ITagColors {
  [key: string]: {
    color: string;
    border: string;
    background: string;
  };
}

const tagColors: ITagColors = {
  default: {
    color: 'white',
    border: 'black',
    background: 'brand',
  },
  black: {
    color: 'black',
    border: 'black',
    background: 'brand',
  },
  disabled: {
    color: 'disabled',
    border: 'disabled',
    background: 'white',
  },
  ghost: {
    color: 'disabled',
    border: 'ghost',
    background: 'ghost',
  },
};

const StyledTag = styled.div<{ type: any; timer?: any }>`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ type }) => `var(--${type.color})`};
  background: ${({ type }) => `var(--${type.background})`};
  border: 2px solid ${({ type }) => `var(--${type.border})`};
  line-height: 66px;
  padding: 8px 10px;
  border-radius: 50px;
  font-family: 'Gilroy';
  font-style: normal;
  font-size: 12px;
  line-height: 16px;
  font-weight: 800;
  flex: none;
  order: 0;
  flex-grow: 0;

  ${({ timer }) =>
    timer &&
    `
    min-width: 60px;
    background-image: url('timer.png');
    background-repeat: no-repeat;
    background-position: center;
  `}
`;

export default function Tag({ label, type, timer }: ITagProps) {
  const tagColor = tagColors[type || 'default'];

  return (
    <StyledTag type={tagColor} timer={timer}>
      {label}
    </StyledTag>
  );
}

export const CustomStyledTag = styled(StyledTag)`
  padding: 20px 30px;
  font-size: 20px;
`;

export function ClaimTag({ label, type, timer }: ITagProps) {
  const tagColor = tagColors[type || 'default'];

  return (
    <CustomStyledTag type={tagColor} timer={timer}>
      {label}
    </CustomStyledTag>
  );
}
