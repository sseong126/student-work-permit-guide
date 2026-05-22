import type { VisaType, QuizAnswers } from "./permit-logic";;
import type { Language } from "./i18n";

export interface QuizOption {
  value: string;
  label: Record<Language, string>;
  sublabel?: Record<Language, string>;
  emoji?: string;
}

export interface QuizQuestion {
  id: string;
  title: Record<Language, string>;
  subtitle?: Record<Language, string>;
  options: QuizOption[];
  // 이 질문을 표시할 조건 (없으면 항상 표시)
  condition?: (answers: Partial<QuizAnswers>) => boolean;
}

export type QuizAnswersForD23D24 = Partial<QuizAnswers> & {
  d23d24CertifiedOrExcellent?: boolean;
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "visaType",
    title: {
      ko: "현재 보유한 비자 종류는?",
      en: "What is your current visa type?",
    },
    subtitle: {
      ko: "한국 체류 비자를 선택해 주세요",
      en: "Please select your Korea residence visa",
    },
    options: [
      {
        value: "D-2",
        label: {
          ko: "D-2 유학 비자",
          en: "D-2 Student Visa",
        },
        sublabel: {
          ko: "대학교, 대학원 재학",
          en: "University or Graduate School",
        },
        emoji: "🎓",
      },
      {
        value: "D-4-1",
        label: {
          ko: "D-4-1 어학연수 비자",
          en: "D-4-1 Language Training (D-4)",
        },
        sublabel: {
          ko: "어학원 어학연수 (6개월 이상)",
          en: "Language School Training (6 months or more)",
        },
        emoji: "🗣️",
      },
    ],
  },
  {
    id: "d2Type",
    title: {
      ko: "현재 보유한 D-2 비자 종류는?",
      en: "What type of D-2 visa do you have?",
    },
    subtitle: {
      ko: "해당하는 학위 과정을 선택해 주세요",
      en: "Please select your degree program",
    },
    options: [
      {
        value: "D-2-1",
        label: {
          ko: "전문학사 (D-2-1)",
          en: "Associate Degree (D-2-1)",
        },
        sublabel: {
          ko: "전문대학 재학",
          en: "Junior College",
        },
        emoji: "🎓",
      },
      {
        value: "D-2-2",
        label: {
          ko: "학사 (D-2-2)",
          en: "Bachelor (D-2-2)",
        },
        sublabel: {
          ko: "4년제 대학교 재학",
          en: "University",
        },
        emoji: "🎓",
      },
      {
        value: "D-2-3",
        label: {
          ko: "석사 (D-2-3)",
          en: "Master's (D-2-3)",
        },
        sublabel: {
          ko: "대학원 석사과정 재학",
          en: "Graduate School - Master's",
        },
        emoji: "🎓",
      },
      {
        value: "D-2-4",
        label: {
          ko: "박사 (D-2-4)",
          en: "Ph.D. (D-2-4)",
        },
        sublabel: {
          ko: "대학원 박사과정 재학",
          en: "Graduate School - Doctoral",
        },
        emoji: "🎓",
      },
    ],
    condition: (answers) => answers.visaType === "D-2",
  },
  {
    id: "d2GpaOk",
    title: {
      ko: "직전 학기 성적이 C(2.0)를 넘나요?",
      en: "Is your GPA above C (2.0) from last semester?",
    },
    subtitle: {
      ko: "학교에 따라 근로 가능 성적이 다를 수 있습니다",
      en: "Minimum GPA requirements may vary by school",
    },
    options: [
      {
        value: "true",
        label: {
          ko: "넘는다",
          en: "Yes, above C",
        },
        emoji: "✅",
      },
      {
        value: "false",
        label: {
          ko: "넘지 않는다",
          en: "No, below C",
        },
        emoji: "❌",
      },
    ],
    condition: (answers) => answers.visaType === "D-2",
  },
  {
    id: "d22Grade",
    title: {
      ko: "현재 학년은?",
      en: "What is your current grade level?",
    },
    subtitle: {
      ko: "해당하는 학년을 선택해 주세요",
      en: "Please select your grade level",
    },
    options: [
      {
        value: "1-2",
        label: {
          ko: "1-2학년",
          en: "1st-2nd Year",
        },
        emoji: "📚",
      },
      {
        value: "3-4",
        label: {
          ko: "3-4학년",
          en: "3rd-4th Year",
        },
        emoji: "📚",
      },
      {
        value: "excess",
        label: {
          ko: "초과학기자",
          en: "Excess Semester",
        },
        emoji: "⚠️",
      },
    ],
    condition: (answers) => answers.d2Type === "D-2-2",
  },
  {
    id: "d2KoreanAbilityLevel1",
    title: {
      ko: "한국어 능력은?",
      en: "What is your Korean language ability?",
    },
    subtitle: {
      ko: "해당하는 한국어 능력을 선택해 주세요",
      en: "Please select your Korean language ability",
    },
    options: [
      {
        value: "topik3",
        label: {
          ko: "TOPIK 3급",
          en: "TOPIK Level 3",
        },
        emoji: "📜",
      },
      {
        value: "integration",
        label: {
          ko: "사회통합프로그램 3단계 이상 이수 또는 사전평가 61점 이상",
          en: "Social Integration Program Level 3+ or Pre-assessment 61+",
        },
        emoji: "📋",
      },
      {
        value: "sejong",
        label: {
          ko: "세종학당 중급 1 이상 이수",
          en: "King Sejong Institute Intermediate 1+",
        },
        emoji: "🏫",
      },
      {
        value: "none",
        label: {
          ko: "해당없음",
          en: "None",
        },
        emoji: "❌",
      },
    ],
    condition: (answers) => {
      const isD21Or22 = answers.d2Type === "D-2-1" || (answers.d2Type === "D-2-2" && answers.d22Grade === "1-2");
      return answers.visaType === "D-2" && isD21Or22;
    },
  },
  {
    id: "d2KoreanAbilityLevel2",
    title: {
      ko: "한국어 능력은?",
      en: "What is your Korean language ability?",
    },
    subtitle: {
      ko: "해당하는 한국어 능력을 선택해 주세요",
      en: "Please select your Korean language ability",
    },
    options: [
      {
        value: "topik4",
        label: {
          ko: "TOPIK 4급",
          en: "TOPIK Level 4",
        },
        emoji: "📜",
      },
      {
        value: "integration",
        label: {
          ko: "사회통합프로그램 4단계 이상 이수 또는 사전평가 81점 이상",
          en: "Social Integration Program Level 4+ or Pre-assessment 81+",
        },
        emoji: "📋",
      },
      {
        value: "sejong",
        label: {
          ko: "세종학당 중급 2 이상 이수",
          en: "King Sejong Institute Intermediate 2+",
        },
        emoji: "🏫",
      },
      {
        value: "none",
        label: {
          ko: "해당없음",
          en: "None",
        },
        emoji: "❌",
      },
    ],
    condition: (answers) => {
      const isD22Grade34 = answers.d2Type === "D-2-2" && answers.d22Grade === "3-4";
      const isD23Or24 = answers.d2Type === "D-2-3" || answers.d2Type === "D-2-4";
      return answers.visaType === "D-2" && (isD22Grade34 || isD23Or24);
    },
  },
  {
    id: "d21d22CertifiedOrExcellent",
    title: {
      ko: "다음 중 해당하는 항목이 있나요?",
      en: "Do you meet any of the following criteria?",
    },
    subtitle: {
      ko: "인증대학 재학, 성적우수자, 한국어우수자",
      en: "Accredited Universities, High Academic Achievement, Proficiency in Korean",
    },
    options: [
      {
        value: "true",
        label: {
          ko: "예, 해당함",
          en: "Yes, applicable",
        },
        emoji: "✅",
      },
      {
        value: "false",
        label: {
          ko: "아니요, 해당없음",
          en: "No, not applicable",
        },
        emoji: "❌",
      },
    ],
    condition: (answers) => {
      const isD21Or22Grade12 = answers.d2Type === "D-2-1" || (answers.d2Type === "D-2-2" && answers.d22Grade === "1-2");
      return answers.visaType === "D-2" && isD21Or22Grade12;
    },
  },
  {
    id: "d22Grade34CertifiedOrExcellent",
    title: {
      ko: "다음 중 해당하는 항목이 있나요?",
      en: "Do you meet any of the following criteria?",
    },
    subtitle: {
      ko: "인증대학 재학, 성적우수자, 한국어우수자",
      en: "Accredited Universities, High Academic Achievement, Proficiency in Korean",
    },
    options: [
      {
        value: "true",
        label: {
          ko: "예, 해당함",
          en: "Yes, applicable",
        },
        emoji: "✅",
      },
      {
        value: "false",
        label: {
          ko: "아니요, 해당없음",
          en: "No, not applicable",
        },
        emoji: "❌",
      },
    ],
    condition: (answers) => answers.visaType === "D-2" && answers.d2Type === "D-2-2" && answers.d22Grade === "3-4",
  },
  {
    id: "d23d24CertifiedOrExcellent",
    title: {
      ko: "다음 중 해당하는 항목이 있나요?",
      en: "Do you meet any of the following criteria?",
    },
    subtitle: {
      ko: "인증대학 재학, 성적우수자, 한국어우수자",
      en: "Accredited Universities, High Academic Achievement, Proficiency in Korean",
    },
    options: [
      {
        value: "true",
        label: {
          ko: "예, 해당함",
          en: "Yes, applicable",
        },
        emoji: "✅",
      },
      {
        value: "false",
        label: {
          ko: "아니요, 해당없음",
          en: "No, not applicable",
        },
        emoji: "❌",
      },
    ],
    condition: (answers) => answers.visaType === "D-2" && (answers.d2Type === "D-2-3" || answers.d2Type === "D-2-4"),
  },
  {
    id: "isVacation",
    title: {
      ko: "근무 시간대",
      en: "When do you want to work?",
    },
    subtitle: {
      ko: "주중(학기 중) 또는 주말·방학 중 선택",
      en: "Choose weekdays (during semester) or weekends/holidays",
    },
    options: [
      {
        value: "false",
        label: {
          ko: "주중 (학기 중)",
          en: "Weekdays (during semester)",
        },
        emoji: "📚",
      },
      {
        value: "true",
        label: {
          ko: "주말, 방학",
          en: "Weekends, holidays",
        },
        emoji: "🏖️",
      },
    ],
    condition: (answers) => {
      const isD21Or22Grade12 = answers.d2Type === "D-2-1" || (answers.d2Type === "D-2-2" && answers.d22Grade === "1-2");
      const isD22Grade34 = answers.d2Type === "D-2-2" && answers.d22Grade === "3-4";
      const isD23Or24 = answers.d2Type === "D-2-3" || answers.d2Type === "D-2-4";
      return answers.visaType === "D-2" && (isD21Or22Grade12 || isD22Grade34 || isD23Or24);
    },
  },
  {
    id: "d41SixMonths",
    title: {
      ko: "자격 변경일 또는 입국일로부터 6개월이 경과했나요?",
      en: "Have 6 months passed since visa change or entry?",
    },
    subtitle: {
      ko: "D-4-1 어학연수 비자는 6개월 경과 후 취업 가능",
      en: "D-4-1 visa holders can work after 6 months",
    },
    options: [
      {
        value: "true",
        label: {
          ko: "예, 6개월 이상 경과",
          en: "Yes, more than 6 months",
        },
        emoji: "✅",
      },
      {
        value: "false",
        label: {
          ko: "아니요, 6개월 미만",
          en: "No, less than 6 months",
        },
        emoji: "⏳",
      },
    ],
    condition: (answers) => answers.visaType === "D-4-1",
  },
  {
    id: "d41KoreanAbility",
    title: {
      ko: "한국어 능력은?",
      en: "What is your Korean language ability?",
    },
    subtitle: {
      ko: "다음 중 해당하는 항목을 선택해 주세요",
      en: "Please select the applicable option",
    },
    options: [
      {
        value: "topik2",
        label: {
          ko: "TOPIK 2급",
          en: "TOPIK Level 2",
        },
        emoji: "📝",
      },
      {
        value: "integration",
        label: {
          ko: "사회통합프로그램 2단계 이상 이수 또는 사전평가 41점 이상",
          en: "Social Integration Program Level 2+ or Pre-assessment 41+",
        },
        emoji: "📋",
      },
      {
        value: "sejong",
        label: {
          ko: "세종학당 중급 1 이상 이수",
          en: "King Sejong Institute Intermediate 1+",
        },
        emoji: "🏫",
      },
      {
        value: "none",
        label: {
          ko: "해당없음",
          en: "None",
        },
        emoji: "❌",
      },
    ],
    condition: (answers) => answers.visaType === "D-4-1",
  },
  {
    id: "d41CertifiedOrExcellent",
    title: {
      ko: "다음 중 해당하는 항목이 있나요?",
      en: "Do you meet any of the following criteria?",
    },
    subtitle: {
      ko: "인증대학 재학, 성적우수자, 한국어우수자",
      en: "Accredited Universities, High Academic Achievement, Proficiency in Korean",
    },
    options: [
      {
        value: "true",
        label: {
          ko: "예, 해당함",
          en: "Yes, applicable",
        },
        emoji: "✅",
      },
      {
        value: "false",
        label: {
          ko: "아니요, 해당없음",
          en: "No, not applicable",
        },
        emoji: "❌",
      },
    ],
    condition: (answers) => answers.visaType === "D-4-1",
  },
];
