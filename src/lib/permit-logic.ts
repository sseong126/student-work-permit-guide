// 유학생 시간제 취업허가 계산 로직

export type VisaType = "D-2" | "D-4-1" | "other";
export type CourseType = "undergraduate" | "graduate" | "language";
export type TopikLevel = "none" | "1" | "2" | "3plus";

export interface QuizAnswers {
  visaType: VisaType;
  d2Type?: "D-2-1" | "D-2-2" | "D-2-3" | "D-2-4"; // D-2 비자 종류
  d2GpaOk?: boolean; // D-2 직전 학기 성적 C(2.0) 이상 여부
  d22Grade?: "1-2" | "3-4" | "excess"; // D-2-2 학년
  d2KoreanAbilityLevel1?: "topik3" | "integration" | "sejong" | "none"; // D-2-1, D-2-2(1-2학년) 한국어 능력
  d2KoreanAbilityLevel2?: "topik4" | "integration" | "sejong" | "none"; // D-2-2(3-4학년), D-2-3, D-2-4 한국어 능력
  d21d22CertifiedOrExcellent?: boolean; // D-2-1, D-2-2(1-2학년) 인증대학 재학, 성적우수자, 한국어우수자 여부
  d22Grade34CertifiedOrExcellent?: boolean; // D-2-2(3-4학년) 인증대학 재학, 성적우수자, 한국어우수자 여부
  d23d24CertifiedOrExcellent?: boolean; // D-2-3/D-2-4 인증대학 재학, 성적우수자, 한국어우수자 여부
  d4SixMonths?: boolean; // D-4인 경우 6개월 경과 여부
  d41SixMonths?: boolean; // D-4-1인 경우 6개월 경과 여부
  d41KoreanAbility?: "topik2" | "integration" | "sejong" | "none"; // D-4-1 한국어 능력
  d41CertifiedOrExcellent?: boolean; // D-4-1 인증대학 또는 성적/한국어 우수자 여부
  courseType: CourseType;
  isCertifiedUniversity?: boolean; // 학부인 경우 인증대학 여부
  gpaOk: boolean; // GPA 2.0 이상 여부
  attendanceOk: boolean; // 출석률 양호 여부
  isVacation: boolean; // 방학 중 여부
  topikLevel: TopikLevel;
}

export interface PermitResult {
  status: "allowed" | "conditional" | "denied";
  maxHoursPerWeek: number | null;
  maxWorkplaces: number;
  denialReasons: string[];
  warnings: string[];
  allowedFields: MultiLangText[];
  restrictedFields: MultiLangText[];
  requiredDocuments: Document[];
  procedures: Procedure[];
  notes: MultiLangText[];
}

export interface MultiLangText {
  ko: string;
  en: string;
  zh: string;
  vi: string;
}

export interface Document {
  name: MultiLangText;
  description: MultiLangText;
  required: boolean;
  howToObtain: MultiLangText;
}

export interface Procedure {
  step: number;
  title: MultiLangText;
  description: MultiLangText;
}

export function calculatePermit(answers: QuizAnswers): PermitResult {
  const denialReasons: string[] = [];
  const warnings: string[] = [];

  // 1. 비자 종류 확인
  if (answers.visaType === "other") {
    return {
      status: "denied",
      maxHoursPerWeek: 0,
      maxWorkplaces: 0,
      denialReasons: ["시간제 취업허가는 D-2(유학) 또는 D-4(일반연수) 비자 소지자만 신청 가능합니다."],
      warnings: [],
      allowedFields: [],
      restrictedFields: [],
      requiredDocuments: [],
      procedures: [],
      notes: [],
    };
  }

  // 1-1. D-2-2 초과학기자 확인
  if (answers.visaType === "D-2" && answers.d2Type === "D-2-2" && (answers.d22Grade === "excess" || answers.d22Grade === "over")) {
    return {
      status: "denied",
      maxHoursPerWeek: 0,
      maxWorkplaces: 0,
      denialReasons: ["D-2-2 비자의 초과학기자(4학년 초과)는 시간제 취업허가가 불가능합니다."],
      warnings: [],
      allowedFields: [],
      restrictedFields: [],
      requiredDocuments: [],
      procedures: [],
      notes: [],
    };
  }

  // 2. D-4-1 비자의 경우 6개월 경과 여부 확인
  if (answers.visaType === "D-4-1" && answers.d41SixMonths === false) {
    return {
      status: "denied",
      maxHoursPerWeek: 0,
      maxWorkplaces: 0,
      denialReasons: [
        "D-4-1(어학연수) 비자는 자격 변경일 또는 입국일로부터 6개월이 경과해야 시간제 취업이 가능합니다.",
        "D-4-1 (Language Training) visa holders must wait 6 months from the date of status change or entry before applying for part-time work permission.",
        "D-4-1（语言培训）签证持有者必须从身份变更或入境之日起等待6个月才能申请兼职工作许可。",
        "Những người nắm giữ visa D-4-1 (Đào tạo ngôn ngữ) phải đợi 6 tháng kể từ ngày thay đổi trạng thái hoặc nhập cảnh trước khi có thể đăng ký xin phép làm việc bán thời gian."
      ],
      warnings: ["6개월 경과 후 다시 신청하세요."],
      allowedFields: [],
      restrictedFields: [],
      requiredDocuments: [],
      procedures: [],
      notes: [],
    };
  }

  // 2-1. D-4-1 비자의 한국어 능력 확인은 더 이상 필요 없음
  // 인증대학 재학, 성적우수자, 한국어 우수자 여부로만 판단

  // 3. 성적 및 출석 확인 (D-4-1 비자, D-2-3/D-2-4 비자는 제외)
  const isGraduateD2 = answers.visaType === "D-2" && (answers.d2Type === "D-2-3" || answers.d2Type === "D-2-4");
  if (answers.visaType !== "D-4-1" && !isGraduateD2) {
    if (!answers.gpaOk) {
      denialReasons.push("직전 학기 GPA가 2.0(C학점) 미만으로 취업허가가 불가합니다.");
    }
    if (!answers.attendanceOk) {
      denialReasons.push("출석률이 저조하여 취업허가가 제한됩니다. (90% 이상 출석 권장)");
    }
  }

  if (denialReasons.length > 0) {
    return {
      status: "denied",
      maxHoursPerWeek: 0,
      maxWorkplaces: 0,
      denialReasons,
      warnings,
      allowedFields: [],
      restrictedFields: [],
      requiredDocuments: [],
      procedures: [],
      notes: [],
    };
  }

  // 4. 방학 중인 경우 시간 제한 없음
  // 단, D-2-1, D-2-2에서 한국어 능력이 없는 경우는 주 10시간으로 제한
  // 또한 D-2-3/D-2-4에서 한국어 능력이 없고 인증대학/성적우수자인 경우는 주 15시간으로 제한
  if (answers.isVacation) {
    const isD21D22NoKorean = 
      answers.visaType === "D-2" && 
      (answers.d2Type === "D-2-1" || (answers.d2Type === "D-2-2" && answers.d22Grade === "1-2")) &&
      answers.d2KoreanAbilityLevel1 === "none";
    
    const isD22Grade34NoKorean = 
      answers.visaType === "D-2" && 
      answers.d2Type === "D-2-2" && 
      answers.d22Grade === "3-4" &&
      answers.d2KoreanAbilityLevel2 === "none";
    
    const isD23D24NoKorean =
      answers.visaType === "D-2" &&
      (answers.d2Type === "D-2-3" || answers.d2Type === "D-2-4") &&
      answers.d2KoreanAbilityLevel2 === "none";
    
    const isD23D24NoKoreanCertified =
      isD23D24NoKorean && answers.d23d24CertifiedOrExcellent === true;
    
    const isD23D24NoKoreanNotCertified =
      isD23D24NoKorean && answers.d23d24CertifiedOrExcellent !== true;
    
    // 한국어 능력이 없는 D-2-1, D-2-2는 방학 중에도 10시간 제한
    if (isD21D22NoKorean || isD22Grade34NoKorean || isD23D24NoKoreanNotCertified) {
      const maxWorkplaces = 2;
      return {
        status: "allowed",
        maxHoursPerWeek: 10, // 한국어 능력 없음: 주 10시간으로 제한
        maxWorkplaces,
        denialReasons: [],
        warnings: ["한국어 능력이 없어 방학 중에도 주당 10시간으로 제한됩니다. TOPIK 3급 이상 취득 시 시간이 늘어납니다."],
        allowedFields: getAllowedFields(answers.courseType),
        restrictedFields: getRestrictedFields(),
        requiredDocuments: getRequiredDocuments(answers),
        procedures: getProcedures(),
        notes: getNotes(answers),
      };
    }
    
    // D-2-3/D-2-4에서 한국어 능력 없음 + 인증대학/성적우수자는 방학 중에도 15시간 제한
    if (isD23D24NoKoreanCertified) {
      const maxWorkplaces = 2;
      return {
        status: "allowed",
        maxHoursPerWeek: 15, // 한국어 능력 없음 + 인증대학/성적우수: 주 15시간으로 제한
        maxWorkplaces,
        denialReasons: [],
        warnings: ["한국어 능력이 없어 방학 중에도 주당 15시간으로 제한됩니다. TOPIK 4급 이상 취득 시 시간이 늘어납니다."],
        allowedFields: getAllowedFields(answers.courseType),
        restrictedFields: getRestrictedFields(),
        requiredDocuments: getRequiredDocuments(answers),
        procedures: getProcedures(),
        notes: getNotes(answers),
      };
    }
    
    // 그 외의 경우 방학 중 무제한
    const maxWorkplaces = answers.visaType === "D-2" ? 2 : 1;
    return {
      status: "allowed",
      maxHoursPerWeek: null, // 제한 없음
      maxWorkplaces,
      denialReasons: [],
      warnings: ["방학 중에는 시간 제한 없이 취업 가능하나, 성적 및 출석 요건은 계속 충족해야 합니다."],
      allowedFields: getAllowedFields(answers.courseType),
      restrictedFields: getRestrictedFields(),
      requiredDocuments: getRequiredDocuments(answers),
      procedures: getProcedures(),
      notes: getNotes(answers),
    };
  }

  // 5. 학기 중 최대 근무 시간 계산
  let maxHours = 0;

  if (answers.visaType === "D-4-1") {
    // D-4-1 어학연수 비자
    // 한국어 능력이 없으면 10시간으로 제한
    if (answers.d41KoreanAbility === "none") {
      maxHours = 10; // 한국어 능력 없음: 주 10시간
    } else if (answers.d41CertifiedOrExcellent) {
      maxHours = 25; // 인증대학 재학, 성적우수자, 한국어우수자: 주 25시간
    } else {
      maxHours = 20; // 일반: 주 20시간
    }
  } else if (answers.visaType === "D-2") {
    // D-2 비자 (학부 및 대학원)
    if (answers.d2Type === "D-2-1" || (answers.d2Type === "D-2-2" && answers.d22Grade === "1-2")) {
      // D-2-1 또는 D-2-2(1-2학년): 한국어 능력에 따라 시간 결정
      const koreanAbility = answers.d2KoreanAbilityLevel1;
      if (koreanAbility === "none") {
        maxHours = 10; // 한국어 능력 없음: 주 10시간
      } else if (answers.d21d22CertifiedOrExcellent === true) {
        maxHours = 30; // 한국어 능력 있음 + 인증대학 재학, 성적우수자, 한국어우수자: 주 30시간
      } else {
        maxHours = 25; // 한국어 능력 있음 + 미해당: 주 25시간
      }
    } else if (answers.d2Type === "D-2-2" && answers.d22Grade === "3-4") {
      // D-2-2(3-4학년): 한국어 능력에 따라 시간 결정
      const koreanAbility = answers.d2KoreanAbilityLevel2;
      if (koreanAbility === "none") {
        maxHours = 10; // 한국어 능력 없음: 주 10시간
      } else if (answers.d22Grade34CertifiedOrExcellent === true) {
        maxHours = 30; // 인증대학 재학, 성적우수자, 한국어우수자: 주 30시간
      } else {
        maxHours = 25; // 일반: 주 25시간
      }
    } else if (answers.d2Type === "D-2-3" || answers.d2Type === "D-2-4") {
      // D-2-3/D-2-4: 한국어 능력에 따라 시간 결정
      const koreanAbility = answers.d2KoreanAbilityLevel2;
      if (koreanAbility === "none") {
        // 한국어 능력 없음
        if (answers.d23d24CertifiedOrExcellent) {
          maxHours = 15; // 한국어 능력 없음 + 인증대학/성적우수/한국어우수: 주 15시간
        } else {
          maxHours = 10; // 한국어 능력 없음 + 미해당: 주 10시간
        }
      } else if (answers.d23d24CertifiedOrExcellent) {
        maxHours = 35; // 한국어 능력 있음 + 인증대학 재학, 성적우수자, 한국어우수자: 주 35시간
      } else {
        maxHours = 30; // 한국어 능력 있음 + 일반: 주 30시간
      }
    }
  } else if (answers.courseType === "language") {
    // 어학연수생: 주 20시간
    maxHours = 20;
    // TOPIK 등급에 따른 조정 (어학연수생은 별도 규정)
  } else if (answers.courseType === "graduate") {
    // 다른 석·박사과정: 주 30시간
    maxHours = 30;
  } else {
    // 학부과정 (D-2 비자가 아닌 경우)
    if (answers.isCertifiedUniversity) {
      maxHours = 25; // 인증대학 학부: 주 25시간
    } else {
      maxHours = 20; // 일반대학 학부: 주 20시간
    }
  }

  // 6. TOPIK 등급에 따른 시간 조정 (학부/어학연수 대상, D-4-1, D-2 비자 제외)
  // D-2 비자는 한국어 능력 수준(d2KoreanAbilityLevel1/2)으로 이미 결정되므로 TOPIK 조정 제외
  const isD2Visa = answers.visaType === "D-2";
  if (answers.courseType !== "graduate" && answers.visaType !== "D-4-1" && !isD2Visa) {
    const topikAdjustment = getTopikAdjustment(answers.topikLevel, answers.isCertifiedUniversity);
    if (topikAdjustment !== null) {
      maxHours = Math.min(maxHours, topikAdjustment);
    }
  }

  const maxWorkplaces = answers.visaType === "D-2" ? 2 : 1;

  return {
    status: "allowed",
    maxHoursPerWeek: maxHours,
    maxWorkplaces,
    denialReasons: [],
    warnings: getWarnings(answers, maxHours),
    allowedFields: getAllowedFields(answers.courseType),
    restrictedFields: getRestrictedFields(),
    requiredDocuments: getRequiredDocuments(answers),
    procedures: getProcedures(),
    notes: getNotes(answers),
  };
}

function getTopikAdjustment(topikLevel: TopikLevel, isCertified?: boolean): number | null {
  const bonus = isCertified ? 5 : 0;
  switch (topikLevel) {
    case "3plus":
      return 25 + bonus; // 3급 이상: 주 25시간 (+인증대학 +5)
    case "2":
    case "1":
      return 10 + bonus; // 2급 이하: 주 10시간 (+인증대학 +5)
    case "none":
      return 10 + bonus; // TOPIK 없음: 주 10시간
    default:
      return null;
  }
}

function getWarnings(answers: QuizAnswers, maxHours: number): string[] {
  const warnings: string[] = [];
  if (answers.topikLevel === "none" || answers.topikLevel === "1" || answers.topikLevel === "2") {
    warnings.push("TOPIK 3급 이상 취득 시 주당 근무 가능 시간이 늘어납니다.");
  }
  if (answers.courseType === "undergraduate" && !answers.isCertifiedUniversity) {
    warnings.push("인증대학 재학 시 추가 5시간이 허용됩니다.");
  }
  return warnings;
}

function getAllowedFields(courseType: CourseType): MultiLangText[] {
  return [
    { ko: "편의점, 카페, 음식점 등 서비스업", en: "Service Industry (Convenience Stores, Cafes, Restaurants)", zh: "服务业（便利店、咖啡馆、餐厅等）", vi: "Ngành dịch vụ (Cửa hàng tiện lợi, Quán cà phê, Nhà hàng)" },
    { ko: "학원 보조 강사, 번역·통역", en: "Academy Tutoring, Translation, Interpretation", zh: "学院辅导、翻译、口译", vi: "Dạy kèm tại học viện, Dịch thuật, Phiên dịch" },
    { ko: "사무 보조, 데이터 입력", en: "Office Assistant, Data Entry", zh: "办公室助理、数据输入", vi: "Trợ lý văn phòng, Nhập dữ liệu" },
    { ko: "배달, 물류 보조 (단순 노무 제외)", en: "Delivery, Logistics Assistant (excluding simple labor)", zh: "配送、物流助理（不包括简单劳动）", vi: "Giao hàng, Trợ lý hậu cần (không bao gồm lao động đơn giản)" },
    { ko: "학업에 지장이 없는 단순 아르바이트", en: "Simple Part-time Work (not interfering with studies)", zh: "不影响学业的简单兼职工作", vi: "Công việc bán thời gian đơn giản (không ảnh hưởng đến học tập)" },
  ];
}

function getRestrictedFields(): MultiLangText[] {
  return [
    { ko: "건설업 (단순 노무)", en: "Construction (Simple Labor)", zh: "建筑业（简单劳动）", vi: "Xây dựng (Lao động đơn giản)" },
    { ko: "제조업·가공업 (단순 노무)", en: "Manufacturing, Processing (Simple Labor)", zh: "制造业、加工业（简单劳动）", vi: "Sản xuất, Chế biến (Lao động đơn giản)" },
    { ko: "유흥업소 관련 직종", en: "Entertainment Industry Related Jobs", zh: "娱乐业相关职位", vi: "Công việc liên quan đến ngành giải trí" },
    { ko: "학업에 지장을 주는 직종", en: "Jobs Interfering with Studies", zh: "影响学业的职位", vi: "Công việc ảnh hưởng đến học tập" },
  ];
}

export function getRequiredDocuments(answers: QuizAnswers): Document[] {
  const docs: Document[] = [
    {
      name: { ko: "여권", en: "Passport", zh: "护照", vi: "Hộ chiếu" },
      description: { ko: "유효한 여권 원본 및 사본", en: "Valid passport original and copy", zh: "有效护照原件及复印件", vi: "Bản gốc hộ chiếu hợp lệ và bản sao" },
      required: true,
      howToObtain: { ko: "대사관/영사관 또는 모국 여권 발급 기관에서 발급", en: "Issued by embassy/consulate or passport issuing authority of home country", zh: "由大使馆/领事馆或本国护照签发机构签发", vi: "Được cấp bởi đại sứ quán/领事馆 hoặc cơ quan cấp hộ chiếu của nước nhà" }
    },
    {
      name: { ko: "외국인등록증", en: "Alien Registration Card", zh: "外国人登记证", vi: "Thẻ đăng ký nước ngoài" },
      description: { ko: "외국인등록증 원본 및 사본", en: "Alien registration card original and copy", zh: "外国人登记证原件及复印件", vi: "Bản gốc và bản sao thẻ đăng ký nước ngoài" },
      required: true,
      howToObtain: { ko: "출입국관리사무소에서 발급 (입국 후 90일 이내 신청)", en: "Issued by Immigration Office (apply within 90 days of entry)", zh: "由出入国管理办公室签发（入境后90天内申请）", vi: "Được cấp bởi Văn phòng Quản lý Nhập cư (đăng ký trong vòng 90 ngày nhập cảnh)" }
    },
    {
      name: { ko: "통합신청서", en: "Integrated Application Form", zh: "综合申请表", vi: "Mẫu đơn xin cấp tích hợp" },
      description: { ko: "출입국관리사무소 또는 하이코리아 양식", en: "Immigration Office or HiKorea form", zh: "出入国管理办公室或HiKorea表格", vi: "Mẫu Văn phòng Quản lý Nhập cư hoặc HiKorea" },
      required: true,
      howToObtain: { ko: "하이코리아(www.hikorea.go.kr)에서 다운로드 또는 출입국관리사무소에서 제공", en: "Download from HiKorea (www.hikorea.go.kr) or obtain from Immigration Office", zh: "从HiKorea(www.hikorea.go.kr)下载或从出入国管理办公室获取", vi: "Tải xuống từ HiKorea (www.hikorea.go.kr) hoặc lấy từ Văn phòng Quản lý Nhập cư" }
    },
    {
      name: { ko: "시간제취업 확인서", en: "Part-time Employment Confirmation Letter", zh: "兼职工作确认书", vi: "Thư xác nhận việc làm bán thời gian" },
      description: { ko: "소속 대학교 국제교류팀/유학생 담당자 발급 및 서명", en: "Issued and signed by university international office/international student coordinator", zh: "由大学国际交流部门/国际学生协调员签发并签署", vi: "Được cấp và ký bởi phòng giao lưu quốc tế/nhân viên phối hợp sinh viên quốc tế của đại học" },
      required: true,
      howToObtain: { ko: "소속 대학교 국제교류팀 또는 유학생 담당자에게 신청", en: "Apply to university international office or international student coordinator", zh: "向大学国际交流部门或国际学生协调员申请", vi: "Đăng ký với phòng giao lưu quốc tế hoặc nhân viên phối hợp sinh viên quốc tế của đại học" }
    },
    {
      name: { ko: "표준근로계약서", en: "Standard Employment Contract", zh: "标准劳动合同", vi: "Hợp đồng lao động tiêu chuẩn" },
      description: { ko: "고용주와 체결한 표준근로계약서", en: "Standard employment contract signed with employer", zh: "与雇主签订的标准劳动合同", vi: "Hợp đồng lao động tiêu chuẩn được ký với người sử dụng lao động" },
      required: true,
      howToObtain: { ko: "고용주와 협의하여 작성 (고용노동부 양식 사용 권장)", en: "Prepare with employer (Ministry of Employment and Labor form recommended)", zh: "与雇主协商准备（建议使用雇用劳动部表格）", vi: "Chuẩn bị với người sử dụng lao động (khuyến cáo sử dụng mẫu Bộ Lao động và Việc làm)" }
    },
    {
      name: { ko: "성적증명서", en: "Academic Transcript", zh: "成绩单", vi: "Bảng điểm học tập" },
      description: { ko: "직전 학기 성적 증명서, 시간제 취업 허가를 위한 성적 기준 충족 확인", en: "Last semester academic transcript, verification of grade requirements for part-time employment permit", zh: "上学期成绩单，确认符合兼职就业许可的成绩要求", vi: "Bảng điểm học tập học kỳ trước, xác minh yêu cầu điểm cho phép việc làm bán thời gian" },
      required: true,
      howToObtain: { ko: "소속 대학교 학사관리팀 또는 온라인 포털에서 발급", en: "Issued by university registrar or online portal", zh: "由大学教务处或在线门户网站签发", vi: "Được cấp bởi phòng đăng ký đại học hoặc cổng thông tin trực tuyến" }
    },
    {
      name: { ko: "사업자등록증 사본", en: "Business Registration Certificate Copy", zh: "营业执照副本", vi: "Bản sao giấy chứng nhận đăng ký kinh doanh" },
      description: { ko: "근무 예정 업체의 사업자등록증 사본", en: "Copy of employer's business registration certificate", zh: "雇主营业执照副本", vi: "Bản sao giấy chứng nhận đăng ký kinh doanh của người sử dụng lao động" },
      required: true,
      howToObtain: { ko: "고용주에게 요청 (국세청 웹사이트에서 확인 가능)", en: "Request from employer (can be verified on National Tax Service website)", zh: "向雇主索取（可在国家税务局网站上验证）", vi: "Yêu cầu từ người sử dụng lao động (có thể xác minh trên trang web Cục Thuế Quốc gia)" }
    },
    {
      name: { ko: "외국인유학생시간제취업확인서", en: "International Student Part-time Employment Confirmation", zh: "外国留学生兼职就业确认书", vi: "Xác nhận việc làm bán thời gian của sinh viên quốc tế" },
      description: { ko: "출입국관리사무소에서 배포한 양식", en: "Form distributed by Immigration Office", zh: "出入国管理办公室发布的表格", vi: "Mẫu được phân phối bởi Cơ quan Quản lý Nhập cư" },
      required: true,
      howToObtain: { ko: "출입국관리사무소 또는 하이코리아에서 다운로드", en: "Download from Immigration Office or HiKorea", zh: "从出入国管理办公室或HiKorea下载", vi: "Tải xuống từ Cơ quan Quản lý Nhập cư hoặc HiKorea" }
    },
    {
      name: { ko: "출석 증명서", en: "Attendance Certificate", zh: "出勤证明", vi: "Chứng chỉ tham dự" },
      description: { ko: "FIMS에서 확인될 경우 제출 생략 가능", en: "Can be omitted if verified through FIMS", zh: "如果通过FIMS验证，可以省略提交", vi: "Có thể bỏ qua nếu được xác minh qua FIMS" },
      required: true,
      howToObtain: { ko: "소속 대학교에서 발급 또는 FIMS 시스템에서 자동 확인", en: "Issued by university or automatically verified through FIMS system", zh: "由大学签发或通过FIMS系统自动验证", vi: "Được cấp bởi đại học hoặc được xác minh tự động thông qua hệ thống FIMS" }
    },
    {
      name: { ko: "한국어능력 입증서류", en: "Korean Language Proficiency Certificate", zh: "韩语能力证明文件", vi: "Chứng chỉ năng lực tiếng Hàn" },
      description: { ko: "해당자에 한함 (TOPIK, 사회통합프로그램, 세종학당 등)", en: "For applicable cases only (TOPIK, Social Integration Program, Sejong Institute, etc.)", zh: "仅适用于相关情况（TOPIK、社会融合计划、世宗学堂等）", vi: "Chỉ áp dụng cho các trường hợp liên quan (TOPIK, Chương trình Hội nhập Xã hội, Viện Sejong, v.v.)" },
      required: true,
      howToObtain: { ko: "TOPIK 공식 홈페이지, 사회통합프로그램 운영기관, 세종학당에서 발급", en: "Issued by TOPIK official website, Social Integration Program operator, or Sejong Institute", zh: "由TOPIK官方网站、社会融合计划运营机构或世宗学堂签发", vi: "Được cấp bởi trang web chính thức TOPIK, nhà khai thác Chương trình Hội nhập Xã hội hoặc Viện Sejong" }
    },
    {
      name: { ko: "외국인유학생 시간제취업요건 준수확인서", en: "International Student Part-time Employment Compliance Confirmation", zh: "外国留学生兼职就业要求合规确认书", vi: "Xác nhận tuân thủ yêu cầu việc làm bán thời gian của sinh viên quốc tế" },
      description: { ko: "사업자등록증에 제조업, 건설업이 있는 경우 고용주가 작성", en: "To be completed by employer if business registration includes manufacturing or construction", zh: "如果营业执照包括制造业或建筑业，由雇主完成", vi: "Được hoàn thành bởi người sử dụng lao động nếu đăng ký kinh doanh bao gồm sản xuất hoặc xây dựng" },
      required: true,
      howToObtain: { ko: "출입국관리사무소에서 양식 제공, 해당자의 경우 고용주가 작성", en: "Form provided by Immigration Office, to be completed by employer if applicable", zh: "表格由出入国管理办公室提供，如适用，由雇主填写", vi: "Mẫu được cung cấp bởi Cơ quan Quản lý Nhập cư, được hoàn thành bởi người sử dụng lao động nếu có" }
    }
  ];

  if (answers.topikLevel !== "none") {
    docs.push({
      name: { ko: "한국어 능력 증빙서류", en: "Korean Language Proficiency Certificate", zh: "韩语能力证明文件", vi: "Chứng chỉ năng lực tiếng Hàn" },
      description: { ko: "TOPIK 성적증명서 (해당자)", en: "TOPIK score certificate (if applicable)", zh: "TOPIK成绩证书（如适用）", vi: "Chứng chỉ điểm TOPIK (nếu có)" },
      required: true,
      howToObtain: { ko: "한국어능력시험(TOPIK) 공식 홈페이지에서 성적증명서 신청", en: "Request score certificate from official TOPIK website", zh: "从TOPIK官方网站申请成绩证书", vi: "Yêu cầu chứng chỉ điểm từ trang web chính thức TOPIK" }
    });
  }

  return docs;
}

function getProcedures(): Procedure[] {
  return [
    {
      step: 1,
      title: { ko: "근로계약서 작성", en: "Prepare Employment Contract", zh: "准备就业合同", vi: "Chuẩn bị hợp đồng lao động" },
      description: { ko: "취업 예정 업체와 표준근로계약서를 작성합니다.", en: "Prepare standard employment contract with employer", zh: "与雇主准备标准就业合同", vi: "Chuẩn bị hợp đồng lao động tiêu chuẩn với người sử dụng lao động" },
    },
    {
      step: 2,
      title: { ko: "학교 담당자 확인", en: "Get School Approval", zh: "获得学校批准", vi: "Nhận phê duyệt từ trường" },
      description: { ko: "소속 대학교 국제교류팀 또는 유학생 담당자에게 시간제취업 확인서 서명을 받습니다.", en: "Get part-time employment confirmation from university international office", zh: "从大学国际交流办公室获得兼职就业确认", vi: "Nhận xác nhận việc làm bán thời gian từ phòng giao lưu quốc tế của trường" },
    },
    {
      step: 3,
      title: { ko: "시간제 취업 허가 신청", en: "Apply for Part-time Employment Permit", zh: "申请兼职就业许可", vi: "Nộp đơn xin phép làm việc bán thời gian" },
      description: { ko: "하이코리아(www.hikorea.go.kr) 온라인 신청 또는 관할 출입국관리사무소를 직접 방문하여 신청합니다.", en: "Apply online at www.hikorea.go.kr or visit immigration office", zh: "在www.hikorea.go.kr在线申请或访问出入境管理办公室", vi: "Nộp đơn trực tuyến tại www.hikorea.go.kr hoặc ghé thăm cơ quan quản lý nhập cảnh" },
    },
    {
      step: 4,
      title: { ko: "허가 대기", en: "Wait for Approval", zh: "等待批准", vi: "Chờ phê duyệt" },
      description: { ko: "출입국 관리 사무소 또는 하이코리아의 심사 및 허가를 기다립니다. 서류결과는 하이코리아의 경우 마이페이지 전자민원신청현황에서 확인 가능합니다.", en: "Wait for review and approval from Immigration Office or HiKorea. For HiKorea, you can check the results in your My Page application status.", zh: "等待出入国管理办公室或HiKorea的审查和批准。对于HiKorea，您可以在我的页面应用程序状态中检查结果。", vi: "Chờ xem xét và phê duyệt từ Cơ quan Quản lý Nhập cư hoặc HiKorea. Đối với HiKorea, bạn có thể kiểm tra kết quả trong trạng thái ứng dụng của trang My Page." },
    },
    {
      step: 5,
      title: { ko: "허가 후 근무 시작", en: "Start Work", zh: "开始工作", vi: "Bắt đầu làm việc" },
      description: { ko: "허가증 수령 후 근무를 시작합니다. 허가 없이 근무 시 불법 취업으로 처벌받습니다.", en: "Start work after receiving permit. Working without permit is illegal", zh: "收到许可证后开始工作。未经许可工作属违法行为", vi: "Bắt đầu làm việc sau khi nhận được giấy phép. Làm việc không có giấy phép là bất hợp pháp" },
    },
  ];
}

function getNotes(answers: QuizAnswers): MultiLangText[] {
  const notes: MultiLangText[] = [
    { ko: "사전 허가 없이 근무 시 범칙금, 취업 제한, 강제 출국 등의 불이익이 발생합니다.", en: "Working without prior permission may result in fines, employment restrictions, or forced deportation.", zh: "未经事先许可而工作可能导致罚款、就业限制或强制驱逐。", vi: "Làm việc mà không có sự cho phép trước có thể dẫn đến phạt tiền, hạn chế việc làm hoặc trục xuất bắt buộc." },
    { ko: "허가된 시간을 초과하여 근무하면 불법 취업으로 간주됩니다.", en: "Working beyond the permitted hours is considered illegal employment.", zh: "超过允许时间工作被视为非法就业。", vi: "Làm việc vượt quá giờ được phép được coi là việc làm trái phép." },
    { ko: "성적 및 출석 요건을 매 학기 유지해야 합니다.", en: "You must maintain grade and attendance requirements every semester.", zh: "您必须在每个学期保持成绩和出席要求。", vi: "Bạn phải duy trì yêu cầu điểm số và tham dự mỗi học kỳ." },
  ];
  if (answers.visaType === "D-2") {
    notes.push({ ko: "D-2 비자는 최대 2개 업체에서 근무 가능합니다.", en: "D-2 visa allows work at up to 2 companies.", zh: "D-2签证允许在最多2家公司工作。", vi: "Visa D-2 cho phép làm việc tại tối đa 2 công ty." });
  } else if (answers.visaType === "D-4-1") {
    notes.push({ ko: "D-4(어학연수) 비자는 1개 업체에서만 근무 가능합니다.", en: "D-4 (Language Training) visa allows work at only 1 company.", zh: "D-4（语言培训）签证仅允许在1家公司工作。", vi: "Visa D-4 (Đào tạo ngôn ngữ) chỉ cho phép làm việc tại 1 công ty." });
  }
  return notes;
}
