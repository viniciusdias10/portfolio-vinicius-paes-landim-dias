# Security Specification - Maker SVG

## Data Invariants
1. A competition must have a non-empty name and description.
2. The status must be either 'active' or 'closed'.
3. Only an admin (initially vpaes053@gmail.com) can create or delete competitions.
4. Timestamps must be valid ISO strings (validated as strings and size).

## The "Dirty Dozen" Payloads (Examples)
1. Unauthorized User Create: An unauthenticated user tries to add a document to `/competitions`.
2. Wrong Role Create: A user who is not an admin tries to create a competition.
3. ID Poisoning: Creating a competition with a document ID that is a 2KB string.
4. Schema Breach: Creating a competition without the `status` field.
5. Enum Breach: Setting `status` to `deleted` (not in enum).
6. Type Mismatch: Passing a number for `name`.
7. Shadow Keys: Adding an `allowPublicWrite: true` field to a competition document.
8. Malicious ID: Using `/competitions/../../../etc/passwd`.
9. Resource Exhaustion: Sending a 1MB string for `description`.
10. Update Gap: Changing `createdAt` after it was set.
11. Privilege Escalation: Trying to set own role to admin in a hypothetical `users` collection.
12. Blanket List: Querying for all competitions without being signed in (if privacy is required).

## Test Runner (firestore.rules.test.ts)
(This is a conceptual outline as I don't have a local runner environment here, but I will simulate the logic in my rules).
