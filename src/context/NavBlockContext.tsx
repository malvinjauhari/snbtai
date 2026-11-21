import React, { createContext, useContext, useState, useEffect } from 'react';
import { useBlocker } from 'react-router-dom';
import ConfirmModal from '@/src/components/shared/ConfirmModal';

interface NavBlockContextType {
  setIsProcessing: (val: boolean) => void;
  isProcessing: boolean;
}

const NavBlockContext = createContext<NavBlockContextType>({ setIsProcessing: () => {}, isProcessing: false });

export function NavBlockProvider({ children }: { children: React.ReactNode }) {
  const [isProcessing, setIsProcessing] = useState(false);

  // Block native browser reload/close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isProcessing) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    if (isProcessing) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isProcessing]);

  // Block single-page app navigation (clicks on Link, browser back/forward buttons, programatic navigate)
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isProcessing && currentLocation.pathname !== nextLocation.pathname
  );

  return (
    <NavBlockContext.Provider value={{ setIsProcessing, isProcessing }}>
      {children}
      <ConfirmModal
        isOpen={blocker.state === 'blocked'}
        onClose={() => {
          if (blocker.state === 'blocked') blocker.reset();
        }}
        onConfirm={() => {
          setIsProcessing(false);
          if (blocker.state === 'blocked') blocker.proceed();
        }}
        title="Keluar dari chat?"
        message="Pesan atau proses yang sedang berjalan bisa hilang kalau kamu keluar sekarang."
        confirmText="Keluar"
        cancelText="Tetap di sini"
        variant="warning"
      />
    </NavBlockContext.Provider>
  );
}

export const useNavBlock = () => useContext(NavBlockContext);
