import { Redis as Dragonfly } from "ioredis";

export const df = new Dragonfly({});

// df.on("error", (err) => {
//   console.error("Dragonfly error", err);
// });

// df.on("ready", () => {
//   console.log("Dragonfly is ready");
// });
