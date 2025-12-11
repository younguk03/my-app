import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. useNavigate 가져오기
import Headers from '../components/Headers.tsx';
import { useAuth } from '../AuthContext.tsx';
import Uploadblock from './components/Uploadblock.tsx';
import Documents from './components/Documents.tsx';

export default function Documentpage() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate(); // 2. 훅 초기화

  const handleUpload = async (selectedFile: File) => {
    if (!user) {
      console.error('유저 정보가 없습니다.');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('user_id', user.id); 
    
    try {
      const response = await fetch('http://127.0.0.1:5000/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      console.log('성공:', data);
      
      // 3. 성공 시 결과 페이지로 이동하면서 데이터 넘겨주기
      const fileId = data.file_id || data.fileId;
      navigate(`/document/${fileId}`, { 
        state: { 
          resultData: data,    // 백엔드에서 받은 전체 데이터 (file_id, url, summary 등)
          fileName: selectedFile.name  // 원본 파일명도 같이 넘겨주면 좋음
        } 
      });
    } catch (error) {
      console.error('오류', error);
      alert('업로드 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      handleUpload(selectedFile);
    } else {
      setFile(null);
    }
  };

  return (
    <div>
      <Headers />
      <div>
        {user ? (
          <div>
            <Documents />
            <div style={{
              position: 'fixed',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 100
            }}>
              <Uploadblock isLoading={isLoading} onFileUpload={handleFileChange} />
            </div>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'calc(100vh - 80px)', // 헤더 높이 제외
            gap: '20px',
            color: '#333'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '10px'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#666" style={{ width: '40px', height: '40px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>로그인이 필요합니다</h2>
            <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>서비스를 이용하시려면 먼저 로그인을 해주세요.</p>
            <button
              onClick={() => navigate('/login')}
              style={{
                marginTop: '10px',
                padding: '12px 32px',
                backgroundColor: '#007AFF',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 122, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 122, 255, 0.3)';
              }}
            >
              로그인 하러 가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
