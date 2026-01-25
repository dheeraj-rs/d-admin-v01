'use client';
import React, { useRef, useState, useEffect } from 'react';
import { PanelLeft, PanelTop, PanelBottom, PanelRight } from 'lucide-react';
import { classMixin } from '@/core/utils/class-mixin';
import { useLanguage } from '@/core/providers/LanguageProvider';
import { useLayoutStore } from '@/core/store';

interface AppTopbarMenuProps {
  configMenuButtonRef?: React.RefObject<HTMLButtonElement | null>;
  sidebarMenuButtonRef?: React.RefObject<HTMLButtonElement | null>;
}

const AppTopbarMenu: React.FC<AppTopbarMenuProps> = ({
  configMenuButtonRef,
  sidebarMenuButtonRef,
}) => {
  const layoutConfig = useLayoutStore((state) => state.layoutConfig);
  const layoutState = useLayoutStore((state) => state.layoutState);
  const onMenuToggle = useLayoutStore((state) => state.onMenuToggle);
  const onConfigToggle = useLayoutStore((state) => state.onConfigToggle);
  const onBottombarToggle = useLayoutStore((state) => state.onBottombarToggle);
  const onTopbarToggle = useLayoutStore((state) => state.onTopbarToggle);

  const { t } = useLanguage();
  const menubuttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 991);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    <div
      ref={containerRef}
      className={classMixin('layout-topbar-menu', {
        'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible,
      })}
    >
      <div className="layout-button-container">
        <button
          ref={menubuttonRef}
          type="button"
          className={classMixin('p-link layout-topbar-button', {
            'text-primary': isMenuActive,
            'text-color-secondary': !isMenuActive,
          })}
          onClick={onMenuToggle}
        >
          <PanelLeft size={24} strokeWidth={isMenuActive ? 2.5 : 1.5} />
          <span>{t('sidebar.collapse')}</span>
        </button>
        <button
          type="button"
          className={classMixin('p-link layout-topbar-button', {
            'text-primary': isTopbarVisible,
            'text-color-secondary': !isTopbarVisible,
          })}
          onClick={onTopbarToggle}
        >
          <PanelTop size={24} strokeWidth={isTopbarVisible ? 2.5 : 1.5} />
          <span>{t('layout.headerStyle')}</span>
        </button>
        <button
          type="button"
          className={classMixin('p-link layout-topbar-button', {
            'text-primary': isBottombarActive,
            'text-color-secondary': !isBottombarActive,
          })}
          onClick={onBottombarToggle}
        >
          <PanelBottom size={24} strokeWidth={isBottombarActive ? 2.5 : 1.5} />
          <span>{t('layout.footerStyle')}</span>
        </button>
        <button
          type="button"
          className={classMixin('p-link layout-topbar-button', {
            'text-primary': isConfigActive,
            'text-color-secondary': !isConfigActive,
          })}
          onClick={onConfigToggle}
        >
          <PanelRight size={24} strokeWidth={isConfigActive ? 2.5 : 1.5} />
          <span>{t('nav.webconfig')}</span>
        </button>
      </div>
    </div>
  );
};

export default AppTopbarMenu;
