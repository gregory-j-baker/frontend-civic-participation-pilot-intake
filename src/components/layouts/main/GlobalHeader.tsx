/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Branding } from './Branding';
import { LocaleSwitcher } from './LocaleSwitcher';
import { Menu } from './Menu';
import { Search } from './Search';
import { SkipToNav } from './SkipToNav';

export const GlobalHeader = (): JSX.Element => {
  return (
    <div className="global-header">
      <SkipToNav />
      <header>
        <div id="wb-bnr" className="container">
          <div className="row">
            <LocaleSwitcher />
            <Branding />
            <Search />
          </div>
        </div>
        <Menu />
      </header>
    </div>
  );
};
