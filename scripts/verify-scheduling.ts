
import { generateAvailableSlots } from '../src/lib/scheduling-engine';
import { SchedulingConfig } from '../src/lib/scheduling-store';

console.log("---------------------------------------------------");
console.log("🧪  VERIFYING SCHEDULING WORKFLOW AUTOMATION");
console.log("---------------------------------------------------");

// 1. Setup Mock Configuration
const mockConfig: SchedulingConfig = {
    operatingHours: { start: "09:00", end: "12:00" }, // Short day for easy testing
    breaks: [
        { id: 'b1', start: "10:30", end: "11:00", label: "Coffee Break" }
    ],
    bookingMode: 'manual',
    showDoctorAvailability: true,
    slotDurationMinutes: 30,
    doctors: [],
    patients: [],
    appointments: [],
    operationalChairs: 5,
    activeChairs: 3
};

console.log(`\nPARAMS:
- Hours: ${mockConfig.operatingHours.start} - ${mockConfig.operatingHours.end}
- Breaks: ${mockConfig.breaks[0].start} - ${mockConfig.breaks[0].end}
- Duration: ${mockConfig.slotDurationMinutes} mins
`);

// 2. Generate Slots
const slots = generateAvailableSlots(mockConfig);

console.log(`\nGENERATED SLOTS: [ ${slots.join(' | ')} ]`);

// 3. Assertions
const expectedSlots = ["09:00", "09:30", "10:00", "11:00", "11:30"];
const missingSlots = expectedSlots.filter(s => !slots.includes(s));
const unexpectedSlots = slots.filter(s => !expectedSlots.includes(s));

// Check Break Logic
const hasBreakSlot = slots.includes("10:30");

if (missingSlots.length === 0 && unexpectedSlots.length === 0 && !hasBreakSlot) {
    console.log("\n✅  TEST PASSED: Workflow Logic is Correct.");
    console.log("    - Generated slots align with Operating Hours.");
    console.log("    - Break (10:30) was successfully skipped.");
} else {
    console.log("\n❌  TEST FAILED:");
    if (hasBreakSlot) console.log("    [FAIL] Break slot (10:30) was present but should be skipped.");
    if (missingSlots.length > 0) console.log(`    [FAIL] Missing Expected Slots: ${missingSlots.join(', ')}`);
    if (unexpectedSlots.length > 0) console.log(`    [FAIL] Unexpected Slots: ${unexpectedSlots.join(', ')}`);
}

console.log("---------------------------------------------------");
