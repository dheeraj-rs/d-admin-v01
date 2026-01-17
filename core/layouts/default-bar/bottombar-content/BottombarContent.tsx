import React, { useState, useRef, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
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

    // Helper to recursively flatten items
    const flattenItems = (items: AppMenuItem[]): AppMenuItem[] => {
        let flat: AppMenuItem[] = [];
        items.forEach(item => {
            flat.push(item);
            if (item.items) {
                flat = flat.concat(flattenItems(item.items));
            }
        });
        return flat;
    };

    // Level 1 Items: Direct children of the top groupings (e.g. Dashboard, Website Builder, Elements)
    // We do NOT recursively flatten here, because we want 'Elements' to be an item.
    const rootMenuItems = useMemo(() => {
        return MENU_ITEMS.flatMap(group => (group.items as unknown as AppMenuItem[]) || []);
    }, []);

    const translatedMenuItems = useTranslatedMenuItems(rootMenuItems);

    // Content Menu State (for showing flattened attributes of a selected parent)
    const [showContentMenu, setShowContentMenu] = useState(false);
    const [contentMenuItems, setContentMenuItems] = useState<AppMenuItem[]>([]);
    const [activeParentLabel, setActiveParentLabel] = useState<string>('');

    const [showLayoutMenu, setShowLayoutMenu] = useState(false);

    const vibrate = () => {
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate(30);
        }
    };

    const handleItemClick = (index: number, item: AppMenuItem) => {
        // If the item has children (e.g. Elements), toggle the secondary menu showing its flattened children
        if (item.items && item.items.length > 0) {
            vibrate();

            // If clicking the same item that is currently open, close it
            if (showContentMenu && activeParentLabel === item.label) {
                setShowContentMenu(false);
                setActiveParentLabel('');
                setActiveIndex(index);
                return;
            }

            // Flatten all descendants of this item
            const flattenedSubItems = flattenItems(item.items);
            setContentMenuItems(flattenedSubItems);
            setActiveParentLabel(item.label || '');
            setShowContentMenu(true);
            setShowLayoutMenu(false); // Close layout menu if open
            setActiveIndex(index);
        } else {
            // Standard navigation
            setActiveIndex(index);
            vibrate();
            setShowContentMenu(false);
            setActiveParentLabel('');
            setShowLayoutMenu(false);
        }
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

    return (
        <React.Fragment>
            <div className="layout-bottombar-desktop" />
            <div className="layout-bottombar-mobile">
                {/* Secondary Layout Toggle Menu */}
                {showLayoutMenu && (
                    <div className="layout-toggle-menu">
                        <button
                            type="button"
                            className={`navigation-item ${isMenuActive ? 'active' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onMenuToggle();
                                vibrate();
                                setShowLayoutMenu(false);
                            }}
                        >
                            <div className="icon-wrapper">
                                <PanelLeft size={20} strokeWidth={isMenuActive ? 2.5 : 1.5} />
                                <span>{t('sidebar.collapse')}</span>
                            </div>
                        </button>
                        <button
                            type="button"
                            className={`navigation-item ${isTopbarVisible ? 'active' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onTopbarToggle();
                                vibrate();
                                setShowLayoutMenu(false);
                            }}
                        >
                            <div className="icon-wrapper">
                                <PanelTop size={20} strokeWidth={isTopbarVisible ? 2.5 : 1.5} />
                                <span>{t('layout.headerStyle')}</span>
                            </div>
                        </button>
                        <button
                            type="button"
                            className={`navigation-item ${isBottombarActive ? 'active' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onBottombarToggle();
                                vibrate();
                                setShowLayoutMenu(false);
                            }}
                        >
                            <div className="icon-wrapper">
                                <PanelBottom size={20} strokeWidth={isBottombarActive ? 2.5 : 1.5} />
                                <span>{t('layout.footerStyle')}</span>
                            </div>
                        </button>
                        <button
                            type="button"
                            className={`navigation-item ${isConfigActive ? 'active' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onConfigToggle();
                                vibrate();
                                setShowLayoutMenu(false);
                            }}
                        >
                            <div className="icon-wrapper">
                                <PanelRight size={20} strokeWidth={isConfigActive ? 2.5 : 1.5} />
                                <span>{t('nav.webconfig')}</span>
                            </div>
                        </button>
                    </div>
                )}

                {/* Secondary Content Menu (Values inside Elements etc.) */}
                {showContentMenu && (
                    <div className="secondary-menu-container">
                        <div className="secondary-menu-items">
                            {contentMenuItems.map((item, idx) => {
                                const iconClass = typeof item.icon === 'string' ? item.icon : 'pi pi-circle';

                                // Render as Link if it has a 'to' property, otherwise just a visual item (or inactive button)
                                if (item.to) {
                                    return (
                                        <Link
                                            key={idx}
                                            href={item.to}
                                            className="navigation-item"
                                            onClick={() => {
                                                vibrate();
                                                setShowContentMenu(false);
                                                setActiveParentLabel('');
                                            }}
                                        >
                                            <div className="icon-wrapper">
                                                <i className={`${iconClass}`} />
                                                <span>{item.label}</span>
                                            </div>
                                        </Link>
                                    );
                                } else {
                                    return (
                                        <div
                                            key={idx}
                                            className="navigation-item opacity-80"
                                        >
                                            <div className="icon-wrapper">
                                                <i className={`${iconClass}`} />
                                                <span>{item.label}</span>
                                            </div>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    </div>
                )}

                <div ref={scrollContainerRef} className="navigation-scroll-container">
                    {/* Trigger Button - Always visible on mobile */}
                    <button
                        type="button"
                        className={`navigation-item ${showLayoutMenu ? 'active' : ''}`}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowLayoutMenu(!showLayoutMenu);
                            setShowContentMenu(false); // Close content menu
                            setActiveParentLabel('');
                            vibrate();
                        }}
                    >
                        <div className="icon-wrapper">
                            <i className={`pi pi-th-large ${showLayoutMenu ? 'rotate-180' : ''}`} style={{ fontSize: '1.2rem' }} />
                            <span>Layout</span>
                            {showLayoutMenu && <span className="active-dot" />}
                        </div>
                    </button>
                    {translatedMenuItems.map((item, index) => {
                        const iconClass = typeof item.icon === 'string' ? item.icon : 'pi pi-circle';
                        // Check if this item is the currently active parent for the content menu
                        const isContentActive = showContentMenu && activeParentLabel === item.label;

                        // If item has children, it triggers the secondary menu. Otherwise it's a link.
                        const hasChildren = item.items && item.items.length > 0;

                        if (hasChildren) {
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    className={`navigation-item ${isContentActive ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleItemClick(index, item);
                                    }}
                                >
                                    <div className="icon-wrapper">
                                        <i className={iconClass} style={{ fontSize: '1.2rem' }} />
                                        <span>{item.label}</span>
                                        {isContentActive && <span className="active-dot" />}
                                    </div>
                                </button>
                            );
                        }

                        return (
                            <Link
                                href={item.to || '/dashboard'}
                                key={index}
                                className={`navigation-item ${activeIndex === index && !showLayoutMenu && !showContentMenu ? 'active' : ''}`}
                                onClick={() => {
                                    handleItemClick(index, item);
                                }}
                            >
                                <div className="icon-wrapper">
                                    <i className={iconClass} style={{ fontSize: '1.2rem' }} />
                                    <span>{item.label}</span>
                                    {activeIndex === index && !showLayoutMenu && !showContentMenu && <span className="active-dot" />}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
            {/* Click outside to close */}
            {/* Click outside to close - Portalled to body to escape stacking context */}
            {(showLayoutMenu || showContentMenu) && typeof document !== 'undefined' &&
                createPortal(
                    <div
                        className="overlay-backdrop"
                        onClick={() => {
                            setShowLayoutMenu(false);
                            setShowContentMenu(false);
                            setActiveParentLabel('');
                        }}
                    />,
                    document.body
                )
            }
            <div className="layout-bottombar-mask" />
        </React.Fragment>
    );
};

export default BottombarContent;
