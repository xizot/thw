import { StylesConfig } from 'react-select';

export const selectStyles: StylesConfig = {
  option: (provided, state) => ({
    ...provided,
    fontSize: '14px',
    color: '#6B7280',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 12,
    paddingBottom: 12,
    cursor: 'pointer',
    borderBottom: '1px solid #E5E7EB',
    backgroundColor: state.isSelected
      ? '#E5E7EB'
      : state.isFocused
      ? '#F9FAFB'
      : '#ffffff',
    ':active': {},
  }),
  control: (styles, state) => ({
    ...styles,
    display: 'flex',
    alignItems: 'center',
    minHeight: 48,
    backgroundColor: state?.isDisabled ? '#EEF1F4' : '#ffffff',
    borderRadius: 5,
    border: '1px solid #D1D5DB',
    borderColor: state?.isDisabled
      ? '#D4D8DD'
      : state.isFocused
      ? 'rgb(var(--color-accent-500)) !important'
      : '#D1D5DB',
    boxShadow: state.menuIsOpen
      ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      : '',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: state.isFocused ? '#9CA3AF' : '#cccccc',
    '&:hover': {
      color: '#9CA3AF',
    },
  }),
  clearIndicator: (provided, state) => ({
    ...provided,
    color: state.isFocused ? '#9CA3AF' : '#cccccc',
    padding: 0,
    cursor: 'pointer',

    '&:hover': {
      color: '#9CA3AF',
    },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: 5,
    border: '1px solid #E5E7EB',
    boxShadow:
      '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  }),
  valueContainer: (provided) => ({
    ...provided,
    paddingLeft: 16,
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: '14px',
    color: '#4B5563',
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: 'rgb(var(--color-accent-400))',
    borderRadius: 9999,
    overflow: 'hidden',
    boxShadow:
      '0 0px 3px 0 rgba(0, 0, 0, 0.1), 0 0px 2px 0 rgba(0, 0, 0, 0.06)',
  }),
  multiValueLabel: (provided, state) => ({
    ...provided,
    paddingLeft: state.isRtl ? 0 : 12,
    paddingRight: state.isRtl ? 12 : 0,
    fontSize: '14px',
    color: '#ffffff',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    paddingLeft: 6,
    paddingRight: 6,
    color: '#ffffff',
    cursor: 'pointer',

    '&:hover': {
      backgroundColor: 'rgb(var(--color-accent-300))',
      color: '#F3F4F6',
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: '14px',
    color: 'rgba(107, 114, 128, 0.7)',
  }),
  noOptionsMessage: (provided) => ({
    ...provided,
    fontSize: '14px',
    color: 'rgba(107, 114, 128, 0.7)',
  }),
  input: (provided) => ({
    ...provided,
    fontSize: '14px',
    color: 'rgba(107, 114, 128, 0.7)',
    input: {
      '&:focus': {
        outline: 'none !important',
        border: 'none !important',
        boxShadow: 'none !important',
      },
    },
  }),
};
