/* eslint-disable react/react-in-jsx-scope */
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { extendTheme, NativeBaseProvider } from 'native-base';

import { App } from '@src/App';
import { store } from '@src/redux/store';
import { GlobalLoadingProvider } from '@src/providers/GlobalLoadingProvider';
import { ScreenLoadingProvider } from '@src/providers/ScreenLoadingProvider';

import { name as appName } from './app.json';

const RNRedux = () => {
  const theme = extendTheme({
    colors: {
      primary: {
        50: '#fefce8',
        100: '#fef9c3',
        200: '#fef08a',
        300: '#fde047',
        400: '#facc15',
        500: '#eab308',
        600: '#ffe502',
        700: '#bba700',
        800: '#854d0e',
        900: '#713f12',
      },
    },
    components: {
      Button: {
        variants: {
          ghost: {
            _light: {
              _text: {
                color: 'trueGray.800',
                textDecorationLine: 'underline',
                textDecorationStyle: 'solid',
                textDecorationColor: 'trueGray.800',
              },
              _spinner: { color: 'trueGray.800' },
              _pressed: {
                opacity: 0.6,
                backgroundColor: 'transparent',
              },
            },
          },
          solid: {
            _dark: {
              _text: { color: 'trueGray.900' },
              _spinner: { color: 'trueGray.900' },
              _pressed: {
                backgroundColor: 'primary.400',
              },
            },
            _light: {
              _text: { color: 'trueGray.700' },
              _spinner: { color: 'trueGray.700' },
              _pressed: {
                backgroundColor: 'primary.400',
              },
            },
          },
        },
      },
    },
    config: {
      initialColorMode: 'light',
      useSystemColorMode: false,
    },
  });

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <Provider store={store}>
      <NativeBaseProvider theme={theme}>
        <GlobalLoadingProvider>
          <ScreenLoadingProvider>
            <App />
          </ScreenLoadingProvider>
        </GlobalLoadingProvider>
      </NativeBaseProvider>
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => RNRedux);
