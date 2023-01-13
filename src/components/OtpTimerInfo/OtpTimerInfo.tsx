import React, { FC, useMemo } from 'react';
import { Text } from 'native-base';

interface IOtpTimerInfo {
  timeLeft: number;
}

export const OtpTimerInfo: FC<IOtpTimerInfo> = ({ timeLeft }) => {
  const isTimerActive = useMemo(() => Boolean(timeLeft), [timeLeft]);

  return (
    <>
      {isTimerActive && (
        <Text fontSize="xs">{`Код отправлен, повтор через: ${timeLeft}`}</Text>
      )}

      <Text fontSize="xs">
        Мы отправим проверочный код на введенный email адрес.
      </Text>
    </>
  );
};
