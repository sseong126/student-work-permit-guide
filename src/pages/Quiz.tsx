import { useState } from 'react';
import { t } from '../i18n';
import './Quiz.css';

interface QuizProps {
  language: 'ko' | 'en';
  onBack: () => void;
}

interface QuizState {
  visaType: string | null;
  major: string | null;
  topikLevel: string | null;
  gpa: string | null;
  academicStanding: string | null;
  currentStep: number;
}

export default function Quiz({ language, onBack }: QuizProps) {
  const [state, setState] = useState<QuizState>({
    visaType: null,
    major: null,
    topikLevel: null,
    gpa: null,
    academicStanding: null,
    currentStep: 1,
  });

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

  const majorOptions = {
    ko: [
      { code: 'humanities', label: '인문학' },
      { code: 'science', label: '자연과학' },
      { code: 'engineering', label: '공학' },
      { code: 'medicine', label: '의학' },
      { code: 'arts', label: '예술' },
      { code: 'other', label: '기타' },
    ],
    en: [
      { code: 'humanities', label: 'Humanities' },
      { code: 'science', label: 'Natural Science' },
      { code: 'engineering', label: 'Engineering' },
      { code: 'medicine', label: 'Medicine' },
      { code: 'arts', label: 'Arts' },
      { code: 'other', label: 'Other' },
    ],
  };

  const topikOptions = {
    ko: [
      { code: 'none', label: '없음' },
      { code: 'level1', label: '1급' },
      { code: 'level2', label: '2급' },
      { code: 'level3', label: '3급' },
      { code: 'level4', label: '4급' },
      { code: 'level5', label: '5급' },
      { code: 'level6', label: '6급' },
    ],
    en: [
      { code: 'none', label: 'None' },
      { code: 'level1', label: 'Level 1' },
      { code: 'level2', label: 'Level 2' },
      { code: 'level3', label: 'Level 3' },
      { code: 'level4', label: 'Level 4' },
      { code: 'level5', label: 'Level 5' },
      { code: 'level6', label: 'Level 6' },
    ],
  };

  const gpaOptions = {
    ko: [
      { code: 'above3.0', label: '3.0 이상' },
      { code: 'between2.0_3.0', label: '2.0 ~ 3.0' },
      { code: 'below2.0', label: '2.0 미만' },
    ],
    en: [
      { code: 'above3.0', label: 'Above 3.0' },
      { code: 'between2.0_3.0', label: '2.0 ~ 3.0' },
      { code: 'below2.0', label: 'Below 2.0' },
    ],
  };

  const academicStandingOptions = {
    ko: [
      { code: 'good', label: '양호' },
      { code: 'warning', label: '경고' },
      { code: 'probation', label: '유예' },
    ],
    en: [
      { code: 'good', label: 'Good Standing' },
      { code: 'warning', label: 'Academic Warning' },
      { code: 'probation', label: 'Probation' },
    ],
  };

  const handleSelectVisa = (code: string) => {
    setState({ ...state, visaType: code, currentStep: 2 });
  };

  const handleSelectMajor = (code: string) => {
    setState({ ...state, major: code, currentStep: 3 });
  };

  const handleSelectTopik = (code: string) => {
    setState({ ...state, topikLevel: code, currentStep: 4 });
  };

  const handleSelectGpa = (code: string) => {
    setState({ ...state, gpa: code, currentStep: 5 });
  };

  const handleSelectAcademicStanding = (code: string) => {
    setState({ ...state, academicStanding: code });
    handleCalculateResult(code);
  };

  const handleCalculateResult = (academicStanding: string) => {
    // 결과 계산 로직
    const result = calculateWorkingHours(
      state.visaType,
      state.major,
      state.topikLevel,
      state.gpa,
      academicStanding
    );
    saveResult(result);
  };

  const calculateWorkingHours = (
    visa: string | null,
    major: string | null,
    topik: string | null,
    gpa: string | null,
    standing: string
  ) => {
    // 기본 로직
    if (!visa || standing === 'probation') {
      return { status: 'denied', maxHoursPerWeek: null };
    }

    if (standing === 'warning' || gpa === 'below2.0') {
      return { status: 'conditional', maxHoursPerWeek: 10 };
    }

    if (visa === 'D-4-1') {
      return { status: 'allowed', maxHoursPerWeek: 20 };
    }

    if (topik === 'level4' || topik === 'level5' || topik === 'level6') {
      return { status: 'allowed', maxHoursPerWeek: null };
    }

    return { status: 'allowed', maxHoursPerWeek: 20 };
  };

  const saveResult = (result: any) => {
    const resultData = {
      visaType: state.visaType,
      major: state.major,
      topikLevel: state.topikLevel,
      gpa: state.gpa,
      academicStanding: state.academicStanding,
      result,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem('latestResult', JSON.stringify(resultData));
    onBack();
  };

  const handleBack = () => {
    if (state.currentStep > 1) {
      setState({ ...state, currentStep: state.currentStep - 1 });
    } else {
      onBack();
    }
  };

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return (
          <div className="quiz-step">
            <h2>{language === 'ko' ? 'Q1. 본인의 비자 종류를 선택해 주세요.' : 'Q1. Please select your visa type.'}</h2>
            <div className="quiz-options">
              {visaOptions[language].map((option) => (
                <button
                  key={option.code}
                  className="quiz-option-btn"
                  onClick={() => handleSelectVisa(option.code)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="quiz-step">
            <h2>{language === 'ko' ? 'Q2. 본인의 전공을 선택해 주세요.' : 'Q2. Please select your major.'}</h2>
            <div className="quiz-options">
              {majorOptions[language].map((option) => (
                <button
                  key={option.code}
                  className="quiz-option-btn"
                  onClick={() => handleSelectMajor(option.code)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="quiz-step">
            <h2>{language === 'ko' ? 'Q3. TOPIK 등급을 선택해 주세요.' : 'Q3. Please select your TOPIK level.'}</h2>
            <div className="quiz-options">
              {topikOptions[language].map((option) => (
                <button
                  key={option.code}
                  className="quiz-option-btn"
                  onClick={() => handleSelectTopik(option.code)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="quiz-step">
            <h2>{language === 'ko' ? 'Q4. 직전학기 학점을 선택해 주세요.' : 'Q4. Please select your GPA.'}</h2>
            <div className="quiz-options">
              {gpaOptions[language].map((option) => (
                <button
                  key={option.code}
                  className="quiz-option-btn"
                  onClick={() => handleSelectGpa(option.code)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="quiz-step">
            <h2>{language === 'ko' ? 'Q5. 학사경고 여부를 선택해 주세요.' : 'Q5. Please select your academic standing.'}</h2>
            <div className="quiz-options">
              {academicStandingOptions[language].map((option) => (
                <button
                  key={option.code}
                  className="quiz-option-btn"
                  onClick={() => handleSelectAcademicStanding(option.code)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <button className="back-btn" onClick={handleBack}>
          ← {language === 'ko' ? '돌아가기' : 'Back'}
        </button>
        <div className="language-selector">
          <button className="lang-btn-quiz ko-btn">KO</button>
          <button className="lang-btn-quiz en-btn">EN</button>
        </div>
      </div>
      <div className="quiz-container">
        {renderStep()}
      </div>
    </div>
  );
}
