import { type CoinQuantity, type Provider } from "fuels";

const INDEXER_API_URL = "https://mainnet-explorer.fuel.network";

export type NFT = {
  name: string;
  symbol: string;
  assetId: string;
  contractId: string;
  owner: string;
  uri: string;
  image: string;
};

export const getAllAssets = async ({
  provider,
  address,
}: {
  provider: Provider;
  address: string;
}) => {
  const { balances } = await provider.getBalances(address);
  return balances;
};

const getImageFromURI = async (uri: string) => {
  console.log("URI: ", uri);
  const metadata = await fetch(uri);
  const data = await metadata.json();
  return data.image;
};

export const getNFTs = async ({
  provider,
  address,
}: {
  provider: Provider;
  address: string;
}) => {
  const balances = await getAllAssets({ provider, address });

  // Assets with balance amount '1' are NFTs
  const nftAssets: CoinQuantity[] = balances.filter(
    (asset) => asset.amount.toString() === "1"
  );

  const nftAssetIds = nftAssets.map((nft) => nft.assetId);

  const nfts: NFT[] = [];

  for await (const assetId of nftAssetIds) {
    const res = await fetch(`${INDEXER_API_URL}/assets/${assetId}`);
    const data = await res.json();

    const image = await getImageFromURI(data.uri);

    nfts.push({
      name: data.name,
      symbol: data.symbol,
      assetId: assetId,
      contractId: data.contractId,
      owner: data.owner,
      uri: data.uri,
      image,
    });
  }

  return nfts;
};
