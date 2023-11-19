import "../configs/dotenv";

import bcrypt from "bcrypt";

const salt = process.env.PASSWORD_SALT || ""; // Adjust according to your security needs

export async function hashPassword(password: string): Promise<string> {
  // Hash the password using the generated salt
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
}

export const comparePasswords = async (
  candidatePassword: string,
  hashedPassword: string
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(candidatePassword, hashedPassword);
  return isMatch;
};

export function generateRandomPassword(length: number) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-=_+";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}
