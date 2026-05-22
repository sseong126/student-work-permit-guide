import { t } from "../i18n";
import "./Documents.css";

interface DocumentsProps {
  language: "ko" | "en" | "zh";
  onBack: () => void;
}

export default function Documents({ language, onBack }: DocumentsProps) {
  const documents = [
    {
      ko: "여권",
      en: "Passport",
      zh: "护照",
      desc: {
        ko: "유효한 여권 사본",
        en: "Valid passport copy",
        zh: "有效护照副本",
      },
    },
    {
      ko: "비자",
      en: "Visa",
      zh: "签证",
      desc: {
        ko: "유학생 비자 사본",
        en: "Student visa copy",
        zh: "学生签证副本",
      },
    },
    {
      ko: "학생증",
      en: "Student ID",
      zh: "学生证",
      desc: {
        ko: "현재 학기 학생증",
        en: "Current semester student ID",
        zh: "当前学期学生证",
      },
    },
    {
      ko: "학교 허가서",
      en: "School Permission",
      zh: "学校许可",
      desc: {
        ko: "학교에서 발급한 시간제 취업 허가서",
        en: "Part-time work permission from school",
        zh: "学校颁发的兼职工作许可",
      },
    },
    {
      ko: "은행 계좌",
      en: "Bank Account",
      zh: "银行账户",
      desc: {
        ko: "급여 입금용 한국 은행 계좌",
        en: "Korean bank account for salary",
        zh: "用于工资存入的韩国银行账户",
      },
    },
  ];

  return (
    <div className="documents-page">
      <button className="back-btn" onClick={onBack}>
        ← {language === "ko" ? "돌아가기" : language === "en" ? "Back" : "返回"}
      </button>

      <div className="documents-container">
        <h1>{t("documents.title", language)}</h1>
        <p className="subtitle">{t("documents.subtitle", language)}</p>

        <div className="documents-list">
          {documents.map((doc, index) => {
            const docName = doc[language as keyof typeof doc];
            const docDesc = doc.desc[language as keyof typeof doc.desc];
            return (
              <div key={index} className="document-item">
                <div className="doc-number">{index + 1}</div>
                <div className="doc-content">
                  <h3>{typeof docName === 'string' ? docName : ''}</h3>
                  <p>{typeof docDesc === 'string' ? docDesc : ''}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="info-box">
          <h3>
            {language === "ko"
              ? "주의사항"
              : language === "en"
              ? "Important Notes"
              : "重要提示"}
          </h3>
          <ul>
            <li>
              {language === "ko"
                ? "모든 서류는 원본 또는 공증 사본이어야 합니다."
                : language === "en"
                ? "All documents must be originals or certified copies."
                : "所有文件必须是原件或公证副本。"}
            </li>
            <li>
              {language === "ko"
                ? "서류는 언제든 요청받을 수 있으므로 항상 준비해두세요."
                : language === "en"
                ? "Keep documents ready as they may be requested at any time."
                : "随时准备好文件，因为可能随时被要求。"}
            </li>
            <li>
              {language === "ko"
                ? "학교 국제학생 담당부서에 확인하여 정확한 서류를 준비하세요."
                : language === "en"
                ? "Confirm with your school's international office for exact requirements."
                : "与学校国际学生办公室确认准确的要求。"}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
