import { ConvexClient } from "convex/browser";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const client = new ConvexClient(config.public.convexUrl as string);
  
  return {
    provide: {
      convex: client
    }
  }
})
