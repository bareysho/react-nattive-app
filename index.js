/* eslint-disable react/react-in-jsx-scope */
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { NativeBaseProvider } from 'native-base';

import { App } from '@src/App';
import { store } from '@src/redux/store';
import { GlobalLoadingProvider } from '@src/providers/GlobalLoadingProvider';

import { name as appName } from './app.json';

const RNRedux = () => {
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <Provider store={store}>
      <NativeBaseProvider>
        <GlobalLoadingProvider>
          <App />
        </GlobalLoadingProvider>
      </NativeBaseProvider>
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => RNRedux);
