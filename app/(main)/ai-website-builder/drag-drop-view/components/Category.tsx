import React, { useState } from 'react';
import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon';
import ArrowSmallUpIcon from '@heroicons/react/24/outline/ArrowSmallUpIcon';
import { getImageUrl } from '../lib/builderUtils';
import { Component } from '../types';
import { THEMES } from '../lib/drag-drop-store';

interface CategoryProps {
    themeIndex: number;
    category: string;
    components: Component[];
    standaloneServer: boolean;
    onComponentClick: (component: Component) => void;
    onDragStart: () => void;
    onDragEnd: () => void;
}

export function Category({ themeIndex, category, components, standaloneServer, onComponentClick, onDragStart, onDragEnd }: CategoryProps) {
    const [show, setShow] = useState(false);

    return (
        <div id={category.toLowerCase()}>
            <div
                onClick={() => setShow((i) => !i)}
                className={`h-12 cursor-pointer bg-(--d-admin-surface-section) text-(--d-admin-text-color) border-b border-(--d-admin-border) last:border-b-0 flex items-center px-2 ${show ? 'shadow-sm' : ''
                    }`}
            >
                <div className="flex-1 flex items-center">
                    <Squares2X2Icon className="h-4 w-4 ml-2 mr-4" />{' '}
                    <h2 className="text-xs uppercase">{category}</h2>
                </div>
                <a className="rotate-animation" style={{ transform: `rotate(${show ? 180 : 0}deg)` }}>
                    <ArrowSmallUpIcon className="h-4 w-4" />
                </a>
            </div>
            {show && (
                <div>
                    {components.map((c: Component, i: number) => (
                        <img
                            key={i}
                            className="cursor-pointer mb-2 w-full h-auto object-cover rounded border border-transparent hover:border-[var(--d-admin-primary-color)] transition-all"
                            src={getImageUrl(standaloneServer, `/builder-elements/${THEMES[themeIndex].folder}/${c.folder}/preview.png`)}
                            draggable="true"
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
