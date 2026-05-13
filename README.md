# Symphony Automation Framework

A Playwright automation framework built for `https://fabric.symphonyfurnishings.com/`.

## Structure

- `pages/` - Page Object Model classes
- `tests/` - Playwright test cases
- `testData/` - JSON-driven test data
- `utils/` - Reusable helper methods
- `fixtures/` - Playwright test fixtures and base test setup

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Run tests

- Run all tests:
  ```bash
  npm test
  ```

- Run headed tests:
  ```bash
  npm run test:headed
  ```

- Generate and view HTML report:
  ```bash
  npm run test:report
  ```

## Test files

- `tests/login.spec.js`
- `tests/architectProject.spec.js`
- `tests/adminProjectValidation.spec.js`

## Notes

- Uses Page Object Model and data-driven JSON configuration
- Captures screenshots on failure
- Uses Playwright test runner with HTML report generation
- Uses dynamic locator strategies and reusable utilities
