// @flow
import React from 'react';

import FormControlWithLabel from './formControlWithLabel';

export type ConfigurableField = {
  fieldType: string,
  id: string,
  required: boolean,
  title: string
};

export type ConfiguredFieldType = {
  configurableField: ConfigurableField,
  id: string,
  valueData: Object
};

type Props = {
  configurableField: ConfigurableField,
  handleValueChange: Function,
  value: any
};

const ConfiguredField = ({ configurableField, handleValueChange, value }: Props) => {
  if (configurableField.__typename === 'TextField' && configurableField.fieldType !== 'PASSWORD') {
    return (
      <FormControlWithLabel
        label={configurableField.title}
        onChange={e => handleValueChange(e.target.value)}
        type="text"
        value={value}
        required={configurableField.required}
        disabled={configurableField.fieldType === 'EMAIL'}
      />
    );
  }

  return null;
};

export default ConfiguredField;