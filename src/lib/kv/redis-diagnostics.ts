export type KvEnvDiagnostics = {
  upstashUrl: boolean;
  upstashToken: boolean;
  fifapioUrl: boolean;
  fifapioToken: boolean;
  kvUrl: boolean;
  kvToken: boolean;
};

export function getKvEnvDiagnostics(): KvEnvDiagnostics {
  return {
    upstashUrl: Boolean(process.env.UPSTASH_REDIS_REST_URL?.trim()),
    upstashToken: Boolean(process.env.UPSTASH_REDIS_REST_TOKEN?.trim()),
    fifapioUrl: Boolean(process.env.FIFAPIO_KV_REST_API_URL?.trim()),
    fifapioToken: Boolean(process.env.FIFAPIO_KV_REST_API_TOKEN?.trim()),
    kvUrl: Boolean(process.env.KV_REST_API_URL?.trim()),
    kvToken: Boolean(process.env.KV_REST_API_TOKEN?.trim())
  };
}

export function hasKvCredentialsConfigured(): boolean {
  const env = getKvEnvDiagnostics();
  return (
    (env.upstashUrl && env.upstashToken) ||
    (env.fifapioUrl && env.fifapioToken) ||
    (env.kvUrl && env.kvToken)
  );
}
