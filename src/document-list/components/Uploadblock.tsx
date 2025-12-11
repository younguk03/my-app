import React from "react";

interface UploadblockProps {
  isLoading: boolean;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Uploadblock: React.FC<UploadblockProps> = ({ isLoading, onFileUpload }) => {
  return (
    <>
      <label
        style={{
          padding: "12px 24px",
          background: "linear-gradient(135deg, #007AFF 0%, #0056b3 100%)",
          color: "white",
          borderRadius: "50px",
          cursor: "pointer",
          fontWeight: "600",
          fontSize: "16px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
          boxShadow: "0 4px 15px rgba(0, 122, 255, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.1)"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
          e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 122, 255, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 122, 255, 0.3)";
        }}
      >
        <span style={{ fontSize: "18px" }}>➕</span>
        <span>새로만들기</span>
        <input
          type="file"
          accept=".pdf"
          onChange={onFileUpload}
          style={{ display: "none" }}
        />
      </label>
      {isLoading && (
        <div style={{ 
          position: "fixed", 
          bottom: "100px", 
          left: "50%", 
          transform: "translateX(-50%)",
          background: "rgba(0,0,0,0.8)",
          color: "white",
          padding: "10px 20px",
          borderRadius: "20px",
          display: "flex", 
          alignItems: "center", 
          gap: "10px", 
          zIndex: 1000 
        }}>
          <div className="spinner" style={{ width: "16px", height: "16px", border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
          <span>분석 중...</span>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default Uploadblock;
