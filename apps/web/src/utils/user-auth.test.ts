import { describe, expect, it } from "vitest";
import { createUserToken, isValidUserRole, verifyUserToken } from "./user-auth";

describe("user auth helpers", () => {
  it("accepts supported roles", () => {
    expect(isValidUserRole("user")).toBe(true);
    expect(isValidUserRole("admin")).toBe(true);
    expect(isValidUserRole("editor")).toBe(true);
    expect(isValidUserRole("guest")).toBe(false);
  });

  it("round-trips a signed user token", () => {
    const token = createUserToken("alice", "user");
    const payload = verifyUserToken(token);

    expect(payload).not.toBeNull();
    expect(payload?.username).toBe("alice");
    expect(payload?.role).toBe("user");
  });
});
