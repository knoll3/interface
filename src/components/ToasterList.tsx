import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import Toaster from './Toaster';
import { Box } from 'grommet';
import { IToastContent } from '../hooks/useToaster';

const StyledToasterList = styled.div`
  position: fixed;
  width: 100%;
  max-width: 292px;
  max-height: 100vh;
  top: 40px;
  right: 24px;
  z-index: 2;
  transition: transform 250ms, opacity 250ms, box-shadow 250ms ease-in-out;
`;

export default function ToasterList({ toasts }: any) {
  const ref = useRef<HTMLDivElement>(null);

  const handleScrolling = (el: HTMLDivElement) => {
    el?.scrollTo(0, el.scrollHeight);
  };

  useEffect(() => {
    handleScrolling(ref.current as HTMLDivElement);
  }, [toasts]);

  return (
    <StyledToasterList ref={ref}>
      <Box gap="small">
        {toasts.map((toast: { content: IToastContent }, index: number) => (
          <Toaster {...toast.content} key={index} />
        ))}
      </Box>
    </StyledToasterList>
  );
}
