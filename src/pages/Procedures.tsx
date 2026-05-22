import "./Procedures.css";

interface ProceduresProps {
  language: "ko" | "en";
  onBack: () => void;
}

export default function Procedures({ language, onBack }: ProceduresProps) {
  const procedures = [
    {
      ko: "학교 국제학생 담당부서 방문",
      en: "Visit School's International Office",
      desc: {
        ko: "학교의 국제학생 담당부서를 방문하여 시간제 취업 신청에 대해 문의합니다.",
        en: "Visit your school's international student office and inquire about part-time work application.",
      },
    },
    {
      ko: "필요 서류 준비",
      en: "Prepare Required Documents",
      desc: {
        ko: "여권, 비자, 학생증, 은행 계좌 등 필요한 서류를 준비합니다.",
        en: "Gather your passport, visa, student ID, bank account information, etc.",
      },
    },
    {
      ko: "신청서 작성",
      en: "Fill Out Application Form",
      desc: {
        ko: "학교에서 제공하는 신청서를 정확하게 작성합니다.",
        en: "Complete the application form provided by your school accurately.",
      },
    },
    {
      ko: "서류 제출",
      en: "Submit Documents",
      desc: {
        ko: "작성한 신청서와 필요한 서류를 국제학생 담당부서에 제출합니다.",
        en: "Submit the completed form and required documents to the international office.",
      },
    },
    {
      ko: "승인 및 허가",
      en: "Approval and Permission",
      desc: {
        ko: "학교의 승인을 받고 시간제 취업 허가서를 발급받습니다.",
        en: "Receive school approval and obtain the part-time work permission letter.",
      },
    },
    {
      ko: "고용주에게 제출",
      en: "Submit to Employer",
      desc: {
        ko: "취업 예정 회사에 학교 허가서를 제출합니다.",
        en: "Submit the school permission letter to your prospective employer.",
      },
    },
  ];

  return (
    <div className="procedures-page">
      <button className="back-btn" onClick={onBack}>
        ← {language === "ko" ? "돌아가기" : "Back"}
      </button>

      <div className="procedures-container">
        <h1>{language === "ko" ? "지원 및 허가 절차" : "Application Procedures"}</h1>

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
                  <h3>{typeof procName === "string" ? procName : ""}</h3>
                  <p>{typeof procDesc === "string" ? procDesc : ""}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="timeline-footer">
          <div className="footer-content">
            <h3>
              {language === "ko" ? "예상 소요 기간" : "Expected Timeline"}
            </h3>
            <p>
              {language === "ko"
                ? "전체 절차는 보통 1-2주 정도 소요됩니다."
                : "The entire process usually takes 1-2 weeks."}
            </p>
          </div>
          <button
            className="hikorea-btn"
            onClick={() => window.open("https://www.hikorea.go.kr", "_blank")}
            style={{
              marginTop: "20px",
              padding: "12px 24px",
              background: "#0070f3",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px",
              width: "100%",
            }}
          >
            {language === "ko"
              ? "하이코리아 웹사이트 방문"
              : "Visit HiKorea Website"}
          </button>
        </div>
      </div>
    </div>
  );
}
