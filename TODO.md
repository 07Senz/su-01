# TODO

## Phase 1 — Home/login separation

- [ ] Remove login overlay UI from Home (no auto login UI)
- [ ] Remove Home “Login” button behavior that opens auth UI
- [ ] Ensure Home tab renders only Home content

## Phase 2 — Fix Member login

- [ ] Remove Core option from Member login (keep only G.M and E.M)
- [ ] Replace fixed suffix logic with user-entered number after `#`
- [ ] Remove any UI that reveals full form id
- [ ] Member login accepts: (form id as {type}#<number>, password)

## Phase 3 — Fix Admin login

- [ ] Add Core option button in Admin login
- [ ] Admin login requires: form id (Core#<number>) + password
- [ ] Remove admin gate that only asks for password

## Phase 4 — Admin panel subsections + storage

- [ ] Replace in-memory `members` record shape with richer records:
      name, formId, batch, email, pass, other basic info (no address)
- [ ] Implement Admin panel tabs: - Manage info (CRUD/list + add) - Theme toggle icons (dark/light) - Reset pass

## Phase 5 — Admin-only gallery photo upload

- [ ] Add “Add Photo from device” button in Gallery
- [ ] Only show upload button if admin authed
- [ ] Display uploaded images for session

## Phase 6 — Testing

- [ ] Run `npm run lint`
- [ ] Run `npm run dev` and manually validate flows
