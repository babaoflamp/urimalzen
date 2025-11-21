# Glassmorphism Design System - Urimalzen

> Google Gemini 스타일의 글래스모피즘 UI/UX 디자인 시스템

## 🎨 디자인 컨셉

- **흰색 배경** 위에 **반투명 유리 레이어**
- **블러 효과**로 배경과 콘텐츠 분리
- **부드러운 그라디언트 악센트**
- **미세한 그림자와 테두리 글로우**
- **부드러운 애니메이션과 트랜지션**

---

## 🎯 색상 팔레트

### 배경색
```css
--background-primary: #ffffff;      /* 순백 */
--background-secondary: #f8f9fa;    /* 매우 밝은 회색 */
--background-tertiary: #f1f3f4;     /* 밝은 회색 */
```

### 글래스 효과
```css
--glass-bg: rgba(255, 255, 255, 0.7);          /* 기본 글래스 */
--glass-bg-light: rgba(255, 255, 255, 0.5);    /* 약한 글래스 */
--glass-bg-strong: rgba(255, 255, 255, 0.85);  /* 강한 글래스 */
```

### 악센트 색상 (Google 스타일)
```css
--accent-primary: #4285f4;    /* 블루 */
--accent-secondary: #ea4335;  /* 레드 */
--accent-success: #34a853;    /* 그린 */
--accent-warning: #fbbc04;    /* 옐로우 */
--accent-purple: #9334e9;     /* 퍼플 */
--accent-cyan: #06b6d4;       /* 시안 */
```

### 그라디언트
```css
--gradient-primary: linear-gradient(135deg, #4285f4 0%, #9334e9 100%);    /* 블루-퍼플 */
--gradient-secondary: linear-gradient(135deg, #06b6d4 0%, #4285f4 100%);  /* 시안-블루 */
--gradient-warm: linear-gradient(135deg, #fbbc04 0%, #ea4335 100%);       /* 옐로우-레드 */
--gradient-cool: linear-gradient(135deg, #34a853 0%, #06b6d4 100%);       /* 그린-시안 */
```

---

## 📐 레이아웃 & 간격

### 블러 강도
```css
--blur-sm: 8px;    /* 가벼운 블러 */
--blur-md: 16px;   /* 중간 블러 */
--blur-lg: 24px;   /* 강한 블러 */
--blur-xl: 32px;   /* 매우 강한 블러 */
```

### Border Radius
```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 24px;
--radius-full: 9999px;  /* 완전한 원형 */
```

### Spacing
```css
--spacing-xs: 0.5rem;   /* 8px */
--spacing-sm: 0.75rem;  /* 12px */
--spacing-md: 1rem;     /* 16px */
--spacing-lg: 1.5rem;   /* 24px */
--spacing-xl: 2rem;     /* 32px */
--spacing-2xl: 3rem;    /* 48px */
```

---

## 🧩 재사용 가능한 클래스

### 글래스 카드
```css
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--blur-md));
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
  background: var(--glass-bg-strong);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
```

### 버튼
```html
<!-- 기본 버튼 -->
<button class="btn-glass">버튼</button>

<!-- 주요 액션 버튼 -->
<button class="btn-primary">확인</button>

<!-- 성공 버튼 -->
<button class="btn-success">완료</button>
```

### 배지
```html
<span class="badge">기본</span>
<span class="badge badge-primary">주요</span>
<span class="badge badge-success">성공</span>
<span class="badge badge-warning">경고</span>
```

### 그라디언트 텍스트
```html
<h1 class="gradient-text">우리말젠</h1>
```

---

## ✨ 애니메이션

### 페이드인
```css
.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}
```

### 슬라이드인
```css
.animate-slideIn {
  animation: slideIn 0.5s ease-out;
}
```

### 맥박 효과
```css
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### 글로우 효과
```css
.animate-glow {
  animation: glow 2s ease-in-out infinite;
}
```

---

## 🎯 컴포넌트 스타일 예제

### 1. 카드 컴포넌트

```tsx
<div className="glass-card animate-fadeIn" style={{
  padding: 'var(--spacing-xl)',
  marginBottom: 'var(--spacing-lg)'
}}>
  <h2 className="gradient-text">제목</h2>
  <p>내용...</p>
</div>
```

```css
/* Component.css */
.my-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.my-card:hover {
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  border-color: rgba(66, 133, 244, 0.2);
}
```

### 2. 버튼 스타일

```tsx
<button className="glass-btn" onClick={handleClick}>
  클릭
</button>
```

```css
.glass-btn {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 10px 24px;
  color: #202124;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.glass-btn:hover {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  border-color: rgba(66, 133, 244, 0.3);
}

.glass-btn:active {
  transform: translateY(0);
}
```

### 3. 입력 필드

```tsx
<input
  type="text"
  className="input-glass"
  placeholder="입력하세요..."
/>
```

```css
.input-glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 12px 16px;
  color: #202124;
  font-size: 15px;
  transition: all 0.3s ease;
  width: 100%;
}

.input-glass:focus {
  outline: none;
  border-color: #4285f4;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.1);
}

.input-glass::placeholder {
  color: #80868b;
}
```

### 4. 네비게이션

```css
.nav-container {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
}

.nav-item {
  padding: 12px 20px;
  border-radius: 10px;
  color: #202124;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.nav-item:hover {
  background: rgba(66, 133, 244, 0.1);
  color: #4285f4;
}

.nav-item.active {
  background: linear-gradient(135deg, #4285f4 0%, #9334e9 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
}
```

### 5. 모달/대화상자

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(32px);
  -webkit-backdrop-filter: blur(32px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 24px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.4s ease-out;
}
```

---

## 📱 반응형 디자인

```css
/* 태블릿 */
@media (max-width: 968px) {
  .header-container {
    grid-template-columns: 1fr;
    padding: 16px 20px;
  }
  
  .glass-card {
    padding: 20px;
  }
}

/* 모바일 */
@media (max-width: 640px) {
  .section-title {
    font-size: 1.75rem;
  }
  
  .btn-primary,
  .btn-glass {
    width: 100%;
    justify-content: center;
  }
}
```

---

## 🌟 베스트 프랙티스

### 1. 항상 backdrop-filter 사용
```css
backdrop-filter: blur(16px);
-webkit-backdrop-filter: blur(16px);  /* Safari 지원 */
```

### 2. 부드러운 트랜지션
```css
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

### 3. 미세한 테두리와 그림자
```css
border: 1px solid rgba(255, 255, 255, 0.3);
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
```

### 4. Hover 시 변화
```css
:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  border-color: rgba(66, 133, 244, 0.2);
}
```

### 5. 그라디언트 텍스트
```css
background: linear-gradient(135deg, #4285f4 0%, #9334e9 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

---

## 🔧 적용 방법

### 기존 컴포넌트 변환 체크리스트

1. ✅ `import "./ComponentName.css"` 추가
2. ✅ 인라인 스타일을 CSS 클래스로 변경
3. ✅ 배경을 `rgba(255, 255, 255, 0.7)` + `backdrop-filter: blur(16px)`로 변경
4. ✅ 테두리를 `1px solid rgba(255, 255, 255, 0.3)`로 변경
5. ✅ border-radius를 `12px` 이상으로 설정
6. ✅ transition 추가: `transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`
7. ✅ hover 효과 추가
8. ✅ 애니메이션 클래스 추가 (`animate-fadeIn` 등)

---

## 📚 참고 예제

완성된 컴포넌트:
- ✅ `index.css` - 글로벌 스타일 & 변수
- ✅ `App.css` - 앱 레이아웃 & 유틸리티
- ✅ `Header.css` - 헤더 컴포넌트

아직 변환이 필요한 컴포넌트:
- ⏳ CategoryGrid
- ⏳ LearningArea
- ⏳ RecordingControls
- ⏳ Navigation
- ⏳ MainNav
- ⏳ 관리자 페이지들

---

## 🎨 색상 조합 제안

### 기본 카드
```css
background: rgba(255, 255, 255, 0.7);
border: 1px solid rgba(255, 255, 255, 0.3);
```

### 강조 카드 (hover)
```css
background: rgba(255, 255, 255, 0.85);
border-color: rgba(66, 133, 244, 0.2);
```

### 액센트 카드 (선택됨)
```css
background: linear-gradient(135deg, rgba(66, 133, 244, 0.1) 0%, rgba(147, 52, 233, 0.05) 100%);
border-color: rgba(66, 133, 244, 0.3);
```

### 성공 상태
```css
background: rgba(52, 168, 83, 0.1);
border-color: rgba(52, 168, 83, 0.2);
color: #34a853;
```

### 경고 상태
```css
background: rgba(251, 188, 4, 0.1);
border-color: rgba(251, 188, 4, 0.2);
color: #fbbc04;
```

---

이 디자인 시스템을 따라 모든 컴포넌트를 일관되게 스타일링하면 Google Gemini와 같은 세련된 글래스모피즘 UI를 구현할 수 있습니다! ✨
