'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InstallPWA() {
  const [promptEvent, setPromptEvent] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    const checkPWA = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isInStandaloneIOS = isIOS && window.navigator.standalone === true;
      setIsPWA(isStandalone || isInStandaloneIOS);
    };

    checkPWA();

    const wasPromptClosed = localStorage.getItem('pwaPromptClosed') === 'true';

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setPromptEvent(e);
      if (!isPWA && !wasPromptClosed) {
        setIsVisible(true);
      }
    };

    const handleAppInstalled = () => {
      setPromptEvent(null);
      setIsVisible(false);
      localStorage.setItem('pwaPromptClosed', 'true');
      checkPWA();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isPWA]);

  const handleInstall = async () => {
    if (!promptEvent) return;

    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;

    if (outcome === 'accepted') {
      setIsVisible(false);
      localStorage.setItem('pwaPromptClosed', 'true');
    }

    setPromptEvent(null);
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('pwaPromptClosed', 'true');
  };

  if (isPWA || !promptEvent || !isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-4 right-4 z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200 max-w-xs relative">
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="pr-5">
              <h3 className="font-semibold text-gray-900 mb-1">Install Our App</h3>
              <p className="text-sm text-gray-600 mb-3">
                जानिए अपने गाँव की ताकत, पढ़िए समाज के हीरो की कहानी – इंस्टॉल करें और जुड़ें!
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleInstall}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
              >
                Install Now
              </button>
              <button
                onClick={handleClose}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors text-sm"
              >
                Later
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
