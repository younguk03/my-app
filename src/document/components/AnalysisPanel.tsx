import React from "react";
import { FileText, BookOpen, MessageSquare } from 'lucide-react';
import MarkdownRenderer from "./MarkdownRenderer.tsx";
import Chat from "./Chat.tsx";

interface AnalysisPanelProps {
  width: number;
  isLoading: boolean;
  summarize?: string;
  understand?: string;
  activeTab: 'summarize' | 'understand' | 'chat';
  onTabChange: (tab: 'summarize' | 'understand' | 'chat') => void;
  fileId?: string;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ 
  width, 
  isLoading, 
  summarize, 
  understand, 
  activeTab, 
  onTabChange,
  fileId
}) => {
  return (
    <div style={{ 
        width: `${width}%`, 
        display: "flex", 
        flexDirection: "column", 
        backgroundColor: "#fff",
    }}>
        
        {/* 탭 헤더 */}
        {(fileId || summarize || understand || activeTab === 'chat') && !isLoading ? (
            <>
                <div style={{ 
                    display: "flex", 
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 24px",
                    borderBottom: "1px solid #eaeaea",
                    backgroundColor: "#ffffff",
                    zIndex: 10,
                    position: "sticky",
                    top: 0
                }}>
                    {['summarize', 'understand', 'chat'].map((tab) => {
                        const isActive = activeTab === tab;
                        const labels: Record<string, string> = { summarize: '요약 노트', understand: '핵심 이해', chat: 'Chat' };
                        const icons: Record<string, React.ReactNode> = {
                            summarize: <FileText size={18} strokeWidth={isActive ? 2.5 : 2} />,
                            understand: <BookOpen size={18} strokeWidth={isActive ? 2.5 : 2} />,
                            chat: <MessageSquare size={18} strokeWidth={isActive ? 2.5 : 2} />
                        };

                        return (
                            <button
                                key={tab}
                                onClick={() => onTabChange(tab as any)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    padding: "10px 16px",
                                    border: "none",
                                    borderRadius: "8px",
                                    background: isActive ? "#f8f9fa" : "transparent",
                                    color: isActive ? "#111" : "#888",
                                    fontWeight: isActive ? "700" : "500",
                                    fontSize: "15px",
                                    cursor: "pointer",
                                    transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                                    position: "relative",
                                    overflow: "hidden"
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.backgroundColor = "#fcfcfc";
                                        e.currentTarget.style.color = "#555";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.backgroundColor = "transparent";
                                        e.currentTarget.style.color = "#888";
                                    }
                                }}
                            >
                                <span style={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    gap: "8px",
                                    transform: isActive ? "scale(1.02)" : "scale(1)",
                                    transition: "transform 0.2s ease"
                                }}>
                                    {icons[tab]}
                                    {labels[tab]}
                                </span>
                                {isActive && (
                                    <div style={{
                                        position: "absolute",
                                        bottom: "0",
                                        left: "16px",
                                        right: "16px",
                                        height: "2px",
                                        backgroundColor: "#000",
                                        borderRadius: "2px",
                                        animation: "slideIn 0.3s ease-out forwards"
                                    }} />
                                )}
                            </button>
                        );
                    })}
                    <style>{`
                        @keyframes slideIn {
                            from { transform: scaleX(0); opacity: 0; }
                            to { transform: scaleX(1); opacity: 1; }
                        }
                    `}</style>
                </div>

                {/* 문서 내용 영역 */}
                <div style={{ 
                    flex: 1, 
                    overflowY: activeTab === 'chat' ? "hidden" : "auto", 
                    padding: activeTab === 'chat' ? "0" : "40px 50px", 
                    display: "flex",
                    flexDirection: "column"
                }}>
                    <div style={{ 
                        maxWidth: activeTab === 'chat' ? "100%" : "100%", 
                        margin: activeTab === 'chat' ? "0" : "0 auto",
                        height: activeTab === 'chat' ? "100%" : "auto",
                        flex: 1
                    }}>
                        {activeTab === 'summarize' && summarize && (
                            <MarkdownRenderer content={summarize} />
                        )}
                        {activeTab === 'understand' && understand && (
                            <MarkdownRenderer content={understand} />
                        )}
                        <div style={{ display: activeTab === 'chat' ? 'block' : 'none', height: '100%' }}>
                            <Chat fileId={fileId} />
                        </div>
                    </div>
                </div>
            </>
        ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#999", flexDirection: "column", gap: "15px" }}>
                {!isLoading && (
                    <>
                        <div style={{ 
                            width: "60px", height: "80px", border: "2px solid #eee", borderRadius: "8px",
                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px",
                            color: "#ddd"
                        }}>
                            📝
                        </div>
                        <div style={{ color: "#aaa", fontSize: "14px" }}>분석 결과가 이곳에 표시됩니다.</div>
                    </>
                )}
            </div>
        )}
    </div>
  );
};

export default AnalysisPanel;
