import useTranslation from 'next-translate/useTranslation';
import React from 'react';

const GlobalFooter: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="global-footer">
      <footer id="wb-info">
        <div className="landscape">
          <nav className="container wb-navcurr">
            <h2 className="wb-inv">{t('layouts:main.footer.about-government.header')}</h2>
            <ul className="list-unstyled colcount-sm-2 colcount-md-3">
              {t<[{ text: string; href: string }]>('layouts:main.footer.about-government.links', {}, { returnObjects: true }).map(({ text, href }) => (
                <li key={text}>
                  <a href={href}>{text}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="brand">
          <div className="container">
            <div className="row">
              <nav className="col-md-10 ftr-urlt-lnk">
                <h2 className="wb-inv">{t('layouts:main.footer.about-this-site.header')}</h2>
                <ul>
                  {t<[{ text: string; href: string }]>('layouts:main.footer.about-this-site.links', {}, { returnObjects: true }).map(({ text, href }) => (
                    <li key={text}>
                      <a href={href}>{text}</a>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="col-xs-6 visible-sm visible-xs tofpg">
                <a href="#wb-cont">
                  {t('layouts:main.footer.top-of-page')}
                  <span className="glyphicon glyphicon-chevron-up"></span>
                </a>
              </div>
              <div className="col-xs-6 col-md-2 text-right">
                <img src="https://www.canada.ca/etc/designs/canada/wet-boew/assets/wmms-blk.svg" alt={t('layouts:main.footer.icon-alt')} />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GlobalFooter;
