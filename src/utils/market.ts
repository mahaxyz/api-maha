import CoinGecko from "coingecko-api";
import cache from "./cache";

const CoinGeckoClient = new CoinGecko();

export interface IPriceList {
  eth: number;
  maha: number;
  nile: number;
}

export const getPriceCoinGecko = async () => {
  try {
    const data = await CoinGeckoClient.simple.price({
      ids: ["ethereum", "nile", "mahadao"],
      vs_currencies: ["usd"],
    });

    const priceList = {
      eth: data.data.ethereum.usd,
      nile: data.data.nile.usd,
      maha: data.data.mahadao.usd,
    };
    cache.set("coingecko:PriceList", priceList, 60 * 60);
    return priceList;
  } catch (error) {
    console.error("Error fetching Ethereum price:", error);
    throw error;
  }
};
