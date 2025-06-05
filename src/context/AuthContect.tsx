import { LOCALSTORAGE_KEYS } from '@/config/localstorageKeys';
import { UserResponse } from '@/constants/model';
import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

export interface AuthType {
  user?: UserResponse;
  setUser: (value: UserResponse) => void;
  sign?: string;
  setSign: (value?: string) => void;
  resetUser: () => void;
  isLoadingUser: boolean;
  setIsLoadingUser: (value: boolean) => void;
}

const AuthValues: AuthType = {
  user: {
    id: 0,
    // email: '',
    avatar: '',
    user_name: '',
    country_code: '',
    clicks: 0,
  },
  setUser: () => ({}),
  sign: '',
  setSign: () => ({}),
  resetUser: () => ({}),
  isLoadingUser: true,
  setIsLoadingUser: () => ({}),
};

const AuthContext = createContext(AuthValues);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse>();
  const [sign, setSign] = useState<string>();
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const signData = localStorage.getItem(LOCALSTORAGE_KEYS.Sign);
      if (signData) {
        setSign(signData);
      }
    }
  }, []);

  const resetUser = useCallback(() => {
    setUser({
      id: 0,
      // email: '',
      avatar: '',
      user_name: '',
      country_code: '',
      clicks: 0,
    });
    setSign(undefined);
    localStorage.removeItem(LOCALSTORAGE_KEYS.Sign);
  }, []);

  const value = {
    user,
    sign,
    setSign,
    setUser,
    resetUser,
    isLoadingUser,
    setIsLoadingUser,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
