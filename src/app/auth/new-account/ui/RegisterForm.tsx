'use client';

import { login, registerUser } from '@/actions';
import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type FormInputs = {
  name: string;
  email: string;
  password: string;
};

export const RegisterForm = () => {
  const [errorMessage, setErrorMessage] = React.useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const { name, email, password } = data;

    // Server Action
    const resp = await registerUser({ name, email, password });

    if (!resp.ok) {
      setErrorMessage(resp.message);
      return;
    }

    await login({ email: email.toLowerCase(), password });
    window.location.replace('/');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <label htmlFor="email">Nombre completo</label>
      <input
        className={clsx('px-5 py-2 border bg-gray-200 rounded mb-5', {
          'border-red-500': !!errors.name,
        })}
        autoFocus
        type="text"
        {...register('name', { required: true })}
      />

      <label htmlFor="email">Correo</label>
      <input
        className={clsx('px-5 py-2 border bg-gray-200 rounded mb-5', {
          'border-red-500': !!errors.email,
        })}
        type="email"
        {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
      />

      <label htmlFor="password">Contraseña</label>
      <input
        className={clsx('px-5 py-2 border bg-gray-200 rounded mb-5', {
          'border-red-500': !!errors.name,
        })}
        type="password"
        {...register('password', { required: true })}
      />
      {/* 
      {errors.email?.type === 'required' && (
        <p className="text-red-500">* El correo es requerido</p>
      )}
      {errors.email?.type === 'pattern' && (
        <p className="text-red-500">* El correo no es valido</p>
      )} */}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <button className="btn-primary">Crear cuenta</button>

      {/* divisor l ine */}
      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      <Link href="/auth/login" className="btn-secondary text-center">
        Ingresar
      </Link>
    </form>
  );
};
