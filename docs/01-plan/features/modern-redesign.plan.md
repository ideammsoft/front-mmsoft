# Plan: modern-redesign

## 1. Overview
- **Feature Name**: modern-redesign (전체 페이지 모던 리디자인)
- **Created**: 2026-02-15
- **Level**: Dynamic
- **Status**: In Progress
- **Style**: Modern Corporate (2025-2026 Trend)

## 2. Background & Problem

### 현재 상태 (AS-IS)
- 2000년대 초반 한국형 비즈니스 사이트 스타일
- 기본적인 CSS 변수만 적용된 상태
- 인라인 스타일이 많은 페이지 (CompanyPage, ProjectsPage, FAQPage 등)
- Hero 섹션이 단순 그라데이션 텍스트
- 사이드바가 좌측 고정 (구식 레이아웃)
- 애니메이션/전환 효과 부재
- 제품 카드가 단순한 박스형
- 모바일 경험 기본 수준

### 목표 상태 (TO-BE)
- 2025-2026 모던 코퍼레이트 디자인 트렌드 반영
- 깔끔한 그라데이션, 글래스모피즘, 부드러운 애니메이션
- 인터랙티브한 호버/스크롤 효과
- 사이드바 제거 → 풀 와이드 레이아웃
- 모바일 퍼스트 반응형 설계 강화

## 3. Design Direction

### 3.1 Modern Corporate 핵심 요소
1. **Hero Section**: 풀 와이드 그라데이션 배경 + 타이핑 애니메이션 또는 서브텍스트 페이드인
2. **Card UI**: 글래스모피즘 또는 뉴모피즘 스타일 카드
3. **Color**: 딥 블루 + 화이트 + 소프트 그레이 기반, 액센트 그라데이션
4. **Typography**: Pretendard (한글 웹폰트) 또는 Noto Sans KR
5. **Animation**: Scroll-triggered 페이드인, 호버 마이크로인터랙션
6. **Layout**: 사이드바 없는 풀 와이드, 섹션 기반 레이아웃
7. **Spacing**: 넉넉한 여백 (섹션 간 80-120px)
8. **Images**: SVG 아이콘 대신 Lucide 아이콘 또는 개선된 일러스트레이션

### 3.2 Color Palette (New)
```
Primary:     #1e293b (Slate 800) - 메인 텍스트/헤더
Secondary:   #3b82f6 (Blue 500) - 주요 액션/CTA
Accent:      #06b6d4 (Cyan 500) - 보조 액센트
Gradient:    #3b82f6 → #06b6d4 (Blue to Cyan)
Background:  #ffffff - 메인 배경
Surface:     #f8fafc (Slate 50) - 섹션 배경
Muted:       #64748b (Slate 500) - 보조 텍스트
Border:      #e2e8f0 (Slate 200) - 경계선
Success:     #10b981 (Emerald 500)
Error:       #ef4444 (Red 500)
```

### 3.3 Typography (New)
```
Font: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
  OR: 'Noto Sans KR', sans-serif (fallback)

Sizes:
  Hero Title:    48px / 56px (desktop) → 32px / 40px (mobile)
  Section Title: 36px / 44px → 28px / 32px
  Card Title:    20px / 28px
  Body:          16px / 24px
  Small:         14px / 20px
  Caption:       12px / 16px

Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
```

## 4. Requirements

### Functional Requirements (변경 사항)

#### FR-01: Layout 변경
- 사이드바 제거 → 풀 와이드 레이아웃
- 로그인 패널 → 헤더 우측 버튼으로 이동
- 카카오톡 위젯 → 우측 하단 플로팅 버튼
- 바로가기 → 네비게이션에 통합

#### FR-02: Header 리디자인
- 스크롤 시 배경 블러 효과 (backdrop-filter)
- 투명 → 반투명 전환
- 로고 + 네비 + 로그인 버튼 (3등분 레이아웃)
- 모바일: 슬라이드 드로어 네비게이션

#### FR-03: HomePage 리디자인
- Hero: 풀 와이드, 그라데이션 배경, 큰 타이포, CTA 버튼
- 제품 섹션: 아이콘 + 제목 + 설명 카드 (호버 시 상승 + 그림자)
- 공지사항: 깔끔한 리스트, 카테고리 태그
- "신뢰하는 파트너" 통계 섹션 추가 (고객사 수, 운영 연수 등)
- CTA 섹션: "무료 체험 시작하기" 배너

#### FR-04: CompanyPage 리디자인
- 회사소개 Hero 배너
- 비전/미션: 아이콘 + 카드 레이아웃
- 연혁: 수직 타임라인 (좌우 교차 스타일)
- 팀/핵심 가치 섹션 추가

#### FR-05: CommunityPage 리디자인
- 깔끔한 테이블 디자인 (줄무늬 배경)
- 검색 바 UI 개선 (둥근 모서리, 아이콘)
- 카테고리 필터 → 탭 스타일 또는 칩 스타일

#### FR-06: DownloadsPage 리디자인
- 카드 그리드 형태 (리스트 → 그리드)
- 파일 타입별 아이콘 차별화
- 다운로드 카운트/인기 표시

#### FR-07: ProjectsPage 리디자인
- 포트폴리오 카드 (이미지 오버레이 + 호버 효과)
- 카테고리 필터 애니메이션 전환

#### FR-08: FAQPage 리디자인
- 깔끔한 아코디언 (부드러운 전개 애니메이션)
- 검색 기능 추가
- 카테고리별 섹션 구분

#### FR-09: Footer 리디자인
- 다크 배경 (Slate 900)
- 4열 그리드 + 하단 저작권
- 소셜 미디어 아이콘 링크
- 뉴스레터 구독 폼

#### FR-10: 공통 UI 개선
- 스크롤 시 페이드인 애니메이션 (CSS @keyframes 또는 IntersectionObserver)
- 버튼 호버 마이크로인터랙션
- 페이지 전환 트랜지션
- 스크롤 투 탑 버튼
- 토스트 알림 (다운로드 등)

### Non-Functional Requirements

#### NFR-01: 성능
- 폰트 로딩 최적화 (font-display: swap)
- CSS 애니메이션은 transform/opacity만 사용 (GPU 가속)
- 이미지 lazy loading

#### NFR-02: 접근성
- WCAG 2.1 AA 색상 대비 준수
- 키보드 네비게이션 지원
- aria-label 적용

#### NFR-03: 반응형
- Mobile First 접근
- Breakpoints: 640px / 768px / 1024px / 1280px

## 5. Tech Stack (추가/변경)

### 유지
- React 19.2.0
- Vite 7.3.1
- React Router DOM 6.28.0
- clsx 2.1.1
- CSS Modules

### 추가 검토
- **Pretendard 웹폰트** (CDN)
- **Lucide React** 아이콘 (React Icons 대체 또는 병행)
- CSS `@keyframes` 기반 애니메이션 (별도 라이브러리 없이)

## 6. Affected Files

### 수정 필요 (전체)
| Category | Files | Changes |
|----------|-------|---------|
| Design System | `variables.css` | 색상, 폰트, 간격 전면 변경 |
| Global | `global.css` | 폰트 import, 기본 스타일 변경 |
| Layout | `Layout.jsx/css` | 사이드바 제거, 풀 와이드 |
| Header | `Header.jsx/css` | 스크롤 블러, 로그인 버튼 |
| Navigation | `MainNavigation.jsx/css` | 새 네비 스타일 |
| Sidebar | `Sidebar.jsx/css` | 제거 또는 모바일 드로어로 전환 |
| Footer | `Footer.jsx/css` | 다크 테마, 4열 그리드 |
| HomePage | `HomePage.jsx` | Hero, 통계, CTA 섹션 추가 |
| ProductGrid | `ProductGrid.jsx/css` | 새 카드 스타일 |
| ProductCard | `ProductCard.jsx/css` | 글래스모피즘/호버 효과 |
| NoticeBoard | `NoticeBoard.jsx/css` | 깔끔한 리스트 |
| NoticeItem | `NoticeItem.jsx/css` | 태그 스타일 |
| CompanyPage | `CompanyPage.jsx` | 인라인 → CSS Module + 새 디자인 |
| CommunityPage | `CommunityPage.jsx` | 헤더 추가 |
| BoardList | `BoardList.jsx/css` | 테이블 리디자인 |
| PostDetailPage | `PostDetailPage.jsx/css` | 상세 페이지 개선 |
| DownloadsPage | `DownloadsPage.jsx` | 그리드 레이아웃 |
| DownloadItem | `DownloadItem.jsx/css` | 카드 스타일 |
| ProjectsPage | `ProjectsPage.jsx` | 인라인 → CSS Module + 포트폴리오 카드 |
| FAQPage | `FAQPage.jsx` | 인라인 → CSS Module + 검색 |
| FAQAccordion | `FAQAccordion.jsx/css` | 부드러운 애니메이션 |
| SitemapPage | `SitemapPage.jsx` | 인라인 → CSS Module |
| NotFoundPage | `NotFoundPage.jsx` | 모던 404 디자인 |
| Button | `Button.jsx/css` | 새 스타일 |
| Input | `Input.jsx/css` | 새 스타일 |
| LoginPanel | `LoginPanel.jsx/css` | 모달/드롭다운 형태 |

### 신규 생성
| File | Purpose |
|------|---------|
| `src/components/common/ScrollToTop.jsx` | 스크롤 투 탑 버튼 |
| `src/components/common/FloatingChat.jsx` | 카카오톡 플로팅 버튼 |
| `src/components/home/StatsSection.jsx` | 홈 통계 섹션 |
| `src/components/home/CTASection.jsx` | 홈 CTA 배너 |
| `src/pages/HomePage.module.css` | 홈페이지 CSS Module |
| `src/pages/CompanyPage.module.css` | 회사소개 CSS Module |
| `src/pages/ProjectsPage.module.css` | 프로젝트 CSS Module |
| `src/pages/FAQPage.module.css` | FAQ CSS Module |
| `src/pages/DownloadsPage.module.css` | 다운로드 CSS Module |
| `src/pages/SitemapPage.module.css` | 사이트맵 CSS Module |
| `src/pages/NotFoundPage.module.css` | 404 CSS Module |
| `src/styles/animations.css` | 공통 애니메이션 |

## 7. Implementation Order

1. **Phase 1**: Design System 업데이트 (variables.css, global.css, animations.css, 폰트)
2. **Phase 2**: Layout 변경 (Layout, Header, Footer - 사이드바 제거)
3. **Phase 3**: 공통 컴포넌트 (Button, Input, ScrollToTop, FloatingChat)
4. **Phase 4**: HomePage 리디자인 (Hero, StatsSection, ProductGrid, NoticeBoard, CTASection)
5. **Phase 5**: 서브 페이지 리디자인 (Company, Community, Downloads, Projects, FAQ, Sitemap, 404)

## 8. Success Criteria
- 모든 페이지에 CSS Module 적용 (인라인 스타일 0개)
- Lighthouse Performance Score >= 90
- 모바일/태블릿/데스크톱 반응형 동작 확인
- 스크롤 애니메이션, 호버 효과 정상 동작
- 프로덕션 빌드 성공
