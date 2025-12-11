import React from "react";

// --- 세련된(Stylish) 타이포그래피 마크다운 렌더러 ---
const MarkdownRenderer = ({ content }: { content: string }) => {
  if (!content) return null;

  // 인라인 스타일 파싱 (예: **강조**)
  const parseInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      // **키워드** 처리: 세련된 하이라이트 효과
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <span key={index} style={{ 
            fontWeight: "700",
            color: "#1a1a1a",
            backgroundColor: "rgba(255, 230, 0, 0.15)", // 아주 연한 노란색 하이라이트
            padding: "0 4px",
            borderRadius: "4px",
            margin: "0 1px"
          }}>
            {part.slice(2, -2)}
          </span>
        );
      }
      return part;
    });
  };

  const lines = content.split('\n');

  return (
    <div style={{ 
      lineHeight: "1.8", 
      color: "#374151", 
      fontSize: "14px", 
      fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif",
      letterSpacing: "-0.01em",
      animation: "fadeIn 0.6s ease-out forwards",
      opacity: 0
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      {lines.map((line, index) => {
        const trimmed = line.trim();

        // 1. 대제목 (# ) - 그라데이션 텍스트 효과
        if (line.startsWith('# ')) {
          return (
            <h1 key={index} style={{ 
              fontSize: "32px", 
              fontWeight: "800", 
              color: "#111", 
              marginTop: "48px", 
              marginBottom: "24px", 
              paddingBottom: "16px", 
              borderBottom: "1px solid #eaeaea",
              letterSpacing: "-0.02em"
            }}>
              {parseInline(line.replace('# ', ''))}
            </h1>
          );
        }
        // 2. 중제목 (## ) - 깔끔한 서브헤더
        else if (line.startsWith('## ')) {
          return (
            <h2 key={index} style={{ 
              fontSize: "24px", 
              fontWeight: "700", 
              color: "#1f2937", 
              marginTop: "40px", 
              marginBottom: "20px",
              display: "flex",
              alignItems: "center"
            }}>
              <span style={{ 
                width: "4px", 
                height: "24px", 
                backgroundColor: "#3b82f6", // 포인트 컬러 (블루)
                marginRight: "12px",
                borderRadius: "2px"
              }}/>
              {parseInline(line.replace('## ', ''))}
            </h2>
          );
        }
        // 3. 소제목 (### )
        else if (line.startsWith('### ')) {
          return (
            <h3 key={index} style={{ 
              fontSize: "20px", 
              fontWeight: "600", 
              color: "#374151", 
              marginTop: "32px", 
              marginBottom: "16px"
            }}>
              {parseInline(line.replace('### ', ''))}
            </h3>
          );
        }
        // 4. 소소제목 (#### )
        else if (line.startsWith('#### ')) {
           return (
            <h4 key={index} style={{ 
              fontSize: "17px", 
              fontWeight: "600", 
              color: "#4b5563", 
              marginTop: "24px", 
              marginBottom: "12px"
            }}>
              {parseInline(line.replace('#### ', ''))}
            </h4>
          );
        }
        // 5. 리스트 (- 또는 •)
        else if (line.startsWith('- ') || line.startsWith('• ')) {
           const text = line.startsWith('- ') ? line.replace('- ', '') : line.replace('• ', '');
           return (
            <div key={index} style={{ display: "flex", alignItems: "flex-start", marginBottom: "8px", paddingLeft: "8px" }}>
              <span style={{ 
                marginRight: "12px", 
                color: "#9ca3af", 
                fontSize: "6px", 
                marginTop: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>●</span>
              <span style={{ color: "#4b5563" }}>{parseInline(text)}</span>
            </div>
          );
        }
        // 6. 번호 리스트 (숫자.)
        else if (/^\d+\.\s/.test(trimmed)) {
            const text = trimmed.replace(/^\d+\.\s/, '');
            const number = trimmed.match(/^\d+\./)?.[0];
            return (
                <div key={index} style={{ display: "flex", alignItems: "flex-start", marginBottom: "10px", paddingLeft: "8px" }}>
                    <span style={{ 
                      marginRight: "12px", 
                      fontWeight: "600", 
                      color: "#3b82f6", // 포인트 컬러
                      minWidth: "24px",
                      fontVariantNumeric: "tabular-nums"
                    }}>{number}</span>
                    <span style={{ color: "#4b5563" }}>{parseInline(text)}</span>
                </div>
            );
        }
        // 7. 테이블
        else if (trimmed.startsWith('|')) {
           if (trimmed.includes('---')) return null;
           
           const cells = trimmed.split('|').filter(c => c.trim() !== '');
           const isHeader = index > 0 && lines[index-1].trim() === ""; 
           
           return (
             <div key={index} style={{ 
               display: "flex", 
               borderBottom: "1px solid #f3f4f6",
               marginTop: isHeader ? "24px" : "0",
               backgroundColor: isHeader ? "#f9fafb" : "transparent",
               borderRadius: isHeader ? "8px 8px 0 0" : "0"
             }}>
               {cells.map((cell, i) => (
                 <div key={i} style={{ 
                   flex: 1, 
                   padding: "16px", 
                   fontSize: "15px", 
                   fontWeight: isHeader ? "600" : "400",
                   color: isHeader ? "#111" : "#4b5563",
                   textAlign: isHeader ? "center" : "left",
                   wordBreak: "break-word",
                 }}>
                   {parseInline(cell.trim())}
                 </div>
               ))}
             </div>
           );
        }
        // 8. 빈 줄
        else if (trimmed === "") {
             return <div key={index} style={{ height: "16px" }} />;
        }
        // 9. 일반 본문
        else {
            return <p key={index} style={{ marginBottom: "16px", textAlign: "justify", wordBreak: "keep-all", color: "#374151" }}>{parseInline(line)}</p>;
        }
      })}
    </div>
  );
};

export default MarkdownRenderer;
