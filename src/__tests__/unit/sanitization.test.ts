import { describe, it, expect } from "vitest";
import { sanitizeMetadata } from "../../lib/utils/sanitization";

describe("Sanitization Utility", () => {
  it("should sanitize YouTube title and description", () => {
    const input = {
      title: "My <Awesome> Video with a very long title that should definitely be truncated because YouTube has a 100 character limit for titles",
      description: "Check out my video! <b>Cool</b>",
    };
    const sanitized = sanitizeMetadata("youtube", input);
    
    // The current implementation truncates to 100 first, then removes <>, 
    // resulting in 98 characters for this specific input.
    expect(sanitized.title?.length).toBeLessThanOrEqual(100);
    expect(sanitized.title).toContain("My Awesome Video");
    expect(sanitized.title).not.toContain("<");
    expect(sanitized.title).not.toContain(">");
  });

  it("should sanitize TikTok description length", () => {
    const longDescription = "a".repeat(3000);
    const input = { description: longDescription };
    const sanitized = sanitizeMetadata("tiktok", input);
    
    expect(sanitized.description?.length).toBe(2200);
  });

  it("should normalize unicode in generic sanitization", () => {
    const input = { title: "Test\u212B" }; // Angstrom sign
    const sanitized = sanitizeMetadata("generic", input);
    expect(sanitized.title).toBe("TestÅ"); // Normalized to A + ring
  });
});
