/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useTranslation from 'next-translate/useTranslation';

export const Search = (): JSX.Element => {
  const { t, lang } = useTranslation();

  return (
    <section id="wb-srch" className="col-lg-offset-4 col-md-offset-4 col-sm-offset-2 col-xs-12 col-sm-5 col-md-4">
      <h2>{t('layouts:main.header.search.header')}</h2>

      <form action="https://www.canada.ca/en/sr/srb.html" method="get" name="cse-search-box" role="search">
        <div className="form-group wb-srch-qry">
          <label htmlFor="wb-srch-q" className="wb-inv">
            {t('layouts:main.header.search.label')}
          </label>
          <input name="cdn" value="canada" type="hidden" readOnly />
          <input name="st" value="s" type="hidden" readOnly />
          <input name="num" value="10" type="hidden" readOnly />
          <input name="langs" value={lang} type="hidden" readOnly />
          <input name="st1rt" value="1" type="hidden" readOnly />
          <input name="s5bm3ts21rch" value="x" type="hidden" readOnly />

          <input id="wb-srch-q" list="wb-srch-q-ac" className="wb-srch-q form-control" name="q" type="search" size={34} maxLength={170} placeholder={t('layouts:main.header.search.placeholder')} defaultValue="" />

          <input type="hidden" name="_charset_" value="UTF-8" readOnly />

          <datalist id="wb-srch-q-ac"></datalist>
        </div>
        <div className="form-group submit">
          <button type="submit" id="wb-srch-sub" className="btn btn-primary btn-small" name="wb-srch-sub">
            <span className="glyphicon-search glyphicon"></span>
            <span className="wb-inv">{t('layouts:main.header.search.submit')}</span>
          </button>
        </div>
      </form>
    </section>
  );
};
