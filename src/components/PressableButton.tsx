import styled from 'styled-components';

const Button = styled.div<{ size?: any }>`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--brand);
  border: 2px solid var(--black);
  position: relative;
  z-index: 2;
  transition: left 0.1s ease, top 0.1s ease;
  padding: 8px 10px;
  border-radius: 50px;
  left: -2px;
  top: -2px;

  ${({ size }) =>
    size === 'large' &&
    `
    padding: 16px 20px;
  `}
`;

const Container = styled.div`
  padding: 2px 0 0 2px;

  &:hover ${Button} {
    left: 0 !important;
    top: 0 !important;
  }
`;

const Content = styled.div`
  position: relative;
  cursor: pointer;
  box-sizing: border-box;
`;

const Text = styled.span`
  box-sizing: border-box;
  font-family: 'Gilroy';
  font-style: normal;
  font-size: 14px;
  line-height: 16px;
  font-weight: 800;
  color: var(--white);
  flex: none;
  order: 0;
  flex-grow: 0;
`;

const Background = styled.span`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-color: var(--black);
  opacity: 1;
  transition: opacity 1s linear;
  border: 2px solid var(--black);
  border-radius: 50px;
`;

interface IPressableButtonProps {
  label: string;
  onClick(): void;
  size?: string;
}

export default function PressableButton({
  label,
  onClick,
  size,
}: IPressableButtonProps) {
  return (
    <Container onClick={() => onClick()} typeof="button">
      <Content>
        <Button size={size}>
          <Text>{label}</Text>
        </Button>
        <Background />
      </Content>
    </Container>
  );
}
