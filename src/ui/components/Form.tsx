/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { FC, useState } from 'react';
import { Box } from 'ink';
import { InputParameter } from '../../definitions/ICommandDescriptor';
import { Form as FormA, FormFieldString, FormSection, FormStructure } from 'ink-form';

interface IFormInput {
  index: number;
  value: InputParameter
}

type FormProps = {
  parameters: Array<IFormInput>;
  handleAnswer: (answers: Array<IFormInput>) => void;
};

interface FormResponse {
  [name: number]: string;
}

const Form: FC<FormProps> = ({ parameters, handleAnswer }: FormProps) => {
  const [formResponse, setFormResponse] = useState({} as FormResponse);

  const generateFormFields = () => {
    const formFields = parameters.map((parameter) => {
      const input = parameter.value as InputParameter;
      return {
        type: input.type.toString(),
        name: parameter.index.toString(),
        label: input.question || input.parameter,
        initialValue: input.defaultValue as string || '',
      } as FormFieldString;
    });

    const section: FormSection = {
      title: 'the section',
      fields: formFields
    };

    const form: FormStructure = {
      title: 'The Title',
      sections: [ section ],
    };

    return form;
  };

  // @ts-ignore
  const handleChange = (data) => {
    const key = Object.keys(data)[0] as string;

    setFormResponse({
      ...formResponse,
      [parseInt(key)]: data[key]
    })
  }

  // @ts-ignore
  const handleSubmit = () => {
    parameters.forEach((parameter) => {
      const index = parameter.index;
      const answerIndex = parameters.findIndex(p => p.index == index);
      ((parameters[answerIndex] as IFormInput).value as InputParameter).answer = formResponse[index];
    });

    handleAnswer(parameters);
  }

  return (
    <Box>
      <FormA
        form={generateFormFields()}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}

export default Form;
