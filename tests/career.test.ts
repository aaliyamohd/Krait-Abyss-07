import { careerService } from "../src/services/careerService.ts";

async function testCareerSubmission() {
  console.log("=== Testing Career Application Dispatch ===");
  const testApp = {
    full_name: "Test Applicant",
    email: "applicant.test@kraitabyss.com",
    phone: "+91 9988776655",
    location: "Hyderabad",
    role_applied: "Full-Stack Web Developer",
    portfolio_url: "https://github.com/test-applicant",
    cover_note: "Skills: React, TypeScript, Tailwind\nWhy: Excited to build digital products with Krait Abyss.",
  };

  const res = await careerService.submitApplication(testApp);
  console.log("Submission Result:", res);

  const applications = careerService.getApplications();
  console.log("Total Local Applications Count:", applications.length);
  const found = applications.find((a) => a.email === testApp.email);
  if (found) {
    console.log("✓ Application verified in state/storage:", found.id, found.role_applied);
  } else {
    console.error("❌ Application not found in storage!");
    process.exit(1);
  }

  console.log("=== Career Application Test Passed Cleanly! ===");
}

testCareerSubmission().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
