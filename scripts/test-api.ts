const BASE_URL = 'http://localhost:3000/api';

async function testAPI() {
    console.log("Starting API Tests...");

    // 1. Create a Habit
    console.log("\n1. Creating Habit...");
    const createRes = await fetch(`${BASE_URL}/habits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: "Test Habit",
            description: "Testing the API",
            frequency: "daily"
        })
    });
    const habit = await createRes.json();
    console.log("Created:", createRes.status, habit);

    if (!habit.id) {
        console.error("Failed to create habit, aborting.");
        return;
    }

    // 2. Get Habits
    console.log("\n2. Fetching Habits...");
    const listRes = await fetch(`${BASE_URL}/habits`);
    const list = await listRes.json();
    console.log("List:", listRes.status, list.length, "habits");

    // 3. Log Habit
    console.log("\n3. Logging Habit...");
    const logRes = await fetch(`${BASE_URL}/habits/${habit.id}/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            date: new Date().toISOString(),
            status: "completed"
        })
    });
    const log = await logRes.json();
    console.log("Logged:", logRes.status, log);

    // 4. Delete Habit
    console.log("\n4. Deleting Habit...");
    const deleteRes = await fetch(`${BASE_URL}/habits/${habit.id}`, {
        method: 'DELETE'
    });
    console.log("Deleted:", deleteRes.status);

    console.log("\nAPI Tests Completed.");
}

testAPI().catch(console.error);
