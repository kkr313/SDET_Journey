# Playwright Automation Complete Guide (Beginner to Advanced)

> **A comprehensive, enterprise-grade guide covering Playwright from fundamentals to advanced patterns, CI/CD integration, and modern test engineering practices for SDET interviews and real-world projects.**

---

## Complete Table of Contents

1. [Overview & Core Concepts](#1-overview--core-concepts)
2. [Installation & Project Bootstrap](#2-installation--project-bootstrap)
3. [Architecture Patterns](#3-architecture-patterns)
4. [Browsers, Contexts, Pages, Frames & Workers](#4-browsers-contexts-pages-frames--workers)
5. [Selectors & Locator Strategies](#5-selectors--locator-strategies)
6. [Auto-Waiting, Timeouts & Stability](#6-auto-waiting-timeouts--stability)
7. [Test Runner Essentials](#7-test-runner-essentials)
8. [Assertions & Matchers](#8-assertions--matchers)
9. [UI Automation Deep Dive](#9-ui-automation-deep-dive)
10. [API Testing with Playwright](#10-api-testing-with-playwright)
11. [Data Management & Environment Strategy](#11-data-management--environment-strategy)
12. [Parallelism, Sharding & Scaling](#12-parallelism-sharding--scaling)
13. [Reporting, Tracing & Artifacts](#13-reporting-tracing--artifacts)
14. [Debugging & Diagnostics](#14-debugging--diagnostics)
15. [Performance, Network & Accessibility](#15-performance-network--accessibility)
16. [Security & Reliability](#16-security--reliability)
17. [CI/CD Integration (Jenkins)](#17-cicd-integration-jenkins)
18. [Docker & Containerization](#18-docker--containerization)
19. [Advanced Patterns](#19-advanced-patterns)
20. [AI Agents & Quality Intelligence](#20-ai-agents--quality-intelligence)
21. [Playwright + Other Tools](#21-playwright--other-tools)
22. [Observability & Monitoring](#22-observability--monitoring)
23. [Cross-Browser & Cross-Device Strategy](#23-cross-browser--cross-device-strategy)
24. [Common Abbreviations](#24-common-abbreviations)
25. [VS Code Productivity](#25-vs-code-productivity)
26. [Migration Guide](#26-migration-guide)
27. [CLI Command Reference](#27-cli-command-reference)
28. [Test Architecture for Large Teams](#28-test-architecture-for-large-teams)
29. [Team Practices & QA Processes](#29-team-practices--qa-processes)
30. [Reference Appendices](#30-reference-appendices)

---

## 1. Overview & Core Concepts

### 1.1 Why Playwright?

**Playwright** is a modern, open-source end-to-end testing framework developed by Microsoft that enables reliable cross-browser web automation.

#### Core Capabilities

| Capability | Description |
|------------|-------------|
| **Cross-Browser** | Chromium, Firefox, WebKit (Safari) - single API |
| **Cross-Platform** | Windows, Linux, macOS support |
| **Multi-Language** | TypeScript, JavaScript, Python, Java, .NET |
| **Auto-Waiting** | Built-in smart waits for actionable elements |
| **Network Control** | Intercept, mock, modify network requests |
| **Mobile Emulation** | Device emulation without real devices |
| **API Testing** | Native REST/GraphQL testing capabilities |
| **Parallel Execution** | Run tests concurrently across workers |
| **Trace Viewer** | Visual debugging with time-travel |
| **Component Testing** | Test React/Vue/Svelte components in isolation |

#### Limitations

- **No IE11 Support**: Only modern browsers
- **Mobile Native Apps**: Cannot test iOS/Android native apps (use Appium)
- **Desktop Apps**: Web-only, not for Electron/desktop automation
- **Learning Curve**: Async/await and modern JS knowledge required
- **Memory Intensive**: Browser instances consume significant resources

#### Playwright vs Selenium

| Aspect | Playwright | Selenium |
|--------|-----------|----------|
| **Architecture** | Browser DevTools Protocol | WebDriver W3C |
| **Auto-Waiting** | Built-in | Manual waits needed |
| **Setup** | Simple npm install | Complex driver management |
| **Speed** | Very Fast | Slower |
| **API Testing** | Native | Requires RestAssured |
| **Network Mocking** | Built-in | Requires BrowserMob |
| **Trace Viewer** | Advanced | None |
| **Multi-Tab/Window** | Full support | Limited |
| **Shadow DOM** | Native support | Complex |

#### Playwright vs Cypress

| Aspect | Playwright | Cypress |
|--------|-----------|----------|
| **Browser Support** | Chrome, Firefox, Safari | Chrome family only |
| **Multi-Tab** | Yes | Limited |
| **Iframes** | Full support | Workarounds needed |
| **Languages** | Multiple | JS/TS only |
| **Network Stubbing** | Powerful | Good |
| **Mobile Testing** | Emulation + real | Emulation only |
| **CI Performance** | Faster | Fast |

---

### 1.2 Test Strategy & Pyramid

#### The Testing Pyramid

```
        /\
       /E2E\         <- 10% (Playwright UI)
      /------\
     /Integra-\      <- 20% (Playwright API + UI)
    /----------\
   /   Unit     \    <- 70% (Jest, Vitest, Mocha)
  /--------------\
```

#### Test Layer Distribution

| Layer | Purpose | Tools | Coverage |
|-------|---------|-------|----------|
| **Unit Tests** | Individual functions/components | Jest, Vitest, Mocha | 70% |
| **Integration Tests** | API contracts, service interactions | Playwright API, Pact | 20% |
| **E2E Tests** | Critical user journeys | Playwright UI | 10% |

#### When to Use Each Layer

**Unit Tests (70%)**
- Business logic validation
- Utility functions
- Component rendering (React Testing Library)
- Fast feedback (< 1 second per test)

**Integration Tests (20%)**
- API contract validation
- Database interactions
- Third-party service mocking
- Authentication flows

**E2E Tests (10%)**
- Critical user paths (login, checkout, payment)
- Cross-browser compatibility
- Visual regression
- Use sparingly - expensive to maintain

---

### 1.3 Core Terminology

#### Browser
The browser instance (Chromium/Firefox/WebKit). Expensive to create.

```typescript
const browser = await chromium.launch();
```

#### Browser Context
Isolated incognito-like session. Cheap to create, provides isolation.

```typescript
const context = await browser.newContext();
// Isolated cookies, localStorage, sessionStorage
```

#### Page
Individual tab/page within a context.

```typescript
const page = await context.newPage();
await page.goto('https://example.com');
```

#### Frame
Iframe or frame element within a page.

```typescript
const frame = page.frame('iframe-name');
```

#### Workers
Parallel test execution processes. Controlled by `workers` config.

```typescript
// playwright.config.ts
workers: process.env.CI ? 2 : 4
```

#### Locator
Handle to find element(s) on the page. Auto-retrying and auto-waiting.

```typescript
const button = page.locator('button.submit');
await button.click(); // Auto-waits until actionable
```

---

### 1.4 Reliability Engineering Principles

#### Determinism
Tests must produce same results every run.

**Non-Deterministic (Bad):**
```typescript
await page.waitForTimeout(3000); // Arbitrary wait
const date = new Date(); // Current time varies
```

**Deterministic (Good):**
```typescript
await page.waitForSelector('.loaded');
const date = new Date('2024-01-01'); // Fixed date
```

#### Idempotency
Tests can run multiple times without side effects.

**Not Idempotent (Bad):**
```typescript
test('create user', async () => {
  await createUser('john@example.com'); // Fails on second run
});
```

**Idempotent (Good):**
```typescript
test('create user', async () => {
  await deleteUserIfExists('john@example.com');
  await createUser('john@example.com');
});
```

#### Isolation
Tests must not depend on each other.

**Coupled (Bad):**
```typescript
test('login', async () => { /* sets global token */ });
test('dashboard', async () => { /* expects token */ });
```

**Isolated (Good):**
```typescript
test('dashboard', async ({ authenticatedPage }) => {
  // Uses fixture with independent auth
});
```

---

### 1.5 When to Choose Test Types

#### UI vs API vs Contract vs Visual

| Test Type | When to Use | Example |
|-----------|-------------|---------|
| **UI Tests** | Critical user flows, cross-browser | Login, Checkout |
| **API Tests** | Backend logic, data validation | CRUD operations, Auth |
| **Contract Tests** | Service boundaries, microservices | Pact consumer/provider |
| **Visual Tests** | Layout, styling, responsiveness | Homepage renders correctly |

#### Decision Matrix

```
Is it a critical user journey?
  ├─ YES → UI Test
  └─ NO → Is it API-only logic?
            ├─ YES → API Test
            └─ NO → Is it service integration?
                      ├─ YES → Contract Test
                      └─ NO → Is it visual change?
                                ├─ YES → Visual Test
                                └─ NO → Unit Test
```

---

### 1.6 Playwright Release Cadence & Versioning

#### Release Schedule
- **Frequency**: Monthly releases
- **LTS Versions**: Every 6 months
- **Support Period**: 6 months for LTS

#### Versioning Guidelines

```json
{
  "dependencies": {
    "@playwright/test": "^1.40.0"  // Allow minor updates
  }
}
```

#### Upgrade Strategy

1. **Check Release Notes**: [playwright.dev/docs/release-notes](https://playwright.dev/docs/release-notes)
2. **Update Dependencies**: `npm update @playwright/test`
3. **Update Browsers**: `npx playwright install`
4. **Run Smoke Tests**: Verify critical paths
5. **Monitor for Breaking Changes**: Review deprecations

---

## 2. Installation & Project Bootstrap

### 2.1 Language Flavors

Playwright supports multiple programming languages:

| Language | Package | Best For |
|----------|---------|----------|
| **TypeScript** | `@playwright/test` | Type safety, IDE support, large projects |
| **JavaScript** | `@playwright/test` | Quick prototyping, simpler syntax |
| **Python** | `playwright` | Data science teams, ML integration |
| **Java** | `com.microsoft.playwright` | Enterprise Java shops |
| **.NET (C#)** | `Microsoft.Playwright` | .NET/Azure ecosystem |

#### TypeScript Setup (Recommended)

```bash
npm init playwright@latest
# Select TypeScript when prompted
```

#### JavaScript Setup

```bash
npm init playwright@latest
# Select JavaScript when prompted
```

#### Python Setup

```bash
pip install playwright
playwright install
```

---

### 2.2 Scaffolding & Package Managers

#### NPM (Default)

```bash
npm init playwright@latest
npm install -D @playwright/test
npx playwright install
```

#### Yarn

```bash
yarn create playwright
yarn add -D @playwright/test
yarn playwright install
```

#### PNPM (Fast, disk-efficient)

```bash
pnpm create playwright
pnpm add -D @playwright/test
pnpm exec playwright install
```

#### Project Structure After Scaffolding

```
my-playwright-project/
├── node_modules/
├── tests/
│   └── example.spec.ts
├── tests-examples/
│   └── demo-todo-app.spec.ts
├── playwright.config.ts          # Main config
├── package.json
├── package-lock.json
└── .gitignore
```

---

### 2.3 Browser Binaries, WebKit/Firefox/Chromium Setup

#### Install All Browsers

```bash
npx playwright install        # Chromium, Firefox, WebKit
```

#### Install Specific Browser

```bash
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

#### Install with System Dependencies (Linux)

```bash
npx playwright install --with-deps
```

#### Browser Storage Locations

| OS | Path |
|----|------|
| **Windows** | `%USERPROFILE%\AppData\Local\ms-playwright` |
| **macOS** | `~/Library/Caches/ms-playwright` |
| **Linux** | `~/.cache/ms-playwright` |

#### Custom Browser Path

```bash
# Set custom download location
export PLAYWRIGHT_BROWSERS_PATH=$HOME/pw-browsers
npx playwright install
```

---

### 2.4 playwright.config Essentials

#### Basic Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Test directory
  testDir: './tests',
  
  // Timeout for each test
  timeout: 30 * 1000,
  
  // Expect timeout
  expect: {
    timeout: 5000
  },
  
  // Run tests in parallel
  fullyParallel: true,
  
  // Fail build on CI if tests use test.only
  forbidOnly: !!process.env.CI,
  
  // Retry failed tests
  retries: process.env.CI ? 2 : 0,
  
  // Number of parallel workers
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter
  reporter: 'html',
  
  // Shared settings
  use: {
    // Base URL
    baseURL: 'http://localhost:3000',
    
    // Collect trace on first retry
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on failure
    video: 'retain-on-failure',
  },

  // Browser projects
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile viewports
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Run local dev server before tests
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

#### Key Config Options

| Option | Purpose | Values |
|--------|---------|--------|
| `testDir` | Where test files are located | `'./tests'`, `'./e2e'` |
| `timeout` | Global test timeout (ms) | `30000`, `60000` |
| `retries` | Retry failed tests | `0`, `1`, `2` |
| `workers` | Parallel execution workers | `1`, `4`, `undefined` (auto) |
| `fullyParallel` | Run tests in files in parallel | `true`, `false` |
| `reporter` | Test result reporting | `'html'`, `'list'`, `'json'` |
| `use.baseURL` | Base URL for navigation | `'http://localhost:3000'` |
| `use.trace` | When to collect traces | `'on'`, `'off'`, `'on-first-retry'` |

---

### 2.5 Environment Variables, .env Files, Secrets & Vaults

#### Using .env Files

**Install dotenv:**

```bash
npm install -D dotenv
```

**Create .env file:**

```bash
# .env
BASE_URL=https://staging.example.com
API_KEY=your-api-key-here
USERNAME=testuser@example.com
PASSWORD=SecurePass123
```

**Load in config:**

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL,
  },
});
```

**Access in tests:**

```typescript
test('login with env credentials', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#username', process.env.USERNAME!);
  await page.fill('#password', process.env.PASSWORD!);
});
```

#### Environment-Specific Configs

```typescript
// playwright.config.ts
const ENV = process.env.ENV || 'dev';

const envConfigs = {
  dev: {
    baseURL: 'http://localhost:3000',
    workers: 4,
  },
  staging: {
    baseURL: 'https://staging.example.com',
    workers: 2,
  },
  production: {
    baseURL: 'https://example.com',
    workers: 1,
  },
};

export default defineConfig({
  use: {
    baseURL: envConfigs[ENV].baseURL,
  },
  workers: envConfigs[ENV].workers,
});
```

Run against staging:
```bash
ENV=staging npx playwright test
```

#### Secrets Management Best Practices

| Method | Use Case | Security Level |
|--------|----------|----------------|
| **.env file** | Local development | Low (add to .gitignore) |
| **CI/CD Variables** | Pipeline secrets | Medium |
| **Azure Key Vault** | Enterprise secrets | High |
| **AWS Secrets Manager** | Cloud deployments | High |
| **HashiCorp Vault** | Multi-cloud | Very High |

**Never commit secrets to Git:**

```bash
# .gitignore
.env
.env.local
.env.*.local
secrets/
```

---

### 2.6 Local vs Dockerized Bootstrap

#### Local Setup (Quick Start)

**Pros:** Fast, easy debugging, IDE integration  
**Cons:** Platform-specific issues, browser version drift

```bash
npm init playwright@latest
npx playwright test
```

#### Dockerized Setup (Reproducible)

**Pros:** Consistent environment, matches CI, isolated  
**Cons:** Slower, requires Docker knowledge

**Dockerfile:**

```dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy test files
COPY . .

# Run tests
CMD ["npx", "playwright", "test"]
```

**Build & Run:**

```bash
# Build image
docker build -t playwright-tests .

# Run tests
docker run --rm playwright-tests

# Run with volume mount (for development)
docker run --rm -v $(pwd):/app playwright-tests
```

#### Docker Compose Setup

```yaml
# docker-compose.yml
version: '3.8'

services:
  playwright:
    image: mcr.microsoft.com/playwright:v1.40.0-jammy
    volumes:
      - .:/app
    working_dir: /app
    command: npx playwright test
    environment:
      - CI=true
```

```bash
docker-compose run playwright
```

---

### 2.7 Monorepo vs Multi-Repo Considerations

#### Monorepo Structure

```
my-monorepo/
├── apps/
│   ├── web-app/
│   └── admin-app/
├── packages/
│   ├── ui-components/
│   └── utils/
└── e2e/
    ├── tests/
    │   ├── web-app/
    │   └── admin-app/
    ├── playwright.config.ts
    └── package.json
```

**Pros:**
- Shared test utilities
- Consistent tooling
- Easy cross-app testing
- Single CI pipeline

**Cons:**
- Longer CI times
- Tight coupling
- Complex dependency management

#### Multi-Repo Structure

```
web-app/
  ├── src/
  └── e2e/

admin-app/
  ├── src/
  └── e2e/
```

**Pros:**
- Independent deployments
- Faster CI (per repo)
- Team autonomy
- Clear ownership

**Cons:**
- Code duplication
- Harder to share utilities
- Inconsistent patterns

#### Hybrid Approach (Recommended)

```
my-org/
├── shared-e2e-utils/        # NPM package
│   ├── fixtures/
│   ├── helpers/
│   └── custom-matchers/
├── web-app/
│   └── e2e/                 # Uses shared-e2e-utils
└── admin-app/
    └── e2e/                 # Uses shared-e2e-utils
```

---

## 3. Architecture Patterns

### 3.1 Folder / Layered Architecture

#### Recommended Folder Structure

```
playwright-project/
├── tests/
│   ├── auth/
│   │   ├── login.spec.ts
│   │   └── signup.spec.ts
│   ├── e2e/
│   │   ├── checkout.spec.ts
│   │   └── user-journey.spec.ts
│   └── api/
│       ├── users-api.spec.ts
│       └── products-api.spec.ts
├── pages/                      # Page Objects
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   └── CheckoutPage.ts
├── fixtures/                   # Custom fixtures
│   ├── auth.fixture.ts
│   ├── test-data.fixture.ts
│   └── api-client.fixture.ts
├── helpers/                    # Utility functions
│   ├── date-utils.ts
│   ├── string-utils.ts
│   └── wait-helpers.ts
├── data/                       # Test data
│   ├── users.json
│   ├── products.json
│   └── test-config.json
├── lib/                        # Business logic
│   ├── api/
│   │   ├── UserAPI.ts
│   │   └── ProductAPI.ts
│   └── services/
│       └── DataService.ts
├── config/                     # Configuration files
│   ├── environments.ts
│   └── constants.ts
├── playwright.config.ts
└── package.json
```

#### Layer Responsibilities

| Layer | Purpose | Example |
|-------|---------|---------|
| **tests/** | Test specifications | Describe user flows, scenarios |
| **pages/** | Page Objects | Encapsulate page interactions |
| **fixtures/** | Test setup/teardown | Auth state, data seeding |
| **helpers/** | Reusable utilities | Date formatting, waits |
| **data/** | Test data | JSON, CSV, static data |
| **lib/** | Business logic | API clients, services |
| **config/** | Environment settings | URLs, timeouts, constants |

---

### 3.2 Page Object Model (POM)

#### 3.2.0 Deep Dive: When to Use POM (and When NOT To)

**Understanding the Trade-offs:**

Page Object Model is popular, but it's not always the best choice. Let's understand when it helps and when it hurts.

**When POM Shines:**

| Scenario | Why POM Helps | Example |
|----------|---------------|---------|
| **Stable UI with many tests** | Centralize selector changes | E-commerce site with 50+ checkout tests |
| **Multiple test writers** | Consistent API for interacting with pages | Team of 5+ QA engineers |
| **Complex page interactions** | Abstract complexity | Multi-step wizard with validations |
| **Reusable components** | Share common page logic | Login page used in 20 different test files |
| **Large test suite** | Reduce duplication | 500+ tests across 50 pages |

**When POM Hurts:**

| Scenario | Why POM is Overkill | Better Alternative |
|----------|---------------------|-------------------|
| **Small test suite** | More boilerplate than value | Direct locators in tests |
| **Rapidly changing UI** | Constant POM updates | Flexible locator strategies |
| **One-off tests** | Extra abstraction layer | Inline test code |
| **API-heavy tests** | POM designed for UI | API helper functions |
| **Simple CRUD** | Unnecessary complexity | Direct page interactions |

**Real Example: POM vs Direct Locators**

```typescript
// ❌ POM Overkill: For a simple 5-test suite
// pages/ForgotPasswordPage.ts (50 lines)
export class ForgotPasswordPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('#email');
    this.submitButton = page.locator('button[type="submit"]');
    this.successMessage = page.locator('.success');
    this.errorMessage = page.locator('.error');
  }
  
  async goto() {
    await this.page.goto('/forgot-password');
  }
  
  async submitEmail(email: string) {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }
  
  async getSuccessMessage() {
    return await this.successMessage.textContent();
  }
  
  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }
}

// tests/forgot-password.spec.ts (30 lines)
test('reset password success', async ({ page }) => {
  const forgotPasswordPage = new ForgotPasswordPage(page);
  await forgotPasswordPage.goto();
  await forgotPasswordPage.submitEmail('user@example.com');
  const message = await forgotPasswordPage.getSuccessMessage();
  expect(message).toContain('Email sent');
});

// Total: 80 lines for 5 tests

// ✅ Direct Locators: Clean and simple
test('reset password success', async ({ page }) => {
  await page.goto('/forgot-password');
  await page.fill('#email', 'user@example.com');
  await page.click('button[type="submit"]');
  await expect(page.locator('.success')).toContainText('Email sent');
});

// Total: 6 lines for same test
// Savings: 74 lines of unnecessary abstraction
```

**When Abstraction Adds Value:**

```typescript
// ✅ POM Worth It: Complex multi-step checkout (used in 30+ tests)
export class CheckoutPage {
  constructor(private page: Page) {}
  
  async completeCheckout(order: Order) {
    // 50 lines of complex logic
    await this.selectShippingMethod(order.shipping);
    await this.applyPromoCodes(order.promoCodes);
    await this.selectPaymentMethod(order.payment);
    await this.fillBillingAddress(order.billing);
    await this.reviewOrder();
    await this.confirmOrder();
    await this.handleTwoFactorAuth(order.twoFactorCode);
  }
  
  private async selectShippingMethod(method: ShippingMethod) {
    // Complex logic with retries, waits, validations
  }
  
  // ... more private methods
}

// Test is now readable
test('checkout with discount', async ({ page }) => {
  const checkout = new CheckoutPage(page);
  await checkout.completeCheckout({
    shipping: 'express',
    promoCodes: ['SAVE20'],
    payment: 'credit_card',
    billing: testAddress,
    twoFactorCode: '123456',
  });
  
  await expect(page.locator('.confirmation')).toBeVisible();
});
```

**Alternative Pattern: Component-Based Approach**

Instead of full page objects, use component-based helpers:

```typescript
// ❌ Full POM: Over-engineered
export class DashboardPage {
  constructor(private page: Page) {}
  
  async clickNavItem(item: string) { /* ... */ }
  async getHeaderText() { /* ... */ }
  async openSidebar() { /* ... */ }
  async searchProduct(query: string) { /* ... */ }
  async filterByCategory(category: string) { /* ... */ }
  // 50 more methods...
}

// ✅ Component-Based: Modular and flexible
export class Navigation {
  constructor(private page: Page) {}
  
  async clickItem(item: string) {
    await this.page.getByRole('link', { name: item }).click();
  }
}

export class Sidebar {
  constructor(private page: Page) {}
  
  async open() {
    await this.page.locator('#sidebar-toggle').click();
  }
}

export class ProductFilter {
  constructor(private page: Page) {}
  
  async filterByCategory(category: string) {
    await this.page.selectOption('#category', category);
  }
}

// Usage: Compose components as needed
test('filter products', async ({ page }) => {
  const filter = new ProductFilter(page);
  await page.goto('/products');
  await filter.filterByCategory('Electronics');
  await expect(page.locator('.product')).toHaveCount(10);
});
```

**Hybrid Approach: Best of Both Worlds**

```typescript
// Base locators: Simple pages
test('simple login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#email', 'user@example.com');
  await page.fill('#password', 'password');
  await page.click('button[type="submit"]');
});

// POM: Complex pages with reuse
const checkout = new CheckoutPage(page);
await checkout.completeMultiStepCheckout(orderData);

// Component helpers: Reusable UI elements
const modal = new Modal(page);
await modal.confirm();
```

**Decision Tree:**

```
Is this page used in 10+ tests?
├─ Yes: Consider POM
│  └─ Is the page complex (5+ interactions)?
│     ├─ Yes: Use POM ✅
│     └─ No: Component helpers ✅
│
└─ No: Direct locators ✅
```

---

#### What is POM?

Page Object Model is a design pattern that creates an object repository for web UI elements, separating test logic from page-specific code.

#### Basic POM Implementation

```typescript
// pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.locator('.error-message');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.loginButton.isEnabled();
  }
}
```

#### Using POM in Tests

```typescript
// tests/auth/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Login Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('successful login with valid credentials', async ({ page }) => {
    await loginPage.login('user@example.com', 'password123');
    await expect(page).toHaveURL('/dashboard');
  });

  test('shows error with invalid credentials', async () => {
    await loginPage.login('invalid@example.com', 'wrongpass');
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Invalid credentials');
  });

  test('login button disabled with empty fields', async () => {
    const isEnabled = await loginPage.isLoginButtonEnabled();
    expect(isEnabled).toBe(false);
  });
});
```

#### POM Best Practices

✅ **Do:**
- Keep page objects focused on single page/component
- Use descriptive method names (e.g., `loginWithValidCredentials`)
- Return page objects for method chaining
- Use TypeScript for type safety
- Make locators readonly
- Keep assertions in tests, not page objects

❌ **Don't:**
- Mix multiple pages in one class
- Put test assertions in page objects
- Make page objects too generic
- Use hard-coded waits
- Expose internal implementation details

#### Advanced POM with Fluent Interface

```typescript
// pages/CheckoutPage.ts
export class CheckoutPage {
  constructor(private page: Page) {}

  async addProductToCart(productName: string): Promise<CheckoutPage> {
    await this.page.getByRole('button', { name: `Add ${productName}` }).click();
    return this;
  }

  async proceedToCheckout(): Promise<CheckoutPage> {
    await this.page.getByRole('button', { name: 'Checkout' }).click();
    return this;
  }

  async fillShippingInfo(address: Address): Promise<CheckoutPage> {
    await this.page.fill('#address', address.street);
    await this.page.fill('#city', address.city);
    await this.page.fill('#zip', address.zip);
    return this;
  }

  async completeOrder(): Promise<void> {
    await this.page.getByRole('button', { name: 'Complete Order' }).click();
  }
}

// Usage with method chaining
test('complete checkout flow', async ({ page }) => {
  const checkout = new CheckoutPage(page);
  
  await checkout
    .addProductToCart('iPhone 15')
    .then(p => p.addProductToCart('MacBook Pro'))
    .then(p => p.proceedToCheckout())
    .then(p => p.fillShippingInfo(testAddress))
    .then(p => p.completeOrder());
    
  await expect(page).toHaveURL('/order-confirmation');
});
```

---

### 3.3 Screenplay Pattern

#### What is Screenplay Pattern?

Screenplay pattern focuses on **actors, tasks, interactions, and questions** to create highly readable, maintainable tests.

#### Components

- **Actors**: Users of the system (e.g., Customer, Admin)
- **Tasks**: High-level business actions
- **Interactions**: Low-level UI actions
- **Questions**: Queries about system state

#### Screenplay Implementation

```typescript
// screenplay/actors/Actor.ts
export class Actor {
  constructor(
    private name: string,
    private page: Page
  ) {}

  async attemptsTo(...tasks: Task[]): Promise<void> {
    for (const task of tasks) {
      await task.performAs(this);
    }
  }

  async asks(question: Question<any>): Promise<any> {
    return await question.answeredBy(this);
  }

  getPage(): Page {
    return this.page;
  }
}

// screenplay/tasks/Login.ts
export class Login implements Task {
  constructor(
    private email: string,
    private password: string
  ) {}

  async performAs(actor: Actor): Promise<void> {
    const page = actor.getPage();
    await page.goto('/login');
    await page.fill('#email', this.email);
    await page.fill('#password', this.password);
    await page.click('button[type="submit"]');
  }

  static with(email: string, password: string): Login {
    return new Login(email, password);
  }
}

// screenplay/questions/CurrentUrl.ts
export class CurrentUrl implements Question<string> {
  async answeredBy(actor: Actor): Promise<string> {
    return actor.getPage().url();
  }

  static value(): CurrentUrl {
    return new CurrentUrl();
  }
}

// Using Screenplay in tests
test('user can login', async ({ page }) => {
  const customer = new Actor('Customer', page);

  await customer.attemptsTo(
    Login.with('user@example.com', 'password123')
  );

  const url = await customer.asks(CurrentUrl.value());
  expect(url).toContain('/dashboard');
});
```

#### Screenplay vs POM

| Aspect | POM | Screenplay |
|--------|-----|------------|
| **Focus** | Page structure | User intentions |
| **Readability** | Good | Excellent (BDD-like) |
| **Complexity** | Lower | Higher |
| **Learning Curve** | Easy | Moderate |
| **Best For** | Simple apps | Complex domains |

---

### 3.4 Component Model

#### Testing UI Components in Isolation

Playwright supports component testing for React, Vue, and Svelte.

#### Setup for React Components

```bash
npm init playwright@latest -- --ct
```

#### Component Test Example

```typescript
// components/Button.tsx
export const Button = ({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
);

// components/Button.spec.tsx
import { test, expect } from '@playwright/experimental-ct-react';
import { Button } from './Button';

test('button renders with label', async ({ mount }) => {
  const component = await mount(<Button label="Click me" />);
  await expect(component).toContainText('Click me');
});

test('button calls onClick handler', async ({ mount }) => {
  let clicked = false;
  const component = await mount(
    <Button label="Click" onClick={() => clicked = true} />
  );
  
  await component.click();
  expect(clicked).toBe(true);
});
```

#### When to Use Component Testing

✅ **Use Component Testing For:**
- Isolated UI component behavior
- Props validation
- Event handlers
- Visual variations
- Fast feedback loop

❌ **Use E2E Testing For:**
- Full user journeys
- Integration between components
- Backend interactions
- Cross-browser testing

---

### 3.5 Test DSLs & Abstractions

#### Creating Domain-Specific Language

```typescript
// dsl/ecommerce-dsl.ts
export class EcommerceDSL {
  constructor(private page: Page) {}

  async searchFor(product: string) {
    await this.page.fill('[data-testid="search"]', product);
    await this.page.press('[data-testid="search"]', 'Enter');
    return this;
  }

  async selectFirstResult() {
    await this.page.click('[data-testid="product-item"]:first-child');
    return this;
  }

  async addToCart() {
    await this.page.click('[data-testid="add-to-cart"]');
    return this;
  }

  async checkout() {
    await this.page.click('[data-testid="checkout"]');
    return this;
  }

  async fillPaymentDetails(card: CreditCard) {
    await this.page.fill('#card-number', card.number);
    await this.page.fill('#expiry', card.expiry);
    await this.page.fill('#cvv', card.cvv);
    return this;
  }

  async confirmOrder() {
    await this.page.click('[data-testid="confirm-order"]');
  }
}

// Using DSL in tests
test('complete purchase flow', async ({ page }) => {
  const shop = new EcommerceDSL(page);

  await shop
    .searchFor('iPhone 15')
    .then(s => s.selectFirstResult())
    .then(s => s.addToCart())
    .then(s => s.checkout())
    .then(s => s.fillPaymentDetails(testCard))
    .then(s => s.confirmOrder());

  await expect(page.locator('.success-message')).toBeVisible();
});
```

#### Benefits of DSL

- 📖 Highly readable tests
- 🔄 Reusable across test suites
- 🛡️ Encapsulates implementation details
- 🚀 Faster test writing
- 🎯 Domain-focused language

---

### 3.6 Multi-Domain Flows (SSO, Subdomains, Cross-Origin)

#### Handling SSO Authentication

```typescript
test('login via SSO provider', async ({ page, context }) => {
  // Start on main app
  await page.goto('https://myapp.com/login');
  await page.click('#sso-login');

  // Wait for SSO provider redirect
  await page.waitForURL('**/auth.provider.com/**');

  // Login on SSO provider
  await page.fill('#username', 'user@company.com');
  await page.fill('#password', 'password123');
  await page.click('#submit');

  // Wait for redirect back to app
  await page.waitForURL('**/myapp.com/dashboard');

  // Verify logged in
  await expect(page.locator('.user-profile')).toBeVisible();
});
```

#### Working with Subdomains

```typescript
test('navigate between subdomains', async ({ page, context }) => {
  // Visit main domain
  await page.goto('https://www.example.com');
  
  // Navigate to subdomain
  await page.goto('https://admin.example.com');
  
  // Share cookies across subdomains
  const cookies = await context.cookies();
  await context.addCookies(cookies.map(c => ({
    ...c,
    domain: '.example.com' // Wildcard domain
  })));
});
```

#### Cross-Origin iframe Handling

```typescript
test('interact with cross-origin iframe', async ({ page }) => {
  await page.goto('https://parent.com');
  
  // Get iframe with different origin
  const frame = page.frameLocator('iframe[src*="external.com"]');
  
  // Interact with iframe content
  await frame.locator('#input').fill('test');
  await frame.locator('button').click();
  
  // Wait for iframe action to complete
  await frame.locator('.success').waitFor();
});
```

#### OAuth Flow Example

```typescript
test('complete OAuth flow', async ({ page, context }) => {
  await page.goto('https://myapp.com');
  await page.click('#login-with-google');

  // Handle OAuth popup
  const [popup] = await Promise.all([
    context.waitForEvent('page'),
    page.click('#oauth-button')
  ]);

  // Login on OAuth provider
  await popup.fill('#email', 'user@gmail.com');
  await popup.fill('#password', 'password');
  await popup.click('#sign-in');

  // Wait for popup to close and return to main page
  await popup.waitForEvent('close');
  await page.waitForURL('**/dashboard');
});
```

---

### 3.7 Versioning & Modularization for Large Suites

#### Version Control Strategy

```
tests/
├── v1/                    # Legacy tests
│   └── old-features/
├── v2/                    # Current stable
│   ├── auth/
│   └── checkout/
└── v3/                    # New features
    └── experimental/
```

#### Modular Test Structure

```typescript
// tests/modules/auth/index.ts
export * from './login.spec';
export * from './signup.spec';
export * from './password-reset.spec';

// tests/modules/checkout/index.ts
export * from './cart.spec';
export * from './payment.spec';
export * from './confirmation.spec';

// Selective imports
import { loginTests } from './modules/auth';
import { checkoutTests } from './modules/checkout';
```

#### Feature Toggles

```typescript
// config/features.ts
export const features = {
  newCheckout: process.env.NEW_CHECKOUT === 'true',
  socialLogin: process.env.SOCIAL_LOGIN === 'true',
  darkMode: process.env.DARK_MODE === 'true',
};

// tests/checkout.spec.ts
test.describe('Checkout', () => {
  test.skip(!features.newCheckout, 'New checkout flow', async ({ page }) => {
    // Test new checkout implementation
  });

  test('Legacy checkout flow', async ({ page }) => {
    // Always run legacy tests
  });
});
```

#### Semantic Versioning for Test Suites

```json
{
  "name": "e2e-tests",
  "version": "2.3.1",
  "dependencies": {
    "@playwright/test": "^1.40.0",
    "test-utils": "^1.2.0"
  }
}
```

- **Major (2.x.x)**: Breaking changes in test structure
- **Minor (x.3.x)**: New test suites added
- **Patch (x.x.1)**: Bug fixes, small improvements

---

## 4. Browsers, Contexts, Pages, Frames & Workers

### 4.1 Browser Engines & Coverage Strategy

#### Supported Browser Engines

| Browser | Engine | Rendering | JavaScript |
|---------|--------|-----------|------------|
| **Chromium** | Blink | Blink | V8 |
| **Firefox** | Gecko | Gecko | SpiderMonkey |
| **WebKit** | WebKit | WebKit | JavaScriptCore |

#### Browser Coverage Strategy

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    // Mobile browsers
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    
    // Branded browsers (use Chromium)
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
});
```

#### When to Test Each Browser

| Scenario | Browsers | Reason |
|----------|----------|--------|
| **Smoke Tests** | Chromium only | Fast feedback |
| **Regression** | Chromium + Firefox | Major engines covered |
| **Pre-Release** | All 3 engines | Full coverage |
| **Visual Tests** | Chromium only | Consistent rendering |
| **Mobile Tests** | Mobile Chrome + Safari | iOS & Android coverage |

#### Launching Browsers Programmatically

```typescript
import { chromium, firefox, webkit } from '@playwright/test';

// Launch specific browser
const browser = await chromium.launch({
  headless: false,
  slowMo: 100,
  devtools: true,
});

// Launch with specific channel
const chrome = await chromium.launch({ channel: 'chrome' });
const edge = await chromium.launch({ channel: 'msedge' });

// Browser options
const browser = await firefox.launch({
  headless: true,
  args: ['--start-maximized'],
  timeout: 30000,
  downloadsPath: './downloads',
});
```

---

### 4.2 Context Lifecycle & Storage State

#### Browser Context Basics

A **browser context** is an isolated incognito-like session.

```typescript
test('using browser context', async ({ browser }) => {
  // Create isolated context
  const context = await browser.newContext();
  
  // Create page in context
  const page = await context.newPage();
  
  await page.goto('https://example.com');
  
  // Cleanup
  await context.close();
});
```

#### Context Isolation

```typescript
test('contexts are isolated', async ({ browser }) => {
  // Context 1
  const context1 = await browser.newContext();
  const page1 = await context1.newPage();
  await page1.goto('https://example.com');
  await page1.evaluate(() => localStorage.setItem('user', 'alice'));

  // Context 2 (completely isolated)
  const context2 = await browser.newContext();
  const page2 = await context2.newPage();
  await page2.goto('https://example.com');
  const user = await page2.evaluate(() => localStorage.getItem('user'));
  
  expect(user).toBeNull(); // Context 2 doesn't have Context 1's data
});
```

#### Saving & Reusing Authentication State

```typescript
// auth.setup.ts - Run once to save auth state
import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('https://example.com/login');
  await page.fill('#email', 'user@example.com');
  await page.fill('#password', 'password123');
  await page.click('#submit');
  
  // Wait for login to complete
  await page.waitForURL('**/dashboard');
  
  // Save storage state
  await page.context().storageState({ path: 'auth.json' });
});

// playwright.config.ts
export default defineConfig({
  projects: [
    // Setup project
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    
    // Authenticated tests
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'auth.json',
      },
      dependencies: ['setup'],
    },
  ],
});

// Using in tests
test('authenticated test', async ({ page }) => {
  // Already logged in via storage state
  await page.goto('https://example.com/dashboard');
  await expect(page.locator('.user-name')).toBeVisible();
});
```

#### Context Options

```typescript
const context = await browser.newContext({
  // Viewport size
  viewport: { width: 1920, height: 1080 },
  
  // User agent
  userAgent: 'Custom User Agent',
  
  // Geolocation
  geolocation: { latitude: 40.7128, longitude: -74.0060 },
  permissions: ['geolocation'],
  
  // Locale & timezone
  locale: 'en-US',
  timezoneId: 'America/New_York',
  
  // Color scheme
  colorScheme: 'dark',
  
  // Cookies
  storageState: {
    cookies: [
      {
        name: 'session',
        value: 'abc123',
        domain: 'example.com',
        path: '/',
      },
    ],
  },
  
  // Network
  offline: false,
  httpCredentials: {
    username: 'user',
    password: 'pass',
  },
  
  // Recording
  recordVideo: { dir: 'videos/' },
  recordHar: { path: 'requests.har' },
});
```

---

### 4.3 Page Lifecycle: Navigation, Events, Popups, Downloads

#### Page Navigation

```typescript
// Basic navigation
await page.goto('https://example.com');

// Navigation options
await page.goto('https://example.com', {
  waitUntil: 'networkidle',  // 'load', 'domcontentloaded', 'networkidle'
  timeout: 30000,
});

// Navigate back/forward
await page.goBack();
await page.goForward();
await page.reload();
```

#### Page Events

```typescript
// Listen to console messages
page.on('console', msg => console.log('PAGE LOG:', msg.text()));

// Listen to page errors
page.on('pageerror', error => console.error('PAGE ERROR:', error));

// Listen to requests
page.on('request', request => 
  console.log('REQUEST:', request.method(), request.url())
);

// Listen to responses
page.on('response', response => 
  console.log('RESPONSE:', response.status(), response.url())
);

// Listen to dialog (alert, confirm, prompt)
page.on('dialog', dialog => dialog.accept());

// Listen to file chooser
page.on('filechooser', async fileChooser => {
  await fileChooser.setFiles('path/to/file.pdf');
});

// Page load events
page.on('load', () => console.log('Page loaded'));
page.on('domcontentloaded', () => console.log('DOM ready'));
```

#### Handling Popups

```typescript
// Handle popup window
test('interact with popup', async ({ page, context }) => {
  // Listen for popup before triggering
  const [popup] = await Promise.all([
    context.waitForEvent('page'),
    page.click('#open-popup'),
  ]);

  // Interact with popup
  await popup.waitForLoadState();
  await popup.fill('#input', 'test');
  await popup.click('#submit');
  
  // Close popup
  await popup.close();
});

// Handle multiple popups
test('multiple popups', async ({ page, context }) => {
  const popups: Page[] = [];
  
  context.on('page', popup => {
    popups.push(popup);
  });

  await page.click('#open-popup-1');
  await page.click('#open-popup-2');
  
  // Wait for both popups
  await Promise.all(popups.map(p => p.waitForLoadState()));
  
  // Interact with each
  await popups[0].fill('#input', 'popup1');
  await popups[1].fill('#input', 'popup2');
});
```

#### Handling Downloads

```typescript
test('download file', async ({ page }) => {
  // Start waiting for download before clicking
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('#download-button'),
  ]);

  // Get download info
  console.log(await download.path());
  console.log(download.suggestedFilename());

  // Save to specific location
  await download.saveAs('./downloads/' + download.suggestedFilename());
  
  // Read download content
  const stream = await download.createReadStream();
  // Process stream...
});

// Download with custom name
test('download with validation', async ({ page }) => {
  const download = await page.waitForEvent('download');
  const path = await download.path();
  
  // Validate file
  const fs = require('fs');
  const content = fs.readFileSync(path!, 'utf-8');
  expect(content).toContain('Expected content');
});
```

---

### 4.4 Iframes & Shadow DOM

#### Working with Iframes

```typescript
// Get iframe by name or URL
const frame = page.frame('iframe-name');
const frame = page.frame({ url: /example\.com/ });

// Using frameLocator (recommended)
const frameLocator = page.frameLocator('#my-iframe');
await frameLocator.locator('button').click();

// Nested iframes
const childFrame = frameLocator.frameLocator('#nested-iframe');
await childFrame.locator('input').fill('test');

// Wait for iframe to load
await page.waitForSelector('iframe');
const frame = page.frame('iframe-name');
await frame?.waitForLoadState();
```

#### Shadow DOM

```typescript
// Pierce shadow DOM
await page.locator('custom-element >>> button').click();

// Using locator with deep selector
await page.locator('my-component').locator('internal:text="Click"').click();

// Get shadow root
const shadowHost = page.locator('custom-element');
const shadowRoot = await shadowHost.evaluateHandle(el => el.shadowRoot);

// Query inside shadow root
const button = await shadowRoot.$('button');
await button?.click();
```

#### Complex iframe + Shadow DOM

```typescript
test('iframe with shadow DOM', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Navigate into iframe
  const frame = page.frameLocator('#payment-iframe');
  
  // Navigate into shadow DOM inside iframe
  const cardInput = frame.locator('stripe-card >>> input[name="cardnumber"]');
  await cardInput.fill('4242424242424242');
  
  const expiryInput = frame.locator('stripe-card >>> input[name="exp-date"]');
  await expiryInput.fill('12/25');
});
```

---

### 4.5 Web Workers & Background Tasks

#### Detecting Web Workers

```typescript
test('interact with web worker', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Listen for workers
  page.on('worker', worker => {
    console.log('Worker created:', worker.url());
    
    worker.on('close', () => console.log('Worker destroyed'));
  });

  // Trigger action that creates worker
  await page.click('#start-processing');
  
  // Wait for worker to complete
  await page.waitForFunction(() => {
    return (window as any).workerComplete === true;
  });
});
```

#### Service Workers

```typescript
test('service worker registration', async ({ page, context }) => {
  await page.goto('https://example.com');
  
  // Wait for service worker
  const serviceWorker = await context.waitForEvent('serviceworker');
  console.log('Service worker URL:', serviceWorker.url());
  
  // Check service worker status
  const swStatus = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    return registration.active?.state;
  });
  
  expect(swStatus).toBe('activated');
});
```

---

### 4.6 Mobile Emulation (Device Descriptors, UA, Viewport)

#### Built-in Device Emulation

```typescript
import { devices } from '@playwright/test';

test('mobile emulation', async ({ browser }) => {
  const iPhone = devices['iPhone 12'];
  const context = await browser.newContext({
    ...iPhone,
  });
  
  const page = await context.newPage();
  await page.goto('https://example.com');
});
```

#### Available Devices

```typescript
// Popular devices
devices['iPhone 12']
devices['iPhone 12 Pro']
devices['iPhone 13']
devices['iPhone 14']
devices['Pixel 5']
devices['Pixel 7']
devices['iPad Pro']
devices['Galaxy S9+']
devices['Galaxy Tab S4']
```

#### Custom Device Configuration

```typescript
const customMobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)...',
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
});
```

#### Mobile-Specific Testing

```typescript
test('mobile gestures', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  
  // Tap (mobile click)
  await page.tap('#button');
  
  // Swipe
  await page.locator('.carousel').hover();
  await page.mouse.down();
  await page.mouse.move(100, 0);
  await page.mouse.up();
  
  // Pinch zoom
  await page.touchscreen.tap(100, 100);
  
  // Scroll on mobile
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
});
```

#### Responsive Testing

```typescript
const viewports = [
  { width: 375, height: 667, name: 'iPhone' },
  { width: 768, height: 1024, name: 'iPad' },
  { width: 1920, height: 1080, name: 'Desktop' },
];

for (const viewport of viewports) {
  test(`responsive test - ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('https://example.com');
    
    // Assertions based on viewport
    if (viewport.width < 768) {
      await expect(page.locator('.mobile-menu')).toBeVisible();
    } else {
      await expect(page.locator('.desktop-menu')).toBeVisible();
    }
  });
}
```

---

## 5. Selectors & Locator Strategies (Reliability Engineering)

### 5.1 Locator Types & Prioritization

#### Playwright's Locator Priority (Best to Worst)

| Priority | Locator Method | Use Case | Example |
|----------|----------------|----------|---------|
| **1** | `getByRole` | Accessibility-first | `page.getByRole('button', { name: 'Submit' })` |
| **2** | `getByLabel` | Form fields with labels | `page.getByLabel('Email address')` |
| **3** | `getByPlaceholder` | Inputs with placeholders | `page.getByPlaceholder('Enter email')` |
| **4** | `getByText` | Unique text content | `page.getByText('Welcome back')` |
| **5** | `getByTestId` | Stable test IDs | `page.getByTestId('submit-btn')` |
| **6** | CSS Selectors | Last resort | `page.locator('.submit-button')` |
| **7** | XPath | Avoid if possible | `page.locator('//button[@class="submit"]')` |

#### Why This Order?

1. **getByRole** - Based on ARIA roles, accessible, semantic
2. **getByLabel** - Tied to form semantics, user-visible
3. **getByPlaceholder** - User-visible, but less stable
4. **getByText** - User-visible, but can change with content
5. **getByTestId** - Stable, but not user-visible
6. **CSS** - Implementation details, fragile
7. **XPath** - Verbose, hard to maintain, fragile

#### Examples of Each Locator

```typescript
// 1. getByRole (BEST)
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('textbox', { name: 'Email' }).fill('test@test.com');
await page.getByRole('checkbox', { name: 'Remember me' }).check();
await page.getByRole('link', { name: 'Forgot password?' }).click();
await page.getByRole('heading', { name: 'Dashboard' }).isVisible();

// 2. getByLabel
await page.getByLabel('Username').fill('john_doe');
await page.getByLabel('Password').fill('securepass123');
await page.getByLabel('Country').selectOption('USA');

// 3. getByPlaceholder
await page.getByPlaceholder('Search products...').fill('laptop');
await page.getByPlaceholder('Enter your email').fill('user@example.com');

// 4. getByText
await page.getByText('Continue to payment').click();
await page.getByText('Order #12345').click();
await page.getByText(/total: \$\d+/i).isVisible(); // Regex

// 5. getByTestId
await page.getByTestId('login-button').click();
await page.getByTestId('cart-icon').click();
await page.getByTestId('product-123').hover();

// 6. CSS Selectors
await page.locator('#submit-button').click();
await page.locator('.primary-btn').click();
await page.locator('[data-action="delete"]').click();
await page.locator('button.btn-primary').click();

// 7. XPath (avoid)
await page.locator('//button[text()="Submit"]').click();
await page.locator('//div[@id="content"]//span').textContent();
```

---

### 5.2 Testability Hooks: data-testid Design Guidelines

#### Why Use data-testid?

✅ **Pros:**
- Stable across UI changes
- Clear test intent
- Doesn't affect styling/behavior
- Easy to find in code

❌ **Cons:**
- Clutters production HTML
- Not user-visible
- Maintenance overhead

#### Best Practices for data-testid

```html
<!-- GOOD: Descriptive, hierarchical -->
<button data-testid="checkout-confirm-button">Confirm Order</button>
<div data-testid="cart-item-123">...</div>
<input data-testid="login-email-input" />

<!-- BAD: Generic, unclear -->
<button data-testid="btn1">Confirm Order</button>
<div data-testid="item">...</div>
<input data-testid="input" />
```

#### Naming Conventions

```
Pattern: {page/component}-{element}-{type}

Examples:
- login-email-input
- checkout-total-label
- product-123-card
- header-search-button
- cart-remove-icon
```

#### Conditional data-testid in Production

```typescript
// React component
export const Button = ({ label, testId }) => (
  <button {...(process.env.NODE_ENV === 'test' && { 'data-testid': testId })}>
    {label}
  </button>
);

// Or use custom attribute
<button data-test="submit-button">Submit</button>

// Configure Playwright to use custom attribute
test.use({
  testIdAttribute: 'data-test'
});
```

#### Auto-generated Test IDs

```typescript
// React component with auto test-id
export const ProductCard = ({ product }) => (
  <div data-testid={`product-${product.id}`}>
    <h2 data-testid={`product-${product.id}-title`}>{product.name}</h2>
    <button data-testid={`product-${product.id}-add-to-cart`}>
      Add to Cart
    </button>
  </div>
);

// Test usage
await page.getByTestId('product-123-add-to-cart').click();
```

---

### 5.3 Accessibility-First Locators (A11y Roles, Names)

#### ARIA Roles Reference

| Role | HTML Element | Use Case |
|------|--------------|----------|
| `button` | `<button>`, `<input type="button">` | Clickable actions |
| `link` | `<a>` | Navigation |
| `textbox` | `<input type="text">`, `<textarea>` | Text input |
| `checkbox` | `<input type="checkbox">` | Toggle options |
| `radio` | `<input type="radio">` | Single selection |
| `combobox` | `<select>`, `<input list>` | Dropdown selection |
| `heading` | `<h1>` to `<h6>` | Section headings |
| `img` | `<img>` | Images |
| `table` | `<table>` | Data tables |
| `listitem` | `<li>` | List items |
| `navigation` | `<nav>` | Navigation sections |
| `main` | `<main>` | Main content |
| `banner` | `<header>` | Page header |
| `contentinfo` | `<footer>` | Page footer |

#### Using getByRole Effectively

```typescript
// Buttons
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByRole('button', { name: /submit/i }).click(); // Case-insensitive regex

// Links
await page.getByRole('link', { name: 'About Us' }).click();
await page.getByRole('link', { name: 'Learn more' }).click();

// Form controls
await page.getByRole('textbox', { name: 'Email' }).fill('test@test.com');
await page.getByRole('checkbox', { name: 'I agree' }).check();
await page.getByRole('radio', { name: 'Option 1' }).click();
await page.getByRole('combobox', { name: 'Country' }).selectOption('USA');

// Headings
await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
await expect(page.getByRole('heading', { level: 1 })).toHaveText('Welcome');

// Lists and items
const items = page.getByRole('listitem');
await expect(items).toHaveCount(5);

// Images
await page.getByRole('img', { name: 'Company logo' }).click();
```

#### Accessible Name Calculation

```html
<!-- Button text -->
<button>Submit</button>
<!-- getByRole('button', { name: 'Submit' }) -->

<!-- aria-label -->
<button aria-label="Close dialog">X</button>
<!-- getByRole('button', { name: 'Close dialog' }) -->

<!-- aria-labelledby -->
<h2 id="dialog-title">Confirm Delete</h2>
<button aria-labelledby="dialog-title">OK</button>
<!-- getByRole('button', { name: 'Confirm Delete' }) -->

<!-- Input with label -->
<label for="email">Email address</label>
<input id="email" type="text">
<!-- getByRole('textbox', { name: 'Email address' }) -->

<!-- Image alt text -->
<img src="logo.png" alt="Company Logo">
<!-- getByRole('img', { name: 'Company Logo' }) -->
```

#### Testing Accessibility with Locators

```typescript
test('form is accessible', async ({ page }) => {
  await page.goto('/signup');

  // If these locators work, the form is accessible!
  await page.getByRole('textbox', { name: 'Full name' }).fill('John Doe');
  await page.getByRole('textbox', { name: 'Email' }).fill('john@example.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('securepass');
  await page.getByRole('checkbox', { name: 'I agree to terms' }).check();
  await page.getByRole('button', { name: 'Create account' }).click();
});
```

---

### 5.4 Handling Dynamic Content, Virtualized Lists, Canvas

#### Dynamic Content

```typescript
// Wait for element to appear
await page.waitForSelector('.dynamic-content');

// Wait for specific text
await page.getByText('Loading complete').waitFor();

// Wait for element to be stable
await page.locator('.animated-element').waitFor({ state: 'attached' });

// Polling for dynamic content
await expect(async () => {
  const count = await page.locator('.item').count();
  expect(count).toBeGreaterThan(0);
}).toPass({ timeout: 10000 });
```

#### Virtualized Lists (React-Window, React-Virtualized)

```typescript
test('scroll through virtualized list', async ({ page }) => {
  await page.goto('/products');

  // Scroll to trigger loading more items
  const list = page.locator('[data-testid="virtual-list"]');
  
  for (let i = 0; i < 5; i++) {
    await list.evaluate(node => {
      node.scrollTop = node.scrollHeight;
    });
    await page.waitForTimeout(500); // Wait for items to load
  }

  // Find item by text (even if not initially rendered)
  await page.getByText('Product #500').scrollIntoViewIfNeeded();
  await page.getByText('Product #500').click();
});

// Alternative: Search instead of scrolling
test('search in virtualized list', async ({ page }) => {
  await page.goto('/products');
  
  // Use search to find specific item
  await page.fill('[data-testid="search"]', 'Product #500');
  await page.getByText('Product #500').waitFor();
  await page.getByText('Product #500').click();
});
```

#### Canvas Elements

```typescript
test('interact with canvas', async ({ page }) => {
  await page.goto('/drawing-app');

  const canvas = page.locator('canvas');
  const box = await canvas.boundingBox();

  if (box) {
    // Click at specific coordinates
    await canvas.click({
      position: { x: 100, y: 100 }
    });

    // Draw line
    await page.mouse.move(box.x + 50, box.y + 50);
    await page.mouse.down();
    await page.mouse.move(box.x + 200, box.y + 200);
    await page.mouse.up();
  }
});

// Get canvas content
test('verify canvas drawing', async ({ page }) => {
  const canvas = page.locator('canvas');
  
  // Take screenshot of canvas
  await canvas.screenshot({ path: 'canvas.png' });
  
  // Get canvas data
  const dataUrl = await canvas.evaluate((node: HTMLCanvasElement) => {
    return node.toDataURL();
  });
  
  expect(dataUrl).toContain('data:image/png');
});
```

#### Infinite Scroll

```typescript
test('load all items with infinite scroll', async ({ page }) => {
  await page.goto('/feed');

  let previousCount = 0;
  let currentCount = 0;
  let maxScrolls = 10;

  while (maxScrolls > 0) {
    // Get current item count
    currentCount = await page.locator('.feed-item').count();
    
    // Break if no new items loaded
    if (currentCount === previousCount) break;
    
    previousCount = currentCount;
    
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Wait for new content
    await page.waitForTimeout(1000);
    maxScrolls--;
  }

  console.log(`Loaded ${currentCount} items`);
});
```

---

### 5.5 Strategies for React/Vue/Angular & Shadow DOM Handling

#### React-Specific Selectors

```typescript
// React Testing Library style
await page.locator('[data-testid="component"]').click();

// React component names (if exposed in dev mode)
await page.locator('[data-component="UserProfile"]').click();

// React hooks classes
await page.locator('._react_hook_class_123').click(); // Fragile!
```

#### React DevTools Integration

```typescript
test('find React component', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Find by React component tree (requires React DevTools API)
  const component = await page.evaluate(() => {
    const root = document.querySelector('#root');
    return root?._reactRootContainer?._internalRoot?.current;
  });
});
```

#### Vue.js Selectors

```typescript
// Vue ref attributes
await page.locator('[ref="submitButton"]').click();

// Vue data attributes
await page.locator('[data-v-123abc]').click(); // Scoped styles

// Vue component selector
await page.locator('.vue-component[data-testid="user-card"]').click();
```

#### Angular Selectors

```typescript
// Angular component selectors
await page.locator('app-user-profile').click();
await page.locator('mat-button').click(); // Material components

// Angular directives
await page.locator('[ng-reflect-name="email"]').fill('test@test.com');

// Angular testing attributes
await page.locator('[data-cy="submit"]').click();
```

#### Shadow DOM Deep Piercing

```typescript
// Pierce single shadow root
await page.locator('my-component >>> button').click();

// Pierce multiple shadow roots
await page.locator('parent-component >>> child-component >>> button').click();

// Alternative syntax
await page.locator('my-component').locator('button', { strict: false }).click();

// Access shadow root directly
const shadowHost = page.locator('custom-element');
const button = await shadowHost.evaluateHandle(host => 
  host.shadowRoot?.querySelector('button')
);
await button.click();
```

#### Web Components Best Practices

```typescript
test('interact with web component', async ({ page }) => {
  await page.goto('/web-components');

  // Wait for component to be defined
  await page.waitForFunction(() => 
    customElements.get('my-component') !== undefined
  );

  // Use component's public API
  await page.evaluate(() => {
    const component = document.querySelector('my-component');
    component.setAttribute('value', 'test');
    component.dispatchEvent(new Event('change'));
  });

  // Or pierce shadow DOM
  await page.locator('my-component >>> input').fill('test');
});
```

---

### 5.6 Anti-Flakiness Patterns for Brittle Selectors

#### Problem: Brittle Selectors

```typescript
// ❌ BAD: Fragile selectors
await page.locator('body > div:nth-child(3) > div > button').click();
await page.locator('.css-1234567-Button').click(); // Dynamic class
await page.locator('//div[3]/span[2]/button[1]').click(); // XPath hell
```

#### Solution: Stable Locator Strategies

```typescript
// ✅ GOOD: Stable, semantic selectors
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByTestId('submit-button').click();
await page.locator('[data-action="submit"]').click();
```

#### Pattern 1: Multiple Locator Fallbacks

```typescript
async function clickSubmitButton(page: Page) {
  const locators = [
    page.getByRole('button', { name: 'Submit' }),
    page.getByTestId('submit-button'),
    page.locator('button[type="submit"]'),
    page.locator('.submit-btn'),
  ];

  for (const locator of locators) {
    try {
      await locator.click({ timeout: 5000 });
      return;
    } catch {
      continue;
    }
  }

  throw new Error('Submit button not found with any locator');
}
```

#### Pattern 2: Locator Chaining

```typescript
// Build specific locator from generic to specific
const product = page
  .locator('.product-list')
  .locator('.product-item')
  .filter({ hasText: 'iPhone 15' });

await product.locator('button', { hasText: 'Add to cart' }).click();
```

#### Pattern 3: Wait for Stability

```typescript
// Wait for element to stop moving/changing
async function waitForStable(locator: Locator) {
  let previousBox = await locator.boundingBox();
  
  for (let i = 0; i < 10; i++) {
    await page.waitForTimeout(100);
    const currentBox = await locator.boundingBox();
    
    if (JSON.stringify(previousBox) === JSON.stringify(currentBox)) {
      return; // Element is stable
    }
    previousBox = currentBox;
  }
}

await waitForStable(page.locator('.animated-element'));
await page.locator('.animated-element').click();
```

#### Pattern 4: Unique Identifier Combination

```typescript
// Combine multiple attributes for uniqueness
await page.locator('[data-testid="product-card"][data-product-id="123"]').click();

// Or use filter
await page
  .getByTestId('product-card')
  .filter({ has: page.locator('[data-product-id="123"]') })
  .click();
```

#### Pattern 5: Retry with Different Strategies

```typescript
async function reliableClick(page: Page, selector: string) {
  const strategies = [
    () => page.locator(selector).click(),
    () => page.locator(selector).click({ force: true }),
    () => page.locator(selector).dispatchEvent('click'),
    () => page.evaluate(sel => 
      document.querySelector(sel)?.click(), selector
    ),
  ];

  for (const strategy of strategies) {
    try {
      await strategy();
      return;
    } catch (error) {
      console.log(`Strategy failed: ${error}`);
    }
  }

  throw new Error(`All click strategies failed for ${selector}`);
}
```

#### Pattern 6: Avoid nth Selectors

```typescript
// ❌ BAD: Position-based (fragile)
await page.locator('.item').nth(2).click();
await page.locator('.item').first().click();

// ✅ GOOD: Content-based (stable)
await page.locator('.item').filter({ hasText: 'Specific Item' }).click();
await page.locator('.item[data-id="123"]').click();
```

#### Best Practices Summary

| Practice | Why | Example |
|----------|-----|---------|
| **Use semantic selectors** | Resistant to UI changes | `getByRole('button')` |
| **Avoid position-based** | Order can change | Avoid `nth()`, `first()` |
| **Add test attributes** | Explicit test contracts | `data-testid` |
| **Wait for stability** | Handle animations | `waitForLoadState()` |
| **Use filters** | Narrow down matches | `filter({ hasText })` |
| **Combine selectors** | Increase specificity | `.parent .child[attr]` |

---

## 6. Auto-Waiting, Timeouts & Stability Tuning

### 6.0 Deep Dive: How Auto-Waiting Actually Works (Internals & Architecture)

**Why This Matters:** Understanding Playwright's internal mechanisms helps you write better tests, debug issues faster, and answer complex interview questions about "How does Playwright eliminate flaky tests?"

---

#### 6.0.1 The Auto-Waiting Engine: Behind the Scenes

**The Problem Playwright Solves:**

In Selenium, you write:
```java
// ❌ Selenium - Fragile code
WebElement button = driver.findElement(By.id("submit"));
button.click();  // FAILS if button not ready!
```

Why it fails:
- Element might not be in DOM yet
- Element might be invisible (display: none)
- Element might be disabled
- Element might be covered by another element (modal, loading spinner)
- Element might be animating (CSS transitions)

**Playwright's Solution: Actionability Checks**

When you call `page.click('button')`, Playwright performs **5 checks in a retry loop**:

```typescript
await page.click('button');  // Internally does this:

// Retry loop (default: 30 seconds timeout)
while (time_elapsed < 30000) {
  const element = findElement('button');
  
  // Check 1: Attached to DOM?
  if (!element.isConnected) {
    wait(100ms);
    continue;
  }
  
  // Check 2: Visible?
  const box = element.getBoundingClientRect();
  if (box.width === 0 || box.height === 0) {
    wait(100ms);
    continue;
  }
  
  // Check 3: Stable? (not animating)
  const box1 = element.getBoundingClientRect();
  await wait(100ms);
  const box2 = element.getBoundingClientRect();
  if (box1.x !== box2.x || box1.y !== box2.y) {
    continue;  // Still moving, retry
  }
  
  // Check 4: Enabled?
  if (element.disabled || element.getAttribute('disabled')) {
    wait(100ms);
    continue;
  }
  
  // Check 5: Not obscured?
  const point = { x: box.x + box.width/2, y: box.y + box.height/2 };
  const topElement = document.elementFromPoint(point.x, point.y);
  if (topElement !== element && !element.contains(topElement)) {
    wait(100ms);
    continue;  // Another element is on top
  }
  
  // All checks passed! Perform action
  element.click();
  return;
}

throw new TimeoutError('Element not actionable after 30s');
```

**Key Insight:** Auto-waiting is a **polling loop with intelligent checks**, not magic!

---

#### 6.0.2 Why Locators Are Better Than ElementHandles (Architectural Deep Dive)

**The Fundamental Difference:**

```typescript
// ❌ ElementHandle - Puppeteer style (avoid)
const button = await page.$('button');
await button.click();  // Can become stale!

// ✅ Locator - Playwright style (recommended)
const button = page.locator('button');
await button.click();  // Always fresh!
```

**Why ElementHandles Become Stale:**

```typescript
// Problem: ElementHandle is a SNAPSHOT
const button = await page.$('button');  // Gets reference at THIS moment

// Time passes... DOM changes...
await page.click('a');  // Navigation happens
await page.waitForLoadState();

// Now button reference is STALE (points to old DOM)
await button.click();  // ❌ FAILS! "Element is not attached to DOM"
```

**How Locators Solve This:**

```typescript
// Locator is a QUERY, not a snapshot
const button = page.locator('button');

// Locator stores: "Find element with selector 'button'"
// Not the actual element!

// Every action re-queries the DOM
await button.click();  // Finds fresh element, then clicks
await button.click();  // Finds fresh element again, then clicks
// Never stale!
```

**Internal Representation:**

```typescript
// Conceptual implementation
class Locator {
  constructor(private selector: string, private page: Page) {}
  
  async click() {
    // Re-query DOM every time
    const element = await this.page.evaluate((sel) => {
      return document.querySelector(sel);
    }, this.selector);
    
    if (!element) {
      throw new Error('Element not found');
    }
    
    // Perform actionability checks
    await this.waitForActionable(element);
    
    // Click
    await element.click();
  }
}
```

**Memory Implications:**

| Approach | Memory Usage | Performance | Staleness Risk |
|----------|-------------|-------------|----------------|
| **ElementHandle** | High (stores element reference) | Slightly faster (no re-query) | ❌ High |
| **Locator** | Low (stores selector string) | Slightly slower (re-queries) | ✅ None |

**When to Use ElementHandle (Rare Cases):**

```typescript
// ❌ Don't: Multiple operations on same element
const button = await page.$('button');
await button.hover();
await button.click();

// ✅ Do: Use locator
const button = page.locator('button');
await button.hover();
await button.click();

// ⚠️ Exception: When you need JavaScript reference
const elemHandle = await page.$('canvas');
const boundingBox = await elemHandle.boundingBox();
const jsHandle = await elemHandle.evaluateHandle(el => el.getContext('2d'));
```

---

#### 6.0.3 Browser Context Isolation: Why It Matters (Deep Architecture)

**The Problem with Shared State:**

```typescript
// ❌ Selenium - All tests share same browser
test('test 1', () => {
  driver.get('/login');
  driver.findElement(By.id('email')).sendKeys('user@example.com');
  // Sets localStorage, cookies, session
});

test('test 2', () => {
  driver.get('/dashboard');
  // PROBLEM: Still has data from test 1!
  // Cookies, localStorage, session from previous test
});
```

**Playwright's Solution: Browser Contexts**

```
Browser (Process)
├─ Context 1 (Isolated)
│  ├─ localStorage (separate)
│  ├─ cookies (separate)
│  ├─ sessionStorage (separate)
│  ├─ cache (separate)
│  └─ permissions (separate)
│
├─ Context 2 (Isolated)
│  ├─ localStorage (separate)
│  └─ ...
│
└─ Context 3 (Isolated)
   └─ ...
```

**How Context Isolation Works Internally:**

```typescript
// Simplified internal implementation
class BrowserContext {
  private storage: {
    cookies: Map<string, Cookie[]>;
    localStorage: Map<string, Record<string, string>>;
    sessionStorage: Map<string, Record<string, string>>;
    cache: Map<string, CachedResponse>;
  };
  
  constructor() {
    // Each context gets its own storage
    this.storage = {
      cookies: new Map(),
      localStorage: new Map(),
      sessionStorage: new Map(),
      cache: new Map(),
    };
  }
  
  async newPage(): Promise<Page> {
    // Creates page within this context's storage
    return new Page(this.storage);
  }
}
```

**Memory Cost of Contexts:**

```typescript
// Memory usage (approximate)
Browser: 100MB (one-time)
  ├─ Context 1: +10MB
  ├─ Context 2: +10MB
  ├─ Context 3: +10MB
  └─ Context 4: +10MB

Total: 140MB for 4 contexts
```

**When to Create New Contexts:**

| Scenario | Strategy | Reason |
|----------|----------|--------|
| **Different users** | New context per user | Isolated sessions |
| **Different permissions** | New context per role | Isolated permissions |
| **Parallel tests** | New context per test | Test isolation |
| **Same user, multiple tabs** | Same context, multiple pages | Shared session |
| **Incognito mode** | New context | Private browsing |

**Performance: Context Reuse Pattern**

```typescript
// ❌ Slow: Create context every test
test.beforeEach(async ({ browser }) => {
  const context = await browser.newContext();  // 200ms
  const page = await context.newPage();  // 50ms
  // Total: 250ms per test
});

// ✅ Fast: Reuse context with storage state
// Setup once
test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('/login');
  await page.fill('#email', 'user@example.com');
  await page.fill('#password', 'password');
  await page.click('#submit');
  await context.storageState({ path: 'auth.json' });  // Save state
  await context.close();
});

// Reuse in tests (fast!)
test('test', async ({ browser }) => {
  const context = await browser.newContext({
    storageState: 'auth.json',  // Load saved state (10ms)
  });
  const page = await context.newPage();
  // Already logged in!
});
```

---

#### 6.0.4 Parallel Execution: Worker Pool Management (Architecture)

**How Playwright Manages Workers:**

```
Test Suite (100 tests)
│
├─ Worker 1 (Browser Instance)
│  ├─ Context 1 → Test 1, Test 2, Test 3
│  └─ Context 2 → Test 4, Test 5
│
├─ Worker 2 (Browser Instance)
│  ├─ Context 3 → Test 6, Test 7
│  └─ Context 4 → Test 8, Test 9
│
├─ Worker 3 (Browser Instance)
│  └─ Context 5 → Test 10, Test 11
│
└─ Worker 4 (Browser Instance)
   └─ Context 6 → Test 12, Test 13
```

**Worker Lifecycle:**

```typescript
// Conceptual implementation
class WorkerPool {
  private workers: Worker[] = [];
  
  async initialize(workerCount: number) {
    for (let i = 0; i < workerCount; i++) {
      const worker = new Worker();
      await worker.launchBrowser();  // 1-2 seconds
      this.workers.push(worker);
    }
  }
  
  async runTests(tests: Test[]) {
    const testQueue = [...tests];
    
    // Each worker picks tests from queue
    await Promise.all(
      this.workers.map(worker => 
        worker.runTestsFromQueue(testQueue)
      )
    );
  }
}

class Worker {
  private browser: Browser;
  
  async launchBrowser() {
    this.browser = await chromium.launch();
  }
  
  async runTestsFromQueue(queue: Test[]) {
    while (queue.length > 0) {
      const test = queue.shift();
      
      // Create fresh context for test
      const context = await this.browser.newContext();
      const page = await context.newPage();
      
      try {
        await test.run(page);
      } finally {
        await context.close();  // Cleanup
      }
    }
  }
}
```

**Race Conditions in Parallel Tests:**

```typescript
// ❌ BAD: Shared resource (file system)
test('test 1', async ({ page }) => {
  fs.writeFileSync('data.json', JSON.stringify({ user: 'Alice' }));
  await page.goto('/dashboard');
  // Uses data.json
});

test('test 2', async ({ page }) => {
  fs.writeFileSync('data.json', JSON.stringify({ user: 'Bob' }));
  await page.goto('/dashboard');
  // Uses data.json - RACE CONDITION!
});

// ✅ GOOD: Unique resource per test
test('test 1', async ({ page }, testInfo) => {
  const dataFile = `data-${testInfo.workerIndex}.json`;
  fs.writeFileSync(dataFile, JSON.stringify({ user: 'Alice' }));
  await page.goto(`/dashboard?data=${dataFile}`);
});

test('test 2', async ({ page }, testInfo) => {
  const dataFile = `data-${testInfo.workerIndex}.json`;
  fs.writeFileSync(dataFile, JSON.stringify({ user: 'Bob' }));
  await page.goto(`/dashboard?data=${dataFile}`);
});
```

**Worker Index Usage:**

```typescript
test('use worker index', async ({ page }, testInfo) => {
  const workerIndex = testInfo.workerIndex;  // 0, 1, 2, 3...
  
  // Unique database per worker
  const dbName = `test_db_${workerIndex}`;
  
  // Unique port per worker
  const port = 3000 + workerIndex;
  
  // Unique user per worker
  const email = `user${workerIndex}@example.com`;
});
```

**CPU and Memory Optimization:**

```typescript
// Calculate optimal workers
const cpuCores = os.cpus().length;  // e.g., 8

// Strategy 1: Conservative (recommended)
const workers = Math.max(1, cpuCores - 1);  // 7 workers

// Strategy 2: Aggressive
const workers = cpuCores;  // 8 workers

// Strategy 3: CI optimization
const workers = process.env.CI ? 4 : Math.max(1, cpuCores - 1);

// Memory consideration
const availableMemoryGB = os.totalmem() / (1024 ** 3);  // e.g., 16GB
const memoryPerWorker = 0.5;  // 500MB per worker
const maxWorkersByMemory = Math.floor(availableMemoryGB / memoryPerWorker);

const workers = Math.min(
  Math.max(1, cpuCores - 1),
  maxWorkersByMemory
);
```

---

#### 6.0.5 Network Interception: How Route() Works Internally

**The Request/Response Flow:**

```
1. Browser makes request
   ↓
2. Playwright intercepts (if route() registered)
   ↓
3. Route handler executes
   ↓
4. Handler decides:
   - route.continue() → Send to server
   - route.fulfill() → Mock response
   - route.abort() → Block request
   ↓
5. Response sent to browser
```

**Internal Implementation Concept:**

```typescript
class Page {
  private routes: Array<{
    pattern: string | RegExp;
    handler: (route: Route) => void;
  }> = [];
  
  async route(pattern: string | RegExp, handler: (route: Route) => void) {
    this.routes.push({ pattern, handler });
  }
  
  // Internal: Called when browser makes request
  private async onBrowserRequest(request: Request) {
    // Find matching route
    const matchingRoute = this.routes.find(r => 
      this.matchesPattern(request.url(), r.pattern)
    );
    
    if (matchingRoute) {
      const route = new Route(request, this);
      await matchingRoute.handler(route);
    } else {
      // No route matched, send request normally
      await this.sendRequestToServer(request);
    }
  }
}

class Route {
  private _continued = false;
  private _fulfilled = false;
  
  async continue() {
    if (this._continued || this._fulfilled) {
      throw new Error('Route already handled');
    }
    this._continued = true;
    await this.page.sendRequestToServer(this.request);
  }
  
  async fulfill(options: { status, body, headers }) {
    if (this._continued || this._fulfilled) {
      throw new Error('Route already handled');
    }
    this._fulfilled = true;
    await this.page.sendMockResponseToBrowser({
      status: options.status,
      body: options.body,
      headers: options.headers,
    });
  }
  
  async abort() {
    if (this._continued || this._fulfilled) {
      throw new Error('Route already handled');
    }
    this._fulfilled = true;
    await this.page.blockRequest(this.request);
  }
}
```

**Performance Impact of route():**

```typescript
// Scenario 1: No interception
await page.goto('/');
// Time: 500ms (normal)

// Scenario 2: Intercept and continue all
await page.route('**/*', route => route.continue());
await page.goto('/');
// Time: 550ms (+10% overhead from interception)

// Scenario 3: Intercept and mock
await page.route('**/api/*', route => {
  route.fulfill({ body: '{"data": []}' });
});
await page.goto('/');
// Time: 300ms (faster! No API calls)

// Scenario 4: Many routes
for (let i = 0; i < 100; i++) {
  await page.route(`**/api/endpoint${i}`, route => route.fulfill({ body: '{}' }));
}
await page.goto('/');
// Time: 600ms (overhead from matching 100 patterns)
```

**Best Practice: Specific Patterns**

```typescript
// ❌ Slow: Broad pattern
await page.route('**/*', route => {
  if (route.request().url().includes('/api/')) {
    route.fulfill({ body: '{}' });
  } else {
    route.continue();
  }
});

// ✅ Fast: Specific pattern
await page.route('**/api/**', route => {
  route.fulfill({ body: '{}' });
});
```

---

#### 6.0.6 Storage State: Authentication Internals

**What storageState() Actually Saves:**

```json
// auth.json (saved by storageState)
{
  "cookies": [
    {
      "name": "sessionId",
      "value": "abc123xyz",
      "domain": "example.com",
      "path": "/",
      "expires": 1735689600,
      "httpOnly": true,
      "secure": true,
      "sameSite": "Lax"
    }
  ],
  "origins": [
    {
      "origin": "https://example.com",
      "localStorage": [
        {
          "name": "authToken",
          "value": "eyJhbGc..."
        },
        {
          "name": "userId",
          "value": "12345"
        }
      ]
    }
  ]
}
```

**How storageState() Loading Works:**

```typescript
// Conceptual implementation
class BrowserContext {
  async loadStorageState(statePath: string) {
    const state = JSON.parse(fs.readFileSync(statePath));
    
    // 1. Set cookies
    await this.addCookies(state.cookies);
    
    // 2. Set localStorage (before any page creation)
    this.initialScripts.push(() => {
      for (const origin of state.origins) {
        for (const item of origin.localStorage) {
          localStorage.setItem(item.name, item.value);
        }
      }
    });
  }
  
  async newPage() {
    const page = await super.newPage();
    
    // Execute initial scripts (set localStorage)
    for (const script of this.initialScripts) {
      await page.addInitScript(script);
    }
    
    return page;
  }
}
```

**Performance: Login Every Test vs storageState**

```typescript
// ❌ Slow: Login every test
test('test 1', async ({ page }) => {
  await page.goto('/login');           // 500ms
  await page.fill('#email', 'user@example.com');  // 100ms
  await page.fill('#password', 'pass');  // 100ms
  await page.click('#submit');         // 200ms
  await page.waitForURL('**/dashboard');  // 500ms
  // Total: 1,400ms WASTED on login
  
  // Actual test starts here
  await page.click('#button');
});

// ✅ Fast: Use storageState
// Setup once (global-setup.ts)
async function globalSetup() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('/login');
  await page.fill('#email', 'user@example.com');
  await page.fill('#password', 'pass');
  await page.click('#submit');
  await page.waitForURL('**/dashboard');
  
  await context.storageState({ path: 'auth.json' });  // Save once
  await browser.close();
}

// Every test (fast!)
test.use({ storageState: 'auth.json' });

test('test 1', async ({ page }) => {
  await page.goto('/dashboard');  // Already logged in! Only 500ms
  
  // Test starts immediately
  await page.click('#button');
});

// Time saved: 1,400ms - 500ms = 900ms per test
// For 100 tests: 90 seconds saved!
```

**Security Consideration:**

```typescript
// ⚠️ WARNING: storageState contains sensitive data
// auth.json contains:
// - Session tokens
// - JWT tokens
// - API keys
// - User IDs

// ✅ Best practices:
// 1. Add to .gitignore
echo "auth.json" >> .gitignore

// 2. Use environment-specific tokens
const storageState = process.env.CI 
  ? 'auth-ci.json'  // CI uses test account
  : 'auth-local.json';  // Local uses dev account

// 3. Rotate tokens regularly
// 4. Use short-lived tokens
// 5. Don't commit to repository
```

---

#### 6.0.7 Fixtures Lifecycle: Deep Understanding

**Fixture Execution Order:**

```typescript
import { test as base } from '@playwright/test';

const test = base.extend({
  // Worker fixture (setup once per worker)
  workerData: [async ({}, use) => {
    console.log('1. Worker fixture setup');
    const data = await setupDatabase();
    await use(data);
    console.log('6. Worker fixture teardown');
    await cleanupDatabase(data);
  }, { scope: 'worker' }],
  
  // Test fixture (setup per test)
  userData: async ({ workerData }, use) => {
    console.log('2. Test fixture setup');
    const user = await createUser(workerData);
    await use(user);
    console.log('5. Test fixture teardown');
    await deleteUser(user);
  },
});

test('my test', async ({ page, userData }) => {
  console.log('3. Test starts');
  await page.goto('/');
  console.log('4. Test ends');
});

// Output:
// 1. Worker fixture setup (once per worker)
// 2. Test fixture setup (before each test)
// 3. Test starts
// 4. Test ends
// 5. Test fixture teardown (after each test)
// ... more tests run ...
// 6. Worker fixture teardown (after all tests in worker)
```

**Fixture Dependency Graph:**

```typescript
const test = base.extend({
  fixtureA: async ({}, use) => {
    console.log('Setup A');
    await use('A');
    console.log('Teardown A');
  },
  
  fixtureB: async ({ fixtureA }, use) => {
    console.log('Setup B (depends on A)');
    await use('B');
    console.log('Teardown B');
  },
  
  fixtureC: async ({ fixtureA, fixtureB }, use) => {
    console.log('Setup C (depends on A and B)');
    await use('C');
    console.log('Teardown C');
  },
});

test('test', async ({ fixtureC }) => {
  console.log('Test runs');
});

// Output:
// Setup A
// Setup B (depends on A)
// Setup C (depends on A and B)
// Test runs
// Teardown C
// Teardown B
// Teardown A
```

**Memory Leak Prevention:**

```typescript
// ❌ Memory leak: Fixture never cleaned
const test = base.extend({
  leakyFixture: async ({}, use) => {
    const hugeArray = new Array(1000000).fill('data');
    await use(hugeArray);
    // Oops! Forgot teardown
    // hugeArray stays in memory
  },
});

// ✅ Proper cleanup
const test = base.extend({
  cleanFixture: async ({}, use) => {
    const hugeArray = new Array(1000000).fill('data');
    
    await use(hugeArray);
    
    // Cleanup
    hugeArray.length = 0;  // Clear array
    // Or let garbage collection handle it
  },
});
```

---

### 6.1 Playwright Auto-Wait vs Explicit Waits

#### What is Auto-Waiting?

Playwright **automatically waits** for elements to be actionable before performing actions. No need for manual `sleep()` or `wait()` calls!

#### Actions with Auto-Wait

```typescript
// All these actions auto-wait for element to be:
// 1. Attached to DOM
// 2. Visible
// 3. Stable (not animating)
// 4. Enabled
// 5. Not obscured by other elements

await page.click('button');           // Waits until clickable
await page.fill('input', 'text');     // Waits until fillable
await page.selectOption('select', 'value'); // Waits until selectable
await page.check('checkbox');         // Waits until checkable
await page.setInputFiles('input', 'file.pdf'); // Waits until ready
```

#### Auto-Wait Conditions

| Action | Wait Conditions |
|--------|-----------------|
| `click()` | Attached, Visible, Stable, Enabled, Not obscured |
| `fill()` | Attached, Visible, Enabled |
| `check()`/`uncheck()` | Attached, Visible, Enabled |
| `selectOption()` | Attached, Visible, Enabled |
| `hover()` | Attached, Visible, Stable |
| `focus()` | Attached |

#### When Auto-Wait Is Not Enough

```typescript
// Explicit waits for specific conditions
await page.waitForSelector('.element'); // Element exists in DOM
await page.waitForLoadState('networkidle'); // No network activity
await page.waitForURL('**/dashboard'); // URL matches pattern
await page.waitForTimeout(1000); // Fixed wait (avoid!)

// Wait for element state
await page.locator('.element').waitFor({ state: 'visible' });
await page.locator('.element').waitFor({ state: 'hidden' });
await page.locator('.element').waitFor({ state: 'attached' });
await page.locator('.element').waitFor({ state: 'detached' });
```

---

### 6.2 Stable Navigation & Network-Idle Heuristics

#### Navigation Wait States

```typescript
// Wait until 'load' event (default)
await page.goto('https://example.com', { waitUntil: 'load' });

// Wait until 'domcontentloaded' event (faster)
await page.goto('https://example.com', { waitUntil: 'domcontentloaded' });

// Wait until no network connections for 500ms
await page.goto('https://example.com', { waitUntil: 'networkidle' });

// Combine multiple conditions
await page.goto('https://example.com', { 
  waitUntil: 'domcontentloaded',
  timeout: 30000 
});
```

#### When to Use Each Wait State

| Wait State | Use Case | Speed |
|------------|----------|-------|
| `domcontentloaded` | Fast, HTML parsed | ⚡⚡⚡ Fastest |
| `load` | All resources loaded | ⚡⚡ Fast |
| `networkidle` | AJAX/dynamic content | ⚡ Slowest |

#### Network Idle Best Practices

```typescript
// Good: Use for SPAs with AJAX
test('SPA with dynamic content', async ({ page }) => {
  await page.goto('/dashboard', { waitUntil: 'networkidle' });
  await expect(page.locator('.user-data')).toBeVisible();
});

// Better: Wait for specific element instead
test('Wait for specific content', async ({ page }) => {
  await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.user-data');
});

// Best: Use auto-waiting
test('Rely on auto-wait', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.locator('.user-data')).toBeVisible();
});
```

#### Custom Network Idle

```typescript
async function waitForNetworkIdle(page: Page, idleTime = 500) {
  let timeout: NodeJS.Timeout;
  
  return new Promise<void>((resolve) => {
    const onRequest = () => {
      clearTimeout(timeout);
    };
    
    const onResponse = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        page.off('request', onRequest);
        page.off('response', onResponse);
        resolve();
      }, idleTime);
    };
    
    page.on('request', onRequest);
    page.on('response', onResponse);
    
    // Initial timeout
    timeout = setTimeout(() => {
      page.off('request', onRequest);
      page.off('response', onResponse);
      resolve();
    }, idleTime);
  });
}

// Usage
await page.goto('/dashboard');
await waitForNetworkIdle(page, 1000);
```

---

### 6.3 Retries, Timeouts & Backoff Strategies

#### Timeout Configuration Hierarchy

```typescript
// 1. Global config (playwright.config.ts)
export default defineConfig({
  timeout: 30000,                    // Test timeout
  expect: { timeout: 5000 },         // Assertion timeout
  use: {
    actionTimeout: 10000,            // Action timeout
    navigationTimeout: 30000,        // Navigation timeout
  },
});

// 2. Test-level timeout
test('slow test', async ({ page }) => {
  test.setTimeout(60000);
  // ...
});

// 3. Action-level timeout
await page.click('button', { timeout: 5000 });
await page.waitForSelector('.element', { timeout: 10000 });
```

#### Timeout Priority

```
Action timeout > Test timeout > Global timeout
```

#### Retry Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  retries: process.env.CI ? 2 : 0,  // Retry 2x on CI, 0x locally
  
  projects: [
    {
      name: 'chromium',
      retries: 1,  // Override for specific project
    },
  ],
});

// Per-test retry
test('flaky test', async ({ page }) => {
  test.info().annotations.push({ type: 'flaky' });
  // ...
});
```

#### Exponential Backoff

```typescript
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const delay = baseDelay * Math.pow(2, i);
      console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}

// Usage
await retryWithBackoff(async () => {
  await page.goto('https://flaky-api.com/data');
  await expect(page.locator('.data')).toBeVisible();
});
```

#### Smart Retry Logic

```typescript
async function smartRetry(
  page: Page,
  action: () => Promise<void>,
  options = { maxRetries: 3, retryableErrors: ['timeout', 'detached'] }
) {
  for (let i = 0; i < options.maxRetries; i++) {
    try {
      await action();
      return;
    } catch (error: any) {
      const isRetryable = options.retryableErrors.some(err => 
        error.message.toLowerCase().includes(err)
      );
      
      if (!isRetryable || i === options.maxRetries - 1) {
        throw error;
      }
      
      console.log(`Retryable error, attempt ${i + 2}/${options.maxRetries}`);
      await page.reload();
      await page.waitForLoadState('networkidle');
    }
  }
}
```

---

### 6.4 Flaky Test Detection & Quarantine Strategies

#### Detecting Flaky Tests

```typescript
// playwright.config.ts
export default defineConfig({
  // Run each test multiple times to detect flakiness
  repeatEach: process.env.DETECT_FLAKY ? 10 : 1,
  
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results.json' }],
  ],
});
```

#### Marking Flaky Tests

```typescript
// Annotate known flaky tests
test('flaky test', async ({ page }) => {
  test.info().annotations.push({ 
    type: 'issue', 
    description: 'https://github.com/org/repo/issues/123' 
  });
  // ...
});

// Skip flaky tests
test.skip('known flaky test', async ({ page }) => {
  // Will be skipped
});

// Conditional skip
test('conditionally skip', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'Flaky on WebKit');
  // ...
});
```

#### Quarantine Pattern

```typescript
// tests/quarantine/
// Move flaky tests here temporarily

// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'stable',
      testMatch: /^(?!.*quarantine).*\.spec\.ts$/,
    },
    {
      name: 'quarantine',
      testMatch: '**/quarantine/**/*.spec.ts',
      retries: 3,
      timeout: 60000,
    },
  ],
});
```

#### Flake Rate Monitoring

```typescript
// scripts/analyze-flakes.ts
import fs from 'fs';

interface TestResult {
  title: string;
  status: string;
  retry: number;
}

function analyzeFlakes(resultsFile: string) {
  const results: TestResult[] = JSON.parse(fs.readFileSync(resultsFile, 'utf-8'));
  const flakes: Map<string, number> = new Map();
  
  results.forEach(result => {
    if (result.retry > 0 && result.status === 'passed') {
      flakes.set(result.title, (flakes.get(result.title) || 0) + 1);
    }
  });
  
  console.log('Flaky Tests:');
  Array.from(flakes.entries())
    .sort((a, b) => b[1] - a[1])
    .forEach(([test, count]) => {
      console.log(`${test}: ${count} flakes`);
    });
}
```

---

### 6.5 Idempotent Steps & Resilient Teardown

#### Idempotent Test Setup

```typescript
// Each test can run independently
test.beforeEach(async ({ page }) => {
  // Clean state
  await page.goto('/');
  
  // Clear storage
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

// Idempotent data setup
test('create user', async ({ request }) => {
  // Delete if exists
  await request.delete('/api/users/test@example.com').catch(() => {});
  
  // Create fresh user
  await request.post('/api/users', {
    data: { email: 'test@example.com', name: 'Test User' }
  });
});
```

#### Resilient Teardown

```typescript
test.afterEach(async ({ page }, testInfo) => {
  // Always cleanup, even if test failed
  try {
    await page.evaluate(() => {
      // Cleanup app state
      (window as any).cleanup?.();
    });
  } catch (error) {
    console.log('Cleanup error (non-critical):', error);
  }
  
  // Attach screenshot on failure
  if (testInfo.status !== 'passed') {
    await page.screenshot({ 
      path: `failures/${testInfo.title}.png`,
      fullPage: true 
    });
  }
});

test.afterAll(async ({ }) => {
  // Global cleanup
  // Delete test data, close connections, etc.
});
```

#### Database Teardown Pattern

```typescript
import { db } from './database';

test.afterEach(async () => {
  // Rollback database changes
  await db.query('DELETE FROM users WHERE email LIKE "%test%"');
  await db.query('DELETE FROM orders WHERE user_id IN (SELECT id FROM users WHERE email LIKE "%test%")');
});

// Or use transactions
test('with transaction', async ({ page }) => {
  const transaction = await db.beginTransaction();
  
  try {
    // Test operations...
    await transaction.rollback();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
});
```

---

## 7. Test Runner Essentials (Config, Fixtures, Hooks)

### 7.0 Deep Dive: Test Isolation & Why It Matters

**The Cost of NOT Having Test Isolation:**

```typescript
// ❌ Tests with shared state (disaster waiting to happen)
let globalUser = null;

test('create user', async ({ page }) => {
  globalUser = { id: 1, name: 'Alice' };
  await page.goto('/users');
  // Creates user in database
});

test('update user', async ({ page }) => {
  // PROBLEM: Depends on 'create user' running first!
  // If 'create user' fails, this test breaks
  // If tests run in different order, this breaks
  // If tests run in parallel, this breaks
  await page.goto(`/users/${globalUser.id}`);  // globalUser might be null!
  await page.fill('#name', 'Bob');
});

test('delete user', async ({ page }) => {
  // PROBLEM: Depends on previous tests!
  await page.goto(`/users/${globalUser.id}`);
  await page.click('#delete');
});
```

**What Goes Wrong:**

1. **Order Dependency:** Tests must run in specific order
2. **Parallel Failure:** Tests can't run in parallel (race conditions)
3. **Debugging Hell:** One test failure breaks all subsequent tests
4. **Flaky Tests:** Sometimes pass, sometimes fail (non-deterministic)
5. **Maintenance Nightmare:** Changing one test breaks others

**Playwright's Solution: Complete Isolation**

```typescript
// ✅ Isolated tests (each test is independent)
test('create user', async ({ page }) => {
  // Setup: Create fresh user for THIS test only
  const user = await createTestUser({ name: 'Alice' });
  
  await page.goto('/users');
  await page.click('#create-user');
  await page.fill('#name', user.name);
  await page.click('#submit');
  
  // Cleanup: Delete user after test
  await deleteTestUser(user.id);
});

test('update user', async ({ page }) => {
  // Setup: Create fresh user for THIS test only
  const user = await createTestUser({ name: 'Bob' });
  
  await page.goto(`/users/${user.id}`);
  await page.fill('#name', 'Charlie');
  await page.click('#update');
  
  await expect(page.locator('#name')).toHaveValue('Charlie');
  
  // Cleanup: Delete user after test
  await deleteTestUser(user.id);
});

test('delete user', async ({ page }) => {
  // Setup: Create fresh user for THIS test only
  const user = await createTestUser({ name: 'Dave' });
  
  await page.goto(`/users/${user.id}`);
  await page.click('#delete');
  
  await expect(page).toHaveURL('/users');
  
  // Cleanup already done by delete action
});
```

**How Playwright Enforces Isolation:**

```
Test 1 (Worker 1)
├─ Fresh browser context
├─ Empty localStorage
├─ No cookies
├─ Clean database state (via fixtures)
└─ Isolated from other tests

Test 2 (Worker 2) - Runs in parallel
├─ Fresh browser context
├─ Empty localStorage
├─ No cookies
├─ Clean database state (via fixtures)
└─ Isolated from Test 1

Test 3 (Worker 1) - Reuses worker, new context
├─ NEW browser context (previous one closed)
├─ Empty localStorage
├─ No cookies
├─ Clean database state (via fixtures)
└─ No data from Test 1
```

**Performance vs Isolation Trade-off:**

| Approach | Speed | Reliability | Parallelizable | Debugging Ease |
|----------|-------|-------------|----------------|----------------|
| **Shared state** | ⚡ Fast (no setup) | ❌ Unreliable | ❌ No | ❌ Very Hard |
| **Full isolation** | 🐌 Slower (setup each test) | ✅ 100% Reliable | ✅ Yes | ✅ Easy |
| **Smart fixtures** | ⚡ Fast (reuse setup) | ✅ Reliable | ✅ Yes | ✅ Easy |

**Smart Isolation with Fixtures (Best of Both Worlds):**

```typescript
import { test as base } from '@playwright/test';

// Fixture: Provides isolated user for each test
type TestFixtures = {
  authenticatedUser: { id: number; token: string };
};

const test = base.extend<TestFixtures>({
  authenticatedUser: async ({ browser }, use) => {
    // Setup: Create user once for this test
    const user = await createTestUser({ name: 'TestUser' });
    const token = await loginUser(user.email, user.password);
    
    // Provide to test
    await use({ id: user.id, token });
    
    // Teardown: Clean up after test
    await deleteTestUser(user.id);
  },
});

// Tests are now isolated AND clean
test('test 1', async ({ page, authenticatedUser }) => {
  // Has its own user, isolated from other tests
  await page.setExtraHTTPHeaders({
    'Authorization': `Bearer ${authenticatedUser.token}`,
  });
  await page.goto('/dashboard');
  await expect(page).toHaveURL('/dashboard');
});

test('test 2', async ({ page, authenticatedUser }) => {
  // Has its own DIFFERENT user, isolated from test 1
  await page.setExtraHTTPHeaders({
    'Authorization': `Bearer ${authenticatedUser.token}`,
  });
  await page.goto('/dashboard');
  await expect(page).toHaveURL('/dashboard');
});
```

**Real-World Example: Database Seeding with Isolation**

```typescript
// ❌ BAD: All tests share same database records
test.beforeAll(async () => {
  await db.seed([
    { id: 1, name: 'Product A', price: 100 },
    { id: 2, name: 'Product B', price: 200 },
  ]);
});

test('test 1 modifies price', async ({ page }) => {
  await page.goto('/products/1');
  await page.fill('#price', '150');
  await page.click('#save');
  // Changed Product A price to 150
});

test('test 2 expects original price', async ({ page }) => {
  await page.goto('/products/1');
  const price = await page.locator('#price').inputValue();
  expect(price).toBe('100');  // ❌ FAILS! Price is now 150
});

// ✅ GOOD: Each test gets fresh database
const test = base.extend({
  products: async ({}, use, testInfo) => {
    // Create products with unique IDs per test
    const uniqueId = testInfo.workerIndex * 1000 + testInfo.parallelIndex;
    const products = await db.create([
      { id: uniqueId + 1, name: 'Product A', price: 100 },
      { id: uniqueId + 2, name: 'Product B', price: 200 },
    ]);
    
    await use(products);
    
    // Clean up after test
    await db.delete([uniqueId + 1, uniqueId + 2]);
  },
});

test('test 1 modifies price', async ({ page, products }) => {
  await page.goto(`/products/${products[0].id}`);
  await page.fill('#price', '150');
  await page.click('#save');
  // Modified its own isolated product
});

test('test 2 expects original price', async ({ page, products }) => {
  await page.goto(`/products/${products[0].id}`);
  const price = await page.locator('#price').inputValue();
  expect(price).toBe('100');  // ✅ PASSES! Has its own product
});
```

---

### 7.1 Playwright Test Runner Overview

Playwright Test is a modern test runner built specifically for Playwright with:
- Parallel execution
- Retries
- Fixtures
- Multiple reporters
- Sharding
- Projects

#### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});

test.describe('test suite', () => {
  test('test 1', async ({ page }) => {
    // ...
  });
  
  test('test 2', async ({ page }) => {
    // ...
  });
});
```

---

### 7.2 playwright.config Deep Dive

#### Complete Configuration Example

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Test directory
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  testIgnore: '**/node_modules/**',
  
  // Timeouts
  timeout: 30000,
  globalTimeout: 60 * 60 * 1000, // 1 hour for all tests
  expect: {
    timeout: 5000,
    toHaveScreenshot: { maxDiffPixels: 100 },
  },
  
  // Parallel execution
  fullyParallel: true,
  workers: process.env.CI ? 2 : undefined,
  
  // Failures
  maxFailures: process.env.CI ? 10 : undefined,
  forbidOnly: !!process.env.CI,
  
  // Retries
  retries: process.env.CI ? 2 : 0,
  
  // Reporters
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'results.json' }],
    ['junit', { outputFile: 'results.xml' }],
  ],
  
  // Global setup/teardown
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),
  
  // Shared settings
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
    
    // Browser options
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    bypassCSP: true,
    
    // Context options
    locale: 'en-US',
    timezoneId: 'America/New_York',
    geolocation: { latitude: 40.7128, longitude: -74.0060 },
    permissions: ['geolocation'],
    colorScheme: 'dark',
    
    // Network
    offline: false,
    httpCredentials: {
      username: process.env.HTTP_USER || '',
      password: process.env.HTTP_PASS || '',
    },
  },
  
  // Projects (browsers, devices)
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'auth.json',
      },
      dependencies: ['setup'],
    },
    
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  
  // Web server
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
  
  // Output
  outputDir: 'test-results',
  snapshotDir: 'snapshots',
});
```

#### Project-Specific Configuration

```typescript
projects: [
  // Smoke tests
  {
    name: 'smoke',
    testMatch: '**/*.smoke.spec.ts',
    retries: 0,
    timeout: 10000,
  },
  
  // Regression tests
  {
    name: 'regression',
    testMatch: '**/*.spec.ts',
    testIgnore: '**/*.smoke.spec.ts',
    retries: 2,
  },
  
  // Visual tests
  {
    name: 'visual',
    testMatch: '**/*.visual.spec.ts',
    use: {
      viewport: { width: 1920, height: 1080 },
    },
  },
],
```

#### Grep Pattern Filtering

```typescript
// playwright.config.ts
export default defineConfig({
  grep: /@smoke/, // Only run tests with @smoke tag
  grepInvert: /@slow/, // Exclude tests with @slow tag
});
```

```bash
# Run from CLI
npx playwright test --grep @smoke
npx playwright test --grep-invert @slow
npx playwright test --grep "@smoke|@critical"
```

---

### 7.3 Built-in & Custom Fixtures

#### Built-in Fixtures

```typescript
test('using built-in fixtures', async ({ 
  page,          // Isolated page
  context,       // Browser context
  browser,       // Browser instance
  browserName,   // 'chromium', 'firefox', 'webkit'
  request,       // APIRequestContext for API calls
}) => {
  await page.goto('/');
});
```

#### Custom Fixtures

```typescript
// fixtures/auth.ts
import { test as base } from '@playwright/test';

type AuthFixtures = {
  authenticatedPage: Page;
  adminPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Setup
    await page.goto('/login');
    await page.fill('#email', 'user@example.com');
    await page.fill('#password', 'password123');
    await page.click('#submit');
    await page.waitForURL('**/dashboard');
    
    // Provide to test
    await use(page);
    
    // Teardown
    await page.goto('/logout');
  },
  
  adminPage: async ({ page }, use) => {
    await page.goto('/login');
    await page.fill('#email', 'admin@example.com');
    await page.fill('#password', 'admin123');
    await page.click('#submit');
    
    await use(page);
    
    await page.goto('/logout');
  },
});

// Use in tests
test('user dashboard', async ({ authenticatedPage }) => {
  await expect(authenticatedPage.locator('.user-welcome')).toBeVisible();
});
```

#### API Client Fixture

```typescript
type APIFixtures = {
  apiClient: APIClient;
};

class APIClient {
  constructor(private request: APIRequestContext) {}
  
  async createUser(email: string, password: string) {
    return await this.request.post('/api/users', {
      data: { email, password }
    });
  }
  
  async deleteUser(email: string) {
    return await this.request.delete(`/api/users/${email}`);
  }
}

export const test = base.extend<APIFixtures>({
  apiClient: async ({ request }, use) => {
    const client = new APIClient(request);
    await use(client);
  },
});

// Use in tests
test('create and delete user', async ({ apiClient }) => {
  await apiClient.createUser('test@example.com', 'pass123');
  await apiClient.deleteUser('test@example.com');
});
```

---

### 7.4 Hooks (beforeAll, afterAll, beforeEach, afterEach)

```typescript
test.describe('User Management', () => {
  // Runs once before all tests in this describe block
  test.beforeAll(async ({ browser }) => {
    console.log('Setup test suite');
    // Create test database, seed data
  });
  
  // Runs before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/users');
    console.log('Before test:', test.info().title);
  });
  
  // Runs after each test
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== 'passed') {
      await page.screenshot({ path: `failures/${testInfo.title}.png` });
    }
  });
  
  // Runs once after all tests in this describe block
  test.afterAll(async () => {
    console.log('Teardown test suite');
    // Cleanup test data
  });
  
  test('test 1', async ({ page }) => {
    // Test code
  });
  
  test('test 2', async ({ page }) => {
    // Test code
  });
});
```

---

### 7.5 Parametrization & Data-Driven Testing

#### Using test.describe with forEach

```typescript
const users = [
  { email: 'user1@example.com', role: 'user' },
  { email: 'admin@example.com', role: 'admin' },
  { email: 'guest@example.com', role: 'guest' },
];

users.forEach(user => {
  test(`login as ${user.role}`, async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', user.email);
    await page.fill('#password', 'password123');
    await page.click('#submit');
    
    if (user.role === 'admin') {
      await expect(page.locator('.admin-panel')).toBeVisible();
    }
  });
});
```

#### Data Files

```typescript
// data/test-users.json
[
  { "email": "user1@example.com", "password": "pass1" },
  { "email": "user2@example.com", "password": "pass2" }
]

// tests/login.spec.ts
import users from '../data/test-users.json';

for (const user of users) {
  test(`login with ${user.email}`, async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', user.email);
    await page.fill('#password', user.password);
    await page.click('#submit');
  });
}
```

#### CSV Data

```typescript
import fs from 'fs';
import { parse } from 'csv-parse/sync';

const records = parse(fs.readFileSync('data/users.csv'), {
  columns: true,
  skip_empty_lines: true,
});

for (const record of records) {
  test(`test with ${record.username}`, async ({ page }) => {
    // Use record.username, record.email, etc.
  });
}
```

---

### 7.6 Tagging, Selective Runs, Smoke/Regression Suites

#### Tagging Tests

```typescript
// Using test.describe
test.describe('Smoke Tests @smoke', () => {
  test('critical path', async ({ page }) => {
    // ...
  });
});

// Using annotations
test('payment flow', {
  annotation: { type: 'critical', description: 'Core business flow' },
}, async ({ page }) => {
  // ...
});

// Multiple tags in title
test('login @smoke @auth @critical', async ({ page }) => {
  // ...
});
```

#### Running Tagged Tests

```bash
# Run smoke tests only
npx playwright test --grep @smoke

# Run non-slow tests
npx playwright test --grep-invert @slow

# Run smoke OR critical
npx playwright test --grep "@smoke|@critical"

# Run smoke AND auth
npx playwright test --grep "(?=.*@smoke)(?=.*@auth)"
```

#### Smoke vs Regression Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'smoke',
      grep: /@smoke/,
      retries: 0,
      timeout: 10000,
    },
    {
      name: 'regression',
      grepInvert: /@smoke/,
      retries: 2,
      timeout: 30000,
    },
  ],
});
```

```bash
# Run smoke suite
npx playwright test --project=smoke

# Run regression suite
npx playwright test --project=regression
```

---

## 8. Assertions & Matchers

### 8.1 expect & Locator Assertions

#### Web-First Assertions (Auto-Retry)

```typescript
// These assertions auto-retry until timeout
await expect(page).toHaveTitle(/Playwright/);
await expect(page).toHaveURL('https://example.com');
await expect(page.locator('h1')).toBeVisible();
await expect(page.locator('h1')).toContainText('Welcome');
await expect(page.locator('h1')).toHaveText('Welcome Back');
await expect(page.locator('button')).toBeEnabled();
await expect(page.locator('button')).toBeDisabled();
await expect(page.locator('input')).toBeFocused();
await expect(page.locator('input')).toHaveValue('test');
await expect(page.locator('img')).toHaveAttribute('src', '/logo.png');
await expect(page.locator('div')).toHaveClass('active');
await expect(page.locator('div')).toHaveCSS('color', 'rgb(255, 0, 0)');
await expect(page.locator('.item')).toHaveCount(5);
await expect(page.locator('input')).toBeChecked();
await expect(page.locator('button')).toBeHidden();
await expect(page.locator('button')).toBeAttached();
```

#### Generic Assertions (No Auto-Retry)

```typescript
const text = await page.locator('h1').textContent();
expect(text).toBe('Hello');
expect(text).toContain('Hello');
expect(text).toMatch(/hello/i);

const count = await page.locator('.item').count();
expect(count).toBeGreaterThan(0);
expect(count).toBeLessThanOrEqual(10);

const isVisible = await page.locator('.element').isVisible();
expect(isVisible).toBe(true);
```

#### Negation

```typescript
await expect(page.locator('.element')).not.toBeVisible();
await expect(page.locator('button')).not.toBeDisabled();
await expect(page).not.toHaveURL(/logout/);
```

---

### 8.2 Soft vs Hard Assertions

#### Hard Assertions (Default)

```typescript
test('hard assertions', async ({ page }) => {
  await page.goto('/');
  
  await expect(page).toHaveTitle('Home'); // Stops here if fails
  await expect(page.locator('h1')).toBeVisible(); // Won't run if above fails
});
```

#### Soft Assertions

```typescript
test('soft assertions', async ({ page }) => {
  await page.goto('/');
  
  // Continue even if these fail
  await expect.soft(page).toHaveTitle('Home');
  await expect.soft(page.locator('h1')).toBeVisible();
  await expect.soft(page.locator('.nav')).toBeVisible();
  
  // Test continues and reports all failures at the end
});
```

#### When to Use Soft Assertions

✅ **Use Soft Assertions:**
- Visual regression checks
- Multiple validations on same page
- Generating comprehensive reports

❌ **Use Hard Assertions:**
- Setup validation (login, navigation)
- Critical state checks
- When subsequent steps depend on assertion

---

### 8.3 Custom Matchers & Reusable Assertions

```typescript
// Custom matcher
expect.extend({
  async toHaveValidEmail(locator: Locator) {
    const value = await locator.inputValue();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = emailRegex.test(value);
    
    return {
      message: () => `expected ${value} to be valid email`,
      pass,
    };
  },
});

// Usage
await expect(page.locator('#email')).toHaveValidEmail();
```

#### Reusable Assertion Functions

```typescript
// helpers/assertions.ts
export async function expectSuccessMessage(page: Page, message: string) {
  const successBanner = page.locator('.success-banner');
  await expect(successBanner).toBeVisible();
  await expect(successBanner).toContainText(message);
  await expect(successBanner).toHaveClass(/success/);
}

export async function expectErrorMessage(page: Page, message: string) {
  const errorBanner = page.locator('.error-banner');
  await expect(errorBanner).toBeVisible();
  await expect(errorBanner).toContainText(message);
}

// Usage in tests
import { expectSuccessMessage } from './helpers/assertions';

test('successful form submission', async ({ page }) => {
  await page.fill('#name', 'John');
  await page.click('#submit');
  await expectSuccessMessage(page, 'Form submitted successfully');
});
```

---

### 8.4 Golden Snapshots vs Semantic Assertions

#### Visual Snapshots

```typescript
test('visual snapshot', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png');
});

// Element snapshot
test('element snapshot', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.header')).toHaveScreenshot('header.png');
});

// With threshold
await expect(page).toHaveScreenshot('homepage.png', {
  maxDiffPixels: 100, // Allow 100 pixels difference
  threshold: 0.2,     // Allow 20% difference
});
```

#### Semantic Assertions (Preferred)

```typescript
// Instead of visual snapshot
test('semantic assertions', async ({ page }) => {
  await page.goto('/');
  
  // Assert structure and content
  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('nav')).toContainText('Home');
  await expect(page.locator('nav')).toContainText('About');
  await expect(page.locator('.logo')).toHaveAttribute('alt', 'Company Logo');
  await expect(page.locator('main')).toBeVisible();
  await expect(page.locator('footer')).toContainText('© 2025');
});
```

#### When to Use Each

| Scenario | Approach |
|----------|----------|
| **Critical UI layout** | Visual snapshot |
| **Content validation** | Semantic assertion |
| **Responsive design** | Visual snapshot per breakpoint |
| **Dynamic content** | Semantic assertion |
| **Exact pixel match needed** | Visual snapshot |
| **Functional behavior** | Semantic assertion |

---

## 9. UI Automation Deep Dive

### 9.0 Playwright Methods & APIs - Complete Reference

**Why This Section?** Understanding Playwright methods deeply is crucial for interviews and real-world automation. Each method has specific use cases, options, and best practices.

---

#### 9.0.1 Page Navigation Methods

| Method | Purpose | When to Use | Returns |
|--------|---------|-------------|---------|
| `page.goto(url)` | Navigate to URL | Initial page load, direct navigation | `Promise<Response \| null>` |
| `page.goBack()` | Navigate back in history | Testing browser back button | `Promise<Response \| null>` |
| `page.goForward()` | Navigate forward in history | Testing browser forward button | `Promise<Response \| null>` |
| `page.reload()` | Refresh current page | Testing page refresh behavior | `Promise<Response \| null>` |
| `page.waitForURL()` | Wait for URL to match pattern | After actions that redirect | `Promise<void>` |
| `page.waitForLoadState()` | Wait for specific load state | Ensure page fully loaded | `Promise<void>` |

**Detailed Examples:**

```typescript
// ========== page.goto() ==========
// Basic usage
await page.goto('https://example.com');

// With options
await page.goto('https://example.com', {
  waitUntil: 'networkidle',  // Wait until no network requests for 500ms
  // Options: 'load', 'domcontentloaded', 'networkidle', 'commit'
  timeout: 30000,  // 30 seconds
  referer: 'https://google.com',  // Set referer header
});

// When to use:
// - Initial page load
// - Direct URL navigation
// - Testing different entry points

// ========== page.goBack() / page.goForward() ==========
await page.goto('/page1');
await page.click('a[href="/page2"]');
await page.goBack();  // Back to page1
await expect(page).toHaveURL('/page1');

await page.goForward();  // Forward to page2
await expect(page).toHaveURL('/page2');

// When to use:
// - Testing browser navigation buttons
// - Multi-page workflows
// - Back button behavior validation

// ========== page.reload() ==========
await page.goto('/dashboard');
await page.reload();  // Refresh page

// With options
await page.reload({
  waitUntil: 'networkidle',
  timeout: 30000,
});

// When to use:
// - Testing data refresh
// - Validating state persistence
// - Testing cache behavior

// ========== page.waitForURL() ==========
await page.click('#submit-form');
await page.waitForURL('**/success');  // Wait for URL to contain 'success'

// Pattern matching
await page.waitForURL(/\/dashboard\/user\/\d+/);  // Regex
await page.waitForURL('https://example.com/profile');  // Exact match

// When to use:
// - After form submissions
// - After actions that redirect
// - Validating navigation occurred

// ========== page.waitForLoadState() ==========
await page.goto('/');
await page.waitForLoadState('domcontentloaded');  // DOM ready
await page.waitForLoadState('load');  // Window load event
await page.waitForLoadState('networkidle');  // No network requests

// When to use:
// - Ensure page fully loaded before interactions
// - Wait for lazy-loaded content
// - Performance testing scenarios
```

---

#### 9.0.2 Element Interaction Methods

| Method | Purpose | When to Use | Auto-Waits |
|--------|---------|-------------|------------|
| `page.click()` | Click element | Button clicks, links | ✅ Visible, enabled, stable |
| `page.dblclick()` | Double-click element | Text selection, special actions | ✅ Same as click |
| `page.fill()` | Fill input (clears first) | Form inputs, fast entry | ✅ Visible, enabled |
| `page.type()` | Type character by character | Testing keypress events | ✅ Visible, enabled |
| `page.press()` | Press single key | Keyboard shortcuts, special keys | ✅ Focused element |
| `page.check()` | Check checkbox/radio | Select options | ✅ Visible, enabled |
| `page.uncheck()` | Uncheck checkbox | Deselect options | ✅ Visible, enabled |
| `page.selectOption()` | Select dropdown option | Dropdown selection | ✅ Visible, enabled |
| `page.hover()` | Hover over element | Test hover effects | ✅ Visible |
| `page.focus()` | Focus element | Test focus behavior | ✅ None |
| `page.blur()` | Remove focus | Test blur events | ✅ None |
| `page.clear()` | Clear input value | Reset form fields | ✅ Visible, enabled |
| `page.setInputFiles()` | Upload files | File uploads | ✅ Visible |
| `page.drag()` | Drag element | Drag-and-drop operations | ✅ Visible |

**Detailed Examples:**

```typescript
// ========== page.click() ==========
// Basic click
await page.click('#submit-button');

// With options
await page.click('#button', {
  button: 'right',  // 'left' (default), 'right', 'middle'
  clickCount: 2,    // Double-click
  delay: 100,       // Delay between mousedown and mouseup
  position: { x: 10, y: 10 },  // Click at specific position
  modifiers: ['Shift'],  // ['Alt', 'Control', 'Meta', 'Shift']
  force: true,      // Skip actionability checks (use sparingly!)
  timeout: 5000,
});

// When to use:
// - Standard button/link clicks
// - Interactive elements
// - Navigation triggers

// ========== page.dblclick() ==========
await page.dblclick('.selectable-text');

// When to use:
// - Text selection
// - File/folder opening in file managers
// - Special UI interactions

// ========== page.fill() vs page.type() ==========
// fill() - FAST, clears existing value first
await page.fill('#username', 'john@example.com');
// Use when: Standard form filling, speed is important

// type() - SLOW, types character by character
await page.type('#search', 'playwright', { delay: 100 });
// Use when: Testing keypress events, autocomplete, live search

// ========== page.press() ==========
// Single key
await page.press('#input', 'Enter');
await page.press('#input', 'Escape');
await page.press('#input', 'ArrowDown');

// Keyboard shortcuts
await page.press('#editor', 'Control+A');  // Select all
await page.press('#editor', 'Control+C');  // Copy
await page.press('#editor', 'Control+V');  // Paste
await page.press('#editor', 'Meta+S');     // Save (Mac)

// When to use:
// - Testing keyboard shortcuts
// - Form submission with Enter
// - Dropdown navigation with arrows
// - Escape key behavior

// ========== page.check() / page.uncheck() ==========
// Check checkbox
await page.check('#terms-agree');
await expect(page.locator('#terms-agree')).toBeChecked();

// Uncheck
await page.uncheck('#newsletter');
await expect(page.locator('#newsletter')).not.toBeChecked();

// Radio button
await page.check('input[value="option1"]');

// When to use:
// - Form checkboxes
// - Settings toggles
// - Radio button selections

// ========== page.selectOption() ==========
// By value
await page.selectOption('#country', 'usa');

// By label
await page.selectOption('#country', { label: 'United States' });

// By index
await page.selectOption('#country', { index: 2 });

// Multiple selection
await page.selectOption('#languages', ['js', 'python', 'java']);

// When to use:
// - Dropdown menus
// - Multi-select lists
// - Country/region selectors

// ========== page.hover() ==========
await page.hover('.menu-item');
await page.click('.dropdown-option');  // Click revealed element

// When to use:
// - Testing hover effects
// - Revealing dropdown menus
// - Tooltip validation

// ========== page.focus() / page.blur() ==========
await page.focus('#email');
await expect(page.locator('#email')).toBeFocused();

await page.blur('#email');  // Trigger blur event

// When to use:
// - Testing focus indicators
// - Validating focus order (accessibility)
// - Testing blur event handlers

// ========== page.setInputFiles() ==========
// Single file
await page.setInputFiles('#avatar', 'profile.jpg');

// Multiple files
await page.setInputFiles('#documents', [
  'document1.pdf',
  'document2.pdf',
]);

// From buffer
await page.setInputFiles('#file', {
  name: 'test.txt',
  mimeType: 'text/plain',
  buffer: Buffer.from('file contents'),
});

// Remove files
await page.setInputFiles('#file', []);

// When to use:
// - Profile picture uploads
// - Document uploads
// - Drag-and-drop file zones
// - Testing file size/type validation
```

---

#### 9.0.3 Element Query & Retrieval Methods

| Method | Purpose | Returns | Use Case |
|--------|---------|---------|----------|
| `page.locator()` | Get locator (lazy) | `Locator` | RECOMMENDED - Most flexible |
| `page.$()` | Query single element | `ElementHandle \| null` | Legacy Puppeteer style |
| `page.$$()` | Query all elements | `ElementHandle[]` | Legacy Puppeteer style |
| `page.waitForSelector()` | Wait for element | `ElementHandle \| null` | Explicit waits |
| `locator.count()` | Count matching elements | `Promise<number>` | Verify element count |
| `locator.nth()` | Get nth element | `Locator` | Access specific index |
| `locator.first()` | Get first element | `Locator` | First match |
| `locator.last()` | Get last element | `Locator` | Last match |
| `locator.filter()` | Filter by text/locator | `Locator` | Narrow down results |

**Detailed Examples:**

```typescript
// ========== page.locator() - RECOMMENDED ==========
// Basic locator
const button = page.locator('#submit');
await button.click();

// Chaining
await page.locator('.card').locator('button').click();

// Why locator() is better:
// 1. Auto-retry - Re-queries DOM automatically
// 2. No stale element issues
// 3. Better error messages
// 4. Works with auto-waiting

// ========== page.$() - ElementHandle (avoid if possible) ==========
const element = await page.$('#button');
if (element) {
  await element.click();
}
// Problem: Can become stale, no auto-retry

// ========== locator.count() ==========
const items = page.locator('.list-item');
const count = await items.count();
console.log(`Found ${count} items`);

// When to use:
// - Verify number of elements
// - Dynamic list validation
// - Pagination testing

// ========== locator.nth() ==========
// Get 3rd item (0-indexed)
await page.locator('.item').nth(2).click();

// Iterate over elements
const itemsCount = await page.locator('.item').count();
for (let i = 0; i < itemsCount; i++) {
  const text = await page.locator('.item').nth(i).textContent();
  console.log(`Item ${i}: ${text}`);
}

// When to use:
// - Access specific position
// - Loop through elements
// - Table row/column access

// ========== locator.first() / locator.last() ==========
await page.locator('.notification').first().click();
await page.locator('.message').last().hover();

// When to use:
// - Click first available button
// - Get latest notification
// - Access boundary elements

// ========== locator.filter() ==========
// Filter by text
await page.locator('.card').filter({ hasText: 'Premium' }).click();

// Filter by another locator
await page.locator('.row')
  .filter({ has: page.locator('.status.active') })
  .click();

// When to use:
// - Find element by content
// - Complex selection criteria
// - Nested element filtering
```

---

#### 9.0.4 Element Property & State Methods

| Method | Purpose | Returns | When to Use |
|--------|---------|---------|-------------|
| `locator.textContent()` | Get text content | `Promise<string \| null>` | Extract text |
| `locator.innerText()` | Get visible text | `Promise<string>` | User-visible text only |
| `locator.innerHTML()` | Get HTML content | `Promise<string>` | HTML structure |
| `locator.getAttribute()` | Get attribute value | `Promise<string \| null>` | href, src, data-* |
| `locator.inputValue()` | Get input value | `Promise<string>` | Form input values |
| `locator.isChecked()` | Check if checked | `Promise<boolean>` | Checkbox state |
| `locator.isDisabled()` | Check if disabled | `Promise<boolean>` | Element state |
| `locator.isEditable()` | Check if editable | `Promise<boolean>` | Input editability |
| `locator.isEnabled()` | Check if enabled | `Promise<boolean>` | Element state |
| `locator.isVisible()` | Check if visible | `Promise<boolean>` | Visibility check |
| `locator.isHidden()` | Check if hidden | `Promise<boolean>` | Hidden check |
| `locator.boundingBox()` | Get position/size | `Promise<{x, y, width, height} \| null>` | Position validation |

**Detailed Examples:**

```typescript
// ========== textContent() vs innerText() vs innerHTML() ==========
const element = page.locator('.description');

// textContent - All text including hidden
const all = await element.textContent();  // "Hello\n  World  "

// innerText - Only visible text
const visible = await element.innerText();  // "Hello World"

// innerHTML - HTML structure
const html = await element.innerHTML();  // "<span>Hello</span> World"

// When to use:
// textContent: Data extraction, doesn't care about visibility
// innerText: User-facing text validation
// innerHTML: Verify HTML structure

// ========== getAttribute() ==========
// Get link href
const href = await page.locator('a.profile').getAttribute('href');
expect(href).toBe('/profile/123');

// Get image src
const src = await page.locator('img.avatar').getAttribute('src');
expect(src).toContain('avatar.jpg');

// Get data attribute
const userId = await page.locator('.user-card').getAttribute('data-user-id');

// When to use:
// - Verify links point to correct URLs
// - Validate image sources
// - Extract data attributes
// - Check custom attributes

// ========== inputValue() ==========
// Get current input value
await page.fill('#email', 'test@example.com');
const value = await page.locator('#email').inputValue();
expect(value).toBe('test@example.com');

// When to use:
// - Verify form pre-population
// - Validate default values
// - Check after auto-fill

// ========== isChecked() ==========
await page.check('#terms');
expect(await page.locator('#terms').isChecked()).toBe(true);

await page.uncheck('#newsletter');
expect(await page.locator('#newsletter').isChecked()).toBe(false);

// When to use:
// - Validate checkbox state
// - Verify form selections
// - Test toggle behavior

// ========== isDisabled() / isEnabled() ==========
expect(await page.locator('#submit').isDisabled()).toBe(true);
expect(await page.locator('#submit').isEnabled()).toBe(false);

// Fill required fields
await page.fill('#email', 'test@example.com');
expect(await page.locator('#submit').isEnabled()).toBe(true);

// When to use:
// - Test form validation disabling
// - Verify button states
// - Conditional interaction checks

// ========== isVisible() / isHidden() ==========
expect(await page.locator('.modal').isVisible()).toBe(false);

await page.click('.open-modal');
expect(await page.locator('.modal').isVisible()).toBe(true);
expect(await page.locator('.modal').isHidden()).toBe(false);

// When to use:
// - Verify element visibility
// - Test show/hide behavior
// - Modal display validation

// ========== boundingBox() ==========
const box = await page.locator('#button').boundingBox();
// { x: 100, y: 200, width: 80, height: 40 }

// Click at specific position
await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

// When to use:
// - Position-based interactions
// - Visual regression testing
// - Layout validation
```

---

#### 9.0.5 Wait & Synchronization Methods

| Method | Purpose | When to Use | Timeout |
|--------|---------|-------------|---------|
| `page.waitForSelector()` | Wait for element | Explicit element waiting | 30s default |
| `page.waitForTimeout()` | Wait fixed time | ❌ AVOID - Use as last resort | N/A |
| `page.waitForFunction()` | Wait for JS condition | Custom conditions | 30s default |
| `page.waitForResponse()` | Wait for network response | API call completion | 30s default |
| `page.waitForRequest()` | Wait for network request | Request interception | 30s default |
| `page.waitForEvent()` | Wait for page event | Dialog, download, popup | 30s default |
| `page.waitForLoadState()` | Wait for load state | Page load completion | 30s default |
| `locator.waitFor()` | Wait for locator state | Element state changes | 30s default |

**Detailed Examples:**

```typescript
// ========== page.waitForSelector() ==========
// Wait for element to appear
await page.waitForSelector('.loading-spinner', { state: 'hidden' });
await page.waitForSelector('.content', { state: 'visible' });

// States: 'attached', 'detached', 'visible', 'hidden'

// When to use:
// - Wait for loading spinner to disappear
// - Wait for dynamic content
// - Legacy code (locator auto-waits are better)

// ========== page.waitForTimeout() - AVOID! ==========
// ❌ BAD - Fixed wait
await page.waitForTimeout(5000);  // Wastes time

// ✅ GOOD - Wait for condition
await page.waitForSelector('.content');

// Only use when absolutely necessary (animations, known delays)

// ========== page.waitForFunction() ==========
// Wait for custom condition
await page.waitForFunction(() => {
  return document.querySelectorAll('.item').length > 5;
});

// Wait with argument
await page.waitForFunction(
  (minPrice) => {
    const prices = Array.from(document.querySelectorAll('.price'));
    return prices.some(p => parseFloat(p.textContent) < minPrice);
  },
  50  // Argument passed to function
);

// When to use:
// - Complex DOM conditions
// - JavaScript state changes
// - Custom visibility logic

// ========== page.waitForResponse() ==========
// Wait for API call
const responsePromise = page.waitForResponse('**/api/users');
await page.click('#load-users');
const response = await responsePromise;
expect(response.status()).toBe(200);

// With predicate function
const response = await page.waitForResponse(
  (response) => response.url().includes('/api/') && response.status() === 200
);

// When to use:
// - Verify API calls made
// - Wait for data loading
// - Network-dependent actions

// ========== page.waitForRequest() ==========
// Wait for specific request
const requestPromise = page.waitForRequest('**/api/analytics');
await page.click('#track-event');
const request = await requestPromise;
console.log(request.postData());

// When to use:
// - Verify analytics tracking
// - Validate request payload
// - Network monitoring

// ========== page.waitForEvent() ==========
// Wait for dialog
page.on('dialog', async (dialog) => {
  console.log(dialog.message());
  await dialog.accept();
});

const dialogPromise = page.waitForEvent('dialog');
await page.click('#show-alert');
const dialog = await dialogPromise;

// Wait for download
const downloadPromise = page.waitForEvent('download');
await page.click('#download-report');
const download = await downloadPromise;
await download.saveAs('report.pdf');

// Wait for popup
const popupPromise = page.waitForEvent('popup');
await page.click('a[target="_blank"]');
const popup = await popupPromise;

// When to use:
// - File downloads
// - New windows/tabs
// - Alerts/confirms/prompts
// - Console messages

// ========== locator.waitFor() ==========
const button = page.locator('#submit');

// Wait for visible
await button.waitFor({ state: 'visible' });

// Wait for hidden
await button.waitFor({ state: 'hidden' });

// Wait for attached to DOM
await button.waitFor({ state: 'attached' });

// When to use:
// - Explicit state waiting
// - Element appearance/disappearance
// - Dynamic UI elements
```

---

#### 9.0.6 Evaluation & Script Execution Methods

| Method | Purpose | When to Use | Context |
|--------|---------|-------------|---------|
| `page.evaluate()` | Execute JS in browser | Data extraction, DOM manipulation | Browser |
| `page.evaluateHandle()` | Return JS object handle | Get window/document objects | Browser |
| `locator.evaluate()` | Execute JS on element | Element-specific operations | Element |
| `locator.evaluateAll()` | Execute JS on all elements | Bulk operations | Elements |
| `page.addScriptTag()` | Inject script file | Add external libraries | Browser |
| `page.addStyleTag()` | Inject CSS | Add styles | Browser |

**Detailed Examples:**

```typescript
// ========== page.evaluate() ==========
// Execute JavaScript in browser context
const result = await page.evaluate(() => {
  return {
    userAgent: navigator.userAgent,
    cookies: document.cookie,
    title: document.title,
  };
});
console.log(result);

// With arguments
const sum = await page.evaluate((a, b) => a + b, 5, 10);  // 15

// Access localStorage
const token = await page.evaluate(() => localStorage.getItem('authToken'));

// Modify DOM
await page.evaluate(() => {
  document.querySelector('.ad').remove();
});

// When to use:
// - Extract data not accessible via API
// - Manipulate DOM directly
// - Access browser APIs (localStorage, navigator)
// - Performance measurements

// ========== page.evaluateHandle() ==========
// Get window object
const windowHandle = await page.evaluateHandle(() => window);
const innerWidth = await windowHandle.evaluate((w) => w.innerWidth);

// Get array of elements
const links = await page.evaluateHandle(() => 
  Array.from(document.querySelectorAll('a'))
);

// When to use:
// - Return complex objects
// - Get references to browser objects
// - Serialize large data sets

// ========== locator.evaluate() ==========
// Execute on single element
const text = await page.locator('.title').evaluate((el) => {
  return el.textContent.toUpperCase();
});

// Change element style
await page.locator('.box').evaluate((el) => {
  el.style.backgroundColor = 'red';
});

// When to use:
// - Element-specific operations
// - Style manipulation
// - Complex data extraction

// ========== locator.evaluateAll() ==========
// Execute on all matching elements
const prices = await page.locator('.price').evaluateAll((elements) => {
  return elements.map((el) => parseFloat(el.textContent));
});
console.log(prices);  // [19.99, 29.99, 39.99]

// Sum all prices
const total = await page.locator('.price').evaluateAll((elements) => {
  return elements.reduce((sum, el) => 
    sum + parseFloat(el.textContent), 0
  );
});

// When to use:
// - Bulk data extraction
// - Aggregate calculations
// - Multi-element operations

// ========== page.addScriptTag() ==========
// Inject external library
await page.addScriptTag({
  url: 'https://code.jquery.com/jquery-3.6.0.min.js',
});

// Now jQuery is available
const title = await page.evaluate(() => $('h1').text());

// Inject inline script
await page.addScriptTag({
  content: `
    window.customFunction = () => {
      return 'Hello from injected script';
    };
  `,
});

// When to use:
// - Add testing utilities
// - Inject libraries for complex operations
// - Add instrumentation code

// ========== page.addStyleTag() ==========
// Inject CSS
await page.addStyleTag({
  content: `
    .ad-banner { display: none !important; }
    .cookie-popup { display: none !important; }
  `,
});

// When to use:
// - Hide annoying elements
// - Add visual markers
// - Test responsive behavior
```

---

#### 9.0.7 Screenshot & Video Methods

| Method | Purpose | Options | Use Case |
|--------|---------|---------|----------|
| `page.screenshot()` | Capture page screenshot | Full page, element, clip | Visual validation |
| `locator.screenshot()` | Capture element screenshot | Element only | Component testing |
| `page.video()` | Access video recording | Video path | Test recording |

**Detailed Examples:**

```typescript
// ========== page.screenshot() ==========
// Full page screenshot
await page.screenshot({ path: 'screenshot.png' });

// Specific element
await page.locator('.hero').screenshot({ path: 'hero.png' });

// Full page (scrolls)
await page.screenshot({ path: 'full.png', fullPage: true });

// Clip region
await page.screenshot({
  path: 'clip.png',
  clip: { x: 0, y: 0, width: 800, height: 600 },
});

// Custom quality (JPEG only)
await page.screenshot({
  path: 'compressed.jpg',
  type: 'jpeg',
  quality: 80,  // 0-100
});

// Omit background
await page.screenshot({
  path: 'transparent.png',
  omitBackground: true,  // Transparent background
});

// Get buffer instead of saving
const buffer = await page.screenshot();
// Send to image comparison service

// When to use:
// - Visual regression testing
// - Bug reports
// - Documentation
// - CI artifacts

// ========== locator.screenshot() ==========
// Capture specific element
await page.locator('.chart').screenshot({ path: 'chart.png' });

// When to use:
// - Component-level visual testing
// - Element comparison
// - Focused screenshots

// ========== Video Recording ==========
// Configured in playwright.config.ts
use: {
  video: 'on',  // 'on', 'off', 'retain-on-failure', 'on-first-retry'
}

// Access video path
test('my test', async ({ page }, testInfo) => {
  await page.goto('/');
  // ... test actions
  
  const videoPath = await page.video().path();
  console.log(`Video saved: ${videoPath}`);
});

// When to use:
// - Debugging flaky tests
// - CI failure investigation
// - Test documentation
```

---

#### 9.0.8 Dialog & Event Handling Methods

| Method | Purpose | Events | Use Case |
|--------|---------|--------|----------|
| `page.on('dialog')` | Handle alerts/confirms | dialog | Alert handling |
| `page.on('console')` | Capture console logs | console | Debug logging |
| `page.on('download')` | Handle downloads | download | File downloads |
| `page.on('filechooser')` | Handle file selection | filechooser | File uploads |
| `page.on('popup')` | Handle new windows | popup | Multi-window |
| `page.on('request')` | Monitor requests | request | Network monitoring |
| `page.on('response')` | Monitor responses | response | API validation |

**Detailed Examples:**

```typescript
// ========== Dialog Handling ==========
// Accept alert
page.on('dialog', async (dialog) => {
  console.log(`Alert: ${dialog.message()}`);
  await dialog.accept();
});

// Dismiss confirm
page.on('dialog', async (dialog) => {
  if (dialog.type() === 'confirm') {
    await dialog.dismiss();
  }
});

// Prompt with input
page.on('dialog', async (dialog) => {
  if (dialog.type() === 'prompt') {
    await dialog.accept('My Input');
  }
});

// When to use:
// - Handle JavaScript alerts
// - Confirm dialogs
// - Prompt inputs

// ========== Console Logging ==========
page.on('console', (msg) => {
  console.log(`Browser console [${msg.type()}]:`, msg.text());
});

// Filter errors only
page.on('console', (msg) => {
  if (msg.type() === 'error') {
    console.error('Console error:', msg.text());
  }
});

// When to use:
// - Debug JavaScript errors
// - Monitor console warnings
// - Capture application logs

// ========== Download Handling ==========
const downloadPromise = page.waitForEvent('download');
await page.click('#download-button');
const download = await downloadPromise;

// Save file
await download.saveAs('downloads/file.pdf');

// Get file path
const path = await download.path();

// Cancel download
await download.cancel();

// When to use:
// - Verify file downloads
// - Download validation
// - File content verification

// ========== File Chooser ==========
page.on('filechooser', async (fileChooser) => {
  await fileChooser.setFiles('path/to/file.pdf');
});

await page.click('button:has-text("Upload")');

// When to use:
// - Intercept file selection dialogs
// - Automated file uploads

// ========== Network Monitoring ==========
// Log all requests
page.on('request', (request) => {
  console.log(`${request.method()} ${request.url()}`);
});

// Log all responses
page.on('response', (response) => {
  console.log(`${response.status()} ${response.url()}`);
});

// Filter API calls
page.on('response', async (response) => {
  if (response.url().includes('/api/')) {
    console.log('API response:', await response.json());
  }
});

// When to use:
// - Network debugging
// - API call verification
// - Performance monitoring
```

---

#### 9.0.9 Browser Context & Page Management Methods

| Method | Purpose | When to Use |
|--------|---------|-------------|
| `browser.newContext()` | Create isolated context | Multi-user testing |
| `context.newPage()` | Create new page | Multi-tab scenarios |
| `context.pages()` | Get all pages | Manage multiple tabs |
| `page.context()` | Get page's context | Access context from page |
| `context.cookies()` | Get/set cookies | Cookie management |
| `context.storageState()` | Save/load storage | Auth state persistence |
| `page.close()` | Close page | Cleanup |
| `context.close()` | Close context | Full cleanup |

**Detailed Examples:**

```typescript
// ========== Multi-Context Usage ==========
// User 1 context
const context1 = await browser.newContext();
const page1 = await context1.newPage();
await page1.goto('/login');
await page1.fill('#email', 'user1@example.com');

// User 2 context (isolated)
const context2 = await browser.newContext();
const page2 = await context2.newPage();
await page2.goto('/login');
await page2.fill('#email', 'user2@example.com');

// When to use:
// - Multi-user testing
// - Parallel isolated sessions
// - Different permission levels

// ========== Cookie Management ==========
// Get all cookies
const cookies = await context.cookies();

// Set cookies
await context.addCookies([
  {
    name: 'sessionId',
    value: 'abc123',
    domain: 'example.com',
    path: '/',
    expires: Date.now() / 1000 + 3600,
    httpOnly: true,
    secure: true,
  },
]);

// Clear cookies
await context.clearCookies();

// When to use:
// - Auth token injection
// - Session management
// - Cookie testing

// ========== Storage State ==========
// Save authenticated state
await context.storageState({ path: 'auth.json' });

// Load in new context
const newContext = await browser.newContext({
  storageState: 'auth.json',
});

// When to use:
// - Skip login in every test
// - Reuse authentication
// - Faster test execution
```

---

#### 9.0.10 Performance & Metrics Methods

| Method | Purpose | Metrics | Use Case |
|--------|---------|---------|----------|
| `page.evaluate()` + Performance API | Measure timings | Navigation, resource timing | Performance testing |
| `page.metrics()` | Get browser metrics | Memory, CPU, layout | Resource monitoring |

**Detailed Examples:**

```typescript
// ========== Performance Timing ==========
const metrics = await page.evaluate(() => {
  const perf = performance.getEntriesByType('navigation')[0];
  return {
    domContentLoaded: perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart,
    loadComplete: perf.loadEventEnd - perf.loadEventStart,
    firstPaint: performance.getEntriesByType('paint')[0]?.startTime,
    responseTime: perf.responseEnd - perf.requestStart,
  };
});

console.log(metrics);

// When to use:
// - Performance benchmarking
// - Load time validation
// - Regression detection
```

---

### 9.1 Navigation Flows, Redirects, Back/Forward Caching

#### Complex Navigation

```typescript
test('navigation flow', async ({ page }) => {
  await page.goto('/');
  await page.click('a[href="/products"]');
  await expect(page).toHaveURL('/products');
  
  await page.goBack();
  await expect(page).toHaveURL('/');
  
  await page.goForward();
  await expect(page).toHaveURL('/products');
  
  await page.reload();
  await expect(page).toHaveURL('/products');
});
```

#### Handling Redirects

```typescript
test('redirect handling', async ({ page }) => {
  // Follow redirects automatically
  await page.goto('/old-url');
  await expect(page).toHaveURL('/new-url');
  
  // Wait for specific redirect
  await page.goto('/login');
  await page.fill('#email', 'user@example.com');
  await page.fill('#password', 'password');
  await page.click('#submit');
  
  // Wait for redirect after login
  await page.waitForURL('**/dashboard');
  await expect(page).toHaveURL(/dashboard/);
});
```

---

### 9.2 Forms: Inputs, Selects, Date Pickers, File Upload

#### Form Input Types

```typescript
test('form inputs', async ({ page }) => {
  await page.goto('/form');
  
  // Text input
  await page.fill('#name', 'John Doe');
  
  // Email
  await page.fill('input[type="email"]', 'john@example.com');
  
  // Number
  await page.fill('input[type="number"]', '25');
  
  // Textarea
  await page.fill('textarea', 'Long text...');
  
  // Checkbox
  await page.check('#agree');
  await page.uncheck('#newsletter');
  
  // Radio button
  await page.check('input[value="option1"]');
  
  // Select dropdown
  await page.selectOption('select#country', 'USA');
  await page.selectOption('select#country', { label: 'United States' });
  await page.selectOption('select#country', { value: 'us' });
  await page.selectOption('select#country', { index: 2 });
  
  // Multiple select
  await page.selectOption('select#languages', ['js', 'python', 'java']);
});
```

#### Date Pickers

```typescript
test('date picker', async ({ page }) => {
  await page.goto('/booking');
  
  // Native HTML5 date input
  await page.fill('input[type="date"]', '2025-12-31');
  
  // Custom date picker
  await page.click('.date-picker');
  await page.click('.calendar-day[data-date="2025-12-31"]');
  
  // Or type directly if allowed
  await page.fill('.date-input', '12/31/2025');
});
```

#### File Upload

```typescript
test('file upload', async ({ page }) => {
  await page.goto('/upload');
  
  // Single file
  await page.setInputFiles('#file', 'path/to/file.pdf');
  
  // Multiple files
  await page.setInputFiles('#files', [
    'file1.pdf',
    'file2.pdf',
    'file3.pdf'
  ]);
  
  // Upload from buffer
  await page.setInputFiles('#file', {
    name: 'test.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('file content'),
  });
  
  // Remove file
  await page.setInputFiles('#file', []);
});
```

---

### 9.3 Tables, Grids, Infinite Scroll, Virtualization

#### Table Interaction

```typescript
test('table operations', async ({ page }) => {
  await page.goto('/users');
  
  // Get all rows
  const rows = page.locator('table tbody tr');
  const count = await rows.count();
  
  // Get specific cell
  const cell = page.locator('table tbody tr:nth-child(2) td:nth-child(3)');
  await expect(cell).toHaveText('John Doe');
  
  // Find row by content
  const row = rows.filter({ hasText: 'john@example.com' });
  await row.locator('button.edit').click();
  
  // Get all emails from table
  const emails = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
  console.log(emails);
});
```

---

### 9.4 Downloads & Uploads; Handling Native Dialogs

Covered earlier in Section 4.3.

---

### 9.5 Network Interception: Mock, Stub, Throttle

```typescript
test('mock API response', async ({ page }) => {
  // Mock API call
  await page.route('**/api/users', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'Mock User 1' },
        { id: 2, name: 'Mock User 2' },
      ]),
    });
  });
  
  await page.goto('/users');
  await expect(page.locator('.user-name')).toContainText('Mock User 1');
});

// Throttle network
test('slow network', async ({ page, context }) => {
  await context.route('**/*', route => {
    setTimeout(() => route.continue(), 2000); // 2s delay
  });
  
  await page.goto('/');
});
```

---

## 10. API Testing with Playwright

### 10.0 API Testing Methods & Request Context - Complete Reference

**Why API Testing in Playwright?** Playwright's built-in API testing capabilities eliminate the need for separate tools like RestAssured or Postman. You can combine UI and API tests seamlessly, share authentication, and maintain one framework for complete E2E coverage.

**Interview Relevance:** Interviewers often ask about API automation strategies, authentication handling, request/response validation, and how to combine UI and API testing. This section provides production-ready patterns.

---

#### 10.0.1 Request Context Methods Overview

| Method | Purpose | HTTP Verb | When to Use |
|--------|---------|-----------|-------------|
| `request.get()` | Retrieve data | GET | Fetch resources, search, list |
| `request.post()` | Create resource | POST | Create users, submit forms |
| `request.put()` | Update entire resource | PUT | Full resource update |
| `request.patch()` | Partial update | PATCH | Update specific fields |
| `request.delete()` | Delete resource | DELETE | Remove data, cleanup |
| `request.head()` | Get headers only | HEAD | Check resource existence |
| `request.fetch()` | Custom request | ANY | Full control over request |

---

#### 10.0.2 GET Request - Data Retrieval

**Purpose:** Retrieve data from API without modifying server state (idempotent, safe operation).

**Complete Example:**

```typescript
import { test, expect } from '@playwright/test';

test('GET request - complete guide', async ({ request }) => {
  // ========== Basic GET ==========
  const response = await request.get('https://api.example.com/users');
  
  // Status validation
  expect(response.ok()).toBeTruthy();  // 200-299 range
  expect(response.status()).toBe(200);
  
  // ========== GET with Query Parameters ==========
  const searchResponse = await request.get('https://api.example.com/users', {
    params: {
      page: 1,
      limit: 10,
      status: 'active',
      sort: 'name',
    },
  });
  // URL becomes: /users?page=1&limit=10&status=active&sort=name
  
  // ========== GET with Headers ==========
  const authResponse = await request.get('https://api.example.com/profile', {
    headers: {
      'Authorization': 'Bearer eyJhbGc...',
      'Accept': 'application/json',
      'X-API-Key': 'your-api-key',
      'User-Agent': 'Playwright/1.0',
    },
  });
  
  // ========== Response Handling ==========
  const users = await response.json();  // Parse JSON
  const text = await response.text();   // Get as text
  const buffer = await response.body(); // Get as buffer
  
  // ========== Response Headers ==========
  const headers = response.headers();
  expect(headers['content-type']).toContain('application/json');
  expect(headers['x-rate-limit-remaining']).toBeTruthy();
  
  // ========== Assertions ==========
  expect(users).toBeInstanceOf(Array);
  expect(users.length).toBeGreaterThan(0);
  expect(users[0]).toHaveProperty('id');
  expect(users[0]).toHaveProperty('email');
  
  // Validate specific user
  const john = users.find(u => u.name === 'John Doe');
  expect(john).toBeDefined();
  expect(john.email).toBe('john@example.com');
  
  // ========== Timeout Configuration ==========
  const slowResponse = await request.get('https://slow-api.com/data', {
    timeout: 60000,  // 60 seconds
  });
  
  // ========== Error Handling ==========
  const notFoundResponse = await request.get('https://api.example.com/users/99999');
  expect(notFoundResponse.status()).toBe(404);
  
  // ========== Pagination Pattern ==========
  let allUsers = [];
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const paginatedResponse = await request.get('https://api.example.com/users', {
      params: { page, limit: 100 },
    });
    const data = await paginatedResponse.json();
    allUsers.push(...data.users);
    hasMore = data.hasMore;
    page++;
  }
  
  console.log(`Fetched ${allUsers.length} total users`);
});

// ========== When to Use GET ==========
// ✅ Fetching user profiles
// ✅ Retrieving product catalogs
// ✅ Search queries
// ✅ Listing resources
// ✅ Health checks
// ✅ Setup verification before UI tests
// ❌ Creating/updating data (use POST/PUT/PATCH)
```

---

#### 10.0.3 POST Request - Resource Creation

**Purpose:** Create new resources on the server. Not idempotent (multiple calls create multiple resources).

**Complete Example:**

```typescript
test('POST request - complete guide', async ({ request }) => {
  // ========== Basic POST with JSON ==========
  const response = await request.post('https://api.example.com/users', {
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      active: true,
    },
  });
  
  expect(response.status()).toBe(201);  // Created
  const createdUser = await response.json();
  expect(createdUser.id).toBeDefined();
  expect(createdUser.name).toBe('John Doe');
  
  // ========== POST with Headers ==========
  const authResponse = await request.post('https://api.example.com/orders', {
    headers: {
      'Authorization': 'Bearer token',
      'Content-Type': 'application/json',
      'X-Request-ID': crypto.randomUUID(),
    },
    data: {
      productId: 123,
      quantity: 2,
    },
  });
  
  // ========== POST Form Data (application/x-www-form-urlencoded) ==========
  const formResponse = await request.post('https://api.example.com/login', {
    form: {
      username: 'john@example.com',
      password: 'secret123',
      remember: 'true',
    },
  });
  
  // ========== POST Multipart Form Data (file upload) ==========
  const uploadResponse = await request.post('https://api.example.com/upload', {
    multipart: {
      file: {
        name: 'document.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('PDF content'),
      },
      description: 'Important document',
      category: 'invoices',
    },
  });
  
  // ========== POST with Nested Objects ==========
  const complexResponse = await request.post('https://api.example.com/orders', {
    data: {
      customer: {
        name: 'John Doe',
        email: 'john@example.com',
        address: {
          street: '123 Main St',
          city: 'New York',
          zipCode: '10001',
        },
      },
      items: [
        { productId: 1, quantity: 2, price: 19.99 },
        { productId: 2, quantity: 1, price: 29.99 },
      ],
      total: 69.97,
      currency: 'USD',
    },
  });
  
  // ========== Validate Response Location Header ==========
  const newResource = await request.post('https://api.example.com/users', {
    data: { name: 'Jane' },
  });
  const location = newResource.headers()['location'];
  expect(location).toContain('/users/');
  
  // Fetch created resource
  const verifyResponse = await request.get(location);
  expect(verifyResponse.ok()).toBeTruthy();
  
  // ========== Error Validation ==========
  const invalidResponse = await request.post('https://api.example.com/users', {
    data: { name: '' },  // Invalid: empty name
  });
  expect(invalidResponse.status()).toBe(400);  // Bad Request
  const error = await invalidResponse.json();
  expect(error.errors).toContainEqual(
    expect.objectContaining({ field: 'name', message: expect.any(String) })
  );
  
  // ========== Idempotency Key Pattern ==========
  const idempotencyKey = crypto.randomUUID();
  const payment1 = await request.post('https://api.example.com/payments', {
    headers: { 'Idempotency-Key': idempotencyKey },
    data: { amount: 100, currency: 'USD' },
  });
  
  // Retry with same key (should return same response)
  const payment2 = await request.post('https://api.example.com/payments', {
    headers: { 'Idempotency-Key': idempotencyKey },
    data: { amount: 100, currency: 'USD' },
  });
  
  const result1 = await payment1.json();
  const result2 = await payment2.json();
  expect(result1.id).toBe(result2.id);  // Same payment
});

// ========== When to Use POST ==========
// ✅ Creating new users/accounts
// ✅ Submitting forms
// ✅ Placing orders
// ✅ Uploading files
// ✅ Starting processes
// ✅ Authentication (login)
// ❌ Updating existing resources (use PUT/PATCH)
// ❌ Retrieving data (use GET)
```

---

#### 10.0.4 PUT Request - Full Resource Update

**Purpose:** Replace entire resource with new data. Idempotent (same result if called multiple times).

**Complete Example:**

```typescript
test('PUT request - complete guide', async ({ request }) => {
  // ========== Create resource first ==========
  const createResponse = await request.post('https://api.example.com/users', {
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      bio: 'Software Engineer',
    },
  });
  const user = await createResponse.json();
  
  // ========== PUT - Replace entire resource ==========
  const updateResponse = await request.put(`https://api.example.com/users/${user.id}`, {
    data: {
      name: 'John Smith',        // Changed
      email: 'john@example.com', // Same
      age: 31,                   // Changed
      bio: 'Senior Engineer',    // Changed
      // All fields must be provided
    },
  });
  
  expect(updateResponse.status()).toBe(200);  // or 204 No Content
  const updatedUser = await updateResponse.json();
  expect(updatedUser.name).toBe('John Smith');
  expect(updatedUser.age).toBe(31);
  
  // ========== PUT vs PATCH Difference ==========
  // PUT: Must send ALL fields (replaces entire resource)
  await request.put(`https://api.example.com/users/${user.id}`, {
    data: {
      name: 'John Smith',
      // If you omit 'email', 'age', 'bio', they might be set to null/default
    },
  });
  
  // PATCH: Send only changed fields (partial update)
  await request.patch(`https://api.example.com/users/${user.id}`, {
    data: {
      name: 'John Smith',  // Only updating name
    },
  });
  
  // ========== Idempotent Behavior ==========
  const putData = { name: 'Test', email: 'test@example.com', age: 25 };
  
  // First PUT
  const put1 = await request.put(`https://api.example.com/users/${user.id}`, {
    data: putData,
  });
  
  // Second PUT with same data (idempotent)
  const put2 = await request.put(`https://api.example.com/users/${user.id}`, {
    data: putData,
  });
  
  // Both should have same result
  expect(put1.status()).toBe(put2.status());
  
  // ========== Conditional Update with ETag ==========
  const getResponse = await request.get(`https://api.example.com/users/${user.id}`);
  const etag = getResponse.headers()['etag'];
  
  const conditionalUpdate = await request.put(`https://api.example.com/users/${user.id}`, {
    headers: {
      'If-Match': etag,  // Only update if resource hasn't changed
    },
    data: {
      name: 'Updated Name',
      email: 'john@example.com',
      age: 32,
    },
  });
  
  // If resource was modified by someone else:
  // expect(conditionalUpdate.status()).toBe(412); // Precondition Failed
});

// ========== When to Use PUT ==========
// ✅ Updating user profile (all fields)
// ✅ Replacing configuration settings
// ✅ Updating document content
// ✅ When you have complete resource data
// ❌ Partial updates (use PATCH)
// ❌ Creating resources (use POST, though PUT can be used for upsert)
```

---

#### 10.0.5 PATCH Request - Partial Update

**Purpose:** Update specific fields without sending entire resource. More efficient than PUT.

**Complete Example:**

```typescript
test('PATCH request - complete guide', async ({ request }) => {
  // Setup: Create user
  const createResponse = await request.post('https://api.example.com/users', {
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      bio: 'Software Engineer',
      status: 'active',
    },
  });
  const user = await createResponse.json();
  
  // ========== PATCH - Update single field ==========
  const updateNameResponse = await request.patch(`https://api.example.com/users/${user.id}`, {
    data: {
      name: 'John Smith',  // Only updating name
    },
  });
  
  expect(updateNameResponse.status()).toBe(200);
  const updated = await updateNameResponse.json();
  expect(updated.name).toBe('John Smith');
  expect(updated.email).toBe('john@example.com');  // Unchanged
  expect(updated.age).toBe(30);  // Unchanged
  
  // ========== PATCH - Update multiple fields ==========
  const updateMultiple = await request.patch(`https://api.example.com/users/${user.id}`, {
    data: {
      age: 31,
      bio: 'Senior Engineer',
      // email and status remain unchanged
    },
  });
  
  // ========== PATCH - Nested field update ==========
  const updateAddress = await request.patch(`https://api.example.com/users/${user.id}`, {
    data: {
      address: {
        city: 'New York',  // Only update city
      },
    },
  });
  
  // ========== PATCH - Array operations ==========
  // Add item to array
  const addTag = await request.patch(`https://api.example.com/users/${user.id}`, {
    data: {
      tags: { $push: 'javascript' },  // MongoDB-style operation
    },
  });
  
  // Remove item from array
  const removeTag = await request.patch(`https://api.example.com/users/${user.id}`, {
    data: {
      tags: { $pull: 'javascript' },
    },
  });
  
  // ========== PATCH - Increment/Decrement ==========
  const incrementAge = await request.patch(`https://api.example.com/users/${user.id}`, {
    data: {
      age: { $inc: 1 },  // Increment by 1
    },
  });
  
  // ========== PATCH - Null/Unset field ==========
  const clearBio = await request.patch(`https://api.example.com/users/${user.id}`, {
    data: {
      bio: null,  // Clear bio field
    },
  });
  
  // ========== JSON Patch Format (RFC 6902) ==========
  const jsonPatchResponse = await request.patch(`https://api.example.com/users/${user.id}`, {
    headers: {
      'Content-Type': 'application/json-patch+json',
    },
    data: [
      { op: 'replace', path: '/name', value: 'Jane Doe' },
      { op: 'add', path: '/nickname', value: 'JD' },
      { op: 'remove', path: '/bio' },
      { op: 'test', path: '/age', value: 30 },  // Validate before applying
    ],
  });
});

// ========== When to Use PATCH ==========
// ✅ Update single field (email, password, status)
// ✅ Toggle boolean flags
// ✅ Increment counters (view count, likes)
// ✅ Add/remove tags
// ✅ Partial profile updates
// ✅ More efficient than PUT (less data transfer)
// ❌ Full resource replacement (use PUT)
```

---

#### 10.0.6 DELETE Request - Resource Deletion

**Purpose:** Remove resources from the server. Idempotent (deleting same resource multiple times has same effect).

**Complete Example:**

```typescript
test('DELETE request - complete guide', async ({ request }) => {
  // Setup: Create user
  const createResponse = await request.post('https://api.example.com/users', {
    data: { name: 'Temp User', email: 'temp@example.com' },
  });
  const user = await createResponse.json();
  
  // ========== Basic DELETE ==========
  const deleteResponse = await request.delete(`https://api.example.com/users/${user.id}`);
  
  expect(deleteResponse.status()).toBe(204);  // No Content (common)
  // or expect(deleteResponse.status()).toBe(200); // OK with response body
  
  // ========== Verify deletion ==========
  const verifyResponse = await request.get(`https://api.example.com/users/${user.id}`);
  expect(verifyResponse.status()).toBe(404);  // Not Found
  
  // ========== DELETE with confirmation ==========
  const deleteWithConfirm = await request.delete(`https://api.example.com/users/${user.id}`, {
    params: {
      confirm: 'true',  // Some APIs require confirmation
    },
  });
  
  // ========== Soft DELETE (mark as deleted) ==========
  const softDelete = await request.patch(`https://api.example.com/users/${user.id}`, {
    data: {
      deleted: true,
      deletedAt: new Date().toISOString(),
    },
  });
  
  // ========== DELETE with Authorization ==========
  const authDeleteResponse = await request.delete(`https://api.example.com/users/${user.id}`, {
    headers: {
      'Authorization': 'Bearer token',
      'X-Confirm-Delete': 'yes',
    },
  });
  
  // ========== Bulk DELETE ==========
  const bulkDeleteResponse = await request.post('https://api.example.com/users/bulk-delete', {
    data: {
      ids: [1, 2, 3, 4, 5],
    },
  });
  
  // or with query string
  const bulkDelete2 = await request.delete('https://api.example.com/users', {
    params: {
      ids: '1,2,3,4,5',
    },
  });
  
  // ========== Idempotent DELETE ==========
  await request.delete(`https://api.example.com/users/${user.id}`);  // First delete
  const secondDelete = await request.delete(`https://api.example.com/users/${user.id}`);  // Second delete
  
  // Should return 404 (already deleted) or 204 (idempotent)
  expect([204, 404]).toContain(secondDelete.status());
  
  // ========== CASCADE DELETE ==========
  const deleteUser = await request.delete(`https://api.example.com/users/${user.id}`, {
    params: {
      cascade: 'true',  // Delete related data (orders, comments, etc.)
    },
  });
  
  // ========== Protected DELETE (prevent accidental deletion) ==========
  const protectedDelete = await request.delete('https://api.example.com/users/admin', {
    headers: {
      'X-Dangerous-Operation': 'confirmed',
    },
  });
  expect(protectedDelete.status()).toBe(403);  // Forbidden
});

// ========== When to Use DELETE ==========
// ✅ Remove user accounts
// ✅ Delete posts/comments
// ✅ Clear shopping cart
// ✅ Remove uploaded files
// ✅ Test cleanup (afterEach hooks)
// ❌ Archiving data (use PATCH to set archived=true)
// ❌ Deactivating accounts (use PATCH to set active=false)
```

---

#### 10.0.7 HEAD Request - Metadata Check

**Purpose:** Get response headers without body. Useful for checking resource existence or metadata.

**Complete Example:**

```typescript
test('HEAD request - complete guide', async ({ request }) => {
  // ========== Check resource existence ==========
  const headResponse = await request.head('https://api.example.com/users/123');
  
  if (headResponse.ok()) {
    console.log('Resource exists');
  } else if (headResponse.status() === 404) {
    console.log('Resource not found');
  }
  
  // ========== Check file size before download ==========
  const fileHead = await request.head('https://api.example.com/files/large-file.zip');
  const contentLength = fileHead.headers()['content-length'];
  console.log(`File size: ${contentLength} bytes`);
  
  if (parseInt(contentLength) > 100 * 1024 * 1024) {  // 100MB
    console.log('File too large, skipping download');
  } else {
    // Proceed with GET request
    const download = await request.get('https://api.example.com/files/large-file.zip');
  }
  
  // ========== Check Last-Modified ==========
  const lastModifiedResponse = await request.head('https://api.example.com/data.json');
  const lastModified = lastModifiedResponse.headers()['last-modified'];
  const etag = lastModifiedResponse.headers()['etag'];
  
  // ========== Cache validation ==========
  const cachedHead = await request.head('https://api.example.com/data.json', {
    headers: {
      'If-Modified-Since': lastModified,
      'If-None-Match': etag,
    },
  });
  
  if (cachedHead.status() === 304) {
    console.log('Use cached version');
  }
});

// ========== When to Use HEAD ==========
// ✅ Check if resource exists (faster than GET)
// ✅ Get file size before downloading
// ✅ Check last modified date
// ✅ Validate cache
// ✅ Health checks
// ❌ When you need response body (use GET)
```

---

#### 10.0.8 Custom Request with fetch()

**Purpose:** Full control over HTTP request for advanced scenarios.

**Complete Example:**

```typescript
test('fetch() - complete guide', async ({ request }) => {
  // ========== Custom HTTP method ==========
  const optionsResponse = await request.fetch('https://api.example.com/users', {
    method: 'OPTIONS',
  });
  const allowedMethods = optionsResponse.headers()['allow'];
  expect(allowedMethods).toContain('GET, POST, PUT, DELETE');
  
  // ========== Custom body serialization ==========
  const xmlResponse = await request.fetch('https://api.example.com/soap', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/xml',
    },
    body: `
      <?xml version="1.0"?>
      <soap:Envelope>
        <soap:Body>
          <GetUser>
            <UserId>123</UserId>
          </GetUser>
        </soap:Body>
      </soap:Envelope>
    `,
  });
  
  // ========== Binary data ==========
  const binaryResponse = await request.fetch('https://api.example.com/upload', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    body: Buffer.from([0x00, 0x01, 0x02, 0x03]),
  });
  
  // ========== Custom redirect handling ==========
  const noRedirectResponse = await request.fetch('https://api.example.com/redirect', {
    method: 'GET',
    maxRedirects: 0,  // Don't follow redirects
  });
  expect(noRedirectResponse.status()).toBe(302);
  const location = noRedirectResponse.headers()['location'];
});

// ========== When to Use fetch() ==========
// ✅ Custom HTTP methods (OPTIONS, TRACE)
// ✅ Non-JSON content types (XML, binary)
// ✅ Advanced redirect handling
// ✅ When other methods don't provide enough control
// ❌ Standard REST operations (use get/post/put/patch/delete)
```

---

#### 10.0.9 Authentication Patterns

**Complete Authentication Examples:**

```typescript
// ========== 1. Bearer Token Authentication ==========
test('Bearer token auth', async ({ request }) => {
  const response = await request.get('https://api.example.com/profile', {
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIs...',
    },
  });
  expect(response.ok()).toBeTruthy();
});

// ========== 2. Basic Authentication ==========
test('Basic auth', async ({ request }) => {
  const username = 'admin';
  const password = 'secret123';
  const credentials = Buffer.from(`${username}:${password}`).toString('base64');
  
  const response = await request.get('https://api.example.com/admin', {
    headers: {
      'Authorization': `Basic ${credentials}`,
    },
  });
});

// ========== 3. API Key Authentication ==========
test('API key auth', async ({ request }) => {
  const response = await request.get('https://api.example.com/data', {
    headers: {
      'X-API-Key': 'your-api-key-here',
    },
  });
  
  // or as query parameter
  const response2 = await request.get('https://api.example.com/data', {
    params: {
      api_key: 'your-api-key-here',
    },
  });
});

// ========== 4. OAuth 2.0 Flow ==========
test('OAuth 2.0', async ({ request }) => {
  // Step 1: Get access token
  const tokenResponse = await request.post('https://auth.example.com/oauth/token', {
    form: {
      grant_type: 'client_credentials',
      client_id: 'your-client-id',
      client_secret: 'your-client-secret',
      scope: 'read write',
    },
  });
  
  const { access_token, token_type } = await tokenResponse.json();
  
  // Step 2: Use access token
  const apiResponse = await request.get('https://api.example.com/data', {
    headers: {
      'Authorization': `${token_type} ${access_token}`,
    },
  });
});

// ========== 5. JWT Token with Refresh ==========
test('JWT with refresh', async ({ request }) => {
  // Login
  const loginResponse = await request.post('https://api.example.com/auth/login', {
    data: {
      email: 'user@example.com',
      password: 'password123',
    },
  });
  
  const { accessToken, refreshToken } = await loginResponse.json();
  
  // Use access token
  let response = await request.get('https://api.example.com/profile', {
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });
  
  // If expired (401), refresh
  if (response.status() === 401) {
    const refreshResponse = await request.post('https://api.example.com/auth/refresh', {
      headers: { 'Authorization': `Bearer ${refreshToken}` },
    });
    
    const { accessToken: newToken } = await refreshResponse.json();
    
    // Retry with new token
    response = await request.get('https://api.example.com/profile', {
      headers: { 'Authorization': `Bearer ${newToken}` },
    });
  }
});

// ========== 6. Session Cookie Authentication ==========
test('Session cookie auth', async ({ request }) => {
  // Login to get session cookie
  const loginResponse = await request.post('https://api.example.com/login', {
    form: {
      username: 'user@example.com',
      password: 'password123',
    },
  });
  
  // Cookies are automatically stored in request context
  
  // Subsequent requests use stored cookies
  const profileResponse = await request.get('https://api.example.com/profile');
  expect(profileResponse.ok()).toBeTruthy();
});

// ========== 7. Custom Header Authentication ==========
test('Custom header auth', async ({ request }) => {
  const response = await request.get('https://api.example.com/data', {
    headers: {
      'X-Auth-Token': 'custom-token',
      'X-Tenant-ID': '12345',
      'X-User-ID': 'user-abc',
    },
  });
});
```

---

### 10.1 request Fixture, REST & GraphQL Flows

```typescript
import { test, expect } from '@playwright/test';

test('API test', async ({ request }) => {
  // GET request
  const response = await request.get('https://api.example.com/users');
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
  
  const users = await response.json();
  expect(users).toHaveLength(10);
  
  // POST request
  const createResponse = await request.post('https://api.example.com/users', {
    data: {
      name: 'New User',
      email: 'newuser@example.com',
    },
  });
  expect(createResponse.ok()).toBeTruthy();
  
  const newUser = await createResponse.json();
  expect(newUser.name).toBe('New User');
  
  // PUT request
  await request.put(`https://api.example.com/users/${newUser.id}`, {
    data: { name: 'Updated User' },
  });
  
  // DELETE request
  await request.delete(`https://api.example.com/users/${newUser.id}`);
});
```

---

### 10.1.1 Response Validation & Assertions Deep Dive

**Why Comprehensive Response Validation?** API tests must verify not just status codes, but also response structure, data types, business logic, headers, and error handling. This ensures API contracts are maintained.

**Complete Response Validation Patterns:**

```typescript
test('Complete response validation', async ({ request }) => {
  const response = await request.get('https://api.example.com/users/123');
  
  // ========== Status Code Validation ==========
  expect(response.status()).toBe(200);
  expect(response.ok()).toBeTruthy();  // 200-299
  expect(response.status()).toBeGreaterThanOrEqual(200);
  expect(response.status()).toBeLessThan(300);
  
  // Status code categories
  const isSuccess = response.ok();  // 2xx
  const isRedirect = response.status() >= 300 && response.status() < 400;
  const isClientError = response.status() >= 400 && response.status() < 500;
  const isServerError = response.status() >= 500;
  
  // ========== Headers Validation ==========
  const headers = response.headers();
  
  // Content type
  expect(headers['content-type']).toContain('application/json');
  expect(headers['content-type']).toMatch(/application\/json/);
  
  // Custom headers
  expect(headers['x-api-version']).toBe('v1');
  expect(headers['x-request-id']).toBeTruthy();
  expect(headers['x-rate-limit-remaining']).toBeDefined();
  
  // CORS headers
  expect(headers['access-control-allow-origin']).toBe('*');
  expect(headers['access-control-allow-methods']).toContain('GET, POST, PUT');
  
  // Caching headers
  expect(headers['cache-control']).toBe('no-cache');
  expect(headers['etag']).toBeTruthy();
  
  // Security headers
  expect(headers['strict-transport-security']).toBeTruthy();
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['x-frame-options']).toBe('DENY');
  
  // ========== Response Body Validation ==========
  const user = await response.json();
  
  // Existence checks
  expect(user).toBeDefined();
  expect(user).not.toBeNull();
  expect(user).toBeTruthy();
  
  // Object structure
  expect(user).toHaveProperty('id');
  expect(user).toHaveProperty('name');
  expect(user).toHaveProperty('email');
  expect(user).toHaveProperty('createdAt');
  
  // Type validation
  expect(typeof user.id).toBe('number');
  expect(typeof user.name).toBe('string');
  expect(typeof user.email).toBe('string');
  expect(typeof user.active).toBe('boolean');
  expect(Array.isArray(user.roles)).toBe(true);
  
  // Value validation
  expect(user.id).toBe(123);
  expect(user.name).toBe('John Doe');
  expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);  // Email regex
  expect(user.age).toBeGreaterThan(0);
  expect(user.age).toBeLessThanOrEqual(150);
  expect(user.status).toMatch(/^(active|inactive|pending)$/);
  
  // String validations
  expect(user.name).toHaveLength(8);  // Exact length
  expect(user.name).toContain('John');
  expect(user.email).toContain('@example.com');
  expect(user.bio).toMatch(/engineer/i);  // Case-insensitive
  
  // Array validations
  expect(user.roles).toBeInstanceOf(Array);
  expect(user.roles).toHaveLength(2);
  expect(user.roles).toContain('admin');
  expect(user.roles).toEqual(['admin', 'user']);
  expect(user.roles).toEqual(expect.arrayContaining(['admin']));
  
  // Date validations
  expect(new Date(user.createdAt)).toBeInstanceOf(Date);
  expect(new Date(user.createdAt).getTime()).toBeLessThanOrEqual(Date.now());
  
  // Nested object validation
  expect(user.address).toBeDefined();
  expect(user.address.street).toBeTruthy();
  expect(user.address.city).toBe('New York');
  expect(user.address.zipCode).toMatch(/^\d{5}$/);
  
  // ========== Object Matching ==========
  // Partial match
  expect(user).toMatchObject({
    id: 123,
    name: 'John Doe',
    status: 'active',
  });
  
  // Exact match
  expect(user).toEqual({
    id: 123,
    name: 'John Doe',
    email: 'john@example.com',
    active: true,
    roles: ['admin', 'user'],
    address: {
      street: '123 Main St',
      city: 'New York',
      zipCode: '10001',
    },
    createdAt: expect.any(String),
  });
  
  // ========== Using expect.any(), expect.anything() ==========
  expect(user).toEqual({
    id: expect.any(Number),
    name: expect.any(String),
    email: expect.stringMatching(/^[^\s@]+@[^\s@]+$/),
    createdAt: expect.any(String),
    metadata: expect.anything(),  // Any value (including null/undefined)
  });
  
  // ========== Array of Objects Validation ==========
  const usersResponse = await request.get('https://api.example.com/users');
  const users = await usersResponse.json();
  
  expect(users).toBeInstanceOf(Array);
  expect(users.length).toBeGreaterThan(0);
  
  // Validate each item
  users.forEach(user => {
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name');
    expect(user.id).toBeGreaterThan(0);
  });
  
  // Find specific item
  const john = users.find(u => u.name === 'John Doe');
  expect(john).toBeDefined();
  expect(john.email).toBe('john@example.com');
  
  // Validate all items match condition
  const allActive = users.every(u => u.active === true);
  expect(allActive).toBe(true);
  
  // At least one item matches
  const hasAdmin = users.some(u => u.roles.includes('admin'));
  expect(hasAdmin).toBe(true);
  
  // ========== Error Response Validation ==========
  const errorResponse = await request.post('https://api.example.com/users', {
    data: { name: '' },  // Invalid data
  });
  
  expect(errorResponse.status()).toBe(400);
  const error = await errorResponse.json();
  
  expect(error).toHaveProperty('error');
  expect(error).toHaveProperty('message');
  expect(error).toHaveProperty('errors');  // Validation errors
  
  expect(error.error).toBe('ValidationError');
  expect(error.message).toContain('validation failed');
  expect(error.errors).toBeInstanceOf(Array);
  
  // Validate error structure
  expect(error.errors[0]).toMatchObject({
    field: 'name',
    message: expect.any(String),
    code: expect.any(String),
  });
  
  // ========== Performance Validation ==========
  const startTime = Date.now();
  await request.get('https://api.example.com/users');
  const responseTime = Date.now() - startTime;
  
  expect(responseTime).toBeLessThan(1000);  // Response under 1 second
  
  // ========== Response Size Validation ==========
  const buffer = await response.body();
  const sizeInKB = buffer.length / 1024;
  expect(sizeInKB).toBeLessThan(100);  // Less than 100KB
});
```

---

### 10.1.2 GraphQL Testing Deep Dive

**Why GraphQL?** GraphQL allows clients to request exactly the data they need, reducing over-fetching. Testing requires validating queries, mutations, subscriptions, and error handling.

**Complete GraphQL Testing Patterns:**

```typescript
// ========== Basic GraphQL Query ==========
test('GraphQL query', async ({ request }) => {
  const response = await request.post('https://api.example.com/graphql', {
    data: {
      query: `
        query {
          users {
            id
            name
            email
          }
        }
      `,
    },
  });
  
  expect(response.ok()).toBeTruthy();
  const result = await response.json();
  
  expect(result).toHaveProperty('data');
  expect(result).not.toHaveProperty('errors');
  expect(result.data.users).toBeInstanceOf(Array);
  expect(result.data.users[0]).toHaveProperty('id');
});

// ========== GraphQL Query with Variables ==========
test('GraphQL query with variables', async ({ request }) => {
  const response = await request.post('https://api.example.com/graphql', {
    data: {
      query: `
        query GetUser($userId: ID!) {
          user(id: $userId) {
            id
            name
            email
            posts {
              id
              title
              createdAt
            }
          }
        }
      `,
      variables: {
        userId: '123',
      },
    },
  });
  
  const result = await response.json();
  expect(result.data.user.id).toBe('123');
  expect(result.data.user.posts).toBeInstanceOf(Array);
});

// ========== GraphQL Mutation ==========
test('GraphQL mutation', async ({ request }) => {
  const response = await request.post('https://api.example.com/graphql', {
    data: {
      query: `
        mutation CreateUser($input: CreateUserInput!) {
          createUser(input: $input) {
            id
            name
            email
            createdAt
          }
        }
      `,
      variables: {
        input: {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'secret123',
        },
      },
    },
  });
  
  const result = await response.json();
  expect(result.data.createUser).toBeDefined();
  expect(result.data.createUser.id).toBeTruthy();
  expect(result.data.createUser.name).toBe('John Doe');
});

// ========== GraphQL Error Handling ==========
test('GraphQL errors', async ({ request }) => {
  const response = await request.post('https://api.example.com/graphql', {
    data: {
      query: `
        query {
          nonExistentField
        }
      `,
    },
  });
  
  const result = await response.json();
  
  // GraphQL returns 200 even with errors
  expect(response.status()).toBe(200);
  expect(result).toHaveProperty('errors');
  expect(result.errors).toBeInstanceOf(Array);
  expect(result.errors[0]).toHaveProperty('message');
  expect(result.errors[0].message).toContain('Cannot query field');
});

// ========== GraphQL with Authentication ==========
test('GraphQL with auth', async ({ request }) => {
  // Get token
  const loginResponse = await request.post('https://api.example.com/auth/login', {
    data: {
      email: 'user@example.com',
      password: 'password123',
    },
  });
  const { token } = await loginResponse.json();
  
  // GraphQL query with token
  const response = await request.post('https://api.example.com/graphql', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    data: {
      query: `
        query {
          me {
            id
            name
            email
            privateField
          }
        }
      `,
    },
  });
  
  const result = await response.json();
  expect(result.data.me).toBeDefined();
});

// ========== GraphQL Fragments ==========
test('GraphQL fragments', async ({ request }) => {
  const response = await request.post('https://api.example.com/graphql', {
    data: {
      query: `
        fragment UserFields on User {
          id
          name
          email
        }
        
        query {
          user(id: "123") {
            ...UserFields
            posts {
              id
              title
              author {
                ...UserFields
              }
            }
          }
        }
      `,
    },
  });
  
  const result = await response.json();
  expect(result.data.user).toHaveProperty('id');
  expect(result.data.user).toHaveProperty('name');
  expect(result.data.user.posts[0].author).toHaveProperty('name');
});

// ========== GraphQL Aliases ==========
test('GraphQL aliases', async ({ request }) => {
  const response = await request.post('https://api.example.com/graphql', {
    data: {
      query: `
        query {
          user1: user(id: "1") {
            name
          }
          user2: user(id: "2") {
            name
          }
        }
      `,
    },
  });
  
  const result = await response.json();
  expect(result.data.user1.name).toBeTruthy();
  expect(result.data.user2.name).toBeTruthy();
});

// ========== GraphQL Directives ==========
test('GraphQL directives', async ({ request }) => {
  const includeEmail = true;
  
  const response = await request.post('https://api.example.com/graphql', {
    data: {
      query: `
        query GetUser($includeEmail: Boolean!) {
          user(id: "123") {
            id
            name
            email @include(if: $includeEmail)
          }
        }
      `,
      variables: {
        includeEmail,
      },
    },
  });
  
  const result = await response.json();
  if (includeEmail) {
    expect(result.data.user).toHaveProperty('email');
  } else {
    expect(result.data.user).not.toHaveProperty('email');
  }
});

// ========== GraphQL Pagination ==========
test('GraphQL pagination', async ({ request }) => {
  const response = await request.post('https://api.example.com/graphql', {
    data: {
      query: `
        query GetUsers($first: Int!, $after: String) {
          users(first: $first, after: $after) {
            edges {
              node {
                id
                name
              }
              cursor
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `,
      variables: {
        first: 10,
        after: null,
      },
    },
  });
  
  const result = await response.json();
  expect(result.data.users.edges).toHaveLength(10);
  expect(result.data.users.pageInfo.hasNextPage).toBe(true);
  
  // Fetch next page
  const nextPageResponse = await request.post('https://api.example.com/graphql', {
    data: {
      query: `...`,  // Same query
      variables: {
        first: 10,
        after: result.data.users.pageInfo.endCursor,
      },
    },
  });
});

// ========== GraphQL Batch Queries ==========
test('GraphQL batch queries', async ({ request }) => {
  const response = await request.post('https://api.example.com/graphql', {
    data: [
      {
        query: `query { user(id: "1") { name } }`,
      },
      {
        query: `query { user(id: "2") { name } }`,
      },
      {
        query: `query { posts { id title } }`,
      },
    ],
  });
  
  const results = await response.json();
  expect(results).toBeInstanceOf(Array);
  expect(results).toHaveLength(3);
});
```

---

### 10.1.3 Advanced API Testing Patterns

```typescript
// ========== Rate Limiting Testing ==========
test('rate limiting', async ({ request }) => {
  const requests = [];
  
  // Send 100 requests rapidly
  for (let i = 0; i < 100; i++) {
    requests.push(request.get('https://api.example.com/data'));
  }
  
  const responses = await Promise.all(requests);
  
  // Check if any requests were rate-limited
  const rateLimited = responses.filter(r => r.status() === 429);
  expect(rateLimited.length).toBeGreaterThan(0);
  
  // Check rate limit headers
  const response = responses[0];
  const headers = response.headers();
  expect(headers['x-rate-limit-limit']).toBeDefined();
  expect(headers['x-rate-limit-remaining']).toBeDefined();
  expect(headers['x-rate-limit-reset']).toBeDefined();
});

// ========== Retry Logic with Exponential Backoff ==========
async function apiCallWithRetry(request, url, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await request.get(url);
    
    if (response.ok()) {
      return response;
    }
    
    if (response.status() >= 500) {
      // Server error - retry with exponential backoff
      const delay = Math.pow(2, attempt) * 1000;  // 1s, 2s, 4s
      await new Promise(resolve => setTimeout(resolve, delay));
      continue;
    }
    
    // Client error - don't retry
    return response;
  }
  
  throw new Error(`Failed after ${maxRetries} retries`);
}

test('retry logic', async ({ request }) => {
  const response = await apiCallWithRetry(request, 'https://api.example.com/flaky-endpoint');
  expect(response.ok()).toBeTruthy();
});

// ========== Polling for Async Operations ==========
test('polling for job completion', async ({ request }) => {
  // Start async job
  const startResponse = await request.post('https://api.example.com/jobs', {
    data: { type: 'data-export' },
  });
  const { jobId } = await startResponse.json();
  
  // Poll for completion
  let status = 'pending';
  let attempts = 0;
  const maxAttempts = 30;
  
  while (status !== 'completed' && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 2000));  // Wait 2s
    
    const statusResponse = await request.get(`https://api.example.com/jobs/${jobId}`);
    const job = await statusResponse.json();
    status = job.status;
    attempts++;
    
    console.log(`Attempt ${attempts}: Job status = ${status}`);
  }
  
  expect(status).toBe('completed');
  
  // Download result
  const resultResponse = await request.get(`https://api.example.com/jobs/${jobId}/result`);
  expect(resultResponse.ok()).toBeTruthy();
});

// ========== Conditional Requests (ETags) ==========
test('conditional requests with ETags', async ({ request }) => {
  // First request
  const response1 = await request.get('https://api.example.com/data');
  const etag = response1.headers()['etag'];
  const data1 = await response1.json();
  
  // Second request with If-None-Match
  const response2 = await request.get('https://api.example.com/data', {
    headers: {
      'If-None-Match': etag,
    },
  });
  
  if (response2.status() === 304) {
    // Not Modified - use cached data
    console.log('Data not modified, using cache');
  } else {
    // Data changed
    const data2 = await response2.json();
    expect(data2).not.toEqual(data1);
  }
});

// ========== Content Negotiation ==========
test('content negotiation', async ({ request }) => {
  // Request JSON
  const jsonResponse = await request.get('https://api.example.com/users', {
    headers: { 'Accept': 'application/json' },
  });
  expect(jsonResponse.headers()['content-type']).toContain('application/json');
  
  // Request XML
  const xmlResponse = await request.get('https://api.example.com/users', {
    headers: { 'Accept': 'application/xml' },
  });
  expect(xmlResponse.headers()['content-type']).toContain('application/xml');
  
  // Request CSV
  const csvResponse = await request.get('https://api.example.com/users', {
    headers: { 'Accept': 'text/csv' },
  });
  expect(csvResponse.headers()['content-type']).toContain('text/csv');
});

// ========== Streaming Responses ==========
test('streaming response', async ({ request }) => {
  const response = await request.get('https://api.example.com/stream');
  
  const buffer = await response.body();
  console.log(`Received ${buffer.length} bytes`);
  
  // Process stream
  const lines = buffer.toString().split('\n');
  expect(lines.length).toBeGreaterThan(0);
});

// ========== Webhook Testing ==========
test('webhook simulation', async ({ request, page }) => {
  // Trigger webhook
  const triggerResponse = await request.post('https://api.example.com/webhooks/trigger', {
    data: {
      event: 'user.created',
      userId: 123,
    },
  });
  
  expect(triggerResponse.status()).toBe(202);  // Accepted
  
  // Wait for webhook to be processed (if you have a UI indicator)
  await page.goto('/admin/webhooks');
  await expect(page.locator('.webhook-log').first()).toContainText('user.created');
});
```

---



#### GraphQL

```typescript
test('GraphQL query', async ({ request }) => {
  const response = await request.post('https://api.example.com/graphql', {
    data: {
      query: `
        query GetUser($id: ID!) {
          user(id: $id) {
            id
            name
            email
          }
        }
      `,
      variables: { id: '123' },
    },
  });
  
  const data = await response.json();
  expect(data.data.user.name).toBe('John Doe');
});
```

---

### 10.2 Authentication (OAuth, Cookies, Tokens, storageState)

```typescript
test('API with bearer token', async ({ request }) => {
  const response = await request.get('https://api.example.com/protected', {
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN_HERE',
    },
  });
  
  expect(response.ok()).toBeTruthy();
});
```

---

### 10.3 Schema Validation & Contract Checks (OpenAPI)

```typescript
import Ajv from 'ajv';

test('validate API schema', async ({ request }) => {
  const response = await request.get('https://api.example.com/users/1');
  const user = await response.json();
  
  const schema = {
    type: 'object',
    properties: {
      id: { type: 'number' },
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
    },
    required: ['id', 'name', 'email'],
  };
  
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const valid = validate(user);
  
  expect(valid).toBe(true);
});
```

---

### 10.4 Chaining UI & API Tests (Hybrid Scenarios)

```typescript
test('hybrid UI + API test', async ({ page, request }) => {
  // API: Create test data
  const response = await request.post('https://api.example.com/users', {
    data: {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    },
  });
  const user = await response.json();
  
  // UI: Login with created user
  await page.goto('/login');
  await page.fill('#email', user.email);
  await page.fill('#password', 'password123');
  await page.click('#submit');
  
  await expect(page).toHaveURL('**/dashboard');
  await expect(page.locator('.user-name')).toHaveText(user.name);
  
  // API: Cleanup
  await request.delete(`https://api.example.com/users/${user.id}`);
});
```

---

## 11. Test Data Management & Faker

### 11.1 Dynamic Test Data vs Static Fixtures

#### Static Fixtures

```typescript
// data/test-users.json
{
  "admin": {
    "email": "admin@example.com",
    "password": "admin123",
    "role": "admin"
  },
  "user": {
    "email": "user@example.com",
    "password": "user123",
    "role": "user"
  }
}

// tests/login.spec.ts
import testUsers from '../data/test-users.json';

test('admin login', async ({ page }) => {
  const admin = testUsers.admin;
  await page.goto('/login');
  await page.fill('#email', admin.email);
  await page.fill('#password', admin.password);
  await page.click('#submit');
});
```

#### Dynamic Test Data with Faker

```typescript
import { faker } from '@faker-js/faker';

test('create user with random data', async ({ page, request }) => {
  const userData = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    zipCode: faker.location.zipCode(),
    company: faker.company.name(),
    jobTitle: faker.person.jobTitle(),
  };
  
  // Create via API
  await request.post('/api/users', { data: userData });
  
  // Verify in UI
  await page.goto('/users');
  await expect(page.locator('text=' + userData.email)).toBeVisible();
});
```

#### When to Use Each

| Scenario | Approach | Reason |
|----------|----------|--------|
| **Login credentials** | Static | Consistent, pre-configured accounts |
| **User profiles** | Dynamic | Avoid conflicts, unique data |
| **Product catalog** | Static | Known SKUs, prices |
| **Orders, invoices** | Dynamic | Fresh data per test |
| **Configuration** | Static | Predictable test environment |
| **Test isolation** | Dynamic | No shared state issues |

---

### 11.2 Faker Integration for Realistic Data

```typescript
import { faker } from '@faker-js/faker';

// Set seed for reproducible random data
faker.seed(123);

test('comprehensive faker usage', async ({ page, request }) => {
  const testData = {
    // Personal
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    fullName: faker.person.fullName(),
    gender: faker.person.gender(),
    avatar: faker.image.avatar(),
    
    // Contact
    email: faker.internet.email(),
    phone: faker.phone.number(),
    username: faker.internet.userName(),
    
    // Address
    streetAddress: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zipCode: faker.location.zipCode(),
    country: faker.location.country(),
    
    // Company
    companyName: faker.company.name(),
    jobTitle: faker.person.jobTitle(),
    department: faker.commerce.department(),
    
    // Commerce
    productName: faker.commerce.productName(),
    price: faker.commerce.price(),
    productDescription: faker.commerce.productDescription(),
    
    // Financial
    creditCard: faker.finance.creditCardNumber(),
    iban: faker.finance.iban(),
    bitcoin: faker.finance.bitcoinAddress(),
    
    // Internet
    url: faker.internet.url(),
    domainName: faker.internet.domainName(),
    ipAddress: faker.internet.ip(),
    userAgent: faker.internet.userAgent(),
    
    // Dates
    pastDate: faker.date.past(),
    futureDate: faker.date.future(),
    birthdate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
    
    // Text
    paragraph: faker.lorem.paragraph(),
    sentence: faker.lorem.sentence(),
    words: faker.lorem.words(5),
    
    // Random
    uuid: faker.string.uuid(),
    alphanumeric: faker.string.alphanumeric(10),
    hexadecimal: faker.string.hexadecimal({ length: 8 }),
  };
  
  // Use in test
  await request.post('/api/users', { data: testData });
});
```

#### Custom Faker Helpers

```typescript
// helpers/faker-helpers.ts
import { faker } from '@faker-js/faker';

export class TestDataGenerator {
  static generateUser(role: 'admin' | 'user' | 'guest' = 'user') {
    return {
      id: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: 'Test123!@#',
      role,
      createdAt: faker.date.recent(),
    };
  }
  
  static generateProduct() {
    return {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      category: faker.commerce.department(),
      sku: faker.string.alphanumeric(8).toUpperCase(),
      inStock: faker.datatype.boolean(),
      quantity: faker.number.int({ min: 0, max: 1000 }),
    };
  }
  
  static generateOrder(userId: string) {
    return {
      id: faker.string.uuid(),
      userId,
      items: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
        productId: faker.string.uuid(),
        quantity: faker.number.int({ min: 1, max: 10 }),
        price: parseFloat(faker.commerce.price()),
      })),
      total: parseFloat(faker.commerce.price({ min: 100, max: 1000 })),
      status: faker.helpers.arrayElement(['pending', 'processing', 'shipped', 'delivered']),
      createdAt: faker.date.recent(),
    };
  }
  
  static generateCreditCard() {
    return {
      number: faker.finance.creditCardNumber(),
      cvv: faker.finance.creditCardCVV(),
      expiryMonth: faker.number.int({ min: 1, max: 12 }).toString().padStart(2, '0'),
      expiryYear: faker.number.int({ min: 2025, max: 2030 }).toString(),
      cardholderName: faker.person.fullName(),
    };
  }
}

// Usage
test('create order', async ({ request }) => {
  const user = TestDataGenerator.generateUser();
  const product = TestDataGenerator.generateProduct();
  const order = TestDataGenerator.generateOrder(user.id);
  
  // Create test data via API
  await request.post('/api/users', { data: user });
  await request.post('/api/products', { data: product });
  await request.post('/api/orders', { data: order });
});
```

---

### 11.3 Database Seeding & Teardown Strategies

#### Database Fixtures

```typescript
// fixtures/database.ts
import { test as base } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type DatabaseFixtures = {
  db: PrismaClient;
  cleanupUsers: void;
};

export const test = base.extend<DatabaseFixtures>({
  db: async ({}, use) => {
    await use(prisma);
  },
  
  cleanupUsers: [async ({}, use) => {
    // Setup: Nothing needed before test
    await use();
    
    // Teardown: Delete test users after test
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: 'test',
        },
      },
    });
  }, { auto: true }],
});

// Usage
test('create user in database', async ({ db }) => {
  const user = await db.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
    },
  });
  
  expect(user.id).toBeDefined();
});
```

#### SQL Seeding

```typescript
import { Client } from 'pg';

test.beforeAll(async () => {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'testdb',
    user: 'postgres',
    password: 'password',
  });
  
  await client.connect();
  
  // Seed data
  await client.query(`
    INSERT INTO users (email, name, role)
    VALUES 
      ('admin@example.com', 'Admin User', 'admin'),
      ('user@example.com', 'Regular User', 'user');
  `);
  
  await client.end();
});

test.afterAll(async () => {
  const client = new Client({ /* config */ });
  await client.connect();
  
  // Cleanup
  await client.query(`DELETE FROM users WHERE email LIKE '%@example.com'`);
  
  await client.end();
});
```

#### Transaction-Based Isolation

```typescript
test('isolated test with transaction', async ({ page }) => {
  const client = new Client({ /* config */ });
  await client.connect();
  
  try {
    await client.query('BEGIN');
    
    // Create test data
    await client.query(`
      INSERT INTO users (email, name) 
      VALUES ('test@example.com', 'Test User')
    `);
    
    // Run test
    await page.goto('/users');
    await expect(page.locator('text=test@example.com')).toBeVisible();
    
    // Rollback (cleanup)
    await client.query('ROLLBACK');
  } finally {
    await client.end();
  }
});
```

---

### 11.4 Environment-Specific Data (Dev, Staging, Prod-like)

```typescript
// config/test-data.ts
const testData = {
  dev: {
    apiUrl: 'http://localhost:3000/api',
    adminEmail: 'admin@dev.local',
    adminPassword: 'dev123',
  },
  staging: {
    apiUrl: 'https://staging-api.example.com',
    adminEmail: 'admin@staging.example.com',
    adminPassword: process.env.STAGING_ADMIN_PASSWORD,
  },
  prod: {
    apiUrl: 'https://api.example.com',
    adminEmail: 'admin@example.com',
    adminPassword: process.env.PROD_ADMIN_PASSWORD,
  },
};

const env = process.env.TEST_ENV || 'dev';
export const config = testData[env];

// Usage in tests
import { config } from '../config/test-data';

test('login with environment-specific credentials', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#email', config.adminEmail);
  await page.fill('#password', config.adminPassword);
  await page.click('#submit');
});
```

---

## 12. Parallelism & Sharding

### 12.1 Worker Threads, Test Isolation, Browser Context Reuse

#### Worker Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  // Run tests in parallel
  fullyParallel: true,
  
  // Number of worker processes
  workers: process.env.CI ? 2 : undefined, // 2 on CI, CPU cores locally
  
  // Maximum failures before stopping
  maxFailures: process.env.CI ? 10 : undefined,
});
```

#### Test Isolation Modes

```typescript
// Default: Each test gets fresh context
test('isolated test 1', async ({ page }) => {
  // Fresh browser context, no shared state
  await page.goto('/');
});

test('isolated test 2', async ({ page }) => {
  // Completely separate context
  await page.goto('/');
});

// Shared context within describe block (not recommended)
test.describe.configure({ mode: 'serial' });

test.describe('serial tests', () => {
  test('step 1', async ({ page }) => {
    // Runs first
  });
  
  test('step 2', async ({ page }) => {
    // Runs second, shares context
  });
});
```

#### Browser Context Reuse Pattern

```typescript
// fixtures/persistent-context.ts
import { test as base, chromium } from '@playwright/test';

type PersistentContextFixtures = {
  persistentPage: Page;
};

export const test = base.extend<PersistentContextFixtures>({
  persistentPage: [async ({}, use, workerInfo) => {
    // Create browser context once per worker
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await use(page);
    
    // Cleanup
    await context.close();
    await browser.close();
  }, { scope: 'worker' }],
});

// Usage: Same context reused across tests in worker
test('test 1', async ({ persistentPage }) => {
  await persistentPage.goto('/');
});

test('test 2', async ({ persistentPage }) => {
  // Reuses same context
  await persistentPage.goto('/about');
});
```

---

### 12.2 Sharding Tests Across Multiple Machines

```bash
# Split tests into 4 shards, run shard 1
npx playwright test --shard=1/4

# Run shard 2
npx playwright test --shard=2/4

# Run shard 3
npx playwright test --shard=3/4

# Run shard 4
npx playwright test --shard=4/4
```

#### CI Configuration with Sharding

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      - name: Run tests
        run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report-${{ matrix.shardIndex }}
          path: playwright-report/
```

---

### 12.3 Parallelism Best Practices & Gotchas

#### Best Practices

```typescript
// ✅ Good: Independent tests
test('test 1', async ({ page }) => {
  await page.goto('/');
  await page.click('#button1');
});

test('test 2', async ({ page }) => {
  await page.goto('/');
  await page.click('#button2');
});

// ❌ Bad: Tests depend on each other
let sharedData;

test('test 1', async ({ page }) => {
  sharedData = await page.locator('#data').textContent();
});

test('test 2', async ({ page }) => {
  // Breaks in parallel - sharedData might be undefined
  expect(sharedData).toBe('expected');
});

// ✅ Good: Use fixtures for shared setup
type SharedDataFixture = {
  sharedData: string;
};

const test = base.extend<SharedDataFixture>({
  sharedData: async ({ page }, use) => {
    await page.goto('/');
    const data = await page.locator('#data').textContent();
    await use(data);
  },
});
```

#### Common Gotchas

| Issue | Problem | Solution |
|-------|---------|----------|
| **Shared database** | Tests conflict on same data | Use unique IDs, transactions, or separate DB per worker |
| **Port conflicts** | Multiple servers on same port | Use dynamic ports or worker-specific ports |
| **File system** | Tests write to same files | Use temp directories with unique names |
| **Global state** | Singleton patterns | Reset state in beforeEach or use test-scoped instances |
| **Rate limiting** | API throttling shared IP | Implement backoff, use separate API keys per worker |

#### Worker-Specific Resources

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    // Each worker gets unique storage
    storageState: ({ workerIndex }) => `auth-${workerIndex}.json`,
  },
  
  webServer: {
    // Each worker gets unique port
    command: 'npm run start',
    url: ({ workerIndex }) => `http://localhost:${3000 + workerIndex}`,
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## 13. Reporting & Observability

### 13.1 Built-in Reporters (List, HTML, JSON, JUnit)

```typescript
// playwright.config.ts
export default defineConfig({
  reporter: [
    // List reporter (console output)
    ['list'],
    
    // HTML reporter (interactive report)
    ['html', { 
      open: 'never',  // 'always', 'never', 'on-failure'
      outputFolder: 'playwright-report',
    }],
    
    // JSON reporter (for programmatic access)
    ['json', { 
      outputFile: 'test-results.json',
    }],
    
    // JUnit XML (for CI integration)
    ['junit', { 
      outputFile: 'results.xml',
    }],
    
    // GitHub Actions reporter
    ['github'],
    
    // Dot reporter (minimal output)
    ['dot'],
    
    // Line reporter (one line per test)
    ['line'],
  ],
});
```

#### HTML Report Features

```bash
# Generate and open HTML report
npx playwright test --reporter=html

# Open existing report
npx playwright show-report

# Custom output folder
npx playwright test --reporter=html,outputFolder=custom-report
```

---

### 13.2 Custom Reporters & Integrations

```typescript
// reporters/custom-reporter.ts
import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';

class CustomReporter implements Reporter {
  onBegin(config, suite) {
    console.log(`Starting test run with ${suite.allTests().length} tests`);
  }
  
  onTestBegin(test: TestCase) {
    console.log(`Starting test: ${test.title}`);
  }
  
  onTestEnd(test: TestCase, result: TestResult) {
    console.log(`Finished test: ${test.title} - ${result.status}`);
    
    if (result.status === 'failed') {
      console.error(`Error: ${result.error?.message}`);
    }
  }
  
  onEnd(result) {
    console.log(`Test run finished: ${result.status}`);
    console.log(`Total: ${result.startTime}`);
  }
}

export default CustomReporter;
```

#### Slack Integration Reporter

```typescript
// reporters/slack-reporter.ts
import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import axios from 'axios';

class SlackReporter implements Reporter {
  private failed: TestCase[] = [];
  private passed: number = 0;
  
  onTestEnd(test: TestCase, result: TestResult) {
    if (result.status === 'passed') {
      this.passed++;
    } else if (result.status === 'failed') {
      this.failed.push(test);
    }
  }
  
  async onEnd(result) {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl) return;
    
    const message = {
      text: `Test Run Complete`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Test Results*\n✅ Passed: ${this.passed}\n❌ Failed: ${this.failed.length}`,
          },
        },
        ...(this.failed.length > 0 ? [{
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Failed Tests:*\n${this.failed.map(t => `• ${t.title}`).join('\n')}`,
          },
        }] : []),
      ],
    };
    
    await axios.post(webhookUrl, message);
  }
}

export default SlackReporter;
```

#### Using Custom Reporters

```typescript
// playwright.config.ts
export default defineConfig({
  reporter: [
    ['./reporters/custom-reporter.ts'],
    ['./reporters/slack-reporter.ts'],
    ['html'],
  ],
});
```

---

### 13.3 Allure, ReportPortal Integration

#### Allure Reporter

```bash
# Install Allure reporter
npm install --save-dev allure-playwright
```

```typescript
// playwright.config.ts
export default defineConfig({
  reporter: [
    ['allure-playwright', {
      detail: true,
      outputFolder: 'allure-results',
      suiteTitle: false,
    }],
  ],
});
```

```typescript
// Add Allure annotations in tests
import { test } from '@playwright/test';
import { allure } from 'allure-playwright';

test('allure annotations', async ({ page }) => {
  await allure.description('This test verifies login functionality');
  await allure.epic('Authentication');
  await allure.feature('Login');
  await allure.story('User Login');
  await allure.severity('critical');
  await allure.tag('smoke');
  await allure.owner('QA Team');
  
  await allure.step('Navigate to login page', async () => {
    await page.goto('/login');
  });
  
  await allure.step('Enter credentials', async () => {
    await page.fill('#email', 'user@example.com');
    await page.fill('#password', 'password123');
  });
  
  await allure.step('Submit login form', async () => {
    await page.click('#submit');
  });
  
  await allure.step('Verify dashboard', async () => {
    await expect(page).toHaveURL('**/dashboard');
  });
  
  // Attach screenshot
  const screenshot = await page.screenshot();
  await allure.attachment('Dashboard Screenshot', screenshot, 'image/png');
});
```

```bash
# Generate Allure report
npx allure generate allure-results -o allure-report --clean
npx allure open allure-report
```

#### ReportPortal Integration

```bash
npm install --save-dev @reportportal/agent-js-playwright
```

```typescript
// playwright.config.ts
export default defineConfig({
  reporter: [
    ['@reportportal/agent-js-playwright', {
      apiKey: process.env.RP_API_KEY,
      endpoint: 'https://reportportal.example.com/api/v1',
      project: 'my_project',
      launch: 'Playwright Tests',
      description: 'Test run description',
      attributes: [
        { key: 'environment', value: 'staging' },
        { key: 'build', value: process.env.BUILD_NUMBER },
      ],
    }],
  ],
});
```

---

### 13.4 Screenshot & Video Capture Strategies

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    // Screenshot settings
    screenshot: 'only-on-failure',  // 'off', 'on', 'only-on-failure'
    
    // Video settings
    video: 'retain-on-failure',     // 'off', 'on', 'retain-on-failure', 'on-first-retry'
    
    // Video size
    viewport: { width: 1280, height: 720 },
  },
});
```

#### Manual Screenshot Capture

```typescript
test('manual screenshots', async ({ page }) => {
  await page.goto('/');
  
  // Full page screenshot
  await page.screenshot({ 
    path: 'screenshots/homepage.png',
    fullPage: true,
  });
  
  // Element screenshot
  await page.locator('.header').screenshot({ 
    path: 'screenshots/header.png',
  });
  
  // Screenshot to buffer
  const buffer = await page.screenshot();
  
  // Attach to test report
  await test.info().attach('Homepage', {
    body: buffer,
    contentType: 'image/png',
  });
});
```

#### Video Access

```typescript
test('access video', async ({ page }, testInfo) => {
  await page.goto('/');
  // ... test actions
  
  // Video path available after test
  const videoPath = await page.video()?.path();
  console.log('Video saved at:', videoPath);
  
  // Attach video to test report
  if (testInfo.status !== 'passed') {
    const video = await page.video();
    if (video) {
      await testInfo.attach('Test Video', {
        path: await video.path(),
        contentType: 'video/webm',
      });
    }
  }
});
```

#### Trace Files

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    trace: 'on-first-retry',  // 'on', 'off', 'on-first-retry', 'retain-on-failure'
  },
});
```

```bash
# View trace
npx playwright show-trace trace.zip

# Trace includes:
# - Screenshots at each action
# - DOM snapshots
# - Network activity
# - Console logs
# - Source code
```

---

## 14. Debugging & Troubleshooting

### 14.0 Deep Dive: Systematic Debugging Methodology

**The Step-by-Step Troubleshooting Process:**

When a test fails, follow this systematic approach instead of randomly trying fixes.

#### Step 1: Understand the Failure

```typescript
// ❌ Common mistake: Jump to conclusions
test('fails randomly', async ({ page }) => {
  await page.click('#submit');  // Sometimes fails
  // Developer immediately adds: await page.waitForTimeout(5000);
  // This masks the problem instead of fixing it
});

// ✅ Systematic approach: Gather information
test('fails randomly', async ({ page }) => {
  // 1. Enable trace to see what actually happens
  await page.context().tracing.start({ screenshots: true, snapshots: true });
  
  try {
    await page.click('#submit');
  } catch (error) {
    // 2. Capture diagnostic information
    await page.screenshot({ path: 'failure.png' });
    console.log('Page URL:', page.url());
    console.log('Page title:', await page.title());
    console.log('Element exists?', await page.locator('#submit').count());
    console.log('Element visible?', await page.locator('#submit').isVisible());
    console.log('Element enabled?', await page.locator('#submit').isEnabled());
    throw error;
  } finally {
    await page.context().tracing.stop({ path: 'trace.zip' });
  }
});
```

#### Step 2: Reproduce Consistently

```typescript
// ❌ "It works on my machine" syndrome
test('inconsistent test', async ({ page }) => {
  await page.goto('/');
  await page.click('#button');  // Works locally, fails in CI
});

// ✅ Make it fail consistently to debug
test('consistent reproduction', async ({ page }) => {
  // Match CI conditions
  await page.setViewportSize({ width: 1280, height: 720 });  // CI viewport
  await page.emulateMedia({ colorScheme: 'dark' });  // CI might use dark mode
  
  // Simulate slow network (like CI)
  await page.route('**/*', route => {
    setTimeout(() => route.continue(), 100);  // 100ms delay
  });
  
  await page.goto('/');
  await page.click('#button');
});
```

#### Step 3: Isolate the Problem

```typescript
// ❌ Complex test with many actions
test('complex checkout flow', async ({ page }) => {
  await page.goto('/products');
  await page.click('.product:nth-child(1)');
  await page.click('#add-to-cart');
  await page.click('#cart-icon');
  await page.click('#checkout');
  await page.fill('#email', 'test@example.com');
  await page.fill('#card', '4242424242424242');
  await page.click('#submit-payment');  // Fails here
  // Which action caused the problem?
});

// ✅ Binary search debugging
test('isolate checkout issue', async ({ page }) => {
  // Skip unrelated steps using storageState or API
  await page.goto('/checkout?cart=product-123');  // Direct to problem area
  
  // Now test only the problematic section
  await page.fill('#email', 'test@example.com');
  await page.fill('#card', '4242424242424242');
  
  // Add detailed logging
  console.log('Before submit - form valid?', 
    await page.locator('form').getAttribute('aria-invalid'));
  
  await page.click('#submit-payment');
  
  // Narrow down the exact failure point
});
```

#### Step 4: Check Common Culprits

**Common Failure Patterns Decision Tree:**

```
Test Failed
│
├─ TimeoutError?
│  ├─ Element never appeared?
│  │  └─ Check: Selector correct? Network slow? JavaScript error?
│  │
│  ├─ Element not clickable?
│  │  └─ Check: Overlapping element? Disabled? Outside viewport?
│  │
│  └─ Page never loaded?
│     └─ Check: Navigation event? waitForLoadState? Network error?
│
├─ Wrong Value?
│  ├─ Stale data?
│  │  └─ Check: Cache? Hard reload needed?
│  │
│  └─ Race condition?
│     └─ Check: Async operation not awaited?
│
└─ Flaky (passes sometimes)?
   ├─ Animation issue?
   │  └─ Check: CSS transitions? Scroll animations?
   │
   ├─ Network timing?
   │  └─ Check: API call timing? Resource loading?
   │
   └─ Parallel execution issue?
      └─ Check: Shared resource? Database conflict?
```

**Real Troubleshooting Examples:**

```typescript
// PROBLEM: "Element not clickable" error
test('debug not clickable', async ({ page }) => {
  await page.goto('/');
  await page.click('#submit');  // ❌ Error: element not clickable
  
  // STEP 1: Check if element exists
  const count = await page.locator('#submit').count();
  console.log('Element count:', count);  // Output: 1 (exists)
  
  // STEP 2: Check visibility
  const visible = await page.locator('#submit').isVisible();
  console.log('Visible:', visible);  // Output: true
  
  // STEP 3: Check if enabled
  const enabled = await page.locator('#submit').isEnabled();
  console.log('Enabled:', enabled);  // Output: false ← FOUND IT!
  
  // STEP 4: Why is it disabled?
  const disabled = await page.locator('#submit').getAttribute('disabled');
  console.log('Disabled attribute:', disabled);  // Output: "disabled"
  
  // STEP 5: What condition enables it?
  await page.fill('#email', 'test@example.com');  // Fill required field
  console.log('After email, enabled:', await page.locator('#submit').isEnabled());
  // Output: true ← Fixed!
  
  await page.click('#submit');  // ✅ Now works
});

// PROBLEM: Test passes locally, fails in CI
test('debug CI failure', async ({ page }) => {
  // Hypothesis 1: Different viewport
  console.log('Viewport:', page.viewportSize());
  // Local: { width: 1920, height: 1080 }
  // CI: { width: 1280, height: 720 } ← Element might be off-screen!
  
  // Fix: Ensure element is in viewport
  await page.locator('#submit').scrollIntoViewIfNeeded();
  
  // Hypothesis 2: Different network speed
  // CI might have slower network, element not loaded yet
  await page.waitForLoadState('networkidle');
  
  // Hypothesis 3: Different timezone/locale
  console.log('Locale:', await page.evaluate(() => navigator.language));
  // Local: 'en-US'
  // CI: 'en-GB' ← Date format issues?
  
  await page.click('#submit');
});

// PROBLEM: Flaky test (passes 80% of the time)
test('debug flaky test', async ({ page }) => {
  await page.goto('/dashboard');
  
  // BEFORE: await page.click('.load-more');  // Sometimes fails
  
  // STEP 1: Check if element is animating
  const box1 = await page.locator('.load-more').boundingBox();
  await page.waitForTimeout(100);
  const box2 = await page.locator('.load-more').boundingBox();
  
  if (box1 && box2) {
    const isAnimating = box1.y !== box2.y;
    console.log('Is animating:', isAnimating);  // Output: true ← Found it!
  }
  
  // FIX: Wait for element to be stable
  await page.locator('.load-more').click({ force: false });  // Auto-waits for stable
  
  // OR disable animations globally
  await page.addInitScript(() => {
    const style = document.createElement('style');
    style.innerHTML = '* { animation-duration: 0s !important; transition-duration: 0s !important; }';
    document.head.appendChild(style);
  });
});
```

#### Step 5: Fix Root Cause (Not Symptoms)

```typescript
// ❌ Symptom fix: Masks the problem
test('symptom fix', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(5000);  // "Fixes" the flakiness
  await page.click('#submit');
  // Problem: We don't know WHY it needed 5 seconds
});

// ✅ Root cause fix: Addresses the actual issue
test('root cause fix', async ({ page }) => {
  await page.goto('/');
  
  // Root cause: Button is disabled until API response
  await page.waitForResponse(resp => 
    resp.url().includes('/api/config') && resp.status() === 200
  );
  
  // Now we know button is ready
  await page.click('#submit');
});
```

#### Step 6: Prevent Future Occurrences

```typescript
// ✅ Make test robust with helper functions
class TestHelpers {
  static async clickWhenReady(page: Page, selector: string) {
    const element = page.locator(selector);
    
    // Check all conditions
    await expect(element).toBeVisible();
    await expect(element).toBeEnabled();
    await element.scrollIntoViewIfNeeded();
    
    // Wait for stability (not animating)
    await element.waitFor({ state: 'attached' });
    
    // Click with retry
    await element.click();
  }
  
  static async fillFormSafely(page: Page, formData: Record<string, string>) {
    for (const [selector, value] of Object.entries(formData)) {
      await page.locator(selector).waitFor({ state: 'visible' });
      await page.fill(selector, value);
      
      // Verify value was filled
      const actualValue = await page.locator(selector).inputValue();
      if (actualValue !== value) {
        throw new Error(`Failed to fill ${selector}: expected "${value}", got "${actualValue}"`);
      }
    }
  }
}

test('robust test', async ({ page }) => {
  await page.goto('/form');
  
  await TestHelpers.fillFormSafely(page, {
    '#name': 'John Doe',
    '#email': 'john@example.com',
  });
  
  await TestHelpers.clickWhenReady(page, '#submit');
});
```

---

### 14.0.1 Debugging Tools Comparison

| Tool | When to Use | Pros | Cons | Best For |
|------|-------------|------|------|----------|
| **Trace Viewer** | After test failure | Visual timeline, DOM snapshots, network | Requires trace recording | Understanding test flow |
| **Inspector** | During development | Live debugging, step through | Blocks test execution | Writing new tests |
| **console.log** | Quick checks | Fast, no setup | Clutters output | Variable inspection |
| **Screenshots** | Visual verification | See actual UI state | Manual inspection | Layout issues |
| **Video Recording** | Flaky test investigation | See full test run | Large files | CI failures |
| **Headed Mode** | Local debugging | See browser actions | Slower, can't run in CI | Interactive debugging |

**Choosing the Right Tool:**

```typescript
// SCENARIO 1: Test fails in CI (can't reproduce locally)
// TOOL: Trace Viewer + Video
test.use({ 
  trace: 'on-first-retry',  // Captures trace on failure
  video: 'retain-on-failure'  // Saves video
});

// SCENARIO 2: Writing new test (need to find selectors)
// TOOL: Inspector
test('new test', async ({ page }) => {
  await page.pause();  // Opens inspector
  // Click "Pick Locator" to find elements
});

// SCENARIO 3: Element sometimes not found
// TOOL: console.log + screenshots
test('debug selectors', async ({ page }) => {
  await page.goto('/');
  
  // Check if element exists
  const count = await page.locator('.item').count();
  console.log('Item count:', count);
  
  if (count === 0) {
    await page.screenshot({ path: 'no-items.png', fullPage: true });
    console.log('HTML:', await page.content());
  }
});

// SCENARIO 4: Animation causing issues
// TOOL: Headed + slowMo
test.use({ 
  headless: false,
  slowMo: 500  // Slow down to see animations
});

// SCENARIO 5: Network timing issues
// TOOL: Trace Viewer (shows network timeline)
test.use({ trace: 'on' });
test('network timing', async ({ page }) => {
  await page.goto('/');
  await page.click('#load-data');  // When does network request happen?
  // Check trace.zip for network timeline
});
```

---

### 14.1 Playwright Inspector, Trace Viewer

#### Playwright Inspector

```bash
# Run tests in debug mode
npx playwright test --debug

# Debug specific test
npx playwright test login.spec.ts --debug

# Start from specific line
npx playwright test --debug --headed
```

```typescript
// Add breakpoint in code
test('debug test', async ({ page }) => {
  await page.goto('/');
  
  // Pause execution
  await page.pause();
  
  // Continue with test...
});
```

#### Inspector Features
- **Step over**: Execute next action
- **Resume**: Continue execution
- **Step into**: Debug into function
- **Pick locator**: Select element on page
- **Source code**: View test code
- **Console**: Execute commands

---

### 14.2 Headed vs Headless Mode, slowMo

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    // Run in headed mode (see browser)
    headless: false,
    
    // Slow down execution
    slowMo: 1000, // 1 second delay between actions
  },
});
```

```bash
# Command line options
npx playwright test --headed
npx playwright test --headed --slowmo=1000
npx playwright test --debug
```

---

### 14.3 Common Flakiness Patterns & Fixes

#### Pattern 1: Animation/Transition Issues

```typescript
// ❌ Bad: Click during animation
await page.click('.animated-button');

// ✅ Good: Wait for animation to complete
await page.waitForLoadState('networkidle');
await page.click('.animated-button');

// ✅ Better: Disable animations
await page.addInitScript(() => {
  document.body.style.setProperty('transition', 'none', 'important');
  document.body.style.setProperty('animation', 'none', 'important');
});
```

#### Pattern 2: Timing Issues

```typescript
// ❌ Bad: Fixed wait
await page.waitForTimeout(5000);

// ✅ Good: Wait for condition
await page.waitForSelector('.data-loaded');
await expect(page.locator('.data')).toBeVisible();
```

#### Pattern 3: Element Not Stable

```typescript
// ❌ Bad: Click immediately
await page.click('button');

// ✅ Good: Wait for element to be stable
await page.locator('button').waitFor({ state: 'visible' });
await page.locator('button').click();
```

#### Pattern 4: Network Race Conditions

```typescript
// ❌ Bad: Don't wait for network
await page.click('#load-data');
await expect(page.locator('.data')).toBeVisible();

// ✅ Good: Wait for specific network request
const responsePromise = page.waitForResponse('**/api/data');
await page.click('#load-data');
await responsePromise;
await expect(page.locator('.data')).toBeVisible();
```

---

### 14.4 Verbose Logging, DEBUG Environment Variable

```bash
# Enable debug logging
DEBUG=pw:api npx playwright test

# Multiple debug categories
DEBUG=pw:api,pw:browser npx playwright test

# All Playwright debug logs
DEBUG=pw:* npx playwright test

# Browser console
DEBUG=pw:browser npx playwright test
```

#### Custom Logging

```typescript
// Enable verbose logging in tests
test('with logging', async ({ page }) => {
  // Log page console
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  // Log requests
  page.on('request', request => 
    console.log('REQUEST:', request.method(), request.url())
  );
  
  // Log responses
  page.on('response', response =>
    console.log('RESPONSE:', response.status(), response.url())
  );
  
  await page.goto('/');
});
```

---

## 15. Performance Testing & Monitoring

### 15.1 Web Vitals (LCP, FID, CLS) Measurement

```typescript
test('measure web vitals', async ({ page }) => {
  await page.goto('/');
  
  // Measure Core Web Vitals
  const webVitals = await page.evaluate(() => {
    return new Promise((resolve) => {
      let LCP, FID, CLS;
      
      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        LCP = entries[entries.length - 1].renderTime || entries[entries.length - 1].loadTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });
      
      // First Input Delay
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        FID = entries[0].processingStart - entries[0].startTime;
      }).observe({ entryTypes: ['first-input'] });
      
      // Cumulative Layout Shift
      new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        CLS = clsValue;
      }).observe({ entryTypes: ['layout-shift'] });
      
      setTimeout(() => {
        resolve({ LCP, FID, CLS });
      }, 5000);
    });
  });
  
  console.log('Web Vitals:', webVitals);
  
  // Assert thresholds
  expect(webVitals.LCP).toBeLessThan(2500); // Good: < 2.5s
  expect(webVitals.FID).toBeLessThan(100);  // Good: < 100ms
  expect(webVitals.CLS).toBeLessThan(0.1);  // Good: < 0.1
});
```

---

### 15.2 Lighthouse Integration for Performance Audits

```bash
npm install --save-dev @playwright/test lighthouse
```

```typescript
import { test } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';
import lighthouse from 'lighthouse';

test('lighthouse audit', async ({ page, context }) => {
  await page.goto('/');
  
  await playAudit({
    page,
    port: 9222,
    thresholds: {
      performance: 90,
      accessibility: 90,
      'best-practices': 90,
      seo: 90,
    },
    reports: {
      formats: {
        html: true,
        json: true,
      },
      directory: 'lighthouse-reports',
      name: `lighthouse-${Date.now()}`,
    },
  });
});
```

---

### 15.3 Load Time, Network Waterfall, Resource Timing

```typescript
test('performance metrics', async ({ page }) => {
  await page.goto('/');
  
  // Get performance metrics
  const metrics = await page.evaluate(() => {
    const perf = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    return {
      // Navigation timing
      dnsLookup: perf.domainLookupEnd - perf.domainLookupStart,
      tcpConnection: perf.connectEnd - perf.connectStart,
      request: perf.responseStart - perf.requestStart,
      response: perf.responseEnd - perf.responseStart,
      domProcessing: perf.domComplete - perf.domInteractive,
      loadComplete: perf.loadEventEnd - perf.loadEventStart,
      
      // Total times
      domContentLoaded: perf.domContentLoadedEventEnd - perf.fetchStart,
      loadTime: perf.loadEventEnd - perf.fetchStart,
      
      // Resource count
      resourceCount: performance.getEntriesByType('resource').length,
    };
  });
  
  console.log('Performance Metrics:', metrics);
  
  // Assert performance budgets
  expect(metrics.loadTime).toBeLessThan(3000); // < 3 seconds
  expect(metrics.domContentLoaded).toBeLessThan(1500); // < 1.5 seconds
});
```

#### Network Waterfall

```typescript
test('network waterfall', async ({ page }) => {
  const requests: any[] = [];
  
  page.on('request', request => {
    requests.push({
      url: request.url(),
      method: request.method(),
      resourceType: request.resourceType(),
      startTime: Date.now(),
    });
  });
  
  page.on('response', response => {
    const request = requests.find(r => r.url === response.url());
    if (request) {
      request.endTime = Date.now();
      request.duration = request.endTime - request.startTime;
      request.status = response.status();
      request.size = response.headers()['content-length'];
    }
  });
  
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  // Analyze waterfall
  const slowRequests = requests.filter(r => r.duration > 1000);
  console.log('Slow requests:', slowRequests);
  
  expect(slowRequests.length).toBe(0);
});
```

---

### 15.4 Throttling Network & CPU for Realistic Conditions

```typescript
// playwright.config.ts
import { devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'slow-3g',
      use: {
        ...devices['Desktop Chrome'],
        // Simulate slow 3G
        offline: false,
        downloadThroughput: (50 * 1024) / 8,  // 50 Kbps
        uploadThroughput: (50 * 1024) / 8,    // 50 Kbps
        latency: 2000,                         // 2 seconds
      },
    },
  ],
});
```

```typescript
// CPU throttling via CDP
test('CPU throttling', async ({ page, context }) => {
  const client = await context.newCDPSession(page);
  
  // Throttle CPU 4x slowdown
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  
  await page.goto('/');
  
  // Test under CPU constraint
  const startTime = Date.now();
  await page.click('#heavy-computation');
  await page.waitForSelector('.result');
  const duration = Date.now() - startTime;
  
  console.log('Computation time with throttling:', duration);
  
  // Disable throttling
  await client.send('Emulation.setCPUThrottlingRate', { rate: 1 });
});
```

---

## 16. Security Testing with Playwright

### 16.1 XSS Detection & Prevention Testing

```typescript
test('XSS vulnerability detection', async ({ page }) => {
  await page.goto('/search');
  
  // Test for reflected XSS
  const xssPayload = '<script>alert("XSS")</script>';
  await page.fill('#search-input', xssPayload);
  await page.click('#search-button');
  
  // Verify XSS is NOT executed (should be sanitized)
  const content = await page.content();
  expect(content).not.toContain('<script>alert("XSS")</script>');
  expect(content).toContain('&lt;script&gt;'); // Should be HTML-encoded
  
  // Check if alert was triggered (should not happen)
  page.on('dialog', dialog => {
    test.fail(); // Test should fail if alert appears
    dialog.dismiss();
  });
});

// Test DOM-based XSS
test('DOM XSS prevention', async ({ page }) => {
  const xssPayloads = [
    '<img src=x onerror=alert(1)>',
    '<svg onload=alert(1)>',
    'javascript:alert(1)',
    '<iframe src="javascript:alert(1)">',
    '<body onload=alert(1)>',
  ];
  
  for (const payload of xssPayloads) {
    await page.goto(`/profile?name=${encodeURIComponent(payload)}`);
    
    // Verify payload is sanitized
    const dangerousElements = await page.locator('script, iframe').count();
    expect(dangerousElements).toBe(0);
    
    // Check for inline event handlers
    const onloadElements = await page.locator('[onload], [onerror], [onclick]').count();
    expect(onloadElements).toBe(0);
  }
});
```

#### Content Security Policy (CSP) Testing

```typescript
test('CSP headers validation', async ({ page }) => {
  const response = await page.goto('/');
  const cspHeader = response?.headers()['content-security-policy'];
  
  expect(cspHeader).toBeDefined();
  expect(cspHeader).toContain("default-src 'self'");
  expect(cspHeader).toContain("script-src 'self'");
  expect(cspHeader).not.toContain("'unsafe-inline'");
  expect(cspHeader).not.toContain("'unsafe-eval'");
});
```

---

### 16.2 SQL Injection, CSRF Token Validation

#### SQL Injection Testing

```typescript
test('SQL injection prevention', async ({ request }) => {
  const sqlPayloads = [
    "' OR '1'='1",
    "'; DROP TABLE users; --",
    "' UNION SELECT * FROM users --",
    "admin'--",
    "' OR 1=1--",
  ];
  
  for (const payload of sqlPayloads) {
    const response = await request.post('/api/login', {
      data: {
        username: payload,
        password: 'password',
      },
    });
    
    // Should return 401 (Unauthorized) or 400 (Bad Request), not 200
    expect(response.status()).not.toBe(200);
    
    // Check response doesn't leak database errors
    const body = await response.text();
    expect(body).not.toMatch(/SQL|syntax|mysql|postgres|database error/i);
  }
});
```

#### CSRF Token Validation

```typescript
test('CSRF token validation', async ({ page, context }) => {
  await page.goto('/form');
  
  // Get CSRF token from page
  const csrfToken = await page.locator('input[name="_csrf"]').inputValue();
  expect(csrfToken).toBeTruthy();
  expect(csrfToken.length).toBeGreaterThan(20);
  
  // Submit form with valid token - should succeed
  await page.fill('#email', 'user@example.com');
  await page.click('#submit');
  await expect(page.locator('.success-message')).toBeVisible();
  
  // Attempt to submit without CSRF token - should fail
  await page.goto('/form');
  await page.evaluate(() => {
    const csrfInput = document.querySelector('input[name="_csrf"]');
    if (csrfInput) csrfInput.remove();
  });
  
  await page.fill('#email', 'user@example.com');
  await page.click('#submit');
  await expect(page.locator('.error-message')).toContainText(/CSRF|forbidden|invalid token/i);
});

// Test CSRF token reuse protection
test('CSRF token should be single-use', async ({ page }) => {
  await page.goto('/form');
  const token = await page.locator('input[name="_csrf"]').inputValue();
  
  // First submission - should succeed
  await page.fill('#email', 'user1@example.com');
  await page.click('#submit');
  await expect(page.locator('.success-message')).toBeVisible();
  
  // Second submission with same token - should fail
  await page.goto('/form');
  await page.evaluate((oldToken) => {
    const csrfInput = document.querySelector('input[name="_csrf"]') as HTMLInputElement;
    if (csrfInput) csrfInput.value = oldToken;
  }, token);
  
  await page.fill('#email', 'user2@example.com');
  await page.click('#submit');
  await expect(page.locator('.error-message')).toBeVisible();
});
```

---

### 16.3 Authentication & Authorization Testing

```typescript
// Test authentication flows
test.describe('Authentication Security', () => {
  test('password requirements', async ({ page }) => {
    await page.goto('/register');
    
    const weakPasswords = ['123', 'password', 'abc123', '11111111'];
    
    for (const password of weakPasswords) {
      await page.fill('#password', password);
      await page.click('#submit');
      
      await expect(page.locator('.password-error')).toContainText(
        /weak|strong|complexity|requirements/i
      );
    }
    
    // Strong password should be accepted
    await page.fill('#password', 'StrongP@ssw0rd!2024');
    await page.click('#submit');
    await expect(page.locator('.password-error')).not.toBeVisible();
  });
  
  test('account lockout after failed attempts', async ({ page }) => {
    await page.goto('/login');
    
    // Attempt 5 failed logins
    for (let i = 0; i < 5; i++) {
      await page.fill('#email', 'user@example.com');
      await page.fill('#password', 'wrongpassword');
      await page.click('#submit');
    }
    
    // 6th attempt should show lockout message
    await page.fill('#email', 'user@example.com');
    await page.fill('#password', 'wrongpassword');
    await page.click('#submit');
    
    await expect(page.locator('.error-message')).toContainText(/locked|too many attempts/i);
  });
});

// Test authorization & access control
test.describe('Authorization Testing', () => {
  test('unauthorized access prevention', async ({ page, request }) => {
    // Create regular user token
    const loginResponse = await request.post('/api/login', {
      data: { email: 'user@example.com', password: 'password123' },
    });
    const { token } = await loginResponse.json();
    
    // Attempt to access admin endpoint
    const adminResponse = await request.get('/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    expect(adminResponse.status()).toBe(403); // Forbidden
  });
  
  test('role-based access control', async ({ page }) => {
    // Login as regular user
    await page.goto('/login');
    await page.fill('#email', 'user@example.com');
    await page.fill('#password', 'password123');
    await page.click('#submit');
    
    // Navigate to admin panel - should be denied
    await page.goto('/admin');
    await expect(page).toHaveURL(/access-denied|403|unauthorized/);
    await expect(page.locator('.error-message')).toContainText(/permission|access denied/i);
  });
});
```

---

### 16.4 Secrets Management (env vars, .gitignore)

```typescript
// .env.example (commit this)
/*
API_KEY=your_api_key_here
DATABASE_URL=your_database_url
AUTH_SECRET=your_secret_here
*/

// .env (DON'T commit - add to .gitignore)
/*
API_KEY=actual_production_key
DATABASE_URL=postgresql://user:pass@localhost:5432/db
AUTH_SECRET=super_secret_key_123
*/

// playwright.config.ts
import dotenv from 'dotenv';
import path from 'path';

// Load environment-specific .env file
dotenv.config({ 
  path: path.resolve(__dirname, `.env.${process.env.NODE_ENV || 'test'}`) 
});

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL,
    extraHTTPHeaders: {
      'Authorization': `Bearer ${process.env.API_TOKEN}`,
    },
  },
});

// Validate required environment variables
const requiredEnvVars = ['BASE_URL', 'API_TOKEN', 'DATABASE_URL'];
for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
}
```

#### Secrets in CI/CD

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests
on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        env:
          BASE_URL: ${{ secrets.BASE_URL }}
          API_TOKEN: ${{ secrets.API_TOKEN }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: npx playwright test
```

#### Vault Integration Example

```typescript
// helpers/secrets.ts
import axios from 'axios';

export async function getSecretFromVault(secretPath: string): Promise<string> {
  const vaultUrl = process.env.VAULT_URL;
  const vaultToken = process.env.VAULT_TOKEN;
  
  const response = await axios.get(`${vaultUrl}/v1/secret/data/${secretPath}`, {
    headers: { 'X-Vault-Token': vaultToken },
  });
  
  return response.data.data.data.value;
}

// Usage in tests
test('use secret from vault', async ({ request }) => {
  const apiKey = await getSecretFromVault('playwright/api-key');
  
  const response = await request.get('/api/protected', {
    headers: { 'X-API-Key': apiKey },
  });
  
  expect(response.ok()).toBeTruthy();
});
```

---

## 17. CI/CD: Jenkins Integration (Deep Dive)

### 17.1 Jenkins Pipeline for Playwright

```groovy
// Jenkinsfile
pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.40.0-focal'
            args '-u root:root'
        }
    }
    
    environment {
        BASE_URL = credentials('playwright-base-url')
        API_TOKEN = credentials('playwright-api-token')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Run Tests') {
            steps {
                sh '''
                    npx playwright test --reporter=html,junit
                '''
            }
        }
        
        stage('Publish Results') {
            steps {
                junit 'results.xml'
                publishHTML([
                    reportDir: 'playwright-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright Test Report',
                    keepAll: true,
                    alwaysLinkToLastBuild: true
                ])
            }
        }
        
        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        failure {
            emailext(
                subject: "Pipeline Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "Check console output at ${env.BUILD_URL}",
                to: 'team@example.com'
            )
        }
    }
}
```

#### Parallel Execution in Jenkins

```groovy
pipeline {
    agent none
    
    stages {
        stage('Test') {
            parallel {
                stage('Chrome') {
                    agent { label 'linux' }
                    steps {
                        sh 'npx playwright test --project=chromium'
                    }
                }
                stage('Firefox') {
                    agent { label 'linux' }
                    steps {
                        sh 'npx playwright test --project=firefox'
                    }
                }
                stage('WebKit') {
                    agent { label 'linux' }
                    steps {
                        sh 'npx playwright test --project=webkit'
                    }
                }
                stage('Mobile Chrome') {
                    agent { label 'linux' }
                    steps {
                        sh 'npx playwright test --project=mobile-chrome'
                    }
                }
            }
        }
    }
}
```

---

### 17.2 Triggered Runs, Scheduled Runs, Matrix Builds

#### Scheduled Runs

```groovy
pipeline {
    agent any
    
    triggers {
        // Run every night at 2 AM
        cron('0 2 * * *')
        
        // Run every weekday at 6 AM
        cron('0 6 * * 1-5')
        
        // Trigger on SCM changes
        pollSCM('H/15 * * * *') // Poll every 15 minutes
    }
    
    stages {
        stage('Nightly Tests') {
            steps {
                sh 'npx playwright test --grep @nightly'
            }
        }
    }
}
```

#### Matrix Builds

```groovy
pipeline {
    agent none
    
    stages {
        stage('Test Matrix') {
            matrix {
                axes {
                    axis {
                        name 'BROWSER'
                        values 'chromium', 'firefox', 'webkit'
                    }
                    axis {
                        name 'ENVIRONMENT'
                        values 'dev', 'staging'
                    }
                }
                
                agent { label 'linux' }
                
                stages {
                    stage('Run Tests') {
                        steps {
                            sh """
                                export TEST_ENV=${ENVIRONMENT}
                                npx playwright test --project=${BROWSER}
                            """
                        }
                    }
                }
            }
        }
    }
}
```

---

### 17.3 Publishing HTML Reports, JUnit XML to Jenkins

```groovy
pipeline {
    agent any
    
    stages {
        stage('Test') {
            steps {
                sh 'npx playwright test --reporter=junit,html'
            }
        }
    }
    
    post {
        always {
            // Publish JUnit test results
            junit testResults: 'results.xml', allowEmptyResults: true
            
            // Publish HTML report
            publishHTML([
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report',
                keepAll: true,
                alwaysLinkToLastBuild: true,
                allowMissing: false
            ])
            
            // Archive screenshots and videos
            archiveArtifacts artifacts: 'test-results/**/*.{png,webm}', allowEmptyArchive: true
        }
        
        success {
            echo 'All tests passed!'
        }
        
        failure {
            echo 'Tests failed!'
            
            // Send Slack notification
            slackSend(
                color: 'danger',
                message: "Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}\n${env.BUILD_URL}"
            )
        }
    }
}
```

---

### 17.4 Handling Flakiness in CI (Retry Logic, Quarantine)

```groovy
pipeline {
    agent any
    
    environment {
        RETRIES = '2'
        WORKERS = '2'
    }
    
    stages {
        stage('Stable Tests') {
            steps {
                script {
                    try {
                        sh """
                            npx playwright test \
                                --grep-invert @quarantine \
                                --retries=${RETRIES} \
                                --workers=${WORKERS}
                        """
                    } catch (Exception e) {
                        currentBuild.result = 'UNSTABLE'
                        error("Stable tests failed")
                    }
                }
            }
        }
        
        stage('Quarantine Tests') {
            when {
                expression { params.RUN_QUARANTINE == true }
            }
            steps {
                script {
                    try {
                        sh """
                            npx playwright test \
                                --grep @quarantine \
                                --retries=3 \
                                --reporter=list
                        """
                    } catch (Exception e) {
                        echo "Quarantine tests failed (non-blocking)"
                    }
                }
            }
        }
        
        stage('Analyze Flakes') {
            steps {
                sh 'node scripts/analyze-flakes.js'
            }
        }
    }
}
```

#### Retry Logic with Custom Script

```javascript
// scripts/run-with-retry.js
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function runWithRetry(command, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const { stdout, stderr } = await execPromise(command);
      console.log(stdout);
      return { success: true, attempt: i + 1 };
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error.message);
      
      if (i === maxRetries - 1) {
        throw error;
      }
      
      // Exponential backoff
      const delay = Math.pow(2, i) * 1000;
      console.log(`Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

runWithRetry('npx playwright test', 3)
  .then(result => {
    console.log(`Tests passed on attempt ${result.attempt}`);
    process.exit(0);
  })
  .catch(error => {
    console.error('All retry attempts failed');
    process.exit(1);
  });
```

---

## 18. Dockerized Playwright Environments

### 18.1 Official Playwright Docker Images

```dockerfile
# Use official Playwright image
FROM mcr.microsoft.com/playwright:v1.40.0-focal

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy test files
COPY . .

# Run tests
CMD ["npx", "playwright", "test"]
```

```bash
# Build image
docker build -t playwright-tests .

# Run tests
docker run --rm playwright-tests

# Run with environment variables
docker run --rm \
  -e BASE_URL=https://example.com \
  -e API_TOKEN=secret \
  playwright-tests

# Run with volume mount (for local development)
docker run --rm \
  -v $(pwd):/app \
  -w /app \
  mcr.microsoft.com/playwright:v1.40.0-focal \
  npx playwright test
```

---

### 18.2 Multi-Stage Builds for Efficient Images

```dockerfile
# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 3: Test runner
FROM mcr.microsoft.com/playwright:v1.40.0-focal AS runner
WORKDIR /app

# Copy only necessary files
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/tests ./tests
COPY --from=builder /app/playwright.config.ts ./

# Create non-root user
RUN groupadd -r pwuser && useradd -r -g pwuser pwuser
RUN chown -R pwuser:pwuser /app
USER pwuser

# Run tests
CMD ["npx", "playwright", "test"]
```

---

### 18.3 docker-compose for Test Orchestration

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Web application
  web:
    build: ./app
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=test
      - DATABASE_URL=postgresql://postgres:password@db:5432/testdb
    depends_on:
      - db
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Database
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=testdb
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql

  # Playwright tests
  playwright:
    build:
      context: .
      dockerfile: Dockerfile.playwright
    environment:
      - BASE_URL=http://web:3000
      - DATABASE_URL=postgresql://postgres:password@db:5432/testdb
    depends_on:
      web:
        condition: service_healthy
    volumes:
      - ./test-results:/app/test-results
      - ./playwright-report:/app/playwright-report
    command: npx playwright test

  # Separate service for different test suites
  playwright-smoke:
    extends: playwright
    command: npx playwright test --grep @smoke

  playwright-regression:
    extends: playwright
    command: npx playwright test --grep-invert @smoke
```

```bash
# Run all services
docker-compose up --abort-on-container-exit

# Run specific test suite
docker-compose up playwright-smoke

# Run tests and remove containers
docker-compose up --abort-on-container-exit --remove-orphans

# Clean up
docker-compose down -v
```

---

### 18.4 CI Integration with Docker (Jenkins, GitLab CI)

#### Jenkins with Docker

```groovy
pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.40.0-focal'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }
    
    stages {
        stage('Test') {
            steps {
                sh 'npx playwright test'
            }
        }
    }
}
```

#### GitLab CI

```yaml
# .gitlab-ci.yml
image: mcr.microsoft.com/playwright:v1.40.0-focal

stages:
  - test
  - report

variables:
  BASE_URL: "https://staging.example.com"

before_script:
  - npm ci

test:chromium:
  stage: test
  script:
    - npx playwright test --project=chromium
  artifacts:
    when: always
    paths:
      - playwright-report/
      - test-results/
    expire_in: 30 days

test:firefox:
  stage: test
  script:
    - npx playwright test --project=firefox
  artifacts:
    when: always
    paths:
      - playwright-report/
      - test-results/

test:webkit:
  stage: test
  script:
    - npx playwright test --project=webkit
  artifacts:
    when: always
    paths:
      - playwright-report/
      - test-results/

pages:
  stage: report
  dependencies:
    - test:chromium
  script:
    - mkdir public
    - cp -r playwright-report/* public/
  artifacts:
    paths:
      - public
  only:
    - main
```

---

## 19. Advanced Patterns & Real-World Scenarios

### 19.1 Component Testing (React, Vue, Svelte)

#### React Component Testing

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/experimental-ct-react';

export default defineConfig({
  testDir: './tests/components',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
```

```typescript
// tests/components/Button.spec.tsx
import { test, expect } from '@playwright/experimental-ct-react';
import Button from '../../src/components/Button';

test('button renders correctly', async ({ mount }) => {
  const component = await mount(<Button>Click me</Button>);
  await expect(component).toContainText('Click me');
});

test('button handles click events', async ({ mount }) => {
  let clicked = false;
  const component = await mount(
    <Button onClick={() => { clicked = true; }}>
      Click me
    </Button>
  );
  
  await component.click();
  expect(clicked).toBe(true);
});

test('button with different variants', async ({ mount }) => {
  const primary = await mount(<Button variant="primary">Primary</Button>);
  await expect(primary).toHaveClass(/primary/);
  
  const secondary = await mount(<Button variant="secondary">Secondary</Button>);
  await expect(secondary).toHaveClass(/secondary/);
});
```

#### Vue Component Testing

```typescript
// tests/components/Counter.spec.ts
import { test, expect } from '@playwright/experimental-ct-vue';
import Counter from '../../src/components/Counter.vue';

test('counter increments', async ({ mount }) => {
  const component = await mount(Counter, {
    props: { initialCount: 0 },
  });
  
  await expect(component.locator('.count')).toHaveText('0');
  await component.locator('button.increment').click();
  await expect(component.locator('.count')).toHaveText('1');
});
```

---

### 19.2 Visual Regression with Percy, Applitools, Chromatic

#### Percy Integration

```bash
npm install --save-dev @percy/cli @percy/playwright
```

```typescript
import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test('visual regression with Percy', async ({ page }) => {
  await page.goto('/');
  
  // Take Percy snapshot
  await percySnapshot(page, 'Homepage');
  
  // Navigate and snapshot other pages
  await page.click('a[href="/products"]');
  await percySnapshot(page, 'Products Page');
  
  // Snapshot specific element
  await page.goto('/dashboard');
  await percySnapshot(page, 'Dashboard - Sidebar', {
    widths: [768, 1024, 1280],
    percyCSS: '.sidebar { display: block !important; }',
  });
});
```

#### Applitools Integration

```bash
npm install --save-dev @applitools/eyes-playwright
```

```typescript
import { test } from '@playwright/test';
import { Eyes, Target } from '@applitools/eyes-playwright';

test('visual testing with Applitools', async ({ page }) => {
  const eyes = new Eyes();
  
  try {
    await eyes.open(page, 'My App', 'Homepage Test');
    
    await page.goto('/');
    await eyes.check('Homepage', Target.window().fully());
    
    await page.click('#menu-button');
    await eyes.check('Homepage with Menu', Target.window().fully());
    
    const results = await eyes.close();
    console.log('Test results:', results);
  } finally {
    await eyes.abort();
  }
});
```

---

### 19.3 Multi-Domain/Multi-Tab Workflows

```typescript
test('multi-tab workflow', async ({ context }) => {
  // Create first page
  const page1 = await context.newPage();
  await page1.goto('https://example.com');
  
  // Create second page
  const page2 = await context.newPage();
  await page2.goto('https://another-site.com');
  
  // Interact with both pages
  await page1.fill('#search', 'playwright');
  await page2.fill('#email', 'user@example.com');
  
  // Wait for new page to open from link
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page1.click('a[target="_blank"]'),
  ]);
  
  await newPage.waitForLoadState();
  await expect(newPage).toHaveURL(/external-site/);
});

// Multi-domain authentication
test('multi-domain authentication', async ({ context }) => {
  // Login on main domain
  const mainPage = await context.newPage();
  await mainPage.goto('https://main.example.com/login');
  await mainPage.fill('#email', 'user@example.com');
  await mainPage.fill('#password', 'password123');
  await mainPage.click('#submit');
  
  // Navigate to subdomain (shares auth)
  const subdomainPage = await context.newPage();
  await subdomainPage.goto('https://app.example.com/dashboard');
  await expect(subdomainPage.locator('.user-name')).toBeVisible();
  
  // Navigate to partner domain (separate auth)
  const partnerPage = await context.newPage();
  await partnerPage.goto('https://partner.example.com');
  // Need to login again or use SSO
});
```

---

### 19.4 Accessibility (a11y) Testing with axe-core

```bash
npm install --save-dev @axe-core/playwright
```

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage accessibility', async ({ page }) => {
  await page.goto('/');
  
  const accessibilityScanResults = await new AxeBuilder({ page })
    .analyze();
  
  expect(accessibilityScanResults.violations).toEqual([]);
});

// Test specific components
test('form accessibility', async ({ page }) => {
  await page.goto('/contact');
  
  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('#contact-form')
    .analyze();
  
  expect(accessibilityScanResults.violations).toEqual([]);
});

// Test with specific rules
test('color contrast', async ({ page }) => {
  await page.goto('/');
  
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  
  expect(accessibilityScanResults.violations).toEqual([]);
});

// Detailed violation reporting
test('accessibility with detailed report', async ({ page }) => {
  await page.goto('/');
  
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  
  if (accessibilityScanResults.violations.length > 0) {
    console.log('Accessibility Violations:');
    accessibilityScanResults.violations.forEach(violation => {
      console.log(`- ${violation.id}: ${violation.description}`);
      console.log(`  Impact: ${violation.impact}`);
      console.log(`  Help: ${violation.helpUrl}`);
      violation.nodes.forEach(node => {
        console.log(`  Element: ${node.html}`);
      });
    });
  }
  
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

---

## 20. AI Agents & Playwright (ChatGPT, LangChain)

### 20.1 Using Playwright as Tool for AI Agents

```typescript
// ai-agent/playwright-tool.ts
import { chromium, Page } from 'playwright';

export class PlaywrightTool {
  private page: Page | null = null;
  
  async initialize() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    this.page = await context.newPage();
  }
  
  async navigate(url: string) {
    if (!this.page) throw new Error('Browser not initialized');
    await this.page.goto(url);
    return `Navigated to ${url}`;
  }
  
  async click(selector: string) {
    if (!this.page) throw new Error('Browser not initialized');
    await this.page.click(selector);
    return `Clicked on ${selector}`;
  }
  
  async fill(selector: string, text: string) {
    if (!this.page) throw new Error('Browser not initialized');
    await this.page.fill(selector, text);
    return `Filled ${selector} with ${text}`;
  }
  
  async getText(selector: string) {
    if (!this.page) throw new Error('Browser not initialized');
    const text = await this.page.locator(selector).textContent();
    return text || '';
  }
  
  async screenshot() {
    if (!this.page) throw new Error('Browser not initialized');
    const buffer = await this.page.screenshot();
    return buffer.toString('base64');
  }
  
  async getPageContent() {
    if (!this.page) throw new Error('Browser not initialized');
    const content = await this.page.content();
    return content;
  }
}
```

---

### 20.2 LangChain Integration for Autonomous Testing

```typescript
// ai-agent/langchain-playwright.ts
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { DynamicStructuredTool } from 'langchain/tools';
import { PlaywrightTool } from './playwright-tool';

const playwrightTool = new PlaywrightTool();
await playwrightTool.initialize();

// Define tools for the AI agent
const tools = [
  new DynamicStructuredTool({
    name: 'navigate',
    description: 'Navigate to a URL',
    schema: z.object({ url: z.string() }),
    func: async ({ url }) => await playwrightTool.navigate(url),
  }),
  
  new DynamicStructuredTool({
    name: 'click_element',
    description: 'Click on an element using CSS selector',
    schema: z.object({ selector: z.string() }),
    func: async ({ selector }) => await playwrightTool.click(selector),
  }),
  
  new DynamicStructuredTool({
    name: 'fill_input',
    description: 'Fill an input field with text',
    schema: z.object({ 
      selector: z.string(),
      text: z.string(),
    }),
    func: async ({ selector, text }) => await playwrightTool.fill(selector, text),
  }),
  
  new DynamicStructuredTool({
    name: 'get_text',
    description: 'Get text content from an element',
    schema: z.object({ selector: z.string() }),
    func: async ({ selector }) => await playwrightTool.getText(selector),
  }),
];

// Initialize AI agent
const model = new ChatOpenAI({
  temperature: 0,
  modelName: 'gpt-4',
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const executor = await initializeAgentExecutorWithOptions(tools, model, {
  agentType: 'openai-functions',
  verbose: true,
});

// Use AI to perform testing tasks
const result = await executor.call({
  input: `
    Go to https://example.com
    Search for "playwright testing"
    Click on the first result
    Get the page title
  `,
});

console.log(result.output);
```

---

### 20.3 Self-Healing Locators with AI

```typescript
// ai-agent/self-healing-locator.ts
import { Page } from 'playwright';
import { ChatOpenAI } from 'langchain/chat_models/openai';

export class SelfHealingLocator {
  private model: ChatOpenAI;
  
  constructor() {
    this.model = new ChatOpenAI({
      temperature: 0,
      modelName: 'gpt-4',
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
  }
  
  async findElement(
    page: Page, 
    originalSelector: string, 
    description: string
  ) {
    try {
      // Try original selector
      await page.locator(originalSelector).waitFor({ timeout: 5000 });
      return originalSelector;
    } catch (error) {
      console.log(`Original selector failed: ${originalSelector}`);
      console.log('Attempting self-healing...');
      
      // Get page content
      const pageContent = await page.content();
      
      // Ask AI to find new selector
      const prompt = `
        The selector "${originalSelector}" no longer works.
        I need to find an element that: ${description}
        
        Here is the current page HTML (truncated):
        ${pageContent.substring(0, 5000)}
        
        Suggest 3 alternative CSS selectors that might work, in order of confidence.
        Return only the selectors, one per line.
      `;
      
      const response = await this.model.call([{ role: 'user', content: prompt }]);
      const suggestedSelectors = response.content.split('\n').filter(s => s.trim());
      
      // Try suggested selectors
      for (const selector of suggestedSelectors) {
        try {
          await page.locator(selector).waitFor({ timeout: 2000 });
          console.log(`Self-healing successful! New selector: ${selector}`);
          return selector;
        } catch (e) {
          console.log(`Suggested selector failed: ${selector}`);
        }
      }
      
      throw new Error('Self-healing failed - could not find element');
    }
  }
}

// Usage
test('self-healing test', async ({ page }) => {
  const healer = new SelfHealingLocator();
  
  await page.goto('/');
  
  const loginButtonSelector = await healer.findElement(
    page,
    '#login-btn',  // Original selector
    'a button that says "Login" or "Sign In"'  // Description
  );
  
  await page.click(loginButtonSelector);
});
```

---

### 20.4 Automated Test Generation from User Stories

```typescript
// ai-agent/test-generator.ts
import { ChatOpenAI } from 'langchain/chat_models/openai';
import fs from 'fs';

export class TestGenerator {
  private model: ChatOpenAI;
  
  constructor() {
    this.model = new ChatOpenAI({
      temperature: 0.3,
      modelName: 'gpt-4',
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
  }
  
  async generateTests(userStory: string, pageUrl: string) {
    const prompt = `
      Generate Playwright test code for the following user story:
      
      ${userStory}
      
      Page URL: ${pageUrl}
      
      Requirements:
      1. Use TypeScript
      2. Use @playwright/test framework
      3. Include proper assertions
      4. Follow best practices (auto-waiting, etc.)
      5. Add comments for clarity
      6. Generate at least 3 test cases: happy path, edge case, error case
      
      Return only the test code, no explanations.
    `;
    
    const response = await this.model.call([{ role: 'user', content: prompt }]);
    return response.content;
  }
  
  async saveTests(testCode: string, filename: string) {
    const testPath = `tests/generated/${filename}`;
    fs.writeFileSync(testPath, testCode);
    console.log(`Tests saved to ${testPath}`);
  }
}

// Usage
const generator = new TestGenerator();

const userStory = `
  As a user
  I want to search for products
  So that I can find items I'm interested in
  
  Acceptance Criteria:
  - User can enter search term
  - Results are displayed after search
  - User can filter results by category
  - User can sort results by price
`;

const testCode = await generator.generateTests(userStory, 'https://example.com/products');
await generator.saveTests(testCode, 'product-search.spec.ts');
```

---

## 21. Playwright + Other Tools (BDD, Cucumber, Jest)

### 21.1 Playwright with Cucumber (BDD)

#### What is BDD (Behavior-Driven Development)?

**BDD** is a collaborative approach where business stakeholders, developers, and QA write test scenarios in plain English using the **Gherkin** syntax. This creates living documentation that serves as both requirements and automated tests.

#### Why Integrate Playwright with Cucumber?

**Benefits:**
- ✅ **Business Readability**: Non-technical stakeholders can read/write scenarios
- ✅ **Living Documentation**: Tests serve as up-to-date requirements
- ✅ **Collaboration**: Bridges gap between business, dev, and QA
- ✅ **Reusable Steps**: Step definitions can be reused across scenarios
- ✅ **Data-Driven Testing**: Scenario Outlines with Examples tables

**Drawbacks:**
- ❌ **Extra Abstraction Layer**: Adds complexity
- ❌ **Maintenance Overhead**: Both feature files and step definitions
- ❌ **Learning Curve**: Team needs to learn Gherkin syntax
- ❌ **Slower Execution**: Extra layer between test and implementation

#### When to Use Cucumber + Playwright?

| Use When | Don't Use When |
|----------|----------------|
| Business stakeholders write scenarios | Only technical team involved |
| Need living documentation | Tests change frequently |
| Multiple teams collaborating | Small team, simple project |
| Regulatory compliance requires readable specs | Performance is critical |

#### Installation & Setup

```bash
# Install Cucumber and Playwright integration
npm install --save-dev @cucumber/cucumber @cucumber/playwright
npm install --save-dev ts-node typescript @types/node
```

#### Gherkin Syntax Overview

**Gherkin** uses a specific syntax with keywords:

| Keyword | Purpose | Example |
|---------|---------|---------|
| **Feature** | High-level description | `Feature: User Login` |
| **Scenario** | Individual test case | `Scenario: Successful login` |
| **Given** | Initial context/precondition | `Given I am on the login page` |
| **When** | Action/event trigger | `When I click the login button` |
| **Then** | Expected outcome | `Then I should see a dashboard` |
| **And**/**But** | Additional steps | `And I enter email "test@example.com"` |
| **Scenario Outline** | Parameterized test | Uses `<placeholders>` with Examples |
| **Examples** | Data table for Scenario Outline | Rows of test data |

#### Feature File Example with Explanations

```gherkin
# features/login.feature

# Feature: High-level business functionality
Feature: User Login
  As a user                    # User story format
  I want to login to the application
  So that I can access my dashboard

  # Scenario: Individual test case
  Scenario: Successful login
    Given I am on the login page                # Precondition
    When I enter email "user@example.com"      # Actions
    And I enter password "password123"
    And I click the login button
    Then I should be redirected to the dashboard  # Expected outcome
    And I should see a welcome message

  Scenario: Failed login with invalid credentials
    Given I am on the login page
    When I enter email "invalid@example.com"
    And I enter password "wrongpassword"
    And I click the login button
    Then I should see an error message "Invalid credentials"
    And I should remain on the login page

  # Scenario Outline: Data-driven testing with multiple data sets
  Scenario Outline: Login with different user roles
    Given I am on the login page
    When I enter email "<email>"              # Placeholders from Examples
    And I enter password "<password>"
    And I click the login button
    Then I should see "<role>" dashboard

    # Examples: Data table with test variations
    Examples:
      | email               | password  | role  |
      | admin@example.com   | admin123  | Admin |
      | user@example.com    | user123   | User  |
      | guest@example.com   | guest123  | Guest |
```

#### Step Definitions Implementation

**Step definitions** are the glue code that connects Gherkin steps to Playwright automation code.

```typescript
// features/step-definitions/login.steps.ts
import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { chromium, Page, Browser, BrowserContext } from 'playwright';
import { expect } from '@playwright/test';

// Shared variables across steps
let browser: Browser;
let context: BrowserContext;
let page: Page;

// Before hook: Runs before each scenario
Before(async function() {
  browser = await chromium.launch({ headless: true });
  context = await browser.newContext();
  page = await context.newPage();
});

// After hook: Runs after each scenario (cleanup)
After(async function() {
  await page.close();
  await context.close();
  await browser.close();
});

// Given step: Set up preconditions
Given('I am on the login page', async function() {
  await page.goto('https://example.com/login');
});

// When steps: Perform actions
When('I enter email {string}', async function(email: string) {
  await page.fill('#email', email);
});

When('I enter password {string}', async function(password: string) {
  await page.fill('#password', password);
});

When('I click the login button', async function() {
  await page.click('#login-button');
});

// Then steps: Verify expected outcomes
Then('I should be redirected to the dashboard', async function() {
  await expect(page).toHaveURL(/dashboard/);
});

Then('I should see a welcome message', async function() {
  await expect(page.locator('.welcome-message')).toBeVisible();
});

Then('I should see an error message {string}', async function(message: string) {
  await expect(page.locator('.error-message')).toContainText(message);
});

Then('I should remain on the login page', async function() {
  await expect(page).toHaveURL(/login/);
});

Then('I should see {string} dashboard', async function(role: string) {
  await expect(page.locator('.dashboard-title')).toContainText(role);
});
```

#### Cucumber Configuration

```javascript
// cucumber.js - Cucumber configuration file
module.exports = {
  default: {
    // Where to find step definitions
    require: ['features/step-definitions/**/*.ts'],
    
    // TypeScript support
    requireModule: ['ts-node/register'],
    
    // Report formats
    format: [
      'progress-bar',                    // Console output
      'html:cucumber-report.html',       // HTML report
      'json:cucumber-report.json',       // JSON for CI integration
    ],
    
    // Code generation options
    formatOptions: {
      snippetInterface: 'async-await',   // Generate async step definitions
    },
  },
};
```

#### Running Cucumber Tests

```bash
# Run all features
npx cucumber-js

# Run specific feature
npx cucumber-js features/login.feature

# Run with specific tags
npx cucumber-js --tags "@smoke"

# Dry run (validate syntax without executing)
npx cucumber-js --dry-run

# Generate step definition snippets for undefined steps
npx cucumber-js --format snippets
```

#### Best Practices for Cucumber + Playwright

1. **Keep Steps Atomic**
   ```gherkin
   # ❌ Bad: Multiple actions in one step
   When I login with valid credentials and navigate to profile
   
   # ✅ Good: Separate actions
   When I login with valid credentials
   And I navigate to profile
   ```

2. **Use Background for Common Setup**
   ```gherkin
   Feature: User Profile
     
     Background: User is logged in
       Given I am logged in as "user@example.com"
     
     Scenario: Update profile
       When I update my name to "John Doe"
       Then I should see "Profile updated"
   ```

3. **Avoid UI-Specific Language**
   ```gherkin
   # ❌ Bad: Too technical
   When I click the button with id "submit-btn"
   
   # ✅ Good: Business language
   When I submit the form
   ```

4. **Use Tags for Organization**
   ```gherkin
   @smoke @critical
   Scenario: Login with valid credentials
   
   @regression @slow
   Scenario: Password reset flow
   ```

---

### 21.2 Playwright with Jest

#### Why Use Jest with Playwright?

**Jest** is a popular JavaScript testing framework known for its simplicity and great developer experience. Combining it with Playwright provides:

**Benefits:**
- ✅ **Familiar API**: If team already uses Jest for unit tests
- ✅ **Snapshot Testing**: Built-in snapshot capabilities
- ✅ **Mocking**: Powerful mocking utilities
- ✅ **Code Coverage**: Integrated coverage reporting
- ✅ **Watch Mode**: Fast feedback during development

**Drawbacks:**
- ❌ **Less Playwright-Specific**: Missing Playwright Test runner features
- ❌ **Manual Setup**: Need to configure browser management
- ❌ **No Fixtures**: Need to implement fixture pattern manually
- ❌ **Limited Parallelization**: Not as sophisticated as Playwright Test

#### When to Use Jest + Playwright?

| Use When | Use Playwright Test When |
|----------|-------------------------|
| Team already uses Jest extensively | Starting fresh with Playwright |
| Need Jest ecosystem (mocks, snapshots) | Need advanced parallelization |
| Mixing unit + E2E in same framework | Want built-in fixtures and reporters |
| Want unified test commands | Need trace viewer and inspector |

#### Installation & Setup

```bash
# Install Jest and Playwright preset
npm install --save-dev jest jest-playwright-preset playwright expect-playwright
```

#### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  // Use Playwright preset for browser automation
  preset: 'jest-playwright-preset',
  
  // Test file patterns
  testMatch: ['**/tests/**/*.test.js'],
  
  // Timeout for each test
  testTimeout: 30000,
  
  // Additional setup files for custom matchers
  setupFilesAfterEnv: ['expect-playwright'],
  
  // TypeScript support (if using TS)
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};
```

#### Playwright-Specific Configuration

```javascript
// jest-playwright.config.js
module.exports = {
  // Browsers to test against
  browsers: ['chromium', 'firefox', 'webkit'],
  
  // Launch options for browser
  launchOptions: {
    headless: true,
    slowMo: 0,  // Slow down by N ms (useful for debugging)
  },
  
  // Browser context options
  contextOptions: {
    viewport: {
      width: 1280,
      height: 720,
    },
    ignoreHTTPSErrors: true,
  },
  
  // Server configuration (optional)
  serverOptions: {
    command: 'npm run start',
    port: 3000,
    launchTimeout: 60000,
  },
};
```

#### Writing Tests with Jest + Playwright

```javascript
// tests/login.test.js

// Global 'page' object provided by jest-playwright-preset
describe('Login Page', () => {
  
  // beforeAll: Runs once before all tests in describe block
  beforeAll(async () => {
    // Setup code here
  });
  
  // beforeEach: Runs before each test
  beforeEach(async () => {
    await page.goto('https://example.com/login');
  });
  
  it('should display login form elements', async () => {
    // expect-playwright provides custom matchers
    await expect(page).toHaveSelector('#email');
    await expect(page).toHaveSelector('#password');
    await expect(page).toHaveSelector('#login-button');
  });

  it('should login successfully with valid credentials', async () => {
    await page.fill('#email', 'user@example.com');
    await page.fill('#password', 'password123');
    await page.click('#login-button');
    
    // Wait for navigation
    await expect(page).toMatchURL(/dashboard/);
    
    // Verify welcome message
    await expect(page).toHaveText('.welcome-message', 'Welcome back!');
  });
  
  it('should show error with invalid credentials', async () => {
    await page.fill('#email', 'wrong@example.com');
    await page.fill('#password', 'wrongpassword');
    await page.click('#login-button');
    
    await expect(page).toHaveText('.error-message', 'Invalid credentials');
  });
  
  // afterEach: Runs after each test
  afterEach(async () => {
    // Cleanup code here
  });
  
  // afterAll: Runs once after all tests
  afterAll(async () => {
    // Final cleanup
  });
});
```

#### Jest-Specific Features

**1. Snapshot Testing:**
```javascript
it('should match snapshot', async () => {
  await page.goto('/homepage');
  const html = await page.content();
  expect(html).toMatchSnapshot();
});
```

**2. Mocking:**
```javascript
it('should mock API response', async () => {
  await page.route('**/api/users', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([{ id: 1, name: 'Mock User' }]),
    });
  });
  
  await page.goto('/users');
  await expect(page).toHaveText('.user-name', 'Mock User');
});
```

**3. Custom Matchers:**
```javascript
expect.extend({
  async toBeVisibleAndClickable(page, selector) {
    const element = page.locator(selector);
    const isVisible = await element.isVisible();
    const isEnabled = await element.isEnabled();
    
    return {
      pass: isVisible && isEnabled,
      message: () => `Expected ${selector} to be visible and clickable`,
    };
  },
});

// Usage
await expect(page, '#submit-button').toBeVisibleAndClickable();
```

#### Running Jest + Playwright Tests

```bash
# Run all tests
npm test

# Run in watch mode
npm test -- --watch

# Run specific test file
npm test login.test.js

# Run with coverage
npm test -- --coverage

# Run tests matching pattern
npm test -- --testNamePattern="login"

# Run in different browsers
BROWSER=firefox npm test
BROWSER=webkit npm test
```

---

### 21.3 Playwright with Mocha

#### Why Use Mocha with Playwright?

**Mocha** is a flexible testing framework that gives you full control over test structure and assertion libraries.

**Benefits:**
- ✅ **Flexibility**: Choose your own assertion library (Chai, Expect, etc.)
- ✅ **Simplicity**: Minimal API, easy to learn
- ✅ **Async Support**: Excellent async/await support
- ✅ **Rich Ecosystem**: Many plugins and reporters available

**When to Use:**
- Team prefers Mocha's flexibility
- Need specific assertion library (Chai)
- Want simple, unopinionated framework
- Migrating from older Mocha test suites

#### Installation

```bash
npm install --save-dev mocha @playwright/test chai @types/mocha @types/chai
```

#### Mocha Configuration

```javascript
// .mocharc.js
module.exports = {
  // TypeScript support
  require: 'ts-node/register',
  
  // Test file pattern
  spec: 'tests/**/*.spec.ts',
  
  // Timeout for each test
  timeout: 30000,
  
  // Reporter
  reporter: 'spec',
  
  // Async handling
  async: true,
};
```

#### Test Implementation with Mocha

```typescript
// tests/login.spec.ts
import { chromium, Browser, Page, BrowserContext } from 'playwright';
import { expect } from 'chai';

describe('Login Tests', function() {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;

  // before: Runs once before all tests
  before(async function() {
    browser = await chromium.launch({ headless: true });
  });

  // after: Runs once after all tests
  after(async function() {
    await browser.close();
  });

  // beforeEach: Runs before each test
  beforeEach(async function() {
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto('https://example.com/login');
  });

  // afterEach: Runs after each test
  afterEach(async function() {
    await page.close();
    await context.close();
  });

  it('should display login form', async function() {
    const emailInput = await page.locator('#email').isVisible();
    const passwordInput = await page.locator('#password').isVisible();
    const submitButton = await page.locator('#login-button').isVisible();
    
    expect(emailInput).to.be.true;
    expect(passwordInput).to.be.true;
    expect(submitButton).to.be.true;
  });

  it('should login successfully', async function() {
    await page.fill('#email', 'user@example.com');
    await page.fill('#password', 'password123');
    await page.click('#login-button');
    
    await page.waitForURL('**/dashboard');
    expect(page.url()).to.include('dashboard');
  });
  
  it('should show error for invalid credentials', async function() {
    await page.fill('#email', 'invalid@example.com');
    await page.fill('#password', 'wrong');
    await page.click('#login-button');
    
    const errorVisible = await page.locator('.error-message').isVisible();
    expect(errorVisible).to.be.true;
    
    const errorText = await page.locator('.error-message').textContent();
    expect(errorText).to.include('Invalid');
  });
});
```

#### Running Mocha Tests

```bash
# Run all tests
npx mocha

# Run specific test file
npx mocha tests/login.spec.ts

# Run with grep pattern
npx mocha --grep "login"

# Run in watch mode
npx mocha --watch

# Run with different reporter
npx mocha --reporter json
npx mocha --reporter mochawesome
```

---

### 21.4 Combining E2E & Unit Tests in Same Project

#### Project Structure Strategy

A well-organized project separates different test types while sharing common utilities:

```
project-root/
├── src/                          # Application code
│   ├── components/
│   ├── utils/
│   └── services/
├── tests/
│   ├── unit/                     # Unit tests (Jest/Mocha)
│   │   ├── utils.unit.test.ts
│   │   └── services.unit.test.ts
│   ├── integration/              # Integration tests
│   │   └── api.integration.test.ts
│   ├── e2e/                      # E2E tests (Playwright)
│   │   ├── login.e2e.spec.ts
│   │   ├── checkout.e2e.spec.ts
│   │   └── admin.e2e.spec.ts
│   └── shared/                   # Shared test utilities
│       ├── fixtures/
│       ├── helpers/
│       └── test-data/
├── playwright.config.ts          # Playwright configuration
├── jest.config.js                # Jest configuration (for unit tests)
└── package.json
```

#### Configuration for Multiple Test Types

**Playwright Config (E2E Tests):**
```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',             // Only E2E tests
  testMatch: '**/*.e2e.spec.ts',       // Match E2E test files
  
  timeout: 30000,
  retries: process.env.CI ? 2 : 0,
  
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
  ],
});
```

**Jest Config (Unit Tests):**
```javascript
// jest.config.js
module.exports = {
  testMatch: ['**/tests/unit/**/*.unit.test.ts'],  // Only unit tests
  testEnvironment: 'node',                          // Node environment for unit tests
  
  coverageDirectory: 'coverage/unit',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
  
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};
```

#### Package.json Scripts

```json
{
  "scripts": {
    "test": "npm run test:unit && npm run test:e2e",
    
    "test:unit": "jest --config jest.config.js",
    "test:unit:watch": "jest --watch",
    "test:unit:coverage": "jest --coverage",
    
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:ui": "playwright test --ui",
    
    "test:integration": "jest --config jest.integration.config.js",
    
    "test:smoke": "playwright test --grep @smoke",
    "test:regression": "playwright test --grep @regression",
    
    "test:ci": "npm run test:unit -- --ci && npm run test:e2e -- --reporter=junit",
    
    "test:all": "npm run test:unit && npm run test:integration && npm run test:e2e"
  }
}
```

#### Sharing Code Between Test Types

**Shared Test Data:**
```typescript
// tests/shared/test-data/users.ts
export const testUsers = {
  admin: {
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  },
  user: {
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
  },
};

// Use in unit tests
import { testUsers } from '../shared/test-data/users';
test('validate email', () => {
  expect(validateEmail(testUsers.admin.email)).toBe(true);
});

// Use in E2E tests
import { testUsers } from '../shared/test-data/users';
test('login as admin', async ({ page }) => {
  await page.fill('#email', testUsers.admin.email);
  await page.fill('#password', testUsers.admin.password);
});
```

**Shared Utilities:**
```typescript
// tests/shared/helpers/date-utils.ts
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Use in both unit and E2E tests
import { formatDate, addDays } from '../shared/helpers/date-utils';
```

#### Best Practices for Multi-Test Projects

1. **Clear Naming Conventions**
   ```
   login.unit.test.ts       # Unit test
   api.integration.test.ts  # Integration test
   checkout.e2e.spec.ts     # E2E test
   ```

2. **Separate Dependencies**
   ```json
   {
     "devDependencies": {
       "@playwright/test": "^1.40.0",    # E2E
       "jest": "^29.0.0",                 # Unit
       "@types/jest": "^29.0.0",
       "ts-jest": "^29.0.0"
     }
   }
   ```

3. **Independent CI Jobs**
   ```yaml
   jobs:
     unit-tests:
       runs-on: ubuntu-latest
       steps:
         - run: npm run test:unit
     
     e2e-tests:
       runs-on: ubuntu-latest
       steps:
         - run: npm run test:e2e
   ```

4. **Test Pyramid Balance**
   ```
   E2E Tests (10-20 tests)     ← Expensive, slow
   Integration Tests (50 tests) ← Medium cost
   Unit Tests (500+ tests)      ← Cheap, fast
   ```

---

```gherkin
# features/login.feature
Feature: User Login
  As a user
  I want to login to the application
  So that I can access my dashboard

  Scenario: Successful login
    Given I am on the login page
    When I enter email "user@example.com"
    And I enter password "password123"
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see a welcome message

  Scenario: Failed login with invalid credentials
    Given I am on the login page
    When I enter email "invalid@example.com"
    And I enter password "wrongpassword"
    And I click the login button
    Then I should see an error message "Invalid credentials"
    And I should remain on the login page

  Scenario Outline: Login with different user roles
    Given I am on the login page
    When I enter email "<email>"
    And I enter password "<password>"
    And I click the login button
    Then I should see "<role>" dashboard

    Examples:
      | email               | password  | role  |
      | admin@example.com   | admin123  | Admin |
      | user@example.com    | user123   | User  |
      | guest@example.com   | guest123  | Guest |
```

#### Step Definitions

```typescript
// features/step-definitions/login.steps.ts
import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { chromium, Page, Browser, BrowserContext } from 'playwright';
import { expect } from '@playwright/test';

let browser: Browser;
let context: BrowserContext;
let page: Page;

Before(async function() {
  browser = await chromium.launch({ headless: true });
  context = await browser.newContext();
  page = await context.newPage();
});

After(async function() {
  await page.close();
  await context.close();
  await browser.close();
});

Given('I am on the login page', async function() {
  await page.goto('https://example.com/login');
});

When('I enter email {string}', async function(email: string) {
  await page.fill('#email', email);
});

When('I enter password {string}', async function(password: string) {
  await page.fill('#password', password);
});

When('I click the login button', async function() {
  await page.click('#login-button');
});

Then('I should be redirected to the dashboard', async function() {
  await expect(page).toHaveURL(/dashboard/);
});

Then('I should see a welcome message', async function() {
  await expect(page.locator('.welcome-message')).toBeVisible();
});

Then('I should see an error message {string}', async function(message: string) {
  await expect(page.locator('.error-message')).toContainText(message);
});

Then('I should remain on the login page', async function() {
  await expect(page).toHaveURL(/login/);
});

Then('I should see {string} dashboard', async function(role: string) {
  await expect(page.locator('.dashboard-title')).toContainText(role);
});
```

#### Cucumber Configuration

```javascript
// cucumber.js
module.exports = {
  default: {
    require: ['features/step-definitions/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'html:cucumber-report.html',
      'json:cucumber-report.json',
    ],
    formatOptions: {
      snippetInterface: 'async-await',
    },
  },
};
```

```bash
# Run Cucumber tests
npx cucumber-js
```

---

### 21.2 Playwright with Jest

```bash
npm install --save-dev jest jest-playwright-preset playwright
```

```javascript
// jest.config.js
module.exports = {
  preset: 'jest-playwright-preset',
  testMatch: ['**/tests/**/*.test.js'],
  testTimeout: 30000,
  setupFilesAfterEnv: ['expect-playwright'],
};
```

```javascript
// jest-playwright.config.js
module.exports = {
  browsers: ['chromium', 'firefox', 'webkit'],
  launchOptions: {
    headless: true,
  },
  contextOptions: {
    viewport: {
      width: 1280,
      height: 720,
    },
  },
};
```

```javascript
// tests/example.test.js
describe('Login Page', () => {
  beforeAll(async () => {
    await page.goto('https://example.com/login');
  });

  it('should display login form', async () => {
    await expect(page).toHaveSelector('#email');
    await expect(page).toHaveSelector('#password');
    await expect(page).toHaveSelector('#login-button');
  });

  it('should login successfully', async () => {
    await page.fill('#email', 'user@example.com');
    await page.fill('#password', 'password123');
    await page.click('#login-button');
    
    await expect(page).toMatchURL(/dashboard/);
  });
});
```

---

### 21.3 Playwright with Mocha

```bash
npm install --save-dev mocha @playwright/test
```

```javascript
// .mocharc.js
module.exports = {
  require: 'ts-node/register',
  spec: 'tests/**/*.spec.ts',
  timeout: 30000,
  reporter: 'spec',
};
```

```typescript
// tests/example.spec.ts
import { chromium, Browser, Page } from 'playwright';
import { expect } from 'chai';

describe('Login Tests', function() {
  let browser: Browser;
  let page: Page;

  before(async function() {
    browser = await chromium.launch();
  });

  after(async function() {
    await browser.close();
  });

  beforeEach(async function() {
    const context = await browser.newContext();
    page = await context.newPage();
  });

  afterEach(async function() {
    await page.close();
  });

  it('should login successfully', async function() {
    await page.goto('https://example.com/login');
    await page.fill('#email', 'user@example.com');
    await page.fill('#password', 'password123');
    await page.click('#login-button');
    
    expect(page.url()).to.include('dashboard');
  });
});
```

---

### 21.4 Combining E2E & Unit Tests in Same Project

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.e2e.spec.ts', // Only E2E tests
});
```

```json
// jest.config.js (for unit tests)
{
  "testMatch": ["**/*.unit.test.ts"],
  "testEnvironment": "node"
}
```

```json
// package.json
{
  "scripts": {
    "test:unit": "jest",
    "test:e2e": "playwright test",
    "test:all": "npm run test:unit && npm run test:e2e",
    "test:ci": "npm run test:unit -- --coverage && npm run test:e2e -- --reporter=junit"
  }
}
```

#### Project Structure

```
project/
├── src/
│   └── utils/
│       ├── calculator.ts
│       └── calculator.unit.test.ts    # Unit test
├── tests/
│   ├── e2e/
│   │   ├── login.e2e.spec.ts          # E2E test
│   │   └── checkout.e2e.spec.ts       # E2E test
│   └── integration/
│       └── api.integration.spec.ts    # Integration test
├── playwright.config.ts
├── jest.config.js
└── package.json
```

---

## 22. Observability & Monitoring

### What is Observability in Test Automation?

**Observability** is the ability to measure and understand the internal state of your test automation system by analyzing its outputs (logs, metrics, traces). Unlike simple monitoring (which tells you "something is wrong"), observability helps you understand **why** something went wrong.

**Key Components:**
1. **Metrics**: Quantitative data (test duration, pass/fail rates, resource usage)
2. **Logs**: Detailed event records (test steps, errors, debug info)
3. **Traces**: Request flow across distributed systems (UI → API → Database)

**Why Integrate Observability in Playwright Tests?**

| Benefit | Description |
|---------|-------------|
| **Faster Debugging** | Pinpoint failures quickly with detailed context |
| **Performance Insights** | Identify slow tests and bottlenecks |
| **Trend Analysis** | Track test reliability over time |
| **Proactive Alerts** | Get notified of degradations before they impact users |
| **Resource Optimization** | Monitor CI/CD resource consumption |
| **Business Intelligence** | Correlate test results with deployments/releases |

---

### 22.1 Integrating with Datadog, New Relic, Grafana

#### What Are These Tools?

| Tool | Purpose | Best For |
|------|---------|----------|
| **Datadog** | Full-stack observability platform | APM, distributed tracing, custom metrics |
| **New Relic** | Application performance monitoring | Real-time metrics, alerting, dashboards |
| **Grafana** | Open-source visualization platform | Custom dashboards, metric aggregation |

#### Datadog Integration

**What It Provides:**
- Distributed tracing across UI and API tests
- Custom metrics for test execution
- Dashboard visualization of test trends
- Alerting on test failures or performance degradation

**Installation:**
```bash
npm install --save-dev dd-trace @datadog/datadog-ci
```

**Configuration:**
```typescript
// playwright.config.ts
import tracer from 'dd-trace';

// Initialize Datadog tracer
tracer.init({
  service: 'playwright-tests',                    // Service name in Datadog
  env: process.env.ENV || 'test',                 // Environment tag
  version: process.env.BUILD_NUMBER || 'local',   // Version tag for releases
  logInjection: true,                             // Inject trace IDs into logs
  runtimeMetrics: true,                           // Collect runtime metrics
});

export default defineConfig({
  use: {
    trace: 'on-first-retry',  // Playwright traces + Datadog traces
  },
  // ... rest of config
});
```

**Instrumented Test Example:**
```typescript
// tests/login-with-datadog.spec.ts
import tracer from 'dd-trace';
import { test, expect } from '@playwright/test';

test('login with distributed tracing', async ({ page }) => {
  // Create parent span for entire test
  const testSpan = tracer.startSpan('e2e.login_flow', {
    tags: {
      'test.name': 'login with distributed tracing',
      'test.framework': 'playwright',
      'test.type': 'e2e',
    },
  });
  
  try {
    // Track navigation
    const navSpan = tracer.startSpan('ui.navigate', {
      childOf: testSpan,
      tags: { 'ui.page': 'login' },
    });
    await page.goto('https://example.com/login');
    navSpan.finish();
    
    // Track form interaction
    const formSpan = tracer.startSpan('ui.fill_form', {
      childOf: testSpan,
    });
    await page.fill('#email', 'user@example.com');
    await page.fill('#password', 'password123');
    formSpan.finish();
    
    // Track submission and API call
    const submitSpan = tracer.startSpan('ui.submit', {
      childOf: testSpan,
    });
    await page.click('#login-button');
    
    // Wait for API response (this will show in distributed trace)
    await page.waitForResponse(response => 
      response.url().includes('/api/login') && response.status() === 200
    );
    submitSpan.finish();
    
    // Track assertion
    const assertSpan = tracer.startSpan('ui.assert', {
      childOf: testSpan,
    });
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('.welcome-message')).toBeVisible();
    assertSpan.setTag('assertion.result', 'passed');
    assertSpan.finish();
    
    testSpan.setTag('test.status', 'passed');
  } catch (error) {
    // Tag failure with error details
    testSpan.setTag('test.status', 'failed');
    testSpan.setTag('error.message', error.message);
    testSpan.setTag('error.stack', error.stack);
    throw error;
  } finally {
    testSpan.finish();
  }
});

// Custom metrics
test('test with custom metrics', async ({ page }) => {
  const startTime = Date.now();
  
  await page.goto('/products');
  
  const loadTime = Date.now() - startTime;
  
  // Send custom metric to Datadog
  tracer.dogstatsd.histogram('playwright.page_load_time', loadTime, {
    page: 'products',
    browser: 'chromium',
  });
  
  expect(loadTime).toBeLessThan(3000); // Assert on performance
});
```

**Datadog Dashboard Queries:**
```
# Average test duration by test name
avg:trace.playwright_test{service:playwright-tests} by {test.name}

# Test failure rate
count:trace.playwright_test{test.status:failed}/count:trace.playwright_test{*}

# P95 page load times
p95:playwright.page_load_time{*} by {page}

# Tests executed per hour
count:trace.playwright_test{*}.rollup(count, 3600)
```

#### New Relic Integration

**What It Provides:**
- Real-time test execution monitoring
- Custom events for test lifecycle
- Error tracking and analysis
- Performance baselines and anomaly detection

**Installation:**
```bash
npm install --save-dev newrelic
```

**Configuration:**
```javascript
// newrelic.js
'use strict';

exports.config = {
  app_name: ['Playwright E2E Tests'],
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  logging: {
    level: 'info',
  },
  distributed_tracing: {
    enabled: true,
  },
  custom_insights_events: {
    enabled: true,
  },
};
```

**Reporter Integration:**
```typescript
// reporters/newrelic-reporter.ts
import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import newrelic from 'newrelic';

class NewRelicReporter implements Reporter {
  onTestEnd(test: TestCase, result: TestResult) {
    // Record custom event
    newrelic.recordCustomEvent('PlaywrightTestComplete', {
      testName: test.title,
      testFile: test.location.file,
      status: result.status,
      duration: result.duration,
      retries: result.retry,
      browser: test.parent.project()?.name,
      timestamp: Date.now(),
      buildNumber: process.env.BUILD_NUMBER,
      environment: process.env.ENV,
    });
    
    // Record metric
    newrelic.recordMetric('Custom/Playwright/TestDuration', result.duration);
    
    // Record error if failed
    if (result.status === 'failed' && result.error) {
      newrelic.noticeError(result.error, {
        testName: test.title,
        testFile: test.location.file,
      });
    }
  }

  onEnd(result) {
    // Summary metrics
    newrelic.recordMetric('Custom/Playwright/TotalTests', result.suites.length);
    newrelic.recordMetric('Custom/Playwright/PassedTests', result.passed);
    newrelic.recordMetric('Custom/Playwright/FailedTests', result.failed);
    newrelic.recordMetric('Custom/Playwright/FlakyTests', result.flaky);
  }
}

export default NewRelicReporter;
```

**Usage in playwright.config.ts:**
```typescript
import { defineConfig } from '@playwright/test';
import NewRelicReporter from './reporters/newrelic-reporter';

export default defineConfig({
  reporter: [
    ['list'],
    [NewRelicReporter],
  ],
});
```

#### Grafana + Prometheus Integration

**What It Provides:**
- Open-source observability stack
- Custom dashboards for test metrics
- Long-term metric storage
- Alerting based on thresholds

**Architecture:**
```
Playwright Tests → Push metrics → Prometheus Pushgateway → Prometheus Server → Grafana Dashboard
```

**Installation:**
```bash
npm install --save-dev prom-client
```

**Metrics Exporter:**
```typescript
// helpers/prometheus-metrics.ts
import { Counter, Histogram, Gauge, register } from 'prom-client';

// Define metrics
export const testCounter = new Counter({
  name: 'playwright_tests_total',
  help: 'Total number of Playwright tests executed',
  labelNames: ['status', 'browser', 'test_name'],
});

export const testDuration = new Histogram({
  name: 'playwright_test_duration_seconds',
  help: 'Duration of Playwright tests in seconds',
  labelNames: ['test_name', 'browser'],
  buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60], // Seconds
});

export const activeTests = new Gauge({
  name: 'playwright_tests_active',
  help: 'Number of currently running tests',
});

export const testRetries = new Counter({
  name: 'playwright_test_retries_total',
  help: 'Total number of test retries',
  labelNames: ['test_name'],
});

// Export all metrics
export function getMetrics() {
  return register.metrics();
}

// Push to Pushgateway
export async function pushMetrics(jobName: string) {
  const pushgatewayUrl = process.env.PUSHGATEWAY_URL || 'http://localhost:9091';
  const metrics = await register.metrics();
  
  await fetch(`${pushgatewayUrl}/metrics/job/${jobName}`, {
    method: 'POST',
    body: metrics,
    headers: { 'Content-Type': 'text/plain' },
  });
}
```

**Reporter with Prometheus:**
```typescript
// reporters/prometheus-reporter.ts
import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { testCounter, testDuration, testRetries, activeTests, pushMetrics } from '../helpers/prometheus-metrics';

class PrometheusReporter implements Reporter {
  onTestBegin(test: TestCase) {
    activeTests.inc();
  }

  onTestEnd(test: TestCase, result: TestResult) {
    activeTests.dec();
    
    const browser = test.parent.project()?.name || 'unknown';
    const testName = test.title;
    
    // Record test count
    testCounter.inc({
      status: result.status,
      browser,
      test_name: testName,
    });
    
    // Record duration
    testDuration.observe(
      { test_name: testName, browser },
      result.duration / 1000  // Convert ms to seconds
    );
    
    // Record retries
    if (result.retry > 0) {
      testRetries.inc({ test_name: testName }, result.retry);
    }
  }

  async onEnd() {
    // Push metrics to Prometheus Pushgateway
    await pushMetrics('playwright_tests');
    console.log('✅ Metrics pushed to Prometheus');
  }
}

export default PrometheusReporter;
```

**Grafana Dashboard JSON (Sample):**
```json
{
  "dashboard": {
    "title": "Playwright Test Metrics",
    "panels": [
      {
        "title": "Test Pass Rate",
        "targets": [
          {
            "expr": "sum(rate(playwright_tests_total{status=\"passed\"}[5m])) / sum(rate(playwright_tests_total[5m])) * 100"
          }
        ],
        "type": "stat"
      },
      {
        "title": "Test Duration (P95)",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, sum(rate(playwright_test_duration_seconds_bucket[5m])) by (le, test_name))"
          }
        ],
        "type": "graph"
      },
      {
        "title": "Test Execution Count",
        "targets": [
          {
            "expr": "sum(increase(playwright_tests_total[1h])) by (browser)"
          }
        ],
        "type": "bar gauge"
      }
    ]
  }
}
```

**Running with Metrics:

**Running with Metrics:**
```bash
# Start Prometheus Pushgateway (Docker)
docker run -d -p 9091:9091 prom/pushgateway

# Run tests with Prometheus reporter
npx playwright test --reporter=./reporters/prometheus-reporter.ts

# View metrics
curl http://localhost:9091/metrics
```

**Best Practices for Observability:**

1. **Tag Everything**: Add context (environment, browser, test type, build number)
2. **Set Meaningful Thresholds**: Alert on actionable metrics (>10% failure rate, >30s duration)
3. **Use Sampling**: Don't trace every test in production (sample 10-20%)
4. **Correlate Events**: Link test failures to deployments/releases
5. **Monitor Trends**: Track week-over-week/month-over-month metrics

---

### 22.2 Custom Telemetry & Test Execution Metrics

#### What Is Custom Telemetry?

**Telemetry** is automated data collection from your tests to track:
- Execution time per test step
- Action performance (click, fill, navigate)
- Assertion outcomes
- Resource usage (CPU, memory, network)
- Custom business metrics (items added to cart, checkout completion time)

#### Custom Telemetry Class

```typescript
// helpers/telemetry.ts
export interface TelemetryEvent {
  type: 'action' | 'assertion' | 'navigation' | 'api' | 'custom';
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
  status?: 'success' | 'failure';
}

export class Telemetry {
  private testName: string;
  private startTime: number;
  private events: TelemetryEvent[] = [];
  private metadata: Record<string, any> = {};

  constructor(testName: string) {
    this.testName = testName;
    this.startTime = Date.now();
  }

  // Record an action (click, fill, navigate)
  recordAction(action: string, duration: number, metadata?: Record<string, any>) {
    this.events.push({
      type: 'action',
      name: action,
      duration,
      timestamp: Date.now(),
      metadata,
      status: 'success',
    });
  }

  // Record an assertion
  recordAssertion(assertion: string, passed: boolean, duration: number) {
    this.events.push({
      type: 'assertion',
      name: assertion,
      duration,
      timestamp: Date.now(),
      status: passed ? 'success' : 'failure',
    });
  }

  // Record navigation
  recordNavigation(url: string, duration: number) {
    this.events.push({
      type: 'navigation',
      name: url,
      duration,
      timestamp: Date.now(),
      status: 'success',
    });
  }

  // Record API call
  recordAPICall(endpoint: string, method: string, status: number, duration: number) {
    this.events.push({
      type: 'api',
      name: `${method} ${endpoint}`,
      duration,
      timestamp: Date.now(),
      metadata: { statusCode: status, method },
      status: status < 400 ? 'success' : 'failure',
    });
  }

  // Record custom metric
  recordCustom(name: string, value: number, metadata?: Record<string, any>) {
    this.events.push({
      type: 'custom',
      name,
      duration: value,
      timestamp: Date.now(),
      metadata,
    });
  }

  // Add metadata
  addMetadata(key: string, value: any) {
    this.metadata[key] = value;
  }

  // Complete telemetry collection
  end(status: 'passed' | 'failed' | 'skipped') {
    const totalDuration = Date.now() - this.startTime;
    
    return {
      testName: this.testName,
      status,
      startTime: this.startTime,
      endTime: Date.now(),
      totalDuration,
      events: this.events,
      metadata: this.metadata,
      summary: {
        totalActions: this.events.filter(e => e.type === 'action').length,
        totalAssertions: this.events.filter(e => e.type === 'assertion').length,
        failedAssertions: this.events.filter(e => e.type === 'assertion' && e.status === 'failure').length,
        totalAPIcalls: this.events.filter(e => e.type === 'api').length,
        averageActionDuration: this.getAverageDuration('action'),
        slowestAction: this.getSlowestEvent('action'),
      },
    };
  }

  private getAverageDuration(type: string): number {
    const filtered = this.events.filter(e => e.type === type);
    if (filtered.length === 0) return 0;
    return filtered.reduce((sum, e) => sum + e.duration, 0) / filtered.length;
  }

  private getSlowestEvent(type: string): TelemetryEvent | null {
    const filtered = this.events.filter(e => e.type === type);
    if (filtered.length === 0) return null;
    return filtered.reduce((slowest, e) => e.duration > slowest.duration ? e : slowest);
  }

  getEvents(): TelemetryEvent[] {
    return this.events;
  }
}
```

#### Using Telemetry in Tests

```typescript
// tests/checkout-with-telemetry.spec.ts
import { test, expect } from '@playwright/test';
import { Telemetry } from '../helpers/telemetry';

test('checkout flow with detailed telemetry', async ({ page }) => {
  const telemetry = new Telemetry('Checkout Flow');
  
  // Add test metadata
  telemetry.addMetadata('browser', 'chromium');
  telemetry.addMetadata('environment', 'staging');
  telemetry.addMetadata('buildNumber', process.env.BUILD_NUMBER);

  try {
    // Track navigation
    let start = Date.now();
    await page.goto('https://example.com/products');
    telemetry.recordNavigation('https://example.com/products', Date.now() - start);

    // Track actions
    start = Date.now();
    await page.click('[data-testid="add-to-cart-btn"]');
    telemetry.recordAction('add_to_cart', Date.now() - start, { product: 'Product A' });

    start = Date.now();
    await page.click('[data-testid="cart-icon"]');
    telemetry.recordAction('open_cart', Date.now() - start);

    start = Date.now();
    await page.click('[data-testid="checkout-btn"]');
    telemetry.recordAction('click_checkout', Date.now() - start);

    // Track form filling
    start = Date.now();
    await page.fill('#email', 'user@example.com');
    await page.fill('#address', '123 Main St');
    await page.fill('#city', 'New York');
    telemetry.recordAction('fill_shipping_form', Date.now() - start);

    // Track API calls
    page.on('response', async (response) => {
      if (response.url().includes('/api/')) {
        const request = response.request();
        telemetry.recordAPICall(
          response.url(),
          request.method(),
          response.status(),
          response.timing().responseEnd
        );
      }
    });

    // Submit order
    start = Date.now();
    await page.click('[data-testid="place-order-btn"]');
    telemetry.recordAction('place_order', Date.now() - start);

    // Track assertions
    start = Date.now();
    const confirmationVisible = await page.locator('.order-confirmation').isVisible();
    telemetry.recordAssertion('order_confirmation_visible', confirmationVisible, Date.now() - start);
    expect(confirmationVisible).toBeTruthy();

    start = Date.now();
    const orderNumber = await page.locator('[data-testid="order-number"]').textContent();
    telemetry.recordAssertion('order_number_exists', !!orderNumber, Date.now() - start);
    expect(orderNumber).toBeTruthy();

    // Custom business metric
    const checkoutTime = Date.now() - telemetry['startTime'];
    telemetry.recordCustom('checkout_completion_time', checkoutTime);

    // Test passed
    const metrics = telemetry.end('passed');
    console.log('✅ Test Telemetry:', JSON.stringify(metrics, null, 2));
    
    // Send to monitoring service
    await sendTelemetryToBackend(metrics);
    
  } catch (error) {
    const metrics = telemetry.end('failed');
    console.error('❌ Test Failed with Telemetry:', JSON.stringify(metrics, null, 2));
    await sendTelemetryToBackend(metrics);
    throw error;
  }
});

async function sendTelemetryToBackend(metrics: any) {
  try {
    await fetch('https://telemetry.example.com/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metrics),
    });
  } catch (error) {
    console.warn('Failed to send telemetry:', error);
  }
}
```

#### Telemetry Reporter

```typescript
// reporters/telemetry-reporter.ts
import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import * as fs from 'fs';

class TelemetryReporter implements Reporter {
  private allMetrics: any[] = [];

  onTestEnd(test: TestCase, result: TestResult) {
    // Extract telemetry from test output
    const telemetryData = {
      testName: test.title,
      file: test.location.file,
      line: test.location.line,
      status: result.status,
      duration: result.duration,
      retries: result.retry,
      browser: test.parent.project()?.name,
      timestamp: Date.now(),
      error: result.error?.message,
    };
    
    this.allMetrics.push(telemetryData);
  }

  async onEnd() {
    // Calculate aggregate metrics
    const totalTests = this.allMetrics.length;
    const passed = this.allMetrics.filter(m => m.status === 'passed').length;
    const failed = this.allMetrics.filter(m => m.status === 'failed').length;
    const flaky = this.allMetrics.filter(m => m.retries > 0).length;
    
    const avgDuration = this.allMetrics.reduce((sum, m) => sum + m.duration, 0) / totalTests;
    const p95Duration = this.calculatePercentile(this.allMetrics.map(m => m.duration), 95);
    const p99Duration = this.calculatePercentile(this.allMetrics.map(m => m.duration), 99);
    
    const summary = {
      totalTests,
      passed,
      failed,
      flaky,
      passRate: (passed / totalTests) * 100,
      avgDuration,
      p95Duration,
      p99Duration,
      timestamp: Date.now(),
      buildNumber: process.env.BUILD_NUMBER,
      environment: process.env.ENV || 'local',
    };

    // Save to file
    fs.writeFileSync(
      'telemetry-report.json',
      JSON.stringify({ summary, tests: this.allMetrics }, null, 2)
    );

    console.log('\n📊 Test Execution Metrics:');
    console.log(`   Total: ${totalTests}`);
    console.log(`   Passed: ${passed} (${summary.passRate.toFixed(2)}%)`);
    console.log(`   Failed: ${failed}`);
    console.log(`   Flaky: ${flaky}`);
    console.log(`   Avg Duration: ${avgDuration.toFixed(2)}ms`);
    console.log(`   P95 Duration: ${p95Duration.toFixed(2)}ms`);
    console.log(`   P99 Duration: ${p99Duration.toFixed(2)}ms`);
  }

  private calculatePercentile(values: number[], percentile: number): number {
    const sorted = values.sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  }
}

export default TelemetryReporter;
```

---

### 22.3 Real User Monitoring (RUM) Integration

#### What Is RUM?

**Real User Monitoring (RUM)** captures actual user experience metrics from your application:
- Page load times
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Cumulative Layout Shift (CLS)
- JavaScript errors
- Resource loading times

**Why Use RUM in E2E Tests?**
- Validate that your tests reflect real user experience
- Catch performance regressions before production
- Collect Web Vitals metrics during test execution
- Debug issues with actual browser performance data

#### RUM Data Collection in Playwright

```typescript
// helpers/rum-collector.ts
export interface RUMData {
  pageViews: Array<{ url: string; timestamp: number; duration: number }>;
  errors: Array<{ message: string; stack: string; timestamp: number }>;
  performance: {
    navigation: any;
    resources: any[];
    webVitals: {
      FCP?: number;
      LCP?: number;
      CLS?: number;
      FID?: number;
      TTFB?: number;
    };
  };
  customEvents: Array<{ name: string; data: any; timestamp: number }>;
}

export class RUMCollector {
  async injectRUMScript(page: any) {
    // Inject RUM collection script into page
    await page.addInitScript(() => {
      // Global RUM data storage
      (window as any).__RUM_DATA__ = {
        pageViews: [],
        errors: [],
        performance: {
          navigation: null,
          resources: [],
          webVitals: {},
        },
        customEvents: [],
      };

      // Track page views
      const trackPageView = (url: string) => {
        (window as any).__RUM_DATA__.pageViews.push({
          url,
          timestamp: Date.now(),
          duration: performance.now(),
        });
      };

      // Track initial page load
      trackPageView(window.location.href);

      // Track history changes (SPA navigation)
      const originalPushState = history.pushState;
      history.pushState = function (...args) {
        trackPageView(args[2] as string);
        return originalPushState.apply(history, args);
      };

      const originalReplaceState = history.replaceState;
      history.replaceState = function (...args) {
        trackPageView(args[2] as string);
        return originalReplaceState.apply(history, args);
      };

      // Track JavaScript errors
      window.addEventListener('error', (event) => {
        (window as any).__RUM_DATA__.errors.push({
          message: event.message,
          stack: event.error?.stack || '',
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          timestamp: Date.now(),
        });
      });

      // Track unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        (window as any).__RUM_DATA__.errors.push({
          message: `Unhandled Promise Rejection: ${event.reason}`,
          stack: event.reason?.stack || '',
          timestamp: Date.now(),
        });
      });

      // Collect navigation timing
      window.addEventListener('load', () => {
        const navTiming = performance.getEntriesByType('navigation')[0] as any;
        (window as any).__RUM_DATA__.performance.navigation = {
          dns: navTiming.domainLookupEnd - navTiming.domainLookupStart,
          tcp: navTiming.connectEnd - navTiming.connectStart,
          ttfb: navTiming.responseStart - navTiming.requestStart,
          download: navTiming.responseEnd - navTiming.responseStart,
          domInteractive: navTiming.domInteractive,
          domComplete: navTiming.domComplete,
          loadComplete: navTiming.loadEventEnd - navTiming.loadEventStart,
        };
      });

      // Collect resource timing
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          (window as any).__RUM_DATA__.performance.resources.push({
            name: entry.name,
            type: (entry as any).initiatorType,
            duration: entry.duration,
            size: (entry as any).transferSize,
            timestamp: entry.startTime,
          });
        }
      }).observe({ entryTypes: ['resource'] });

      // Collect Web Vitals (FCP, LCP, CLS, FID)
      // First Contentful Paint
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          (window as any).__RUM_DATA__.performance.webVitals.FCP = entry.startTime;
        }
      }).observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        (window as any).__RUM_DATA__.performance.webVitals.LCP = lastEntry.startTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            (window as any).__RUM_DATA__.performance.webVitals.CLS = clsValue;
          }
        }
      }).observe({ entryTypes: ['layout-shift'] });

      // First Input Delay
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          (window as any).__RUM_DATA__.performance.webVitals.FID = (entry as any).processingStart - entry.startTime;
        }
      }).observe({ entryTypes: ['first-input'] });

      // Custom event tracking API
      (window as any).trackRUMEvent = (name: string, data: any) => {
        (window as any).__RUM_DATA__.customEvents.push({
          name,
          data,
          timestamp: Date.now(),
        });
      };
    });
  }

  async collectRUMData(page: any): Promise<RUMData> {
    // Extract RUM data from page
    const rumData = await page.evaluate(() => (window as any).__RUM_DATA__);
    return rumData;
  }

  printRUMSummary(rumData: RUMData) {
    console.log('\n📊 RUM Data Summary:');
    console.log(`   Page Views: ${rumData.pageViews.length}`);
    console.log(`   Errors: ${rumData.errors.length}`);
    console.log(`   Resources Loaded: ${rumData.performance.resources.length}`);
    
    if (rumData.performance.webVitals.FCP) {
      console.log(`   FCP: ${rumData.performance.webVitals.FCP.toFixed(2)}ms`);
    }
    if (rumData.performance.webVitals.LCP) {
      console.log(`   LCP: ${rumData.performance.webVitals.LCP.toFixed(2)}ms`);
    }
    if (rumData.performance.webVitals.CLS) {
      console.log(`   CLS: ${rumData.performance.webVitals.CLS.toFixed(4)}`);
    }
    if (rumData.performance.webVitals.FID) {
      console.log(`   FID: ${rumData.performance.webVitals.FID.toFixed(2)}ms`);
    }
  }
}
```

#### Using RUM in Tests

```typescript
// tests/rum-integration.spec.ts
import { test, expect } from '@playwright/test';
import { RUMCollector } from '../helpers/rum-collector';

test('collect RUM data during checkout', async ({ page }) => {
  const rumCollector = new RUMCollector();
  
  // Inject RUM collection script
  await rumCollector.injectRUMScript(page);
  
  // Perform test actions
  await page.goto('https://example.com');
  
  // Track custom event
  await page.evaluate(() => {
    (window as any).trackRUMEvent('user_action', { action: 'view_homepage' });
  });
  
  await page.click('[data-testid="products-link"]');
  await page.waitForLoadState('networkidle');
  
  await page.evaluate(() => {
    (window as any).trackRUMEvent('user_action', { action: 'view_products' });
  });
  
  await page.click('[data-testid="add-to-cart-btn"]');
  await page.click('[data-testid="checkout-btn"]');
  
  // Collect RUM data
  const rumData = await rumCollector.collectRUMData(page);
  
  // Print summary
  rumCollector.printRUMSummary(rumData);
  
  // Assert on RUM metrics
  expect(rumData.errors.length).toBe(0); // No JS errors
  expect(rumData.performance.webVitals.LCP).toBeLessThan(2500); // LCP < 2.5s (good)
  expect(rumData.performance.webVitals.CLS).toBeLessThan(0.1); // CLS < 0.1 (good)
  
  // Send RUM data to monitoring service
  await sendRUMDataToBackend(rumData);
});

async function sendRUMDataToBackend(rumData: any) {
  await fetch('https://rum.example.com/api/collect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...rumData,
      testRun: true,
      buildNumber: process.env.BUILD_NUMBER,
      timestamp: Date.now(),
    }),
  });
}
```

**Web Vitals Thresholds (Google Standards):**

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | 2.5s - 4.0s | > 4.0s |
| **FID** (First Input Delay) | ≤ 100ms | 100ms - 300ms | > 300ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |
| **FCP** (First Contentful Paint) | ≤ 1.8s | 1.8s - 3.0s | > 3.0s |
| **TTFB** (Time to First Byte) | ≤ 800ms | 800ms - 1800ms | > 1800ms |

---

### 22.4 Distributed Tracing for E2E Flows

#### What Is Distributed Tracing?

**Distributed tracing** tracks a request as it flows through multiple services in your architecture:
```
UI Test (Playwright) → Frontend → API Gateway → Auth Service → Database
```

Each service adds a span to the trace, creating a complete picture of the request flow.

**Benefits:**
- See end-to-end latency breakdown
- Identify bottlenecks across services
- Debug failures in distributed systems
- Correlate UI actions with backend processing

#### Trace Context Propagation

```typescript
// helpers/distributed-tracing.ts
import { v4 as uuidv4 } from 'uuid';

export interface Span {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  tags?: Record<string, any>;
  status?: 'ok' | 'error';
}

export class DistributedTracing {
  private traceId: string;
  private spans: Span[] = [];

  constructor(traceId?: string) {
    this.traceId = traceId || uuidv4();
  }

  startSpan(name: string, parentSpanId?: string): string {
    const spanId = uuidv4();
    const span: Span = {
      traceId: this.traceId,
      spanId,
      parentSpanId,
      name,
      startTime: Date.now(),
    };
    this.spans.push(span);
    return spanId;
  }

  endSpan(spanId: string, tags?: Record<string, any>, status: 'ok' | 'error' = 'ok') {
    const span = this.spans.find(s => s.spanId === spanId);
    if (span) {
      span.endTime = Date.now();
      span.duration = span.endTime - span.startTime;
      span.tags = tags;
      span.status = status;
    }
  }

  getTraceId(): string {
    return this.traceId;
  }

  getSpans(): Span[] {
    return this.spans;
  }

  async exportToJaeger(jaegerEndpoint: string) {
    // Export traces to Jaeger (or Zipkin, etc.)
    await fetch(`${jaegerEndpoint}/api/traces`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [{
          traceID: this.traceId,
          spans: this.spans.map(span => ({
            traceID: span.traceId,
            spanID: span.spanId,
            parentSpanID: span.parentSpanId,
            operationName: span.name,
            startTime: span.startTime * 1000, // Jaeger expects microseconds
            duration: (span.duration || 0) * 1000,
            tags: span.tags ? Object.entries(span.tags).map(([key, value]) => ({
              key,
              type: typeof value,
              value: String(value),
            })) : [],
          })),
        }],
      }),
    });
  }

  printTrace() {
    console.log(`\n🔍 Distributed Trace: ${this.traceId}`);
    this.spans.forEach((span, index) => {
      const indent = span.parentSpanId ? '  ' : '';
      console.log(`${indent}${index + 1}. ${span.name} - ${span.duration}ms [${span.status}]`);
      if (span.tags) {
        Object.entries(span.tags).forEach(([key, value]) => {
          console.log(`${indent}   ${key}: ${value}`);
        });
      }
    });
  }
}
```

#### Using Distributed Tracing in Tests

```typescript
// tests/distributed-tracing.spec.ts
import { test, expect } from '@playwright/test';
import { DistributedTracing } from '../helpers/distributed-tracing';

test('e2e flow with distributed tracing', async ({ page, request }) => {
  const tracing = new DistributedTracing();
  const traceId = tracing.getTraceId();

  // 1. UI Span: Navigate to page
  const uiNavSpan = tracing.startSpan('ui.navigate');
  await page.goto('https://example.com/products');
  tracing.endSpan(uiNavSpan, { page: 'products', url: page.url() });

  // 2. UI Span: Add to cart
  const uiAddToCartSpan = tracing.startSpan('ui.add_to_cart', uiNavSpan);
  await page.click('[data-testid="add-to-cart-btn"]');
  await page.waitForSelector('[data-testid="cart-count"]');
  tracing.endSpan(uiAddToCartSpan, { product: 'Product A' });

  // 3. API Span: Create order with trace context
  const apiCreateOrderSpan = tracing.startSpan('api.create_order', uiAddToCartSpan);
  const response = await request.post('https://example.com/api/orders', {
    headers: {
      'X-Trace-Id': traceId,                    // Propagate trace ID
      'X-Parent-Span-Id': apiCreateOrderSpan,   // Propagate parent span
    },
    data: {
      productId: '123',
      quantity: 1,
    },
  });
  tracing.endSpan(apiCreateOrderSpan, {
    statusCode: response.status(),
    orderId: (await response.json()).orderId,
  }, response.ok() ? 'ok' : 'error');

  // 4. UI Span: Verify order confirmation
  const uiVerifySpan = tracing.startSpan('ui.verify_confirmation', apiCreateOrderSpan);
  await expect(page.locator('.order-confirmation')).toBeVisible();
  const orderNumber = await page.locator('[data-testid="order-number"]').textContent();
  tracing.endSpan(uiVerifySpan, { orderNumber });

  // 5. API Span: Verify order in backend
  const apiVerifySpan = tracing.startSpan('api.verify_order', uiVerifySpan);
  const verifyResponse = await request.get(`https://example.com/api/orders/${orderNumber}`, {
    headers: {
      'X-Trace-Id': traceId,
      'X-Parent-Span-Id': apiVerifySpan,
    },
  });
  tracing.endSpan(apiVerifySpan, {
    statusCode: verifyResponse.status(),
    orderStatus: (await verifyResponse.json()).status,
  });

  // Print trace
  tracing.printTrace();

  // Export to Jaeger
  await tracing.exportToJaeger('http://localhost:14268');

  console.log(`✅ Trace ID: ${traceId} - View in Jaeger: http://localhost:16686/trace/${traceId}`);
});

// Example with request interception to add trace headers automatically
test('automatic trace context propagation', async ({ page }) => {
  const tracing = new DistributedTracing();
  const traceId = tracing.getTraceId();

  // Intercept all API requests and add trace headers
  await page.route('**/api/**', async (route) => {
    const headers = route.request().headers();
    headers['X-Trace-Id'] = traceId;
    headers['X-Parent-Span-Id'] = 'ui-span-id'; // Would be dynamic in real scenario
    
    await route.continue({ headers });
  });

  await page.goto('https://example.com');
  await page.click('[data-testid="submit-btn"]');
  
  // All API calls now have trace context!
});
```

**Jaeger Setup (Docker):**
```bash
# Start Jaeger all-in-one
docker run -d --name jaeger \
  -p 16686:16686 \
  -p 14268:14268 \
  jaegertracing/all-in-one:latest

# View UI at http://localhost:16686
```

**Best Practices for Distributed Tracing:**

1. **Propagate Context**: Always pass `trace-id` and `span-id` headers to APIs
2. **Meaningful Span Names**: Use format `<service>.<operation>` (e.g., `ui.checkout`, `api.createOrder`)
3. **Add Rich Tags**: Include user ID, session ID, request parameters
4. **Set Status**: Mark spans as `ok` or `error` based on outcome
5. **Sample Strategically**: Trace 100% in test, 10-20% in production

---

## 23. Cross-Browser & Cross-Platform Strategy

### Why Cross-Browser Testing Matters

**Cross-browser testing** ensures your application works consistently across different browsers and platforms. Each browser has its own rendering engine, JavaScript implementation, and CSS support.

**Key Reasons:**
- **Browser Market Share**: Users access your app from Chrome (65%), Safari (20%), Edge (4%), Firefox (3%), and others
- **Engine Differences**: Chromium (Blink), Firefox (Gecko), Safari (WebKit) handle code differently
- **CSS Compatibility**: Vendor prefixes, flexbox/grid implementations vary
- **JavaScript APIs**: WebRTC, Push Notifications, Service Workers have different support levels
- **User Experience**: A bug in one browser can affect 20% of your users

**Playwright's Advantage:**
- Tests same code across Chromium, Firefox, and WebKit
- No need for different test syntaxes
- Consistent API across all browsers
- Built-in mobile emulation

---

### 23.1 Desktop Browsers (Chrome, Firefox, Safari, Edge)

#### Browser Engines Overview

| Browser | Engine | Playwright Project | Notes |
|---------|--------|-------------------|-------|
| **Chrome** | Blink (Chromium) | `chromium` | Most popular browser, 65%+ market share |
| **Edge** | Blink (Chromium) | `chromium` with `channel: 'msedge'` | Microsoft's browser, Chromium-based since 2020 |
| **Firefox** | Gecko | `firefox` | Independent engine, 3-5% market share |
| **Safari** | WebKit | `webkit` | macOS/iOS default, 18-20% market share |
| **Opera** | Blink (Chromium) | `chromium` | Can use Chromium tests |
| **Brave** | Blink (Chromium) | `chromium` | Privacy-focused Chromium fork |

#### Configuration for All Desktop Browsers

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Run tests in parallel across browsers
  fullyParallel: true,
  
  // Timeout per test
  timeout: 30000,
  
  projects: [
    // 1. Chromium (Chrome, Brave, Opera, new Edge)
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Chromium-specific options
        viewport: { width: 1280, height: 720 },
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },

    // 2. Firefox
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        // Firefox-specific options
        viewport: { width: 1280, height: 720 },
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },

    // 3. WebKit (Safari)
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        // WebKit-specific options
        viewport: { width: 1280, height: 720 },
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },

    // 4. Microsoft Edge (Chromium-based)
    {
      name: 'edge',
      use: { 
        ...devices['Desktop Edge'],
        channel: 'msedge',  // Use installed Edge browser
      },
    },

    // 5. Chrome Beta (testing upcoming features)
    {
      name: 'chrome-beta',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome-beta',
      },
    },

    // 6. Chrome Canary (cutting edge)
    {
      name: 'chrome-canary',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome-canary',
      },
    },
  ],
});
```

#### Running Tests on Specific Browsers

```bash
# Run on single browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run on multiple browsers
npx playwright test --project=chromium --project=firefox

# Run on all browsers (default)
npx playwright test

# Run specific test file on all browsers
npx playwright test tests/login.spec.ts

# Run on specific browser with headed mode
npx playwright test --project=chromium --headed

# Run on specific browser with debugging
npx playwright test --project=firefox --debug
```

#### Browser Channel Options

```typescript
// Different Chrome channels
use: {
  browserName: 'chromium',
  channel: 'chrome',         // Stable Chrome
  channel: 'chrome-beta',    // Beta Chrome
  channel: 'chrome-dev',     // Dev Chrome
  channel: 'chrome-canary',  // Canary Chrome
  channel: 'msedge',         // Microsoft Edge
  channel: 'msedge-beta',    // Edge Beta
  channel: 'msedge-dev',     // Edge Dev
}
```

#### Browser Feature Detection

```typescript
test('test with browser feature detection', async ({ page, browserName }) => {
  await page.goto('/');
  
  // Check browser-specific features
  const features = await page.evaluate(() => {
    return {
      webGL: !!document.createElement('canvas').getContext('webgl'),
      webRTC: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      serviceWorker: 'serviceWorker' in navigator,
      pushNotifications: 'PushManager' in window,
      webAssembly: typeof WebAssembly !== 'undefined',
    };
  });
  
  console.log(`${browserName} features:`, features);
  
  // Conditional test logic based on feature support
  if (features.webRTC) {
    // Test WebRTC functionality
    await testVideoCall(page);
  } else {
    console.log(`⚠️ ${browserName} doesn't support WebRTC, skipping video call test`);
  }
});
```

---

### 23.2 Mobile Emulation (iOS Safari, Android Chrome)

#### Why Test Mobile?

| Stat | Value |
|------|-------|
| **Mobile Traffic** | 58% of global web traffic |
| **Mobile E-commerce** | 73% of purchases start on mobile |
| **Mobile-First Indexing** | Google prioritizes mobile version |
| **User Expectations** | 53% abandon sites that take >3s to load |

**Mobile Testing Challenges:**
- Touch interactions vs mouse clicks
- Smaller viewports (responsive design)
- Network conditions (3G, 4G, 5G)
- Device-specific features (geolocation, camera, orientation)
- iOS Safari quirks (100vh issue, touch events)

#### Mobile Device Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    // --- iOS Devices ---
    
    // iPhone 13 Pro (iOS Safari)
    {
      name: 'iPhone 13 Pro',
      use: { ...devices['iPhone 13 Pro'] },
    },

    // iPhone 12 (iOS Safari)
    {
      name: 'iPhone 12',
      use: { ...devices['iPhone 12'] },
    },

    // iPhone SE (small screen)
    {
      name: 'iPhone SE',
      use: { ...devices['iPhone SE'] },
    },

    // iPad Pro (tablet)
    {
      name: 'iPad Pro',
      use: { ...devices['iPad Pro'] },
    },

    // iPad Mini
    {
      name: 'iPad Mini',
      use: { ...devices['iPad Mini'] },
    },

    // --- Android Devices ---
    
    // Pixel 5 (Android Chrome)
    {
      name: 'Pixel 5',
      use: { ...devices['Pixel 5'] },
    },

    // Galaxy S9+ (Android Chrome)
    {
      name: 'Galaxy S9+',
      use: { ...devices['Galaxy S9+'] },
    },

    // Galaxy Tab S4 (Android tablet)
    {
      name: 'Galaxy Tab S4',
      use: { ...devices['Galaxy Tab S4'] },
    },
  ],
});
```

#### Custom Mobile Configuration

```typescript
// Custom mobile device (e.g., new phone not in Playwright's list)
{
  name: 'Custom Android Phone',
  use: {
    browserName: 'chromium',
    viewport: { width: 393, height: 851 },      // Screen dimensions
    deviceScaleFactor: 3,                        // Pixel density (Retina = 2 or 3)
    isMobile: true,                              // Mobile flag
    hasTouch: true,                              // Touch events
    userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36...',
  },
}

// Custom iOS device
{
  name: 'Custom iPhone',
  use: {
    browserName: 'webkit',                       // iOS uses WebKit
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)...',
  },
}
```

#### Mobile-Specific Test Scenarios

```typescript
// Test mobile menu
test('mobile navigation menu', async ({ page }) => {
  test.skip(!page.context().hasTouch(), 'Desktop only has hover menus');
  
  await page.goto('/');
  
  // Mobile: hamburger menu should be visible
  await expect(page.locator('.hamburger-menu')).toBeVisible();
  await expect(page.locator('.desktop-nav')).toBeHidden();
  
  // Tap hamburger menu
  await page.tap('.hamburger-menu');
  
  // Menu should slide in
  await expect(page.locator('.mobile-menu')).toBeVisible();
});

// Test touch gestures
test('swipe carousel', async ({ page }) => {
  await page.goto('/products');
  
  const carousel = page.locator('.carousel');
  const firstSlide = carousel.locator('.slide').first();
  
  // Get initial position
  const initialPosition = await firstSlide.boundingBox();
  
  // Swipe left (touch gesture)
  await carousel.touchscreen.swipe(
    { x: 300, y: 200 },  // Start position
    { x: 100, y: 200 },  // End position (swipe left)
    { steps: 10 }         // Smooth gesture
  });
  
  // Wait for animation
  await page.waitForTimeout(500);
  
  // Verify carousel moved
  const newPosition = await firstSlide.boundingBox();
  expect(newPosition!.x).toBeLessThan(initialPosition!.x);
});

// Test orientation change
test('orientation change', async ({ page, viewport }) => {
  await page.goto('/');
  
  // Portrait mode (default for mobile)
  expect(viewport!.width).toBeLessThan(viewport!.height);
  await expect(page.locator('.portrait-layout')).toBeVisible();
  
  // Rotate to landscape
  await page.setViewportSize({ 
    width: viewport!.height, 
    height: viewport!.width 
  });
  
  await expect(page.locator('.landscape-layout')).toBeVisible();
});

// Test mobile keyboard
test('mobile keyboard input', async ({ page }) => {
  await page.goto('/login');
  
  // On mobile, keyboard should trigger
  await page.tap('#email');
  
  // Check if input is focused
  await expect(page.locator('#email')).toBeFocused();
  
  // Type with mobile keyboard
  await page.fill('#email', 'test@example.com');
  
  // Email keyboard should show @ key
  const inputType = await page.locator('#email').getAttribute('type');
  expect(inputType).toBe('email');
});
```

#### Mobile Network Emulation

```typescript
test('test with slow 3G network', async ({ page, context }) => {
  // Emulate slow 3G network
  await context.route('**/*', async (route) => {
    await new Promise(resolve => setTimeout(resolve, 300)); // 300ms delay
    await route.continue();
  });
  
  await page.goto('/');
  
  // Test loading states
  await expect(page.locator('.loading-spinner')).toBeVisible();
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.loading-spinner')).toBeHidden();
});

// Use Playwright's built-in network emulation
test('test with network throttling', async ({ page }) => {
  // Simulate slow network
  const client = await page.context().newCDPSession(page);
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: 50 * 1024 / 8,     // 50 Kbps
    uploadThroughput: 20 * 1024 / 8,       // 20 Kbps
    latency: 500,                           // 500ms latency
  });
  
  await page.goto('/');
  // Test under slow network
});
```

---

### 23.3 Browser-Specific Quirks & Conditional Tests

#### Common Browser Quirks

| Browser | Quirk | Workaround |
|---------|-------|------------|
| **Safari** | 100vh includes mobile browser bar | Use JavaScript to calculate |
| **Safari** | Date input format differs | Use separate format validation |
| **Firefox** | Flexbox `gap` property older syntax | Use polyfill or margin fallback |
| **IE11** | No CSS Grid support | Provide fallback layout |
| **Chrome** | Auto-fill background color | Override with CSS |
| **Safari** | No Web Push API | Detect and show alternative |

#### Conditional Test Execution

```typescript
// Skip test on specific browser
test('chromium-only feature', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'This feature only works in Chromium');
  
  await page.goto('/');
  // Test Chrome DevTools Protocol features
  const client = await page.context().newCDPSession(page);
  await client.send('Performance.enable');
});

// Run test only on specific browser
test('webkit CSS quirks', async ({ page, browserName }) => {
  test.skip(browserName !== 'webkit', 'WebKit-specific CSS test');
  
  await page.goto('/');
  // Test Safari-specific CSS behavior
  const hasWebkitPrefix = await page.evaluate(() => {
    return CSS.supports('-webkit-appearance', 'none');
  });
  expect(hasWebkitPrefix).toBeTruthy();
});

// Skip test on multiple browsers
test('firefox and webkit feature', async ({ page, browserName }) => {
  test.skip(browserName === 'chromium', 'Not supported in Chromium');
  
  // Test feature that works in Firefox and WebKit only
});

// Conditional assertions
test('cross-browser date picker', async ({ page, browserName }) => {
  await page.goto('/form');
  
  await page.click('#date-input');
  
  if (browserName === 'webkit') {
    // Safari has native date picker
    await expect(page.locator('.safari-datepicker')).toBeVisible();
  } else {
    // Other browsers use custom date picker
    await expect(page.locator('.custom-datepicker')).toBeVisible();
  }
});

// Test different implementations per browser
test('video autoplay policy', async ({ page, browserName }) => {
  await page.goto('/video');
  
  const video = page.locator('video');
  
  if (browserName === 'chromium' || browserName === 'firefox') {
    // Chrome/Firefox: Autoplay muted videos
    await expect(video).toHaveAttribute('muted', '');
    const isPlaying = await video.evaluate((v: HTMLVideoElement) => !v.paused);
    expect(isPlaying).toBeTruthy();
  } else if (browserName === 'webkit') {
    // Safari: Stricter autoplay policy
    // May require user interaction
    await video.click(); // User gesture
    await page.waitForTimeout(100);
    const isPlaying = await video.evaluate((v: HTMLVideoElement) => !v.paused);
    expect(isPlaying).toBeTruthy();
  }
});
```

#### Browser-Specific Fixtures

```typescript
// fixtures/browser-config.ts
import { test as base } from '@playwright/test';

type BrowserConfig = {
  supportsWebGL: boolean;
  supportsWebRTC: boolean;
  supportsPushAPI: boolean;
  cssPrefix: string;
  maxViewportWidth: number;
};

type BrowserFixtures = {
  browserConfig: BrowserConfig;
};

export const test = base.extend<BrowserFixtures>({
  browserConfig: async ({ browserName }, use) => {
    const configs: Record<string, BrowserConfig> = {
      chromium: {
        supportsWebGL: true,
        supportsWebRTC: true,
        supportsPushAPI: true,
        cssPrefix: '-webkit-',
        maxViewportWidth: 7680,  // 8K support
      },
      firefox: {
        supportsWebGL: true,
        supportsWebRTC: true,
        supportsPushAPI: true,
        cssPrefix: '-moz-',
        maxViewportWidth: 32767,
      },
      webkit: {
        supportsWebGL: true,
        supportsWebRTC: false,   // Limited WebRTC support
        supportsPushAPI: false,   // No Push API on iOS/macOS
        cssPrefix: '-webkit-',
        maxViewportWidth: 10000,
      },
    };
    
    await use(configs[browserName]);
  },
});

// Usage
test('WebRTC video call', async ({ page, browserConfig }) => {
  if (!browserConfig.supportsWebRTC) {
    test.skip('Browser does not support WebRTC');
  }
  
  await page.goto('/video-call');
  // Test WebRTC features
});

test('CSS with vendor prefix', async ({ page, browserConfig }) => {
  await page.goto('/');
  
  const style = await page.evaluate((prefix) => {
    const el = document.createElement('div');
    el.style.cssText = `${prefix}user-select: none`;
    return el.style.cssText;
  }, browserConfig.cssPrefix);
  
  expect(style).toContain('user-select');
});
```

#### Browser Version Detection

```typescript
test('get browser version', async ({ page, browser }) => {
  const version = browser.version();
  console.log(`Browser version: ${version}`);
  
  // Parse version
  const [major, minor, patch] = version.split('.').map(Number);
  
  if (major >= 100) {
    // Test features available in v100+
    await testNewFeatures(page);
  } else {
    // Skip or use fallback
    test.skip('Requires browser version 100+');
  }
});
```

---

### 23.4 Responsive Design Testing Across Viewports

#### Why Test Multiple Viewports?

**Responsive breakpoints** are crucial for modern web design:

| Device Type | Viewport Width | % of Traffic | Common Devices |
|-------------|----------------|--------------|----------------|
| **Small Mobile** | 320px - 480px | 15% | iPhone SE, old Android |
| **Mobile** | 481px - 768px | 35% | iPhone 12, Galaxy S21 |
| **Tablet** | 769px - 1024px | 12% | iPad, Galaxy Tab |
| **Desktop** | 1025px - 1440px | 25% | Laptops, small monitors |
| **Large Desktop** | 1441px+ | 13% | 4K monitors, ultra-wide |

#### Testing Multiple Viewports

```typescript
// Test all common viewports
const viewports = [
  { name: 'Mobile Small', width: 375, height: 667 },      // iPhone SE
  { name: 'Mobile Medium', width: 390, height: 844 },     // iPhone 12
  { name: 'Mobile Large', width: 428, height: 926 },      // iPhone 13 Pro Max
  { name: 'Tablet Portrait', width: 768, height: 1024 },  // iPad
  { name: 'Tablet Landscape', width: 1024, height: 768 }, // iPad rotated
  { name: 'Desktop Small', width: 1280, height: 720 },    // 720p
  { name: 'Desktop Medium', width: 1920, height: 1080 },  // 1080p (Full HD)
  { name: 'Desktop Large', width: 2560, height: 1440 },   // 1440p (2K)
  { name: 'Desktop 4K', width: 3840, height: 2160 },      // 4K Ultra HD
];

for (const viewport of viewports) {
  test(`responsive layout - ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/');
    
    // Take screenshot for manual review
    await page.screenshot({ 
      path: `screenshots/responsive/${viewport.name.toLowerCase().replace(' ', '-')}.png`,
      fullPage: true,
    });
    
    // Test responsive navigation
    if (viewport.width < 768) {
      // Mobile: hamburger menu
      await expect(page.locator('.hamburger-menu')).toBeVisible();
      await expect(page.locator('.desktop-nav')).toBeHidden();
    } else {
      // Desktop: full navigation
      await expect(page.locator('.hamburger-menu')).toBeHidden();
      await expect(page.locator('.desktop-nav')).toBeVisible();
    }
    
    // Test responsive typography
    const fontSize = await page.locator('h1').evaluate((el) => {
      return parseInt(window.getComputedStyle(el).fontSize);
    });
    
    if (viewport.width < 768) {
      expect(fontSize).toBeLessThanOrEqual(32); // Smaller on mobile
    } else {
      expect(fontSize).toBeGreaterThanOrEqual(32); // Larger on desktop
    }
  });
}
```

#### Responsive Grid Layout Testing

```typescript
test('product grid responsiveness', async ({ page }) => {
  await page.goto('/products');
  
  // Helper function to count grid columns
  const getGridColumns = async () => {
    return await page.locator('.product-grid').evaluate((el) => {
      const style = window.getComputedStyle(el);
      const columns = style.gridTemplateColumns.split(' ').length;
      return columns;
    });
  };
  
  // Mobile: 1 column
  await page.setViewportSize({ width: 375, height: 667 });
  expect(await getGridColumns()).toBe(1);
  
  // Tablet: 2 columns
  await page.setViewportSize({ width: 768, height: 1024 });
  expect(await getGridColumns()).toBe(2);
  
  // Desktop: 3 columns
  await page.setViewportSize({ width: 1280, height: 720 });
  expect(await getGridColumns()).toBe(3);
  
  // Large Desktop: 4 columns
  await page.setViewportSize({ width: 1920, height: 1080 });
  expect(await getGridColumns()).toBe(4);
});

// Test flexbox wrapping
test('flexbox responsive layout', async ({ page }) => {
  await page.goto('/');
  
  // Mobile: items stack vertically
  await page.setViewportSize({ width: 375, height: 667 });
  const mobileLayout = await page.locator('.flex-container').evaluate((el) => {
    return window.getComputedStyle(el).flexDirection;
  });
  expect(mobileLayout).toBe('column');
  
  // Desktop: items in a row
  await page.setViewportSize({ width: 1280, height: 720 });
  const desktopLayout = await page.locator('.flex-container').evaluate((el) => {
    return window.getComputedStyle(el).flexDirection;
  });
  expect(desktopLayout).toBe('row');
});
```

#### Media Query Testing

```typescript
test('CSS media queries', async ({ page }) => {
  await page.goto('/');
  
  // Test mobile-first media query
  await page.setViewportSize({ width: 375, height: 667 });
  let backgroundColor = await page.locator('body').evaluate((el) => {
    return window.getComputedStyle(el).backgroundColor;
  });
  expect(backgroundColor).toBe('rgb(255, 255, 255)'); // Mobile: white
  
  // Test tablet media query (@media min-width: 768px)
  await page.setViewportSize({ width: 768, height: 1024 });
  backgroundColor = await page.locator('body').evaluate((el) => {
    return window.getComputedStyle(el).backgroundColor;
  });
  expect(backgroundColor).toBe('rgb(240, 240, 240)'); // Tablet: light gray
  
  // Test desktop media query (@media min-width: 1024px)
  await page.setViewportSize({ width: 1280, height: 720 });
  backgroundColor = await page.locator('body').evaluate((el) => {
    return window.getComputedStyle(el).backgroundColor;
  });
  expect(backgroundColor).toBe('rgb(250, 250, 250)'); // Desktop: off-white
});
```

#### Responsive Images Testing

```typescript
test('responsive images (srcset)', async ({ page }) => {
  await page.goto('/gallery');
  
  // Mobile: should load small image
  await page.setViewportSize({ width: 375, height: 667 });
  await page.reload();
  const mobileImageSrc = await page.locator('.hero-image').getAttribute('src');
  expect(mobileImageSrc).toContain('small'); // e.g., image-small.jpg
  
  // Desktop: should load large image
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.reload();
  const desktopImageSrc = await page.locator('.hero-image').getAttribute('src');
  expect(desktopImageSrc).toContain('large'); // e.g., image-large.jpg
});

// Test picture element
test('picture element responsiveness', async ({ page }) => {
  await page.goto('/');
  
  const pictureElement = page.locator('picture img');
  
  // Mobile: WebP format, small size
  await page.setViewportSize({ width: 375, height: 667 });
  await page.reload();
  const mobileSrc = await pictureElement.getAttribute('src');
  expect(mobileSrc).toMatch(/(small.*\.webp|fallback-small\.jpg)/);
  
  // Desktop: WebP format, large size
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.reload();
  const desktopSrc = await pictureElement.getAttribute('src');
  expect(desktopSrc).toMatch(/(large.*\.webp|fallback-large\.jpg)/);
});
```

#### Responsive Form Testing

```typescript
test('responsive form layout', async ({ page }) => {
  await page.goto('/contact');
  
  // Mobile: form fields stack vertically
  await page.setViewportSize({ width: 375, height: 667 });
  const mobileFirstNameBox = await page.locator('#firstName').boundingBox();
  const mobileLastNameBox = await page.locator('#lastName').boundingBox();
  
  // Verify vertical stacking (lastName is below firstName)
  expect(mobileLastNameBox!.y).toBeGreaterThan(mobileFirstNameBox!.y + mobileFirstNameBox!.height);
  
  // Desktop: form fields side by side
  await page.setViewportSize({ width: 1280, height: 720 });
  const desktopFirstNameBox = await page.locator('#firstName').boundingBox();
  const desktopLastNameBox = await page.locator('#lastName').boundingBox();
  
  // Verify horizontal layout (same row)
  expect(Math.abs(desktopFirstNameBox!.y - desktopLastNameBox!.y)).toBeLessThan(10);
  expect(desktopLastNameBox!.x).toBeGreaterThan(desktopFirstNameBox!.x);
});
```

**Best Practices for Cross-Browser Testing:**

1. **Test Critical Paths on All Browsers**: Login, checkout, core features
2. **Visual Regression Testing**: Catch layout shifts across browsers
3. **Use Feature Detection**: Don't rely on browser detection
4. **Progressive Enhancement**: Build for oldest browsers, enhance for modern
5. **Monitor Browser Market Share**: Prioritize based on your user analytics
6. **Test on Real Devices**: Emulation is good, but test iOS Safari on real iPhone periodically

---

---

## 24. VS Code Productivity (Extensions, Snippets)

### Why Use VS Code for Playwright?

**Visual Studio Code** is the most popular IDE for Playwright development, with **dedicated extension support** and excellent TypeScript integration.

**Benefits:**
- **Official Playwright Extension**: Test explorer, code generation, debugging
- **Intellisense & Auto-completion**: TypeScript type checking and API suggestions
- **Integrated Debugging**: Breakpoints, step-through execution, variable inspection
- **Live Test Results**: See pass/fail status inline in the editor
- **Pick Locator Tool**: Generate selectors by clicking on the page
- **Trace Viewer Integration**: Open traces directly from VS Code

---

### 24.1 Playwright VS Code Extension Features

#### Installation

**Extension Name**: Playwright Test for VSCode  
**Extension ID**: `ms-playwright.playwright`  
**Install via**:
1. VS Code Extensions Marketplace (search "Playwright")
2. Command line: `code --install-extension ms-playwright.playwright`
3. Direct link: [marketplace.visualstudio.com/items?itemName=ms-playwright.playwright](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)

#### Core Features Overview

| Feature | Description | Shortcut/Command |
|---------|-------------|------------------|
| **Test Explorer** | View all tests in sidebar tree view | Click Testing icon |
| **Run Single Test** | Execute one test with a click | Click ▶️ icon next to test |
| **Debug Test** | Run test with VS Code debugger | Right-click → Debug Test |
| **Record New Test** | Codegen recording mode | `Ctrl+Shift+P` → "Playwright: Record New" |
| **Pick Locator** | Generate selector by clicking page | `Ctrl+Shift+P` → "Playwright: Pick Locator" |
| **Show Trace** | Open trace viewer for failed tests | Click "Show Trace" in test output |
| **Run Tests (Project)** | Run all tests in specific browser | Select project in Test Explorer |

#### 1. Test Explorer

The **Test Explorer** provides a tree view of all your tests:

```
TESTING (sidebar icon)
└── 📁 Playwright Tests
    ├── 📁 tests/
    │   ├── 📁 auth/
    │   │   ├── ✅ login.spec.ts
    │   │   │   ├── ✅ should login with valid credentials
    │   │   │   └── ❌ should show error with invalid credentials
    │   │   └── ✅ signup.spec.ts
    │   ├── 📁 e2e/
    │   │   └── ✅ checkout.spec.ts
    └── 📁 Projects
        ├── chromium (3 tests)
        ├── firefox (3 tests)
        └── webkit (3 tests)
```

**Actions:**
- **Run All**: Click ▶️ at top level
- **Run File**: Click ▶️ next to file
- **Run Single Test**: Click ▶️ next to test name
- **Debug**: Right-click → "Debug Test"
- **Reveal in Explorer**: Right-click → "Reveal in File Explorer"

#### 2. Code Generation (Codegen)

**Codegen** records your browser interactions and generates test code:

```typescript
// Command: Ctrl+Shift+P → "Playwright: Record New Test"
// 1. Opens browser
// 2. You interact with the page
// 3. Playwright generates this code:

test('generated test', async ({ page }) => {
  await page.goto('https://example.com/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Welcome back!')).toBeVisible();
});
```

**Record at Cursor**: Records and inserts code at your current cursor position

#### 3. Pick Locator Tool

**Pick Locator** generates selectors by clicking elements on the page:

```
Command: Ctrl+Shift+P → "Playwright: Pick Locator"
```

1. Opens your application in browser
2. Hover over elements to see highlight
3. Click element to generate selector
4. Selector copied to clipboard

**Example Output:**
```typescript
page.getByRole('button', { name: 'Add to Cart' })
page.getByPlaceholder('Search products...')
page.getByText('Out of Stock')
page.locator('#product-123')
```

#### 4. Debugging with Breakpoints

Set breakpoints and step through test execution:

```typescript
test('debug example', async ({ page }) => {
  await page.goto('/');
  
  // Set breakpoint on next line (click gutter)
  await page.click('.product-link'); // ← Breakpoint here
  
  // When breakpoint hits:
  // - Inspect variables in Debug panel
  // - Use Debug Console to run: await page.title()
  // - Step through with F10 (Step Over) or F11 (Step Into)
});
```

**Debug Actions:**
- **Continue (F5)**: Resume execution
- **Step Over (F10)**: Execute current line, move to next
- **Step Into (F11)**: Enter function call
- **Step Out (Shift+F11)**: Exit current function
- **Restart (Ctrl+Shift+F5)**: Restart test

**Debug Console** (available during debugging):
```javascript
// Type in Debug Console while paused:
await page.title()              // Get page title
await page.locator('button').count()  // Count buttons
await page.screenshot({ path: 'debug.png' })  // Take screenshot
```

#### 5. Inline Test Results

VS Code shows test results directly in the editor:

```typescript
test('should login', async ({ page }) => {   // ✅ 1.2s
  await page.goto('/login');
  await page.fill('#email', 'user@example.com');
  await page.click('#submit');
  await expect(page).toHaveURL('/dashboard');
});

test('should show error', async ({ page }) => {  // ❌ 0.8s (view output)
  await page.goto('/login');
  await page.click('#submit');
  await expect(page.locator('.error')).toBeVisible();  // ← This failed
});
```

- **Green checkmark (✅)**: Test passed
- **Red X (❌)**: Test failed (click to see error)
- **Duration**: Execution time shown next to test name
- **Coverage**: Shows which lines executed (if coverage enabled)

#### 6. Trace Viewer Integration

When a test fails, VS Code offers to open the trace:

```
Test failed: should login ❌
  Expected toHaveURL: /dashboard
  Received: /login

[Show Trace] [Rerun Test] [Debug Test]
```

Click **Show Trace** to launch Playwright Trace Viewer with:
- Screenshots of each action
- Network requests
- Console logs
- DOM snapshots
- Action timeline

---

### 24.2 Custom VS Code Snippets for Playwright

#### Creating Custom Snippets

**Location**: `.vscode/playwright.code-snippets` (workspace-specific) or global snippets

**Complete Snippet File:**

```json
// .vscode/playwright.code-snippets
{
  "Playwright Test": {
    "prefix": "pw-test",
    "body": [
      "test('${1:test name}', async ({ page }) => {",
      "  await page.goto('${2:https://example.com}');",
      "  $0",
      "});"
    ],
    "description": "Create a basic Playwright test"
  },

  "Playwright Test with Multiple Fixtures": {
    "prefix": "pw-test-fixtures",
    "body": [
      "test('${1:test name}', async ({ page, request, context }) => {",
      "  await page.goto('${2:url}');",
      "  $0",
      "});"
    ],
    "description": "Test with page, request, and context fixtures"
  },

  "Playwright Describe Block": {
    "prefix": "pw-describe",
    "body": [
      "test.describe('${1:Test Suite}', () => {",
      "  test.beforeEach(async ({ page }) => {",
      "    await page.goto('${2:url}');",
      "  });",
      "",
      "  test('${3:test name}', async ({ page }) => {",
      "    $0",
      "  });",
      "",
      "  test.afterEach(async ({ page }) => {",
      "    // Cleanup",
      "  });",
      "});"
    ],
    "description": "Describe block with before/after hooks"
  },

  "Playwright Page Object Model": {
    "prefix": "pw-pom",
    "body": [
      "import { Page, Locator } from '@playwright/test';",
      "",
      "export class ${1:PageName}Page {",
      "  readonly page: Page;",
      "  readonly ${2:elementName}: Locator;",
      "",
      "  constructor(page: Page) {",
      "    this.page = page;",
      "    this.${2:elementName} = page.locator('${3:selector}');",
      "  }",
      "",
      "  async goto() {",
      "    await this.page.goto('${4:/path}');",
      "  }",
      "",
      "  async ${5:actionName}() {",
      "    $0",
      "  }",
      "}"
    ],
    "description": "Create a Page Object Model class"
  },

  "Playwright Custom Fixture": {
    "prefix": "pw-fixture",
    "body": [
      "import { test as base } from '@playwright/test';",
      "",
      "type ${1:FixtureName}Fixtures = {",
      "  ${2:fixtureName}: ${3:Type};",
      "};",
      "",
      "export const test = base.extend<${1:FixtureName}Fixtures>({",
      "  ${2:fixtureName}: async ({ page }, use) => {",
      "    // Setup: Create the fixture",
      "    const ${2:fixtureName} = ${4:/* initialize */};",
      "    $0",
      "    ",
      "    // Provide the fixture to the test",
      "    await use(${2:fixtureName});",
      "    ",
      "    // Teardown: Clean up after test",
      "  },",
      "});"
    ],
    "description": "Create a custom test fixture"
  },

  "Playwright API Test": {
    "prefix": "pw-api",
    "body": [
      "test('${1:API test name}', async ({ request }) => {",
      "  const response = await request.${2|get,post,put,delete,patch|}('${3:/api/endpoint}', {",
      "    ${4:data: {",
      "      key: 'value',",
      "    \\}}",
      "  });",
      "  ",
      "  expect(response.ok()).toBeTruthy();",
      "  expect(response.status()).toBe(${5:200});",
      "  ",
      "  const body = await response.json();",
      "  expect(body).toHaveProperty('${6:property}');",
      "  $0",
      "});"
    ],
    "description": "Create an API test with request fixture"
  },

  "Playwright Expect Assertion": {
    "prefix": "pw-expect",
    "body": [
      "await expect(page.locator('${1:selector}')).${2|toBeVisible,toBeHidden,toBeEnabled,toBeDisabled,toHaveText,toContainText,toHaveValue,toHaveAttribute,toHaveClass,toHaveCount|}(${3:expected});"
    ],
    "description": "Add a Playwright assertion"
  },

  "Playwright Wait For": {
    "prefix": "pw-wait",
    "body": [
      "await page.waitFor${1|Selector,LoadState,URL,Response,Request,Function,Timeout|}(${2:condition});"
    ],
    "description": "Add a wait statement"
  },

  "Playwright Screenshot": {
    "prefix": "pw-screenshot",
    "body": [
      "await page.screenshot({ path: '${1:screenshot.png}', fullPage: ${2|true,false|} });"
    ],
    "description": "Take a screenshot"
  },

  "Playwright Login Helper": {
    "prefix": "pw-login",
    "body": [
      "async function login(page: Page, email: string, password: string) {",
      "  await page.goto('/login');",
      "  await page.fill('#email', email);",
      "  await page.fill('#password', password);",
      "  await page.click('#login-button');",
      "  await page.waitForURL('**/dashboard');",
      "}"
    ],
    "description": "Create a reusable login helper function"
  },

  "Playwright beforeEach Hook": {
    "prefix": "pw-before-each",
    "body": [
      "test.beforeEach(async ({ page }) => {",
      "  await page.goto('${1:url}');",
      "  $0",
      "});"
    ],
    "description": "Add a beforeEach hook"
  },

  "Playwright afterEach Hook": {
    "prefix": "pw-after-each",
    "body": [
      "test.afterEach(async ({ page }) => {",
      "  $0",
      "});"
    ],
    "description": "Add an afterEach hook"
  },

  "Playwright Parameterized Test": {
    "prefix": "pw-param",
    "body": [
      "const testData = [",
      "  { ${1:input}: '${2:value1}', ${3:expected}: '${4:result1}' },",
      "  { ${1:input}: '${5:value2}', ${3:expected}: '${6:result2}' },",
      "];",
      "",
      "for (const data of testData) {",
      "  test(`should handle \\${data.${1:input}}`, async ({ page }) => {",
      "    await page.goto('${7:url}');",
      "    $0",
      "    await expect(page.locator('${8:selector}')).toHaveText(data.${3:expected});",
      "  });",
      "}"
    ],
    "description": "Create parameterized tests with data array"
  }
}
```

#### Using Snippets

1. Type the prefix (e.g., `pw-test`)
2. Press `Tab` or `Enter` to expand
3. Press `Tab` to jump between placeholders
4. Fill in values

**Example**:
```typescript
// Type: pw-test <Tab>
// Result:
test('test name', async ({ page }) => {
  await page.goto('https://example.com');
  |cursor here|
});
```

---

### 24.3 Debugging Configuration (launch.json)

#### Complete Debug Configuration

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Playwright Tests",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "test:debug"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "env": {
        "PWDEBUG": "1"  // Enable Playwright Inspector
      }
    },
    
    {
      "name": "Debug Current Test File",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/@playwright/test/cli.js",
      "args": [
        "test",
        "${file}",              // Current file
        "--headed",             // Show browser
        "--debug"               // Enable debugging
      ],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    },
    
    {
      "name": "Debug Current Test (Chromium)",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/@playwright/test/cli.js",
      "args": [
        "test",
        "${file}",
        "--project=chromium",
        "--headed",
        "--debug"
      ],
      "console": "integratedTerminal"
    },
    
    {
      "name": "Debug Specific Test",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/@playwright/test/cli.js",
      "args": [
        "test",
        "${workspaceFolder}/tests/login.spec.ts",
        "--headed",
        "--debug"
      ],
      "console": "integratedTerminal"
    },
    
    {
      "name": "Debug with Slow Motion",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/@playwright/test/cli.js",
      "args": [
        "test",
        "${file}",
        "--headed"
      ],
      "console": "integratedTerminal",
      "env": {
        "PLAYWRIGHT_SLOW_MO": "1000"  // Slow down by 1 second
      }
    },
    
    {
      "name": "Debug with Inspector",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/@playwright/test/cli.js",
      "args": [
        "test",
        "${file}",
        "--headed"
      ],
      "console": "integratedTerminal",
      "env": {
        "PWDEBUG": "1"  // Opens Playwright Inspector
      }
    },
    
    {
      "name": "Debug on Mobile Chrome",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/@playwright/test/cli.js",
      "args": [
        "test",
        "${file}",
        "--project=Mobile Chrome",
        "--headed",
        "--debug"
      ],
      "console": "integratedTerminal"
    }
  ]
}
```

#### How to Use Debug Configurations

1. **Set Breakpoints**: Click in the gutter (left of line numbers) to add red dot
2. **Select Configuration**: Click debug dropdown in Run and Debug panel
3. **Start Debugging**: Press **F5** or click green play button
4. **Debug Actions**:
   - **F5**: Continue
   - **F10**: Step Over
   - **F11**: Step Into
   - **Shift+F11**: Step Out
   - **Ctrl+Shift+F5**: Restart

---

### 24.4 Workspace Settings & Recommended Extensions

#### Workspace Settings

```json
// .vscode/settings.json
{
  // Playwright Extension Settings
  "playwright.reuseBrowser": true,         // Reuse browser between test runs
  "playwright.showTrace": "on",             // Always show trace viewer option
  
  // File Associations
  "files.associations": {
    "*.spec.ts": "typescript",
    "*.spec.js": "javascript",
    "playwright.config.ts": "typescript"
  },
  
  // Auto-save
  "files.autoSave": "onFocusChange",
  
  // TypeScript Settings
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.updateImportsOnFileMove.enabled": "always",
  "typescript.suggest.autoImports": true,
  
  // Editor Settings
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  
  // Terminal Settings
  "terminal.integrated.env.windows": {
    "NODE_OPTIONS": "--max-old-space-size=4096"
  },
  
  // Test Explorer Settings
  "testExplorer.useNativeTesting": true,
  
  // Search Exclusions (faster searching)
  "search.exclude": {
    "**/node_modules": true,
    "**/test-results": true,
    "**/playwright-report": true,
    "**/.playwright": true
  },
  
  // File Watcher Exclusions (better performance)
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/test-results/**": true,
    "**/playwright-report/**": true
  }
}
```

#### Recommended Extensions

| Extension | ID | Purpose |
|-----------|----|---------| 
| **Playwright Test for VSCode** | `ms-playwright.playwright` | Official Playwright extension (REQUIRED) |
| **ESLint** | `dbaeumer.vscode-eslint` | JavaScript/TypeScript linting |
| **Prettier** | `esbenp.prettier-vscode` | Code formatting |
| **Error Lens** | `usernamehw.errorlens` | Inline error messages |
| **GitLens** | `eamodio.gitlens` | Git blame and history |
| **Thunder Client** | `rangav.vscode-thunder-client` | API testing in VS Code |
| **Code Spell Checker** | `streetsidesoftware.code-spell-checker` | Catch typos |
| **Auto Rename Tag** | `formulahendry.auto-rename-tag` | HTML tag renaming |
| **Path Intellisense** | `christian-kohler.path-intellisense` | Autocomplete file paths |
| **TODO Highlight** | `wayou.vscode-todo-highlight` | Highlight TODO comments |

**Install All Recommended Extensions**:
```json
// .vscode/extensions.json
{
  "recommendations": [
    "ms-playwright.playwright",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "usernamehw.errorlens",
    "eamodio.gitlens",
    "rangav.vscode-thunder-client",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

#### Tasks Configuration

```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Run Playwright Tests",
      "type": "shell",
      "command": "npx playwright test",
      "group": {
        "kind": "test",
        "isDefault": true
      },
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "Run Playwright Tests (Headed)",
      "type": "shell",
      "command": "npx playwright test --headed",
      "group": "test"
    },
    {
      "label": "Open Playwright Report",
      "type": "shell",
      "command": "npx playwright show-report",
      "group": "test"
    },
    {
      "label": "Update Playwright Browsers",
      "type": "shell",
      "command": "npx playwright install",
      "group": "none"
    },
    {
      "label": "Codegen - Record Test",
      "type": "shell",
      "command": "npx playwright codegen ${input:url}",
      "group": "none"
    }
  ],
  "inputs": [
    {
      "id": "url",
      "type": "promptString",
      "description": "Enter URL to record",
      "default": "https://example.com"
    }
  ]
}
```

**Run Tasks**: `Ctrl+Shift+P` → "Tasks: Run Task"

**Best Practices for VS Code + Playwright:**

1. **Use Test Explorer**: Don't run tests from terminal, use the GUI
2. **Set Breakpoints Strategically**: Before failing assertions, not at the start
3. **Use Debug Console**: Run Playwright commands while debugging
4. **Save Workspace**: Save workspace settings for team consistency
5. **Enable Auto-save**: Avoid running stale code
6. **Configure Prettier**: Consistent code formatting across team
7. **Use Snippets**: Speed up test writing with custom snippets

---

## 25. Migration Guides

### Why Migrate to Playwright?

**Organizations migrate to Playwright** for several compelling reasons:

| Reason | Benefit |
|--------|---------|
| **Modern Architecture** | Built for modern web (SPAs, WebSockets, Shadow DOM) |
| **Auto-Waiting** | Eliminates 90% of flaky tests |
| **Multi-Browser** | Test Chromium, Firefox, WebKit with same code |
| **Better Performance** | 2-3x faster than Selenium |
| **Built-in Features** | API testing, mobile emulation, network interception |
| **Active Development** | Microsoft-backed, frequent releases |
| **Developer Experience** | TypeScript support, excellent debugging tools |

**Common Migration Scenarios:**
- Selenium → Playwright (most common)
- Cypress → Playwright (need multi-browser/multi-tab)
- Puppeteer → Playwright (need cross-browser support)

---

### 25.1 Migrating from Selenium to Playwright

#### Why Migrate from Selenium?

**Selenium Pain Points:**
1. **Flaky Tests**: Need explicit waits everywhere
2. **Slow Execution**: WebDriver protocol overhead
3. **Complex Setup**: Driver management, grid setup
4. **Limited Features**: No network interception, poor mobile emulation
5. **Verbose Syntax**: More boilerplate code

**Playwright Benefits:**
1. **Auto-Waiting**: Built-in smart waiting
2. **Faster**: Direct browser protocol communication
3. **Simple Setup**: `npm install` and done
4. **Rich Features**: Network control, mobile emulation, tracing
5. **Cleaner Code**: Modern async/await syntax

#### Comparison Table

| Feature | Selenium WebDriver | Playwright |
|---------|-------------------|------------|
| **Browser Support** | Chrome, Firefox, Safari, Edge, IE | Chromium, Firefox, WebKit |
| **Language Support** | Java, Python, C#, JavaScript, Ruby | JavaScript, TypeScript, Python, Java, .NET |
| **Auto-Waiting** | ❌ Manual explicit waits | ✅ Built-in intelligent waiting |
| **Browser Download** | ❌ Manual driver management | ✅ Automatic browser download |
| **Parallel Execution** | ⚠️ Manual (Selenium Grid) | ✅ Built-in workers |
| **Network Interception** | ❌ Not available | ✅ Full control |
| **Multi-Tab Support** | ✅ Window handles | ✅ Native page objects |
| **iFrame Handling** | ⚠️ Complex switching | ✅ Simple frameLocator |
| **Mobile Emulation** | ⚠️ Basic | ✅ Excellent |
| **Debugging Tools** | ⚠️ IDE-dependent | ✅ Playwright Inspector, Trace Viewer |
| **API Testing** | ❌ Requires additional libraries | ✅ Built-in request context |
| **Test Runner** | ❌ Need Jest/Mocha/TestNG | ✅ @playwright/test included |
| **Speed** | ⚡ Moderate | ⚡⚡⚡ Fast (2-3x faster) |
| **Learning Curve** | ⚡⚡⚡ Steep | ⚡⚡ Medium |

#### Code Conversion Examples

**Example 1: Basic Navigation & Interaction**

```javascript
// ❌ Selenium WebDriver (JavaScript)
const { Builder, By, until } = require('selenium-webdriver');

async function seleniumTest() {
  const driver = await new Builder().forBrowser('chrome').build();
  
  try {
    // Navigate
    await driver.get('https://example.com/login');
    
    // Find and fill email
    const emailInput = await driver.findElement(By.id('email'));
    await emailInput.sendKeys('user@example.com');
    
    // Find and fill password
    const passwordInput = await driver.findElement(By.id('password'));
    await passwordInput.sendKeys('password123');
    
    // Click submit
    const submitButton = await driver.findElement(By.id('submit'));
    await submitButton.click();
    
    // Wait for URL change
    await driver.wait(until.urlContains('dashboard'), 10000);
    
    // Verify element
    await driver.wait(until.elementLocated(By.css('.welcome-message')), 10000);
    const welcomeMsg = await driver.findElement(By.css('.welcome-message'));
    const isDisplayed = await welcomeMsg.isDisplayed();
    console.assert(isDisplayed, 'Welcome message should be visible');
    
  } finally {
    await driver.quit();
  }
}
```

```typescript
// ✅ Playwright (TypeScript)
import { test, expect } from '@playwright/test';

test('login flow', async ({ page }) => {
  // Navigate
  await page.goto('https://example.com/login');
  
  // Fill inputs (auto-waits for elements)
  await page.fill('#email', 'user@example.com');
  await page.fill('#password', 'password123');
  
  // Click submit (auto-waits for clickable)
  await page.click('#submit');
  
  // Wait for URL (auto-waits)
  await expect(page).toHaveURL(/dashboard/);
  
  // Verify element (auto-waits for visible)
  await expect(page.locator('.welcome-message')).toBeVisible();
});
```

**Example 2: Dropdowns & Selections**

```javascript
// ❌ Selenium
const dropdown = await driver.findElement(By.id('country'));
await dropdown.click();
const option = await driver.findElement(By.css('option[value="USA"]'));
await option.click();
```

```typescript
// ✅ Playwright
await page.selectOption('#country', 'USA');
// or
await page.selectOption('#country', { label: 'United States' });
```

**Example 3: Alerts & Dialogs**

```javascript
// ❌ Selenium
await driver.wait(until.alertIsPresent(), 5000);
const alert = await driver.switchTo().alert();
const alertText = await alert.getText();
await alert.accept();
```

```typescript
// ✅ Playwright
page.on('dialog', async dialog => {
  console.log(dialog.message());
  await dialog.accept();
});
await page.click('#trigger-alert');
```

**Example 4: iFrames**

```javascript
// ❌ Selenium
await driver.switchTo().frame(0);
const elementInFrame = await driver.findElement(By.id('inside-iframe'));
await elementInFrame.click();
await driver.switchTo().defaultContent();
```

```typescript
// ✅ Playwright
const frame = page.frameLocator('iframe');
await frame.locator('#inside-iframe').click();
// No need to switch back!
```

**Example 5: Multiple Windows/Tabs**

```javascript
// ❌ Selenium
const originalWindow = await driver.getWindowHandle();
await driver.findElement(By.linkText('Open new tab')).click();

const windows = await driver.getAllWindowHandles();
const newWindow = windows.find(handle => handle !== originalWindow);
await driver.switchTo().window(newWindow);

// Do actions in new tab
await driver.findElement(By.id('something')).click();

await driver.close();
await driver.switchTo().window(originalWindow);
```

```typescript
// ✅ Playwright
const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  page.click('a[target="_blank"]')
]);

// Work with new page
await newPage.click('#something');
await newPage.close();

// Original page still active
```

#### Step-by-Step Migration Process

**Phase 1: Setup (Week 1)**

1. **Install Playwright**
   ```bash
   npm install --save-dev @playwright/test
   npx playwright install
   ```

2. **Create Playwright Config**
   ```typescript
   // playwright.config.ts
   import { defineConfig } from '@playwright/test';
   
   export default defineConfig({
     testDir: './tests',
     timeout: 30000,
     use: {
       baseURL: process.env.BASE_URL || 'https://example.com',
       screenshot: 'only-on-failure',
       video: 'retain-on-failure',
     },
     projects: [
       { name: 'chromium', use: { browserName: 'chromium' } },
     ],
   });
   ```

3. **Run Parallel Suites** (Selenium existing + Playwright new)
   ```json
   {
     "scripts": {
       "test:selenium": "mocha tests/selenium/**/*.spec.js",
       "test:playwright": "playwright test",
       "test:all": "npm run test:selenium && npm run test:playwright"
     }
   }
   ```

**Phase 2: Migration (Weeks 2-8)**

1. **Convert Smoke Tests First** (20% of tests, 80% coverage)
   - Login flows
   - Critical user journeys
   - Payment flows

2. **Convert by Feature** (not by test file)
   - All auth tests → Playwright
   - All checkout tests → Playwright
   - Incremental migration

3. **Use Migration Checklist**:
   ```markdown
   - [ ] Remove explicit waits
   - [ ] Convert WebElement to Locator
   - [ ] Update assertions to expect()
   - [ ] Remove driver.quit() (handled by fixtures)
   - [ ] Update selectors (CSS preferred)
   - [ ] Test runs successfully
   - [ ] Delete Selenium version
   ```

**Phase 3: Cleanup (Week 9-10)**

1. **Remove Selenium Dependencies**
   ```bash
   npm uninstall selenium-webdriver chromedriver
   ```

2. **Update CI/CD Pipelines**
   ```yaml
   - name: Run Playwright Tests
     run: npx playwright test
   ```

3. **Archive Old Tests** (don't delete immediately)
   ```bash
   git mv tests/selenium tests-archive/selenium-backup
   ```

#### Migration Mapping Table

| Selenium Command | Playwright Equivalent | Notes |
|-----------------|----------------------|-------|
| `driver.get(url)` | `page.goto(url)` | |
| `driver.findElement(By.id('x'))` | `page.locator('#x')` | Returns locator, not element |
| `driver.findElements(By.css('.x'))` | `page.locator('.x')` | Single API for single/multiple |
| `element.click()` | `page.click(selector)` | Auto-waits |
| `element.sendKeys(text)` | `page.fill(selector, text)` | Clears first |
| `element.getText()` | `await page.textContent(selector)` | |
| `element.getAttribute('href')` | `await page.getAttribute(selector, 'href')` | |
| `element.isDisplayed()` | `await page.locator(selector).isVisible()` | |
| `element.isEnabled()` | `await page.locator(selector).isEnabled()` | |
| `driver.wait(until.elementLocated())` | Remove (auto-waits) | |
| `driver.wait(until.elementIsVisible())` | Remove (auto-waits) | |
| `driver.executeScript()` | `page.evaluate()` | |
| `driver.switchTo().frame()` | `page.frameLocator()` | |
| `driver.switchTo().alert()` | `page.on('dialog')` | Event-based |
| `driver.switchTo().window()` | `context.pages()` | Multiple page objects |
| `driver.getTitle()` | `await page.title()` | |
| `driver.getCurrentUrl()` | `page.url()` | |
| `driver.navigate().back()` | `await page.goBack()` | |
| `driver.navigate().forward()` | `await page.goForward()` | |
| `driver.navigate().refresh()` | `await page.reload()` | |
| `driver.manage().window().maximize()` | Set viewport size | |
| `driver.quit()` | Remove (auto-handled) | Fixture cleanup |

#### Common Migration Pitfalls

**Pitfall 1: Forgetting await**
```typescript
// ❌ Wrong (from Selenium synchronous mindset)
page.goto('/');  // Won't work!

// ✅ Correct
await page.goto('/');
```

**Pitfall 2: Using ElementHandle instead of Locator**
```typescript
// ❌ Selenium style (works but not recommended)
const button = await page.$('button');
await button.click();

// ✅ Playwright style (better)
await page.locator('button').click();
```

**Pitfall 3: Keeping explicit waits**
```typescript
// ❌ Unnecessary wait (from Selenium habit)
await page.waitForTimeout(5000);  // BAD!
await page.click('button');

// ✅ Playwright auto-waits
await page.click('button');  // Already waits intelligently
```

**Pitfall 4: Not using test fixtures**
```typescript
// ❌ Manual browser management
test('my test', async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  // test code
  await browser.close();
});

// ✅ Use fixtures
test('my test', async ({ page }) => {
  // page is ready, cleanup automatic
});
```

---

### 25.2 Migrating from Cypress to Playwright

#### Why Migrate from Cypress?

**Cypress Limitations:**
1. **Single Browser Tab**: Cannot test multi-tab workflows
2. **No Safari/WebKit**: Chrome, Firefox, Edge only
3. **No Multi-Domain**: Tests must stay on same domain
4. **iFrame Limitations**: Complex iframe interactions difficult
5. **No Native Events**: Simulated events only

**Playwright Advantages:**
1. **Multi-Tab Support**: Full support for multiple tabs/windows
2. **True Cross-Browser**: Including WebKit (Safari)
3. **Multi-Domain**: Can navigate across domains easily
4. **Full iFrame Support**: Native iframe handling
5. **Real Browser Events**: Actual user interactions

#### Comparison Table

| Feature | Cypress | Playwright |
|---------|---------|------------|
| **Multi-tab** | ❌ Not supported | ✅ Full support |
| **Multi-domain** | ❌ Limited | ✅ No restrictions |
| **Safari/WebKit** | ❌ No | ✅ Yes |
| **iFrame handling** | ⚠️ Limited | ✅ Excellent |
| **Test isolation** | ⚠️ Shared browser | ✅ Fresh context per test |
| **Speed** | ⚡⚡ Fast | ⚡⚡⚡ Faster |
| **Network stubbing** | ✅ Great | ✅ Excellent |
| **Auto-waiting** | ✅ Built-in | ✅ Built-in |
| **Debugging** | ✅ Time-travel | ✅ Trace viewer |
| **TypeScript** | ✅ Good support | ✅ Excellent support |

#### Code Conversion Examples

**Example 1: Basic Test Structure**

```javascript
// ❌ Cypress
describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should login successfully', () => {
    cy.get('#email').type('user@example.com');
    cy.get('#password').type('password123');
    cy.get('#submit').click();
    cy.url().should('include', '/dashboard');
    cy.get('.welcome').should('be.visible');
  });
});
```

```typescript
// ✅ Playwright
import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should login successfully', async ({ page }) => {
    await page.fill('#email', 'user@example.com');
    await page.fill('#password', 'password123');
    await page.click('#submit');
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('.welcome')).toBeVisible();
  });
});
```

**Example 2: Assertions**

```javascript
// Cypress
cy.get('.title').should('have.text', 'Welcome');
cy.get('.button').should('be.disabled');
cy.get('.list').should('have.length', 5);
cy.url().should('contain', '/dashboard');
```

```typescript
// Playwright
await expect(page.locator('.title')).toHaveText('Welcome');
await expect(page.locator('.button')).toBeDisabled();
await expect(page.locator('.list')).toHaveCount(5);
await expect(page).toHaveURL(/dashboard/);
```

**Example 3: Network Interception**

```javascript
// Cypress
cy.intercept('GET', '/api/users', { fixture: 'users.json' }).as('getUsers');
cy.visit('/users');
cy.wait('@getUsers');
```

```typescript
// Playwright
await page.route('**/api/users', route => {
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(require('./fixtures/users.json')),
  });
});
await page.goto('/users');
```

**Example 4: Custom Commands → Fixtures**

```javascript
// Cypress custom command
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('#email').type(email);
  cy.get('#password').type(password);
  cy.get('#submit').click();
});

// Usage
cy.login('user@example.com', 'password123');
```

```typescript
// Playwright fixture
import { test as base } from '@playwright/test';

const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/login');
    await page.fill('#email', 'user@example.com');
    await page.fill('#password', 'password123');
    await page.click('#submit');
    await page.waitForURL('**/dashboard');
    await use(page);
  },
});

// Usage
test('dashboard test', async ({ authenticatedPage }) => {
  // Already logged in!
});
```

#### Command Mapping Table

| Cypress | Playwright |
|---------|------------|
| `cy.visit(url)` | `await page.goto(url)` |
| `cy.get(selector)` | `page.locator(selector)` |
| `cy.contains(text)` | `page.locator('text=...')` |
| `cy.type(text)` | `await page.fill(selector, text)` |
| `cy.clear()` | `await page.fill(selector, '')` |
| `cy.click()` | `await page.click(selector)` |
| `cy.dblclick()` | `await page.dblclick(selector)` |
| `cy.check()` | `await page.check(selector)` |
| `cy.uncheck()` | `await page.uncheck(selector)` |
| `cy.select(value)` | `await page.selectOption(selector, value)` |
| `cy.should('be.visible')` | `await expect(locator).toBeVisible()` |
| `cy.should('have.text', text)` | `await expect(locator).toHaveText(text)` |
| `cy.should('have.value', val)` | `await expect(locator).toHaveValue(val)` |
| `cy.url().should('include', path)` | `await expect(page).toHaveURL(/path/)` |
| `cy.wait(ms)` | `await page.waitForTimeout(ms)` (avoid!) |
| `cy.wait('@alias')` | `await page.waitForResponse()` |
| `cy.intercept()` | `await page.route()` |
| `cy.request()` | `await request.get/post()` |
| `cy.fixture()` | `require('./fixtures/data.json')` |
| `cy.window()` | `await page.evaluate(() => window)` |
| `cy.document()` | `await page.evaluate(() => document)` |
| `cy.reload()` | `await page.reload()` |
| `cy.go('back')` | `await page.goBack()` |
| `cy.screenshot()` | `await page.screenshot()` |

---

### 25.3 Migrating from Puppeteer to Playwright

#### Why Migrate from Puppeteer?

**Puppeteer Limitations:**
1. **Chromium Only**: No Firefox or WebKit support
2. **No Test Runner**: Need to add Jest/Mocha
3. **Basic Auto-Waiting**: Not as sophisticated
4. **No Built-in Assertions**: Need assertion library

**Playwright Advantages:**
1. **Multi-Browser**: Chromium, Firefox, WebKit
2. **Test Runner Included**: @playwright/test framework
3. **Advanced Auto-Waiting**: Smarter element interaction
4. **Built-in Assertions**: expect() included

#### Migration Notes

Puppeteer and Playwright have **very similar APIs** (same team created both), so migration is straightforward:

```javascript
// Puppeteer
const puppeteer = require('puppeteer');
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto('https://example.com');
await page.type('#email', 'user@example.com');
await page.click('#submit');
await browser.close();
```

```typescript
// Playwright (almost identical!)
import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('https://example.com');
await page.fill('#email', 'user@example.com'); // or page.type()
await page.click('#submit');
await browser.close();
```

**Key Differences:**

1. **Browser Import**
   ```javascript
   // Puppeteer
   const puppeteer = require('puppeteer');
   const browser = await puppeteer.launch();
   
   // Playwright
   const { chromium, firefox, webkit } = require('playwright');
   const browser = await chromium.launch(); // or firefox, webkit
   ```

2. **Fill vs Type**
   ```javascript
   // Puppeteer
   await page.type('#input', 'text');
   
   // Playwright (recommended)
   await page.fill('#input', 'text'); // Clears first
   // or
   await page.type('#input', 'text'); // Types character by character
   ```

3. **Test Runner**
   ```javascript
   // Puppeteer + Jest
   describe('Tests', () => {
     let browser, page;
     beforeAll(async () => {
       browser = await puppeteer.launch();
       page = await browser.newPage();
     });
     afterAll(async () => {
       await browser.close();
     });
   });
   
   // Playwright Test (built-in)
   import { test } from '@playwright/test';
   test('my test', async ({ page }) => {
     // page ready, cleanup automatic
   });
   ```

---

### 25.4 Common Migration Pitfalls & Solutions

#### Pitfall 1: Element Not Found (Too Fast Execution)

**Problem**: Coming from Selenium, you might add explicit waits, but Playwright already auto-waits.

```typescript
// ❌ Unnecessary (Selenium habit)
await page.waitForSelector('#button');
await page.click('#button');

// ✅ Playwright auto-waits
await page.click('#button');
```

**Solution**: Trust auto-waiting, only add explicit waits for special cases (network, animations).

---

#### Pitfall 2: Async/Await Everywhere

**Problem**: Forgetting `await` on asynchronous operations.

```typescript
// ❌ Forgot await
page.goto('/');  // Promise not awaited!
page.fill('#email', 'test@example.com');  // Will fail!

// ✅ Always await Playwright actions
await page.goto('/');
await page.fill('#email', 'test@example.com');
```

**Solution**: Add ESLint rule to catch missing awaits:
```json
{
  "rules": {
    "@typescript-eslint/no-floating-promises": "error"
  }
}
```

---

#### Pitfall 3: Locator vs ElementHandle

**Problem**: Using ElementHandles (`page.$()`) instead of Locators.

```typescript
// ❌ ElementHandle (Puppeteer style)
const button = await page.$('#button');
await button.click();

// ✅ Locator (Playwright style, better)
await page.locator('#button').click();
```

**Why Locators are better:**
- Auto-retry on stale elements
- Better error messages
- Support for advanced selectors
- More powerful assertions

---

#### Pitfall 4: Browser Context Confusion

**Problem**: Expecting shared state between tests (from Cypress mindset).

```typescript
// ❌ Expecting shared state
test('test 1', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('key', 'value'));
});

test('test 2', async ({ page }) => {
  // This is a FRESH context - localStorage is empty!
  const value = await page.evaluate(() => localStorage.getItem('key'));
  expect(value).toBe('value'); // ❌ FAILS! value is null
});
```

**Solution**: Use fixtures or global setup to share state:
```typescript
// Option 1: Fixture
const test = base.extend({
  storageState: async ({}, use) => {
    await use({ localStorage: [{ name: 'key', value: 'value' }] });
  },
});

// Option 2: storageState file
test.use({ storageState: 'state.json' });
```

---

#### Pitfall 5: Network Interception Syntax

**Problem**: Different syntax from Cypress/Puppeteer.

```javascript
// Cypress
cy.intercept('GET', '/api/users', { fixture: 'users.json' });

// Puppeteer
await page.setRequestInterception(true);
page.on('request', request => {
  request.respond({ body: mockData });
});

// ✅ Playwright
await page.route('**/api/users', route => {
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(mockData),
  });
});
```

---

#### Pitfall 6: Selector Strategy Changes

**Problem**: XPath heavily used in Selenium, but Playwright prefers CSS/Text selectors.

```typescript
// ❌ Complex XPath (Selenium style)
await page.locator('//div[@class="container"]//button[contains(text(), "Submit")]').click();

// ✅ Simpler Playwright selectors
await page.locator('button:has-text("Submit")').click();
// or
await page.getByRole('button', { name: 'Submit' }).click();
```

**Best Practices:**
1. Use `data-testid` attributes
2. Use role-based selectors (`getByRole`)
3. Use text selectors (`getByText`)
4. CSS selectors for complex cases
5. XPath only when absolutely necessary

---

#### Migration Checklist

```markdown
## Pre-Migration
- [ ] Document current test structure
- [ ] Identify critical test paths (smoke tests)
- [ ] Set up Playwright in parallel (don't replace immediately)
- [ ] Train team on Playwright basics
- [ ] Create Page Objects / helper library

## During Migration
- [ ] Migrate smoke tests first (highest ROI)
- [ ] Convert one feature at a time
- [ ] Remove explicit waits
- [ ] Update selectors to use best practices
- [ ] Add Playwright assertions
- [ ] Run both old and new tests in CI
- [ ] Fix flaky tests before declaring migration complete

## Post-Migration
- [ ] Remove old framework dependencies
- [ ] Update CI/CD pipelines
- [ ] Update team documentation
- [ ] Archive old tests (don't delete yet)
- [ ] Monitor test stability for 2 weeks
- [ ] Celebrate! 🎉
```

**Migration Timeline Example:**
- **Week 1**: Setup, training, proof of concept
- **Weeks 2-4**: Migrate smoke tests (20% of tests)
- **Weeks 5-10**: Migrate regression tests (80% of tests)
- **Week 11**: Cleanup, documentation, final validation
- **Week 12**: Remove old framework, go-live

---

### 25.4 Common Migration Pitfalls & Solutions

#### Pitfall 1: Element Not Found (Too Fast)

```typescript
// ❌ Selenium mindset - explicit waits
await page.waitForSelector('#element');
await page.click('#element');

// ✅ Playwright - auto-wait
await page.click('#element'); // Already waits!
```

#### Pitfall 2: Async/Await Everywhere

```typescript
// ❌ Forgetting await
page.goto('https://example.com'); // Won't work!

// ✅ Always await
await page.goto('https://example.com');
```

#### Pitfall 3: Locator vs Element Handle

```typescript
// ❌ Using element handles (Puppeteer style)
const element = await page.$('#button');
await element.click();

// ✅ Using locators (Playwright style)
await page.locator('#button').click();
```

#### Pitfall 4: Browser Context Confusion

```typescript
// ❌ Sharing state between tests
test('test 1', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('key', 'value'));
});

test('test 2', async ({ page }) => {
  // ✅ Fresh context - localStorage is empty!
  const value = await page.evaluate(() => localStorage.getItem('key'));
  expect(value).toBeNull(); // True!
});
```

#### Pitfall 5: Network Interception

```typescript
// Cypress
cy.intercept('GET', '/api/users', { fixture: 'users.json' });

// Playwright
await page.route('**/api/users', route => {
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(require('./fixtures/users.json')),
  });
});
```

---

## 26. CLI Reference & Command-Line Options

### Why Master Playwright CLI?

The **Playwright command-line interface** is your gateway to:
- **Local Development**: Run tests quickly while coding
- **CI/CD Integration**: Flexible automation pipeline execution
- **Debugging**: Powerful debugging modes and tools
- **Advanced Features**: Sharding, filtering, parallel execution
- **Code Generation**: Automatic test script creation

**Interview Relevance:** Interviewers often ask about CLI usage, parallel execution strategies, debugging techniques, and CI/CD integration. Mastering the CLI demonstrates practical experience and efficiency.

---

### 26.1 Complete CLI Command Reference

#### Basic Test Execution

**Understanding Test Execution:**
- **Default**: Runs all tests in headless mode across configured browsers
- **File/Directory**: Target specific tests for faster feedback
- **Pattern Matching**: Use filename patterns to run related tests

```bash
# Run all tests (default configuration)
npx playwright test

# Run specific file
npx playwright test tests/auth/login.spec.ts

# Run all tests in directory
npx playwright test tests/auth/

# Run tests matching filename pattern
npx playwright test login  # Matches *login*
```

**When to Use:**
- All tests: Before committing code, in CI/CD pipelines
- Specific file: While developing/debugging that feature
- Directory: Testing a feature module
- Pattern: Smoke tests, regression suites

---

#### Browser Selection

**Why Important:** Cross-browser testing ensures compatibility. Each browser has unique rendering engines and behaviors.

| CLI Option | Browser Engine | Use Case |
|------------|---------------|----------|
| `--project=chromium` | Chromium (Blink) | Chrome, Edge, Opera users |
| `--project=firefox` | Gecko | Firefox users, unique CSS behaviors |
| `--project=webkit` | WebKit | Safari users, iOS/macOS testing |

```bash
# Run tests in single browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run tests in multiple browsers
npx playwright test --project=chromium --project=firefox

# Run all configured projects
npx playwright test  # Uses projects from config
```

**Best Practice:**
- **Local Development**: Use single browser (chromium) for speed
- **CI/CD**: Run all browsers to catch cross-browser issues
- **Debugging**: Use webkit for Safari-specific bugs

---

#### Debugging Options

**Debugging Philosophy:** Playwright provides multiple debugging modes for different scenarios.

| Mode | Use Case | Features |
|------|----------|----------|
| `--debug` | Step-through debugging | Playwright Inspector, pause execution |
| `--headed` | Visual feedback | See browser actions live |
| `--ui` | Interactive testing | Modern UI with time travel |
| `--trace on` | Post-mortem debugging | Record trace for later analysis |

```bash
# Debug mode with Playwright Inspector
npx playwright test --debug
# Automatically pauses before each action, shows selectors

# Headed mode (see browser)
npx playwright test --headed
# Browser window visible, faster than debug mode

# UI mode (new in v1.32)
npx playwright test --ui
# Interactive UI with watch mode, time travel, inspector

# Record trace for debugging
npx playwright test --trace on
# Creates trace.zip for later analysis with show-trace
```

**When to Use Each:**
- **--debug**: Investigating test failures, learning Playwright
- **--headed**: Quick visual verification, demos
- **--ui**: Developing new tests interactively
- **--trace on**: CI failures, complex debugging

---

#### Test Filtering

**Why Filter Tests?** Run only relevant tests for faster feedback and targeted testing.

| Filter Method | Purpose | Example |
|--------------|---------|---------|
| `--grep` | Include tests matching pattern | `--grep @smoke` |
| `--grep-invert` | Exclude tests matching pattern | `--grep-invert @slow` |
| Filename | Match test file names | `npx playwright test login` |
| `--project` | Run specific browser/config | `--project=mobile` |

```bash
# Run tests with specific tag
npx playwright test --grep @smoke
# Matches test.describe or test with @smoke annotation

# Exclude tests with tag
npx playwright test --grep-invert @slow
# Skips tests marked @slow

# Combine filters
npx playwright test --grep @smoke --grep-invert @flaky
# Run smoke tests except flaky ones

# Filter by filename pattern
npx playwright test login
# Runs tests in files containing "login"

# Multiple patterns
npx playwright test auth login
# Runs files matching "auth" OR "login"
```

**Test Tagging Example:**
```typescript
test.describe('Login Tests @smoke', () => {
  test('basic login @critical', async ({ page }) => {
    // Test implementation
  });
  
  test('OAuth login @slow', async ({ page }) => {
    // Test implementation
  });
});

// Run: npx playwright test --grep @smoke
// Runs both tests

// Run: npx playwright test --grep "@smoke" --grep-invert "@slow"
// Runs only basic login
```

---

#### Parallel Execution & Performance

**Why Parallel Testing?** Reduce test execution time by running tests concurrently.

| Option | Purpose | Recommendation |
|--------|---------|----------------|
| `--workers=N` | Set number of parallel workers | Use CPU cores - 1 |
| `--workers=1` | Sequential execution | Debugging, shared resources |
| `--workers=50%` | Percentage of CPU cores | Cloud CI with limited resources |
| `--fully-parallel` | Run tests in same file in parallel | Fast execution (requires test isolation) |

```bash
# Run with 4 parallel workers
npx playwright test --workers=4

# Run sequentially (one at a time)
npx playwright test --workers=1
# Good for: debugging, tests with shared state

# Use percentage of available cores
npx playwright test --workers=50%

# Fully parallel mode (tests in same file run parallel)
npx playwright test --fully-parallel
# Requires: independent tests with no shared state
```

**Performance Formula:**
```
Execution Time ≈ (Total Test Time) / (Number of Workers)

Example:
- 100 tests, 5 seconds each = 500 seconds total
- 4 workers: 500 / 4 = 125 seconds (~2 minutes)
- 1 worker: 500 seconds (~8 minutes)
```

**Best Practices:**
- **Local**: `--workers=2` or `--workers=4` (don't max out CPU)
- **CI**: `--workers=4` to `--workers=8` (balance cost vs speed)
- **Large Suite**: Consider sharding for horizontal scaling

---

#### Test Sharding (Distributed Testing)

**What is Sharding?** Distribute tests across multiple machines for massive parallelization.

```bash
# Run shard 1 of 4 total shards
npx playwright test --shard=1/4

# Run shard 2 of 4
npx playwright test --shard=2/4

# Run shard 3 of 4
npx playwright test --shard=3/4

# Run shard 4 of 4
npx playwright test --shard=4/4
```

**CI/CD Sharding Example (GitHub Actions):**
```yaml
name: Playwright Tests

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright
        run: npx playwright install --with-deps
      - name: Run tests
        run: npx playwright test --shard=${{ matrix.shard }}/4
```

**Sharding Math:**
```
1000 tests @ 5s each = 5000s total time

Without sharding (8 workers):
5000s / 8 workers = 625s (~10 minutes)

With sharding (4 machines × 8 workers = 32 parallel):
5000s / 32 = 156s (~2.5 minutes)
```

**When to Use Sharding:**
- Test suite takes > 10 minutes
- Have multiple CI runners available
- Need fast feedback for PRs
- Large regression suites

---

#### Retry Logic

**Why Retries?** Handle flaky tests without manual re-runs, especially in CI environments.

```bash
# Retry failed tests 2 times
npx playwright test --retries=2

# No retries (default in local mode)
npx playwright test --retries=0
```

**Retry Strategy:**

| Scenario | Recommended Retries |
|----------|-------------------|
| **Local Development** | `0` (fix flaky tests immediately) |
| **CI/CD** | `2` (handle network flakiness) |
| **Nightly Regression** | `1` (balance between stability and feedback time) |

**How Retries Work:**
1. Test fails on first attempt
2. Playwright retries the test (fresh browser context)
3. If passes on retry, test marked as "flaky"
4. If fails all retries, test marked as "failed"

**Configuration:**
```typescript
// playwright.config.ts
export default defineConfig({
  retries: process.env.CI ? 2 : 0,  // 2 retries in CI, 0 locally
});
```

---

#### Reporters

**Why Multiple Reporters?** Different stakeholders need different output formats.

| Reporter | Output | Use Case |
|----------|--------|----------|
| `list` | Console text | Local development |
| `html` | HTML dashboard | Visual test results, CI artifacts |
| `json` | JSON file | Custom analysis, dashboards |
| `junit` | JUnit XML | CI systems (Jenkins, TeamCity) |
| `dot` | Dot matrix | Minimal CI output |
| `github` | GitHub annotations | Pull request comments |

```bash
# Single reporter
npx playwright test --reporter=html
npx playwright test --reporter=list
npx playwright test --reporter=json
npx playwright test --reporter=junit

# Multiple reporters
npx playwright test --reporter=html,json,junit

# Custom reporter
npx playwright test --reporter=./my-custom-reporter.ts
```

**Reporter Configuration:**
```typescript
// playwright.config.ts
export default defineConfig({
  reporter: [
    ['list'],                                    // Console output
    ['html', { outputFolder: 'test-results/html' }],  // HTML report
    ['json', { outputFile: 'test-results/results.json' }],  // JSON
    ['junit', { outputFile: 'test-results/junit.xml' }],    // JUnit
  ],
});
```

---

#### Timeout & Failure Limits

```bash
# Set test timeout (in milliseconds)
npx playwright test --timeout=60000  # 60 seconds

# Stop after N failures (fail-fast)
npx playwright test --max-failures=10
# Good for: large suites, early feedback
```

**Timeout Best Practices:**

| Test Type | Recommended Timeout |
|-----------|-------------------|
| Unit/Component | 10s |
| Integration | 30s |
| E2E Critical Path | 60s |
| Full E2E Journey | 90s |

---

#### Visual Testing

```bash
# Update visual snapshots (baseline images)
npx playwright test --update-snapshots

# Update only chromium snapshots
npx playwright test --update-snapshots --project=chromium
```

**When to Update Snapshots:**
- Intentional UI changes
- New features with visual components
- After designer approval of changes

**⚠️ Warning:** Never update snapshots without reviewing differences!

---

#### Trace Recording

**What are Traces?** Complete recording of test execution (screenshots, network, console logs, DOM snapshots).

```bash
# Always record trace
npx playwright test --trace on

# Record trace only on failure
npx playwright test --trace on-first-retry

# Record trace for first retry and failures
npx playwright test --trace retain-on-failure

# No tracing
npx playwright test --trace off
```

**Trace Options:**

| Option | Behavior | Storage Cost | Use Case |
|--------|----------|--------------|----------|
| `on` | Always record | High | Debugging specific test |
| `on-first-retry` | Record if test retried | Medium | CI/CD |
| `retain-on-failure` | Keep only failed tests | Low | Production CI |
| `off` | No tracing | None | Local fast execution |

**Viewing Traces:**
```bash
# Open trace viewer
npx playwright show-trace trace.zip

# Or open from HTML report
npx playwright show-report
# Click on failed test → View trace
```

---

#### Code Generation

**What is Codegen?** Playwright Inspector that records your actions and generates test code.

```bash
# Generate test code
npx playwright codegen https://example.com

# Generate code for specific browser
npx playwright codegen --browser=firefox https://example.com

# Generate code for mobile device
npx playwright codegen --device="iPhone 13" https://example.com

# Generate Python code
npx playwright codegen --target=python https://example.com

# Generate code with custom viewport
npx playwright codegen --viewport-size=1280,720 https://example.com

# Save to file
npx playwright codegen --output=tests/generated.spec.ts https://example.com
```

**Code Generation Workflow:**
1. Run `npx playwright codegen https://your-app.com`
2. Interact with the application (click, fill, navigate)
3. Playwright generates code in real-time
4. Copy generated code to your test file
5. Refactor and add assertions

**Generated Code Example:**
```typescript
// Generated automatically by codegen
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://example.com/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL('https://example.com/dashboard');
});
```

---

#### Report Viewing

```bash
# Open HTML report
npx playwright show-report

# Open specific report directory
npx playwright show-report test-results/

# Open trace viewer for specific trace
npx playwright show-trace trace.zip

# View trace from test results
npx playwright show-trace test-results/example-test/trace.zip
```

---

#### Browser Installation

```bash
# Install all browsers
npx playwright install

# Install specific browser
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit

# Install system dependencies (Linux)
npx playwright install-deps

# Install browsers and dependencies together
npx playwright install --with-deps

# Install to custom path
PLAYWRIGHT_BROWSERS_PATH=/custom/path npx playwright install
```

**When to Run:**
- After `npm install @playwright/test`
- When upgrading Playwright version
- Setting up new CI environment
- First-time project setup

---

#### Utility Commands

```bash
# Show Playwright version
npx playwright --version

# Show help
npx playwright --help

# Show help for specific command
npx playwright test --help

# List available devices
npx playwright list-devices

# Show installed browsers
npx playwright install --dry-run
```

---

### 26.2 Environment Variables

**Why Environment Variables?** Separate configuration from code, manage secrets, and control behavior across environments.

#### Browser & Execution Control

```bash
# Browser selection (overrides config)
BROWSER=firefox npx playwright test

# Base URL (used by page.goto('/path'))
BASE_URL=https://staging.example.com npx playwright test

# Headed mode
HEADED=1 npx playwright test

# Slow motion (milliseconds delay between actions)
SLOW_MO=1000 npx playwright test
```

**Typical Environment Setup:**
```bash
# .env.local
BASE_URL=http://localhost:3000
HEADED=1
WORKERS=2

# .env.staging
BASE_URL=https://staging.example.com
WORKERS=4
RETRIES=2

# .env.production
BASE_URL=https://example.com
WORKERS=8
RETRIES=1
```

---

#### Debugging Variables

```bash
# Enable Playwright Inspector
PWDEBUG=1 npx playwright test

# Enable API debugging logs
DEBUG=pw:api npx playwright test

# Enable browser debugging logs
DEBUG=pw:browser npx playwright test

# Enable all Playwright debugging
DEBUG=pw:* npx playwright test

# Node.js debugging
NODE_OPTIONS='--inspect' npx playwright test
```

**Debug Levels:**

| Variable | Output | Use Case |
|----------|--------|----------|
| `PWDEBUG=1` | Inspector UI | Step-through debugging |
| `DEBUG=pw:api` | API calls | Understanding test flow |
| `DEBUG=pw:browser` | Browser logs | Browser issues |
| `DEBUG=pw:protocol` | CDP messages | Deep browser debugging |

---

#### Performance & Parallelization

```bash
# Number of workers
WORKERS=4 npx playwright test

# Timeout (milliseconds)
TIMEOUT=60000 npx playwright test

# Fully parallel mode
FULLY_PARALLEL=1 npx playwright test
```

---

#### Installation & Paths

```bash
# Skip browser download during npm install
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install

# Custom browser installation path
PLAYWRIGHT_BROWSERS_PATH=/custom/browsers npx playwright install

# Download browsers from mirror
PLAYWRIGHT_DOWNLOAD_HOST=https://mirror.example.com npx playwright install
```

**CI Optimization:**
```bash
# Cache browsers in CI
PLAYWRIGHT_BROWSERS_PATH=$HOME/.cache/playwright npx playwright install
```

---

#### Artifacts & Results

```bash
# Screenshots configuration
SCREENSHOTS=on npx playwright test
SCREENSHOTS=only-on-failure npx playwright test

# Video recording
VIDEO=on npx playwright test
VIDEO=retain-on-failure npx playwright test

# Trace recording
TRACE=on npx playwright test
TRACE=retain-on-failure npx playwright test

# Test results directory
TEST_RESULTS_DIR=./custom-results npx playwright test
```

---

#### CI/CD Specific

```bash
# CI detection (enables optimizations)
CI=true npx playwright test

# GitHub Actions annotations
GITHUB_ACTIONS=true npx playwright test

# Disable color output
NO_COLOR=1 npx playwright test

# Force color output
FORCE_COLOR=1 npx playwright test
```

---

#### Complete Environment Example

```bash
# Development environment
BASE_URL=http://localhost:3000 \
HEADED=1 \
WORKERS=2 \
PWDEBUG=1 \
npx playwright test

# Staging CI environment
BASE_URL=https://staging.example.com \
CI=true \
WORKERS=4 \
RETRIES=2 \
SCREENSHOTS=only-on-failure \
VIDEO=retain-on-failure \
TRACE=on-first-retry \
npx playwright test --reporter=html,junit

# Production smoke tests
BASE_URL=https://example.com \
CI=true \
WORKERS=8 \
RETRIES=1 \
npx playwright test --grep @smoke --reporter=list
```

---

### 26.3 npm Scripts Best Practices

**Why npm Scripts?** Encapsulate complex commands, ensure consistency across team, simplify CI/CD integration.

#### Comprehensive package.json Scripts

```json
{
  "scripts": {
    // ===== Basic Execution =====
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "test:ui": "playwright test --ui",
    
    // ===== Browser-Specific =====
    "test:chromium": "playwright test --project=chromium",
    "test:firefox": "playwright test --project=firefox",
    "test:webkit": "playwright test --project=webkit",
    "test:all-browsers": "playwright test --project=chromium --project=firefox --project=webkit",
    
    // ===== Mobile Testing =====
    "test:mobile": "playwright test --project=mobile-chrome --project=mobile-safari",
    "test:iphone": "playwright test --project='iPhone 13'",
    "test:android": "playwright test --project='Pixel 5'",
    
    // ===== Test Filtering =====
    "test:smoke": "playwright test --grep @smoke",
    "test:regression": "playwright test --grep-invert @smoke",
    "test:critical": "playwright test --grep @critical",
    "test:api": "playwright test tests/api/",
    "test:e2e": "playwright test tests/e2e/",
    
    // ===== Parallel Execution =====
    "test:parallel": "playwright test --workers=4",
    "test:parallel-full": "playwright test --fully-parallel --workers=8",
    "test:sequential": "playwright test --workers=1",
    
    // ===== Environment-Specific =====
    "test:local": "BASE_URL=http://localhost:3000 playwright test --headed --workers=1",
    "test:staging": "BASE_URL=https://staging.example.com playwright test",
    "test:production": "BASE_URL=https://example.com playwright test --grep @smoke",
    
    // ===== CI/CD =====
    "test:ci": "playwright test --reporter=html,junit --retries=2",
    "test:ci:shard": "playwright test --shard=$SHARD_INDEX/$TOTAL_SHARDS",
    "test:ci:fast": "playwright test --grep @smoke --workers=4 --retries=1",
    
    // ===== Debugging & Analysis =====
    "test:trace": "playwright test --trace on",
    "test:video": "playwright test --video on",
    "test:slow-mo": "SLOW_MO=1000 playwright test --headed",
    
    // ===== Code Generation =====
    "codegen": "playwright codegen",
    "codegen:mobile": "playwright codegen --device='iPhone 13'",
    "codegen:python": "playwright codegen --target=python",
    
    // ===== Reports & Artifacts =====
    "report": "playwright show-report",
    "report:open": "open playwright-report/index.html",
    "trace": "playwright show-trace",
    "trace:last": "playwright show-trace test-results/$(ls -t test-results | head -1)/trace.zip",
    
    // ===== Installation & Setup =====
    "install:browsers": "playwright install --with-deps",
    "install:chromium": "playwright install chromium",
    
    // ===== Snapshots =====
    "update-snapshots": "playwright test --update-snapshots",
    "update-snapshots:chromium": "playwright test --update-snapshots --project=chromium",
    
    // ===== Utility =====
    "lint:tests": "eslint tests/",
    "format:tests": "prettier --write tests/",
    "clean:results": "rm -rf test-results playwright-report",
    "clean:browsers": "rm -rf ~/.cache/ms-playwright",
    
    // ===== Composite Commands =====
    "pretest": "npm run lint:tests",
    "posttest": "npm run report",
    "test:full": "npm run clean:results && npm run test && npm run report"
  }
}
```

#### Usage Examples

```bash
# Local development
npm run test:headed

# Quick smoke test
npm run test:smoke

# CI pipeline
npm run test:ci

# Debug failing test
npm run test:debug tests/failing-test.spec.ts

# Cross-browser testing
npm run test:all-browsers

# Mobile testing
npm run test:mobile
```

---

### 26.4 Configuration Priority & Overrides

**Understanding Priority:** Playwright resolves configuration from multiple sources with clear precedence.

#### Priority Order (Highest → Lowest)

1. **CLI Arguments** (highest priority)
2. **Environment Variables**
3. **Config File** (`playwright.config.ts`)
4. **Default Values** (lowest priority)

#### Examples

**Timeout Resolution:**
```typescript
// playwright.config.ts
export default defineConfig({
  timeout: 30000,  // 30 seconds
});
```

```bash
# Uses 30s (from config)
npx playwright test

# Uses 60s (CLI overrides config)
npx playwright test --timeout=60000

# Uses 45s (environment overrides config)
TIMEOUT=45000 npx playwright test

# Uses 90s (CLI overrides both)
TIMEOUT=45000 npx playwright test --timeout=90000
```

**Workers Resolution:**
```typescript
// Config: workers: 4
```

```bash
# Uses 4 (from config)
npx playwright test

# Uses 2 (environment overrides)
WORKERS=2 npx playwright test

# Uses 1 (CLI overrides both)
WORKERS=2 npx playwright test --workers=1
```

**Retries Resolution:**
```typescript
// Config
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
});
```

```bash
# Local: retries = 0
npx playwright test

# CI: retries = 2
CI=true npx playwright test

# Force retries=3 (CLI overrides)
CI=true npx playwright test --retries=3
```

#### Complete Override Example

**Config File:**
```typescript
// playwright.config.ts
export default defineConfig({
  timeout: 30000,
  workers: 4,
  retries: 0,
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
```

**CLI Override:**
```bash
# Override everything
BASE_URL=https://staging.example.com \
WORKERS=8 \
npx playwright test \
  --timeout=60000 \
  --retries=2 \
  --grep @smoke \
  --reporter=html,json
```

**Result:**
- Timeout: 60000 ms (CLI)
- Workers: 8 (ENV)
- Retries: 2 (CLI)
- BaseURL: https://staging.example.com (ENV)
- Screenshot: only-on-failure (config - not overridden)
- Video: retain-on-failure (config - not overridden)

---

#### Best Practices Summary

| Practice | Reason |
|----------|--------|
| **Use environment variables for URLs** | Different environments (local/staging/prod) |
| **CLI arguments for one-time overrides** | Quick debugging, specific test runs |
| **Config file for defaults** | Team consistency, version control |
| **npm scripts for common combinations** | Simplify complex commands |
| **Document your scripts** | Help new team members |

---



## 27. Team Architecture & Collaboration

### 27.1 Test Ownership & Code Review Practices

#### Test Ownership Model

```typescript
// tests/features/checkout/checkout.spec.ts
/**
 * @owner: payments-team
 * @reviewers: qa-team
 * @slack: #payments-qa
 * @jira: PAY-123
 */

test.describe('Checkout Flow', () => {
  test('should complete payment', async ({ page }) => {
    // Test implementation
  });
});
```

#### CODEOWNERS File

```
# .github/CODEOWNERS

# Global owners
* @qa-team

# Feature-specific ownership
/tests/auth/**         @auth-team @qa-team
/tests/checkout/**     @payments-team @qa-team
/tests/admin/**        @admin-team @qa-team
/tests/api/**          @backend-team @qa-team

# Infrastructure
playwright.config.ts   @qa-leads
/helpers/**            @qa-team
/fixtures/**           @qa-team
```

#### Code Review Checklist

```markdown
## Test Code Review Checklist

### Test Quality
- [ ] Test has clear, descriptive name
- [ ] Test follows AAA pattern (Arrange, Act, Assert)
- [ ] Test is independent and can run in isolation
- [ ] No hardcoded waits (`waitForTimeout`)
- [ ] Proper error messages in assertions

### Code Quality
- [ ] Uses Page Object Model or appropriate pattern
- [ ] No code duplication
- [ ] Follows team naming conventions
- [ ] TypeScript types are correct
- [ ] Comments explain "why", not "what"

### Maintainability
- [ ] Selectors are stable and meaningful
- [ ] Uses data-testid where appropriate
- [ ] Environment variables used for config
- [ ] No secrets in code

### Performance
- [ ] Test runs in reasonable time (<30s typically)
- [ ] Minimal network requests mocked
- [ ] Parallelizable (no shared state)

### Documentation
- [ ] README updated if needed
- [ ] Test tags applied (@smoke, @regression)
- [ ] JIRA ticket linked
```

---

### 27.2 Shared Helpers, Page Objects, Fixtures Repository

#### Repository Structure

```
playwright-tests/
├── tests/
│   ├── auth/
│   ├── checkout/
│   └── admin/
├── pages/                      # Page Objects
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   └── CheckoutPage.ts
├── fixtures/                   # Custom fixtures
│   ├── auth.fixture.ts
│   ├── database.fixture.ts
│   └── api.fixture.ts
├── helpers/                    # Utility functions
│   ├── date-utils.ts
│   ├── api-helpers.ts
│   └── test-data-generator.ts
├── data/                       # Test data
│   ├── users.json
│   └── products.json
├── config/                     # Environment configs
│   ├── dev.config.ts
│   ├── staging.config.ts
│   └── prod.config.ts
└── playwright.config.ts
```

#### Shared Page Objects

```typescript
// pages/BasePage.ts
export class BasePage {
  constructor(protected page: Page) {}

  async goto(path: string) {
    await this.page.goto(path);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }
}

// pages/LoginPage.ts
export class LoginPage extends BasePage {
  private emailInput = '#email';
  private passwordInput = '#password';
  private loginButton = '#login-button';

  async login(email: string, password: string) {
    await this.page.fill(this.emailInput, email);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
  }

  async expectErrorMessage(message: string) {
    await expect(this.page.locator('.error-message')).toContainText(message);
  }
}
```

#### Shared Fixtures

```typescript
// fixtures/index.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

type CustomFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  authenticatedPage: Page;
};

export const test = base.extend<CustomFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  authenticatedPage: async ({ page }, use) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('#email', 'user@example.com');
    await page.fill('#password', 'password123');
    await page.click('#login-button');
    await page.waitForURL('**/dashboard');
    
    await use(page);
    
    // Logout after test
    await page.goto('/logout');
  },
});

export { expect } from '@playwright/test';
```

---

### 27.3 Mono-Repo vs Multi-Repo Strategies

#### Mono-Repo Structure

```
company-monorepo/
├── packages/
│   ├── web-app/
│   ├── mobile-app/
│   └── api/
├── tests/
│   ├── e2e/
│   │   ├── web/
│   │   ├── mobile/
│   │   └── api/
│   ├── shared/
│   │   ├── fixtures/
│   │   ├── helpers/
│   │   └── pages/
│   └── playwright.config.ts
├── package.json
└── tsconfig.json
```

**Advantages:**
- Single source of truth
- Easy to share code
- Atomic commits across app + tests
- Single CI pipeline

**Disadvantages:**
- Large repository
- Slower CI
- More merge conflicts

#### Multi-Repo Structure

```
Repositories:
- web-app/
- mobile-app/
- api/
- playwright-tests/      # Separate test repo
  ├── tests/
  ├── pages/
  └── playwright.config.ts
```

**Advantages:**
- Smaller repositories
- Independent versioning
- Faster CI per repo
- Clear separation of concerns

**Disadvantages:**
- Code duplication possible
- Harder to keep in sync
- Multiple PRs for related changes

---

### 27.4 Scaling QA Teams & Test Suites

#### Team Structure

```
QA Organization:
├── QA Manager
├── QA Leads (2-3)
│   ├── SDET Team (5-8 engineers)
│   │   ├── E2E Test Automation
│   │   ├── API Test Automation
│   │   └── Performance Testing
│   ├── Manual QA Team (3-5 testers)
│   │   ├── Exploratory Testing
│   │   ├── UAT Coordination
│   │   └── Test Case Design
│   └── QA Infrastructure (2-3 engineers)
│       ├── CI/CD Pipeline
│       ├── Test Environment Management
│       └── Test Data Management
```

#### Test Suite Organization

```typescript
// Tagging strategy
test('@smoke @critical @auth', async ({ page }) => {});
test('@regression @payments', async ({ page }) => {});
test('@slow @integration', async ({ page }) => {});

// Suite levels
Level 1 (Smoke): 50 tests, 5 min  -> Run on every commit
Level 2 (Core):  200 tests, 20 min -> Run on every PR
Level 3 (Full):  1000 tests, 2 hrs -> Run nightly
```

#### Scaling Strategies

1. **Horizontal Scaling**
   - Increase CI workers
   - Use sharding
   - Cloud-based execution (BrowserStack, Sauce Labs)

2. **Vertical Scaling**
   - Optimize slow tests
   - Parallel execution
   - Reduce test setup time

3. **Smart Test Selection**
   - Run only affected tests
   - Risk-based testing
   - ML-based test selection

```typescript
// Smart test selection example
const changedFiles = getChangedFiles();
const affectedTests = findAffectedTests(changedFiles);

// Run only tests related to changed files
npx playwright test ${affectedTests.join(' ')}
```

---

## 28. QA Processes & Best Practices

### 28.1 Test Pyramid & Testing Strategy

```
        /\
       /  \      E2E Tests (10%)
      /____\     - Critical user journeys
     /      \    - Cross-browser testing
    /  API   \   API Tests (30%)
   /  Tests   \  - Business logic
  /____________\ - Integration points
 /              \
/  Unit Tests    \ Unit Tests (60%)
\________________/ - Component logic
                   - Fast feedback
```

#### Testing Strategy Matrix

| Test Type | Scope | Speed | Frequency | Ownership |
|-----------|-------|-------|-----------|-----------|
| **Unit** | Function/Component | Fast (ms) | Every commit | Developers |
| **Integration** | Multiple modules | Medium (sec) | Every PR | Developers + QA |
| **API** | Backend services | Medium (sec) | Every PR | QA + Backend |
| **E2E** | Full user flow | Slow (min) | Pre-release | QA |
| **Performance** | System load | Slow (min) | Nightly | QA + DevOps |
| **Security** | Vulnerabilities | Medium (sec) | Weekly | Security + QA |

---

### 28.2 Shift-Left Testing in Agile/DevOps

#### Definition
**Shift-Left**: Move testing earlier in development lifecycle

#### Implementation

```
Traditional:        Dev → QA → Production
Shift-Left:         Dev+QA → Production

Benefits:
- Bugs found earlier (cheaper to fix)
- Faster feedback loops
- Better quality
- Reduced time to market
```

#### Practices

1. **Test-Driven Development (TDD)**
   ```typescript
   // Write test first
   test('should calculate total', async () => {
     expect(calculateTotal([10, 20, 30])).toBe(60);
   });
   
   // Then implement
   function calculateTotal(items: number[]): number {
     return items.reduce((sum, item) => sum + item, 0);
   }
   ```

2. **Early Test Automation**
   - Automate acceptance criteria before coding
   - Use BDD to align team
   - Continuous testing in CI

3. **Pair Programming with QA**
   - QA + Dev write tests together
   - Knowledge sharing
   - Better test coverage

---

### 28.3 Continuous Testing & CI/CD Integration

#### CI/CD Pipeline

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on: [push, pull_request]

jobs:
  # Stage 1: Code Quality
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run linters
        run: npm run lint

  # Stage 2: Unit Tests
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run unit tests
        run: npm run test:unit

  # Stage 3: Build
  build:
    needs: [lint, unit-tests]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build application
        run: npm run build

  # Stage 4: E2E Tests
  e2e-tests:
    needs: build
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
    steps:
      - uses: actions/checkout@v3
      - name: Run E2E tests
        run: npx playwright test --project=${{ matrix.browser }}

  # Stage 5: Deploy to Staging
  deploy-staging:
    needs: e2e-tests
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to staging
        run: ./deploy-staging.sh

  # Stage 6: Smoke Tests on Staging
  smoke-tests-staging:
    needs: deploy-staging
    runs-on: ubuntu-latest
    steps:
      - name: Run smoke tests
        run: npx playwright test --grep @smoke
        env:
          BASE_URL: https://staging.example.com

  # Stage 7: Deploy to Production
  deploy-production:
    needs: smoke-tests-staging
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: ./deploy-production.sh

  # Stage 8: Post-Deployment Tests
  post-deployment-tests:
    needs: deploy-production
    runs-on: ubuntu-latest
    steps:
      - name: Run production smoke tests
        run: npx playwright test --grep @production-smoke
        env:
          BASE_URL: https://example.com
```

---

### 28.4 Defect Triage & Root Cause Analysis

#### Defect Severity & Priority

| Severity | Description | Example | Response Time |
|----------|-------------|---------|---------------|
| **Critical** | System down, no workaround | Payment processing broken | Immediate |
| **High** | Major feature broken, workaround exists | Search not working | 24 hours |
| **Medium** | Minor feature issue | UI alignment issue | 1 week |
| **Low** | Cosmetic, minimal impact | Typo in footer | Next sprint |

#### Bug Report Template

```markdown
## Bug Report: [Title]

**Environment:**
- Browser: Chrome 120
- OS: Windows 11
- URL: https://example.com/checkout
- Build: v2.5.0

**Steps to Reproduce:**
1. Go to checkout page
2. Add 3 items to cart
3. Click "Proceed to Payment"
4. Enter credit card details

**Expected Result:**
Payment should be processed successfully

**Actual Result:**
Error message: "Payment failed"

**Screenshot/Video:**
[Attach screenshot]

**Console Errors:**
```
TypeError: Cannot read property 'amount' of undefined
  at processPayment (checkout.js:45)
```

**Additional Context:**
- Issue occurs only with Visa cards
- MasterCard works fine
- Started happening after v2.5.0 deployment

**Severity:** High
**Priority:** High
**Assignee:** @payments-team
```

#### Root Cause Analysis (5 Whys)

```
Bug: Payment failing for Visa cards

Why 1: Why did payment fail?
→ Because API returned error 500

Why 2: Why did API return error 500?
→ Because card validation failed

Why 3: Why did card validation fail?
→ Because Visa card format regex was incorrect

Why 4: Why was regex incorrect?
→ Because recent code change updated regex pattern

Why 5: Why wasn't this caught in testing?
→ Because test data only used MasterCard

Root Cause: Insufficient test data coverage
Action Items:
1. Fix regex pattern
2. Add Visa card test data
3. Add automated tests for all card types
4. Update code review checklist
```

---

## 29. Common Interview Questions & Answers

### 29.0 Deep Dive Interview Questions (Advanced)

**These questions test deep understanding, not just API knowledge.**

---

#### Q: "Explain how Playwright's auto-waiting works internally. Why is it more reliable than Selenium's explicit waits?"

**A (Deep Answer):**

Playwright implements auto-waiting as a **retry loop with actionability checks**:

```typescript
// Conceptual internal implementation
async function click(selector: string) {
  const timeout = 30000; // 30 seconds
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const element = document.querySelector(selector);
    
    // Check 1: Element exists (attached to DOM)
    if (!element || !element.isConnected) {
      await sleep(100);
      continue;
    }
    
    // Check 2: Visible (has dimensions, not display:none)
    const box = element.getBoundingClientRect();
    if (box.width === 0 || box.height === 0) {
      await sleep(100);
      continue;
    }
    
    // Check 3: Stable (not animating)
    const box1 = element.getBoundingClientRect();
    await sleep(100);
    const box2 = element.getBoundingClientRect();
    if (box1.x !== box2.x || box1.y !== box2.y) {
      continue; // Still moving
    }
    
    // Check 4: Enabled
    if (element.disabled || element.getAttribute('disabled')) {
      await sleep(100);
      continue;
    }
    
    // Check 5: Not obscured
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;
    const topElement = document.elementFromPoint(centerX, centerY);
    if (topElement !== element && !element.contains(topElement)) {
      await sleep(100);
      continue; // Another element is on top
    }
    
    // All checks passed - perform action
    element.click();
    return;
  }
  
  throw new TimeoutError('Element not actionable after 30s');
}
```

**Why it's better than Selenium:**

| Selenium | Playwright |
|----------|-----------|
| **No built-in actionability** | **5 actionability checks** |
| Manual `WebDriverWait` for each condition | Automatic for all actions |
| `element.click()` fails if obscured | Waits for element to be unobscured |
| Stale element exceptions | Locators re-query DOM (never stale) |
| Race conditions common | Polling eliminates race conditions |

**Follow-up: "What happens if the element never becomes actionable?"**

A: Playwright throws `TimeoutError` after default 30 seconds, with detailed information:
- Which check failed (e.g., "element is not visible")
- Selector used
- Last known state of element
- Screenshot and trace (if enabled)

---

#### Q: "Why does Playwright use Browser Contexts instead of just multiple browsers? What are the performance implications?"

**A (Deep Answer):**

**Memory & Performance Comparison:**

```
Approach 1: Multiple Browsers
Browser 1: 150MB (full browser)
Browser 2: 150MB (full browser)
Browser 3: 150MB (full browser)
Browser 4: 150MB (full browser)
Total: 600MB, 4 processes

Approach 2: One Browser, Multiple Contexts
Browser: 150MB (one-time)
Context 1: +10MB
Context 2: +10MB
Context 3: +10MB
Context 4: +10MB
Total: 190MB, 1 process

Savings: 68% less memory, 75% fewer processes
```

**What Context Provides:**

```typescript
// Each context has ISOLATED:
// - Cookies
// - LocalStorage
// - SessionStorage
// - Cache
// - Permissions
// - Authentication state

const context1 = await browser.newContext({
  locale: 'en-US',
  permissions: ['geolocation'],
});

const context2 = await browser.newContext({
  locale: 'fr-FR',
  permissions: ['notifications'],
});

// context1 and context2 CANNOT see each other's data
```

**When to Create New Context vs New Page:**

| Scenario | Use | Reason |
|----------|-----|--------|
| **Same user, multiple tabs** | Same context, multiple pages | Share cookies/session |
| **Different users** | Different contexts | Isolated sessions |
| **Incognito mode** | New context | Private session |
| **Different permissions** | New context | Isolated permissions |
| **Parallel tests** | Different contexts | Test isolation |

**Performance Impact of Context Creation:**

```typescript
// Benchmark
console.time('New Browser');
const browser = await chromium.launch(); // 1500ms
console.timeEnd('New Browser');

console.time('New Context');
const context = await browser.newContext(); // 50ms
console.timeEnd('New Context');

console.time('New Page');
const page = await context.newPage(); // 20ms
console.timeEnd('New Page');

// Creating context is 30x faster than launching browser!
```

---

#### Q: "How does Playwright achieve parallel test execution? Explain worker pools and test sharding."

**A (Deep Answer):**

**Worker Pool Architecture:**

```
Test Suite: 100 tests
Workers: 4 (configured)

Worker Pool:
├─ Worker 0 (Process ID: 1234)
│  ├─ Browser (Chromium)
│  ├─ Test 1 → Context → Page
│  ├─ Test 5 → Context → Page
│  └─ Test 9 → Context → Page
│
├─ Worker 1 (Process ID: 1235)
│  ├─ Browser (Chromium)
│  ├─ Test 2 → Context → Page
│  └─ Test 6 → Context → Page
│
├─ Worker 2 (Process ID: 1236)
│  └─ ...
│
└─ Worker 3 (Process ID: 1237)
   └─ ...
```

**How Test Distribution Works:**

```typescript
// Conceptual implementation
class TestRunner {
  async runTests(tests: Test[], workers: number) {
    // Create worker pool
    const workerPool = await this.createWorkers(workers);
    
    // Test queue
    const testQueue = [...tests];
    
    // Each worker picks from queue
    const workerPromises = workerPool.map(worker => 
      this.workerLoop(worker, testQueue)
    );
    
    await Promise.all(workerPromises);
  }
  
  async workerLoop(worker: Worker, queue: Test[]) {
    while (queue.length > 0) {
      const test = queue.shift(); // Get next test
      
      if (!test) break;
      
      // Create fresh context for test
      const context = await worker.browser.newContext();
      const page = await context.newPage();
      
      try {
        await test.run(page);
      } finally {
        await context.close(); // Clean up
      }
    }
  }
}
```

**Test Sharding (Distributing Across Machines):**

```bash
# Machine 1: Run shard 1/3
npx playwright test --shard=1/3

# Machine 2: Run shard 2/3
npx playwright test --shard=2/3

# Machine 3: Run shard 3/3
npx playwright test --shard=3/3
```

**How Sharding Works:**

```typescript
// Conceptual implementation
function getShard(allTests: Test[], shardIndex: number, totalShards: number) {
  const testsPerShard = Math.ceil(allTests.length / totalShards);
  const startIndex = (shardIndex - 1) * testsPerShard;
  const endIndex = startIndex + testsPerShard;
  
  return allTests.slice(startIndex, endIndex);
}

// Example: 100 tests, 3 shards
// Shard 1: tests 0-33
// Shard 2: tests 34-66
// Shard 3: tests 67-99
```

**Performance Calculation:**

```
Sequential Execution:
100 tests × 30 seconds = 3000 seconds (50 minutes)

Parallel with 4 Workers:
100 tests ÷ 4 workers = 25 tests per worker
25 tests × 30 seconds = 750 seconds (12.5 minutes)
Speedup: 4x

Parallel with 4 Workers + 3 Shards (12 total workers):
100 tests ÷ 12 workers = 8.3 tests per worker
9 tests × 30 seconds = 270 seconds (4.5 minutes)
Speedup: 11x
```

**Common Pitfall: Shared Resources**

```typescript
// ❌ Race condition with shared file
test('test 1', async ({ page }) => {
  fs.writeFileSync('data.json', '{"user": "Alice"}');
  // ...
});

test('test 2', async ({ page }) => {
  fs.writeFileSync('data.json', '{"user": "Bob"}');
  // ... CONFLICT! Both tests modify same file
});

// ✅ Worker-specific resources
test('test 1', async ({ page }, testInfo) => {
  const file = `data-${testInfo.workerIndex}.json`;
  fs.writeFileSync(file, '{"user": "Alice"}');
  // ...
});
```

---

#### Q: "Explain the difference between Locators and ElementHandles. When would you use ElementHandle?"

**A (Deep Answer):**

**Fundamental Difference:**

```typescript
// Locator: QUERY (lazy)
const locator = page.locator('button');
// Stores: "button" selector
// Does NOT query DOM yet
// No element reference stored

// ElementHandle: REFERENCE (eager)
const handle = await page.$('button');
// Queries DOM immediately
// Stores: Reference to actual DOM element
// Can become stale!
```

**Why Locators Are Preferred:**

| Aspect | Locator | ElementHandle |
|--------|---------|---------------|
| **DOM Query** | Every action re-queries | Queries once, stores reference |
| **Staleness** | Never stale | Can become stale |
| **Auto-waiting** | Yes | No |
| **Memory** | Lightweight (string) | Heavier (element reference) |
| **Use Case** | 99% of scenarios | Rare edge cases |

**When ElementHandle Becomes Stale:**

```typescript
// ElementHandle problem
const button = await page.$('button');  // Gets reference

// Navigation happens
await page.click('a');  // Page changes
await page.waitForLoadState();

// Now button reference is STALE
await button.click();  // ❌ Error: Element not attached to DOM

// Locator solution
const button = page.locator('button');
await page.click('a');
await page.waitForLoadState();
await button.click();  // ✅ Works! Re-queries DOM
```

**When to Use ElementHandle (Rare):**

```typescript
// Scenario 1: Need JavaScript handle for canvas/complex operations
const canvas = await page.$('canvas');
const context2d = await canvas.evaluateHandle(el => el.getContext('2d'));
await context2d.evaluate(ctx => ctx.fillRect(0, 0, 100, 100));

// Scenario 2: Puppeteer migration (temporary)
// Convert ElementHandle code to Locator later

// Scenario 3: Performance critical (many operations on same element)
// (Usually not worth the risk of staleness)
```

**Modern Alternative: Locator with evaluateHandle**

```typescript
// ✅ Best of both worlds
const canvas = page.locator('canvas');
const context2d = await canvas.evaluateHandle(el => el.getContext('2d'));
// Still uses locator for querying, gets handle only when needed
```

---

#### Q: "How does storageState() work internally? What security considerations should you keep in mind?"

**A (Deep Answer):**

**What Gets Saved:**

```json
// auth.json (created by storageState)
{
  "cookies": [
    {
      "name": "sessionId",
      "value": "abc123xyz789",  // ⚠️ SENSITIVE!
      "domain": ".example.com",
      "path": "/",
      "expires": 1735689600,
      "httpOnly": true,
      "secure": true,
      "sameSite": "Lax"
    },
    {
      "name": "csrf_token",
      "value": "def456uvw",  // ⚠️ SENSITIVE!
      "domain": ".example.com",
      "path": "/"
    }
  ],
  "origins": [
    {
      "origin": "https://example.com",
      "localStorage": [
        {
          "name": "authToken",
          "value": "eyJhbGc...full_jwt_token"  // ⚠️ VERY SENSITIVE!
        },
        {
          "name": "userId",
          "value": "12345"
        },
        {
          "name": "refreshToken",
          "value": "refresh_abc..."  // ⚠️ VERY SENSITIVE!
        }
      ]
    }
  ]
}
```

**Internal Loading Process:**

```typescript
// Conceptual implementation
async function loadStorageState(context: BrowserContext, statePath: string) {
  const state = JSON.parse(fs.readFileSync(statePath));
  
  // Step 1: Set cookies BEFORE creating pages
  for (const cookie of state.cookies) {
    await context.addCookie({
      name: cookie.name,
      value: cookie.value,
      domain: cookie.domain,
      path: cookie.path,
      expires: cookie.expires,
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: cookie.sameSite,
    });
  }
  
  // Step 2: Inject init script to set localStorage
  await context.addInitScript(state => {
    for (const origin of state.origins) {
      if (window.location.origin === origin.origin) {
        for (const item of origin.localStorage) {
          localStorage.setItem(item.name, item.value);
        }
      }
    }
  }, state);
}
```

**Security Risks:**

| Risk | Example | Mitigation |
|------|---------|------------|
| **Token exposure** | JWT in localStorage saved to file | Encrypt storage state files |
| **Credential leakage** | auth.json committed to Git | Add to `.gitignore` |
| **Long-lived tokens** | 30-day session tokens | Use short-lived test tokens |
| **Privilege escalation** | Admin token used in tests | Separate test accounts with minimal permissions |
| **Token theft** | Storage state file on CI server | Use CI secrets, delete after test |

**Best Practices:**

```typescript
// ✅ Good: Environment-specific auth
const storageState = process.env.CI
  ? 'auth-ci.json'      // CI uses dedicated test account
  : 'auth-local.json';  // Local uses dev account

test.use({ storageState });

// ✅ Good: Encrypt sensitive data
const state = await context.storageState();
const encrypted = encrypt(JSON.stringify(state), process.env.ENCRYPTION_KEY);
fs.writeFileSync('auth.encrypted', encrypted);

// ✅ Good: Short-lived tokens
// In global-setup.ts
await login();
await saveStorageState();

// In tests
test.use({ 
  storageState: 'auth.json',
  // Refresh token if expired
  contextOptions: {
    extraHTTPHeaders: {
      'Authorization': await getValidToken(),  // Refresh if needed
    },
  },
});

// ✅ Good: Gitignore
// .gitignore
auth*.json
storage-state*.json
*.encrypted
```

**Performance Benefit:**

```typescript
// WITHOUT storageState: 1,400ms per test
test('slow', async ({ page }) => {
  await page.goto('/login');           // 500ms
  await page.fill('#email', '...');    // 100ms
  await page.fill('#password', '...'); // 100ms
  await page.click('#submit');         // 200ms
  await page.waitForURL('/dashboard'); // 500ms
  // Test starts here
});

// WITH storageState: 500ms per test
test.use({ storageState: 'auth.json' });
test('fast', async ({ page }) => {
  await page.goto('/dashboard');  // 500ms (already logged in!)
  // Test starts immediately
});

// For 100 tests: 90 seconds saved!
```

---

### 29.1 Playwright Architecture & Concepts

**Q: What makes Playwright different from Selenium?**

A: Key differences:
1. **Auto-waiting**: Playwright waits for elements automatically, Selenium requires explicit waits
2. **Browser Context**: Playwright creates isolated browser contexts, better for parallel testing
3. **Multiple Browsers**: Playwright supports Chromium, Firefox, WebKit out of the box
4. **Modern Architecture**: Playwright uses CDP (Chrome DevTools Protocol) and browser-specific protocols
5. **Speed**: Playwright is faster due to direct browser communication
6. **Network Interception**: Built-in support for mocking, stubbing, and network manipulation

**Q: Explain Browser → Context → Page hierarchy**

A:
```
Browser (Chromium/Firefox/WebKit)
  └─ Browser Context (Isolated session)
      ├─ Page 1 (Tab/Window)
      ├─ Page 2 (Tab/Window)
      └─ Page 3 (Tab/Window)
```

- **Browser**: Browser instance (Chromium, Firefox, WebKit)
- **Context**: Isolated environment with own cookies, storage, cache
- **Page**: Individual tab or window

Benefits:
- Parallel tests with isolation
- No data leakage between tests
- Faster than launching new browser

**Q: What is auto-waiting and how does it work?**

A: Playwright automatically waits for elements to be actionable before performing actions:

1. **Attached** to DOM
2. **Visible** (not display:none, visibility:hidden)
3. **Stable** (not animating)
4. **Enabled** (not disabled attribute)
5. **Not Obscured** by other elements

Example:
```typescript
await page.click('button'); // Waits for all conditions automatically
```

---

### 29.2 Basic Level Questions (Entry-Level/Junior SDET)

---

#### Q1: "What is Playwright and why would you use it?"

**Candidate Answer:**

"Playwright is a modern end-to-end testing framework developed by Microsoft that allows us to automate web applications across multiple browsers. I would use Playwright because:

1. **Auto-waiting**: It automatically waits for elements to be ready, eliminating the need for manual waits
2. **Multi-browser support**: Works with Chromium, Firefox, and WebKit out of the box
3. **Fast execution**: Tests run faster compared to Selenium
4. **Built-in features**: Network interception, mobile emulation, and trace viewer are included
5. **Modern JavaScript/TypeScript**: Uses async/await patterns making tests easier to read

For example, a simple test in Playwright looks like this:

```typescript
import { test, expect } from '@playwright/test';

test('login test', async ({ page }) => {
  await page.goto('https://example.com/login');
  await page.fill('#email', 'user@example.com');
  await page.fill('#password', 'password123');
  await page.click('#login-button');
  await expect(page).toHaveURL('/dashboard');
});
```

This is much simpler than Selenium because we don't need explicit waits or driver management."

---

#### Q2: "How do you install and set up Playwright?"

**Candidate Answer:**

"Setting up Playwright is straightforward. Here's the process:

**Step 1: Install Playwright**
```bash
npm init playwright@latest
```

This command does several things:
- Installs Playwright packages
- Creates a `playwright.config.ts` file
- Adds example tests
- Installs browser binaries (Chromium, Firefox, WebKit)

**Step 2: Verify Installation**
```bash
npx playwright test
```

**Step 3: View Test Report**
```bash
npx playwright show-report
```

The basic project structure looks like this:
```
project/
├── tests/
│   └── example.spec.ts
├── playwright.config.ts
├── package.json
└── node_modules/
```

I typically customize the `playwright.config.ts` to set base URL, timeout values, and browser options based on the project requirements."

---

#### Q3: "How do you locate elements in Playwright?"

**Candidate Answer:**

"Playwright offers multiple ways to locate elements, and I choose based on the situation:

**1. Role-based (Recommended):**
```typescript
await page.getByRole('button', { name: 'Submit' });
await page.getByRole('textbox', { name: 'Email' });
```
This is best because it follows accessibility standards.

**2. Text-based:**
```typescript
await page.getByText('Welcome back');
await page.getByLabel('Password');
```

**3. Test ID (Most Reliable):**
```typescript
await page.getByTestId('submit-button');
// In HTML: <button data-testid="submit-button">
```

**4. CSS Selector:**
```typescript
await page.locator('#email');
await page.locator('.login-form button');
```

**5. XPath (When necessary):**
```typescript
await page.locator('xpath=//button[contains(text(), "Login")]');
```

In my experience, I prefer `getByRole` and `getByTestId` because they're less likely to break when the UI changes. For example:

```typescript
// ❌ Fragile
await page.locator('div > div > button:nth-child(3)');

// ✅ Robust
await page.getByRole('button', { name: 'Submit Order' });
```

---

#### Q4: "What is the difference between `page.click()` and `page.locator().click()`?"

**Candidate Answer:**

"Great question! Both perform clicks, but they work differently:

**`page.click(selector)`** - Direct action:
```typescript
await page.click('#submit');
```
- Takes a selector string
- Performs action immediately
- Older API style

**`page.locator(selector).click()`** - Locator API:
```typescript
await page.locator('#submit').click();
```
- Returns a Locator object first
- More flexible and composable
- Recommended modern approach

The key difference is that Locators can be reused and chained:

```typescript
const submitButton = page.locator('#submit');

// Can reuse multiple times
await submitButton.click();
await expect(submitButton).toBeDisabled();
const text = await submitButton.textContent();

// Can chain filters
const activeButton = page.locator('button').filter({ hasText: 'Active' });
```

I always use the Locator API (`page.locator()`) in new projects because it's more maintainable and follows Playwright's best practices."

---

#### Q5: "How do you handle waits in Playwright?"

**Candidate Answer:**

"One of Playwright's biggest advantages is its **auto-waiting** mechanism, so most times we don't need explicit waits. But I can explain both:

**Auto-waiting (Recommended):**
```typescript
// Automatically waits for element to be ready
await page.click('#submit');
await page.fill('#email', 'test@example.com');
await expect(page.locator('.success')).toBeVisible();
```

Playwright automatically waits for elements to be:
- Attached to DOM
- Visible
- Stable (not animating)
- Enabled
- Not obscured by other elements

**Explicit waits (When needed):**

1. **Wait for element state:**
```typescript
await page.locator('#data').waitFor({ state: 'visible' });
await page.locator('.spinner').waitFor({ state: 'hidden' });
```

2. **Wait for navigation:**
```typescript
await page.waitForURL('**/dashboard');
await page.waitForLoadState('networkidle');
```

3. **Wait for network response:**
```typescript
const responsePromise = page.waitForResponse('**/api/users');
await page.click('#load-users');
const response = await responsePromise;
```

4. **Wait for condition:**
```typescript
await page.waitForFunction(() => 
  document.querySelectorAll('.item').length > 0
);
```

**❌ What to AVOID:**
```typescript
await page.waitForTimeout(5000); // Never use fixed waits!
```

In interviews, I emphasize that I rely on auto-waiting 90% of the time and only use explicit waits for specific scenarios like network responses or complex animations."

---

#### Q6: "How do you write assertions in Playwright?"

**Candidate Answer:**

"Playwright uses `expect` from `@playwright/test` for assertions, and I categorize them into several types:

**1. Element Assertions:**
```typescript
// Visibility
await expect(page.locator('#message')).toBeVisible();
await expect(page.locator('.spinner')).toBeHidden();

// State
await expect(page.locator('#submit')).toBeEnabled();
await expect(page.locator('#submit')).toBeDisabled();
await expect(page.locator('#agree')).toBeChecked();

// Content
await expect(page.locator('h1')).toHaveText('Welcome');
await expect(page.locator('h1')).toContainText('Welcome');
await expect(page.locator('#email')).toHaveValue('test@example.com');

// Attributes
await expect(page.locator('#link')).toHaveAttribute('href', '/home');
await expect(page.locator('#submit')).toHaveClass('btn-primary');
```

**2. Page Assertions:**
```typescript
await expect(page).toHaveURL('https://example.com/dashboard');
await expect(page).toHaveTitle('Dashboard');
```

**3. Count Assertions:**
```typescript
await expect(page.locator('.product')).toHaveCount(10);
```

**4. API Response Assertions:**
```typescript
const response = await page.request.get('/api/users');
expect(response.ok()).toBeTruthy();
expect(response.status()).toBe(200);
```

**5. Soft Assertions (Continue on failure):**
```typescript
await expect.soft(page.locator('#title')).toHaveText('Title');
await expect.soft(page.locator('#subtitle')).toBeVisible();
// Test continues even if assertions fail
```

**Key tip:** All Playwright assertions have built-in auto-waiting. For example:
```typescript
await expect(page.locator('.data')).toBeVisible();
// Waits up to 5 seconds (default) for element to become visible
```

I prefer Playwright's assertions over Jest's `expect` for web elements because they automatically retry until the condition is met."

---

#### Q7: "How do you run tests in different browsers?"

**Candidate Answer:**

"Playwright supports multiple browsers out of the box. Here's how I configure and run them:

**Method 1: Configuration File (Recommended)**

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
    },
  ],
});
```

**Method 2: Command Line**
```bash
# Run all browsers
npx playwright test

# Run specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run multiple browsers
npx playwright test --project=chromium --project=firefox
```

**Method 3: In Code (For specific tests)**
```typescript
test.use({ 
  browserName: 'firefox',
  viewport: { width: 1920, height: 1080 } 
});

test('firefox specific test', async ({ page }) => {
  // Runs only in Firefox
});
```

**Checking Browser in Test:**
```typescript
test('browser detection', async ({ browserName, page }) => {
  console.log(`Running in ${browserName}`);
  
  if (browserName === 'webkit') {
    // Safari-specific logic
  }
});
```

In my projects, I usually run Chromium during development for speed, and run all browsers in CI/CD to catch cross-browser issues."

---

### 29.3 Intermediate Level Questions (Mid-Level SDET)

---

#### Q8: "How do you handle dynamic content and loading spinners?"

**Candidate Answer:**

"Handling dynamic content is crucial for stable tests. I use different strategies depending on the scenario:

**Strategy 1: Wait for Spinner to Disappear**
```typescript
// Wait for loading spinner to hide
await page.locator('.spinner').waitFor({ state: 'hidden' });
await page.locator('.data-loaded').click();
```

**Strategy 2: Wait for Content to Appear**
```typescript
// Wait for actual content
await expect(page.locator('.user-data')).toBeVisible();
await expect(page.locator('.product-list .item')).toHaveCount(10);
```

**Strategy 3: Wait for Network Activity**
```typescript
// Wait for specific API call
const responsePromise = page.waitForResponse('**/api/users');
await page.click('#load-data');
const response = await responsePromise;
expect(response.status()).toBe(200);
```

**Strategy 4: Wait for Network Idle**
```typescript
await page.goto('/dashboard');
await page.waitForLoadState('networkidle');
// All network requests finished
```

**Strategy 5: Use Assertions with Auto-Retry**
```typescript
// Playwright retries this assertion for 5 seconds
await expect(page.locator('.dynamic-content')).toHaveText('Loaded!');
```

**Real-World Example:**
```typescript
test('load user dashboard', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Multiple layers of dynamic content
  
  // 1. Wait for initial spinner
  await page.locator('.page-spinner').waitFor({ state: 'hidden' });
  
  // 2. Wait for user data API
  await page.waitForResponse('**/api/user/profile');
  
  // 3. Verify content loaded
  await expect(page.locator('.user-name')).toBeVisible();
  await expect(page.locator('.stats')).toHaveCount(4);
  
  // 4. Wait for secondary content
  await expect(page.locator('.recent-activity')).not.toBeEmpty();
});
```

**What to AVOID:**
```typescript
// ❌ Never use fixed timeouts
await page.waitForTimeout(5000);

// ✅ Always wait for specific conditions
await page.waitForSelector('.data-loaded');
```

The key principle is: **Wait for the condition that indicates readiness, not for arbitrary time.**"

---

#### Q9: "How do you handle iframes in Playwright?"

**Candidate Answer:**

"Working with iframes requires switching context. Playwright provides two main approaches:

**Method 1: frameLocator (Modern - Recommended)**
```typescript
// Find iframe and interact directly
const frame = page.frameLocator('iframe[title="Payment Form"]');
await frame.locator('#card-number').fill('4242424242424242');
await frame.locator('#expiry').fill('12/25');
await frame.locator('#cvc').fill('123');
await frame.locator('#submit').click();
```

**Method 2: contentFrame (Traditional)**
```typescript
// Get iframe element, then get its frame
const iframeElement = page.locator('iframe[title="Payment Form"]');
const frame = await iframeElement.contentFrame();
await frame.fill('#card-number', '4242424242424242');
```

**Nested Iframes:**
```typescript
// Parent iframe → Child iframe
const parentFrame = page.frameLocator('#parent-iframe');
const childFrame = parentFrame.frameLocator('#child-iframe');
await childFrame.locator('input').fill('text');
```

**Switching Between Frames:**
```typescript
test('multiple frames', async ({ page }) => {
  await page.goto('/page-with-frames');
  
  // Interact with main page
  await page.locator('#main-content').click();
  
  // Interact with iframe 1
  const frame1 = page.frameLocator('#frame1');
  await frame1.locator('#button1').click();
  
  // Back to main page (automatic)
  await page.locator('#main-button').click();
  
  // Interact with iframe 2
  const frame2 = page.frameLocator('#frame2');
  await frame2.locator('#button2').click();
});
```

**Waiting for Iframe to Load:**
```typescript
// Wait for iframe to be attached
const frameLocator = page.frameLocator('iframe');
await frameLocator.locator('body').waitFor();

// Then interact
await frameLocator.locator('#input').fill('value');
```

**Real-World Example (Payment Gateway):**
```typescript
test('stripe payment in iframe', async ({ page }) => {
  await page.goto('/checkout');
  
  // Fill main form
  await page.fill('#email', 'customer@example.com');
  await page.fill('#name', 'John Doe');
  
  // Switch to Stripe iframe
  const stripeFrame = page.frameLocator('iframe[title="Secure payment input frame"]');
  
  // Fill card details in iframe
  await stripeFrame.locator('[placeholder="Card number"]').fill('4242424242424242');
  await stripeFrame.locator('[placeholder="MM / YY"]').fill('12/25');
  await stripeFrame.locator('[placeholder="CVC"]').fill('123');
  
  // Submit form on main page
  await page.click('#submit-payment');
  
  // Verify success
  await expect(page.locator('.success-message')).toBeVisible();
});
```

**Key Difference:**
- `frameLocator`: Returns a FrameLocator (can chain operations, recommended)
- `contentFrame`: Returns a Frame object (older API, requires await)

I prefer `frameLocator` because it's more consistent with Playwright's locator pattern and doesn't require await for the initial frame access."

---

#### Q10: "Explain how you handle authentication in your test suite."

**Candidate Answer:**

"Authentication is critical for test efficiency. I use different strategies based on the project:

**Strategy 1: Global Setup with Storage State (Best for Most Cases)**

```typescript
// global-setup.ts
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Perform login
  await page.goto('https://example.com/login');
  await page.fill('#email', 'test@example.com');
  await page.fill('#password', 'password123');
  await page.click('#submit');
  
  // Wait for login to complete
  await page.waitForURL('**/dashboard');
  
  // Save authentication state
  await page.context().storageState({ path: 'auth.json' });
  
  await browser.close();
}

export default globalSetup;
```

```typescript
// playwright.config.ts
export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  use: {
    storageState: 'auth.json', // All tests use this auth
  },
});
```

```typescript
// tests/dashboard.spec.ts
test('access dashboard', async ({ page }) => {
  await page.goto('/dashboard');
  // Already logged in! No need to login again
  await expect(page.locator('.welcome')).toBeVisible();
});
```

**Benefits:**
- Login happens once for all tests (saves time)
- Tests start from authenticated state
- 100+ tests with authentication take only 1 login

**Strategy 2: Fixture-Based Authentication**

```typescript
// fixtures/auth.fixture.ts
import { test as base } from '@playwright/test';

type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Login before test
    await page.goto('/login');
    await page.fill('#email', 'user@example.com');
    await page.fill('#password', 'password');
    await page.click('#login');
    await page.waitForURL('**/dashboard');
    
    await use(page);
    
    // Logout after test
    await page.click('#logout');
  },
});
```

```typescript
// tests/features.spec.ts
import { test } from '../fixtures/auth.fixture';

test('feature test', async ({ authenticatedPage }) => {
  // Page is already authenticated
  await authenticatedPage.goto('/features');
});
```

**Strategy 3: API-Based Authentication (Faster)**

```typescript
test.beforeEach(async ({ page, request }) => {
  // Login via API (faster than UI)
  const response = await request.post('/api/login', {
    data: {
      email: 'test@example.com',
      password: 'password123'
    }
  });
  
  const { token } = await response.json();
  
  // Set token in page context
  await page.goto('/');
  await page.evaluate(token => {
    localStorage.setItem('authToken', token);
  }, token);
  
  // Or set as header
  await page.setExtraHTTPHeaders({
    'Authorization': `Bearer ${token}`
  });
});
```

**Strategy 4: Multiple User Roles**

```typescript
// auth-states/
// ├── admin.json
// ├── user.json
// └── guest.json

// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'admin-tests',
      use: { storageState: 'auth-states/admin.json' },
      testMatch: '**/admin/**',
    },
    {
      name: 'user-tests',
      use: { storageState: 'auth-states/user.json' },
      testMatch: '**/user/**',
    },
  ],
});
```

**Performance Comparison:**

| Method | Time per Test | Best For |
|--------|---------------|----------|
| **UI Login each test** | ~2-3 seconds | Small suites |
| **Storage State** | ~0.1 seconds | Large suites (recommended) |
| **API Login** | ~0.5 seconds | When UI login unavailable |
| **Fixture** | ~1-2 seconds | Test-specific setup |

**Real Project Example:**

```typescript
// We have 200 tests requiring authentication
// Before optimization: 200 × 3 seconds = 600 seconds (10 minutes)
// After storage state: 1 login (3s) + 200 × 0.1s = 23 seconds

// global-setup.ts - Runs once
async function globalSetup() {
  // Create auth states for different roles
  await createAuthState('admin', 'admin@test.com', 'admin-auth.json');
  await createAuthState('user', 'user@test.com', 'user-auth.json');
}

// tests run instantly with pre-authenticated state
test('admin dashboard', async ({ page }) => {
  test.use({ storageState: 'admin-auth.json' });
  await page.goto('/admin');
  // Instant access
});
```

In production, I always use the Storage State approach because it dramatically reduces test execution time while maintaining test isolation."

---

#### Q11: "How do you handle file uploads and downloads in Playwright?"

**Candidate Answer:**

"File operations are common in web testing. Here's how I handle both:

**FILE UPLOADS:**

**Method 1: Single File Upload**
```typescript
test('upload single file', async ({ page }) => {
  await page.goto('/upload');
  
  // Set file input
  await page.setInputFiles('#file-upload', 'files/document.pdf');
  
  // Verify file selected
  const fileName = await page.locator('#file-name').textContent();
  expect(fileName).toBe('document.pdf');
  
  await page.click('#submit');
});
```

**Method 2: Multiple Files**
```typescript
await page.setInputFiles('#file-upload', [
  'files/doc1.pdf',
  'files/doc2.pdf',
  'files/image.png'
]);
```

**Method 3: Upload from Buffer (Dynamic Files)**
```typescript
// Create file content dynamically
const fileContent = 'Test file content';
const buffer = Buffer.from(fileContent);

await page.setInputFiles('#file-upload', {
  name: 'test-file.txt',
  mimeType: 'text/plain',
  buffer: buffer,
});
```

**Method 4: Clear File Input**
```typescript
// Remove selected file
await page.setInputFiles('#file-upload', []);
```

**Method 5: Wait for Upload to Complete**
```typescript
test('upload with progress', async ({ page }) => {
  await page.goto('/upload');
  
  // Start upload
  await page.setInputFiles('#file-upload', 'large-file.zip');
  
  const uploadPromise = page.waitForResponse('**/api/upload');
  await page.click('#upload-button');
  
  // Wait for upload to finish
  const response = await uploadPromise;
  expect(response.status()).toBe(200);
  
  // Verify success message
  await expect(page.locator('.success')).toContainText('Upload successful');
});
```

**FILE DOWNLOADS:**

**Method 1: Basic Download**
```typescript
test('download file', async ({ page }) => {
  await page.goto('/downloads');
  
  // Start download
  const downloadPromise = page.waitForEvent('download');
  await page.click('#download-button');
  const download = await downloadPromise;
  
  // Get download info
  console.log('File name:', download.suggestedFilename());
  
  // Save to disk
  await download.saveAs('./downloads/' + download.suggestedFilename());
  
  // Verify file path
  const path = await download.path();
  expect(fs.existsSync(path)).toBeTruthy();
});
```

**Method 2: Verify Download Content**
```typescript
test('verify downloaded file', async ({ page }) => {
  await page.goto('/reports');
  
  const downloadPromise = page.waitForEvent('download');
  await page.click('#download-report');
  const download = await downloadPromise;
  
  // Read downloaded file content
  const path = await download.path();
  const content = fs.readFileSync(path, 'utf-8');
  
  // Verify content
  expect(content).toContain('Expected Data');
  expect(download.suggestedFilename()).toBe('report.csv');
});
```

**Method 3: Download with Authentication**
```typescript
test('authenticated download', async ({ page }) => {
  // Already authenticated via storageState
  await page.goto('/secure-files');
  
  const downloadPromise = page.waitForEvent('download');
  await page.click('[data-file-id="12345"]');
  const download = await downloadPromise;
  
  // Verify download started
  await download.saveAs('./secure-downloads/file.pdf');
});
```

**Method 4: Handle Multiple Downloads**
```typescript
test('bulk download', async ({ page }) => {
  await page.goto('/bulk-download');
  
  // Click download all
  await page.click('#download-all');
  
  // Wait for multiple downloads
  const downloads = [];
  
  page.on('download', download => {
    downloads.push(download);
  });
  
  // Wait for all 5 files
  await page.waitForTimeout(2000); // In real scenario, use better wait
  
  expect(downloads.length).toBe(5);
  
  // Save all files
  for (const download of downloads) {
    await download.saveAs(`./downloads/${download.suggestedFilename()}`);
  }
});
```

**Real-World Example: CSV Export Test**
```typescript
test('export users to CSV', async ({ page }) => {
  await page.goto('/users');
  
  // Apply filters
  await page.selectOption('#role-filter', 'admin');
  await page.fill('#search', 'John');
  
  // Wait for filtered results
  await expect(page.locator('.user-row')).toHaveCount(5);
  
  // Start download
  const downloadPromise = page.waitForEvent('download');
  await page.click('#export-csv');
  const download = await downloadPromise;
  
  // Verify file
  expect(download.suggestedFilename()).toMatch(/users-export-.*\.csv/);
  
  // Read and verify CSV content
  const path = await download.path();
  const csvContent = fs.readFileSync(path, 'utf-8');
  const lines = csvContent.split('\n');
  
  // Verify header
  expect(lines[0]).toContain('Name,Email,Role');
  
  // Verify data rows
  expect(lines.length).toBeGreaterThan(5); // Header + 5 users
  expect(csvContent).toContain('John');
  expect(csvContent).toContain('admin');
});
```

**Key Points I Always Remember:**
1. Use `waitForEvent('download')` before triggering download
2. Download path is temporary - save it if needed
3. For uploads, verify the file was actually uploaded (check UI or API)
4. Clean up downloaded files after tests
5. Test both success and error scenarios (wrong file type, too large, etc.)"

---

### 29.4 Advanced Level Questions (Senior SDET/Lead)

---

#### Q12: "Explain Playwright's architecture. How does it differ from Selenium, and why is it faster?"

**Candidate Answer:**

"Great question! Let me explain the fundamental architectural differences:

**Selenium Architecture (WebDriver Protocol):**
```
Test Code
   ↓ (HTTP/JSON)
WebDriver (Server)
   ↓ (HTTP/JSON)
Browser Driver (chromedriver, geckodriver)
   ↓ (Browser-specific protocol)
Browser
```

**Playwright Architecture (Direct Protocol):**
```
Test Code
   ↓ (WebSocket/CDP)
Browser (Direct communication)
```

**Key Architectural Differences:**

**1. Communication Protocol:**

Selenium:
- Uses W3C WebDriver protocol (HTTP-based)
- Every action requires HTTP request → response
- Multiple network hops introduce latency

```java
// Selenium - Multiple round trips
element.click(); // HTTP request 1
element.getText(); // HTTP request 2
element.getAttribute("class"); // HTTP request 3
// Each takes ~50-100ms
```

Playwright:
- Uses CDP (Chrome DevTools Protocol) for Chromium
- Uses Juggler protocol for Firefox
- Uses WebKit protocol for Safari
- WebSocket-based, persistent connection

```typescript
// Playwright - Single connection, batched operations
await page.click('button'); // Direct CDP command
const text = await page.textContent('h1'); // Instant
// Each takes ~10-20ms
```

**2. Browser Control:**

| Aspect | Selenium | Playwright |
|--------|----------|-----------|
| **Browser Driver** | Separate (chromedriver) | Built-in |
| **Protocol** | WebDriver (W3C standard) | CDP/Juggler/WebKit |
| **Connection** | HTTP (stateless) | WebSocket (persistent) |
| **Out-of-process** | Yes | No |

**3. Why Playwright is Faster:**

```typescript
// Benchmark comparison
test('speed comparison', async ({ page }) => {
  // Playwright: 50 actions = ~2 seconds
  for (let i = 0; i < 50; i++) {
    await page.click(`#button-${i}`);
  }
});

// Selenium: 50 actions = ~8 seconds
// Reason: Each action is a separate HTTP request
```

**Speed breakdown:**

```
Selenium Action:
1. Serialize command to JSON (5ms)
2. HTTP request to WebDriver (10ms)
3. WebDriver to browser driver (10ms)
4. Browser driver to browser (10ms)
5. Execute action (20ms)
6. Response back through chain (20ms)
Total: ~75ms per action

Playwright Action:
1. Send CDP command via WebSocket (5ms)
2. Browser executes directly (20ms)
3. Response via WebSocket (5ms)
Total: ~30ms per action

Speedup: 2.5x faster per action
```

**4. Auto-Waiting Implementation:**

Selenium (Manual):
```java
// Must implement explicit waits
WebDriverWait wait = new WebDriverWait(driver, 10);
wait.until(ExpectedConditions.elementToBeClickable(element));
element.click();
```

Playwright (Built-in):
```typescript
// Auto-waiting built into protocol
await page.click('button');
// Internally: Polls element state via CDP every 100ms
```

**5. Browser Context Isolation:**

Selenium:
- Each test needs new WebDriver instance
- Full browser launch (~2-3 seconds)

```java
// Selenium - Heavy
WebDriver driver = new ChromeDriver(); // 2-3 seconds
```

Playwright:
- Browser contexts provide isolation
- Context creation (~50ms)

```typescript
// Playwright - Lightweight
const context = await browser.newContext(); // 50ms
const page = await context.newPage(); // 20ms
```

**6. Network Interception:**

Selenium:
- Requires separate proxy (BrowserMob, etc.)
- Complex setup

Playwright:
- Built into CDP/protocol
- Native support

```typescript
// Playwright - Native network control
await page.route('**/api/**', route => {
  route.fulfill({ json: mockData });
});
```

**7. CDP Access:**

Playwright gives direct access to browser internals:

```typescript
// Performance metrics (not possible in Selenium)
const metrics = await page.evaluate(() => 
  JSON.stringify(performance.getEntries())
);

// Console logs
page.on('console', msg => console.log(msg.text()));

// Network logs
page.on('request', request => console.log(request.url()));

// Coverage data
const coverage = await page.coverage.stopJSCoverage();
```

**Real-World Impact:**

In my last project:
- **Selenium suite**: 500 tests, 45 minutes
- **After migrating to Playwright**: 500 tests, 12 minutes
- **Speedup**: 3.75x faster
- **Reasons**: 
  - Auto-waiting eliminated flaky waits
  - Browser context reuse
  - Faster protocol
  - Parallel execution efficiency

**When Selenium Might Still Be Preferred:**
- Legacy Java projects with heavy Selenium investment
- Need for IE11 support (Playwright doesn't support)
- Existing Selenium Grid infrastructure
- Team expertise in Selenium

**Conclusion:**

Playwright is fundamentally faster because:
1. Direct browser protocol (no WebDriver middle layer)
2. WebSocket persistent connection (vs HTTP)
3. Built-in auto-waiting (no manual wait overhead)
4. Browser context isolation (vs full browser instances)
5. Native network interception (vs proxy)

The architecture shift from HTTP-based WebDriver to WebSocket-based CDP/Juggler is the core reason for Playwright's speed and reliability advantages."

---

#### Q13: "How would you design a test automation framework from scratch using Playwright?"

**Candidate Answer:**

"Excellent question! Let me walk through my approach to designing a scalable, maintainable framework:

**1. Project Structure:**

```
playwright-framework/
├── tests/
│   ├── e2e/
│   │   ├── auth/
│   │   │   ├── login.spec.ts
│   │   │   └── signup.spec.ts
│   │   ├── checkout/
│   │   └── dashboard/
│   ├── api/
│   │   └── users.api.spec.ts
│   └── visual/
│       └── homepage.visual.spec.ts
├── pages/
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   └── BasePage.ts
├── components/
│   ├── Navigation.ts
│   ├── Modal.ts
│   └── Table.ts
├── fixtures/
│   ├── auth.fixture.ts
│   ├── test-data.fixture.ts
│   └── api.fixture.ts
├── utils/
│   ├── test-helpers.ts
│   ├── date-utils.ts
│   └── string-utils.ts
├── config/
│   ├── environments/
│   │   ├── dev.env
│   │   ├── staging.env
│   │   └── prod.env
│   └── test-data/
│       ├── users.json
│       └── products.json
├── global-setup.ts
├── global-teardown.ts
├── playwright.config.ts
└── package.json
```

**2. Base Page Pattern:**

```typescript
// pages/BasePage.ts
import { Page, Locator } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  async goto(path: string) {
    await this.page.goto(path);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async clickWithRetry(locator: Locator, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        await locator.click({ timeout: 5000 });
        return;
      } catch (error) {
        if (i === retries - 1) throw error;
        await this.page.waitForTimeout(1000);
      }
    }
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ 
      path: `screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }
}
```

**3. Page Object Model with Components:**

```typescript
// pages/DashboardPage.ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Navigation } from '../components/Navigation';
import { UserProfile } from '../components/UserProfile';

export class DashboardPage extends BasePage {
  private navigation: Navigation;
  private userProfile: UserProfile;

  constructor(page: Page) {
    super(page);
    this.navigation = new Navigation(page);
    this.userProfile = new UserProfile(page);
  }

  get welcomeMessage() {
    return this.page.locator('[data-testid="welcome-message"]');
  }

  get statsCards() {
    return this.page.locator('.stat-card');
  }

  async goto() {
    await super.goto('/dashboard');
    await this.waitForPageLoad();
  }

  async getStatValue(statName: string): Promise<string> {
    const stat = this.page.locator(`[data-stat="${statName}"]`);
    return await stat.textContent() || '';
  }

  async navigateToSection(section: string) {
    await this.navigation.clickMenuItem(section);
  }

  async openUserProfile() {
    await this.userProfile.open();
  }
}
```

**4. Reusable Fixtures:**

```typescript
// fixtures/auth.fixture.ts
import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

type AuthFixtures = {
  authenticatedPage: Page;
  adminPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      process.env.TEST_USER_EMAIL!,
      process.env.TEST_USER_PASSWORD!
    );
    await use(page);
  },

  adminPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      process.env.ADMIN_EMAIL!,
      process.env.ADMIN_PASSWORD!
    );
    await use(page);
  },
});

export { expect } from '@playwright/test';
```

**5. Test Data Management:**

```typescript
// fixtures/test-data.fixture.ts
import { test as base } from '@playwright/test';
import { faker } from '@faker-js/faker';

type TestDataFixtures = {
  testUser: {
    email: string;
    password: string;
    name: string;
  };
  testProduct: {
    name: string;
    price: number;
    sku: string;
  };
};

export const test = base.extend<TestDataFixtures>({
  testUser: async ({}, use) => {
    const user = {
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
      name: faker.person.fullName(),
    };
    
    // Create user via API
    await createUserViaAPI(user);
    
    await use(user);
    
    // Cleanup
    await deleteUserViaAPI(user.email);
  },

  testProduct: async ({}, use) => {
    const product = {
      name: faker.commerce.productName(),
      price: parseFloat(faker.commerce.price()),
      sku: faker.string.alphanumeric(10),
    };
    
    await createProductViaAPI(product);
    await use(product);
    await deleteProductViaAPI(product.sku);
  },
});
```

**6. Configuration Management:**

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment-specific config
const ENV = process.env.TEST_ENV || 'dev';
dotenv.config({ path: `./config/environments/${ENV}.env` });

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 4,
  
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'results.xml' }],
    ['json', { outputFile: 'results.json' }],
    [
      './custom-reporters/slack-reporter.ts',
      { webhookUrl: process.env.SLACK_WEBHOOK }
    ],
  ],

  use: {
    baseURL: process.env.BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'api',
      testMatch: /.*\.api\.spec\.ts/,
      use: { baseURL: process.env.API_URL },
    },
  ],

  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),
});
```

**7. API Helper Layer:**

```typescript
// utils/api-client.ts
import { APIRequestContext } from '@playwright/test';

export class APIClient {
  constructor(private request: APIRequestContext) {}

  async createUser(userData: any) {
    const response = await this.request.post('/api/users', {
      data: userData,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_TOKEN}`,
      },
    });
    
    if (!response.ok()) {
      throw new Error(`Failed to create user: ${response.status()}`);
    }
    
    return await response.json();
  }

  async deleteUser(userId: string) {
    await this.request.delete(`/api/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.API_TOKEN}`,
      },
    });
  }

  async waitForJobComplete(jobId: string, timeout = 30000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const response = await this.request.get(`/api/jobs/${jobId}`);
      const job = await response.json();
      
      if (job.status === 'completed') return job;
      if (job.status === 'failed') throw new Error('Job failed');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    throw new Error('Job timeout');
  }
}
```

**8. Custom Assertions:**

```typescript
// utils/custom-matchers.ts
import { expect } from '@playwright/test';

expect.extend({
  async toHaveValidationError(locator, expectedMessage) {
    const errorLocator = locator.locator('~ .error-message');
    const isVisible = await errorLocator.isVisible();
    const actualMessage = isVisible ? await errorLocator.textContent() : '';

    const pass = isVisible && actualMessage?.includes(expectedMessage);

    return {
      pass,
      message: () =>
        pass
          ? `Expected not to have validation error "${expectedMessage}"`
          : `Expected validation error "${expectedMessage}", got "${actualMessage}"`,
    };
  },
});
```

**9. Test Example Using Framework:**

```typescript
// tests/e2e/checkout/checkout.spec.ts
import { test, expect } from '../../../fixtures/test-data.fixture';
import { CheckoutPage } from '../../../pages/CheckoutPage';

test.describe('Checkout Flow', () => {
  test('complete purchase with valid card', async ({ 
    authenticatedPage, 
    testUser,
    testProduct 
  }) => {
    const checkoutPage = new CheckoutPage(authenticatedPage);
    
    // Navigate to product
    await authenticatedPage.goto(`/products/${testProduct.sku}`);
    await authenticatedPage.click('[data-testid="add-to-cart"]');
    
    // Go to checkout
    await checkoutPage.goto();
    
    // Fill shipping
    await checkoutPage.fillShippingInfo({
      address: '123 Test St',
      city: 'TestCity',
      zipCode: '12345',
    });
    
    // Fill payment
    await checkoutPage.fillPaymentInfo({
      cardNumber: '4242424242424242',
      expiry: '12/25',
      cvc: '123',
    });
    
    // Submit order
    await checkoutPage.submitOrder();
    
    // Verify success
    await expect(checkoutPage.successMessage).toBeVisible();
    await expect(checkoutPage.orderNumber).not.toBeEmpty();
    
    // Verify via API
    const orderNumber = await checkoutPage.getOrderNumber();
    const order = await checkoutPage.api.getOrder(orderNumber);
    expect(order.status).toBe('pending');
    expect(order.user.email).toBe(testUser.email);
  });
});
```

**10. CI/CD Integration:**

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
        shard: [1/4, 2/4, 3/4, 4/4]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      
      - name: Run tests
        run: npx playwright test --project=${{ matrix.browser }} --shard=${{ matrix.shard }}
        env:
          TEST_ENV: staging
          BASE_URL: ${{ secrets.STAGING_URL }}
          API_TOKEN: ${{ secrets.API_TOKEN }}
      
      - name: Upload artifacts
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report-${{ matrix.browser }}-${{ matrix.shard }}
          path: playwright-report/
```

**Key Design Principles:**

1. **Separation of Concerns**: Pages, components, fixtures separate
2. **DRY**: Reusable base classes and utilities
3. **Environment Agnostic**: Config-driven environment selection
4. **Data Isolation**: Test data created/cleaned per test
5. **API-First**: Use API for setup/teardown
6. **Parallel-Friendly**: No shared state between tests
7. **Maintainable**: Page objects hide implementation details
8. **Observable**: Comprehensive reporting and logging
9. **CI-Ready**: Optimized for parallel execution in CI

This framework has scaled well in my experience—from 50 tests to 1000+ tests with minimal refactoring needed."

---

#### Q14: "How do you handle parallel execution and prevent race conditions in tests?"

**Candidate Answer:**

"Parallel execution is one of Playwright's strengths, but it requires careful design to avoid race conditions. Let me explain my approach:

**1. Understanding Playwright's Parallel Execution:**

```
Test Suite: 100 tests, 4 workers configured

Worker 0 (Process)                Worker 1 (Process)
├─ Browser Instance               ├─ Browser Instance
├─ Test 1 → Context → Page        ├─ Test 2 → Context → Page
├─ Test 5 → Context → Page        ├─ Test 6 → Context → Page
└─ Test 9 → Context → Page        └─ Test 10 → Context → Page

Worker 2 (Process)                Worker 3 (Process)
├─ Browser Instance               ├─ Browser Instance
└─ Tests 3, 7, 11...              └─ Tests 4, 8, 12...
```

**2. Common Race Condition Scenarios & Solutions:**

**Problem 1: Shared File System Resources**

```typescript
// ❌ Race Condition
test('test 1', async ({ page }) => {
  fs.writeFileSync('data.json', JSON.stringify({ user: 'Alice' }));
  await page.goto('/dashboard');
  // Uses data.json
});

test('test 2', async ({ page }) => {
  fs.writeFileSync('data.json', JSON.stringify({ user: 'Bob' }));
  // CONFLICT! Both tests modify same file
  await page.goto('/dashboard');
});

// ✅ Solution: Worker-Specific Files
test('test 1', async ({ page }, testInfo) => {
  const fileName = `data-worker-${testInfo.workerIndex}.json`;
  fs.writeFileSync(fileName, JSON.stringify({ user: 'Alice' }));
  await page.goto(`/dashboard?config=${fileName}`);
});

test('test 2', async ({ page }, testInfo) => {
  const fileName = `data-worker-${testInfo.workerIndex}.json`;
  fs.writeFileSync(fileName, JSON.stringify({ user: 'Bob' }));
  await page.goto(`/dashboard?config=${fileName}`);
});
```

**Problem 2: Shared Database Records**

```typescript
// ❌ Race Condition
test('test 1', async ({ page }) => {
  // Both tests try to use user ID 1
  await db.update('users', { id: 1, status: 'active' });
  await page.goto('/user/1');
});

test('test 2', async ({ page }) => {
  await db.update('users', { id: 1, status: 'inactive' });
  await page.goto('/user/1'); // CONFLICT!
});

// ✅ Solution: Unique Test Data Per Test
const test = base.extend({
  uniqueUser: async ({}, use, testInfo) => {
    // Create unique user for this test
    const user = await db.create('users', {
      id: `test-${testInfo.workerIndex}-${Date.now()}`,
      email: `user-${testInfo.workerIndex}@test.com`,
      status: 'active',
    });
    
    await use(user);
    
    // Cleanup
    await db.delete('users', user.id);
  },
});

test('test 1', async ({ page, uniqueUser }) => {
  await page.goto(`/user/${uniqueUser.id}`);
  // Each test has its own user
});
```

**Problem 3: Port Conflicts (Running Local Servers)**

```typescript
// ❌ Race Condition
test.beforeAll(async () => {
  server = startServer(3000); // All workers try port 3000!
});

// ✅ Solution: Dynamic Port Per Worker
const test = base.extend({
  testServer: [async ({}, use, workerInfo) => {
    const port = 3000 + workerInfo.workerIndex; // 3000, 3001, 3002, 3003
    const server = startServer(port);
    
    await use({ port, url: `http://localhost:${port}` });
    
    await server.close();
  }, { scope: 'worker' }],
});

test('test', async ({ page, testServer }) => {
  await page.goto(testServer.url);
});
```

**3. Test Isolation Strategies:**

**Strategy 1: Worker-Scoped Fixtures (Setup once per worker)**

```typescript
const test = base.extend({
  // Worker fixture - runs once per worker
  database: [async ({}, use) => {
    const dbName = `test_db_${Date.now()}_${Math.random()}`;
    await createDatabase(dbName);
    const connection = await connectDatabase(dbName);
    
    await use(connection);
    
    await connection.close();
    await dropDatabase(dbName);
  }, { scope: 'worker' }],

  // Test fixture - runs per test
  cleanDatabase: async ({ database }, use) => {
    await use(database);
    await database.execute('DELETE FROM users WHERE email LIKE "%@test.com"');
  },
});
```

**Strategy 2: API-Based Test Data Isolation**

```typescript
class TestDataManager {
  private testDataIds: string[] = [];

  async createUser(workerIndex: number): Promise<User> {
    const user = await apiClient.post('/api/users', {
      email: `test-${workerIndex}-${Date.now()}@example.com`,
      name: `Test User ${workerIndex}`,
    });
    
    this.testDataIds.push(user.id);
    return user;
  }

  async cleanup() {
    for (const id of this.testDataIds) {
      await apiClient.delete(`/api/users/${id}`);
    }
  }
}

const test = base.extend({
  testData: async ({}, use, testInfo) => {
    const manager = new TestDataManager();
    await use(manager);
    await manager.cleanup();
  },
});
```

**Strategy 3: Database Transactions (Rollback After Test)**

```typescript
const test = base.extend({
  transactionalDatabase: async ({ database }, use) => {
    // Start transaction
    await database.query('START TRANSACTION');
    
    await use(database);
    
    // Rollback changes (test data never persisted)
    await database.query('ROLLBACK');
  },
});

test('user creation', async ({ page, transactionalDatabase }) => {
  // Create user in transaction
  await transactionalDatabase.query('INSERT INTO users...');
  
  // Test runs...
  
  // Transaction rolls back automatically
});
```

**4. Configuration for Optimal Parallelization:**

```typescript
// playwright.config.ts
export default defineConfig({
  // Fully parallel (default)
  fullyParallel: true,
  
  // Number of workers
  workers: process.env.CI ? 2 : 4,
  
  // Test groups that must run serially
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'tests',
      dependencies: ['setup'], // Runs after setup
      testMatch: /.*\.spec\.ts/,
    },
  ],
});
```

**5. Detecting Race Conditions:**

```typescript
// Run tests multiple times to find race conditions
// package.json
{
  "scripts": {
    "test:race": "for i in {1..10}; do npm test || exit 1; done"
  }
}

// Or use --repeat-each
npx playwright test --repeat-each=10
```

**6. Serial Test Execution (When Necessary):**

```typescript
// Some tests MUST run serially
test.describe.serial('database migrations', () => {
  test('migration 1', async ({ page }) => {
    await runMigration('001');
  });

  test('migration 2', async ({ page }) => {
    // Depends on migration 1
    await runMigration('002');
  });
});
```

**7. Real-World Example: E-commerce Checkout Tests**

```typescript
test.describe('Parallel-Safe Checkout Tests', () => {
  // Each test creates its own product and user
  test('checkout with credit card', async ({ page }, testInfo) => {
    // Worker-specific test data
    const product = await createProduct({
      sku: `TEST-${testInfo.workerIndex}-${Date.now()}`,
      price: 99.99,
    });
    
    const user = await createUser({
      email: `buyer-${testInfo.workerIndex}@test.com`,
    });
    
    // Login as this user
    await loginAs(page, user);
    
    // Add product to cart
    await page.goto(`/products/${product.sku}`);
    await page.click('[data-testid="add-to-cart"]');
    
    // Checkout
    await page.goto('/checkout');
    await page.fill('[name="cardNumber"]', '4242424242424242');
    await page.click('[data-testid="submit-order"]');
    
    // Verify order (specific to this test's data)
    await expect(page.locator('.order-success')).toContainText(product.sku);
    
    // Cleanup
    await deleteProduct(product.sku);
    await deleteUser(user.id);
  });

  test('checkout with PayPal', async ({ page }, testInfo) => {
    // Completely isolated from previous test
    // Creates its own product and user
  });
});
```

**Key Principles for Parallel-Safe Tests:**

1. ✅ **Unique Test Data**: Each test creates its own data
2. ✅ **Worker Index**: Use `testInfo.workerIndex` for isolation
3. ✅ **Cleanup**: Always clean up test data
4. ✅ **No Shared State**: Avoid global variables
5. ✅ **Idempotent**: Tests can run in any order
6. ✅ **Transaction Rollback**: For database tests
7. ✅ **Port Ranges**: Assign unique ports per worker
8. ✅ **Worker Fixtures**: Share expensive setup across tests in same worker

**Red Flags Indicating Race Conditions:**

- Tests pass individually but fail in parallel
- Tests pass locally but fail in CI randomly
- 'Resource already exists' errors
- Port/file conflicts
- Database constraint violations

In my last project, following these patterns allowed us to run 500 tests in 12 minutes across 8 workers with zero race conditions."

---

#### Q15: "How do you implement visual regression testing in Playwright?"

**Candidate Answer:**

"Visual regression testing is crucial for catching unintended UI changes. Here's my comprehensive approach:

**1. Basic Visual Comparison:**

```typescript
test('homepage visual test', async ({ page }) => {
  await page.goto('/');
  
  // First run: Creates baseline screenshot
  // Subsequent runs: Compares against baseline
  await expect(page).toHaveScreenshot('homepage.png');
});
```

**2. Element-Level Visual Testing:**

```typescript
test('button visual test', async ({ page }) => {
  await page.goto('/components');
  
  // Screenshot specific element
  const button = page.locator('[data-testid="primary-button"]');
  await expect(button).toHaveScreenshot('primary-button.png');
  
  // Test different states
  await button.hover();
  await expect(button).toHaveScreenshot('primary-button-hover.png');
  
  await button.focus();
  await expect(button).toHaveScreenshot('primary-button-focus.png');
});
```

**3. Configuration for Visual Tests:**

```typescript
// playwright.config.ts
export default defineConfig({
  expect: {
    toHaveScreenshot: {
      // Acceptable pixel difference threshold
      maxDiffPixels: 100,
      
      // Or percentage threshold
      maxDiffPixelRatio: 0.01, // 1% difference allowed
      
      // Animation handling
      animations: 'disabled',
      
      // Comparison method
      threshold: 0.2, // Color threshold (0-1)
    },
  },
  
  use: {
    // Disable animations for consistent screenshots
    actionTimeout: 5000,
    
    // Always use same viewport
    viewport: { width: 1280, height: 720 },
    
    // Same device scale factor
    deviceScaleFactor: 1,
  },
});
```

**4. Advanced Visual Testing Patterns:**

**Pattern 1: Cross-Browser Visual Testing**

```typescript
// Different baselines per browser
test('responsive design', async ({ page, browserName }) => {
  await page.goto('/');
  
  // Playwright creates separate baseline per browser
  // chromium/homepage.png
  // firefox/homepage.png  
  // webkit/homepage.png
  await expect(page).toHaveScreenshot();
});
```

**Pattern 2: Multiple Viewport Sizes**

```typescript
test.describe('Responsive Visual Tests', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    test(`homepage at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await expect(page).toHaveScreenshot(`homepage-${viewport.name}.png`);
    });
  }
});
```

**Pattern 3: Component Library Visual Testing**

```typescript
test.describe('Component Visual Regression', () => {
  const components = [
    { name: 'button', selector: '[data-component="button"]' },
    { name: 'input', selector: '[data-component="input"]' },
    { name: 'modal', selector: '[data-component="modal"]' },
  ];

  for (const component of components) {
    test(`${component.name} variants`, async ({ page }) => {
      await page.goto('/component-library');
      
      const element = page.locator(component.selector);
      
      // Test each variant
      await element.locator('[data-variant="primary"]').screenshot({
        path: `screenshots/${component.name}-primary.png`,
      });
      
      await element.locator('[data-variant="secondary"]').screenshot({
        path: `screenshots/${component.name}-secondary.png`,
      });
    });
  }
});
```

**5. Handling Dynamic Content:**

```typescript
test('page with dynamic content', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Mask dynamic elements
  await expect(page).toHaveScreenshot({
    mask: [
      page.locator('.timestamp'),
      page.locator('.live-counter'),
      page.locator('.user-avatar'),
    ],
  });
});
```

**6. Ignoring Specific Regions:**

```typescript
test('ignore ads', async ({ page }) => {
  await page.goto('/article');
  
  await expect(page).toHaveScreenshot({
    mask: [
      page.locator('.advertisement'),
      page.locator('.social-share-counts'),
    ],
  });
});
```

**7. Full Page vs Clip Screenshots:**

```typescript
test('screenshot strategies', async ({ page }) => {
  await page.goto('/long-page');
  
  // Full page (scrolls automatically)
  await expect(page).toHaveScreenshot({
    fullPage: true,
  });
  
  // Specific region
  await expect(page).toHaveScreenshot({
    clip: { x: 0, y: 0, width: 1000, height: 600 },
  });
  
  // Above the fold only
  await expect(page).toHaveScreenshot({
    fullPage: false,
  });
});
```

**8. Visual Testing Framework Architecture:**

```typescript
// visual-tests/BaseVisualTest.ts
export class BaseVisualTest {
  async captureAndCompare(
    page: Page,
    name: string,
    options?: {
      fullPage?: boolean;
      mask?: Locator[];
      maxDiffPixels?: number;
    }
  ) {
    // Wait for page to stabilize
    await page.waitForLoadState('networkidle');
    
    // Disable animations
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `,
    });
    
    // Wait for fonts to load
    await page.evaluate(() => document.fonts.ready);
    
    // Take screenshot
    await expect(page).toHaveScreenshot(name, {
      fullPage: options?.fullPage ?? false,
      mask: options?.mask ?? [],
      maxDiffPixels: options?.maxDiffPixels ?? 50,
      animations: 'disabled',
    });
  }
}
```

**9. Updating Baselines:**

```bash
# Update all baselines
npx playwright test --update-snapshots

# Update specific test
npx playwright test homepage.spec.ts --update-snapshots

# Update specific project
npx playwright test --project=chromium --update-snapshots
```

**10. CI/CD Integration:**

```typescript
// Different baselines per environment
test('environment-specific visuals', async ({ page }) => {
  const env = process.env.TEST_ENV || 'dev';
  await page.goto('/');
  
  // Baselines stored per environment
  await expect(page).toHaveScreenshot(`homepage-${env}.png`);
});
```

```yaml
# .github/workflows/visual-tests.yml
- name: Run Visual Tests
  run: npx playwright test visual-tests/
  
- name: Upload Visual Diffs
  if: failure()
  uses: actions/upload-artifact@v3
  with:
    name: visual-diffs
    path: test-results/
```

**11. Percy Integration (Advanced):**

```typescript
import { percySnapshot } from '@percy/playwright';

test('percy visual test', async ({ page }) => {
  await page.goto('/');
  
  // Sends to Percy.io for visual diffing
  await percySnapshot(page, 'Homepage');
  
  // Percy provides:
  // - Visual diff UI
  // - Review workflow
  // - Multi-browser comparison
  // - Historical tracking
});
```

**12. Real-World Example: E-commerce Product Page**

```typescript
test.describe('Product Page Visual Regression', () => {
  test('product details all states', async ({ page }) => {
    await page.goto('/products/laptop-xyz');
    
    // Wait for images to load
    await page.waitForLoadState('networkidle');
    
    // Initial state
    await expect(page).toHaveScreenshot('product-initial.png', {
      fullPage: true,
      mask: [
        page.locator('.review-timestamps'),
        page.locator('.stock-counter'),
      ],
    });
    
    // Select different variant
    await page.click('[data-variant="blue"]');
    await expect(page).toHaveScreenshot('product-variant-blue.png');
    
    // Zoom image
    await page.click('.product-image');
    await expect(page.locator('.image-modal')).toHaveScreenshot('product-zoom.png');
    
    // Close modal
    await page.click('.modal-close');
    
    // Add to cart animation
    await page.click('[data-testid="add-to-cart"]');
    await page.waitForTimeout(1000); // Animation completes
    await expect(page).toHaveScreenshot('product-added-to-cart.png');
  });
});
```

**Best Practices I Follow:**

1. ✅ **Consistent Environment**: Same viewport, same browser version
2. ✅ **Mask Dynamic Content**: Timestamps, counters, ads
3. ✅ **Disable Animations**: Use CSS to disable animations
4. ✅ **Wait for Fonts**: Ensure fonts loaded before screenshot
5. ✅ **Network Idle**: Wait for all assets to load
6. ✅ **Reasonable Thresholds**: Allow small acceptable differences
7. ✅ **Organized Baselines**: Store per browser/viewport/environment
8. ✅ **Review Process**: Manual review of visual diffs
9. ✅ **Don't Over-Test**: Focus on critical UI components
10. ✅ **Fast Feedback**: Run visual tests in parallel

**Common Pitfalls to Avoid:**

- ❌ Flaky screenshots from animations
- ❌ Font loading race conditions
- ❌ Too strict thresholds (fails on minor changes)
- ❌ Not masking dynamic content
- ❌ Inconsistent viewport sizes
- ❌ Testing every pixel of every page (slow, brittle)

In production, I combine Playwright's built-in visual testing for critical paths and Percy.io for comprehensive visual monitoring across the application."

---

#### Q16: "How would you handle testing a complex scenario like OAuth login flow with third-party redirects?"

**Candidate Answer:**

"OAuth flows are challenging because they involve third-party providers. Here's my comprehensive strategy:

**Challenge:** Testing OAuth requires:
1. Redirects to third-party (Google, GitHub, etc.)
2. User credentials for third-party
3. Callback handling
4. Token exchange
5. State management

**Solution 1: Mock OAuth Flow (Recommended for E2E Tests)**

```typescript
test('OAuth login - mocked', async ({ page, context }) => {
  // Intercept OAuth redirect
  await context.route('**/auth/google', async (route) => {
    // Instead of redirecting to Google, mock the callback
    const callbackUrl = 'http://localhost:3000/auth/callback?code=MOCK_CODE&state=abc123';
    await route.fulfill({
      status: 302,
      headers: { Location: callbackUrl },
    });
  });
  
  // Mock token exchange
  await context.route('**/oauth/token', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        access_token: 'mock_access_token',
        refresh_token: 'mock_refresh_token',
        expires_in: 3600,
      }),
    });
  });
  
  // Mock user info endpoint
  await context.route('**/oauth/userinfo', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: '12345',
        email: 'test@example.com',
        name: 'Test User',
      }),
    });
  });
  
  // Now test the flow
  await page.goto('/login');
  await page.click('[data-provider="google"]');
  
  // Should be logged in without actual Google redirect
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('.user-name')).toHaveText('Test User');
});
```

**Solution 2: Real OAuth with Test Credentials (Integration Tests)**

```typescript
test('OAuth login - real flow', async ({ page, context }) => {
  // Use actual OAuth provider with test account
  await page.goto('/login');
  await page.click('[data-provider="google"]');
  
  // Wait for Google login page
  await page.waitForURL('**/accounts.google.com/**');
  
  // Fill Google credentials
  await page.fill('input[type="email"]', process.env.GOOGLE_TEST_EMAIL!);
  await page.click('#identifierNext');
  
  await page.fill('input[type="password"]', process.env.GOOGLE_TEST_PASSWORD!);
  await page.click('#passwordNext');
  
  // Handle consent screen (first time only)
  const consentButton = page.locator('button:has-text("Continue")');
  if (await consentButton.isVisible({ timeout: 2000 })) {
    await consentButton.click();
  }
  
  // Wait for redirect back to app
  await page.waitForURL('**/dashboard');
  
  // Verify login success
  await expect(page.locator('.user-email')).toHaveText(process.env.GOOGLE_TEST_EMAIL!);
});
```

**Solution 3: Bypass OAuth with Direct Token Injection (Fastest)**

```typescript
test('OAuth bypass - direct token', async ({ page, context }) => {
  // Generate valid token via backend API
  const { accessToken, refreshToken } = await generateTestTokens({
    userId: 'test-user-123',
    email: 'test@example.com',
  });
  
  // Inject tokens directly into browser storage
  await context.addCookies([
    {
      name: 'access_token',
      value: accessToken,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    },
  ]);
  
  await page.goto('/');
  await page.evaluate((token) => {
    localStorage.setItem('auth_token', token);
  }, accessToken);
  
  // Now navigate to protected page
  await page.goto('/dashboard');
  await expect(page.locator('.dashboard')).toBeVisible();
});
```

**Solution 4: storageState for OAuth (Reuse Across Tests)**

```typescript
// global-setup.ts
async function globalSetup() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Perform OAuth login once
  await page.goto('http://localhost:3000/login');
  await page.click('[data-provider="google"]');
  
  // Complete OAuth flow (real or mocked)
  await page.waitForURL('**/dashboard');
  
  // Save authenticated state
  await context.storageState({ path: 'oauth-state.json' });
  
  await browser.close();
}

export default globalSetup;
```

```typescript
// All tests use saved OAuth state
test.use({ storageState: 'oauth-state.json' });

test('dashboard test', async ({ page }) => {
  await page.goto('/dashboard');
  // Already logged in via OAuth!
});
```

**Solution 5: Custom OAuth Mock Server**

```typescript
// mock-oauth-server.ts
import express from 'express';

export function startMockOAuthServer(port: number) {
  const app = express();
  
  // Mock authorization endpoint
  app.get('/oauth/authorize', (req, res) => {
    const { redirect_uri, state } = req.query;
    const code = 'MOCK_AUTH_CODE';
    res.redirect(`${redirect_uri}?code=${code}&state=${state}`);
  });
  
  // Mock token endpoint
  app.post('/oauth/token', (req, res) => {
    res.json({
      access_token: 'mock_access_token_' + Date.now(),
      refresh_token: 'mock_refresh_token',
      expires_in: 3600,
      token_type: 'Bearer',
    });
  });
  
  // Mock user info endpoint
  app.get('/oauth/userinfo', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    res.json({
      sub: '12345',
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://example.com/avatar.jpg',
    });
  });
  
  return app.listen(port);
}
```

```typescript
// Use in tests
test.beforeAll(async () => {
  mockOAuthServer = startMockOAuthServer(4000);
});

test('OAuth with mock server', async ({ page }) => {
  // Configure app to use mock OAuth server
  await page.goto('/');
  await page.evaluate(() => {
    window.OAUTH_URL = 'http://localhost:4000';
  });
  
  await page.click('[data-provider="google"]');
  await page.waitForURL('**/dashboard');
});

test.afterAll(async () => {
  mockOAuthServer.close();
});
```

**Real-World Example: Complete OAuth Test Suite**

```typescript
test.describe('OAuth Authentication', () => {
  test.describe('Google OAuth', () => {
    test('successful login', async ({ page, context }) => {
      // Mock all OAuth endpoints
      await setupGoogleOAuthMock(context);
      
      await page.goto('/login');
      await page.click('[data-testid="google-login"]');
      
      // Should redirect through OAuth and back
      await expect(page).toHaveURL('/dashboard');
      await expect(page.locator('.user-email')).toBeVisible();
      
      // Verify token stored
      const token = await page.evaluate(() => 
        localStorage.getItem('access_token')
      );
      expect(token).toBeTruthy();
    });

    test('OAuth cancellation', async ({ page, context }) => {
      await context.route('**/auth/google', route => {
        // Simulate user canceling OAuth
        route.fulfill({
          status: 302,
          headers: {
            Location: 'http://localhost:3000/login?error=access_denied',
          },
        });
      });
      
      await page.goto('/login');
      await page.click('[data-testid="google-login"]');
      
      // Should return to login with error
      await expect(page).toHaveURL('/login?error=access_denied');
      await expect(page.locator('.error-message')).toContainText('Authentication cancelled');
    });

    test('OAuth error handling', async ({ page, context }) => {
      // Mock token endpoint failure
      await context.route('**/oauth/token', route => {
        route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'invalid_grant',
            error_description: 'Authorization code expired',
          }),
        });
      });
      
      await page.goto('/auth/callback?code=EXPIRED_CODE');
      
      await expect(page).toHaveURL('/login?error=oauth_failed');
      await expect(page.locator('.error-message')).toBeVisible();
    });
  });

  test.describe('Token Refresh', () => {
    test('refreshes expired token', async ({ page, context }) => {
      // Set up expired token
      await page.goto('/');
      await page.evaluate(() => {
        localStorage.setItem('access_token', 'EXPIRED_TOKEN');
        localStorage.setItem('token_expires_at', String(Date.now() - 1000));
      });
      
      // Mock refresh token endpoint
      await context.route('**/oauth/refresh', route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            access_token: 'NEW_ACCESS_TOKEN',
            expires_in: 3600,
          }),
        });
      });
      
      // Navigate to protected page
      await page.goto('/dashboard');
      
      // Should auto-refresh and access page
      await expect(page.locator('.dashboard')).toBeVisible();
      
      // Verify new token
      const newToken = await page.evaluate(() =>
        localStorage.getItem('access_token')
      );
      expect(newToken).toBe('NEW_ACCESS_TOKEN');
    });
  });
});
```

**Helper Functions:**

```typescript
async function setupGoogleOAuthMock(context: BrowserContext) {
  await context.route('**/auth/google', async (route) => {
    const callbackUrl = `${route.request().url().split('/auth')[0]}/auth/callback?code=MOCK_CODE&state=abc123`;
    await route.fulfill({
      status: 302,
      headers: { Location: callbackUrl },
    });
  });
  
  await context.route('**/oauth/token', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        access_token: `mock_token_${Date.now()}`,
        refresh_token: 'mock_refresh',
        expires_in: 3600,
      }),
    });
  });
  
  await context.route('**/oauth/userinfo', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: '12345',
        email: 'test@example.com',
        name: 'Test User',
        picture: 'https://avatar.example.com/test.jpg',
      }),
    });
  });
}
```

**Key Takeaways:**

| Approach | Speed | Real OAuth | Maintenance | Best For |
|----------|-------|------------|-------------|----------|
| **Mocked Flow** | ⚡ Fastest | ❌ No | ✅ Low | E2E tests, CI/CD |
| **Real OAuth** | 🐌 Slowest | ✅ Yes | ❌ High | Integration tests |
| **Direct Token** | ⚡ Fast | ❌ No | ✅ Low | Unit/Component tests |
| **storageState** | ⚡ Fast | ✅ Yes (one-time) | ✅ Low | Test suites |
| **Mock Server** | ⚡ Fast | ❌ No | ⚠️ Medium | Complex OAuth flows |

In production, I use:
- **Mocked OAuth** for 90% of E2E tests (fast, reliable)
- **Real OAuth** for critical integration tests (weekly smoke tests)
- **storageState** for authenticated test suites (best performance)
- **Direct tokens** for API tests (no UI needed)

This approach gives us fast, reliable tests while still validating the OAuth integration where it matters."

---

## 30. Reference & Appendices

### 30.1 Playwright Terminology Glossary

| Term | Definition |
|------|------------|
| **Browser** | Browser instance (Chromium, Firefox, WebKit) |
| **BrowserContext** | Isolated browser session with own cookies, storage, cache |
| **Page** | Individual tab or window within a context |
| **Locator** | Lazy selector that auto-waits for elements |
| **ElementHandle** | Direct reference to DOM element (avoid in favor of locators) |
| **Frame** | iframe or frame element within a page |
| **Worker** | Web Worker or Service Worker |
| **Route** | Network request interception handler |
| **Fixture** | Reusable test setup/teardown logic |
| **Selector** | String to locate elements (CSS, XPath, text, etc.) |
| **Auto-waiting** | Automatic waiting for elements to be actionable |
| **Test Runner** | @playwright/test framework for running tests |
| **Trace** | Detailed recording of test execution |
| **Snapshot** | Visual screenshot for regression testing |
| **Assertion** | Verification of expected vs actual results |
| **Mock** | Simulated response for network requests |
| **Stub** | Replacement for external dependencies |
| **Sharding** | Splitting tests across multiple machines |
| **Worker Process** | Separate process running tests in parallel |
| **Retries** | Re-running failed tests automatically |
| **Viewport** | Browser window size |
| **Device Emulation** | Simulating mobile devices |
| **Geolocation** | Simulated geographic location |
| **Permissions** | Browser permissions (camera, microphone, etc.) |
| **Storage State** | Saved cookies and localStorage |
| **CDP** | Chrome DevTools Protocol |
| **WebSocket** | Real-time bidirectional communication |

---

### 30.2 Useful Resources & Links

#### Official Documentation
- **Playwright Docs**: https://playwright.dev
- **API Reference**: https://playwright.dev/docs/api/class-playwright
- **GitHub**: https://github.com/microsoft/playwright
- **Release Notes**: https://github.com/microsoft/playwright/releases

#### Community & Support
- **Discord**: https://aka.ms/playwright/discord
- **Stack Overflow**: https://stackoverflow.com/questions/tagged/playwright
- **Twitter**: @playwrightweb
- **YouTube**: Playwright Channel

#### Learning Resources
- **Playwright University**: https://playwrightsolutions.com
- **Automation Bro**: https://automationbro.com/playwright
- **Test Automation University**: https://testautomationu.applitools.com

#### Tools & Extensions
- **VS Code Extension**: ms-playwright.playwright
- **Playwright Inspector**: Built-in debugging tool
- **Trace Viewer**: Built-in trace analysis
- **Codegen**: Built-in test generator

#### Testing Services
- **BrowserStack**: Cloud testing platform
- **Sauce Labs**: Cloud testing platform
- **LambdaTest**: Cloud testing platform
- **Percy**: Visual testing
- **Applitools**: Visual AI testing

---

### 30.3 Cheat Sheet: Quick Command Reference

```bash
# Installation
npm init playwright@latest
npx playwright install
npx playwright install chromium

# Running Tests
npx playwright test                          # All tests
npx playwright test --headed                 # Headed mode
npx playwright test --debug                  # Debug mode
npx playwright test --ui                     # UI mode
npx playwright test file.spec.ts            # Specific file
npx playwright test --grep @smoke           # Filtered tests
npx playwright test --project=chromium      # Specific browser

# Code Generation
npx playwright codegen https://example.com   # Generate test
npx playwright codegen --target=python       # Python code

# Reporting
npx playwright show-report                   # HTML report
npx playwright show-trace trace.zip          # Trace viewer

# Configuration
npx playwright test --config=custom.config.ts
npx playwright test --workers=4
npx playwright test --retries=2
npx playwright test --timeout=60000
npx playwright test --shard=1/4

# Updates
npm install -D @playwright/test@latest
npx playwright install

# Version
npx playwright --version
```

---

### 30.4 Comparison Matrix: Playwright vs Other Tools

| Feature | Playwright | Selenium | Cypress | Puppeteer |
|---------|-----------|----------|---------|-----------|
| **Auto-waiting** | ✅ Built-in | ❌ Manual | ✅ Built-in | ⚠️ Partial |
| **Multi-browser** | ✅ Chromium, Firefox, WebKit | ✅ All major | ⚠️ Chrome, Firefox, Edge | ❌ Chromium only |
| **Multi-tab** | ✅ Full support | ✅ Yes | ❌ No | ✅ Yes |
| **iFrame handling** | ✅ Easy | ⚠️ Complex | ⚠️ Limited | ✅ Easy |
| **Network interception** | ✅ Excellent | ❌ Limited | ✅ Good | ✅ Excellent |
| **Parallel execution** | ✅ Built-in | ⚠️ Manual | ⚠️ Paid | ⚠️ Manual |
| **Test runner** | ✅ Included | ❌ Separate | ✅ Included | ❌ None |
| **Language support** | ✅ JS, TS, Python, Java, .NET | ✅ Many | ⚠️ JS only | ⚠️ JS only |
| **Mobile emulation** | ✅ Excellent | ⚠️ Basic | ⚠️ Basic | ✅ Good |
| **API testing** | ✅ Built-in | ❌ No | ✅ Yes | ❌ No |
| **Debugging** | ✅ Inspector, Trace | ⚠️ IDE | ✅ DevTools | ✅ DevTools |
| **CI/CD friendly** | ✅ Excellent | ✅ Good | ✅ Good | ✅ Good |
| **Speed** | ⚡⚡⚡ Fast | ⚡ Slower | ⚡⚡ Fast | ⚡⚡⚡ Fast |
| **Learning curve** | ⚡⚡ Medium | ⚡⚡⚡ Steep | ⚡ Easy | ⚡⚡ Medium |
| **Community** | 🌟🌟🌟🌟 Growing | 🌟🌟🌟🌟🌟 Mature | 🌟🌟🌟🌟 Large | 🌟🌟🌟 Good |
| **Documentation** | 🌟🌟🌟🌟🌟 Excellent | 🌟🌟🌟🌟 Good | 🌟🌟🌟🌟🌟 Excellent | 🌟🌟🌟🌟 Good |

---

### 30.5 Acronyms & Abbreviations

| Acronym | Full Form | Context |
|---------|-----------|---------|
| **A11y** | Accessibility | Web accessibility testing |
| **AAA** | Arrange, Act, Assert | Test structure pattern |
| **API** | Application Programming Interface | Backend testing |
| **BDD** | Behavior Driven Development | Cucumber, Gherkin |
| **CDP** | Chrome DevTools Protocol | Browser automation protocol |
| **CI/CD** | Continuous Integration/Continuous Deployment | Automation pipeline |
| **CLI** | Command Line Interface | Terminal commands |
| **CLS** | Cumulative Layout Shift | Web vitals metric |
| **CSP** | Content Security Policy | Security headers |
| **CSRF** | Cross-Site Request Forgery | Security vulnerability |
| **CSS** | Cascading Style Sheets | Styling, selectors |
| **DOM** | Document Object Model | HTML structure |
| **DSL** | Domain-Specific Language | Custom test language |
| **E2E** | End-to-End | Full user flow testing |
| **FID** | First Input Delay | Web vitals metric |
| **HTTP** | Hypertext Transfer Protocol | Web communication |
| **IDE** | Integrated Development Environment | Code editor |
| **JSON** | JavaScript Object Notation | Data format |
| **JWT** | JSON Web Token | Authentication token |
| **LCP** | Largest Contentful Paint | Web vitals metric |
| **OOP** | Object-Oriented Programming | Code paradigm |
| **POM** | Page Object Model | Test design pattern |
| **REST** | Representational State Transfer | API architecture |
| **RUM** | Real User Monitoring | Performance monitoring |
| **SDET** | Software Development Engineer in Test | QA role |
| **SPA** | Single Page Application | Modern web apps |
| **SQL** | Structured Query Language | Database queries |
| **SSO** | Single Sign-On | Authentication method |
| **TDD** | Test-Driven Development | Development methodology |
| **UAT** | User Acceptance Testing | Final testing phase |
| **UI** | User Interface | Frontend |
| **URL** | Uniform Resource Locator | Web address |
| **UX** | User Experience | Design quality |
| **WCAG** | Web Content Accessibility Guidelines | A11y standards |
| **XPath** | XML Path Language | Selector type |
| **XSS** | Cross-Site Scripting | Security vulnerability |

---

## 🎉 Conclusion

This comprehensive **Playwright Automation Guide** covers everything from beginner concepts to advanced enterprise patterns, designed specifically for SDET interview preparation.

### What You've Learned:

✅ **Sections 1-5**: Core fundamentals, installation, architecture, browser contexts, selectors  
✅ **Sections 6-10**: Auto-waiting, test runner, assertions, UI automation, API testing  
✅ **Sections 11-15**: Test data, parallelism, reporting, debugging, performance  
✅ **Sections 16-20**: Security testing, Jenkins CI/CD, Docker, advanced patterns, AI agents  
✅ **Sections 21-25**: Tool integration, observability, cross-browser, VS Code, migration  
✅ **Sections 26-30**: CLI reference, team architecture, QA processes, interview Q&A, appendices  

### Next Steps:

1. **Practice**: Build real projects using these patterns
2. **Contribute**: Share knowledge with the community
3. **Stay Updated**: Follow Playwright releases and best practices
4. **Interview Prep**: Review common questions and scenarios

### Key Takeaways:

- **Auto-waiting** eliminates flaky tests
- **Page Object Model** improves maintainability
- **Parallel execution** speeds up test suites
- **CI/CD integration** enables continuous testing
- **Best practices** lead to robust automation

**Good luck with your SDET journey! 🚀**

---

*Last Updated: December 30, 2025*  
*Version: 1.0.0*  
*Author: SDET Learning Guide*

---
