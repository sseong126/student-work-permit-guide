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
