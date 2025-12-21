export const onRequestGet = async ({ env }) => {
  const isPresent = (v) => typeof v === 'string' && v.trim().length > 0;
  return new Response(JSON.stringify({
    adminReady: isPresent(env.ADMIN_TOKEN),
    kmsReady: isPresent(env.MASTER_KEY_B64),
    kvReady: !!env.CONFIG_KV,
    providers: {
      serper: isPresent(env.SERPER_API_KEY),
      gemini: isPresent(env.GEMINI_API_KEY),
      openai: isPresent(env.OPENAI_API_KEY),
    },
    timestamp: new Date().toISOString(),
  }), { headers: { 'Content-Type': 'application/json' } });
};
