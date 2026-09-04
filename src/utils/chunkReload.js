// 배포 후 청크 로드 실패 자동 복구
//
// 새 버전을 배포하면 JS 청크 파일명의 해시가 바뀐다. 브라우저에 남아 있던
// 옛 페이지가 사라진 옛 청크를 불러오려 하면 다음과 같은 오류가 난다.
//
//   TypeError: Failed to fetch dynamically imported module: .../assets/HomePage-XXXX.js
//
// 실패 경로가 두 갈래라 양쪽 모두에서 이 모듈을 쓴다.
//   1) Vite 프리로드 단계 실패 → window 의 vite:preloadError 이벤트 (main.jsx)
//   2) React.lazy 가 import() 를 실행하다 실패 → ErrorBoundary (App.jsx)
//
// 2번은 이벤트가 뜨지 않아 예전에는 사용자에게 오류 화면이 그대로 노출됐다.

const RELOAD_KEY = 'vitePreloadReload';
const THROTTLE_MS = 8000;

// 브라우저·번들러마다 문구가 달라 대표적인 형태를 모두 본다.
const CHUNK_ERROR_PATTERN =
  /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|dynamically imported module/i;

/** 청크 로드 실패로 볼 수 있는 오류인지 판단한다. */
export function isChunkLoadError(error) {
  if (!error) return false;
  const text = `${error.message || ''} ${error.name || ''}`;
  return CHUNK_ERROR_PATTERN.test(text);
}

/**
 * 새 index.html 과 새 청크를 받도록 페이지를 다시 불러온다.
 *
 * 새로고침해도 같은 오류가 계속되면(서버 배포가 덜 끝났거나 네트워크가 끊긴 경우)
 * 무한 새로고침이 되므로, THROTTLE_MS 안에는 한 번만 시도한다.
 * 두 번째부터는 false 를 돌려주어 호출측이 오류 화면을 보여줄 수 있게 한다.
 *
 * @returns {boolean} 새로고침을 실제로 시작했으면 true
 */
export function reloadForNewChunks() {
  let last = 0;
  try {
    last = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
  } catch {
    // 시크릿 모드 등에서 sessionStorage 접근이 막히면 그냥 한 번 새로고침한다
  }

  if (Date.now() - last <= THROTTLE_MS) return false;

  try {
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    // 저장 실패는 무시 — 새로고침 자체는 진행한다
  }
  window.location.reload();
  return true;
}
