## TODO

### Phase 1 — Routing split (Login-first)
- [ ] Create `app/home/page.tsx` containing the existing Home tab UI (no auth overlay logic)
- [ ] Replace `app/page.tsx` with a root Login-first screen
- [ ] Lift auth state minimally so that `/home` can be protected (no backend/auth rewrite)

### Phase 2 — Protect `/home`
- [ ] In `app/home/page.tsx`, redirect/guard unauthenticated users
- [ ] Keep authenticated users on `/home`

### Phase 3 — Verification
- [ ] Run `npm run lint`
- [ ] Run `npm run dev` and manually verify flows

