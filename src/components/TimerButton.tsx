import { Box, Button } from 'grommet';
import { useEffect, useState } from 'react';
import Tag from './Tag';

interface ITimerButtonProps {
  label: string;
  onClick(): void;
}

export default function TimerButton({ label, onClick }: ITimerButtonProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(10);
  const handleButtonClick = () => {
    setTimer(10);
    setIsLoading(true);
    onClick();
  };

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        if (timer > 0) {
          setTimer(timer - 1);
        } else {
          clearInterval(interval);
          setIsLoading(false);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isLoading, timer]);

  if (!isLoading) {
    return (
      <Box>
        <Button
          primary
          label={label}
          onClick={handleButtonClick}
          size="small"
        />
      </Box>
    );
  } else {
    return (
      <Box>
        <Tag label={`${timer}`} type="black" timer />
      </Box>
    );
  }
}
