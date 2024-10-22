import * as path from 'path';

import { Account, connect, Contract, keyStores, utils } from 'near-api-js';
import * as os from 'os';

const CREDENTIALS_DIR = '.near-credentials';
const credentialsPath = path.join(os.homedir(), CREDENTIALS_DIR);

async function mintNft() {
  const config = {
    networkId: 'testnet',
    nodeUrl: 'https://rpc.testnet.near.org',
    walletUrl: 'https://wallet.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    keyStore: new keyStores.UnencryptedFileSystemKeyStore(credentialsPath),
  };

  const near = await connect(config);

  const accountId = 'nft.glass-near.testnet';
  const contractName = 'nft.glass-near.testnet';
  const account = new Account(near.connection, accountId);
  const contract = new Contract(account, contractName, {
    viewMethods: [],
    changeMethods: ['nft_mint'],
    useLocalViewExecution: false, // Add this line
  });

  const id = '1';

  // eslint-disable-next-line
  const result = await (contract as any).nft_mint(
    { id, receiver_id: 'glass-near.testnet' },
    300000000000000,
    utils.format.parseNearAmount('1'),
  );
  console.log(result);
}

mintNft();
