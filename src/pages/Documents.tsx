import { useState, useEffect } from 'react';
import { loadChecklistState, updateDocumentCheck, ChecklistState } from '../lib/checklist-service';
import { getRequiredDocuments } from '../lib/permit-logic';
import './Documents.css';

interface DocumentsProps {
  language: 'ko' | 'en';
  onBack: () => void;
}

export default function Documents({ language, onBack }: DocumentsProps) {
  const [checklist, setChecklist] = useState<ChecklistState>({});
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const state = await loadChecklistState();
      setChecklist(state || {});

      // 모든 필요 서류 가져오기 (일반적인 경우)
      const allDocs = getRequiredDocuments({
        visaType: 'D-2',
        courseType: 'undergraduate',
        d2KoreanAbilityLevel1: 'topik3',
        d21d22CertifiedOrExcellent: true,
        gpaOk: true,
        attendanceOk: true,
        isVacation: false,
        topikLevel: '3plus',
      });
      setDocuments(allDocs);
    };
    loadData();
  }, []);

  const handleDocumentCheck = async (index: number) => {
    const current = checklist[String(index)] || false;
    const updated = await updateDocumentCheck(String(index), !current);
    setChecklist(updated || {});
  };

  const checkedCount = Object.values(checklist).filter(Boolean).length;

  return (
    <div className="documents-container">
      {/* 헤더 */}
      <div className="documents-header">
        <button className="back-button" onClick={onBack}>
          ←
        </button>
        <h1>{language === 'ko' ? '필요 서류' : 'Required Documents'}</h1>
        <div style={{ width: '24px' }} />
      </div>

      {/* 진행 상황 */}
      <div className="progress-card">
        <div className="progress-text">
          {language === 'ko' ? `준비 완료: ${checkedCount}/${documents.length}` : `Completed: ${checkedCount}/${documents.length}`}
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${documents.length > 0 ? (checkedCount / documents.length) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      {/* 서류 목록 */}
      <div className="documents-section">
        <div className="document-list">
          {documents.map((doc, idx) => {
            const isChecked = checklist[String(idx)] || false;
            return (
              <div
                key={idx}
                className={`document-item ${isChecked ? 'checked' : ''}`}
                onClick={() => handleDocumentCheck(idx)}
              >
                <div className="checkbox">
                  <input type="checkbox" checked={isChecked} readOnly />
                </div>
                <div className="document-content">
                  <div className={`document-name ${isChecked ? 'strikethrough' : ''}`}>
                    {typeof doc.name === 'string' ? doc.name : doc.name[language] || doc.name.en}
                  </div>
                  <div className={`document-desc ${isChecked ? 'strikethrough' : ''}`}>
                    {typeof doc.description === 'string' ? doc.description : doc.description[language] || doc.description.en}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 안내 문구 */}
      <div className="note-text">
        ⚠️{' '}
        {language === 'ko'
          ? '각 서류의 구체적인 요구사항은 소속 대학교 국제교류팀, 출입국관리사무소 또는 하이코리아에 문의하세요.'
          : 'For specific requirements of each document, please contact your university\'s international office, the Immigration Office, or HiKorea.'}
      </div>
    </div>
  );
}
