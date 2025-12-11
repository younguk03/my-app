import React from "react";

interface PdfPanelProps {
  width: number;
  isLoading: boolean;
  translateUrl?: string;
  localPdfUrl?: string;
}

const PdfPanel: React.FC<PdfPanelProps> = ({ width, isLoading, translateUrl, localPdfUrl }) => {
  return (
    <div style={{ 
        width: `${width}%`, 
        position: "relative", 
        backgroundColor: "#525659", 
        borderRight: "1px solid #999", 
        display: "flex", 
        flexDirection: "column",
    }}>
      
      {/* 상태 표시줄 제거됨 */}

      {/* PDF 뷰어 컨테이너: 꽉 차게 */}
      <div style={{ 
        flex: 1, 
        position: "relative", 
        backgroundColor: "#525659",
        overflow: "hidden" 
      }}>
        {isLoading ? (
          <div style={{ 
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            color: "#f0f0f0" 
          }}>
            <div style={{ fontSize: "30px", marginBottom: "15px" }}>⏳</div>
            <div style={{ fontWeight: "500" }}>문서를 분석하고 있습니다...</div>
          </div>
        ) : (translateUrl || localPdfUrl) ? (
          <iframe
            src={translateUrl || localPdfUrl} 
            title="PDF Viewer"
            style={{ 
                width: "100%", 
                height: "100%", 
                border: "none", 
                backgroundColor: "white",
                display: "block"
            }}
          />
        ) : (
          <div style={{ 
            display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#aaa", fontSize: "14px", flexDirection: "column", gap: "10px"
          }}>
            <div style={{ fontSize: "40px", opacity: 0.5 }}>📄</div>
            <div>PDF 파일을 열어주세요</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfPanel;
