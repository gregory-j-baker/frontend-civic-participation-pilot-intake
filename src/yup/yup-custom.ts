/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Variation of yup-phone
 * Source code:
 * @see https://raw.githubusercontent.com/abhisekp/yup-phone/25ccaae862061d702357499454cabd1085fa8fa7/src/yup-phone.ts
 */
import * as Yup from 'yup';
import { BooleanLocale, MixedLocale, StringLocale } from 'yup/lib/locale';
import { YupCustomMessage } from './types';

const mixedLocale: MixedLocale = {
  required: ({ path }) => ({ key: 'required', path } as YupCustomMessage),
  defined: ({ path }) => ({ key: 'required', path } as YupCustomMessage),
};

const stringLocale: StringLocale = {
  email: ({ path }) => ({ key: 'email-invalid', path } as YupCustomMessage),
  length: ({ path }) => ({ key: 'length-invalid', path } as YupCustomMessage),
};

const booleanLocale: BooleanLocale = {
  isValue: ({ value, path }) => ({ key: `must-be-${value}`, path } as YupCustomMessage),
};

Yup.setLocale({
  mixed: mixedLocale,
  string: stringLocale,
  boolean: booleanLocale,
});
