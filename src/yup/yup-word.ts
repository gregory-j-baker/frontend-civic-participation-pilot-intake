/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as Yup from 'yup';
import { Maybe, Message } from 'yup/lib/types';
import Reference from 'yup/lib/Reference';
import isAbsent from 'yup/lib/util/isAbsent';
import { WordRegExp } from '../common/WordRegExp';
import { YupCustomMessage } from './types';
import { StringLocale } from 'yup/lib/locale';

export interface CustomStringLocale extends StringLocale {
  minWord: Message<{ min: number }>;
  maxWord: Message<{ max: number }>;
}

const stringLocale: CustomStringLocale = {
  minWord: ({ path, min }) => ({ key: 'min-word', path, min } as YupCustomMessage),
  maxWord: ({ path, max }) => ({ key: 'max-word', path, max } as YupCustomMessage),
};

Yup.setLocale({
  string: stringLocale,
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
  }
}
