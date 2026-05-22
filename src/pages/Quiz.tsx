import { useState } from 'react';
import './Quiz.css';

interface QuizProps {
  language: 'ko' | 'en';
  onBack: () => void;
}

interface QuizState {
  visaType: string | null;
  currentStep: number;
}

export default function Quiz({ language, onBack }: QuizProps) {
  const [state, setState] = useState<QuizState>({
    visaType: null,
    currentStep: 1,
  });

  // 버튼에 표시될 텍스트 정밀 수정 (중복 괄호 완전 제거 및 간결화)
  const visaOptions = {
    ko: [
      { code: 'D-4-1', label: 'D-4-1 (어학연수)' },
      { code: 'D-2-1', label: 'D-2-1 (전문학사)' },
      { code: 'D-2-2', label: 'D-2-2 (학사)' },
      { code: 'D-2-3', label: 'D-2-3 (석사)' },
      { code: 'D-2-4', label: 'D-2-4 (박사)' },
    ],
    en: [
      { code: 'D-4-1', label: 'D-4-1 (General Trainee)' },
      { code: 'D-2-1', label: 'D-2-1 (Associate Degree)' },
      { code: 'D-2-2', label: 'D-2-2 (Bachelor\'s)' },
      { code: 'D-2-3', label: 'D-2-3 (Master\'s)' },
      { code: 'D-2-4', label: 'D-2-4 (Doctoral)' },
    ],
  };

  const handleSelectVisa = (code: string) => {
    setState({ ...state, visaType: code, currentStep: 2 });
  };

  const handleBack = () => {
    if (state.currentStep > 1) {
      setState({ ...state, currentStep: state.currentStep - 1 });
    } else {
      onBack();
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '480px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      {/* 상단 헤더 영역 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        <button onClick={handleBack} style={{ padding: '6px 12px', background: '#fff', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>
          ← {language === 'ko' ? '돌아가기' : 'Back'}
        </button>
        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#0070f3', background: '#eef5ff', padding: '4px 8px', borderRadius: '4px' }}>
          {language === 'ko' ? '계산기 모드' : 'Calculator'}
        </div>
      </div>

      {/* 질문 영역 */}
      <div className="quiz-step">
        <h2 style={{ fontSize: '18px', marginBottom: '20px', color: '#333', lineHeight: '1.4' }}>
          {language === 'ko' ? 'Q1. 본인의 비자 종류를 선택해 주세요.' : 'Q1. Please select your visa type.'}
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {visaOptions[language].map((option) => (
            <button
              key={option.code}
              onClick={() => handleSelectVisa(option.code)}
              style={{
                width: '100%',
                padding: '16px 20px',
                textAlign: 'left',
                background: '#fff',
                border: '1px solid #d9d9d9',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '15px',
                color: '#333',
                fontWeight: '500',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                whiteSpace: 'normal', /* 잘림 방지 */
                wordBreak: 'break-all',
                lineHeight: '1.2'
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
