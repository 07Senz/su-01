// Cloudflare Pages Functions adapter should expose D1 databases in `env`.
// In your case the binding name is: env["su-01"].
// Note: Next.js route handlers normally don't receive `env` directly;
// this helper expects you to pass it from your CF adapter.

type D1Like = {
  prepare: (sql: string) => {
    bind: (...args: any[]) => {
      run: () => Promise<any>;
      all: () => Promise<any>;
    };
  };
};

export function getD1FromEnv(env: any): D1Like {
  const d1 = env?.["su-01"];
  if (!d1) {
    throw new Error('Missing Cloudflare D1 binding env["su-01"]');
  }
  return d1 as D1Like;
}

