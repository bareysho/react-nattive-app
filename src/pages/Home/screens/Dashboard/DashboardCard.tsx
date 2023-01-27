import React, { FC, ReactElement, ReactNode } from 'react';

import { Icon, Text, VStack } from '@src/components/UI';
import { Card } from '@src/components/Card';

interface IDashboardCard {
  children: ReactNode;
  icon: ReactElement;
  iconColor?: string;
  title?: string;
  bottomButton?: ReactElement;
}

export const DashboardCard: FC<IDashboardCard> = ({
  title,
  children,
  icon,
  iconColor,
  bottomButton,
}) => {
  return (
    <Card mt={6} flexDirection="row" alignItems="center">
      <VStack>
        <Icon color={iconColor} size={55} mr={5} as={icon} />

        {bottomButton}
      </VStack>

      <VStack>
        {title && (
          <Text mb={3} fontSize={18}>
            {title}
          </Text>
        )}

        {children}
      </VStack>
    </Card>
  );
};
