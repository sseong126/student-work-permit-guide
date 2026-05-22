import type { PermitResult } from "./permit-logic";

/**
 * 저장된 결과 아이템 (타임스탬프 포함)
 */
export interface SavedResult {
  id: string; // 고유 ID (timestamp 기반)
  result: PermitResult;
  savedAt: number; // 저장 시간 (timestamp)
  title?: string; // 사용자 정의 제목 (선택사항)
}

const RESULT_HISTORY_STORAGE_KEY = "result_history";
const MAX_SAVED_RESULTS = 10; // 최대 저장 개수

/**
 * 결과 저장
 */
export async function saveResult(result: PermitResult, title?: string): Promise<SavedResult> {
  try {
    const id = `result_${Date.now()}`;
    const savedResult: SavedResult = {
      id,
      result,
      savedAt: Date.now(),
      title: title || generateDefaultTitle(result),
    };

    const history = await loadResultHistory();
    const updated = [savedResult, ...history].slice(0, MAX_SAVED_RESULTS);
    localStorage.setItem(RESULT_HISTORY_STORAGE_KEY, JSON.stringify(updated));

    return savedResult;
  } catch (error) {
    console.error("결과 저장 실패:", error);
    throw error;
  }
}

/**
 * 결과 히스토리 로드
 */
export async function loadResultHistory(): Promise<SavedResult[]> {
  try {
    const stored = localStorage.getItem(RESULT_HISTORY_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  } catch (error) {
    console.error("결과 히스토리 로드 실패:", error);
    return [];
  }
}

/**
 * 특정 결과 조회
 */
export async function getResultById(id: string): Promise<SavedResult | null> {
  try {
    const history = await loadResultHistory();
    return history.find((r) => r.id === id) || null;
  } catch (error) {
    console.error("결과 조회 실패:", error);
    return null;
  }
}

/**
 * 가장 최근 결과 조회
 */
export async function getLatestResult(): Promise<SavedResult | null> {
  try {
    const history = await loadResultHistory();
    return history.length > 0 ? history[0] : null;
  } catch (error) {
    console.error("최근 결과 조회 실패:", error);
    return null;
  }
}

/**
 * 결과 삭제
 */
export async function deleteResult(id: string): Promise<void> {
  try {
    const history = await loadResultHistory();
    const updated = history.filter((r) => r.id !== id);
    localStorage.setItem(RESULT_HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("결과 삭제 실패:", error);
    throw error;
  }
}

/**
 * 모든 결과 삭제
 */
export async function clearResultHistory(): Promise<void> {
  try {
    localStorage.removeItem(RESULT_HISTORY_STORAGE_KEY);
  } catch (error) {
    console.error("결과 히스토리 초기화 실패:", error);
    throw error;
  }
}

/**
 * 기본 제목 생성
 */
function generateDefaultTitle(result: PermitResult): string {
  const statusText =
    result.status === "allowed"
      ? "취업 가능"
      : result.status === "conditional"
        ? "조건부 가능"
        : "취업 불가";
  const date = new Date().toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
  });
  return `${statusText} - ${date}`;
}

/**
 * 결과 저장 여부 확인
 */
export async function hasResultHistory(): Promise<boolean> {
  try {
    const history = await loadResultHistory();
    return history.length > 0;
  } catch {
    return false;
  }
}

/**
 * 저장된 결과 개수
 */
export async function getResultCount(): Promise<number> {
  try {
    const history = await loadResultHistory();
    return history.length;
  } catch {
    return 0;
  }
}

/**
 * 결과를 URL 파라미터로 인코딩 (라우팅용)
 */
export function encodeResultForNavigation(result: PermitResult): string {
  return encodeURIComponent(JSON.stringify(result));
}

/**
 * URL 파라미터에서 결과 디코딩
 */
export function decodeResultFromNavigation(encoded: string): PermitResult | null {
  try {
    return JSON.parse(decodeURIComponent(encoded)) as PermitResult;
  } catch {
    return null;
  }
}
