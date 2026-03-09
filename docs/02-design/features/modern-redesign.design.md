# Design: modern-redesign

## 1. Overview
- **Feature Name**: modern-redesign (전체 페이지 모던 리디자인)
- **Plan Reference**: `docs/01-plan/features/modern-redesign.plan.md`
- **Created**: 2026-02-15
- **Level**: Dynamic
- **Status**: In Progress

## 2. Architecture

### 2.1 Current Architecture (AS-IS)
```
App.jsx
  └── BrowserRouter
       └── Layout
            ├── Header (TopBar + Logo + MainNavigation)
            ├── ContentWrapper (flex row)
            │    ├── Sidebar (LoginPanel + QuickLinks + KakaoTalk)
            │    └── Main (page content, max-width: 1200px)
            └── Footer (4-column grid)
```

### 2.2 New Architecture (TO-BE)
```
App.jsx
  └── BrowserRouter
       └── Layout
            ├── Header (Logo + MainNavigation + LoginButton, backdrop-blur on scroll)
            ├── Main (full-width, no sidebar)
            │    └── Page content (sections with container)
            ├── Footer (dark theme, 4-column, newsletter)
            ├── ScrollToTop (floating button, bottom-right)
            └── FloatingChat (KakaoTalk, bottom-right)
```

### 2.3 Key Changes
| Component | AS-IS | TO-BE |
|-----------|-------|-------|
| Layout | Sidebar + Main (max 1200px) | Full-width Main |
| Header | TopBar + MainHeader + Nav (3 rows) | Single row: Logo + Nav + Login (sticky, blur) |
| Sidebar | Left column (LoginPanel, Links, KakaoTalk) | **Removed** |
| LoginPanel | Sidebar embedded form | Header dropdown/modal |
| KakaoTalk | Sidebar widget | FloatingChat (bottom-right) |
| QuickLinks | Sidebar section | Navigation에 통합 |
| Footer | Primary color bg (#454646) | Dark slate bg (#0f172a) |
| Container | 1200px max-width with sidebar | 1280px max-width full-width |

## 3. Design System Updates

### 3.1 CSS Variables (`variables.css`) - Complete Replacement

```css
:root {
  /* === Colors (New Modern Palette) === */
  --color-primary: #1e293b;        /* Slate 800 - 메인 텍스트/헤더 */
  --color-secondary: #3b82f6;      /* Blue 500 - 주요 액션/CTA */
  --color-accent: #06b6d4;         /* Cyan 500 - 보조 액센트 */
  --color-text: #334155;           /* Slate 700 */
  --color-text-light: #64748b;     /* Slate 500 */
  --color-text-muted: #94a3b8;     /* Slate 400 */
  --color-background: #ffffff;
  --color-background-light: #f8fafc; /* Slate 50 */
  --color-surface: #f1f5f9;        /* Slate 100 */
  --color-border: #e2e8f0;         /* Slate 200 */
  --color-border-light: #f1f5f9;   /* Slate 100 */
  --color-hover: #3b82f6;
  --color-focus: #2563eb;          /* Blue 600 */
  --color-error: #ef4444;          /* Red 500 */
  --color-success: #10b981;        /* Emerald 500 */
  --color-warning: #f59e0b;        /* Amber 500 */

  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
  --gradient-hero: linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%);
  --gradient-card: linear-gradient(135deg, rgba(59,130,246,0.05) 0%, rgba(6,182,212,0.05) 100%);

  /* === Typography === */
  --font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans KR', sans-serif;
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */
  --font-size-5xl: 3rem;      /* 48px */

  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  /* === Layout === */
  --header-height: 72px;
  --container-max-width: 1280px;
  --section-spacing: 96px;    /* 섹션 간 간격 */

  /* === Spacing === */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;
  --spacing-4xl: 96px;

  /* === Border Radius === */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;
  --radius-full: 9999px;

  /* === Shadows (Modern, softer) === */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-card-hover: 0 10px 40px rgba(0, 0, 0, 0.12);

  /* Glass effect */
  --glass-bg: rgba(255, 255, 255, 0.8);
  --glass-border: rgba(255, 255, 255, 0.2);
  --glass-blur: blur(12px);

  /* === Transitions === */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 350ms ease;
  --transition-spring: 500ms cubic-bezier(0.34, 1.56, 0.64, 1);

  /* === Z-index === */
  --z-index-sticky: 50;
  --z-index-dropdown: 100;
  --z-index-overlay: 500;
  --z-index-modal: 1000;
  --z-index-tooltip: 1100;
  --z-index-toast: 1200;
  --z-index-floating: 1300;

  /* === Breakpoints (reference) === */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}
```

### 3.2 Font Import (`global.css`)
```css
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css');
```

### 3.3 Animations (`animations.css`) - New File
```css
/* Fade in from bottom */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide in from left */
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Slide in from right */
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Scale up */
@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Utility classes for scroll-triggered animations */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.animate-on-scroll.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger delays for children */
.stagger-1 { transition-delay: 0.1s; }
.stagger-2 { transition-delay: 0.2s; }
.stagger-3 { transition-delay: 0.3s; }
.stagger-4 { transition-delay: 0.4s; }
.stagger-5 { transition-delay: 0.5s; }
```

## 4. Component Specifications

### 4.1 Layout (`Layout.jsx` / `Layout.module.css`)

**Changes**: Remove Sidebar import, remove contentWrapper flex-row, full-width main.

```jsx
// Layout.jsx (새 구조)
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from '../common/ScrollToTop';
import FloatingChat from '../common/FloatingChat';
import styles from './Layout.module.css';

function Layout({ children }) {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        {children}
      </main>
      <Footer />
      <ScrollToTop />
      <FloatingChat />
    </div>
  );
}
```

```css
/* Layout.module.css */
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main {
  flex: 1;
}
```

### 4.2 Header (`Header.jsx` / `Header.module.css`)

**Changes**: Remove TopBar, single row layout, backdrop-blur on scroll, login button.

**Structure**:
```
<header> (sticky, transparent → blur on scroll)
  <div.headerContainer> (max-width: 1280px, center)
    <Link.logo> (logo.svg + "엠앰소프트")
    <MainNavigation /> (desktop: horizontal links)
    <div.headerActions>
      <button.loginButton> ("로그인")
      <button.mobileMenuButton> (hamburger, mobile only)
    </div>
  </div>
</header>
```

**CSS Specs**:
- Height: 72px
- Position: sticky, top: 0
- Default: `background: transparent`
- On scroll (>50px): `background: var(--glass-bg); backdrop-filter: var(--glass-blur); border-bottom: 1px solid var(--color-border);`
- Scroll detection via `useState` + `useEffect` with scroll listener
- Logo: `font-size: 1.5rem; font-weight: 700;`
- Login button: `padding: 8px 20px; border-radius: 9999px; background: var(--gradient-primary); color: white;`
- Mobile (< 768px): Nav hidden, hamburger visible, slide-in drawer

### 4.3 MainNavigation (`MainNavigation.jsx` / `MainNavigation.module.css`)

**Changes**: Horizontal center layout, underline active indicator, mobile slide drawer.

**Nav Items** (updated):
```js
const navItems = [
  { path: '/', label: '홈' },
  { path: '/company', label: '회사소개' },
  { path: '/community', label: '커뮤니티' },
  { path: '/downloads', label: '다운로드' },
  { path: '/projects', label: '프로젝트' },
  { path: '/faq', label: 'FAQ' },
];
```
- **Remove**: 사이트맵 (Footer에 유지)

**Desktop CSS**:
- `display: flex; gap: 32px; align-items: center;`
- Link: `font-size: 0.9375rem; font-weight: 500; color: var(--color-text-light);`
- Active: `color: var(--color-secondary); position: relative;` + `::after` underline (2px, secondary color, animate width)
- Hover: `color: var(--color-primary);`

**Mobile CSS** (< 768px):
- Full-screen overlay: `position: fixed; inset: 0; background: white; z-index: 1000;`
- Slide from right: `transform: translateX(100%);` → `translateX(0);`
- Nav links: `font-size: 1.25rem; padding: 16px 24px; border-bottom: 1px solid var(--color-border);`

### 4.4 Footer (`Footer.jsx` / `Footer.module.css`)

**Changes**: Dark slate background, 4-column grid, newsletter form, social icons.

**Structure**:
```
<footer> (bg: #0f172a, Slate 900)
  <div.footerContainer>
    <div.footerContent> (4-column grid)
      <div.footerSection> (회사 정보 + 로고)
      <div.footerSection> (바로가기 links)
      <div.footerSection> (제품 links)
      <div.footerSection> (고객지원 + 뉴스레터 폼)
    </div>
    <div.copyright> (border-top, center text)
  </div>
</footer>
```

**CSS Specs**:
- Background: `#0f172a` (Slate 900)
- Padding: `80px 0 32px`
- Section titles: `font-size: 1rem; font-weight: 600; color: white; margin-bottom: 20px;`
- Links: `color: #94a3b8; font-size: 0.875rem;` Hover: `color: white;`
- Newsletter input: `background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: white;`
- Copyright: `border-top: 1px solid rgba(255,255,255,0.1); color: #64748b; padding-top: 32px;`

### 4.5 ScrollToTop (`ScrollToTop.jsx`) - New Component

**Behavior**: Appears after scrolling 400px, smooth scroll to top on click.

```jsx
// Structure
<button className={styles.scrollToTop} onClick={scrollToTop} aria-label="맨 위로">
  <FaChevronUp />
</button>
```

**CSS Specs**:
- `position: fixed; bottom: 24px; right: 24px;`
- `width: 48px; height: 48px; border-radius: 50%;`
- `background: var(--gradient-primary); color: white;`
- `box-shadow: var(--shadow-lg);`
- Appear: `opacity: 0; transform: translateY(20px);` → `opacity: 1; transform: translateY(0);`
- `z-index: var(--z-index-floating);`

### 4.6 FloatingChat (`FloatingChat.jsx`) - New Component

**Behavior**: Fixed bottom-right (above ScrollToTop), KakaoTalk button.

```jsx
<a href="#" className={styles.floatingChat} aria-label="카카오톡 상담">
  💬
  <span className={styles.chatLabel}>상담하기</span>
</a>
```

**CSS Specs**:
- `position: fixed; bottom: 84px; right: 24px;`
- `background: #FEE500;` (카카오 옐로우)
- `border-radius: 50%; width: 56px; height: 56px;`
- Hover: scale(1.1) + shadow
- `z-index: var(--z-index-floating);`

### 4.7 Button (`Button.jsx` / `Button.module.css`)

**Changes**: New variants, gradient primary, outline style, larger sizes.

**Variants**:
| Variant | Background | Color | Border |
|---------|-----------|-------|--------|
| `primary` | `var(--gradient-primary)` | white | none |
| `secondary` | white | `var(--color-secondary)` | `1px solid var(--color-secondary)` |
| `outline` | transparent | `var(--color-primary)` | `1px solid var(--color-border)` |
| `ghost` | transparent | `var(--color-text-light)` | none |
| `link` | none | `var(--color-secondary)` | none |

**Sizes**:
| Size | Padding | Font Size |
|------|---------|-----------|
| `sm` | `6px 16px` | `0.875rem` |
| `md` (default) | `10px 24px` | `1rem` |
| `lg` | `14px 32px` | `1.125rem` |

**Common CSS**:
- `border-radius: var(--radius-md);`
- `font-weight: 500;`
- `transition: all var(--transition-base);`
- Hover: `transform: translateY(-1px); box-shadow: var(--shadow-md);`
- `width: auto;` (remove `width: 100%` default)

### 4.8 Input (`Input.jsx` / `Input.module.css`)

**Changes**: Rounded corners, focus ring, label float.

**CSS Specs**:
- `border: 1px solid var(--color-border); border-radius: var(--radius-md);`
- `padding: 12px 16px; font-size: 1rem;`
- Focus: `border-color: var(--color-secondary); box-shadow: 0 0 0 3px rgba(59,130,246,0.1);`
- Label: `font-size: 0.875rem; font-weight: 500; color: var(--color-primary); margin-bottom: 6px;`

## 5. Page Specifications

### 5.1 HomePage (`HomePage.jsx` / `HomePage.module.css`)

**Complete restructure** - Remove all inline styles.

**Sections**:
1. **Hero Section** (full-width)
   - Background: `var(--gradient-hero)`
   - Height: `min-height: 600px` (desktop) / `min-height: 400px` (mobile)
   - Content: centered, max-width 800px
   - Title: `font-size: 3rem; font-weight: 700; color: white;`
   - Subtitle: `font-size: 1.25rem; color: rgba(255,255,255,0.8); margin-top: 16px;`
   - CTA buttons: 2개 (primary gradient + secondary outline white)
   - Animation: fadeInUp on load

2. **StatsSection** (new component)
   - Background: white
   - 4-column grid: 고객사 수 (1,000+), 운영 연수 (25+), 프로젝트 (500+), 만족도 (98%)
   - Counter animation on scroll into view
   - Number: `font-size: 2.5rem; font-weight: 700; background: var(--gradient-primary); -webkit-background-clip: text; color: transparent;`
   - Label: `font-size: 0.875rem; color: var(--color-text-light);`

3. **Products Section** (ProductGrid 개선)
   - Section title: `font-size: 2.25rem; font-weight: 700; text-align: center;`
   - Subtitle: `color: var(--color-text-light); text-align: center; margin-bottom: 48px;`
   - Cards: 3-column grid (desktop), 2-column (tablet), 1-column (mobile)
   - Card style: see ProductCard spec (4.9)

4. **NoticeBoard Section** (개선)
   - 깔끔한 리스트, 카테고리 태그 컬러, "더보기" 링크
   - Container: `background: var(--color-background-light); border-radius: var(--radius-xl); padding: 48px;`

5. **CTASection** (new component)
   - Full-width gradient background
   - Title: `font-size: 2rem; font-weight: 700; color: white;`
   - Subtitle + CTA button (white bg, blue text)
   - `padding: 80px 0;`

### 5.2 CompanyPage (`CompanyPage.jsx` / `CompanyPage.module.css`)

**Complete restructure** - All inline styles → CSS Module.

**Sections**:
1. **Page Hero** (compact, gradient bg)
   - `padding: 80px 0; background: var(--gradient-hero); color: white;`
   - Title: `font-size: 2.5rem; font-weight: 700;`
   - Breadcrumb: `홈 > 회사소개`

2. **Intro Section**
   - Container max-width 800px, centered
   - `font-size: 1.125rem; line-height: 1.75; color: var(--color-text);`
   - `padding: 80px 0;`

3. **Vision/Mission** (icon + card)
   - 2-column grid
   - Card: `padding: 40px; border-radius: 16px; background: white; box-shadow: var(--shadow-card);`
   - Icon area: `48px circle, gradient bg, white icon`
   - Title: `font-size: 1.25rem; font-weight: 600; margin-top: 20px;`

4. **Timeline** (vertical, alternating left/right)
   - Center line: `2px solid var(--color-border); position: absolute; left: 50%;`
   - Dot: `16px circle, gradient bg`
   - Cards alternate left/right
   - Year: `font-size: 1.25rem; font-weight: 700; color: var(--color-secondary);`
   - Content: `background: white; padding: 24px; border-radius: 12px; box-shadow: var(--shadow-card);`
   - Mobile: single column, all left-aligned

### 5.3 CommunityPage (`CommunityPage.jsx`)

**Changes**: Add page hero section header.

**Structure**:
```
<div>
  <PageHero title="커뮤니티" subtitle="..." />
  <div.container>
    <BoardList />
  </div>
</div>
```

### 5.4 BoardList (`BoardList.jsx` / `BoardList.module.css`)

**Changes**: Clean table with alternating rows, improved search bar.

**CSS Specs**:
- Table: `border-collapse: separate; border-spacing: 0; width: 100%;`
- Header row: `background: var(--color-background-light); font-weight: 600; font-size: 0.875rem;`
- Body rows: `border-bottom: 1px solid var(--color-border);`
- Alternating: `:nth-child(even) { background: var(--color-background-light); }`
- Search bar: `border-radius: var(--radius-full); border: 1px solid var(--color-border); padding: 10px 20px;` with search icon
- Category filter: Chip/pill style (same as FAQ/Projects)

### 5.5 DownloadsPage (`DownloadsPage.jsx` / `DownloadsPage.module.css`)

**Changes**: List → card grid layout.

**Structure**:
```
<div>
  <PageHero title="자료실" subtitle="..." />
  <div.container>
    <DownloadCategories /> (pill filter)
    <div.downloadGrid> (3-column cards)
      <DownloadItem /> (card style)
    </div>
  </div>
</div>
```

**DownloadItem Card CSS**:
- `padding: 24px; border-radius: 12px; background: white; border: 1px solid var(--color-border);`
- File icon: differentiated by type (PDF red, DOC blue, ZIP amber, EXE green)
- Hover: `box-shadow: var(--shadow-card-hover); transform: translateY(-2px);`
- Download count badge: `font-size: 0.75rem; color: var(--color-text-muted);`

### 5.6 ProjectsPage (`ProjectsPage.jsx` / `ProjectsPage.module.css`)

**Complete restructure** - All inline styles → CSS Module.

**Structure**:
```
<div>
  <PageHero title="프로젝트 포트폴리오" subtitle="..." />
  <div.container>
    <CategoryFilter /> (pill chips)
    <div.projectGrid> (3-column)
      <ProjectCard /> (image overlay + hover)
    </div>
  </div>
</div>
```

**ProjectCard CSS**:
- `border-radius: 16px; overflow: hidden;`
- Image area: `height: 220px; background: var(--color-surface);`
- Overlay on hover: `background: rgba(30,41,59,0.7); opacity: 0 → 1;`
- Content: `padding: 24px;`
- Title: `font-size: 1.125rem; font-weight: 600;`
- Client/date: `font-size: 0.75rem; color: var(--color-text-muted);`

### 5.7 FAQPage (`FAQPage.jsx` / `FAQPage.module.css`)

**Complete restructure** - All inline styles → CSS Module + search.

**Structure**:
```
<div>
  <PageHero title="자주 묻는 질문" subtitle="..." />
  <div.container>
    <SearchBar /> (rounded, icon)
    <CategoryFilter /> (pill chips)
    <FAQAccordion />
  </div>
</div>
```

**Search bar CSS**:
- `max-width: 600px; margin: 0 auto 32px;`
- `border-radius: var(--radius-full); border: 2px solid var(--color-border);`
- Focus: `border-color: var(--color-secondary);`
- Search icon left

**FAQAccordion CSS**:
- Item: `border: 1px solid var(--color-border); border-radius: var(--radius-lg); margin-bottom: 12px;`
- Question: `padding: 20px 24px; font-weight: 500; cursor: pointer;`
- Arrow rotate: `transition: transform var(--transition-base); transform: rotate(0deg) → rotate(180deg);`
- Answer: `max-height: 0; overflow: hidden; transition: max-height 0.3s ease;` → expanded: `max-height: 500px;`
- Answer content: `padding: 0 24px 20px;`

### 5.8 SitemapPage (`SitemapPage.jsx` / `SitemapPage.module.css`)

**Changes**: Inline → CSS Module, modern card grid.

**CSS Specs**:
- Section cards: `background: white; border-radius: var(--radius-xl); padding: 32px; box-shadow: var(--shadow-card);`
- Grid: `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;`
- Section title: `font-size: 1.125rem; font-weight: 600; color: var(--color-primary);`
- Links: `color: var(--color-text-light); font-size: 0.875rem;` Hover: `color: var(--color-secondary);`

### 5.9 NotFoundPage (`NotFoundPage.jsx` / `NotFoundPage.module.css`)

**Changes**: Modern 404 design.

**CSS Specs**:
- Full-page centered: `min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center;`
- "404": `font-size: 8rem; font-weight: 800; background: var(--gradient-primary); -webkit-background-clip: text; color: transparent;`
- Text: `font-size: 1.25rem; color: var(--color-text-light); margin: 16px 0 32px;`
- CTA button: primary gradient

### 5.10 PostDetailPage (`PostDetailPage.jsx` / `PostDetailPage.module.css`)

**Changes**: Already has CSS Module, minor style updates.

**Updates**:
- Badge: `background: var(--gradient-primary);` (was solid color)
- Title: `font-size: var(--font-size-3xl);` → `font-size: 1.75rem;`
- Back button hover: `background: var(--gradient-primary); color: white;`
- Add `.container` padding within a max-width wrapper

## 6. Shared Patterns

### 6.1 Page Hero Component Pattern
All sub-pages use a consistent hero header:

```jsx
// Reusable pattern (inline in each page, not a separate component)
<section className={styles.hero}>
  <div className={styles.heroContainer}>
    <h1 className={styles.heroTitle}>{title}</h1>
    <p className={styles.heroSubtitle}>{subtitle}</p>
  </div>
</section>
```

```css
.hero {
  background: var(--gradient-hero);
  padding: 64px 0;
  text-align: center;
}
.heroContainer {
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}
.heroTitle {
  font-size: 2.25rem;
  font-weight: 700;
  color: white;
}
.heroSubtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 12px;
}
```

### 6.2 Section Container Pattern
```css
.section {
  padding: var(--section-spacing) 0;
}
.sectionContainer {
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}
.sectionTitle {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--color-primary);
  text-align: center;
  margin-bottom: 16px;
}
.sectionSubtitle {
  font-size: 1rem;
  color: var(--color-text-light);
  text-align: center;
  margin-bottom: 48px;
}
```

### 6.3 Category Filter Pill Pattern
```css
.filterGroup {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 40px;
}
.filterButton {
  padding: 8px 20px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  background: white;
  color: var(--color-text-light);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-base);
}
.filterButton:hover {
  border-color: var(--color-secondary);
  color: var(--color-secondary);
}
.filterButtonActive {
  background: var(--color-secondary);
  border-color: var(--color-secondary);
  color: white;
}
```

### 6.4 IntersectionObserver Hook (`useScrollAnimation`)
```jsx
// src/hooks/useScrollAnimation.js
import { useEffect, useRef, useState } from 'react';

export function useScrollAnimation(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, ...options }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}
```

## 7. Responsive Design

### 7.1 Breakpoints
| Name | Width | Columns |
|------|-------|---------|
| Mobile | < 640px | 1 |
| Tablet | 640px - 1023px | 2 |
| Desktop | 1024px - 1279px | 3 |
| Wide | >= 1280px | 3-4 |

### 7.2 Key Responsive Rules
| Component | Desktop | Tablet | Mobile |
|-----------|---------|--------|--------|
| Header nav | Horizontal links | Horizontal links | Slide drawer |
| Hero title | 3rem | 2.5rem | 2rem |
| Product grid | 3 columns | 2 columns | 1 column |
| Project grid | 3 columns | 2 columns | 1 column |
| Download grid | 3 columns | 2 columns | 1 column |
| Stats | 4 columns | 2 columns | 2 columns |
| Footer | 4 columns | 2 columns | 1 column |
| Timeline | Left/right alternating | Left-aligned | Left-aligned |
| Section spacing | 96px | 72px | 48px |

## 8. New Files to Create

| File | Purpose |
|------|---------|
| `src/styles/animations.css` | Shared keyframes + scroll animation classes |
| `src/hooks/useScrollAnimation.js` | IntersectionObserver hook |
| `src/components/common/ScrollToTop.jsx` | Scroll-to-top floating button |
| `src/components/common/ScrollToTop.module.css` | ScrollToTop styles |
| `src/components/common/FloatingChat.jsx` | KakaoTalk floating button |
| `src/components/common/FloatingChat.module.css` | FloatingChat styles |
| `src/components/home/StatsSection.jsx` | Home stats counter section |
| `src/components/home/StatsSection.module.css` | StatsSection styles |
| `src/components/home/CTASection.jsx` | Home CTA banner section |
| `src/components/home/CTASection.module.css` | CTASection styles |
| `src/pages/HomePage.module.css` | HomePage CSS Module |
| `src/pages/CompanyPage.module.css` | CompanyPage CSS Module |
| `src/pages/ProjectsPage.module.css` | ProjectsPage CSS Module |
| `src/pages/FAQPage.module.css` | FAQPage CSS Module |
| `src/pages/DownloadsPage.module.css` | DownloadsPage CSS Module |
| `src/pages/SitemapPage.module.css` | SitemapPage CSS Module |
| `src/pages/NotFoundPage.module.css` | NotFoundPage CSS Module |

## 9. Files to Modify

| File | Changes |
|------|---------|
| `src/styles/variables.css` | Complete token replacement (section 3.1) |
| `src/styles/global.css` | Font import, base font-size 16px, updated heading sizes |
| `src/index.css` | Add `animations.css` import |
| `src/components/layout/Layout.jsx` | Remove Sidebar, add ScrollToTop + FloatingChat |
| `src/components/layout/Layout.module.css` | Remove contentWrapper, full-width main |
| `src/components/layout/Header.jsx` | Single row, scroll blur, login button |
| `src/components/layout/Header.module.css` | Complete restyle |
| `src/components/layout/MainNavigation.jsx` | Remove 사이트맵, horizontal style |
| `src/components/layout/MainNavigation.module.css` | Horizontal links, mobile drawer |
| `src/components/layout/Footer.jsx` | Dark theme, newsletter form |
| `src/components/layout/Footer.module.css` | Slate 900 bg, updated spacing |
| `src/components/common/Button.jsx` | Add size prop, new variants |
| `src/components/common/Button.module.css` | Gradient primary, outline, sizes |
| `src/components/common/Input.jsx` | Focus ring style |
| `src/components/common/Input.module.css` | Rounded, focus ring |
| `src/components/products/ProductCard.jsx` | Lucide icon integration option |
| `src/components/products/ProductCard.module.css` | Glass/modern card style |
| `src/components/products/ProductGrid.jsx` | Section wrapper with title/subtitle |
| `src/components/products/ProductGrid.module.css` | Updated grid |
| `src/components/board/NoticeBoard.jsx` | Clean list, category tags |
| `src/components/board/NoticeBoard.module.css` | Updated styles |
| `src/components/board/NoticeItem.jsx` | Tag color, cleaner layout |
| `src/components/board/NoticeItem.module.css` | Updated styles |
| `src/components/board/BoardList.jsx` | Search bar UI, alt rows |
| `src/components/board/BoardList.module.css` | Clean table, rounded search |
| `src/components/downloads/DownloadItem.jsx` | Card layout |
| `src/components/downloads/DownloadItem.module.css` | Card style |
| `src/components/downloads/DownloadCategories.jsx` | Pill filter style |
| `src/components/downloads/DownloadCategories.module.css` | Updated pills |
| `src/components/faq/FAQAccordion.jsx` | Smooth animation |
| `src/components/faq/FAQAccordion.module.css` | Border cards, rotate arrow |
| `src/components/auth/LoginPanel.jsx` | Modal/dropdown form |
| `src/components/auth/LoginPanel.module.css` | Dropdown overlay style |
| `src/pages/HomePage.jsx` | CSS Module, sections, StatsSection, CTASection |
| `src/pages/CompanyPage.jsx` | CSS Module, hero, timeline |
| `src/pages/CommunityPage.jsx` | Add hero section |
| `src/pages/DownloadsPage.jsx` | CSS Module, card grid |
| `src/pages/ProjectsPage.jsx` | CSS Module, overlay cards |
| `src/pages/FAQPage.jsx` | CSS Module, search bar |
| `src/pages/SitemapPage.jsx` | CSS Module, card grid |
| `src/pages/NotFoundPage.jsx` | CSS Module, modern 404 |
| `src/pages/PostDetailPage.module.css` | Minor style updates |

## 10. Implementation Order

### Phase 1: Design System Foundation
1. `src/styles/variables.css` - New color/typography/spacing tokens
2. `src/styles/global.css` - Pretendard font import, base styles
3. `src/styles/animations.css` - Keyframes + scroll animation classes
4. `src/index.css` - Add animations.css import
5. `src/hooks/useScrollAnimation.js` - IntersectionObserver hook

### Phase 2: Layout Structure
6. `Layout.jsx` + `Layout.module.css` - Remove sidebar, full-width
7. `Header.jsx` + `Header.module.css` - Single row, scroll blur
8. `MainNavigation.jsx` + `MainNavigation.module.css` - Horizontal + mobile drawer
9. `Footer.jsx` + `Footer.module.css` - Dark theme

### Phase 3: Common Components
10. `Button.jsx` + `Button.module.css` - New variants/sizes
11. `Input.jsx` + `Input.module.css` - Modern input
12. `ScrollToTop.jsx` + `.module.css` - New floating button
13. `FloatingChat.jsx` + `.module.css` - New floating chat

### Phase 4: HomePage
14. `StatsSection.jsx` + `.module.css` - New stats component
15. `CTASection.jsx` + `.module.css` - New CTA component
16. `ProductGrid.jsx` + `.module.css` - Section wrapper
17. `ProductCard.jsx` + `.module.css` - Modern card
18. `NoticeBoard.jsx` + `.module.css` - Clean list
19. `NoticeItem.jsx` + `.module.css` - Tag styles
20. `HomePage.jsx` + `HomePage.module.css` - Full restructure

### Phase 5: Sub Pages
21. `CompanyPage.jsx` + `.module.css` - Hero + timeline
22. `CommunityPage.jsx` + hero section
23. `BoardList.jsx` + `.module.css` - Clean table
24. `PostDetailPage.module.css` - Minor updates
25. `DownloadsPage.jsx` + `.module.css` - Card grid
26. `DownloadItem.jsx` + `.module.css` - Card style
27. `DownloadCategories.jsx` + `.module.css` - Pills
28. `ProjectsPage.jsx` + `.module.css` - Overlay cards
29. `FAQPage.jsx` + `.module.css` - Search + pills
30. `FAQAccordion.jsx` + `.module.css` - Smooth animation
31. `SitemapPage.jsx` + `.module.css` - Card grid
32. `NotFoundPage.jsx` + `.module.css` - Modern 404
33. `LoginPanel.jsx` + `.module.css` - Dropdown/modal

## 11. Implementation Checklist

### Phase 1: Design System (5 items)
- [ ] DS-01: Update `variables.css` with new tokens
- [ ] DS-02: Update `global.css` with Pretendard font + base 16px
- [ ] DS-03: Create `animations.css` with keyframes
- [ ] DS-04: Update `index.css` imports
- [ ] DS-05: Create `useScrollAnimation` hook

### Phase 2: Layout (4 items)
- [ ] LO-01: Refactor `Layout.jsx` (remove Sidebar, add ScrollToTop/FloatingChat)
- [ ] LO-02: Refactor `Header.jsx` (single row, scroll blur, login button)
- [ ] LO-03: Refactor `MainNavigation.jsx` (horizontal, mobile drawer)
- [ ] LO-04: Refactor `Footer.jsx` (dark slate, newsletter)

### Phase 3: Common Components (4 items)
- [ ] CC-01: Update `Button.jsx` (variants, sizes)
- [ ] CC-02: Update `Input.jsx` (focus ring)
- [ ] CC-03: Create `ScrollToTop.jsx`
- [ ] CC-04: Create `FloatingChat.jsx`

### Phase 4: HomePage (7 items)
- [ ] HP-01: Create `StatsSection.jsx`
- [ ] HP-02: Create `CTASection.jsx`
- [ ] HP-03: Update `ProductGrid.jsx` (section wrapper)
- [ ] HP-04: Update `ProductCard.jsx` (modern style)
- [ ] HP-05: Update `NoticeBoard.jsx` (clean list)
- [ ] HP-06: Update `NoticeItem.jsx` (tags)
- [ ] HP-07: Refactor `HomePage.jsx` (CSS Module, all sections)

### Phase 5: Sub Pages (13 items)
- [ ] SP-01: Refactor `CompanyPage.jsx` (CSS Module, hero, timeline)
- [ ] SP-02: Update `CommunityPage.jsx` (add hero)
- [ ] SP-03: Update `BoardList.jsx` (clean table, search)
- [ ] SP-04: Update `PostDetailPage.module.css` (minor)
- [ ] SP-05: Refactor `DownloadsPage.jsx` (CSS Module, card grid)
- [ ] SP-06: Update `DownloadItem.jsx` (card style)
- [ ] SP-07: Update `DownloadCategories.jsx` (pills)
- [ ] SP-08: Refactor `ProjectsPage.jsx` (CSS Module, overlay cards)
- [ ] SP-09: Refactor `FAQPage.jsx` (CSS Module, search)
- [ ] SP-10: Update `FAQAccordion.jsx` (smooth animation)
- [ ] SP-11: Refactor `SitemapPage.jsx` (CSS Module)
- [ ] SP-12: Refactor `NotFoundPage.jsx` (CSS Module, modern 404)
- [ ] SP-13: Refactor `LoginPanel.jsx` (dropdown/modal)

**Total: 33 implementation items across 5 phases**

## 12. Dependencies

### NPM Packages (추가 검토)
- **lucide-react**: Modern icon library (optional, can keep react-icons)
  - `npm install lucide-react`
- No other new dependencies required

### CDN
- Pretendard font: `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css`

## 13. Success Criteria
- [ ] 모든 페이지에 CSS Module 적용 (인라인 스타일 0개)
- [ ] Pretendard 폰트 적용 확인
- [ ] 사이드바 완전 제거, 풀 와이드 레이아웃 동작
- [ ] Header 스크롤 블러 효과 동작
- [ ] 스크롤 애니메이션 (fadeInUp) 동작
- [ ] 호버 마이크로인터랙션 동작
- [ ] 모바일/태블릿/데스크톱 반응형 동작
- [ ] ScrollToTop, FloatingChat 정상 동작
- [ ] 프로덕션 빌드 성공
- [ ] Lighthouse Performance >= 90
