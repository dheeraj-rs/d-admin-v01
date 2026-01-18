import { AnimatePresence, cubicBezier, motion } from 'framer-motion';
import { Icon } from '@iconify/react';

interface SendButtonProps {
  show: boolean;
  isStreaming?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const customEasingFn = cubicBezier(0.4, 0, 0.2, 1);

export function SendButton({ show, isStreaming, onClick }: SendButtonProps) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.button
          className="flex justify-center bg-[var(--d-admin-blue-600)] enabled:hover:brightness-94 text-white rounded-full transition-theme disabled:cursor-not-allowed disabled:opacity-50 shrink-0 overflow-hidden items-center p-1 size-7"
          transition={{ ease: customEasingFn, duration: 0.17 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          onClick={(event) => {
            event.preventDefault();
            onClick?.(event);
          }}
        >
          <div className="text-lg flex items-center justify-center">
            {!isStreaming ? <Icon icon="heroicons-outline:arrow-up" className="size-4" style={{ opacity: 1, filter: 'blur(0px)', transform: 'none' }} /> : <Icon icon="ph:stop-circle-bold" className="text-xl" style={{ opacity: 1, filter: 'blur(0px)', transform: 'none' }} />}
          </div>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
