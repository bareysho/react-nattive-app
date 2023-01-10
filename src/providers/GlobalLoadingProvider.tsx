import React, { createContext, ReactNode, useState } from 'react';

interface IGlobalLoadingContext {
  isGlobalLoading: boolean;
  setGlobalLoading: (value: boolean) => void;
}

export const GlobalLoadingContext = createContext<IGlobalLoadingContext>({
  isGlobalLoading: false,
  setGlobalLoading: () => {},
});

export const GlobalLoadingProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [requestsInLoad, setRequestsInLoad] = useState(0);
  const [isGlobalLoading, setGlobalLoading] = useState(false);

  const handleSetGlobalLoading = (value: boolean) => {
    if (value) {
      setRequestsInLoad(requestsInLoad + 1);
    } else {
      const updatedRequestsCount = requestsInLoad - 1;

      setRequestsInLoad(updatedRequestsCount);

      if (updatedRequestsCount === 0) {
        setGlobalLoading(value);
      }
    }

    setGlobalLoading(value);
  };

  return (
    <GlobalLoadingContext.Provider
      value={{
        isGlobalLoading,
        setGlobalLoading: handleSetGlobalLoading,
      }}
    >
      {children}
    </GlobalLoadingContext.Provider>
  );
};
