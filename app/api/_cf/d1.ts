// Cloudflare Workers adapter that exposes the D1 database bound in wrangler.jsonc.
// The binding name is: env["su-01"]

type D1Like = {
  prepare: (sql: string) => {
    bind: (...args: any[]) => {
      run: () => Promise<any>;
      all: () => Promise<any>;
    };
    all: () => Promise<any>;
  };
};

export function getD1FromEnv(env: any): D1Like {
  const d1 = env?.["su-01"];
  if (!d1) {
    throw new Error('Missing Cloudflare D1 binding env["su-01"]');
  }
  return d1 as D1Like;
}