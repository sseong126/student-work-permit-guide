import { useState, useEffect } from "react";
import "./App.css";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Documents from "./pages/Documents";
import Procedures from "./pages/Procedures";
import { Language } from "./i18n";

type Page = "home" | "quiz" | "documents" | "procedures";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [language, setLanguage] = useState<Language>("ko");
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useEffect(() => {
    const hasSeenLanguageModal = localStorage.getItem("hasSeenLanguageModal");
    if (!hasSeenLanguageModal) {
      setShowLanguageModal(true);
      localStorage.setItem("hasSeenLanguageModal", "true");
    }
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setShowLanguageModal(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <Home
            language={language}
            onNavigate={setCurrentPage}
            onOpenLanguageModal={() => setShowLanguageModal(true)}
          />
        );
      case "quiz":
        return <Quiz language={language} onBack={() => setCurrentPage("home")} />;
      case "documents":
        return (
          <Documents language={language} onBack={() => setCurrentPage("home")} />
        );
      case "procedures":
        return (
          <Procedures language={language} onBack={() => setCurrentPage("home")} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      {showLanguageModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Select Language / 언어 선택</h2>
            <div className="language-buttons">
              <button
                onClick={() => handleLanguageChange("ko")}
                className={language === "ko" ? "active" : ""}
              >
                한국어
              </button>
              <button
                onClick={() => handleLanguageChange("en")}
                className={language === "en" ? "active" : ""}
              >
                English
              </button>
            </div>
          </div>
        </div>
      )}
      {renderPage()}
    </div>
  );
}

export default App;
