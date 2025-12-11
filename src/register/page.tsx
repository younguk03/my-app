import { Sparkles } from 'lucide-react'
import '../css/page.css'
import { useState } from 'react';
import { useNavigate as navigator } from 'react-router-dom';

export default function RegisterPage() {
  const [client_name, setClient_name] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const url = 'http://127.0.0.1:5000/'

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      const response = await fetch(`${url}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_name,
          email,
          password
        })
      })
      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        // 서버가 400, 401, 500 등 에러 코드를 보냈을 때
        throw new Error(data.error || '회원가입에 실패했습니다.');
      }
      alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during registration:', error);
    }
  }

  return (
    <div className="regidster-page">
      <div className='logo1'>
            <Sparkles style={{ width: '34px', height: '56px', color: '#000000' }} />
            <h1 className='login-title'>DCAI</h1>
        </div>
      <div>
        <form action="" onSubmit={handleSubmit} method='POST'>
          <input type="text" className='register-input'
          placeholder='이름' required 
          value={client_name}
          onChange={(e) => setClient_name(e.target.value)}/>
          <br />
          <input type="text" className='register-input'
          placeholder='이메일' required
          value={email}
          onChange={(e) => setEmail(e.target.value)}/>
          <br />
          <input type="password" className='register-input'
          placeholder='비밀번호' required
          value={password}
          onChange={(e) => setPassword(e.target.value)}/>
          <br />
          <input type="password" className='register-input'
          placeholder='비밀번호 확인'required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <br />
          <button type="submit" className='register-button'>가입하기</button>
        </form>
      </div>
    </div>
  )
}
