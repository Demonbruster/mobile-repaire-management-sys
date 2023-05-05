import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Text,
  Container,
  Button,
} from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { useForm } from '@mantine/form';
import * as Yup from 'yup';

import axios from '../lib/axios';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { reactQueryKey } from '../constants/constant';

const schema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

type IInitialValues = {
  email: string;
  password: string;
}


export default function Page() {
  const router = useRouter();

  const { isLoading, mutateAsync, error, isSuccess } = useMutation({
    mutationKey: [reactQueryKey.login], mutationFn: async (va: IInitialValues) => await axios.post('/login', {
      ...va,
    }).catch((error) => {
      throw error;
    })

  })

  const initialValues: IInitialValues = {
    email: '',
    password: '',
  }

  const { onSubmit, getInputProps } = useForm({
    initialValues,
    validate: (values) => {
      try {
        schema.validateSync(values, { abortEarly: false });
      } catch (error) {
        // @ts-ignore
        return error.inner.reduce((acc, error) => {
          acc[error.path] = error.message;
          return acc;
        }, {});
      }
    },
  });

  useEffect(() => {
    if (isSuccess) {
      router.push('/admin/dashboard');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])

  const handleSubmit = (va: IInitialValues) => {
    mutateAsync(va);
  }

  return (
    <Container size={420} my={40}>
      <form onSubmit={onSubmit(handleSubmit)}>
        <>
          <Title
            align="center"
            sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
          >
            Welcome back!
          </Title>
          <Text color="dimmed" size="sm" align="center" mt={5}>
            Sign in to your account
          </Text>

          {error && <Text color="red" size="sm" align="center" mt={5}>{
            // @ts-ignore
            error.response.data.error || ''
          }</Text>}
          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <TextInput label="Email" placeholder="your@email.com" required  {...getInputProps('email')} />
            <PasswordInput label="Password" placeholder="Your password" required mt="md" {...getInputProps('password')} />
            <Button fullWidth mt="xl" type='submit' loading={isLoading}>
              Sign in
            </Button>
          </Paper>
        </>
      </form>
    </Container>
  );
}