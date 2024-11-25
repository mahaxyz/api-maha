import { Request, Response } from "express";
import { ethers } from "ethers";
import cache from "../utils/cache";
import abi from "./abi/ERC20Token.json";
import { ethProvider } from "../utils/providers";

const addressToCheckBal = ["0xFdf0d51ddD34102472D7130c3d4831BC77386e78"];

const tokenAddressMAHA = "0x745407c86df8db893011912d3ab28e68b62e49b0";
const tokenAddressUSDz = "0x69000405f9dce69bd4cbf4f2865b79144a69bfe0";

const denomination = 1e18;

const getMAHAINRPrice = async () => {
  const api = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=mahadao&vs_currencies=inr"
  );
  console.log(api);
  const json = await api.json();
  return Math.floor(json.mahadao.inr);
};

export const calculateMetrics = async () => {
  //maha total supply
  const mahaContract = new ethers.Contract(tokenAddressMAHA, abi, ethProvider);
  const totalSupplyMAHA =
    Number(await mahaContract.totalSupply()) / denomination;
  cache.set("ts:maha", totalSupplyMAHA.toLocaleString(), 60 * 30);

  //ZAI total Supply
  const zaiContract = new ethers.Contract(tokenAddressUSDz, abi, ethProvider);
  const totalSupplyZAI = Number(await zaiContract.totalSupply()) / denomination;
  cache.set("ts:zai", totalSupplyZAI.toLocaleString(), 60 * 30);

  //maha circulating supply
  let totalBalance = 0;
  for (let i = 0; i < addressToCheckBal.length; i++) {
    const balanceFrom = await mahaContract.balanceOf(addressToCheckBal[i]);
    totalBalance += Number(balanceFrom) / denomination;
  }

  const circulatingSupply = totalSupplyMAHA - totalBalance;
  cache.set("cs:maha", circulatingSupply.toLocaleString(), 60 * 30);
};

export const getCirculatingSupply = async (_req: Request, res: Response) => {
  res.set("Content-Type", "text/html");
  res.status(200);
  res.send(cache.get("cs:maha"));
};

export const getTotalSupplyMAHA = async (_req: Request, res: Response) => {
  res.set("Content-Type", "text/html");
  res.status(200);
  res.send(cache.get("ts:maha"));
};

export const getTotalSupplyZAI = async (_req: Request, res: Response) => {
  res.set("Content-Type", "text/html");
  res.status(200);
  res.send(cache.get("ts:zai"));
};

export const mahaInrPrice = async (_req: Request, res: Response) => {
  res.set("Content-Type", "text/html");
  res.status(200);
  res.send(cache.get("maha-inr"));
};
