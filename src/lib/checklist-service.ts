/**
 * 서류 체크리스트 상태 인터페이스
 */
export interface DocumentChecklist {
  documentId: string;
  checked: boolean;
  checkedAt?: number; // 체크한 시간 (timestamp)
}

export interface ChecklistState {
  [documentId: string]: boolean;
}

const CHECKLIST_STORAGE_KEY = "document_checklist";

/**
 * 체크리스트 상태 저장
 */
export async function saveChecklistState(
  checklist: ChecklistState
): Promise<void> {
  try {
    localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(checklist));
  } catch (error) {
    console.error("체크리스트 저장 실패:", error);
    throw error;
  }
}

/**
 * 체크리스트 상태 로드
 */
export async function loadChecklistState(): Promise<ChecklistState> {
  try {
    const stored = localStorage.getItem(CHECKLIST_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return {};
  } catch (error) {
    console.error("체크리스트 로드 실패:", error);
    return {};
  }
}

/**
 * 특정 문서의 체크 상태 업데이트
 */
export async function updateDocumentCheck(
  documentId: string,
  checked: boolean
): Promise<ChecklistState> {
  try {
    const current = await loadChecklistState();
    const updated = { ...current, [documentId]: checked };
    await saveChecklistState(updated);
    return updated;
  } catch (error) {
    console.error("문서 체크 상태 업데이트 실패:", error);
    throw error;
  }
}

/**
 * 체크리스트 초기화
 */
export async function clearChecklist(): Promise<void> {
  try {
    localStorage.removeItem(CHECKLIST_STORAGE_KEY);
  } catch (error) {
    console.error("체크리스트 초기화 실패:", error);
    throw error;
  }
}

/**
 * 체크된 항목의 개수 계산
 */
export function getCheckedCount(checklist: ChecklistState): number {
  return Object.values(checklist).filter((checked) => checked).length;
}

/**
 * 전체 항목 개수 계산
 */
export function getTotalCount(checklist: ChecklistState): number {
  return Object.keys(checklist).length;
}

/**
 * 체크리스트 완료 여부 확인
 */
export function isChecklistComplete(checklist: ChecklistState): boolean {
  if (getTotalCount(checklist) === 0) return false;
  return getCheckedCount(checklist) === getTotalCount(checklist);
}

/**
 * 체크리스트 진행률 계산 (0-100)
 */
export function getChecklistProgress(checklist: ChecklistState): number {
  const total = getTotalCount(checklist);
  if (total === 0) return 0;
  return Math.round((getCheckedCount(checklist) / total) * 100);
}
