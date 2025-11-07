# Health Onboarding Form - Coding Challenge

# Thomas's Notes:
In order to make sure I'm not blowing out the two hour time limit, here's some notes on parts I would have given more attention to if I had a longer time-limit:
- The tests are present and passing, and I've given them a look over, but not the full meticulous review I would give them, given I fundamentally don't trust AI tests. So the tests are there, and from a quick glance look okay, but do not trust their lies! 🤣
- One of the tests is hitting an issue with it's mock of localstorage that I ran out of time to resolve, which isn't ideal.
- The QR code in the final step is totally fake, ideally I'd use the node package mentioned for one of the other possible take home assignments and make a QR code that way, but that feels out of scope so I skipped it.
- Definitely abusing localstorage a bit here in a way that, if this were to be productionized, I'd have to pull out and replace with real actual network calls, but once again, felt a bit out of scope given time restrictions.
- I've tried to do a thorough audit of inline css vars or hardcoded strings and refactor them out for some future internationalization, but I haven't done a full thorough audit so I bet somewhere there's something hardcoded in a gross way, once again just due to time constraints.
- I haven't paid any thought to accessibility, so anything like aria labels and other readouts things like a screen reader might need are not present, though the site is pretty straight forward and can be tabbed through, so it shouldn't be some massive lift to add this in the future.

# Initial prompt used:

Could you please, using the following technologies, implement a solution to this multistep health onboarding form: 
React, 
TypeScript, 
react context for state management, 
webpack, 
appropriate linting rules, 
working jest tests that are colocated with the files & functions they test, that appropriately test functionality.

Please make sure that the form goes through the following flow:
- first prompt a user to create an account, by providing a username and password, and call the `login()` function in @auth.ts, and use the data returned from that response.
- next the user will select their membership tier, using the data from @membership-tiers.json, on a page that displays all of the membership tiers, the price, their features, and other relevant information
- The user will then be prompted to input a dummy credit card into a credit card form that will accept any numbers as valid, and pass them onto the next step
- The next step will be the user inputting their health conditions, generated from the json list in @health-conditions.json.
- The final step will be a page that shows a mock QR code and the information they selected in the prior steps.
- Each step should persist the prior selections in localstorage until a user clicks a logout button in the header of the page.

## original readme (with an inventory of things the work I added at the bottom)

## Overview

Build a multi-step registration form for new gym members. Users need to provide information across multiple steps before completing their sign up. This challenge is designed to be completed within **2 hours** and focuses on React component architecture, state management, form handling, validation, and user experience.

**Important:** The goal is not necessarily to finish every feature. We understand the requirements are ambitious for 2 hours, and we're most interested in seeing what you prioritise and your approach to problem-solving. We value seeing your design decisions, code quality, and how you think about production systems. A well-structured, partially complete solution with good fundamentals is better than a rushed, fully complete one.

## Provided Assets

- `assets/auth.ts` - Mock authentication utilities
- `assets/membership-tiers.json` - Available membership options
- `assets/health-conditions.json` - Sample health conditions list

## Requirements

Build a multi-step registration workflow for gym membership sign up. Consider:

- What information needs to be collected?
- How should the form be broken into steps?
- How will you manage state across steps?
- How will you validate user input?
- How should users navigate between steps?
- What happens when the form is submitted?

## What We're Looking For

We'll be evaluating your approach to problem-solving, code quality, and how you think about production systems.

## Technical Requirements

- Use **React** with **TypeScript**
- Build this however you would approach it in a real project

You have complete freedom to choose frameworks, libraries, tools, and project structure.

## Getting Started

1. Review the provided assets
2. Plan your form steps and data collection
3. Set up your project with your preferred tools
4. Build your solution
5. Document your approach

## Submission

When you're ready to submit:

1. Include any documentation necessary to run and understand your solution
2. Submit by either:
   - Sharing a link to a public GitHub repository, or
   - Zipping up your project folder and emailing it back to us

Good luck! We look forward to seeing what you build.

---

## Implementation

This solution implements a multi-step health onboarding form using React, TypeScript, React Context for state management, Webpack, ESLint, and Jest for testing.

### Features

- **Multi-step form flow**: Login → Membership Selection → Payment → Health Conditions → Summary
- **State management**: React Context API with localStorage persistence
- **Responsive design**: Mobile-friendly UI with step indicators
- **Form validation**: Input validation and error handling
- **Testing**: Jest tests colocated with components
- **Type safety**: Full TypeScript implementation

### Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Run tests:**
   ```bash
   npm test
   ```

5. **Run tests in watch mode:**
   ```bash
   npm run test:watch
   ```

6. **Lint code:**
   ```bash
   npm run lint
   ```

7. **Fix linting issues:**
   ```bash
   npm run lint:fix
   ```

### Project Structure

```
health-onboarding-form/
├── assets/                    # Provided assets (auth.ts, JSON data)
│   ├── auth.ts
│   ├── health-conditions.json
│   └── membership-tiers.json
├── dist/                      # Build output
├── public/                    # Static files (HTML template)
│   └── index.html
├── src/
│   ├── components/            # React components (organized by feature)
│   │   ├── __tests__/         # Component tests (colocated)
│   │   │   ├── Header.test.tsx
│   │   │   └── LoginStep.test.tsx
│   │   ├── login/             # Login step component
│   │   │   ├── LoginStep.tsx
│   │   │   ├── LoginStep.css
│   │   │   └── LoginStep.test.tsx
│   │   ├── membership/        # Membership selection component
│   │   │   ├── MembershipTierStep.tsx
│   │   │   ├── MembershipTierStep.css
│   │   │   └── MembershipTierStep.test.tsx
│   │   ├── payment/           # Payment step component
│   │   │   ├── CreditCardStep.tsx
│   │   │   ├── CreditCardStep.css
│   │   │   └── CreditCardStep.test.tsx
│   │   ├── health-info/       # Health conditions component
│   │   │   ├── HealthConditionsStep.tsx
│   │   │   ├── HealthConditionsStep.css
│   │   │   └── HealthConditionsStep.test.tsx
│   │   ├── summary/           # Summary step component
│   │   │   ├── SummaryStep.tsx
│   │   │   ├── SummaryStep.css
│   │   │   └── SummaryStep.test.tsx
│   │   └── shared/            # Shared components
│   │       ├── Header.tsx
│   │       ├── Header.css
│   │       └── Header.test.tsx
│   ├── context/               # React Context providers
│   │   ├── __tests__/
│   │   │   └── OnboardingContext.test.tsx
│   │   └── OnboardingContext.tsx
│   ├── constants/             # Application constants
│   │   └── index.ts
│   ├── types/                 # TypeScript type definitions
│   │   ├── index.ts
│   │   └── json.d.ts
│   ├── __mocks__/             # Jest mocks
│   │   └── fileMock.js
│   ├── __tests__/             # App-level tests
│   │   └── App.test.tsx
│   ├── App.tsx                # Main app component
│   ├── App.css                # App styles
│   ├── index.tsx              # Entry point
│   └── setupTests.ts          # Jest setup
├── webpack.config.js          # Webpack configuration
├── tsconfig.json              # TypeScript configuration
├── jest.config.js             # Jest configuration
└── package.json               # Dependencies and scripts
```

### Form Flow

1. **Login Step**: User enters email and password. Calls `login()` from `auth.ts` and stores the returned user data and token.

2. **Membership Selection**: Displays all membership tiers from `membership-tiers.json` with pricing, features, and access hours. User selects a tier.

3. **Payment Step**: Credit card form that accepts any numbers as valid. Formats card number and expiry date inputs.

4. **Health Conditions**: Displays health conditions from `health-conditions.json`, grouped by category. Shows medical clearance badges for conditions that require it.

5. **Summary**: Displays a mock QR code and all selected information (user details, membership plan, health conditions).

### State Management

- Uses React Context API (`OnboardingContext`) for global state
- Automatically persists state to localStorage
- State is cleared when user clicks logout button in header

### Testing

Tests are colocated with components in `__tests__` directories. Tests cover:
- Component rendering
- User interactions
- State management
- Form validation
- Context functionality

### Technologies Used

- **React 18**: UI library
- **TypeScript**: Type safety
- **Webpack**: Module bundler
- **Jest**: Testing framework
- **ESLint**: Code linting
- **React Context API**: State management
- **CSS**: Styling (no CSS-in-JS framework)