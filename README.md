# Vējiņu kauss 2026 — instruktoru rīks V17

## Galvenā darba plūsma
Instruktora darba ceļš ir vienkāršs:

1. Izvēlas piešķirto KP.
2. Ieslēdz GPS.
3. Dodas uz KP.
4. Pēdējos metros pārbauda LOF kartes fragmentu un KP aprakstu.
5. Izvieto kontrolpunktu dabā.
6. Nospiež **✓ Izvietots**.

Poga **Tuvākais** ir noņemta, jo instruktori strādā ar iepriekš piešķirtiem KP un tā radīja nevajadzīgu alternatīvu darba plūsmu.

## “Izvietots” un īslaicīgs interneta pārrāvums
V17 “Izvietots” darbība ir **offline-first**.

Kad instruktors nospiež `✓ Izvietots`:
- statuss uzreiz tiek saglabāts konkrētajā telefonā;
- KP uzreiz kļūst par izvietotu arī tad, ja internets tajā brīdī nedarbojas;
- ja Supabase ir sasniedzams, ieraksts tiek nosūtīts uzreiz;
- ja Supabase nav sasniedzams, rīks rāda:
  `✓ Izvietots · gaida sinhronizāciju`.

Nesinhronizētās darbības tiek glabātas `localStorage` rindā.

Rīks mēģina tās nosūtīt:
- uzreiz pēc darbības;
- ik pēc 5 sekundēm, kamēr instruktoru rīkam ir derīga piekļuve;
- uzreiz, kad pārlūks konstatē interneta atgriešanos;
- atverot KP statusa logu.

Pēc veiksmīgas nosūtīšanas:
`✓ KP XX sinhronizēts`

Servera vecais statuss nedrīkst pārrakstīt telefonā esošu nesinhronizētu darbību.

Arī `Atcelt` darbība izmanto to pašu offline rindu — pēdējā instruktora darbība konkrētajam KP ir tā, kas tiks sinhronizēta.

## 10 minūšu drošības logs
Offline KP statusu rinda un instruktoru piekļuves drošības mehānisms ir **divas atsevišķas funkcijas**.

- Ja serveris pēdējā pārbaudē bija atļāvis rīku, tas bez interneta var turpināt darboties līdz 10 minūtēm.
- Šajā laikā KP var atzīmēt kā izvietotus, un tie nonāk sinhronizācijas rindā.
- Ja 10 minūšu laikā servera piekļuves pārbaudi nevar atjaunot, rīks bloķējas.
- Nesinhronizētie KP ieraksti no telefona netiek pazaudēti.
- Kad piekļuve un internets atkal ir pieejami, rīks turpina sinhronizāciju.

## Kartes un lauka funkcijas
- LOF karte ir kalibrēta virs pamatkartes.
- LOF caurspīdīgumu var regulēt.
- Digitālos KP marķierus var paslēpt, lai skaidri redzētu LOF apļa centru.
- Karti var rotēt ar diviem pirkstiem.
- `N ↑ Ziemeļi` atgriež ziemeļus uz augšu.
- `📱 Sekot virzienam` orientē karti pēc telefona virziena.
- Pamatkarte un rīka resursi ir sagatavojami darbam ar mainīgu interneta pārklājumu.
- Kompass rāda relatīvo virzienu uz izvēlēto KP un brīdina par sliktu sensora precizitāti.

## Tiešsaistes statuss
Augšējā DB pogā:
- `●` — datubāze / Realtime darbojas;
- `◐` — DB darbojas, Realtime nav aktīvs;
- `○` — DB nav sasniedzama;
- `⏳N` — telefonā ir N darbības, kas vēl gaida sinhronizāciju.

KP statusa skatā pie nesinhronizēta KP būs redzams:
`Izvietots · gaida sinhronizāciju`.

## GitHub atjaunināšana
No V16 uz V17 obligāti jānomaina tikai:

- `index.html`

`sw.js` V17 nav mainīts un var palikt V16 versija.
