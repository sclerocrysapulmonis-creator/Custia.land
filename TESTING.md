# Custia V0.8.4.1 — Interaction hotfix
- Open own prisoner profile: bank is beneath full body.
- Consume opens fullscreen; cancel leaves balance unchanged.
- Activate once: exactly one Custia spent; result appears after animation; continue returns to profile.
- Refresh: balance and awakening history persist. Zero balance disables consume.
- Gallery: select Gallery, left bunk, desk, right bunk; upload a photo and check persistence.
- Switch EN/TH and repeat. Check other character cannot consume or edit photos.
- Existing local data remains under the same storage keys.
Validation: JavaScript syntax and ZIP integrity checked. Chromium navigation blocked by environment; real browser interactions not verified.

V0.9.1.1: Optional registration
- Sign in with an account with zero characters; registration form remains hidden.
- Save profile without entering character details; navigate Home and shared directory.
- My Characters displays zero records and an optional Create Character button.
- Create opens form; Cancel closes it without saving; Edit opens existing record.
- Save character updates own count and closes form. Verify with real Supabase session.
