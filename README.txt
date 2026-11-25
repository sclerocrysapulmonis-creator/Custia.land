Run python -m http.server 8000 in this folder and open http://localhost:8000. All pages share browser localStorage and sessionStorage on the same origin. Demo roles are selectable, not secure. No real OAuth. Production requires server-side authorization, immutable character IDs, transactional rewards and shared database. Leaderboard counts approved mission rewards only, not total brooch balance. Rewards manually assigned. Existing v03 records reused on same origin. Use fictional data only.
V0.4.1: Featured rank 01 is fixed to Sanguis Anatos, THE SEVEN, No. 111, 128 Custia. Other demo records rank below it.

V0.5: open portal.html via Account. Demo codes GUARD-111, TEACH-111, SEVEN-111, CLAIR-111. Roles persist locally per demo account. Missions use verified demo role instead of a role dropdown. Internal notices are placeholders. All authorization is client-side and bypassable; do not deploy as a secure system. Use a local server (python -m http.server 8000) and open http://localhost:8000/index.html. Existing local data keys retained.

V0.6: Directory tabs, zone filters, optional character fields, alias, image replacement. Local demo only. Blank records cannot accept missions until assigned a number.

V0.6.2: Animated red ambient lighting for verified Personnel Portal and Personnel Directory tab. Reduced-motion preference supported. Theme is visual only, not authorization.

V0.6.2: Capsule portrait frames in both directories and record detail. Full-body subject unchanged.

V0.6.3: EN/TH interface preview. Edit language.js dictionary. User content remains untranslated. Some dynamic notices remain English.

V0.7: Click logo to return home; pyramid class details; Manager demo code MANAGER-111; Clairvoyant gold themes; character archive with directed relationships, history, images and audio. Archive data is localStorage only; 2 MB per file, browser quota applies.

V0.7.1: White-gold Clairvoyant, Manager / The Seven, local owner-only bank, provisional 1 Custia cost and 1% restoration. Power definitions pending.

V0.7.2: motion.css and motion.js add page, directory, profile, dialog, navigation and banking micro-interactions. Reduced-motion preference supported. Existing local data keys unchanged.
0.7.3: prisoner starter balance 2; consume 1; outcomes 58% none, 41% new, 1% original. Existing prisoners also receive starter credit once via balance formula. Height grid is decorative, not calibrated to artwork.

V0.7.4: Four skill slots, gated abilities, six hierarchy ranks, interactive awakening reveal. Power names pending lore. Local prototype only.

V0.7.5: RP Style multi-select, optional player Facebook/Discord (visible on local character record), white red-dot wave and sparkling Custia before reveal, black reveal. Existing PLAYSTYLE values retained until selections changed.

V0.7.6: Discord-only signup UI and username/password local demo. Discord connection is simulated; no OAuth request is made. Password verifiers use salted PBKDF2 in browser storage, not plaintext. Use fictional passwords only. Production requires server-side OAuth, verified Discord ID, secure account/session management and authorization. Existing demo accounts are not automatically migrated; using the same prior Discord demo alias preserves its local owner key. Run on HTTPS or localhost.
V0.7.7: report placeholder, character rules, navigation, full profile, star loading, finer particles. Original ability recorded; redistribution pending rules and backend.

V0.7.8: profile and navigation stability patch; local demo only.

V0.9.3.5: fix0935.css/js -- pen pinned top-right of History panel, tidier Database layout, full-body image height = character height on the cm ruler, guest/relationship error hints + Refresh button. Run guest0934.sql and relationships0933.sql in Supabase for guest view and relationships.
V0.9.3.2: History / Item / Gallery tabs are now a permanent sticky bar (interactive093.js) under the site header; old extras panel retired (v0932.css). Paper is portrait 5:7 and sized to the visible screen height; white pen stays on the same screen as the paper. History save re-checks character ownership. No SQL changes. Live Supabase tests not performed.
