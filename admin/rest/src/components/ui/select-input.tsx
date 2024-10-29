import Select from '@/components/ui/select/select';
import { IOptions } from '@/types/component';
import { Controller } from 'react-hook-form';
import { GetOptionValue, GetOptionLabel } from 'react-select';

interface SelectInputProps {
  control: any;
  label?: string;
  rules?: any;
  name: string;
  options: object[];
  getOptionLabel?: GetOptionLabel<unknown>;
  getOptionValue?: GetOptionValue<unknown>;
  isMulti?: boolean;
  isClearable?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  error?: string;
  [key: string]: unknown;
}

const SelectInput = ({
  control,
  options,
  label,
  name,
  rules,
  getOptionLabel,
  getOptionValue,
  disabled,
  isMulti,
  isClearable,
  isLoading,
  error,
  ...rest
}: SelectInputProps) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      {...rest}
      render={({ field }) => (
        <>
          {label ? (
            <label
              htmlFor={name}
              className="mb-3 block text-sm font-semibold leading-none text-body-dark"
            >
              {label}
            </label>
          ) : null}

          <Select
            {...field}
            getOptionLabel={getOptionLabel}
            getOptionValue={getOptionValue}
            isMulti={isMulti}
            isClearable={isClearable}
            isLoading={isLoading}
            options={options}
            isDisabled={disabled}
            placeholder=""
            value={options.find((option: any) => option.value === field.value)}
            onChange={(data) => {
              field.onChange((data as IOptions).value);
            }}
          />

          {error && (
            <p className="my-2 text-xs text-red-500 text-start">{error}</p>
          )}
        </>
      )}
    />
  );
};

export default SelectInput;
