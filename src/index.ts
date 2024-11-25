import express from "express";
import cron from "node-cron";
import nconf from "nconf";
import { calculateMetrics } from "./controller/onChainData";
import routes from "./routes";
import { getPriceCoinGecko } from "./utils/market";

const app = express();
app.use(routes);

cron.schedule(
  "*/30 * * * *",
  async () => {
    console.log("update metrics every 30 mins");
    await calculateMetrics();
    await getPriceCoinGecko();
  },
  { timezone: "Asia/Kolkata" }
);

(async () => {
  await calculateMetrics();
  await getPriceCoinGecko();
})();

app.set("port", nconf.get("PORT") || 4000);
const port = app.get("port");
app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
