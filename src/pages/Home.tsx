import { useState, useEffect } from 'react';
import { t } from '../i18n';
import { getLatestResult, SavedResult } from '../lib/result-history-service';
import './Home.css';

interface HomeProps {
  language: 'ko' | 'en';
  onNavigate: (page: string, data?: any) => void;
  onLanguageChange: (lang: 'ko' | 'en') => void;
}

export default function Home({
  language,
  onNavigate,
  onLanguageChange,
}: HomeProps) {
  const [latestResult, setLatestResult] = useState<SavedResult | null>(null);

  // 최근 결과 로드
  useEffect(() => {
    const loadLatestResult = async () => {
      const result = await getLatestResult();
      setLatestResult(result);
    };
    loadLatestResult();
  }, []);

  const handleStart = () => {
    onNavigate('quiz');
  };

  const handleDocuments = () => {
    onNavigate('documents');
  };

  const handleProcedures = () => {
    onNavigate('procedures');
  };

  const notice = {
    ko: "유학(D-2) 또는 일반연수(D-4)는 학업을 목적으로 부여되는 체류자격이므로 아르바이트는 원칙적으로 금지됩니다. 그러나 일정한 요건을 갖춘 경우에만 아르바이트가 허용됩니다.\n근무를 시작하기 전에 반드시 출입국관리사무소의 사전 허가를 받아야 합니다. 허가 없이 일을 시작하는 것은 불법 취업으로 간주되며, 이 경우 고용주와 학생 모두에게 심각한 불이익(예: 강제 퇴거, 시간제 취업 제한 등)이 따르게 됩니다.\n직전학기 성적 기준치에 미달하거나 (일반적으로 C학점 미만) 과거 관련 규정 위반사례가 있는 경우 시간제 취업이 불허 또는 제한될 수 있습니다.",
    en: "Since Study(D-2) or General Training(D-4) visas are granted for academic purposes, part-time work is strictly prohibited in principle. However, it is permitted only under specific requirements.\nYou must obtain prior authorization from the Immigration Office before starting work. Beginning work without permission is considered illegal employment, resulting in severe penalties (e.g., deportation, restrictions on part-time work) for both the employer and the student.\nIf your GPA from the previous semester falls below the standard (generally below C) or if you have a history of violating relevant regulations, your part-time work permit may be denied or restricted.",
  };

  return (
    <div className="home-page">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-top">
            <h1 className="app-title">{t('home.heroTitle', language)}</h1>
            <div className="language-selector">
              <button
                className={`lang-btn ${language === 'ko' ? 'active' : ''}`}
                onClick={() => onLanguageChange('ko')}
              >
                한국어
              </button>
              <button
                className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => onLanguageChange('en')}
              >
                English
              </button>
            </div>
          </div>
          <p className="app-subtitle">{t('home.heroSubtitle', language)}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Intro Card */}
        <div className="intro-card">
          <h2>{t('home.whatIs', language)}</h2>
          <p>{t('home.whatIsDesc', language)}</p>
        </div>

        {/* Notice Card */}
        <div className="notice-card">
          <div className="notice-icon">⚠️</div>
          <div className="notice-content">
            <p className="notice-text">
              {notice[language].split('\n').map((line, idx) => (
                <span key={idx}>
                  {line}
                  {idx < notice[language].split('\n').length - 1 &&   
}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="feature-grid">
          <FeatureCard
            icon="⏰"
            title={t('home.workHours', language)}
            desc={t('home.workHoursDesc', language)}
          />
          <FeatureCard
            icon="📁"
            title={t('home.requiredDocs', language)}
            desc={t('home.requiredDocsDesc', language)}
          />
          <FeatureCard
            icon="📝"
            title={t('home.procedures', language)}
            desc={t('home.proceduresDesc', language)}
          />
          <FeatureCard
            icon="⚠️"
            title={t('home.cautions', language)}
            desc={t('home.cautionsDesc', language)}
          />
        </div>

        {/* 시작 버튼 */}
        <button className="btn btn-primary" onClick={handleStart}>
          <span className="btn-main">{t('home.startButton', language)}</span>
          <span className="btn-sub">{t('home.startButtonSub', language)}</span>
        </button>

        {/* 필요 서류 안내 버튼 */}
        <button className="btn btn-secondary" onClick={handleDocuments}>
          <span className="btn-main">
            {language === 'ko' ? '필요 서류 안내' : 'Required Documents'}
          </span>
          <span className="btn-sub">
            {language === 'ko' ? '체크리스트로 준비하기' : 'Prepare with checklist'}
          </span>
        </button>

        {/* 신청 절차 버튼 */}
        <button className="btn btn-secondary" onClick={handleProcedures}>
          <span className="btn-main">
            {language === 'ko' ? '신청 절차' : 'Application Procedures'}
          </span>
          <span className="btn-sub">
            {language === 'ko' ? '단계별 진행 방법 확인' : 'Check step-by-step process'}
          </span>
        </button>

        {/* 최근 결과 카드 */}
        {latestResult && (
          <div className="recent-result-card">
            <h3 className="recent-result-title">
              {language === 'ko' ? '최근 결과' : 'Recent Result'}
            </h3>
            <p className="recent-result-time">
              {new Date(latestResult.savedAt).toLocaleDateString(
                language === 'ko' ? 'ko-KR' : 'en-US'
              )}
            </p>
            <div className="result-status-container">
              <div
                className={`result-status ${latestResult.result.status}`}
              >
                <span className="result-status-text">
                  {latestResult.result.status === 'allowed'
                    ? language === 'ko'
                      ? '취업 가능'
                      : 'Can Work'
                    : latestResult.result.status === 'conditional'
                    ? language === 'ko'
                      ? '조건부 가능'
                      : 'Conditional'
                    : language === 'ko'
                    ? '취업 불가'
                    : 'Cannot Work'}
                </span>
              </div>
              <p className="result-hours">
                {language === 'ko' ? '주당' : 'Per week'}{' '}
                <strong>
                  {latestResult.result.maxHoursPerWeek === null
                    ? language === 'ko'
                      ? '무제한'
                      : 'Unlimited'
                    : latestResult.result.maxHoursPerWeek}
                </strong>{' '}
                {latestResult.result.maxHoursPerWeek === null
                  ? ''
                  : language === 'ko'
                  ? '시간'
                  : 'hours'}
              </p>
            </div>
            <button
              className="btn btn-small"
              onClick={() => onNavigate('quiz')}
            >
              {language === 'ko' ? '다시 확인하기' : 'Check Again'}
            </button>
          </div>
        )}

        {/* 피드백 버튼 */}
        <button
          className="btn btn-feedback"
          onClick={() =>
            window.open('https://forms.gle/6v2q5WcqKb6CC2QB8', '_blank' )
          }
          style={{
            marginTop: '20px',
            padding: '12px 24px',
            background: '#f0f0f0',
            color: '#333',
            border: '2px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            width: '100%',
          }}
        >
          {language === 'ko' ? '📝 피드백 보내기' : '📝 Send Feedback'}
        </button>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 Student Work Permit Guide. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-desc">{desc}</p>
    </div>
  );
}
