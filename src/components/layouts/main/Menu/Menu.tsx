/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState, useMemo, useEffect, useCallback } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useCurrentBreakpoint } from '../../../../hooks/useCurrentBreakpoint';
import { theme } from '../../../../config';
import { getNextElementSibling, getPreviousElementSibling } from '../../../../utils/misc-utils';
import { useMainMenu } from '../../../../hooks/useMainMenu';

export const Menu = (): JSX.Element => {
  const { t, lang } = useTranslation();
  const currentBreakpoint = useCurrentBreakpoint();

  const [menuOpen, setMenuOpen] = useState(false);

  const { data: menuItems, isLoading: isMenuItemsLoading } = useMainMenu({ lang });

  const [hoveredMenuId, setHoveredMenuId] = useState<string | undefined>();
  const [selectedMenuId, setSelectedMenuId] = useState<string | undefined>(menuItems?.[0].id);
  const [mostRequestedExpanded, setMostRequestedExpanded] = useState<boolean>(false);
  const selectedMenuData = useMemo(() => menuItems?.find(({ id }) => id === selectedMenuId), [menuItems, selectedMenuId]);

  const handleMenuOnChange = (e: React.MouseEvent<HTMLAnchorElement>, menuId: string): void => {
    e.preventDefault();
    e.stopPropagation();
    setMostRequestedExpanded(false);
    setSelectedMenuId(menuId);
  };

  const handleMostRequestedOnClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setMostRequestedExpanded((prev) => !prev);
  };

  const handleOnMouseEnter = (menuId: string): void => setHoveredMenuId(menuId);
  const handleOnMouseLeave = (): void => setHoveredMenuId(undefined);
  const handleOnFocus = (menuId: string): void => setHoveredMenuId(menuId);
  const handleOnBlur = (): void => setHoveredMenuId(undefined);

  const onHoveredTimeoutCallback = useCallback((): void => {
    if (hoveredMenuId !== undefined) {
      setMostRequestedExpanded(false);
      setSelectedMenuId(hoveredMenuId);
    }
  }, [hoveredMenuId]);

  useEffect(() => {
    if (!isMenuItemsLoading && menuItems && !selectedMenuId) {
      setSelectedMenuId(menuItems[0].id);
    }
  }, [isMenuItemsLoading, selectedMenuId, menuItems]);

  useEffect(() => {
    const timer = hoveredMenuId !== undefined ? setTimeout(onHoveredTimeoutCallback, 300) : undefined;
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [hoveredMenuId, onHoveredTimeoutCallback]);

  const handleMenueItemOnKeydown = useCallback(
    (event: React.KeyboardEvent<HTMLAnchorElement>): void => {
      const key = event.key;
      const menuItem = event.currentTarget;
      // const hasPopup = menuItem.getAttribute('aria-haspopup') === 'true';
      const menu = menuItem.closest("ul[role='menu']") as HTMLUListElement;
      const inMenuBar = menu.classList.contains('menubar');

      // Define keys
      const TAB_KEY = 'Tab',
        ENTER_KEY = 'Enter',
        ESC_KEY = 'Escape',
        LEFT_KEY = 'ArrowLeft',
        UP_KEY = 'ArrowUp',
        RIGHT_KEY = 'ArrowRight',
        DOWN_KEY = 'ArrowDown',
        SPACE_KEY = ' ';

      if (!(event.ctrlKey || event.altKey || event.metaKey)) {
        // Tab key = Hide all sub-menus
        if (key === TAB_KEY) {
          setMenuOpen(false);
        }
        //Enter or spacebar on a link = follow the link and close menus
        else if (menuItem.nodeName === 'A' && menuItem.hasAttribute('href') && menuItem.getAttribute('href') !== '#' && (key === ENTER_KEY || key === SPACE_KEY)) {
          event.preventDefault();
          menuItem.click();
          setMenuOpen(false);
        } else if (inMenuBar) {
          // Left arrow or Escape = focus open/close menu button
          if (key === LEFT_KEY || key === ESC_KEY) {
            event.preventDefault();
            document.querySelector<HTMLButtonElement>('nav.gcweb-menu button')?.focus();
          }
          // Enter or Space = click menu item
          else if (selectedMenuData && (key === ENTER_KEY || key === SPACE_KEY)) {
            event.preventDefault();
            menuItem.click();
          }
          // Right arrow = focus sub-menu home link
          else if (selectedMenuData && key === RIGHT_KEY) {
            event.preventDefault();
            if (selectedMenuId) {
              document.querySelector<HTMLAnchorElement>(`.gc-mnu-${selectedMenuId}-home`)?.focus();
            }
          }
          // focus previous sibling
          else if (key === UP_KEY) {
            event.preventDefault();
            const parent = menuItem.closest('li') as HTMLElement;
            if (parent.previousElementSibling) {
              parent.previousElementSibling.querySelector<HTMLAnchorElement>('a[role=menuitem]')?.focus();
            }
          }
          // focus mext sibling
          else if (key === DOWN_KEY) {
            event.preventDefault();
            const parent = menuItem.closest('li') as HTMLElement;
            if (parent.nextElementSibling) {
              parent.nextElementSibling.querySelector<HTMLAnchorElement>('a[role=menuitem]')?.focus();
            }
          }
        } else {
          const inSubMenu = menuItem.closest('ul[role=menu]')?.id === `gc-mnu-${selectedMenuId}-sub`;

          // Left arrow or Escape = focus menubar menu item
          if (key === LEFT_KEY || key === ESC_KEY) {
            event.preventDefault();
            document.querySelector<HTMLAnchorElement>(`a[aria-controls=gc-mnu-${selectedMenuId}]`)?.focus();
          }
          // focus previous sibling
          else if (key === UP_KEY) {
            event.preventDefault();
            const parent = menuItem.closest('li') as HTMLElement;
            const sibling = getPreviousElementSibling(parent, '[role=presentation]');

            if (sibling) {
              sibling.querySelector<HTMLAnchorElement>('a[role=menuitem]')?.focus();
            } else if (inSubMenu) {
              // focus last element of parent menu
              const parentMenu = document.querySelector(`#gc-mnu-${selectedMenuId}`) as HTMLUListElement;
              parentMenu.querySelector<HTMLAnchorElement>('li[role=presentation]:last-child a[role=menuitem]')?.focus();
            }
          }
          // focus mext sibling
          else if (key === DOWN_KEY) {
            event.preventDefault();
            const parent = menuItem.closest('li') as HTMLElement;
            const sibling = getNextElementSibling(parent, '[role=presentation]');

            if (sibling) {
              sibling.querySelector<HTMLAnchorElement>('a[role=menuitem]')?.focus();
            } else if (!inSubMenu) {
              // focus first element of child menu
              const subMenu = menu.querySelector("ul[role='menu']") as HTMLUListElement;
              subMenu.querySelector<HTMLAnchorElement>('li[role=presentation]:first-child a[role=menuitem]')?.focus();
            }
          }
        }
      }
    },
    [selectedMenuData, selectedMenuId]
  );

  return (
    <nav className="gcweb-v2 gcweb-menu" typeof="SiteNavigationElement">
      <div className="container">
        <h2 className="wb-inv">{t('menu:header')}</h2>
        <button type="button" aria-haspopup="true" aria-expanded={menuOpen} onClick={() => setMenuOpen((prev) => !prev)}>
          <span className="wb-inv">{t('menu:expand-btn.main')}</span>
          {t('menu:expand-btn.menu')}
          <span className="expicon glyphicon glyphicon-chevron-down"></span>
        </button>
        <ul role="menu" aria-orientation="vertical" className="menubar">
          {menuItems?.map(({ id, text }) => (
            <li key={id} role="presentation">
              <a
                role="menuitem"
                tabIndex={0}
                aria-haspopup="true"
                aria-controls={`gc-mnu-${id}`}
                aria-expanded={id === selectedMenuId}
                href="#"
                onMouseEnter={() => handleOnMouseEnter(id)}
                onMouseLeave={handleOnMouseLeave}
                onFocus={() => handleOnFocus(id)}
                onBlur={handleOnBlur}
                onClick={(e) => handleMenuOnChange(e, id)}
                onKeyDown={handleMenueItemOnKeydown}>
                {text}
              </a>
              {selectedMenuData && (
                <ul id={`gc-mnu-${id}`} role="menu" aria-orientation="vertical">
                  <li role="presentation">
                    <a role="menuitem" tabIndex={-1} href={selectedMenuData.href} className={`gc-mnu-${id}-home`} onKeyDown={handleMenueItemOnKeydown}>
                      {selectedMenuData.text}
                      <span className="visible-xs-inline visible-sm-inline">{t('menu:home-append')}</span>
                    </a>
                  </li>
                  <li role="separator"></li>
                  {selectedMenuData.items?.map(({ href, text }) => (
                    <li key={text} role="presentation">
                      <a role="menuitem" tabIndex={-1} href={href} onKeyDown={handleMenueItemOnKeydown}>
                        {text}
                      </a>
                    </li>
                  ))}
                  <li role="separator" aria-orientation="vertical"></li>
                  <li role="presentation">
                    <a
                      data-keep-expanded="md-min"
                      href="#"
                      role="menuitem"
                      tabIndex={-1}
                      aria-haspopup="true"
                      aria-controls={`gc-mnu-${id}-sub`}
                      aria-expanded={(currentBreakpoint !== undefined && currentBreakpoint >= theme.breakpoints.md) || mostRequestedExpanded}
                      onClick={handleMostRequestedOnClick}
                      onKeyDown={handleMenueItemOnKeydown}>
                      {t('menu:most-requested')}
                    </a>
                    <ul id={`gc-mnu-${id}-sub`} role="menu" aria-orientation="vertical">
                      {selectedMenuData.mostRequestedItems?.map(({ href, text }) => (
                        <li key={text} role="presentation">
                          <a role="menuitem" tabIndex={-1} href={href} onKeyDown={handleMenueItemOnKeydown}>
                            {text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
