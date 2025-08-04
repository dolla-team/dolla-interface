'use client';

import { useDollaEye } from '@/hooks/use-dolla-eye';
import { createContext, ReactNode, useContext } from 'react';

export const DollaEyeContext = createContext<any>({});

function DollaEyeContextProvider({ children }: { children: ReactNode; }) {

  const dollaEye = useDollaEye();

  return (
    <DollaEyeContext.Provider value={dollaEye} >
      {children}
    </DollaEyeContext.Provider>
  );
}

export default DollaEyeContextProvider;

export function useDollaEyeContext() {
  return useContext(DollaEyeContext);
}
