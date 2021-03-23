/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { PhoneNumberUtil } from 'google-libphonenumber';

export const tryFormatPhoneNumber = (phoneNumber: string | undefined): string | undefined => {
  const phoneUtil = PhoneNumberUtil.getInstance();

  try {
    const rawInput = phoneUtil
      .parseAndKeepRawInput(phoneNumber ?? '', 'CA')
      .getNationalNumber()
      ?.toString();

    if (rawInput?.length === 7) return `${rawInput.slice(0, 3)}-${rawInput.slice(3, 7)}`;
    else if (rawInput?.length === 10) return `${rawInput.slice(0, 3)}-${rawInput.slice(3, 6)}-${rawInput.slice(6, 10)}`;
  } catch {
    /* intentionally left blank */
  }

  return phoneNumber;
};
