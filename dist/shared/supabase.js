export function supabase() {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.__APP_CONFIG__;

  async function get(tableAndQuery) {
    const url = `${SUPABASE_URL}/rest/v1/${tableAndQuery}`;
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Request failed: ${res.status}`);
    }
    return res.json();
  }

  return { get };
}
