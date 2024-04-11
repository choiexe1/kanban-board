# 칸반보드 프로젝트

### 데이터 모델링

- [관계형 데이터베이스 개념적 설계 ERD]('./docs/칸반보드_개념_ERD.webp')

- [관계형 데이터베이스 논리적 설계 ERD]('./docs/칸반보드_논리_ERD.webp')

### 테스트 자동화

서비스 계층의 단위 테스트는 모두 `*.spec.ts` 파일에 정의 되어 있습니다.

[LocalGuard]('./src/auth/guard/local-auth.guard.spec.ts')와 [LocalStrategy]('./src/auth/strategy/local.strategy.spec.ts')도 현재 단위 테스트가 작성되어 있지만, 차후에 인터셉터나 데코레이터들이 많아지면 테스트 작성이 복잡하고 어렵기 때문에 생산성을 위하여 컨트롤러 계층의 테스트는 종단 테스트 시에 함께 작성합니다.

> [app.e2e-spec.ts 살펴보기]('./test/app.e2e-spec.ts')

### 지속적 통합 (CI)

빌드, 단위 테스트, 종단 테스트 등 지속적 통합을 위해 Github Actions를 사용하고 있습니다.

> [ci.yml 살펴보기]('./.github/workflows/ci.yml')
