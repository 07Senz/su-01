- [ ] Inspect authentication context + gated routes
- [ ] Implement Logout button in `app/page.tsx` navigation/header
- [ ] Logout handler: clear existing AuthContext session + redirect to `/`
- [ ] Ensure protected `/home` is not accessible after logout (via existing guard)
- [ ] Verify by manual test: Login -> /home -> Logout -> redirected to / and /home blocked

