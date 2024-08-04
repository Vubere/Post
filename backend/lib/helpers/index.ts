import bcrypt from "bcryptjs";

async function hashPassword(password: string) {
  return await bcrypt.hash(password, 12);
}

export { hashPassword };
