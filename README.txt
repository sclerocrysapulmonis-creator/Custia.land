Custia Item patch — from Custia_Preview_No_Guide(1).zip
1. Back up existing interactive093.js. Replace only this file at repository root.
2. In database.html change interactive093.js?v=0960step06 to interactive093.js?v=itemfix01 to avoid stale cache.
3. Other files are reference copies of existing item CSS, uniform code and original art/audio. Do not overwrite newer versions unnecessarily.
4. Test Item on prisoner, teacher and guard profiles. Staff now opens the existing prisoner-style Item interface; separate staff shelf/locker art and code were not found in this source. Quarters remains disabled for staff.
5. Existing Item code shares Gallery/Quarters and data persistence; those functions are retained unchanged. No database changes. Test owner/non-owner permissions and persistence before production.
6. Syntax checked only, not tested against live site.
