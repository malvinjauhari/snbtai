# SNBT AI Security Specification

## Data Invariants
1. User can only read and write their own profile, history, vocab, wishlist, and progress.
2. Global questions bank is read-only for all signed-in users.
3. User profile creation must enforce that `uid` matches authenticated user.
4. History/Progress updates must be linked to the authenticated user.
5. Vocab and Wishlist must be owned by the user creating them.

## The Dirty Dozen Payloads (Red Team Tests)
1. **User Spoofing**: Attempting to create a profile with another user's UID.
2. **Global Write**: Attempting to write a question to the global bank.
3. **Ghost Field**: Adding `isAdmin: true` to a user profile update.
4. **ID Poisoning**: Using a 1MB string as a document ID.
5. **PII Leak**: Authenticated user B attempting to read user A's private profile.
6. **Orphaned Record**: Creating a wishlist item for a non-existent question.
7. **Score Injection**: Manually updating a history record to set score to 1000 without answering.
8. **Immutability Breach**: Changing `createdAt` on a user profile.
9. **Terminal State Bypass**: Updating a "finished" tryout session.
10. **Resource Exhaustion**: Sending a payload with a 2MB nested object.
11. **Cross-User Progress Access**: Reading progress of another student.
12. **Self-Promotion**: Updating user profile to set a custom claim role.

## Test Runner (Draft)
A `firestore.rules.test.ts` will be implemented once the rules are drafted.
