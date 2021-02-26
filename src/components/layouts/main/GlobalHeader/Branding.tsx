import useTranslation from 'next-translate/useTranslation';

const Branding: React.FC = () => {
  const { t, lang } = useTranslation();

  return (
    <div className="brand col-xs-9 col-sm-5 col-md-4" property="publisher" typeof="GovernmentOrganization">
      <link href={t('layouts:main.header.branding.main-site-url')} property="url" />

      <img src={t('layouts:main.header.branding.logo-url.goc')} alt={t('layouts:main.header.branding.name')} property="logo" />
      <span className="wb-inv">
        {' '}
        /<span lang={lang}>{t('layouts:main.header.branding.name')}</span>
      </span>

      <meta property="name" content={t('layouts:main.header.branding.name')} />
      <meta property="areaServed" typeof="Country" content={t('layouts:main.header.branding.country')} />
      <link property="logo" href={t('layouts:main.header.branding.logo-url.canada')} />
    </div>
  );
};

export default Branding;
