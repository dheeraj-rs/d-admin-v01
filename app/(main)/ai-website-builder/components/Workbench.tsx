import React, { useState } from 'react';
import { Icon } from '@iconify/react';

export function Workbench() {
    const [activeView, setActiveView] = useState<'code' | 'preview'>('preview');

    return (
        <div className="z-workbench w-[var(--workbench-width)] bg-red-500">
            <div className="fixed top-0 bottom-4 select-none w-[var(--workbench-inner-width)] z-0 left-[var(--workbench-left)] flex flex-col overflow-hidden">
                <div className="pointer-events-auto">
                    <div className="flex relative items-center gap-2 py-2 min-h-[var(--panel-header-height)] pl-0">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center flex-wrap shrink-0 bg-slate-1 dark:bg-slate-11 overflow-hidden rounded-xl p-1 border border-bolt-elements-borderColor">
                                <div className="flex items-center">
                                    <button
                                        aria-label="Preview"
                                        aria-pressed={activeView === 'preview'}
                                        onClick={() => setActiveView('preview')}
                                        className={`bg-transparent text-sm px-2 py-1 rounded-full relative ${activeView === 'preview' ? 'text-bolt-elements-item-contentAccent' : 'text-bolt-elements-item-contentDefault hover:text-bolt-elements-item-contentActive'}`}
                                        data-state="closed"
                                    >
                                        <Icon icon="lucide:eye" className="size-4 block" />
                                        {activeView === 'preview' && <span className="absolute inset-0 z-0 bg-bolt-elements-item-backgroundAccent rounded-lg" style={{ opacity: 1 }}></span>}
                                    </button>
                                </div>
                                <div className="flex items-center">
                                    <button
                                        aria-label="Code"
                                        aria-pressed={activeView === 'code'}
                                        onClick={() => setActiveView('code')}
                                        className={`bg-transparent text-sm px-2 py-1 rounded-full relative ${activeView === 'code' ? 'text-bolt-elements-item-contentAccent' : 'text-bolt-elements-item-contentDefault hover:text-bolt-elements-item-contentActive'}`}
                                        data-state="closed"
                                    >
                                        <Icon icon="lucide:code" className="size-4 block" />
                                        {activeView === 'code' && <span className="absolute inset-0 z-0 bg-bolt-elements-item-backgroundAccent rounded-lg" style={{ opacity: 1 }}></span>}
                                    </button>
                                    <div className="w-px h-5 bg-bolt-elements-borderColor mx-1 opacity-60"></div>
                                </div>
                                <div className="flex items-center">
                                    <button aria-label="Database" aria-pressed="false" className="bg-transparent text-sm px-2 py-1 rounded-full relative text-bolt-elements-item-contentDefault hover:text-bolt-elements-item-contentActive" data-state="closed">
                                        <Icon icon="heroicons:circle-stack" className="size-4 block" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <button type="button" id="radix-:r4g:" aria-haspopup="menu" aria-expanded="false" data-state="closed" className="bg-transparent p-0" aria-label="More Options">
                                    <div className="flex items-center bg-transparent text-sm px-2 py-1 rounded-full relative text-bolt-elements-item-contentDefault hover:text-bolt-elements-item-contentActive pl-1 pr-1.5 h-5 opacity-90 hover:opacity-100" data-state="closed">
                                        <Icon icon="ph:gear-six-duotone" className="w-4 h-4" />
                                    </div>
                                </button>
                            </div>
                        </div>
                        <div className="ml-auto">
                            <div className="flex gap-3">
                                <div className="flex gap-1 empty:hidden"></div>
                                <div className="flex gap-1">
                                    <button className="flex items-center text-bolt-elements-item-contentDefault bg-transparent rounded-md disabled:cursor-not-allowed enabled:hover:text-bolt-elements-item-contentActive enabled:hover:bg-bolt-elements-item-backgroundActive p-1 relative w-8 h-8" data-state="closed">
                                        <Icon icon="bx:bxl-github" className="size-6 text-bolt-elements-textPrimary" />
                                    </button>
                                </div>
                                <button className="flex items-center justify-center font-medium shrink-0 min-w-0 max-w-full rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed gap-1 text-sm focus-visible:outline-bolt-ds-brandHighlight bg-bolt-ds-inverseSurface/10 enabled:hover:bg-bolt-ds-inverseSurface/15 text-bolt-ds-textPrimary h-8 px-3" type="button" id="radix-:r3v:" aria-haspopup="menu" aria-expanded="false" data-state="closed">
                                    <span className="truncate">Share</span>
                                </button>
                                <button className="items-center justify-center font-medium min-w-0 max-w-full rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed focus-visible:outline-bolt-ds-brandHighlight bg-bolt-elements-textPrimary text-bolt-elements-background-depth-1 flex gap-1.7 shrink-0 h-8 text-sm px-3" type="button" aria-controls="publish-menu" id="radix-:r42:" aria-haspopup="menu" aria-expanded="false" data-state="closed">Publish</button>
                                <button className="flex items-center justify-center font-medium shrink-0 min-w-0 max-w-full rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed gap-1 px-3 focus-visible:outline-bolt-ds-brandHighlight bg-transparent enabled:hover:bg-bolt-ds-inverseSurface/7 text-bolt-ds-textPrimary text-sm h-8 w-8" type="button" id="radix-:r49:" aria-haspopup="menu" aria-expanded="false" data-state="closed">
                                    <div className="flex items-center justify-center shrink-0 bg-bolt-ds-surfaceTwo text-bolt-ds-textSecondary border overflow-hidden rounded-full border-bolt-ds-borderOutline size-6">
                                        <img className="w-full h-full object-cover" src="https://stackblitz.com/avatars/D/194.svg" alt="" />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Panels */}
                <div className="relative flex-1 overflow-hidden border border-bolt-elements-borderColor rounded-xl">
                    <div className="absolute inset-0" style={{ transform: 'translateX(100%) translateZ(0px)' }}>
                        <div className="contents">
                            <div className="flex h-full relative">
                                {/* Left Panel - File Tree */}
                                <div className="" data-panel-group="" data-panel-group-direction="vertical" data-panel-group-id=":r3d:" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', width: '100%' }}>
                                    <div className="" data-panel="" data-panel-group-id=":r3d:" data-panel-id=":r3e:" data-panel-size="75.0" style={{ flex: '75 1 0px', overflow: 'hidden' }}>
                                        <div className="" data-panel-group="" data-panel-group-direction="horizontal" data-panel-group-id=":r3f:" style={{ display: 'flex', flexDirection: 'row', height: '100%', overflow: 'hidden', width: '100%' }}>
                                            <div className="" data-panel="" data-panel-collapsible="true" data-panel-group-id=":r3f:" data-panel-id=":r3g:" data-panel-size="23.0" style={{ flex: '23 1 0px', overflow: 'hidden' }}>
                                                <div data-testid="bolt-file-tree" className="flex flex-col border-r border-bolt-elements-borderColor overflow-hidden h-full">
                                                    {/* File Tree Content */}
                                                    <div className="relative h-full grid grid-rows-[auto_1fr] overflow-hidden">
                                                        {/* ... (simplified file tree header) ... */}
                                                        <div className="flex items-center bg-bolt-elements-background-depth-1 text-bolt-elements-textSecondary border-b border-bolt-elements-borderColor py-1 min-h-[34px] text-sm px-1.5 gap-1 @container">
                                                            <button className="flex items-center bg-transparent rounded-md disabled:cursor-not-allowed enabled:hover:text-bolt-elements-item-contentActive enabled:hover:bg-bolt-elements-item-backgroundActive p-1 gap-1.5 px-1 h-6 @[160px]:px-1.5 text-bolt-elements-textPrimary">
                                                                <Icon icon="ph:tree-structure-duotone" className="shrink-0 size-4 @[160px]:hidden @[200px]:block" />
                                                                <span className="hidden @[160px]:block">Files</span>
                                                            </button>
                                                            <button className="flex items-center text-bolt-elements-item-contentDefault bg-transparent rounded-md disabled:cursor-not-allowed enabled:hover:text-bolt-elements-item-contentActive enabled:hover:bg-bolt-elements-item-backgroundActive p-1 gap-1.5 px-1 h-6 @[160px]:px-1.5">
                                                                <Icon icon="ph:magnifying-glass-bold" className="shrink-0 size-4 @[160px]:hidden @[200px]:block" />
                                                                <span className="hidden @[160px]:block">Search</span>
                                                            </button>
                                                            <div className="flex-grow-1"></div>
                                                        </div>
                                                        <div className="relative overflow-hidden">
                                                            {/* ... file tree items ... */}
                                                            <div className="absolute inset-0 flex flex-col" tabIndex={0} style={{ opacity: 1, transform: 'translateX(0%) translateZ(0px)' }}>
                                                                <div className="text-sm flex flex-col flex-grow overflow-y-auto">
                                                                    {/* Example File Items */}
                                                                    <div data-state="closed"><div><button className="group flex items-center gap-1.5 w-full pr-2 border-2 border-transparent py-0.5 bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent" aria-pressed="true" style={{ paddingLeft: '6px' }}><Icon icon="ph:file-duotone" className="shrink-0 scale-98" /><div className="truncate w-full text-left"><div className="flex items-center"><div translate="no" className="flex-1 truncate pr-2">.env</div></div></div></button></div></div>
                                                                    <div data-state="closed"><div><button className="group flex items-center gap-1.5 w-full pr-2 border-2 border-transparent py-0.5 bg-transparent text-bolt-elements-item-contentDefault hover:text-bolt-elements-item-contentActive hover:bg-bolt-elements-item-backgroundActive" aria-pressed="false" style={{ paddingLeft: '6px' }}><Icon icon="ph:file-duotone" className="shrink-0 scale-98 group-hover:text-bolt-elements-item-contentActive" /><div className="truncate w-full text-left"><div className="flex items-center group-hover:text-bolt-elements-item-contentActive"><div translate="no" className="flex-1 truncate pr-2">package-lock.json</div></div></div></button></div></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="hidden" role="separator" tabIndex={0} data-panel-group-direction="horizontal" data-panel-group-id=":r3f:" data-resize-handle="" data-resize-handle-state="inactive" data-panel-resize-handle-enabled="true" data-panel-resize-handle-id=":r3j:" aria-controls=":r3g:" aria-valuemax={80} aria-valuemin={10} aria-valuenow={23} style={{ touchAction: 'none', userSelect: 'none' }}></div>

                                            {/* Editor/Preview Panel */}
                                            <div className="flex flex-col h-full" data-panel="" data-panel-group-id=":r3f:" data-panel-id=":r3k:" data-panel-size="77.0" style={{ flex: '77 1 0px', overflow: 'hidden' }}>
                                                {activeView === 'code' ? (
                                                    <>
                                                        <div className="flex items-center gap-2 bg-bolt-elements-background-depth-1 text-bolt-elements-textSecondary border-b border-bolt-elements-borderColor px-4 py-1 min-h-[34px] text-sm overflow-x-auto">
                                                            <div className="flex items-center flex-1 text-sm">
                                                                <div className="flex">
                                                                    <div className="relative flex items-center">
                                                                        <button className="flex items-center gap-1.5 cursor-pointer shrink-0 text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary pr-4 bg-transparent border-none" type="button" id="radix-:r4r:" aria-haspopup="menu" aria-expanded="false" data-state="closed">
                                                                            <Icon icon="ph:file-duotone" />
                                                                            <span translate="no">.env</span>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="relative h-full flex-1 overflow-hidden">
                                                            <div className="relative h-full">
                                                                <div className="h-full overflow-hidden">
                                                                    <div className="cm-editor ͼ1 ͼ3 ͼ4 ͼ17 ͼn">
                                                                        <div className="cm-announced" aria-live="polite"></div>
                                                                        <div tabIndex={-1} className="cm-scroller">
                                                                            <div className="cm-gutters" aria-hidden="true" style={{ minHeight: '14px', position: 'sticky' }}>
                                                                                <div className="cm-gutter cm-lineNumbers">
                                                                                    <div className="cm-gutterElement" style={{ height: '0px', visibility: 'hidden', pointerEvents: 'none' }}>9</div>
                                                                                    <div className="cm-gutterElement cm-activeLineGutter" style={{ height: '14px' }}>1</div>
                                                                                </div>
                                                                                <div className="cm-gutter cm-foldGutter">
                                                                                    <div className="cm-gutterElement" style={{ height: '0px', visibility: 'hidden', pointerEvents: 'none' }}>
                                                                                        <Icon icon="ph:caret-right-bold" className="fold-icon" />
                                                                                    </div>
                                                                                    <div className="cm-gutterElement cm-activeLineGutter" style={{ height: '14px' }}></div>
                                                                                </div>
                                                                            </div>
                                                                            <div style={{ tabSize: 2, paddingBottom: '1000px' }} spellCheck="false" autoCorrect="off" autoCapitalize="off" translate="no" contentEditable="true" className="cm-content cm-lineWrapping" role="textbox" aria-multiline="true" aria-label="Editor">
                                                                                <div className="cm-activeLine cm-line"><br /></div>
                                                                            </div>
                                                                            <div className="cm-layer cm-layer-above cm-cursorLayer" aria-hidden="true" style={{ zIndex: 150, animationDuration: '1200ms' }}>
                                                                                <div className="cm-cursor cm-cursor-primary" style={{ left: '64px', top: '6px', height: '14px' }}></div>
                                                                            </div>
                                                                            <div className="cm-layer cm-selectionLayer" aria-hidden="true" style={{ zIndex: -2 }}></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-full w-full bg-bolt-elements-background-depth-2">
                                                        <Icon icon="logos:bolt" className="size-20 opacity-20 grayscale brightness-50 contrast-50" />
                                                        <p className="mt-4 text-bolt-elements-textSecondary text-lg font-medium">Your preview will appear here</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden" role="separator" tabIndex={0} data-panel-group-direction="vertical" data-panel-group-id=":r3d:" data-resize-handle="" data-resize-handle-state="inactive" data-panel-resize-handle-enabled="true" data-panel-resize-handle-id=":r3l:" style={{ touchAction: 'none', userSelect: 'none' }} aria-controls=":r3e:" aria-valuemax={90} aria-valuemin={20} aria-valuenow={75}></div>
                                    {/* Bottom Panel (Terminal) */}
                                    <div className="min-h-[calc(var(--panel-header-height)-1px)]" data-panel="" data-panel-collapsible="true" data-panel-group-id=":r3d:" data-panel-id=":r3m:" data-panel-size="25.0" style={{ flex: '25 1 0px', overflow: 'hidden' }}>
                                        <div className="h-full">
                                            <div className="bg-bolt-elements-terminals-background h-full flex flex-col">
                                                <div className="flex items-center bg-bolt-elements-background-depth-1 border-y border-bolt-elements-borderColor gap-1.5 min-h-[var(--panel-header-height)] p-2" role="tablist">
                                                    <button className="flex items-center text-sm cursor-pointer gap-1.5 px-3 py-2 h-full whitespace-nowrap rounded-full bg-bolt-elements-terminals-buttonBackground text-bolt-elements-textPrimary" id="bolt-terminal-tab-0" role="tab" aria-selected="true" aria-controls="bolt-terminal-tapbanel-0"><Icon icon="ph:lightning-duotone" className="text-lg" />Bolt </button>
                                                    <button className="flex items-center text-sm cursor-pointer gap-1.5 px-3 py-2 h-full whitespace-nowrap rounded-full bg-bolt-elements-background-depth-2 text-bolt-elements-textSecondary hover:bg-bolt-elements-terminals-buttonBackground" id="bolt-terminal-tab-1" role="tab" aria-selected="false" aria-controls="bolt-terminal-tapbanel-1"><Icon icon="ph:rocket-launch" className="text-lg" />Publish Output </button>
                                                    <button className="flex items-center text-sm cursor-pointer gap-1.5 px-3 py-2 h-full whitespace-nowrap rounded-full bg-bolt-elements-background-depth-2 text-bolt-elements-textSecondary hover:bg-bolt-elements-terminals-buttonBackground" id="bolt-terminal-tab-2" role="tab" aria-selected="false" aria-controls="bolt-terminal-tapbanel-2"><Icon icon="ph:terminal-window-duotone" className="text-lg" />Terminal </button>
                                                    <button className="flex items-center text-bolt-elements-item-contentDefault bg-transparent rounded-md disabled:cursor-not-allowed enabled:hover:text-bolt-elements-item-contentActive enabled:hover:bg-bolt-elements-item-backgroundActive p-1"><Icon icon="ph:plus" className="text-md" /></button>
                                                    <button className="flex items-center text-bolt-elements-item-contentDefault bg-transparent rounded-md disabled:cursor-not-allowed enabled:hover:text-bolt-elements-item-contentActive enabled:hover:bg-bolt-elements-item-backgroundActive p-1 ml-auto" data-state="closed"><Icon icon="ph:caret-down" className="text-md" /></button>
                                                </div>
                                                <div translate="no" className="h-full overflow-hidden" role="tabpanel" id="bolt-terminal-tapbanel-0" aria-labelledby="bolt-terminal-tab-0">
                                                    <div dir="ltr" className="terminal xterm xterm-dom-renderer-owner-1">
                                                        <div className="xterm-viewport" style={{ backgroundColor: 'rgb(30, 30, 33)' }}>
                                                            <div className="xterm-scroll-area" style={{ height: '268px' }}></div>
                                                        </div>
                                                        <div className="xterm-screen" style={{ width: '672px', height: '84px' }}>
                                                            {/* ... xterm content ... */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
