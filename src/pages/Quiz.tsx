import { useState } from 'react';

interface QuizProps {
  language: 'ko' | 'en';
  onBack: () => void;
}

export default function WorkHourCalculator({ language, onBack }: QuizProps) {
  const [lang, setLang] = useState(language); // 'ko' 또는 'en'
  const [step, setStep] = useState(1);
  const [visa, setVisa] = useState('');
  const [periodUnder6Months, setPeriodUnder6Months] = useState(null);
  const [gpaOverC, setGpaOverC] = useState(null);
  const [grade, setGrade] = useState('');
  const [hasLanguage, setHasLanguage] = useState(null);
  const [hasSpecialCondition, setHasSpecialCondition] = useState(null);
  const [workPeriod, setWorkPeriod] = useState('');

  const resetCalc = () => {
    setStep(1); setVisa(''); setPeriodUnder6Months(null); setGpaOverC(null);
    setGrade(''); setHasLanguage(null); setHasSpecialCondition(null); setWorkPeriod('');
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // 다국어 텍스트 사전
  const t = {
    ko: {
      title: "📋 시간제 취업 허가 결과",
      resultPre: "예상 가능 근로시간:",
      unlimited: "주당 무제한 근로 가능",
      unlimitedNotice: "💡 출입국사무소에서 허가받은 시간제 취업허가서의 근로계약 기간 내에 포함된 주말, 방학기간 동안 시간제한 없이 일을 할 수 있다는 의미입니다.",
      btnReset: "다시 계산하기",
      btnHome: "처음으로",
      btnBack: "이전 단계로",
      invalidTitle: "❌ 시간제 취업 불가",
      footer1: "⚠️ 해당 테스트는 서울외국인주민센터(Seoul Foreign Resident Center)에서 배포한 자료를 바탕으로 구성되었습니다. 각 개인의 상황과 일치하지 않을 수 있으니 참고용으로만 사용하시기를 권장합니다.",
      footer2: "⚠️ 유학생의 국내 근로를 위해서는 일정 성적 기준 이상을 충족하는 것이 필수적입니다. 대부분의 학교가 직전 학기 평균 성적 C학점(2.0) 이상을 요구하지만 학교마다 기준이 상이할 수 있으니 직접 확인하시길 권장합니다.",
      qVisa: "Q1. 본인의 비자 종류를 선택해 주세요.",
      qD41Period: "Q2. 비자 변경 혹은 취득 후 입국시기로부터 기간이 얼마나 경과했습니까?",
      d41Fail: "해당 비자 소지자의 시간제 취업을 위해서는 한국 입국일(또는 자격 변경일)로부터 반드시 6개월이 경과해야 합니다.",
      qGpa: "Q2. 신청일 기준 직전 학기 평균 성적이 C학점 (2.0)을 넘습니까?",
      gpaFail: "신청일 기준 직전 학기 평균 성적이 C학점(2.0) 이상이어야 합니다. 성적이 기준에 미달하거나 출석률이 저조할 경우 아르바이트가 허용되지 않습니다.",
      qGrade: "Q3. 현재 학년을 선택해 주세요.",
      gradeFail: "학부생 초과학기자의 경우 원칙적으로 시간제 취업이 엄격히 제한되거나 불가할 수 있으므로, 반드시 학교 국제처의 승인을 먼저 거쳐야 합니다.",
      qLang: "Q. 본인의 한국어 능력 자격 기준을 선택해 주세요.",
      qSpecial: "Q. 다음 특수조건 중 하나라도 충족하십니까? (법무부 인증대학 재학, 성적 우수자, 한국어 우수자)",
      qPeriod: "Q. 근로를 하고자 하는 시기를 선택해 주세요.",
      optYes: "1. 예 (넘는다 / 충족함)",
      optNo: "2. 아니오 (넘지 않는다 / 해당 없음)",
      optLangNone: "4. 해당없음",
      periodVacation: "1. 방학, 주말",
      periodSemester: "2. 학기 중의 주중"
    },
    en: {
      title: "📋 Part-time Work Permit Result",
      resultPre: "Estimated Allowed Work Hours:",
      unlimited: "Unlimited work hours allowed per week",
      unlimitedNotice: "💡 This means you can work without time restrictions during weekends and vacations included in the duration of the part-time work permit authorized by the Immigration Office.",
      btnReset: "Calculate Again",
      btnHome: "Go to Home",
      btnBack: "Back to Previous Step",
      invalidTitle: "❌ Part-time Work Not Allowed",
      footer1: "⚠️ This test is based on materials distributed by the Seoul Foreign Resident Center. It may not match every individual's specific situation, so please use it for reference only.",
      footer2: "⚠️ It is essential for international students to meet certain academic standards to work in Korea. Most schools require a GPA of C (2.0) or higher in the previous semester, but standards vary by school, so it is recommended to check directly.",
      qVisa: "Q1. Please select your visa type.",
      qD41Period: "Q2. How much time has passed since your entry or visa acquisition date?",
      d41Fail: "For holders of this visa, at least 6 months must have passed from the date of entry into Korea (or date of qualification change) to be eligible for part-time employment.",
      qGpa: "Q2. Is your GPA for the semester immediately preceding the application date over C (2.0)?",
      gpaFail: "Your GPA for the semester immediately preceding the application date must be C (2.0) or higher. Part-time work will not be permitted if grades fall below the standard or if attendance is low.",
      qGrade: "Q3. Please select your current academic year.",
      gradeFail: "In principle, part-time work for undergraduate students in extra semesters is strictly restricted or unavailable, so you must obtain approval from your school's international office first.",
      qLang: "Q. Please select your Korean language proficiency level.",
      qSpecial: "Q. Do you meet at least one of the following special conditions? (Enrolled in a Ministry of Justice certified university, Academic excellence, Excellence in Korean)",
      qPeriod: "Q. Please select the period you intend to work.",
      optYes: "1. Yes (Over / Meet condition)",
      optNo: "2. No (Not over / Do not meet)",
      optLangNone: "4. None / Not Applicable",
      periodVacation: "1. Vacation, Weekends",
      periodSemester: "2. Weekdays during the semester"
    }
  };

  const commonFooter = (
    <div style={{ marginTop: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px', fontSize: '13px', color: '#666', lineHeight: '1.6' }}>
      <p>{t[lang].footer1}</p>
      <p style={{ marginTop: '10px' }}>{t[lang].footer2}</p>
    </div>
  );

  const renderResult = () => {
    let hoursText = "";
    let isUnlimited = false;

    if (visa === 'D-4-1') {
      if (!hasLanguage) hoursText = lang === 'ko' ? "주당 10시간" : "10 hours per week";
      else if (hasSpecialCondition) hoursText = lang === 'ko' ? "주당 25시간" : "25 hours per week";
      else hoursText = lang === 'ko' ? "주당 20시간" : "20 hours per week";
    } else if (visa === 'D-2-1' || visa === 'D-2-2') {
      if (!hasLanguage) hoursText = lang === 'ko' ? "주당 10시간" : "10 hours per week";
      else if (workPeriod === 'vacation') isUnlimited = true;
      else if (hasSpecialCondition) hoursText = lang === 'ko' ? "주당 30시간" : "30 hours per week";
      else hoursText = lang === 'ko' ? "주당 25시간" : "25 hours per week";
    } else if (visa === 'D-2-3' || visa === 'D-2-4') {
      if (!hasLanguage) {
        hoursText = hasSpecialCondition 
          ? (lang === 'ko' ? "주당 15시간" : "15 hours per week") 
          : (lang === 'ko' ? "주당 10시간" : "10 hours per week");
      } else if (workPeriod === 'vacation') isUnlimited = true;
      else if (hasSpecialCondition) hoursText = lang === 'ko' ? "주당 35시간" : "35 hours per week";
      else hoursText = lang === 'ko' ? "주당 30시간" : "30 hours per week";
    }

    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2 style={{ color: '#0070f3', marginBottom: '20px' }}>{t[lang].title}</h2>
        <div style={{ background: '#eef5ff', padding: '25px', borderRadius: '12px', fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>
          {t[lang].resultPre} <span style={{ color: '#ff4d4f' }}>{isUnlimited ? t[lang].unlimited : hoursText}</span>
        </div>
        {isUnlimited && (
          <p style={{ color: '#ff4d4f', fontSize: '14px', fontWeight: 'bold', backgroundColor: '#fff1f0', padding: '10px', borderRadius: '6px', textAlign: 'left', lineHeight: '1.5' }}>
            {t[lang].unlimitedNotice}
          </p>
        )}
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          <button onClick={resetCalc} style={{ flex: 1, padding: '10px 20px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>{t[lang].btnReset}</button>
          <button onClick={onBack} style={{ flex: 1, padding: '10px 20px', background: '#666', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>{t[lang].btnHome}</button>
        </div>
        {commonFooter}
      </div>
    );
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', border: '1px solid #eee', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', backgroundColor: '#fff', overflow: 'hidden' }}>
      {/* 상단 언어 토글 바 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa', padding: '10px 20px', borderBottom: '1px solid #eee' }}>
        <button onClick={onBack} style={{ padding: '4px 10px', background: '#fff', color: '#333', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>← {lang === 'ko' ? '돌아가기' : 'Back'}</button>
        <div>
          <button onClick={() => setLang('ko')} style={{ padding: '4px 10px', marginRight: '5px', background: lang === 'ko' ? '#0070f3' : '#fff', color: lang === 'ko' ? '#fff' : '#333', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>KO</button>
          <button onClick={() => setLang('en')} style={{ padding: '4px 10px', background: lang === 'en' ? '#0070f3' : '#fff', color: lang === 'en' ? '#fff' : '#333', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>EN</button>
        </div>
      </div>

      {/* 1단계: 비자 선택 */}
      {step === 1 && (
        <div style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', color: '#333', marginBottom: '15px' }}>{t[lang].qVisa}</h3>
          {['D-4-1 (어학연수 / General Trainee)', 'D-2-1 (전문학사 / Associate Degree)', 'D-2-2 (학사 / Bachelor\'s)', 'D-2-3 (석사 / Master\'s)', 'D-2-4 (박사 / Doctoral)'].map((v, idx) => {
            const code = ['D-4-1', 'D-2-1', 'D-2-2', 'D-2-3', 'D-2-4'][idx];
            return (
              <button key={code} onClick={() => { setVisa(code); setStep(code === 'D-4-1' ? 2 : 3); }} style={{ display: 'block', width: '100%', padding: '14px', margin: '10px 0', textAlign: 'left', background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', transition: 'background 0.2s' }}>{lang === 'ko' ? v.split(' / ')[0] : v.split(' / ')[1] || v}</button>
            );
          })}
        </div>
      )}

      {/* D-4-1 전용 2단계 */}
      {step === 2 && (
        <div style={{ padding: '20px' }}>
          <h3>{t[lang].qD41Period}</h3>
          <button onClick={() => setPeriodUnder6Months(true)} style={{ display: 'block', width: '100%', padding: '14px', margin: '10px 0', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'left' }}>{lang === 'ko' ? "1. 6개월 미만 경과" : "1. Less than 6 months"}</button>
          <button onClick={() => { setPeriodUnder6Months(false); setStep(4); }} style={{ display: 'block', width: '100%', padding: '14px', margin: '10px 0', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'left' }}>{lang === 'ko' ? "2. 6개월 이상 경과" : "2. 6 months or more"}</button>
          <button onClick={goBack} style={{ display: 'block', width: '100%', padding: '10px', margin: '15px 0 0 0', background: '#f0f0f0', color: '#333', border: '1px solid #ddd', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>{t[lang].btnBack}</button>
          
          {periodUnder6Months && (
            <div style={{ marginTop: '20px', padding: '20px', border: '2px solid #ff4d4f', borderRadius: '10px', backgroundColor: '#fff1f0' }}>
              <h3 style={{ color: '#ff4d4f', marginTop: 0 }}>{t[lang].invalidTitle}</h3>
              <p style={{ fontWeight: 'bold', lineHeight: '1.6', fontSize: '14px' }}>"{t[lang].d41Fail}"</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button onClick={resetCalc} style={{ flex: 1, padding: '8px 15px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>{t[lang].btnReset}</button>
                <button onClick={onBack} style={{ flex: 1, padding: '8px 15px', background: '#666', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>{t[lang].btnHome}</button>
              </div>
              {commonFooter}
            </div>
          )}
        </div>
      )}

      {/* D-2 계열 전용 3단계: 성적 확인 */}
      {step === 3 && (
        <div style={{ padding: '20px' }}>
          <h3>{t[lang].qGpa}</h3>
          <button onClick={() => { setGpaOverC(true); setStep(visa === 'D-2-2' ? 3.5 : 4); }} style={{ display: 'block', width: '100%', padding: '14px', margin: '10px 0', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'left' }}>{t[lang].optYes}</button>
          <button onClick={() => setGpaOverC(false)} style={{ display: 'block', width: '100%', padding: '14px', margin: '10px 0', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'left' }}>{t[lang].optNo}</button>
          <button onClick={goBack} style={{ display: 'block', width: '100%', padding: '10px', margin: '15px 0 0 0', background: '#f0f0f0', color: '#333', border: '1px solid #ddd', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>{t[lang].btnBack}</button>

          {gpaOverC === false && (
            <div style={{ marginTop: '20px', padding: '20px', border: '2px solid #ff4d4f', borderRadius: '10px', backgroundColor: '#fff1f0' }}>
              <h3 style={{ color: '#ff4d4f', marginTop: 0 }}>{t[lang].invalidTitle}</h3>
              <p style={{ fontWeight: 'bold', lineHeight: '1.6', fontSize: '14px' }}>"{t[lang].gpaFail}"</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button onClick={resetCalc} style={{ flex: 1, padding: '8px 15px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>{t[lang].btnReset}</button>
                <button onClick={onBack} style={{ flex: 1, padding: '8px 15px', background: '#666', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>{t[lang].btnHome}</button>
              </div>
              {commonFooter}
            </div>
          )}
        </div>
      )}

      {/* D-2-2 학사 전용 학년 선택 (3.5단계) */}
      {step === 3.5 && (
        <div style={{ padding: '20px' }}>
          <h3>{t[lang].qGrade}</h3>
          <button onClick={() => { setGrade('1-2'); setStep(4); }} style={{ display: 'block', width: '100%', padding: '14px', margin: '10px 0', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'left' }}>{lang === 'ko' ? "1. 1-2학년" : "1. Freshman / Sophomore (1st-2nd Year)"}</button>
          <button onClick={() => { setGrade('3-4'); setStep(4); }} style={{ display: 'block', width: '100%', padding: '14px', margin: '10px 0', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'left' }}>{lang === 'ko' ? "2. 3-4학년" : "2. Junior / Senior (3rd-4th Year)"}</button>
          <button onClick={() => setGrade('over')} style={{ display: 'block', width: '100%', padding: '14px', margin: '10px 0', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'left' }}>{lang === 'ko' ? "3. 초과학기자" : "3. Extra Semester Student"}</button>
          <button onClick={goBack} style={{ display: 'block', width: '100%', padding: '10px', margin: '15px 0 0 0', background: '#f0f0f0', color: '#333', border: '1px solid #ddd', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>{t[lang].btnBack}</button>

          {grade === 'over' && (
            <div style={{ marginTop: '20px', padding: '20px', border: '2px solid #ff4d4f', borderRadius: '10px', backgroundColor: '#fff1f0' }}>
              <h3 style={{ color: '#ff4d4f', marginTop: 0 }}>{t[lang].invalidTitle}</h3>
              <p style={{ fontWeight: 'bold', lineHeight: '1.6', fontSize: '14px' }}>"{t[lang].gradeFail}"</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button onClick={resetCalc} style={{ flex: 1, padding: '8px 15px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>{t[lang].btnReset}</button>
                <button onClick={onBack} style={{ flex: 1, padding: '8px 15px', background: '#666', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>{t[lang].btnHome}</button>
              </div>
              {commonFooter}
            </div>
          )}
        </div>
      )}

      {/* 4단계: 한국어 자격 요건 */}
      {step === 4 && (
        <div style={{ padding: '20px' }}>
          <h3>{t[lang].qLang}</h3>
          {(visa === 'D-4-1' 
            ? ["TOPIK Level 2", "KIIP Stage 2 / Pre-test 41+ points", "King Sejong Institute Beginner 2"]
            : (visa === 'D-2-1' || (visa === 'D-2-2' && grade === '1-2'))
            ? ["TOPIK Level 3", "KIIP Stage 3 / Pre-test 61+ points", "King Sejong Institute Intermediate 1"]
            : ["TOPIK Level 4", "KIIP Stage 4 / Pre-test 81+ points", "King Sejong Institute Intermediate 2"]
          ).map((opt, idx) => (
            <button key={idx} onClick={() => { setHasLanguage(true); setStep(5); }} style={{ display: 'block', width: '100%', padding: '14px', margin: '10px 0', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'left', fontSize: '14px' }}>
              {idx + 1}. {lang === 'ko' ? (visa==='D-4-1' ? ["TOPIK 2급", "사회통합프로그램 2단계 이상 이수 또는 사전평가 41점 이상", "세종학당 초급 2이상 이수"][idx] : (visa==='D-2-1' || grade==='1-2') ? ["TOPIK 3급", "사회통합프로그램 3단계 이상 이수 또는 사전평가 61점 이상", "세종학당 중급 1이상 이수"][idx] : ["TOPIK 4급", "사회통합프로그램 4단계 이상 이수 또는 사전평가 81점 이상", "세종학당 중급 2이상 이수"][idx]) : opt}
            </button>
          ))}
          <button onClick={() => { setHasLanguage(false); setStep(5); }} style={{ display: 'block', width: '100%', padding: '14px', margin: '10px 0', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'left' }}>{t[lang].optLangNone}</button>
          <button onClick={goBack} style={{ display: 'block', width: '100%', padding: '10px', margin: '15px 0 0 0', background: '#f0f0f0', color: '#333', border: '1px solid #ddd', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>{t[lang].btnBack}</button>
        </div>
      )}

      {/* 5단계: 특수 조건 */}
      {step === 5 && (
        <div style={{ padding: '20px' }}>
          <h3>{t[lang].qSpecial}</h3>
          <button onClick={() => { setHasSpecialCondition(true); setStep(6); }} style={{ display: 'block', width: '100%', padding: '14px', margin: '10px 0', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'left' }}>{t[lang].optYes}</button>
          <button onClick={() => { setHasSpecialCondition(false); setStep(6); }} style={{ display: 'block', width: '100%', padding: '14px', margin: '10px 0', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'left' }}>{t[lang].optNo}</button>
          <button onClick={goBack} style={{ display: 'block', width: '100%', padding: '10px', margin: '15px 0 0 0', background: '#f0f0f0', color: '#333', border: '1px solid #ddd', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>{t[lang].btnBack}</button>
        </div>
      )}

      {/* 6단계: 근로 시기 */}
      {step === 6 && (
        <div style={{ padding: '20px' }}>
          <h3>{t[lang].qPeriod}</h3>
          <button onClick={() => { setWorkPeriod('vacation'); setStep(7); }} style={{ display: 'block', width: '100%', padding: '14px', margin: '10px 0', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'left' }}>{t[lang].periodVacation}</button>
          <button onClick={() => { setWorkPeriod('semester'); setStep(7); }} style={{ display: 'block', width: '100%', padding: '14px', margin: '10px 0', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'left' }}>{t[lang].periodSemester}</button>
          <button onClick={goBack} style={{ display: 'block', width: '100%', padding: '10px', margin: '15px 0 0 0', background: '#f0f0f0', color: '#333', border: '1px solid #ddd', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>{t[lang].btnBack}</button>
        </div>
      )}

      {/* 7단계: 결과 출력 */}
      {step === 7 && renderResult()}
    </div>
  );
}
