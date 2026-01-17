import React, { useState, useRef, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { MENU_ITEMS } from '@/core/layouts/constants/menu-data';
import { useTranslatedMenuItems } from '@/core/hooks/useTranslatedMenuItems';
import { AppMenuItem } from '@/core/types/admin-layout';
import { useLayoutStore } from '@/core/store';
import { PanelLeft, PanelTop, PanelBottom, PanelRight } from 'lucide-react';
import { useLanguage } from '@/core/providers/LanguageProvider';
import { classMixin } from '@/core/utils/class-mixin';

const BottombarContent = () => {
    const [activeIndex, setActiveIndex] = useState(2);
    const scrollContainerRef = useRef(null);
    const { t } = useLanguage();

    const layoutConfig = useLayoutStore((state) => state.layoutConfig);
    const layoutState = useLayoutStore((state) => state.layoutState);
    const onMenuToggle = useLayoutStore((state) => state.onMenuToggle);
    const onConfigToggle = useLayoutStore((state) => state.onConfigToggle);
    const onBottombarToggle = useLayoutStore((state) => state.onBottombarToggle);
    const onTopbarToggle = useLayoutStore((state) => state.onTopbarToggle);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 991);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const flatMenuItems = useMemo(() => {
        const flatten = (items: AppMenuItem[]): AppMenuItem[] => {
            let flat: AppMenuItem[] = [];
            items.forEach(item => {
                if (item.to) {
                    flat.push(item);
                }
                if (item.items) {
                    flat = flat.concat(flatten(item.items));
                }
            });
            return flat;
        };
        const flat = flatten(MENU_ITEMS);
        return flat;
    }, []);

    const translatedMobileMenuItems = useTranslatedMenuItems(flatMenuItems);

    const vibrate = () => {
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate(30);
        }
    };

    const handleItemClick = (index: number) => {
        setActiveIndex(index);
        vibrate();
    };

    const isOverlay = layoutConfig.menuMode === 'overlay';

    const isMenuActive = isMobile
        ? layoutState.staticMenuMobileActive
        : isOverlay
            ? layoutState.overlayMenuActive
            : !layoutState.staticMenuDesktopInactive;

    const isConfigActive = isMobile
        ? layoutState.staticConfigMobileActive
        : isOverlay
            ? layoutState.overlayConfigActive
            : !layoutState.staticConfigDesktopInactive;

    const isBottombarActive = isOverlay
        ? layoutState.overlayBottombarActive
        : isMobile
            ? !layoutState.staticBottombarMobileHide
            : !layoutState.staticBottombarDesktopInactive;

    const isTopbarVisible = !layoutState.topbarAutoHide;

    const [showLayoutMenu, setShowLayoutMenu] = useState(false);

    return (
        <React.Fragment>
            <div className="layout-bottombar-desktop" />
            <div className="layout-bottombar-mobile">
                {/* Secondary Layout Toggle Menu */}
                {showLayoutMenu && (
                    <div className="absolute bottom-full left-0 right-0 mx-4 mb-3 p-2 bg-surface-0/90 backdrop-blur-md rounded-xl border border-surface shadow-lg flex items-center justify-around z-50 animate-in slide-in-from-bottom-2 fade-in duration-200">
                        <button
                            type="button"
                            className={`flex flex-col items-center gap-1 min-w-[60px] p-1 rounded-lg transition-colors ${isMenuActive ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
                                }`}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onMenuToggle();
                                vibrate();
                                setShowLayoutMenu(false);
                            }}
                        >
                            <PanelLeft size={20} strokeWidth={isMenuActive ? 2.5 : 1.5} />
                            <span className="text-[10px] whitespace-nowrap">{t('sidebar.collapse')}</span>
                        </button>
                        <button
                            type="button"
                            className={`flex flex-col items-center gap-1 min-w-[60px] p-1 rounded-lg transition-colors ${isTopbarVisible ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
                                }`}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onTopbarToggle();
                                vibrate();
                                setShowLayoutMenu(false);
                            }}
                        >
                            <PanelTop size={20} strokeWidth={isTopbarVisible ? 2.5 : 1.5} />
                            <span className="text-[10px] whitespace-nowrap">{t('layout.headerStyle')}</span>
                        </button>
                        <button
                            type="button"
                            className={`flex flex-col items-center gap-1 min-w-[60px] p-1 rounded-lg transition-colors ${isConfigActive ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
                                }`}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onConfigToggle();
                                vibrate();
                                setShowLayoutMenu(false);
                            }}
                        >
                            <PanelRight size={20} strokeWidth={isConfigActive ? 2.5 : 1.5} />
                            <span className="text-[10px] whitespace-nowrap">{t('nav.webconfig')}</span>
                        </button>
                    </div>
                )}

                <div ref={scrollContainerRef} className="navigation-scroll-container relative">
                    {/* Trigger Button - Always visible on mobile */}
                    <button
                        type="button"
                        className={`navigation-item ${showLayoutMenu ? 'active' : ''}`}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowLayoutMenu(!showLayoutMenu);
                            vibrate();
                        }}
                    >
                        <div className="icon-wrapper">
                            <i className={`pi pi-th-large transition-transform duration-300 ${showLayoutMenu ? 'rotate-180' : ''}`} style={{ fontSize: '1.2rem' }} />
                            <span>Layout</span>
                            {showLayoutMenu && <span className="active-dot" />}
                        </div>
                    </button>
                    <div className="w-[1px] h-6 bg-surface-border mx-1 self-center opacity-30" />

                    {translatedMobileMenuItems.map((item, index) => {
                        const iconClass = typeof item.icon === 'string' ? item.icon : 'pi pi-circle';

                        return (
                            <Link
                                href={item.to || '/dashboard'}
                                key={index}
                                className={`navigation-item ${activeIndex === index && !showLayoutMenu ? 'active' : ''}`}
                                onClick={() => {
                                    handleItemClick(index);
                                    setShowLayoutMenu(false);
                                }}
                            >
                                <div className="icon-wrapper">
                                    <i className={iconClass} style={{ fontSize: '1.2rem' }} />
                                    <span>{item.label}</span>
                                    {activeIndex === index && !showLayoutMenu && <span className="active-dot" />}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
            {/* Click outside to close */}
            {showLayoutMenu && (
                <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setShowLayoutMenu(false)}
                />
            )}
            <div className="layout-bottombar-mask" />
        </React.Fragment>
    );
};

export default BottombarContent;
