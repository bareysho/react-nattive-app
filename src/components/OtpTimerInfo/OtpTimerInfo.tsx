import React, { FC, useMemo } from 'react';

import { Text } from '@src/components/UI';

interface IOtpTimerInfo {
  timeLeft: number;
}

export const OtpTimerInfo: FC<IOtpTimerInfo> = ({ timeLeft }) => {
  const isTimerActive = useMemo(() => Boolean(timeLeft), [timeLeft]);

  return (
    <>
      {isTimerActive && (
        <Text
          mt={2}
          fontSize={14}
        >{`Код отправлен, повтор через: ${timeLeft}`}</Text>
      )}

      <Text fontSize={14}>
        Мы отправим проверочный код на введенный email адрес.
      </Text>
    </>
  );
};
