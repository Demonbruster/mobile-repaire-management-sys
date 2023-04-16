import React, { useState } from 'react'
import { modals } from '@mantine/modals';
import { Group, InputWrapperBaseProps, TextInput } from '@mantine/core';
import { DatePicker } from '@mantine/dates';

interface IProps {
  label?: React.ReactNode;
  placeholder?: string;
  onChange: (date: Date) => void;
}

function DatePickerModal({ label, value, placeholder, onChange, error }: IProps & InputWrapperBaseProps & { value?: Date }) {
  const [date, setDate] = useState<Date | null>(value ?? null);

  const openModal = () => modals.open({
    title: 'Select your date',
    children: (
      <Group position='center'>
        <DatePicker value={date} size='md' onChange={
          (date) => {
            setDate(date);
            onChange(date || new Date());
            modals.closeAll();
          }
        } />
      </Group>
    ),
  });
  return (
    <TextInput onClick={openModal} label={label} placeholder={placeholder} value={value?.toDateString()} readOnly error={error} />
  )
}

export default DatePickerModal