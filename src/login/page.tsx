import { ReactElement, useState } from 'react';
import '../css/page.css'
import { Sparkles } from 'lucide-react';
import { useAuth } from '../AuthContext.tsx';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {login} = useAuth()
  const navigate = useNavigate();

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('https://document-back.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      })
      const data = await response.json();
      console.log(data);
      login(data);
      if (!response.ok) {
        // 서버가 400, 401, 500 등 에러 코드를 보냈을 때
        alert('로그인에 실패했습니다.');
        throw new Error(data.error || '로그인에 실패했습니다.');
        
      }
      alert('로그인에 성공했습니다.');
      navigate('/documents')
    } catch (error) {
      console.error('Error during login:', error);
    }
  }
  return (
    <div className="login-page">
      <div>
        <div className='logo1'>
            <Sparkles style={{ width: '34px', height: '56px', color: '#000000' }} />
            <h1 className='login-title'>DCAI</h1>
          </div>
      </div>
      <div>
        <form action="" onSubmit={handleSubmit} method='POST'>
          <input type="email" className='login-input'
          placeholder='이메일' required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input type="password" className='login-input'
          placeholder='비밀번호' required
          value={password}
          onChange={(e) => setPassword(e.target.value)}/>
          <br />
        <button type="submit" className='login-button'>로그인</button>
        </form>
      </div>
      <p className='question-register'>계정이 없으신가요? <a href="/register" style={{color:'gray'}}>회원가입하기</a></p>
    </div>
  )
}
