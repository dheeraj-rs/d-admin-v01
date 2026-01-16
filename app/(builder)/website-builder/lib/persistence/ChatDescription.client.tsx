import { useChatStore } from '@/app/(builder)/website-builder/lib/stores/zustand';

export function ChatDescription() {
  return useChatStore(state => state.description);
}
