import { hashPassword } from "../../utils/hash";
import bcrypt from "bcryptjs";

jest.mock("bcryptjs", () => ({
  hashSync: jest.fn(() => "hashedPassword"),
}));

test("should hash password correctly", () => {
  const result = hashPassword("myPassword");
  expect(result).toBe("hashedPassword");
  expect(bcrypt.hashSync).toHaveBeenCalledWith("myPassword", 10);
});
