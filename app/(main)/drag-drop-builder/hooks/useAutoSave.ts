import { useRef } from 'react';
import { debounce } from '../lib/utils';
import { savePage } from '../lib/api';

export function useAutoSave(standaloneServer: boolean) {
  const savePageDebounced = useRef(
    debounce((html: string) => {
      savePage(html, standaloneServer);
    }, 1000),
  );

  const triggerSave = (html: string) => {
    savePageDebounced.current(html);
  };

  return { triggerSave };
}
