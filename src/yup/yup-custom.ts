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
import Reference from 'yup/lib/Reference';
import isAbsent from 'yup/lib/util/isAbsent';
import gPhoneNumber from 'google-libphonenumber';
import { WordRegExp } from '../common/WordRegExp';

export interface YupCustomMessage {
  key: string;
  path: string;
}

export interface CustomStringLocale extends StringLocale {
  minWord: Message<{ min: number }>;
  maxWord: Message<{ max: number }>;
  phone: Message;
}

const mixedLocale: MixedLocale = {
  required: ({ path }) => ({ key: 'required', path } as YupCustomMessage),
  defined: ({ path }) => ({ key: 'required', path } as YupCustomMessage),
};

const stringLocale: CustomStringLocale = {
  email: ({ path }) => ({ key: 'email-invalid', path } as YupCustomMessage),
  minWord: ({ path, min }) => ({ key: 'min-word', path, min } as YupCustomMessage),
  maxWord: ({ path, max }) => ({ key: 'max-word', path, max } as YupCustomMessage),
  phone: ({ path }) => ({ key: 'phone-invalid', path } as YupCustomMessage),
};

const booleanLocale: BooleanLocale = {
  isValue: ({ value, path }) => ({ key: `must-be-${value}`, path } as YupCustomMessage),
};

Yup.setLocale({
  mixed: mixedLocale,
  string: stringLocale,
  boolean: booleanLocale,
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

Yup.addMethod(Yup.string, 'minWord', function (min: number | Reference<number>, message: Message<{ min: number }> = stringLocale.minWord) {
  return this.test({
    message,
    name: 'minWord',
    exclusive: true,
    params: { min },
    test(value: Maybe<string>) {
      return isAbsent(value) || (value.match(WordRegExp)?.length ?? 0) >= this.resolve(min);
    },
  });
});

Yup.addMethod(Yup.string, 'maxWord', function (max: number | Reference<number>, message: Message<{ max: number }> = stringLocale.maxWord) {
  return this.test({
    message,
    name: 'maxWord',
    exclusive: true,
    params: { max },
    test(value: Maybe<string>) {
      return isAbsent(value) || (value.match(WordRegExp)?.length ?? 0) <= this.resolve(max);
    },
  });
});

declare module 'yup' {
  export interface StringSchema {
    minWord(min: number | Reference<number>, message?: Message<{ min: number }>): StringSchema;
    maxWord(max: number | Reference<number>, message?: Message<{ max: number }>): StringSchema;
    phone(countryCode?: string, strict?: boolean, errorMessage?: string): StringSchema;
  }
}
