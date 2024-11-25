import { ethers } from "ethers";
import { Request, Response } from "express";
import nconf from "nconf";
import ERCTokenABI from "./abi/ERC20Token.json";
import { ethProvider } from "../utils/providers";
import cache from "../utils/cache";

export const calculateCirculatingSupply = async () => {
  //ZAI
  const contractZAI = new ethers.Contract(
    nconf.get("ZAI"),
    ERCTokenABI,
    ethProvider
  );
  const totalSupplyZAI = Number(await contractZAI.totalSupply()) / 1e18;
  cache.set("ts:zai", totalSupplyZAI.toLocaleString(), 60 * 30);
};

export const getTotalSupplyZAI = async (req: Request, res: Response) => {
  const cachedData = cache.get("ts:zai");
  res.json(cachedData);
};
