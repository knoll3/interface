import { Box, Button } from 'grommet';
import { useEffect, useState } from 'react';

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
      <Button
        primary
        label={label}
        onClick={handleButtonClick}
        style={{ boxShadow: '3px 4px 0px 0px #000' }}
        size="questButton"
      />
    );
  } else {
    return (
      <Box>
        <Button
          primary
          size="questButton"
          label={`${timer}`}
          fill
          style={{
            backgroundImage: "url('timer.png')",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            boxShadow: '3px 4px 0px 0px #000',
          }}
        />
      </Box>
    );
  }
}
