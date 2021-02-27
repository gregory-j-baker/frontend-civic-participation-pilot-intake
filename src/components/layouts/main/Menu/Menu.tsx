import { useState, useMemo } from 'react';
import useTranslation from 'next-translate/useTranslation';
import useCurrentBreakpoint from '../../../../hooks/useCurrentBreakpoint';
import { theme } from '../../../../config';

type TMenuData = {
  id: string;
  text: string;
  href: string;
  items: [
    {
      href: string;
      text: string;
    }
  ];
  mostRequestedItems: [
    {
      href: string;
      text: string;
    }
  ];
};

const Menu: React.FC = () => {
  const { t } = useTranslation();
  const currentBreakpoint = useCurrentBreakpoint();

  const [expanded, setExpanded] = useState(false);

  const menuData = useMemo(() => t<[TMenuData]>('menu:data', {}, { returnObjects: true }), [t]);

  const [selectedMenuId, setSelectedMenuId] = useState<string>(menuData[0].id);
  const [mostRequestedExpanded, setMostRequestedExpanded] = useState<boolean>(false);

  const selectedMenuData = useMemo(() => menuData.find(({ id }) => id === selectedMenuId), [menuData, selectedMenuId]);

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

  return (
    <nav className="gcweb-v2 gcweb-menu" typeof="SiteNavigationElement">
      <div className="container">
        <h2 className="wb-inv">{t('menu:header')}</h2>
        <button type="button" aria-haspopup="true" aria-expanded={expanded} onClick={() => setExpanded((prev) => !prev)}>
          <span className="wb-inv">{t('menu:expand-btn.main')}</span>
          {t('menu:expand-btn.menu')}
          <span className="expicon glyphicon glyphicon-chevron-down"></span>
        </button>
        <ul role="menu" aria-orientation="vertical">
          {menuData.map(({ id, text }) => (
            <li key={id} role="presentation">
              <a role="menuitem" tabIndex={0} aria-haspopup="true" aria-controls={`gc-mnu-${id}`} aria-expanded={id === selectedMenuId} href="#" onClick={(e) => handleMenuOnChange(e, id)}>
                {text}
              </a>
              {selectedMenuData && (
                <ul id="gc-mnu-jobs" role="menu" aria-orientation="vertical">
                  <li role="presentation">
                    <a role="menuitem" tabIndex={-1} href={selectedMenuData.href}>
                      {selectedMenuData.text}
                      <span className="visible-xs-inline visible-sm-inline">{t('menu:home-append')}</span>
                    </a>
                  </li>
                  <li role="separator"></li>
                  {selectedMenuData.items.map(({ href, text }) => (
                    <li key={text} role="presentation">
                      <a role="menuitem" tabIndex={-1} href={href}>
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
                      aria-expanded={(currentBreakpoint !== undefined && currentBreakpoint >= theme.breakpoints.mediumview) || mostRequestedExpanded}
                      onClick={handleMostRequestedOnClick}>
                      {t('menu:most-requested')}
                    </a>
                    <ul id={`gc-mnu-${id}-sub`} role="menu" aria-orientation="vertical">
                      {selectedMenuData.mostRequestedItems.map(({ href, text }) => (
                        <li key={text} role="presentation">
                          <a role="menuitem" tabIndex={-1} href={href}>
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

export default Menu;
