import { createContext, ReactNode, useEffect, useState } from 'react';

import toast from 'react-hot-toast';

import api from '../services/api';

type FormProps = {
  email: string;
  password: string;
}

type AuthContextType = {
  checking: boolean;
  loggedIn: boolean;
  signIn: ({ email, password }: FormProps) => Promise<void>;
  signUp: ({ email: password }: FormProps) => Promise<void>;
  signOut: () => void;
}

type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  const fetchSessionToken =  async () => {
    await api.get('/auth/me').then((response) => {
      if (response.status === 200) {
        setLoggedIn(true)
      }

      setChecking(false);
    }).catch(() => {
      setChecking(false);
    });
  }

  useEffect(() => {
    fetchSessionToken();
  }, [])

  async function signIn({ email, password }: FormProps) {
    await api.post('/auth/login', {
      email: email,
      password: password,
    }).then((response) => {
      console.log(response);
    }).catch(() => toast.error('Ocorreu um erro ao processar seu login.'))
  }

  async function signUp({ email, password }: FormProps) {
    await api.post('/auth/register', {
      email: email,
      password: password
    }).then((response) => {
      console.log(response);
    }).catch(() => toast.error('Ocorreu um erro ao processar seu registro.'))
  }

  async function signOut() {
    if (loggedIn) {
      await api.get('/auth/logout');

      localStorage.removeItem('@Authentication accessToken');
      localStorage.removeItem('@Authentication refreshToken');

      setLoggedIn(false);
    } else toast.error('Você precisa estar autenticado para sair de uma conta.')
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, signUp, checking, loggedIn }}>
      {props.children}
    </AuthContext.Provider>
  )
}