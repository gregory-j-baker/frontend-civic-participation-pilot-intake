import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';

const LocaleSwitcher = () => {
  const router = useRouter();
  const { t, lang } = useTranslation();

  const handleClick = () => {
    router.push(router.pathname, undefined, {
      locale: lang === 'en' ? 'fr' : 'en',
    });
  };

  return <button onClick={handleClick}>{t(`common:language.${lang === 'en' ? 'fr' : 'en'}`)}</button>;
};

export default LocaleSwitcher;
