# Repository Guidelines

이 문서는 에이전트(코딩 도우미)가 본 저장소에서 작업할 때 따라야 할 규칙과 팁을 정리합니다. 본 AGENTS.md의 범위는 저장소 전체입니다.

## Project Structure & Module Organization
- `src/app/`: Next.js App Router 엔트리 (`layout.tsx`, `page.tsx`, `globals.css`).
- `src/app/test-preview/*`: 데모/프리뷰 라우트 모음 (예: `bg-pattern-demo`, `liquid-text-demo`).
- `src/components/`: 재사용 UI 컴포넌트. `ui/*`에는 공용 UI 프리미티브가 위치합니다.
- `src/components/lightswind/*`: 커스텀 커서 스코프/렌더러 등 인터랙션 유틸.
- `src/components/fancy/*`: 가변 폰트 등 실험적 인터랙션.
- `src/features/`: 기능(섹션) 단위 컴포넌트. 예: `intro/components/*`는 인트로 애니메이션 관련.
- `src/hooks/`: 커스텀 훅. 브라우저 API/GSAP 사용 시 클라이언트 컴포넌트에서만 호출.
- `src/lib/`: 유틸리티. 예: `cn()` Tailwind 클래스 병합. `@/*` 경로 별칭 사용.
- `src/types/`: 타입 정의. 디바이스, 공용 타입 등.
- `public/`: 정적 에셋(이미지, 아이콘, 폰트 등).

참고: 과거 문서에 있던 `scrolltrigger-svg-text-mask/` 폴더는 본 저장소에는 없습니다.

## Build, Dev, Lint
- `npm run dev`: 로컬 개발 서버(Turbopack) 시작. http://localhost:3000 접속.
- `npm run build`: 프로덕션 빌드(Turbopack).
- `npm run start`: 프로덕션 빌드 서빙.
- `npm run lint`: ESLint 실행. 필요 시 `npx eslint . --fix`로 자동 수정.

미리보기: 기본 라우트(`/`)에서 인트로 시퀀스가 렌더링됩니다.
프리뷰 라우트:
- `/test-preview/bg-pattern-demo`
- `/test-preview/liquid-text-demo`

## Coding Style & Naming
- TypeScript: `strict: true`. 명시적 타입 사용, `any` 지양.
- ESLint: Flat config(`eslint.config.mjs`), `next/core-web-vitals`, `next/typescript` 기반. 무시 경로는 `.next`, `out`, `build`, `node_modules` 등.
- 컴포넌트: export 이름은 PascalCase. 파일명은 kebab-case 권장(예: `variable-font-and-cursor.tsx`).
- 훅: 파일명은 `use-*.ts` 형태 권장, export는 `useXyz`. 신규 파일은 kebab-case로 통일(기존 camelCase는 점진 정리).
- 스타일: Tailwind CSS v4. 클래스 조합은 `src/lib/utils.ts`의 `cn()` 우선 사용.
- 클라이언트/서버 경계: 브라우저 API/훅/GSAP 사용 시에만 파일 상단에 `"use client"`를 명시. 그 외는 기본 서버 컴포넌트 유지.
- 임포트 경로: `@/*` 별칭 사용(설정: `tsconfig.json`의 `paths`). 상대경로 난립 지양.

## UI/Features 패턴
- DeviceRenderer 패턴: 반응형 분기(모바일/태블릿/데스크톱)를 `src/components/DeviceRenderer.tsx`로 캡슐화합니다.
  - feature 구성 예시: `Desktop.tsx`, `Mobile.tsx`, `index.tsx`에서 `DeviceRenderer`로 묶어 export.
  - 디바이스 판별은 `useDevice()` 훅(`src/hooks/useDevice.ts`) 사용. SSR 안전 기본값을 유지하고 리사이즈 이벤트로 동기화.
- 이미지: `next/image` 사용 권장. 외부 도메인은 `next.config.ts`의 `images.remotePatterns`에 등록.

- 커서 스코프: `src/components/lightswind/cursor-scope.tsx`를 통해 커스텀 커서를 섹션 단위로 스코프합니다.
  - 네이티브 커서를 사용해야 하는 영역은 컨테이너에 `data-native-cursor` 속성을 부여합니다.
  - 커서 색상 자동 반전(`autoInvertByBackground`) 기능이 있어 배경이 복잡한 경우에도 가독성을 유지합니다.

## Animations & GSAP
- 플러그인 등록: 필요한 범위에서 `gsap.registerPlugin(...)`을 수행하고, `gsap.context(...)`와 함께 사용.
- 클린업: `const ctx = gsap.context(...); return () => ctx.revert()` 패턴으로 메모리 누수 방지.
- 접근성: `prefers-reduced-motion` 대응. 스크럽/애니메이션 강도 낮춤 또는 비활성화 처리.
- 성능: 스크롤/포인터 핸들러는 `requestAnimationFrame` 등으로 스로틀링(예: `use-mouse-position.ts`). DOM 참조는 갱신 시 재검증.

### Motion 라이브러리
- 애니메이션/모션은 `motion` 패키지(`import { motion } from 'motion/react'`)로 통일합니다.
- `framer-motion`과의 혼용은 번들 중복을 야기할 수 있으므로 신규 구현에서는 `motion`만 사용합니다.

## Tailwind CSS v4
- 구성: `postcss.config.mjs`에서 `@tailwindcss/postcss` 사용. 커스텀 토큰은 `globals.css`의 `@theme inline`에 정의.
- 프리셋/레이어: `@import "tailwindcss";` 후 유틸리티 사용. 전역 토큰(`--color-*, --radius-*`) 및 다크 모드 토큰 정의.
- 애니메이션: `tw-animate-css` 플러그인 사용 가능. 무분별한 전역 애니메이션은 지양.

전역 스타일 가이드:
- 특정 섹션 강제 스타일링(예: `!important` 전역 셀렉터)은 지양하고, 컴포넌트 스코프 클래스 기반으로 스타일을 한정합니다.
- 레이아웃/애니메이션 초기 상태는 가급적 GSAP `set` 또는 컴포넌트 스코프 CSS로 제한합니다.

## Testing Guidelines
- 현재 테스트 러너는 구성되어 있지 않습니다. 추가 시 권장:
  - Unit: Vitest + React Testing Library (`*.test.ts(x)`), 구현 파일과 최대한 근접 배치.
  - E2E: Playwright(애니메이션/인터랙션 확인).
- 테스트 위치: 기능별 폴더에 동거 또는 `src/__tests__/` 사용.

행동 중심 테스트 권장:
- 구현 세부가 아닌 동작 결과를 검증합니다(사용자 시나리오/상태 변화 중심).
- 애니메이션의 시간 의존성은 `prefers-reduced-motion` 모드로 분기해 결정적 테스트를 지향합니다.

## Commit & PR
- 커밋 메시지: 명령형/간결. 예: `feat(intro): add MultiQuoteTyping component`.
- PR: 목적, 관련 이슈, UI/애니메이션 변경은 스크린샷/GIF 첨부.
- 체크리스트:
  - `npm run lint` 통과, 타입 체크 `npx tsc --noEmit` 통과.
  - 시크릿/민감정보 미포함, `public/`에는 필요한 에셋만 포함.

## Accessibility & Quality
- 모션 선호: `prefers-reduced-motion` 존중(현재 일부 섹션에서 반영). 새로운 애니메이션도 동일 정책 적용.
- 시맨틱 마크업: 헤딩/문단 등 적절한 태그 사용. 이미지 `alt` 필수.
- SSR 안전: 브라우저 전역(`window`, `document`) 접근은 `useEffect` 이후로 제한하거나 안전 가드 적용.

추가 가이드:
- 링크/인터랙티브 요소는 `:focus-visible` 스타일을 제공하고 키보드 내비게이션을 보장합니다.
- Hover 미리보기 이미지(예: `RevealText`)의 `alt`는 의미 있는 설명을 제공합니다.

## Security & Configuration
- 환경변수: `.env.local` 사용, `.env*` 커밋 금지. 클라이언트 노출이 필요한 키는 `NEXT_PUBLIC_*` 접두사.
- 서버-클라이언트 경계: 시크릿은 서버 컴포넌트/RSC/API Routes로 한정. 클라이언트 번들에 포함 금지.

이미지 도메인:
- 외부 이미지는 `next.config.ts`의 `images.remotePatterns`에 등록합니다. 기본적으로 `picsum.photos`가 허용되어 있습니다.

## 빠른 시작 가이드
1) `npm install`
2) `npm run dev` 후 http://localhost:3000 접속
3) 기본 인트로(스크롤 시퀀스/리빌) 확인 → 상호작용/애니메이션 변경은 관련 feature 컴포넌트만 수정하고 `DeviceRenderer` 패턴 유지
4) 데모 확인: `/test-preview/bg-pattern-demo`, `/test-preview/liquid-text-demo`

## Cursor Rules(원문 수록 및 준수 선언)
다음 규칙들은 `.cursor/rules`에 정의된 팀 규칙입니다. 본 저장소 작업 시 항상 준수합니다. 다만 Next.js App Router 구조상 서버/클라이언트 컴포넌트가 공존하므로, 규칙이 충돌할 경우 빌드 가능성과 프레임워크 제약을 우선합니다. 특히 애니메이션/상호작용 UI, 브라우저 API, 훅 사용 시에만 클라이언트 컴포넌트를 사용합니다.

### .cursor/rules/global.mdc

```
---
description: Common Guideline
globs: 
alwaysApply: true
---


# Senior Developer Guidelines

## Must

- always use client component for all components. (use `use client` directive)
- always use promise for page.tsx params props.
- use valid picsum.photos stock image for placeholder image

## Library

use following libraries for specific functionalities:

1. `date-fns`: For efficient date and time handling.
2. `ts-pattern`: For clean and type-safe branching logic.
3. `@tanstack/react-query`: For server state management.
4. `zustand`: For lightweight global state management.
5. `react-use`: For commonly needed React hooks.
6. `es-toolkit`: For robust utility functions.
7. `lucide-react`: For customizable icons.
8. `zod`: For schema validation and data integrity.
9. `shadcn-ui`: For pre-built accessible UI components.
10. `tailwindcss`: For utility-first CSS styling.
11. `supabase`: For a backend-as-a-service solution.
12. `react-hook-form`: For form validation and state management.

## Directory Structure

- src
- src/app: Next.js App Routers
- src/components/ui: shadcn-ui components
- src/constants: Common constants
- src/hooks: Common hooks
- src/lib: utility functions
- src/remote: http client
- src/features/[featureName]/components/*: Components for specific feature
- src/features/[featureName]/constants/*
- src/features/[featureName]/hooks/*
- src/features/[featureName]/lib/*
- src/features/[featureName]/api.ts: api fetch functions

## Solution Process:

1. Rephrase Input: Transform to clear, professional prompt.
2. Analyze & Strategize: Identify issues, outline solutions, define output format.
3. Develop Solution:
   - "As a senior-level developer, I need to [rephrased prompt]. To accomplish this, I need to:"
   - List steps numerically.
   - "To resolve these steps, I need the following solutions:"
   - List solutions with bullet points.
4. Validate Solution: Review, refine, test against edge cases.
5. Evaluate Progress:
   - If incomplete: Pause, inform user, await input.
   - If satisfactory: Proceed to final output.
6. Prepare Final Output:
   - ASCII title
   - Problem summary and approach
   - Step-by-step solution with relevant code snippets
   - Format code changes:
     ```language:path/to/file
     // ... existing code ...
     function exampleFunction() {
         // Modified or new code here
     }
     // ... existing code ...
     ```
   - Use appropriate formatting
   - Describe modifications
   - Conclude with potential improvements

## Key Mindsets:

1. Simplicity
2. Readability
3. Maintainability
4. Testability
5. Reusability
6. Functional Paradigm
7. Pragmatism

## Code Guidelines:

1. Early Returns
2. Conditional Classes over ternary
3. Descriptive Names
4. Constants > Functions
5. DRY
6. Functional & Immutable
7. Minimal Changes
8. Pure Functions
9. Composition over inheritance

## Functional Programming:

- Avoid Mutation
- Use Map, Filter, Reduce
- Currying and Partial Application
- Immutability

## Code-Style Guidelines

- Use TypeScript for type safety.
- Follow the coding standards defined in the ESLint configuration.
- Ensure all components are responsive and accessible.
- Use Tailwind CSS for styling, adhering to the defined color palette.
- When generating code, prioritize TypeScript and React best practices.
- Ensure that any new components are reusable and follow the existing design patterns.
- Minimize the use of AI generated comments, instead use clearly named variables and functions.
- Always validate user inputs and handle errors gracefully.
- Use the existing components and pages as a reference for the new components and pages.

## Performance:

- Avoid Premature Optimization
- Profile Before Optimizing
- Optimize Judiciously
- Document Optimizations

## Comments & Documentation:

- Comment function purpose
- Use JSDoc for JS
- Document "why" not "what"

## Function Ordering:

- Higher-order functionality first
- Group related functions

## Handling Bugs:

- Use TODO: and FIXME: comments

## Error Handling:

- Use appropriate techniques
- Prefer returning errors over exceptions

## Testing:

- Unit tests for core functionality
- Consider integration and end-to-end tests

## Next.js

- you must use promise for page.tsx params props.

## Shadcn-ui

- if you need to add new component, please show me the installation instructions. I'll paste it into terminal.
- example
  ```
  $ npx shadcn@latest add card
  $ npx shadcn@latest add textarea
  $ npx shadcn@latest add dialog
  ```

## Supabase

- if you need to add new table, please create migration. I'll paste it into supabase.
- do not run supabase locally
- store migration query for `.sql` file. in /supabase/migrations/

## Package Manager

- use npm as package manager.

## Korean Text

- 코드를 생성한 후에 utf-8 기준으로 깨지는 한글이 있는지 확인해주세요. 만약 있다면 수정해주세요.

You are a senior full-stack developer, one of those rare 10x devs. Your focus: clean, maintainable, high-quality code.
Apply these principles judiciously, considering project and team needs.
```

### .cursor/rules/clean-code.mdc

```
---
description:
globs:
alwaysApply: true
---

# Clean Code Guidelines

You are an expert software engineer focused on writing clean, maintainable code. Follow these principles rigorously:

## Core Principles
- **DRY** - Eliminate duplication ruthlessly
- **KISS** - Simplest solution that works
- **YAGNI** - Build only what's needed now
- **SOLID** - Apply all five principles consistently
- **Boy Scout Rule** - Leave code cleaner than found

## Naming Conventions
- Use **intention-revealing** names
- Avoid abbreviations except well-known ones (e.g., URL, API)
- Classes: **nouns**, Methods: **verbs**, Booleans: **is/has/can** prefix
- Constants: UPPER_SNAKE_CASE
- No magic numbers - use named constants

## Functions & Methods
- **Single Responsibility** - one reason to change
- Maximum 20 lines (prefer under 10)
- Maximum 3 parameters (use objects for more)
- No side effects in pure functions
- Early returns over nested conditions

## Code Structure
- **Cyclomatic complexity** < 10
- Maximum nesting depth: 3 levels
- Organize by feature, not by type
- Dependencies point inward (Clean Architecture)
- Interfaces over implementations

## Comments & Documentation
- Code should be self-documenting
- Comments explain **why**, not what
- Update comments with code changes
- Delete commented-out code immediately
- Document public APIs thoroughly

## Error Handling
- Fail fast with clear messages
- Use exceptions over error codes
- Handle errors at appropriate levels
- Never catch generic exceptions
- Log errors with context

## Testing
- **TDD** when possible
- Test behavior, not implementation
- One assertion per test
- Descriptive test names: `should_X_when_Y`
- **AAA pattern**: Arrange, Act, Assert
- Maintain test coverage > 80%

## Performance & Optimization
- Profile before optimizing
- Optimize algorithms before micro-optimizations
- Cache expensive operations
- Lazy load when appropriate
- Avoid premature optimization

## Security
- Never trust user input
- Sanitize all inputs
- Use parameterized queries
- Follow **principle of least privilege**
- Keep dependencies updated
- No secrets in code

## Version Control
- Atomic commits - one logical change
- Imperative mood commit messages
- Reference issue numbers
- Branch names: `type/description`
- Rebase feature branches before merging

## Code Reviews
- Review for correctness first
- Check edge cases
- Verify naming clarity
- Ensure consistent style
- Suggest improvements constructively

## Refactoring Triggers
- Duplicate code (Rule of Three)
- Long methods/classes
- Feature envy
- Data clumps
- Divergent change
- Shotgun surgery

## Final Checklist
Before committing, ensure:
- [ ] All tests pass
- [ ] No linting errors
- [ ] No console logs
- [ ] No commented code
- [ ] No TODOs without tickets
- [ ] Performance acceptable
- [ ] Security considered
- [ ] Documentation updated

Remember: **Clean code reads like well-written prose**. Optimize for readability and maintainability over cleverness.

```

### .cursor/rules/frontend.mdc

```
---
alwaysApply: true
---
# Frontend Testing Guidelines

## Testing Philosophy and Core Principles

### ✅ DO: Focus on Behavior-Driven Testing
- Test application behavior from **user perspective**
- Concentrate on **business logic and data flow**
- Verify **side effects** of user interactions

### ❌ DON'T: Test Implementation Details
- Avoid testing component rendering itself
- Don't write tests that distrust the platform (React, Vue, etc.)
- Avoid tests that only verify event handler registration

```javascript
// ❌ Testing implementation details
test('should render button element', () => {
  const { getByRole } = render(<Button />)
  expect(getByRole('button')).toBeInTheDocument()
})

// ✅ Behavior-driven testing
test('should update user status when button is clicked', () => {
  const { getByText } = render(<UserProfile />)
  fireEvent.click(getByText('Activate'))
  expect(mockUpdateUserStatus).toHaveBeenCalledWith({ active: true })
})
```

---

## Architecture and Design

### ✅ DO: Separate Business Logic from UI Rendering
- Extract logic into **custom hooks**, **middleware**, **selectors**
- Components should only handle UI rendering
- Isolate logic into testable units

### ✅ DO: Design with Testing in Mind
- Hard-to-test code signals design problems
- Maximize pure function usage
- Design external dependencies to be injectable

```javascript
// ✅ Testable structure
const useUserManagement = () => {
  const updateUser = useCallback((userData) => {
    // Business logic
    return userService.update(userData)
  }, [])
  
  return { updateUser }
}

// ✅ Component handles UI only
const UserProfile = () => {
  const { updateUser } = useUserManagement()
  
  return (
    <button onClick={() => updateUser({ active: true })}>
      Activate
    </button>
  )
}
```

---

## Test Writing Methodology

### ✅ DO: Use Given-When-Then Pattern
Template for consistent test writing:

```javascript
test('should [expected result]', () => {
  // Given: Prepare data and state for testing
  const mockData = { id: 1, name: 'John' }
  
  // When: Execute the action to test
  const result = processUser(mockData)
  
  // Then: Verify results
  expect(result).toEqual({ id: 1, name: 'John', processed: true })
})
```

### ✅ DO: One Intention Per Test Case
- Each test should contain only one assumption and one verification
- Enable quick identification of failure causes
- Write meaningful test names

### ❌ DON'T: Write Tests Dependent on External Factors
- Test results should be determined solely by assumptions
- Avoid dependencies on network, time, random values
- Ensure identical results for identical inputs

---

## Test Type Guidelines

### Unit Testing

#### ✅ DO: Actively Test Store Logic
```javascript
// Reducer testing
test('should update user when UPDATE_USER action is dispatched', () => {
  // Given
  const initialState = { user: null }
  const action = { type: 'UPDATE_USER', payload: { id: 1, name: 'John' } }
  
  // When
  const newState = userReducer(initialState, action)
  
  // Then
  expect(newState.user).toEqual({ id: 1, name: 'John' })
})

// Selector testing
test('should return active users only', () => {
  // Given
  const state = {
    users: [
      { id: 1, active: true },
      { id: 2, active: false }
    ]
  }
  
  // When
  const activeUsers = selectActiveUsers(state)
  
  // Then
  expect(activeUsers).toHaveLength(1)
  expect(activeUsers[0].id).toBe(1)
})
```

#### ✅ DO: Test Asynchronous Logic (Middleware)
```javascript
test('should handle user creation flow', async () => {
  // Given
  const userData = { name: 'John', email: 'john@example.com' }
  
  // When
  const { effects } = await expectSaga(createUserSaga)
    .provide([
      [matchers.call.fn(apiService.createUser), { id: 1, ...userData }]
    ])
    .put(loadingActions.start())
    .call(apiService.createUser, userData)
    .put(userActions.setUser({ id: 1, ...userData }))
    .put(loadingActions.finish())
    .run()
  
  // Then
  expect(effects).toBeDefined()
})
```

### Integration Testing

#### ✅ DO: Test Real User Scenarios
```javascript
test('should complete user registration flow', () => {
  // Given
  render(<RegistrationFlow />)
  
  // When
  fireEvent.change(screen.getByLabelText('Name'), { 
    target: { value: 'John Doe' } 
  })
  fireEvent.change(screen.getByLabelText('Email'), { 
    target: { value: 'john@example.com' } 
  })
  fireEvent.click(screen.getByText('Register'))
  
  // Then
  expect(screen.getByText('Registration successful')).toBeInTheDocument()
})
```

### ❌ DON'T: Overuse Certain Test Types

#### Avoid Snapshot Testing
- Fragile to changes and difficult to debug
- Detects changes rather than finding actual bugs
- Use only when regression testing is absolutely necessary

#### Use E2E Testing Judiciously
- Long execution time and high maintenance cost
- Very fragile to changes
- Apply only to core user scenarios

---

## Practical Testing Strategies

### ✅ DO: Leverage Storybook for Visual Validation
- Write page-level stories to verify complex states
- Reuse mock data for various scenario validation
- Enable quick UI bug identification and debugging

```javascript
// Page-level story example
const meta = {
  title: 'Pages/UserDashboard',
  component: UserDashboard,
  decorators: [
    withProvider({
      user: mockUserData,
      settings: mockSettingsData
    })
  ]
}

export const Default = {}
export const WithNotifications = {
  decorators: [
    withProvider({
      user: mockUserData,
      notifications: mockNotifications
    })
  ]
}
```

### ✅ DO: Prioritize Quality Over Coverage
- Avoid writing tests just to meet coverage metrics
- Focus on meaningful test cases
- Prioritize business-critical components

### ✅ DO: Establish Testing Strategy Based on Project Nature
```javascript
// Long-term projects: Comprehensive testing
describe('User Management', () => {
  // Include unit, integration, and visual tests
})

// Short-term event pages: Minimal testing
describe('Event Landing', () => {
  // Test only core functionality
  test('should track event participation', () => {
    // Business-critical parts only
  })
})
```

---

## Test Optimization

### ✅ DO: Manage Mock Data Efficiently
- Reuse mock data created for store tests
- Write mock factory functions for various state combinations
- Ensure independence between tests

```javascript
// Mock factory pattern
const createMockUser = (overrides = {}) => ({
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  active: true,
  ...overrides
})

// Usage example
test('should handle inactive user', () => {
  const inactiveUser = createMockUser({ active: false })
  // Test logic
})
```

### ✅ DO: Consider Test Maintainability
- Extract repetitive test setup into helper functions
- Manage test data in separate files
- Design structure to minimize test breakage frequency

### ❌ DON'T: Test Platform Features
- Trust framework for React rendering, event handling, etc.
- Don't test browser API behavior
- Exclude basic functionality of third-party libraries

---

## Core Principles Summary

1. **Purpose Clarity**: Verify application works as users intend
2. **Design First**: Structure code to be easily testable
3. **Behavior Focus**: Concentrate on behavior, not implementation
4. **Efficiency**: Establish testing strategy considering ROI
5. **Practicality**: Flexible approach based on project characteristics

---

**Remember**: Testing is not about finding bugs, but creating **reliable software**. It provides a safety net for code changes, enabling **sustainable development**.
```

### .cursor/rules/frontend-mine.mdc

```
---
alwaysApply: true
---
You are an expert in Frontend Development with a strict focus on responsive design.

Key Principles
- Always design and implement components and layouts to be responsive.
- Ensure layouts adapt fluidly across different screen sizes (mobile, tablet, desktop).
- Use flexible units (%, rem, em, vw, vh) instead of fixed pixel values whenever possible.
- Use CSS Grid and Flexbox for adaptive and scalable layouts.
- Define and use consistent breakpoints for small, medium, and large screens.
- Test across multiple devices, browsers, and orientations.
- Use responsive images (srcset, sizes, picture) and lazy loading where appropriate.
- Ensure touch targets and interactive elements remain usable across all devices.
- Avoid fixed-width layouts; prefer fluid and scalable structures.

Key Conventions
1. Every component and page must work seamlessly on both small and large screens.
2. Always validate responsiveness before finalizing any implementation.
3. Favor performance optimizations that maintain responsiveness across devices.

# 특정 코드를 수정할때 다른 파트, 섹션에 영향을 끼칠 수 있는지 철저히 검토하시오
```

### .cursor/rules/tdd.mdc

```
---
description: 
globs: 
alwaysApply: true
---

# TDD Process Guidelines - Cursor Rules

## ⚠️ MANDATORY: Follow these rules for EVERY implementation and modification

**This document defines the REQUIRED process for all code changes. No exceptions without explicit team approval.**

## Core Cycle: Red → Green → Refactor

### 1. RED Phase
- Write a failing test FIRST
- Test the simplest scenario
- Verify test fails for the right reason
- One test at a time

### 2. GREEN Phase  
- Write MINIMAL code to pass
- "Fake it till you make it" is OK
- No premature optimization
- YAGNI principle

### 3. REFACTOR Phase
- Remove duplication
- Improve naming
- Simplify structure
- Keep tests passing

## Test Quality: FIRST Principles
- **Fast**: Milliseconds, not seconds
- **Independent**: No shared state
- **Repeatable**: Same result every time
- **Self-validating**: Pass/fail, no manual checks
- **Timely**: Written just before code

## Test Structure: AAA Pattern
```
// Arrange
Set up test data and dependencies

// Act
Execute the function/method

// Assert
Verify expected outcome
```

## Implementation Flow
1. **List scenarios** before coding
2. **Pick one scenario** → Write test
3. **Run test** → See it fail (Red)
4. **Implement** → Make it pass (Green)
5. **Refactor** → Clean up (Still Green)
6. **Commit** → Small, frequent commits
7. **Repeat** → Next scenario

## Test Pyramid Strategy
- **Unit Tests** (70%): Fast, isolated, numerous
- **Integration Tests** (20%): Module boundaries
- **Acceptance Tests** (10%): User scenarios

## Outside-In vs Inside-Out
- **Outside-In**: Start with user-facing test → Mock internals → Implement details
- **Inside-Out**: Start with core logic → Build outward → Integrate components

## Common Anti-patterns to Avoid
- Testing implementation details
- Fragile tests tied to internals  
- Missing assertions
- Slow, environment-dependent tests
- Ignored failing tests

## When Tests Fail
1. **Identify**: Regression, flaky test, or spec change?
2. **Isolate**: Narrow down the cause
3. **Fix**: Code bug or test bug
4. **Learn**: Add missing test cases

## Team Practices
- CI/CD integration mandatory
- No merge without tests
- Test code = Production code quality
- Pair programming for complex tests
- Regular test refactoring

## Pragmatic Exceptions
- UI/Graphics: Manual + snapshot tests
- Performance: Benchmark suites
- Exploratory: Spike then test
- Legacy: Test on change

## Remember
- Tests are living documentation
- Test behavior, not implementation
- Small steps, fast feedback
- When in doubt, write a test
```

### .cursor/rules/supabase.mdc

```
---
description: Supabase Migration SQL Guideline
globs: supabase/migrations/*.sql
---

# Supabase Migration SQL Guideline

## Must
- Each migration file must have a unique name with number prefix (e.g., `0001_create_users_table.sql`)
- Each migration must be idempotent (can be run multiple times without error)
- Use `CREATE TABLE IF NOT EXISTS` instead of just `CREATE TABLE`
- Include proper error handling with `BEGIN` and `EXCEPTION` blocks
- Add comments for complex operations
- Always specify column types explicitly
- Include proper constraints (NOT NULL, UNIQUE, etc.) where appropriate
- Add updated_at column to all tables, and use trigger to update it
- always check other migrations to avoid conflicts

## Should
- Keep migrations small 
- Use consistent naming conventions for tables and columns
- Use snake_case for all identifiers
- Document breaking changes

## Recommended Patterns
- Use RLS (Row Level Security) for access control
- Set up proper indexes for frequently queried columns
- Use foreign key constraints to maintain referential integrity
- Leverage Postgres extensions when appropriate
- Use enums for fields with a fixed set of values
- Consider using views for complex queries

## Schema Organization
- Group related tables together
- Use schemas to organize tables by domain
- Consider using Postgres schemas for multi-tenant applications
- Keep authentication tables in the auth schema

## Performance Considerations
- Avoid adding/removing columns from large tables in production
- Use appropriate data types to minimize storage
- Add indexes strategically (not excessively)

## Security Best Practices
- Never store plaintext passwords
- Use RLS policies to restrict data access
- Sanitize all user inputs
```
