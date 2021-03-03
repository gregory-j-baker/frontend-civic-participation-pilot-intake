import useTranslation from 'next-translate/useTranslation';

const SkipToNav = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <nav>
      <ul id="wb-tphp">
        <li className="wb-slc">
          <a className="wb-sl" href="#wb-cont">
            {t('layouts:main.header.skip-to-nav.main-content')}
          </a>
        </li>
        <li className="wb-slc">
          <a className="wb-sl" href="#wb-info">
            {t('layouts:main.header.skip-to-nav.about-government')}
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default SkipToNav;
