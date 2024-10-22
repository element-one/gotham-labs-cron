import * as path from 'path';

import { Account, connect, Contract, keyStores, utils } from 'near-api-js';
import * as os from 'os';

import * as GLASS_JSON from './glass-mainnet.json';

const CREDENTIALS_DIR = '.near-credentials';
const credentialsPath = path.join(os.homedir(), CREDENTIALS_DIR);

async function createSeries(tokenId: number, title: string, media: string) {
  const config = {
    networkId: 'mainnet',
    nodeUrl: 'https://rpc.mainnet.near.org',
    walletUrl: 'https://wallet.mainnet.near.org',
    helperUrl: 'https://helper.mainnet.near.org',
    keyStore: new keyStores.UnencryptedFileSystemKeyStore(credentialsPath),
  };

  const near = await connect(config);

  const accountId = 'brand-token.glass-token.near';
  const contractName = 'brand-token.glass-token.near';
  const account = new Account(near.connection, accountId);
  const contract = new Contract(account, contractName, {
    viewMethods: [],
    changeMethods: ['create_series'],
    useLocalViewExecution: false, // Add this line
  });

  const id = tokenId;
  const metadata = {
    title: title,
    media: media,
  };

  // eslint-disable-next-line
  const result = await (contract as any).create_series(
    { id, metadata },
    300000000000000,
    utils.format.parseNearAmount('1'),
  );
  console.log(result);
}

const main = async () => {
  console.log(GLASS_JSON);

  for (const item of GLASS_JSON) {
    const { tokenId, name, imageUrl } = item;
    await createSeries(tokenId, name, imageUrl);
  }
};

main();
