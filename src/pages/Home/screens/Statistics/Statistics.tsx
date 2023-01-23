import React, { FC, Fragment } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

import { Box, Text } from '@src/components/UI';
import { PageLayout } from '@src/components/PageLayout';

export const Statistics: FC = () => {
  const width = Dimensions.get('window').width;

  const chartWidth = width - width * 0.06;

  return (
    <PageLayout>
      <Box mb={5}>
        <Text fontSize={20} fontWeight={600}>
          Статистика
        </Text>

        <Text fontSize={18} fontWeight={300} mt={1}>
          Проанализируйте свои упражнения
        </Text>
      </Box>

      {['Сегодня:'].map(chart => (
        <Fragment key={chart}>
          <Text>{chart}</Text>

          <Box width="100%" alignItems="center" mb={5} key={chart}>
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
                color: () => '#78716c',
                labelColor: () => '#78716c',
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
          </Box>
        </Fragment>
      ))}
    </PageLayout>
  );
};
