import { t } from "../i18n";
import "./Home.css";

interface HomeProps {
  language: "ko" | "en" | "zh";
  onNavigate: (page: "quiz" | "documents" | "procedures") => void;
  onOpenLanguageModal: () => void;
}

export default function Home({
  language,
  onNavigate,
  onOpenLanguageModal,
}: HomeProps) {
  return (
    <div className="home-page">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-top">
            <h1 className="app-title">{t("home.heroTitle", language)}</h1>
            <button
              className="language-btn"
              onClick={onOpenLanguageModal}
              title="Change language"
            >
              🌐
            </button>
          </div>
          <p className="app-subtitle">{t("home.heroSubtitle", language)}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Intro Card */}
        <div className="intro-card">
          <h2>{t("home.whatIs", language)}</h2>
          <p>{t("home.whatIsDesc", language)}</p>
        </div>

        {/* Feature Grid */}
        <div className="feature-grid">
          <FeatureCard
            icon="⏰"
            title={t("home.workHours", language)}
            desc={t("home.workHoursDesc", language)}
          />
          <FeatureCard
            icon="📁"
            title={t("home.requiredDocs", language)}
            desc={t("home.requiredDocsDesc", language)}
          />
          <FeatureCard
            icon="📝"
            title={t("home.procedures", language)}
            desc={t("home.proceduresDesc", language)}
          />
          <FeatureCard
            icon="⚠️"
            title={t("home.cautions", language)}
            desc={t("home.cautionsDesc", language)}
          />
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className="btn btn-primary"
            onClick={() => onNavigate("quiz")}
          >
            {t("home.startButton", language)}
            <span className="btn-sub">{t("home.startButtonSub", language)}</span>
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => onNavigate("documents")}
          >
            {t("home.requiredDocs", language)}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => onNavigate("procedures")}
          >
            {t("home.procedures", language)}
          </button>
        </div>
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
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}
