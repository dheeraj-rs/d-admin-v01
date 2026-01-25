import { useIsMobile } from '@/core/hooks/use-mobile';
import { Workbench } from './components/workbench/Workbench.client';

export function WorkbenchPanel() {
    const isMobile = useIsMobile();

    return (
        <div className="z-workbench w-full h-full">
            <div className={`h-full relative flex-1 overflow-hidden ${isMobile ? 'border-none' : 'border-l border-[var(--d-admin-surface-border)] rounded-none'}`}>
                <Workbench isStreaming={false} />
            </div>
        </div>
    );
}
