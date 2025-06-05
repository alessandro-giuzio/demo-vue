
# ✅ Pre-Meeting Code Review Tasks

Your senior developer has asked you to review and clean up your code. Below is a structured checklist based on their guidance:

---

## 🔍 1. Error Handling
- [ ] Ensure all API and async calls are wrapped with `try...catch` or `.catch()`.
- [ ] Display user-friendly error messages in the UI.
- [ ] Log or track errors appropriately for debugging.

## ⏳ 2. Loading and Empty States
- [ ] Add loaders/spinners for asynchronous actions.
- [ ] Handle "no data" states with meaningful messages.

## 🔄 3. Data Consistency
- [ ] Refresh data in the UI after create/update/delete actions.
- [ ] Confirm local state stays in sync with backend changes.

## ⚙️ 4. Async Operations
- [ ] Use `await` properly — no unhandled promises.
- [ ] Prevent overlapping requests or race conditions.
- [ ] Debounce rapid inputs like search fields.

## 🔐 5. Permissions and Access Control
- [ ] Ensure users can only see or edit what they are allowed to.
- [ ] Hide or disable UI actions for unauthorized users.

## ✅ 6. Input Validation
- [ ] Validate all form inputs on the client side (e.g., `required`, `pattern`).
- [ ] Add backend validation and constraints (e.g., Supabase RLS, database rules).

## 🧾 7. Type Safety
- [ ] Add/confirm TypeScript types for props, state, and API responses.
- [ ] Use schema validation tools like `zod` if needed.

---

## 📆 Suggested Workflow

| Day     | Focus Areas                                                  |
|---------|--------------------------------------------------------------|
| Day 1   | Error Handling + Start on Loading/Empty States               |
| Day 2   | Finish Loading/Empty States + Data Consistency               |
| Day 3   | Async Operations + Type Safety                               |
| Day 4   | Input Validation + Permissions & Access Control              |
| Day 5   | Testing + Summary Prep for Meeting                           |

---

Good luck! You're almost ready for that next meeting! 🔧🚀
