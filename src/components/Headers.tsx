import { Sparkles } from 'lucide-react';
import React from 'react';
import { useAuth } from '../AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import { logDOM } from '@testing-library/dom';

export default function Headers() {
  const {user, logout} = useAuth()
  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate('/login');
  }
  const handleLogoutClick = () => {
    logout()
    navigate('/documents');
  }

  return (
    <div className='header-container'>
      <div className='logo2'>
        <Sparkles style={{ width: '29px', height: '26px', color: '#000000' }} />
        <h1 className='web-title'>
          DCAI
        </h1>
      </div>
      <div className='header-button'>
        {user? (
          <>
          <span>{user.client_name} 환영합니다.</span>
          <button className='to-login' onClick={handleLogoutClick}>로그아웃</button>
          </>
        ):(
          <>
          <button className='to-login' onClick={handleLoginClick}>로그인</button>
          </>
        )}
        
      </div>
    </div>
  );
}
