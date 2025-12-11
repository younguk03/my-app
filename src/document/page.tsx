import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";
import PdfPanel from "./components/PdfPanel.tsx";
import AnalysisPanel from "./components/AnalysisPanel.tsx";
import Headers from "../components/Headers.tsx";
import { useAuth } from "../AuthContext.tsx";

const BACKEND_URL = "http://127.0.0.1:5000/";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [summarize, setSummarize] = useState<string>();
  const [understand, setUnderstand] = useState<string>();
  const [translate, setTranslate] = useState<string>();
  const [fileId, setFileId] = useState<string>();
  const [fileName, setFileName] = useState<string>();
  
  const [activeTab, setActiveTab] = useState<'summarize' | 'understand' | 'chat'>('summarize');
  const [localPdfUrl, setLocalPdfUrl] = useState<string>();

  const location = useLocation();
  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    if (location.state?.resultData) {
      const { resultData, fileName: uploadedFileName } = location.state;
      setSummarize(resultData.summarize);
      setUnderstand(resultData.understand);
      setTranslate(resultData.translated_url);
      setFileId(resultData.fileId || resultData.file_id);
      setFileName(uploadedFileName || resultData.filename || "문서");
      
      // 만약 번역된 URL이 없고 원본 URL이 있다면 그것을 표시
      if (!resultData.translated_url && resultData.url) {
        setLocalPdfUrl(resultData.url);
      }
    } else if (id && user) {
        // location.state가 없을 때 (새로고침 등) API로 데이터 가져오기
        const fetchDocument = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${BACKEND_URL}/api/viewMyDocument`, {
                    params: {
                        id: id,
                        user_id: user.id
                    }
                });
                const data = response.data;
                console.log("Fetched document:", data);

                setSummarize(data.summarize);
                setUnderstand(data.understand);
                setTranslate(data.translated_url);
                setFileId(data.id); // API returns 'id'
                setFileName(data.filename || "문서");

                if (!data.translated_url && data.url) {
                     setLocalPdfUrl(data.url);
                }

            } catch (error) {
                console.error("문서 조회 실패:", error);
                alert("문서를 불러올 수 없습니다.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDocument();
    }
  }, [location.state, id, user]);

  // --- 리사이징(Resizing) 관련 상태 ---
  const [leftWidth, setLeftWidth] = useState(50); // 왼쪽 패널 너비 (%)
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth > 20 && newWidth < 80) {
      setLeftWidth(newWidth);
    }
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setLocalPdfUrl(url);

    setSummarize(undefined);
    setUnderstand(undefined);
    setTranslate(undefined);
    setFileId(undefined);
    setActiveTab('summarize');
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      console.log("Upload response:", response.data);
      setSummarize(response.data.summarize);
      setUnderstand(response.data.understand);
      setTranslate(response.data.translated_url);
      setFileId(response.data.fileId || response.data.file_id);
    } catch (error) {
      console.error('Upload Error:', error);
      alert('서버 분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (localPdfUrl && localPdfUrl.startsWith('blob:')) {
        URL.revokeObjectURL(localPdfUrl);
      }
    };
  }, [localPdfUrl]);

  return (
    <div style={{ height: "100vh", width: "100%", display: "flex", flexDirection: "column", fontFamily: "'Pretendard', sans-serif" }}>
      {/* --- 상단 툴바 --- */}
      <Headers/>

      {/* 문서 제목 바 */}
      {fileName && (
        <div style={{
          width: "100%",
          padding: "10px 24px",
          borderBottom: "1px solid #e0e0e0",
          backgroundColor: "#fff",
          fontSize: "14px",
          fontWeight: "600",
          color: "#333",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
           <span style={{ fontSize: "16px" }}>📄</span>
           {fileName}
        </div>
      )}

      {/* --- 메인 콘텐츠 영역 (Resizable Split View) --- */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative", backgroundColor: "#fff" }}>
        
        {/* 1. 왼쪽: PDF 뷰어 영역 */}
        <PdfPanel 
          width={leftWidth} 
          isLoading={isLoading} 
          translateUrl={translate} 
          localPdfUrl={localPdfUrl} 
        />

        {/* 2. 리사이저 */}
        <div
          onMouseDown={handleMouseDown}
          style={{
            width: "8px",
            cursor: "col-resize",
            backgroundColor: isDragging ? "#4a90e2" : "#e0e0e0",
            borderLeft: "1px solid #ddd",
            borderRight: "1px solid #ddd",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
            <div style={{ width: "2px", height: "20px", backgroundColor: "#999", borderRadius: "1px" }} />
        </div>

        {/* 3. 오른쪽: 분석 결과 영역 (흰색 배경) */}
        <AnalysisPanel 
          width={100 - leftWidth} 
          isLoading={isLoading} 
          summarize={summarize} 
          understand={understand} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          fileId={fileId}
        />

      </div>
      
      {/* 드래그 중 오버레이 */}
      {isDragging && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, cursor: "col-resize"
        }} />
      )}
    </div>
  );
}
