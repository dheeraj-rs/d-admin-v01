import { useIsMobile } from '@/core/hooks/use-mobile';

export function Workbench() {
    const isMobile = useIsMobile();

    return (
        <div className="z-workbench w-full h-full">
            <div className={`h-full relative flex-1 overflow-hidden ${isMobile ? 'border-none' : 'border border-[var(--d-admin-surface-border)] border-b-transparent border-r-transparent rounded-none rounded-tl-xl'}`}>

            </div>
        </div>
    );
}
