import { motion } from 'framer-motion';
import { memo } from 'react';
import { classNames } from '../../utils/classNames';
import { cubicEasingFn } from '../../utils/easings';
import { genericMemo } from '../../utils/react';

interface SliderOption<T> {
  value: T;
  text: string;
}

export interface SliderOptions<T> {
  left: SliderOption<T>;
  right: SliderOption<T>;
}

interface SliderProps<T> {
  selected: T;
  options: SliderOptions<T>;
  setSelected?: (selected: T) => void;
}

export const Slider = genericMemo(
  <T,>({ selected, options, setSelected }: SliderProps<T>) => {
    const isLeftSelected = selected === options.left.value;

    return (
      <div className="bg-surface-c flex shrink-0 flex-wrap items-center gap-1 overflow-hidden rounded-full p-1">
        <SliderButton
          selected={isLeftSelected}
          setSelected={() => setSelected?.(options.left.value)}
        >
          {options.left.text}
        </SliderButton>
        <SliderButton
          selected={!isLeftSelected}
          setSelected={() => setSelected?.(options.right.value)}
        >
          {options.right.text}
        </SliderButton>
      </div>
    );
  },
);

interface SliderButtonProps {
  selected: boolean;
  children: React.ReactNode;
  setSelected: () => void;
}

const SliderButton = memo(
  ({ selected, children, setSelected }: SliderButtonProps) => {
    return (
      <button
        onClick={setSelected}
        className={classNames(
          'relative rounded-full bg-transparent px-2.5 py-0.5 text-sm transition-colors',
          selected ? 'text-primary' : 'text-text-secondary hover:text-text',
        )}
      >
        <span className="relative z-10">{children}</span>
        {selected && (
          <motion.span
            layoutId="pill-tab"
            transition={{ duration: 0.2, ease: cubicEasingFn }}
            className="bg-primary/10 absolute inset-0 z-0 rounded-full"
          ></motion.span>
        )}
      </button>
    );
  },
);
