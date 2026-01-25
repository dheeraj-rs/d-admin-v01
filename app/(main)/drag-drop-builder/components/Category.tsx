import React, { useState } from 'react';
import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon';
import ArrowSmallUpIcon from '@heroicons/react/24/outline/ArrowSmallUpIcon';
import { getImageUrl } from '../lib/utils';
import { Component } from '../types';
import { THEMES } from '../store/builder-store';

interface CategoryProps {
  themeIndex: number;
  category: string;
  components: Component[];
  standaloneServer: boolean;
  onComponentClick: (component: Component) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

import { useIsMobile } from '@/core/hooks/use-mobile';

export function Category({
  themeIndex,
  category,
  components,
  standaloneServer,
  onComponentClick,
  onDragStart,
  onDragEnd,
}: CategoryProps) {
  const [show, setShow] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div id={category.toLowerCase()}>
      <div
        onClick={() => setShow((i) => !i)}
        className={`flex h-12 cursor-pointer items-center border-b border-(--d-admin-border) bg-(--d-admin-surface-section) px-2 text-(--d-admin-text-color) last:border-b-0 ${
          show ? 'shadow-sm' : ''
        }`}
      >
        <div className="flex flex-1 items-center">
          <Squares2X2Icon className="mr-4 ml-2 h-4 w-4" />{' '}
          <h2 className="text-xs uppercase">{category}</h2>
        </div>
        <a
          className="rotate-animation"
          style={{ transform: `rotate(${show ? 180 : 0}deg)` }}
        >
          <ArrowSmallUpIcon className="h-4 w-4" />
        </a>
      </div>
      {show && (
        <div>
          {components.map((c: Component, i: number) => (
            <img
              key={i}
              className={`mb-2 h-auto w-full cursor-pointer rounded border border-transparent object-cover transition-all hover:border-[var(--d-admin-primary-color)] ${isMobile ? 'active:scale-95 active:opacity-80' : ''}`}
              src={getImageUrl(
                standaloneServer,
                `/builder-elements/${THEMES[themeIndex].folder}/${c.folder}/preview.png`,
              )}
              draggable={!isMobile}
              onClick={() => onComponentClick(c)}
              onDragStart={(e) => {
                e.dataTransfer.setData('component', `${category}-${i}`);
                onDragStart();
              }}
              onDragEnd={onDragEnd}
              alt={`${category} component ${i}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
