import { Icon } from '@iconify/react';
export type ModelProvider = 'anthropic' | 'google' | 'openai';

interface ModelSelectorProps {
  value: ModelProvider;
  handleSelectModel: (value: ModelProvider) => void;
  className?: string;
}

const MODELS = [
  { value: 'google' as const, label: 'Gemini 3 Pro', icon: 'logos:google-gemini' },
  { value: 'anthropic' as const, label: 'Claude 4.5 Sonnet', icon: 'logos:claude' },
  { value: 'openai' as const, label: 'OpenAI (GPT-4o)', icon: 'logos:openai-icon' },
];

export function ModelSelector({ value, handleSelectModel, className }: ModelSelectorProps) {
  return (
    <div className="absolute bottom-full left-0 mb-2 w-64 p-1 rounded-xl border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-section)] shadow-lg overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100 origin-bottom-left">
      <div className="flex flex-col gap-0.5">
        <div className="px-2 py-1.5 text-xs font-medium text-[var(--d-admin-gray-600)]">Model</div>

        {MODELS.map((model) => (
          <button key={model.value} value={model.value} onClick={() => handleSelectModel(model.value)}
            className="flex items-center gap-2 px-2 py-1.5 text-sm text-[var(--d-admin-text-color)] hover:bg-[var(--d-admin-surface-hover)] rounded-lg w-full text-left transition-colors bg-[var(--d-admin-surface-hover)]/50">
            <Icon icon={model.icon} className="text-lg" />
            <div className="flex flex-col">
              <span>{model.label}</span>
              <span className="text-[10px] text-[var(--d-admin-gray-600)]">Most intelligent model</span>
            </div>
            {value === model.value && (
              <Icon icon="ph:check" className="ml-auto text-[var(--d-admin-text-color-secondary)]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
