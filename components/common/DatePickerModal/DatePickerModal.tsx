import React from 'react'
import { modals } from '@mantine/modals';
import { InputWrapperBaseProps, TextInput } from '@mantine/core';

interface IProps {
  label?: React.ReactNode;
  placeholder?: string;
}

function DatePickerModal({ label, value, placeholder }: IProps & InputWrapperBaseProps & { value?: Date}) {
  const openModal = () => modals.openConfirmModal({
    title: 'Select your date',
    children: (
      <>
        This action is so important that you are required to confirm it with a modal. Please click
        one of these buttons to proceed.
      </>
    ),
    labels: { confirm: 'Confirm', cancel: 'Cancel' },
    onCancel: () => console.log('Cancel'),
    onConfirm: () => console.log('Confirmed'),
  });
  return (
    <TextInput onClick={openModal} label={label} placeholder={placeholder} value={value?.toDateString()} />
  )
}

export default DatePickerModal