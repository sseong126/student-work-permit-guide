import { t } from "../i18n";
import "./Procedures.css";

interface ProceduresProps {
  language: "ko" | "en" | "zh";
  onBack: () => void;
}

export default function Procedures({ language, onBack }: ProceduresProps) {
  const procedures = [
    {
      ko: "학교 국제학생 담당부서 방문",
      en: "Visit School's International Office",
      zh: "访问学校国际学生办公室",
      desc: {
        ko: "학교의 국제학생 담당부서를 방문하여 시간제 취업 신청에 대해 문의합니다.",
        en: "Visit your school's international student office and inquire about part-time work application.",
        zh: "访问学校的国际学生办公室，询问兼职工作申请。",
      },
    },
    {
      ko: "필요 서류 준비",
      en: "Prepare Required Documents",
      zh: "准备所需文件",
      desc: {
        ko: "여권, 비자, 학생증, 은행 계좌 등 필요한 서류를 준비합니다.",
        en: "Gather your passport, visa, student ID, bank account information, etc.",
        zh: "收集护照、签证、学生证、银行账户信息等。",
      },
    },
    {
      ko: "신청서 작성",
      en: "Fill Out Application Form",
      zh: "填写申请表",
      desc: {
        ko: "학교에서 제공하는 신청서를 정확하게 작성합니다.",
        en: "Complete the application form provided by your school accurately.",
        zh: "准确填写学校提供的申请表。",
      },
    },
    {
      ko: "서류 제출",
      en: "Submit Documents",
      zh: "提交文件",
      desc: {
        ko: "작성한 신청서와 필요한 서류를 국제학생 담당부서에 제출합니다.",
        en: "Submit the completed form and required documents to the international office.",
        zh: "将填好的表格和所需文件提交给国际学生办公室。",
      },
    },
    {
      ko: "승인 및 허가",
      en: "Approval and Permission",
      zh: "批准和许可",
      desc: {
        ko: "학교의 승인을 받고 시간제 취업 허가서를 발급받습니다.",
        en: "Receive school approval and obtain the part-time work permission letter.",
        zh: "获得学校批准并获得兼职工作许可信。",
      },
    },
    {
      ko: "고용주에게 제출",
      en: "Submit to Employer",
      zh: "提交给雇主",
      desc: {
        ko: "취업 예정 회사에 학교 허가서를 제출합니다.",
        en: "Submit the school permission letter to your prospective employer.",
        zh: "将学校许可信提交给您的预期雇主。",
      },
    },
  ];

  return (
    <div className="procedures-page">
      <button className="back-btn" onClick={onBack}>
        ← {language === "ko" ? "돌아가기" : language === "en" ? "Back" : "返回"}
      </button>

      <div className="procedures-container">
        <h1>{t("procedures.title", language)}</h1>
        <p className="subtitle">{t("procedures.subtitle", language)}</p>

        <div className="procedures-timeline">
          {procedures.map((proc, index) => {
            const procName = proc[language as keyof typeof proc];
            const procDesc = proc.desc[language as keyof typeof proc.desc];
            return (
              <div key={index} className="timeline-item">
                <div className="timeline-marker">
                  <div className="marker-circle">{index + 1}</div>
                  {index < procedures.length - 1 && <div className="marker-line"></div>}
                </div>
                <div className="timeline-content">
                  <h3>{typeof procName === 'string' ? procName : ''}</h3>
                  <p>{typeof procDesc === 'string' ? procDesc : ''}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="timeline-footer">
          <div className="footer-content">
            <h3>
              {language === "ko"
                ? "예상 소요 기간"
                : language === "en"
                ? "Expected Timeline"
                : "预期时间表"}
            </h3>
            <p>
              {language === "ko"
                ? "전체 절차는 보통 1-2주 정도 소요됩니다."
                : language === "en"
                ? "The entire process usually takes 1-2 weeks."
                : "整个过程通常需要1-2周。"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
