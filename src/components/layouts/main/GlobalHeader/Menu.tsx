import { useState } from 'react';
import useTranslation from 'next-translate/useTranslation';

const Menu: React.FC = () => {
  const { t } = useTranslation();

  const [expanded, setExpanded] = useState(false);

  return (
    <nav className="gcweb-v2 gcweb-menu" typeof="SiteNavigationElement">
      <div className="container">
        <h2 className="wb-inv">{t('layouts:main.header.menu.header')}</h2>
        <button type="button" aria-haspopup="true" aria-expanded={expanded} onClick={() => setExpanded((prev) => !prev)}>
          <span className="wb-inv">{t('layouts:main.header.menu.expand-btn.main')}</span>
          {t('layouts:main.header.menu.expand-btn.menu')}
          <span className="expicon glyphicon glyphicon-chevron-down"></span>
        </button>
        <ul role="menu" aria-orientation="vertical" data-ajax-replace={t('layouts:main.header.menu.data-ajax-replace')}>
          {t<[{ text: string; href: string }]>('layouts:main.header.menu.default-items', {}, { returnObjects: true }).map(({ text, href }) => (
            <li key={text} role="presentation">
              <a role="menuitem" tabIndex={-1} href={href}>
                {text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Menu;
