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
import { StringLocale } from 'yup/lib/locale';
import { Maybe, Message } from 'yup/lib/types';
import isAbsent from 'yup/lib/util/isAbsent';
import gPhoneNumber from 'google-libphonenumber';
import { YupCustomMessage } from './types';

export interface CustomStringLocale extends StringLocale {
  phone: Message;
}

const stringLocale: CustomStringLocale = {
  phone: ({ path }) => ({ key: 'phone-invalid', path } as YupCustomMessage),
};

Yup.setLocale({
  string: stringLocale,
});

const phoneUtil = gPhoneNumber.PhoneNumberUtil.getInstance();

const isValidCountryCode = (countryCode?: string): boolean => typeof countryCode === 'string' && countryCode.length === 2;

Yup.addMethod(Yup.string, 'phone', function (countryCode?: string, strict = true, message = stringLocale.phone) {
  return this.test({
    message: message || stringLocale.phone,
    name: 'phone',
    exclusive: true,
    test: (value: Maybe<string>) => {
      // if not valid countryCode, then set default country to Canada (CA)
      if (!isValidCountryCode(countryCode)) countryCode = 'CA';

      if (isAbsent(value)) return true;

      try {
        const phoneNumber = phoneUtil.parseAndKeepRawInput(value, countryCode);
        if (!phoneUtil.isPossibleNumber(phoneNumber)) return false;

        const regionCodeFromPhoneNumber = phoneUtil.getRegionCodeForNumber(phoneNumber);

        // check if the countryCode provided should be used as default country code or strictly followed
        return strict ? phoneUtil.isValidNumberForRegion(phoneNumber, countryCode) : phoneUtil.isValidNumberForRegion(phoneNumber, regionCodeFromPhoneNumber);
      } catch {
        return false;
      }
    },
  });
});

declare module 'yup' {
  export interface StringSchema {
    phone(countryCode?: string, strict?: boolean, errorMessage?: string): StringSchema;
  }
}
