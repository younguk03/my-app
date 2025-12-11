import { useState, useRef, useEffect } from "react";
import MarkdownRenderer from "./MarkdownRenderer.tsx";
import '../chat.css';

interface Message {
  text: string;
  sender: string;
}

interface ChatProps {
  fileId?: string;
}

export default function Chat({ fileId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!input?.trim()) return;

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // 2. Flask 서버로 요청 (포트 5000)
      console.log("Sending chat request:", { message: input, fileId });
      const response = await fetch("https://younguk.pythonanywhere.com/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input, file_id:fileId }),
      });

      const data = await response.json();

      // 3. AI 응답 추가
      const aiMessage = { text: data.response, sender: "ai" };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { text: "서버 연결 오류입니다.", sender: "ai" }]);
    } finally {
      setIsLoading(false);
    }
  } 

  // 엔터키 입력 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.sender === 'ai' ? (
              <MarkdownRenderer content={msg.text} />
            ) : (
              msg.text
            )}
          </div>
        ))}
        {isLoading && <div className="message ai loading">답변을 생성하고 있습니다...</div>}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="input-area">
        <input
          className="ai-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="메시지를 입력하세요..."
          disabled={isLoading}
        />
        <button className="ai-button" onClick={sendMessage} disabled={isLoading}>
          {isLoading ? "..." : "전송"}
        </button>
      </div>
    </div>
  );
}
