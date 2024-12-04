"use client";

import {
  useAccount,
  useConnectUI,
  useDisconnect,
  useIsConnected,
  useProvider,
} from "@fuels/react";
import { useEffect, useState } from "react";
import { getNFTs, NFT } from "./utils";
import { IpfsImage } from "react-ipfs-image";

export default function Home() {
  const { connect } = useConnectUI();
  const { disconnect } = useDisconnect();
  const { isConnected } = useIsConnected();
  const { account } = useAccount();
  const { provider } = useProvider();

  const [nfts, setNFTs] = useState<NFT[]>();

  useEffect(() => {
    (async () => {
      if (account && provider) {
        const nfts = await getNFTs({ provider, address: account });
        setNFTs(nfts);
      }
    })();
  }, [account, provider]);

  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {!isConnected && (
        <button
          onClick={() => connect()}
          className="px-4 py-2 rounded-md bg-foreground text-background"
        >
          Connect Wallet
        </button>
      )}

      {isConnected && (
        <div className="flex gap-4 items-center flex-col justify-center">
          <span>Connected as {account}</span>

          <button
            onClick={() => disconnect()}
            className="px-4 py-2 rounded-md bg-foreground text-background"
          >
            Disconnect
          </button>

          <pre>
            <code>{JSON.stringify(nfts, null, 2)}</code>
          </pre>

          <div className="grid grid-cols-3 gap-4">
            {nfts?.map((nft) => {
              return (
                <div key={nft.assetId}>
                  <IpfsImage hash={nft.image} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
