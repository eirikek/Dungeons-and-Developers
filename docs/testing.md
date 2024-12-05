# Testing

## How to run tests

### E2E testing

For E2E testing we have used Cypress to simulate different user stories. We have made;

- **Login.cy**: Tests login, searching, and user interaction with data
- **Filtering.cy**: tests login and filtering.

To run the E2E tests you need a running frontend and backend, be in the frontend folder and run:

```bash
  npx cypress open
```

This should open a Cypress desktop where you need to navigate to E2E testing.
From here you can select the tests and watch as they are ran in a virtual desktop!

### Component testing

We have also made several component testing in the _tests_ folder in our frontend folder. These are to make sure the component
renders correctly, and behaves as expected during interactions.

We have used _AuthContext_ and _AuthProvider_.

We have made sure to use _MockedProvider_ to mock requests, and the components are tested for correct data handling from GraphQL-requests

#### Running the tests

Be in the frontend folder, and you can run:

```bash
  npm test
```

This document outlines the testing strategy employed for our project, detailing the rationale behind our choices, the tools used, and the achieved test coverage.

## Why We Test

Thorough testing is crucial to ensure the reliability, maintainability, and correctness of our application. It helps us catch bugs early in the development cycle, catch edge-cases, and provides confidence in the codebase's stability.

### Testing Approach

Our testing strategy employs a multi-layered approach, combining both component and end-to-end (E2E) testing:

- **Component Testing (Vitest):** We utilize Vitest for unit and component testing, focusing on individual components in isolation. This allows us to verify the functionality of smaller units of code, ensuring they behave as expected independently. We prioritize testing UI components with Vitest, that are not too complex. Early we discovered that large components, and interactive components needed too much set-up with mock-data and contexts. Therfore we have excluded the large components/pages from this type of testing. We also leveraged a coverage reporter, to identify un-tested components.
  For `Counter` component we had to use fireEvent for user interaction, because the component requires user to hold down mouse/key on keyboard, to increment/decrement score.

- **End-to-End Testing (Cypress):** For larger components/pages and critical user flows, we leverage Cypress for E2E testing. This approach tests the application as a whole, simulating real user interactions within a browser environment. E2E tests help us identify integration issues and ensure the application functions correctly from the user's perspective. We defined some user stories to follow, to make sure the e2e testing followed a logical flow from a user's perspective.

### Testing Tools

- **Vitest:** A fast and efficient unit testing framework that integrates seamlessly with Vite projects.
- **User Events:** A library that provides utilities for simulating user interactions (e.g., clicks, typing) within tests.
- **Snapshot Testing:** A technique that captures the rendered output of a component and compares it against a previously saved "snapshot." This helps detect unexpected UI changes.
- **Cypress:** A comprehensive E2E testing framework that provides a robust and user-friendly environment for testing web applications.

### Coverage

We strive for a test coverage that covers the most critical parts of our website. The flow and branches a user can take when entering our website. As stated earlier we have excluded some components/pages from report and vitest, because we considered it too difficult and time consuming.

**[Insert Coverage Report Here]**

**Tested Files:**

- **Component Tests:** [List of tested component files]
- **E2E Tests:** [List of tested user flows/scenarios]

### Rationale for Testing Choices

We opted for this combined approach to leverage the strengths of both component and E2E testing:

- **Component tests** allow for rapid feedback and efficient testing of individual units of code. They are particularly useful for testing complex logic and interactions within smaller components.
- **E2E tests** provide a higher-level view of the application, ensuring all components work together correctly and the user experience is seamless.

By combining these methods, we achieve a comprehensive testing strategy that balances speed, efficiency, and confidence in our application's quality.
