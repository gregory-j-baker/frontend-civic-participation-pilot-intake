/**
 * Copyright (c) Employment and Social Development Canada and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @author Greg Baker <gregory.j.baker@hrsdc-rhdcc.gc.ca>
 */
import { useState } from 'react';
import { NextPage } from 'next';
import TextField from '../components/form/TextField';
import { ITextFieldOnChangeEvent } from '../components/form/TextField/TextField';
import MainLayout from '../components/layouts/main/MainLayout';

interface IFormData {
  [x: string]: string | null;
  firstName: string | null;
}

const Home: NextPage = () => {
  const [formData, setFormData] = useState<IFormData>({ firstName: null });

  const onFieldChange: ITextFieldOnChangeEvent = ({ field, value }) => {
    setFormData((prev) => ({ ...prev, [field as keyof IFormData]: value }));
  };

  return (
    <MainLayout>
      <TextField field={nameof<IFormData>((o) => o.firstName)} label="First name" value={formData.firstName} onChange={onFieldChange} required gutterBottom className="tw-w-full md:tw-w-1/2" />
    </MainLayout>
  );
};

export default Home;
