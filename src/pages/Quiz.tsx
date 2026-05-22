import { useState, useMemo } from 'react';
import { t } from '../i18n';
import { QUIZ_QUESTIONS } from '../lib/quiz-questions';
import type { QuizAnswers } from '../lib/permit-logic';
import { calculatePermit } from '../lib/permit-logic';
import { saveResult } from '../lib/result-history-service';
import './Quiz.css';

interface QuizProps {
  language: 'ko' | 'en';
  onBack: () => void;
}

export default function Quiz({ language, onBack }: QuizProps) {
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // 현재 답변 상태에서 표시할 질문 목록
  const activeQuestions = useMemo(() => {
    return QUIZ_QUESTIONS.filter((q) => !q.condition || q.condition(answers as any));
  }, [answers]);

  const currentQuestion = activeQuestions[currentStep];
  const totalSteps = activeQuestions.length;
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  const currentAnswer = currentQuestion ? answers[currentQuestion.id as keyof QuizAnswers] : undefined;
  const hasAnswer = currentAnswer !== undefined;

  const handleSelectOption = (value: string) => {
    if (!currentQuestion) return;

    let parsed: any = value;
    if (value === 'true') parsed = true;
    else if (value === 'false') parsed = false;

    const newAnswers = { ...answers, [currentQuestion.id]: parsed };

    // D-2-3/D-2-4 선택 시 courseType을 자동으로 graduate로 설정
    if (currentQuestion.id === 'd2Type' && (parsed === 'D-2-3' || parsed === 'D-2-4')) {
      newAnswers.courseType = 'graduate';
    }
    // D-2-1, D-2-2 선택 시 courseType을 undergraduate로 설정
    if (currentQuestion.id === 'd2Type' && (parsed === 'D-2-1' || parsed === 'D-2-2')) {
      newAnswers.courseType = 'undergraduate';
    }
    // D-4-1 선택 시 courseType을 language로 설정
    if (currentQuestion.id === 'visaType' && parsed === 'D-4-1') {
      newAnswers.courseType = 'language';
    }
    // D-2 선택 시 courseType을 초기화
    if (currentQuestion.id === 'visaType' && parsed === 'D-2') {
      newAnswers.courseType = undefined;
    }

    setAnswers(newAnswers);
  };

  const handleNext = async () => {
    if (!hasAnswer) return;

    // D-2 성적이 C(2.0) 미만 선택 시 취업 불가
    if (currentQuestion?.id === 'd2GpaOk' && (answers as any).d2GpaOk === false) {
      setLoading(true);
      const result = {
        status: 'denied' as const,
        maxHoursPerWeek: 0,
        maxWorkplaces: 0,
        denialReasons: [
          '직전 학기 성적 C학점 미만이거나 과거 위반 사례가 있는 경우 근로가 허용되지 않습니다.',
          'Students with a GPA below C last semester or with prior violations are not allowed to work.',
        ],
        warnings: [],
        allowedFields: [],
        restrictedFields: [],
        requiredDocuments: [],
        procedures: [],
        notes: [],
      } as any;
      const savedResult = await saveResult(result);
      onNavigate('result', { resultId: savedResult.id });
      return;
    }

    // D-2-2 초과학기자 선택 시 취업 불가
    if (currentQuestion?.id === 'd22Grade' && (answers as any).d22Grade === 'excess') {
      setLoading(true);
      const result = {
        status: 'denied' as const,
        maxHoursPerWeek: 0,
        maxWorkplaces: 0,
        denialReasons: [
          'D-2-2 비자의 초과학기자(4학년 초과)는 시간제 취업허가가 불가능합니다.',
          'D-2-2 visa holders who are overstaying beyond 4 years are not eligible for part-time work permits.',
        ],
        warnings: [],
        allowedFields: [],
        restrictedFields: [],
        requiredDocuments: [],
        procedures: [],
        notes: [],
      } as any;
      const savedResult = await saveResult(result);
      onNavigate('result', { resultId: savedResult.id });
      return;
    }

    // D-4-1 비자 6개월 경과 여부 확인
    if (currentQuestion?.id === 'd41SixMonths' && (answers as any).d41SixMonths === false) {
      setLoading(true);
      const result = {
        status: 'denied' as const,
        maxHoursPerWeek: 0,
        maxWorkplaces: 0,
        denialReasons: [
          'D-4-1(어학연수) 비자는 자격 변경일 또는 입국일로부터 6개월이 경과해야 시간제 취업이 가능합니다.',
          'D-4-1 (Language Training) visa holders must wait 6 months from the date of status change or entry before applying for part-time work permission.',
        ],
        warnings: [],
        allowedFields: [],
        restrictedFields: [],
        requiredDocuments: [],
        procedures: [],
        notes: [],
      } as any;
      const savedResult = await saveResult(result);
      onNavigate('result', { resultId: savedResult.id });
      return;
    }

    // 다음 질문이 있는지 확인
    const nextAnswers = { ...answers, [currentQuestion.id]: currentAnswer };
    const updatedActive = QUIZ_QUESTIONS.filter((q) => !q.condition || q.condition(nextAnswers as any));

    if (currentStep < updatedActive.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      // 모든 질문 완료 → 결과 계산
      setLoading(true);

      let d4SixMonths: boolean | undefined = undefined;
      if (answers.d4SixMonths !== undefined) {
        d4SixMonths = answers.d4SixMonths === true;
      }

      let d41SixMonths: boolean | undefined = undefined;
      if ((answers as any).d41SixMonths !== undefined) {
        d41SixMonths = (answers as any).d41SixMonths === true;
      }

      let d41CertifiedOrExcellent: boolean | undefined = undefined;
      if ((answers as any).d41CertifiedOrExcellent !== undefined) {
        d41CertifiedOrExcellent = (answers as any).d41CertifiedOrExcellent === true;
      }

      let d21d22CertifiedOrExcellent: boolean | undefined = undefined;
      if ((answers as any).d21d22CertifiedOrExcellent !== undefined) {
        d21d22CertifiedOrExcellent = (answers as any).d21d22CertifiedOrExcellent === true;
      }

      let d22Grade34CertifiedOrExcellent: boolean | undefined = undefined;
      if ((answers as any).d22Grade34CertifiedOrExcellent !== undefined) {
        d22Grade34CertifiedOrExcellent = (answers as any).d22Grade34CertifiedOrExcellent === true;
      }

      let d23d24CertifiedOrExcellent: boolean | undefined = undefined;
      if ((answers as any).d23d24CertifiedOrExcellent !== undefined) {
        d23d24CertifiedOrExcellent = (answers as any).d23d24CertifiedOrExcellent === true;
      }

      let topikLevel: 'none' | '1' | '2' | '3plus' = 'none';
      const tl = answers.topikLevel as string | undefined;
      if (tl === '3') {
        topikLevel = '3plus';
      } else if (tl === '2' || tl === '1') {
        topikLevel = tl as '1' | '2';
      } else if (tl === 'none') {
        topikLevel = 'none';
      }

      const isGraduateD2 = answers.visaType === 'D-2' && (answers.d2Type === 'D-2-3' || answers.d2Type === 'D-2-4');
      const isUndergraduateD2 = answers.visaType === 'D-2' && (answers.d2Type === 'D-2-1' || answers.d2Type === 'D-2-2');

      const result = calculatePermit({
        visaType: answers.visaType as 'D-2' | 'D-4-1' | 'other',
        d2Type: (answers as any).d2Type,
        d22Grade: (answers as any).d22Grade,
        d4SixMonths: answers.d4SixMonths,
        d41SixMonths,
        d41KoreanAbility: (answers as any).d41KoreanAbility as 'topik2' | 'integration' | 'sejong' | 'none' | undefined,
        d41CertifiedOrExcellent,
        d21d22CertifiedOrExcellent,
        d22Grade34CertifiedOrExcellent,
        d23d24CertifiedOrExcellent,
        courseType: answers.courseType as 'undergraduate' | 'graduate' | 'language',
        isCertifiedUniversity: answers.isCertifiedUniversity,
        gpaOk: isGraduateD2 || isUndergraduateD2 ? true : (answers.gpaOk as boolean),
        attendanceOk: isGraduateD2 || isUndergraduateD2 ? true : (answers.attendanceOk as boolean),
        isVacation: answers.isVacation as boolean,
        topikLevel,
        d2KoreanAbilityLevel1: (answers as any).d2KoreanAbilityLevel1,
        d2KoreanAbilityLevel2: (answers as any).d2KoreanAbilityLevel2,
      } as any);

      const savedResult = await saveResult(result);
      onNavigate('result', { resultId: savedResult.id });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    } else {
      onBack();
    }
  };

  if (!currentQuestion) {
    return null;
  }

  const questionTitle = typeof currentQuestion.title === 'string' ? currentQuestion.title : currentQuestion.title[language];
  const questionSubtitle = currentQuestion.subtitle
    ? typeof currentQuestion.subtitle === 'string'
      ? currentQuestion.subtitle
      : currentQuestion.subtitle[language]
    : undefined;

  return (
    <div className="quiz-container">
      {/* 헤더 */}
      <div className="quiz-header">
        <button className="back-button" onClick={handleBack}>
          ←
        </button>
        <h1>{t('quiz.title', language)}</h1>
        <div style={{ width: '24px' }} />
      </div>

      {/* 진행 바 */}
      <div className="progress-bar-bg">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* 질문 카드 */}
      <div className="question-card">
        <div className="question-number">
          {language === 'ko' ? `질문 ${currentStep + 1}` : `Question ${currentStep + 1}`}
        </div>
        <h2 className="question-title">{questionTitle}</h2>
        {questionSubtitle && <p className="question-subtitle">{questionSubtitle}</p>}
      </div>

      {/* 선택지 */}
      <div className="option-list">
        {currentQuestion.options.map((option: any, idx: number) => {
          const isSelected = currentAnswer !== undefined && String(currentAnswer) === option.value;
          const optionLabel = typeof option.label === 'string' ? option.label : option.label[language];
          const optionSublabel = option.sublabel
            ? typeof option.sublabel === 'string'
              ? option.sublabel
              : option.sublabel[language]
            : undefined;

          return (
            <button
              key={idx}
              className={`option-button ${isSelected ? 'selected' : ''}`}
              onClick={() => handleSelectOption(option.value)}
            >
              {option.emoji && <span className="option-emoji">{option.emoji}</span>}
              <div className="option-content">
                <div className="option-label">{optionLabel}</div>
                {optionSublabel && <div className="option-sublabel">{optionSublabel}</div>}
              </div>
            </button>
          );
        })}
      </div>

      {/* 네비게이션 버튼 */}
      <div className="button-group">
        <button className="nav-button prev" onClick={handleBack} disabled={currentStep === 0}>
          {language === 'ko' ? '이전' : 'Previous'}
        </button>
        <button
          className="nav-button next"
          onClick={handleNext}
          disabled={!hasAnswer || loading}
        >
          {currentStep === activeQuestions.length - 1
            ? language === 'ko'
              ? '결과 확인하기'
              : 'View Results'
            : language === 'ko'
            ? '다음'
            : 'Next'}
        </button>
      </div>
    </div>
  );
}
