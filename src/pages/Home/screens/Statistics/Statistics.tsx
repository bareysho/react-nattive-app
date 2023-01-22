import React, { FC } from 'react';
import { Box, Center, Heading, Text } from 'native-base';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

import { PageLayout } from '@src/components/PageLayout';

export const Statistics: FC = () => {
  const width = Dimensions.get('window').width;

  const chartWidth = width - width * 0.1;

  return (
    <PageLayout>
      <Box mb={5}>
        <Heading size="lg" fontWeight="600">
          Статистика
        </Heading>

        <Heading mt={1} fontWeight="medium" size="xs">
          Проанализируйте свои упражнения
        </Heading>
      </Box>

      {['Сегодня:', 'Неделя:', 'Месяц:'].map(chart => (
        <Box mb={5} key={chart}>
          <Text textAlign="left" fontSize={16}>
            {chart}
          </Text>

          <Center>
            <LineChart
              data={{
                labels: Array.from(Array(12).keys()).map(i => `${i + 1}`),
                legend: ['L1'],
                datasets: [
                  {
                    data: [
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                    ],
                  },
                ],
              }}
              width={chartWidth} // from react-native
              height={220}
              yAxisLabel="$"
              yAxisSuffix="k"
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundGradientFrom: '#e7e5e4',
                backgroundGradientTo: '#e7e5e4',
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => '#78716c',
                labelColor: (opacity = 1) => '#78716c',
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#44403c',
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </Center>
        </Box>
      ))}
    </PageLayout>
  );
};
