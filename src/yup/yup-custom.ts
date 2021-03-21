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
import { Maybe, Message } from 'yup/lib/types';
import gPhoneNumber from 'google-libphonenumber';

export interface YupCustomMessage {
  key: string;
  path: string;
}

export interface CustomStringLocale extends StringLocale {
  phone?: Message;
}

const mixedLocale: MixedLocale = {
  required: ({ path }) => ({ key: 'required', path } as YupCustomMessage),
  defined: ({ path }) => ({ key: 'required', path } as YupCustomMessage),
};

const stringLocale: CustomStringLocale = {
  email: ({ path }) => ({ key: 'email-invalid', path } as YupCustomMessage),
  phone: ({ path }) => ({ key: 'phone-invalid', path } as YupCustomMessage),
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

declare module 'yup' {
  export interface StringSchema {
    /**
     * Check for phone number validity.
     *
     * @param {String} [countryCode=IN] The country code to check against.
     * @param {Boolean} [strict=false] How strictly should it check.
     * @param {String} [errorMessage=DEFAULT_MESSAGE] The error message to return if the validation fails.
     */
    phone(countryCode?: string, strict?: boolean, errorMessage?: string): StringSchema;
  }
}

const phoneUtil = gPhoneNumber.PhoneNumberUtil.getInstance();

const isValidCountryCode = (countryCode?: string): boolean => typeof countryCode === 'string' && countryCode.length === 2;

Yup.addMethod(Yup.string, 'phone', function (countryCode?: string, strict = false, message = stringLocale.phone) {
  return this.test({
    name: 'phone',
    message: message || stringLocale.phone,
    test: (value: Maybe<string>) => {
      // if not valid countryCode, then set default country to Canada (CA)
      if (!isValidCountryCode(countryCode)) countryCode = 'CA';

      if (!value) return true;

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
