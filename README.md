# ParaBank Test Automation Framework

This is a comprehensive end-to-end test automation framework for ParaBank using Playwright. The framework covers both UI and API test scenarios.

## Prerequisites

- Node.js (v20.11.1 or higher)
- npm (included with Node.js)
- A modern web browser (Chrome, Firefox, or Safari)

## Getting Started

1. Clone the repository: gh repo clone bjbjoshi984/Fabric-QA-Para-Automation
   Link: https://github.com/bjbjoshi984/Fabric-QA-Para-Automation/tree/master
```bash
git clone bjbjoshi984/Fabric-QA-Para-Automation
cd UI-Automation-Framework
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## Project Structure

```
├── tests/
│   ├── api/                    # API tests
│   ├── e2e/                    # End-to-end tests
│   ├── page-objects/           # Page Object Models
│   └── utils/                  # Utility functions
├── playwright.config.ts        # Playwright configuration
└── package.json               # Project dependencies
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests with UI mode
```bash
npm run test:ui
```
## Test Scenarios

### UI Tests

1. Navigate to Para bank application.
2. Create a new user from user registration page (Ensure username is generated randomly and it is unique in every test
execution).
3. Login to the application with the user created in step 2.
4. Verify if the Global navigation menu in home page is working as expected.
5. Create a Savings account from “Open New Account Page” and capture the account number.
6. Validate if Accounts overview page is displaying the balance details as expected.
7. Transfer funds from account created in step 5 to another account.
8. Pay the bill with account created in step 5.
9. Add necessary assertions at each test step whenever it is needed.

### API Tests

1. Search the transactions using “Find transactions” API call by amount for the payment transactions made in Step 8.
2. Validate the details displayed in Json response.

## CI/CD Integration

### Local Jenkins Setup

1. Install Jenkins:
```bash
brew install jenkins-lts
```

2. Start Jenkins:
```bash
brew services start jenkins-lts
```

3. Access Jenkins:
   - Open http://localhost:8080
   - Get initial admin password: `cat ~/.jenkins/secrets/initialAdminPassword`

4. Configure Pipeline:
   - Create new Pipeline job
   - Configure Git repository
   - Use provided Jenkinsfile

### Running Pipeline

1. Click "Build Now" to start the pipeline
2. Monitor build progress in Stage View
3. View test reports in Jenkins after completion
