import React, { useState } from 'react';
import { FileText, BookOpen, Sparkles } from 'lucide-react';
// useNavigate와 react-router-dom 의존성을 제거했습니다.


export default function DCAILanding() {
  // 라우팅 대신 상태를 사용하여 페이지 전환을 시뮬레이션합니다.
  const [isStarted, setIsStarted] = useState(false);

  const click = () => {
    // navigate('/documents'); 대신 상태를 변경하여 "문서 서비스 페이지"를 표시합니다.
    setIsStarted(true);
    window.location.href = '/documents';
  }
  
  const services = [
    {
      icon: <FileText style={{ width: '40px', height: '40px' }} />,
      title: "문서 번역",
      description: "AI 기반 고품질 문서 번역으로 언어의 장벽을 넘어서세요"
    },
    {
      icon: <BookOpen style={{ width: '40px', height: '40px' }} />,
      title: "요약 정리",
      description: "긴 문서도 핵심만 빠르게 파악할 수 있도록 스마트하게 요약합니다"
    }
  ];

  // isStarted가 true이면, 라우팅된 페이지를 시뮬레이션하는 간단한 화면을 렌더링합니다.
  if (isStarted) {
    return (
      <div style={styles.documentPageContainer}>
        <h1 style={styles.documentPageTitle}>문서 서비스 페이지</h1>
        <p style={styles.documentPageDescription}>
          이곳에 문서 번역, 요약 등의 기능이 구현됩니다.
        </p>
        <button 
          onClick={() => setIsStarted(false)} 
          style={styles.backButton}
        >
          돌아가기
        </button>
      </div>
    );
  }

  // isStarted가 false이면, 기존 랜딩 페이지를 렌더링합니다.
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Logo/Title */}
        <div style={styles.header}>
          <div style={styles.logoWrapper}>
            <Sparkles style={{ width: '56px', height: '56px', color: '#000000' }} />
            <h1 style={styles.title}>DCAI</h1>
          </div>
          <p style={styles.subtitle}>
            AI을 통한 간편한 문서읽기 서비스
          </p>
        </div>

        {/* Services Grid */}
        <div className="services-grid" style={styles.servicesGrid}>
          {services.map((service, index) => (
            <div 
              key={index}
              style={{
                ...styles.serviceCard,
                animationDelay: `${index * 0.15}s`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-12px)';
                e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
              }}
            >
              <div style={styles.iconWrapper}>
                {service.icon}
              </div>
              <h3 style={styles.serviceTitle}>
                {service.title}
              </h3>
              <p style={styles.serviceDescription}>
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button 
          onClick={click}
          style={styles.ctaButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.backgroundColor = '#1f1f1f';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.backgroundColor = '#000000';
          }}
        >
          <span style={styles.buttonText}>
            시작하기
            <Sparkles style={{ width: '20px', height: '20px', marginLeft: '8px' }} />
          </span>
        </button>

        {/* Subtitle */}
        <p style={styles.bottomText}>
          지금 바로 DCAI의 강력한 AI 기능을 경험해보세요
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 768px) {
          .services-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

// 해결 방법: styles 객체에 타입을 명시해줍니다.
// [key: string]은 객체의 키 이름(container, content 등)을 의미하고,
// React.CSSProperties는 값들이 올바른 CSS 속성임을 보장합니다.
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: '#ffffff',
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '80px 24px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center', 
    marginBottom: '80px',
    animation: 'fadeIn 0.8s ease-out',
  },
  logoWrapper: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px',
  },
  title: {
    fontSize: '72px',
    fontWeight: '800',
    color: '#000000',
    margin: 0,
    letterSpacing: '-2px',
  },
  subtitle: {
    fontSize: '22px',
    color: '#666666',
    fontWeight: '400',
    margin: 0,
    letterSpacing: '-0.5px',
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '40px',
    maxWidth: '800px',
    marginBottom: '80px',
    width: '100%',
  },
  serviceCard: {
    background: '#ffffff',
    padding: '48px 40px',
    borderRadius: '24px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid #f0f0f0',
    animation: 'fadeIn 0.8s ease-out',
  },
  iconWrapper: {
    color: '#000000',
    marginBottom: '24px',
    transition: 'transform 0.3s ease',
  },
  serviceTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#000000',
    marginBottom: '16px',
    letterSpacing: '-0.5px',
  },
  serviceDescription: {
    color: '#666666',
    lineHeight: '1.7',
    margin: 0,
    fontSize: '16px',
  },
  ctaButton: {
    position: 'relative',
    padding: '20px 56px',
    background: '#000000',
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: '600',
    borderRadius: '50px',
    border: 'none',
    cursor: 'pointer',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
  },
  buttonText: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
  },
  bottomText: {
    marginTop: '32px',
    color: '#999999',
    fontSize: '15px',
    letterSpacing: '-0.3px',
  },
  // 시뮬레이션된 페이지를 위한 새로운 스타일 추가
  documentPageContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '50px',
    textAlign: 'center',
    background: '#f8f8f8',
  },
  documentPageTitle: {
    fontSize: '36px', 
    fontWeight: 'bold', 
    color: '#000',
    marginBottom: '10px'
  },
  documentPageDescription: {
    color: '#666', 
    marginBottom: '20px'
  },
  backButton: {
    marginTop: '20px', 
    padding: '10px 20px', 
    borderRadius: '8px', 
    backgroundColor: '#000', 
    color: '#fff', 
    border: 'none', 
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  }
};