// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Suppress known MUI v5 + React Testing Library warnings from third-party internals.
const SUPPRESSED_WARNINGS = [
  'not wrapped in act(',
  'A props object containing a "key" prop is being spread into JSX',
  'A component is changing a controlled input to be uncontrolled',
  'A component is changing the controlled checked state of SwitchBase to be uncontrolled',
];

const originalError = console.error.bind(console);
console.error = (...args) => {
  if (typeof args[0] === 'string' && SUPPRESSED_WARNINGS.some((w) => args[0].includes(w))) return;
  originalError(...args);
};