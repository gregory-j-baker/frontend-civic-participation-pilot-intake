import { useRouter } from 'next/router';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';

const LocaleSwitcher: React.FC = () => {
  const { pathname } = useRouter();
  const { t, lang } = useTranslation();

  const localeToSwitch: string = lang === 'en' ? 'fr' : 'en';
  const localeNameToSwitch: string = t(`common:language.${localeToSwitch}`);

  return (
    <>
      <section id="wb-lng" className="col-xs-3 col-sm-12 pull-right text-right">
        <h2 className="wb-inv">Language selection</h2>
        <div className="row">
          <div className="col-md-12">
            <ul className="list-inline mrgn-bttm-0">
              <li>
                <Link href={pathname} locale={localeToSwitch}>
                  <a lang={localeToSwitch}>
                    <span className="hidden-xs">{localeNameToSwitch}</span>
                    <abbr title={localeNameToSwitch} className="visible-xs h3 mrgn-tp-sm mrgn-bttm-0 text-uppercase">
                      {localeToSwitch}
                    </abbr>
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default LocaleSwitcher;
