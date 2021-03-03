import useTranslation from 'next-translate/useTranslation';

const Breadcrumb = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <nav id="wb-bc" property="breadcrumb">
      <h2 className="wb-inv">{t('layouts:main.header.breadcrumb.header')}</h2>
      <div className="container">
        <ol className="breadcrumb">
          {t<[{ text: string; href: string }]>('layouts:main.header.breadcrumb.links', {}, { returnObjects: true }).map(({ text, href }) => (
            <li key={text}>
              <a href={href}>{text}</a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;
