export const isValidEmail = (email: string): boolean => {
  // Add your email validation logic (e.g., using a regular expression)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  // Add your password validation logic (e.g., minimum length, required characters)
  return password.length >= 8; // Example: Require a minimum of 8 characters
};
