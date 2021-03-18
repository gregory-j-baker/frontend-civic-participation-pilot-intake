/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRouter } from 'next/router';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';

export const LocaleSwitcher = (): JSX.Element => {
  const { pathname, query } = useRouter();
  const { t, lang } = useTranslation();

  const localeToSwitch: string = lang === 'en' ? 'fr' : 'en';
  const localeNameToSwitch: string = t(`common:language.${localeToSwitch}`);

  return (
    <>
      <section id="wb-lng" className="col-xs-3 col-sm-12 pull-right text-right">
        <h2 className="wb-inv">{t('layouts:main.header.language-selection')}</h2>
        <div className="row">
          <div className="col-md-12">
            <ul className="list-inline mrgn-bttm-0">
              <li>
                <Link href={{ pathname, query }} locale={localeToSwitch} replace>
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
