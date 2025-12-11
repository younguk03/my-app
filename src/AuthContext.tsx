// import React, { createContext, useState, useContext } from 'react';

// // ... (AuthContext = createContext(null) 부분은 동일)

// export const AuthProvider = ({ children }) => {
//   // ------------------------------------
//   // ▼ (수정!) useState의 초기값을 localStorage에서 가져오도록 변경
//   // ------------------------------------
//   const [user, setUser] = useState(() => {
//     // localStorage에서 'user' 항목을 가져옴
//     const savedUser = localStorage.getItem('user');
//     // 가져온 JSON 문자열을 객체로 파싱, 없으면 null
//     return savedUser ? JSON.parse(savedUser) : null;
//   });

//   const [token, setToken] = useState(() => {
//     // localStorage에서 'token' 항목을 가져옴
//     return localStorage.getItem('token');
//   });
//   // ------------------------------------
//   // ▲ (여기까지 수정)
//   // ------------------------------------


//   // 'login' 함수는 수정할 필요 없음 (localStorage에 잘 저장하고 있음)
//   const login = (authData) => {
//     setUser(authData.user);
//     setToken(authData.token);
//     localStorage.setItem('user', JSON.stringify(authData.user));
//     localStorage.setItem('token', authData.token);
//   };

//   // 'logout' 함수도 수정할 필요 없음 (localStorage에서 잘 제거하고 있음)
//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//   };

//   const value = { user, token, login, logout };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// // ... (useAuth 훅 부분은 동일)

// // 6. 커스텀 훅 (다른 컴포넌트에서 쉽게 쓰기 위함)
// export const useAuth = () => {
//   return useContext(AuthContext);
// };

import React, { createContext, useState, useContext } from 'react';

// 1. (오류의 원인) 이 라인이 AuthProvider 바깥에, 파일 상단에 있어야 합니다.


interface AuthProviderProps {
  children: React.ReactNode;
}
interface AuthData {
    user:Record<string, any>;
    token: string;
}

interface AuthContextType {
  user: any;
  token: string | null;
  login: (authData: AuthData) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | null>(null);
// 2. AuthProvider 컴포넌트
export const AuthProvider = ({ children}:AuthProviderProps) => {
  
  // 3. localStorage에서 값 읽어오기 (이전 단계에서 수정한 부분)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token');
  });

  
  // 4. 로그인/로그아웃 함수
  const login = (authData: AuthData) => {
    setUser(authData.user);
    setToken(authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));
    localStorage.setItem('token', authData.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value:AuthContextType = { user, token, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 6. 커스텀 훅
export const useAuth = () => {
  // null 방지
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};