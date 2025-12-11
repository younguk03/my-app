import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext.tsx";

interface DocItem {
  id: string | number;
  original_title: string;
  created_at?: string;
}

export default function Documents() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DocItem[]>([]);

  useEffect(() => {
    if (!user) return;

    axios.get("https://document-back.onrender.com/api/viewDocument", { 
      params: {
        user_id: user.id
      }
    })
    .then((response) => {
      console.log("데이터 수신:", response.data);
      setDocuments(response.data);
    })
    .catch((error) => {
      console.error("불러오기 실패:", error);
    });
  }, [user]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const handleDelete = async (e: React.MouseEvent, docId: string | number) => {
    e.preventDefault(); // 링크 이동 방지
    e.stopPropagation(); // 이벤트 전파 방지
    
    if (!window.confirm("정말로 이 문서를 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/delete/${docId}`, {
        params: { user_id: user.id }
      });

      setDocuments(prev => prev.filter(doc => doc.id !== docId));
      alert("삭제되었습니다.");
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <p style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'medium', color: '#333' }}>나의 문서 리스트</p>
      {documents.length === 0 ? (
        <p style={{ color: '#666', textAlign: 'center', marginTop: '40px' }}>문서가 없습니다.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {documents.map((document) => (
            <a 
              key={document.id} 
              href={`/document/${document.id}`}
              style={{ 
                textDecoration: 'none', 
                color: 'inherit',
                display: 'block'
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                padding: '16px 20px', 
                backgroundColor: '#fff',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                border: '1px solid #f0f0f0',
                cursor: 'pointer',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
              }}
              >
                <div style={{ flex: 7, fontWeight: '600', fontSize: '16px', color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {document.original_title}
                </div>
                <div style={{ flex: 2, fontSize: '14px', color: '#888', textAlign: 'right' }}>
                  {formatDate(document.created_at)}
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={(e) => handleDelete(e, document.id)}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ff4d4f',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fff1f0'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                    </button>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
