/**
 * Copyright (c) Employment and Social Development Canada and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @author Greg Baker <gregory.j.baker@hrsdc-rhdcc.gc.ca>
 */

import { NextApiHandler } from 'next';

const handler: NextApiHandler<{ name: string }> = (_req, res) => {
  res.status(200).json({ name: 'John Doe' });
};

export default handler;
