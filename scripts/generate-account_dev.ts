import * as path from 'path';

import { connect, KeyPair, keyStores, utils } from 'near-api-js';
import * as os from 'os';

const CREDENTIALS_DIR = '.near-credentials';
const credentialsPath = path.join(os.homedir(), CREDENTIALS_DIR);

async function createSubAccount(
  masterAccountId: string,
  subAccountId: string,
  initialBalance: string,
) {
  // Configure the connection to the NEAR blockchain
  const config = {
    networkId: 'testnet',
    nodeUrl: 'https://rpc.testnet.near.org',
    walletUrl: 'https://wallet.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    keyStore: new keyStores.UnencryptedFileSystemKeyStore(credentialsPath),
  };

  // Create a connection to the NEAR blockchain
  const near = await connect(config);

  // Load the master account
  const masterAccount = await near.account(masterAccountId);

  // Generate a new key pair for the subaccount
  const keyPair = KeyPair.fromRandom('ed25519');

  // Create the subaccount
  const createAccountTx = await masterAccount.createAccount(
    subAccountId,
    keyPair.getPublicKey().toString(),
    utils.format.parseNearAmount(initialBalance),
  );

  // Add the new key pair to the key store
  await config.keyStore.setKey(config.networkId, subAccountId, keyPair);
  console.log(`Subaccount ${subAccountId} for ${masterAccountId} was created`);
  return createAccountTx;
}

const main = async () => {
  for (let i = 1; i <= 1000; i++) {
    try {
      await createSubAccount(
        'glass-token.testnet',
        `${i}.glass-token.testnet`,
        '0.001',
      );
    } catch (err) {
      console.log(err);
    }
  }
};

main();
