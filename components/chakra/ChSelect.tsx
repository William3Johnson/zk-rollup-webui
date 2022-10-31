/* eslint-disable react/display-name */
import type { GroupBase, Props, SelectComponent, SelectInstance } from 'chakra-react-select';
import { OptionBase, Select } from 'chakra-react-select';
import type { MutableRefObject } from 'react';
import { forwardRef, ReactNode } from 'react';

export interface GroupedOption extends OptionBase {
  value: string | number;
  label: ReactNode | string;
}

export const ChSelect = forwardRef(
  <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
    props: Props<Option, IsMulti, Group>,
    ref:
      | ((instance: SelectInstance<Option, IsMulti, Group> | null) => void)
      | MutableRefObject<SelectInstance<Option, IsMulti, Group> | null>
      | null,
  ) => {
    return (
      <Select
        ref={ref}
        chakraStyles={{
          option: (provided, state) => ({
            ...provided,
            background: state.isFocused ? 'blue.100' : provided.background,
            p: '10px',
            fontSize: '12px',
          }),
          indicatorSeparator: (provider, state) => ({
            ...provider,
            display: 'none',
          }),
          singleValue: (provided, state) => ({
            ...provided,
            color: '#76808F',
            fontSize: '12px',
          }),
          dropdownIndicator: (provided, state) => ({
            ...provided,
            background: 'none',
            border: 'none',
          }),
          crossIcon: (provided, state) => ({
            ...provided,
            color: '#AEB4BC',
            fontSize: '12px',
            border: 'none',
          }),
          placeholder: (provided, state) => ({
            ...provided,
            color: '#AEB4BC',
            fontSize: '12px',
          }),
          container: (provided, state) => ({
            ...provided,
            background: '#F5F5F5',
            borderColor: '#F5F5F5',
            borderRadius: '6px',
            outline: 'none',
          }),
        }}
        {...props}
      />
    );
  },
) as SelectComponent;
