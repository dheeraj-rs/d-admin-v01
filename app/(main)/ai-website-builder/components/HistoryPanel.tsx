import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '../stores/zustand';
import { Menu } from './HistoryMenu.client';
import { Icon } from '@iconify/react';
import { classNames } from '../utils/classNames';

export const HistoryPanel = () => {
  const showHistory = useChatStore((state) => state.showHistory);
  const setShowHistory = useChatStore((state) => state.setShowHistory);
  return (
    <AnimatePresence>
      {showHistory && (
        <>
          {/* Backdrop for outside click */}
          <motion.div
            className="z-[19 absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHistory(false)}
          />
          <motion.div
            key="history-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={classNames(
              'absolute top-0 right-0 bottom-0 z-[20] w-80',
              'border-surface border-l bg-[var(--d-admin-surface-ground)] text-[var(--d-admin-color-text)] shadow-sm',
              'flex flex-col',
            )}
          >
            <div className="border-surface flex items-center justify-between border-b p-4">
              <span className="text-color text-lg font-medium">History</span>
              <button
                onClick={() => setShowHistory(false)}
                className="hover:bg-surface-d hover:text-color rounded-md p-1 text-gray-500 transition-colors"
              >
                <Icon icon="ph:x" className="text-xl" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <Menu onSelect={() => setShowHistory(false)} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
