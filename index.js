/* eslint-disable react/react-in-jsx-scope */
import { AppRegistry, useColorScheme } from 'react-native';
import { Provider } from 'react-redux';
import { Provider as ThemeProvider } from 'react-native-paper';

import { App } from '@src/App';
import { store } from '@src/redux/store';
import { THEME_COLORS } from '@src/constants/theme';
import { GlobalLoadingProvider } from '@src/providers/GlobalLoadingProvider';

import { name as appName } from './app.json';

const darkMode = false;

const RNRedux = () => {
  const theme = THEME_COLORS.cyan;

  const systemColorScheme = useColorScheme() || 'light';
  const colorScheme = darkMode ? 'dark' : systemColorScheme;

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <Provider store={store}>
      <ThemeProvider theme={theme[colorScheme]}>
        <GlobalLoadingProvider>
          <App />
        </GlobalLoadingProvider>
      </ThemeProvider>
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => RNRedux);
