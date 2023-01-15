import React, { createContext, ReactNode, useState } from 'react';

interface IScreenLoadingContext {
  isScreenLoading: boolean;
  setScreenLoading: (value: boolean) => void;
}

export const ScreenLoadingContext = createContext<IScreenLoadingContext>({
  isScreenLoading: false,
  setScreenLoading: () => {},
});

export const ScreenLoadingProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [requestsInLoad, setRequestsInLoad] = useState(0);
  const [isScreenLoading, setPageLoading] = useState(false);

  const handleScreenLoading = (value: boolean) => {
    if (value) {
      setRequestsInLoad(requestsInLoad + 1);
    } else {
      const updatedRequestsCount = requestsInLoad - 1;

      setRequestsInLoad(updatedRequestsCount);

      if (updatedRequestsCount === 0) {
        setPageLoading(value);
      }
    }

    setPageLoading(value);
  };

  return (
    <ScreenLoadingContext.Provider
      value={{
        isScreenLoading,
        setScreenLoading: handleScreenLoading,
      }}
    >
      {children}
    </ScreenLoadingContext.Provider>
  );
};
