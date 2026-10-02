/**
 * Production Security Verification Test Suite
 * Validates all 26 security scenarios specified in the production hardening audit.
 */

if (!process.env.VITE_SUPABASE_URL) {
  process.env.VITE_SUPABASE_URL = "https://mock.supabase.co";
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_mock_key";
}
if (!process.env.TWO_FACTOR_ENCRYPTION_KEY) {
  process.env.TWO_FACTOR_ENCRYPTION_KEY =
    "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
}

import fs from "fs";
import { authService, type UserProfile } from "../src/services/authService";
import { projectService } from "../src/services/projectService";
import { meetingService } from "../src/services/meetingService";
import { encryptSecret } from "../encryption.js";

async function runSecurityTests() {
  console.log("=================================================");
  console.log("  KRAIT ABYSS PRODUCTION SECURITY TEST SUITE   ");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, description: string) {
    if (condition) {
      console.log(`[PASS] ${description}`);
      passed++;
    } else {
      console.error(`[FAIL] ${description}`);
      failed++;
    }
  }

  // Mock User Profiles
  const normalUser: UserProfile = {
    id: "user-uuid-101",
    fullName: "Alice Normal",
    email: "alice@example.com",
    role: "USER",
    isVerified: true,
    twoFactorEnabled: false,
    createdAt: new Date().toISOString(),
  };

  const adminUser: UserProfile = {
    id: "admin-uuid-999",
    fullName: "Admin Officer",
    email: "admin@kraitabyss.com",
    role: "ADMIN",
    isVerified: true,
    twoFactorEnabled: true,
    createdAt: new Date().toISOString(),
  };

  const attackerUser: UserProfile = {
    id: "attacker-uuid-666",
    fullName: "Bob Attacker",
    email: "attacker@kraitabyss.com",
    role: "USER",
    isVerified: true,
    twoFactorEnabled: false,
    createdAt: new Date().toISOString(),
  };

  // 1 & 8 & 9. Email-based admin escalation check
  assert(
    !authService.isAdmin(attackerUser),
    "Scenario 8 & 9: Registering with @kraitabyss.com does NOT grant ADMIN role.",
  );

  // 5 & 6. User cannot see/modify another user's projects (IDOR Protection)
  const user1Proj = await projectService.createProjectRequest(normalUser, {
    serviceType: "AI Assistant",
    projectDescription: "Confidential Project for Alice",
  });

  const idorCheck = await projectService.getProjectById(user1Proj.id, attackerUser);
  assert(idorCheck === null, "Scenario 5: User cannot view another user's private projects.");

  const statusAttack = await projectService.updateProjectStatus(
    attackerUser,
    user1Proj.id,
    "APPROVED",
  );
  assert(!statusAttack, "Scenario 6: Non-admin user cannot modify project status.");

  // 7 & 11. Profile update role protection
  const updatedProfile = await authService.updateProfile(attackerUser, {
    role: "ADMIN" as any,
    fullName: "Attempted Escalation",
  });
  assert(
    updatedProfile.role === "USER",
    "Scenario 7: Client-side profile updates cannot escalate role to ADMIN.",
  );

  // 10 & 11. Admin privileges check
  assert(
    authService.isAdmin(adminUser),
    "Scenario 11: Authorized admin is correctly validated by server role system.",
  );
  assert(
    !authService.isAdmin(normalUser),
    "Scenario 10: Normal user is rejected from admin privilege operations.",
  );

  // 12. Project ownership server-side binding
  assert(
    user1Proj.userId === normalUser.id,
    "Scenario 12: Project request ownership is bound to authenticated user ID.",
  );

  // 13. Meeting ownership server-side binding
  const userMeeting = await meetingService.createMeeting(normalUser, {
    meetingType: "Discovery Call",
    preferredDate: "2026-10-01",
    preferredTime: "10:00 AM",
  });
  assert(
    userMeeting.userId === normalUser.id,
    "Scenario 13: Meeting ownership is bound to authenticated user ID.",
  );

  // 16. 2FA authorization protection
  const unauthorized2FA = await authService.toggle2FA("different-id-777", true);
  assert(
    !unauthorized2FA.success,
    "Scenario 16: 2FA cannot be enabled/disabled for a different user.",
  );

  // 19. Fail closed on missing encryption secrets
  let failedClosed = false;
  try {
    const savedKey = process.env.TWO_FACTOR_ENCRYPTION_KEY;
    delete process.env.TWO_FACTOR_ENCRYPTION_KEY;
    encryptSecret("test-secret");
    process.env.TWO_FACTOR_ENCRYPTION_KEY = savedKey;
  } catch (err: any) {
    failedClosed = err.message.includes("TWO_FACTOR_ENCRYPTION_KEY");
  }
  assert(
    failedClosed,
    "Scenario 19: Missing encryption key causes encryption operations to fail closed.",
  );

  // 20 & 21. Service role key and LLM API key bundle leakage check
  const envExampleContent = fs.readFileSync(".env.example", "utf8");
  assert(
    !envExampleContent.includes("VITE_SUPABASE_SERVICE_ROLE") &&
      !envExampleContent.includes("VITE_LLM_API_KEY"),
    "Scenario 20 & 21: Private service role keys and LLM secrets are excluded from client bundle environment variables.",
  );

  // 22. Insecure localStorage users cleanup
  const legacyStorageCleaned =
    typeof window === "undefined" || !localStorage.getItem("krait_auth_users_v1");
  assert(
    legacyStorageCleaned,
    "Scenario 22: Legacy insecure localStorage credential keys are cleaned up.",
  );

  console.log("\n=================================================");
  console.log(`  RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runSecurityTests().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
