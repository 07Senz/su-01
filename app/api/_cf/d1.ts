import { getCloudflareContext } from "@opennextjs/cloudflare";

type D1Like = {
  prepare: (sql: string) => {
    bind: (...args: any[]) => {
      run: () => Promise<any>;
      all: () => Promise<any>;
    };
    all: () => Promise<any>;
  };
};

export function getD1FromEnv(): D1Like {
  const { env } = getCloudflareContext();

  const d1 = (env as any)?.DB;

  if (!d1) {
    throw new Error("Missing Cloudflare D1 binding env.DB");
  }

  return d1 as D1Like;
}