// Vējiņu kauss 2026 — publiskā klienta konfigurācija.
// Supabase "publishable" atslēgu drīkst lietot pārlūkā; drošību nodrošina RLS.
// NEKAD šeit neliec sb_secret_* vai service_role atslēgu.
window.VK_SUPABASE = {
  url: "https://PASTE_YOUR_PROJECT.supabase.co",
  publishableKey: "PASTE_SB_PUBLISHABLE_KEY",
  eventId: "vejinu-kauss-2026"
};
