import { useState } from "react";
import { t } from "../i18n";
import "./Quiz.css";

interface QuizProps {
  language: "ko" | "en" | "zh";
  onBack: () => void;
}

export default function Quiz({ language, onBack }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      ko: "현재 유학생 비자를 소유하고 있습니까?",
      en: "Do you currently have a student visa?",
      zh: "您目前持有学生签证吗?",
    },
    {
      ko: "학교에 정규 등록되어 있습니까?",
      en: "Are you enrolled as a full-time student?",
      zh: "您是否以全日制学生身份注册?",
    },
    {
      ko: "주당 20시간 이내로 일할 수 있습니까?",
      en: "Can you work within 20 hours per week?",
      zh: "您能否每周在20小时内工作?",
    },
    {
      ko: "학교의 허가를 받았습니까?",
      en: "Have you received permission from your school?",
      zh: "您是否获得了学校的许可?",
    },
  ];

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setShowResult(true);
  };

  const calculateScore = () => {
    return answers.reduce((sum, answer) => sum + answer, 0);
  };

  const getResultMessage = () => {
    const score = calculateScore();
    if (score >= 4) {
      return language === "ko"
        ? "축하합니다! 시간제 취업 자격이 있습니다."
        : language === "en"
        ? "Congratulations! You are eligible for part-time work."
        : "恭喜!您符合兼职工作的资格。";
    } else if (score >= 2) {
      return language === "ko"
        ? "추가 확인이 필요합니다. 학교 국제학생 담당부서에 문의하세요."
        : language === "en"
        ? "Additional verification needed. Contact your school's international student office."
        : "需要进一步确认。请联系学校的国际学生办公室。";
    } else {
      return language === "ko"
        ? "현재 자격이 없습니다. 조건을 확인하고 다시 시도하세요."
        : language === "en"
        ? "You are not currently eligible. Please check the requirements."
        : "您目前不符合资格。请检查要求。";
    }
  };

  if (showResult) {
    return (
      <div className="quiz-page">
        <button className="back-btn" onClick={onBack}>
          ← {language === "ko" ? "돌아가기" : language === "en" ? "Back" : "返回"}
        </button>
        <div className="quiz-result">
          <h1>{t("quiz.title", language)}</h1>
          <div className="result-box">
            <h2>결과</h2>
            <p className="result-message">{getResultMessage()}</p>
            <p className="result-score">
              {language === "ko"
                ? `점수: ${calculateScore()}/4`
                : language === "en"
                ? `Score: ${calculateScore()}/4`
                : `分数: ${calculateScore()}/4`}
            </p>
            <button
              className="btn-restart"
              onClick={() => {
                setCurrentQuestion(0);
                setAnswers([]);
                setShowResult(false);
              }}
            >
              {language === "ko"
                ? "다시 시작"
                : language === "en"
                ? "Restart"
                : "重新开始"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentLangQuestion =
    questions[currentQuestion][language as keyof typeof questions[0]];

  return (
    <div className="quiz-page">
      <button className="back-btn" onClick={onBack}>
        ← {language === "ko" ? "돌아가기" : language === "en" ? "Back" : "返回"}
      </button>
      <div className="quiz-container">
        <h1>{t("quiz.title", language)}</h1>
        <p className="quiz-subtitle">{t("quiz.subtitle", language)}</p>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          ></div>
        </div>

        <div className="question-box">
          <p className="question-number">
            {t("quiz.question", language)} {currentQuestion + 1}/{questions.length}
          </p>
          <h2>{currentLangQuestion}</h2>

          <div className="answer-options">
            <button
              className={`option ${answers[currentQuestion] === 1 ? "selected" : ""}`}
              onClick={() => handleAnswer(1)}
            >
              {language === "ko"
                ? "예"
                : language === "en"
                ? "Yes"
                : "是的"}
            </button>
            <button
              className={`option ${answers[currentQuestion] === 0 ? "selected" : ""}`}
              onClick={() => handleAnswer(0)}
            >
              {language === "ko"
                ? "아니오"
                : language === "en"
                ? "No"
                : "不"}
            </button>
          </div>
        </div>

        <div className="quiz-buttons">
          <button
            className="btn-nav"
            onClick={handleBack}
            disabled={currentQuestion === 0}
          >
            ← {t("quiz.back", language)}
          </button>
          {currentQuestion < questions.length - 1 ? (
            <button
              className="btn-nav"
              onClick={handleNext}
              disabled={answers[currentQuestion] === undefined}
            >
              {t("quiz.next", language)} →
            </button>
          ) : (
            <button
              className="btn-submit"
              onClick={handleSubmit}
              disabled={answers[currentQuestion] === undefined}
            >
              {t("quiz.submit", language)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
