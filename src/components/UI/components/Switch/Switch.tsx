import React, { FC } from 'react';
import { Switch as SwitchUI } from 'react-native-switch';

interface ISwitch {
  value: boolean;
  toggle: (value: boolean) => void;
}

export const Switch: FC<ISwitch> = ({ value, toggle }) => {
  return (
    <SwitchUI
      circleSize={20}
      onValueChange={toggle}
      value={value}
      barHeight={15}
      renderActiveText={false}
      renderInActiveText={false}
      backgroundActive="#ffe502"
      backgroundInactive="#d6d3d1"
      innerCircleStyle={{ elevation: 2 }}
      circleBorderWidth={0}
      switchWidthMultiplier={1}
    />
  );
};
