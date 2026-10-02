# Vējiņu kauss 2026 — V8

## Faili
- `index.html` — instruktora režīms. Kalibrācijas iestatījumi nav pieejami.
- `admin.html` — tavs kalibrācijas/administratora režīms.
- `lof-map.jpg` — LOF karte.
- `supabase-config.js` — Supabase Project URL + publishable key.
- `supabase.sql` — datubāzes tabula, RLS politikas un Realtime ieslēgšana.

## Darba plūsma
1. Repo augšupielādē visus V8 failus.
2. Kalibrē tikai `https://.../VK/admin.html`.
3. `admin.html` spied **Kopēt instruktora saiti**. Tā tagad ved uz `index.html#cfg=...`.
4. Instruktoriem dod tikai šo instruktora saiti/QR.
5. `index.html` nav iestatījumu pogas, tādēļ nokalibrēto karti no UI izmainīt nevar.

## Jaunumi V8
- Noņemta liekā augšējā slāņu poga; paliek Leaflet oriģinālā slāņu izvēle.
- Apakšējo vadības paneli var paslēpt/rādīt ar `▾ / ▴`.
- Uzspiežot uz **VIRZIENS · KOMPASS**, atveras telefona kompass ar bultu uz izvēlēto KP.
- KP statuss var sinhronizēties caur Supabase Realtime.
- Zaļš KP = izvietots. Augšā poga `● 12/30` atver visu KP tiešsaistes statusu.
- Pirmo reizi atzīmējot KP, rīks prasa instruktora vārdu/iniciāļus.

## Supabase
1. Izveido projektu Supabase.
2. Atver **SQL Editor**, ielīmē visu `supabase.sql` un palaid.
3. Project **Connect / API keys** atrodi:
   - Project URL
   - Publishable key (`sb_publishable_...`)
4. Ieliec tos `supabase-config.js`.
5. Commit/push GitHub Pages.
6. Atver divos telefonos: izmaiņai vienā telefonā dažu mirkļu laikā jāparādās otrā.

### Drošība
`sb_publishable_...` ir publiskā pārlūka atslēga. Drošību nosaka RLS politikas `supabase.sql`.
Nekad neievieto GitHub Pages failos `sb_secret_...` vai `service_role` atslēgu.

Šajā versijā instruktoriem ir tiesības mainīt tikai Vējiņu kausa 30 KP izvietošanas statusu.
Viņiem nav UI piekļuves kalibrācijas iestatījumiem.
