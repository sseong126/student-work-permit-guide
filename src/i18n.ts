export const translations = {
  ko: {
    home: {
      heroTitle: "유학생 시간제 취업 안내",
      heroSubtitle: "유학생 신분으로 한국에서 합법적으로 일할 수 있는 방법을 알아보세요",
      whatIs: "시간제 취업이란?",
      whatIsDesc: "유학생이 학업과 병행하여 주당 20시간 이내로 일할 수 있는 합법적인 근무 형태입니다. 비자 조건을 만족하면서 경험을 쌓을 수 있습니다.",
      workHours: "근무 시간",
      workHoursDesc: "주당 최대 20시간, 방학 중 40시간",
      requiredDocs: "필요 서류",
      requiredDocsDesc: "여권, 비자, 학생증 등",
      procedures: "신청 절차",
      proceduresDesc: "단계별 신청 방법 안내",
      cautions: "주의사항",
      cautionsDesc: "꼭 알아야 할 중요한 사항들",
      startButton: "시작하기",
      startButtonSub: "자세한 정보 보기",
    },
    quiz: {
      title: "유학생 시간제 취업 자격 진단",
      subtitle: "몇 가지 질문에 답변하여 당신의 자격을 확인해보세요",
      question: "질문",
      next: "다음",
      back: "이전",
      submit: "결과 보기",
    },
    documents: {
      title: "필요 서류",
      subtitle: "시간제 취업을 위해 필요한 서류들입니다",
    },
    procedures: {
      title: "신청 절차",
      subtitle: "단계별 신청 방법을 안내합니다",
    },
  },
  en: {
    home: {
      heroTitle: "International Student Part-Time Work Guide",
      heroSubtitle: "Learn how to legally work in Korea as an international student",
      whatIs: "What is Part-Time Work?",
      whatIsDesc: "A legal form of employment where international students can work up to 20 hours per week while studying. You can gain experience while meeting visa requirements.",
      workHours: "Work Hours",
      workHoursDesc: "Max 20 hours/week, 40 hours during breaks",
      requiredDocs: "Required Documents",
      requiredDocsDesc: "Passport, visa, student ID, etc.",
      procedures: "Application Process",
      proceduresDesc: "Step-by-step application guide",
      cautions: "Cautions",
      cautionsDesc: "Important things to know",
      startButton: "Get Started",
      startButtonSub: "View detailed information",
    },
    quiz: {
      title: "International Student Work Eligibility Assessment",
      subtitle: "Answer a few questions to check your eligibility",
      question: "Question",
      next: "Next",
      back: "Back",
      submit: "View Results",
    },
    documents: {
      title: "Required Documents",
      subtitle: "Documents needed for part-time work",
    },
    procedures: {
      title: "Application Process",
      subtitle: "Step-by-step application guide",
    },
  },
  zh: {
    home: {
      heroTitle: "留学生兼职工作指南",
      heroSubtitle: "了解如何在韩国作为留学生合法工作",
      whatIs: "什么是兼职工作?",
      whatIsDesc: "留学生在学习期间每周可以合法工作不超过20小时。您可以在满足签证要求的同时获得经验。",
      workHours: "工作时间",
      workHoursDesc: "每周最多20小时，假期40小时",
      requiredDocs: "所需文件",
      requiredDocsDesc: "护照、签证、学生证等",
      procedures: "申请流程",
      proceduresDesc: "分步申请指南",
      cautions: "注意事项",
      cautionsDesc: "需要了解的重要事项",
      startButton: "开始",
      startButtonSub: "查看详细信息",
    },
    quiz: {
      title: "留学生工作资格评估",
      subtitle: "回答几个问题以检查您的资格",
      question: "问题",
      next: "下一步",
      back: "返回",
      submit: "查看结果",
    },
    documents: {
      title: "所需文件",
      subtitle: "兼职工作所需的文件",
    },
    procedures: {
      title: "申请流程",
      subtitle: "分步申请指南",
    },
  },
};

export const t = (key: string, language: string = "ko") => {
  const keys = key.split(".");
  let value: any = translations[language as keyof typeof translations] || translations.ko;
  
  for (const k of keys) {
    value = value[k];
    if (!value) return key;
  }
  
  return value;
};
