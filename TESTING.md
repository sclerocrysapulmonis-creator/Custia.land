# V0.9.1.2
Original database restored at database.html. Local records are unchanged. Online records view uses original gallery and read-only profile preview; edit online via portal.html. Full profile fields, archive, gallery, bank and staff remain local only. No migration or SQL changes. Test both views, sign in, zone filters, original profile and online character visibility. Do not treat local staff privileges as online authorization.

V0.9.1.3: Run account.sql in Supabase SQL Editor, then separately run its final commented INSERT (without --) to issue private single-use codes. Do not reuse old demo codes. Test avatar/about persistence and staff redemption, exit/re-enter. Staff badge is server-backed but existing demo staff actions are NOT authorized by this role; online staff actions and global themes remain unimplemented. Avatar uses existing private portraits bucket (authenticated members can read objects under existing policy). No database page changes.

V0.9.1.4: Run account.sql if needed, then separate private personnel codes SQL. Assign trusted account role in SQL editor. Enter matching code in Account. Verify theme on Home, Database, Missions, Leaderboard, Account and Exit. Demo pages remain unchanged.

V0.9.1.5: run separate manager delete SQL. Test online default, local explicit, create dialog, manager deletion and ordinary account denial, tablet icons, navigation. Manager permission is account-level; exiting theme does not revoke database role. Extended online fields remain unsynced.

V0.9.1.6: Run bank-online.sql before testing online owner bank. Existing online characters receive 2 on first access; local balances not migrated. Test cancel, consume, reload, insufficient funds, and other account denial.

V0.9.1.7: Full-page mini games, restored local extras for online profiles, Thai typography. Online extras remain device-local; no new SQL. Test on iPad before production.
