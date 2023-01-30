/* eslint-disable react/react-in-jsx-scope */
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import 'react-native-get-random-values';

import { App } from '@src/App';
import { store } from '@src/redux/store';
import { ThemeProvider } from '@src/components/UI';
import { GlobalLoadingProvider } from '@src/providers/GlobalLoadingProvider';
import { ScreenLoadingProvider } from '@src/providers/ScreenLoadingProvider';

import { name as appName } from './app.json';
import StorageContext from './src/storage/storage';

const { RealmProvider } = StorageContext;

const RNRedux = () => {
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <Provider store={store}>
      <ThemeProvider>
        <GlobalLoadingProvider>
          <ScreenLoadingProvider>
            <RealmProvider>
              <App />
            </RealmProvider>
          </ScreenLoadingProvider>
        </GlobalLoadingProvider>
      </ThemeProvider>
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => RNRedux);
