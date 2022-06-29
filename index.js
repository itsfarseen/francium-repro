// francium-sdk is a commonjs library
// We are using ESM for top-level await support
import francium from 'francium-sdk';
const FranciumSDK = francium.default;

import { Keypair, Connection, sendAndConfirmTransaction } from '@solana/web3.js';
import BN from "bn.js";

import {userSecret} from './keys.js'

const userKeypair = Keypair.fromSecretKey(new Uint8Array(userSecret));

/* Error:

start signed Transaction {
  signatures: [
    { signature: null, publicKey: [PublicKey] },
    {
      signature: <Buffer d6 83 1b 0b 91 68 a2 11 4b a5 44 ad 32 51 e0 f2 57 c5 ca e8 a5 93 5c b5 58 b6 a0 62 b1 28 4a 0d bb af 51 74 97 60 50 2b 12 5a 84 50 1d e3 f2 5b 02 cd ... 14 more bytes>,
      publicKey: [PublicKey]
    }
  ],
  feePayer: PublicKey {
    _bn: <BN: 1521577ed57a65b178fcb3cccdc48749af2b9282d397253960695868972c14ef>
  },
  instructions: [
    TransactionInstruction {
      keys: [Array],
      programId: [PublicKey],
      data: <Buffer 0c>
    },
    TransactionInstruction {
      keys: [Array],
      programId: [PublicKey],
      data: <Buffer 00 00 00 00 f0 1d 1f 00 00 00 00 00 a5 00 00 00 00 00 00 00 06 dd f6 e1 d7 65 a1 93 d9 cb e1 46 ce eb 79 ac 1c b4 85 ed 5f 5b 37 91 3a 8c f5 85 7e ff ... 2 more bytes>
    },
    TransactionInstruction {
      keys: [Array],
      programId: [PublicKey],
      data: <Buffer 01>
    },
    TransactionInstruction {
      keys: [Array],
      programId: [PublicKey],
      data: <Buffer 04 00 00 00 00 00 00 00 00>
    },
    TransactionInstruction {
      keys: [Array],
      programId: [PublicKey],
      data: <Buffer 09>
    },
    TransactionInstruction {
      keys: [Array],
      programId: [PublicKey],
      data: <Buffer 03 00 00 00 00 00 00 00 00>
    }
  ],
  recentBlockhash: 'AjacPfeunpT2XLuQTc7xL9BWiUYbAu9Xkn43LrvUx4Lk',
  lastValidBlockHeight: undefined,
  nonceInfo: undefined,
  _message: undefined,
  _json: undefined
}
start send
/home/farseen/Projects/MLabs/Nezha/francium/francium-test/node_modules/francium-sdk/dist/utils/sign.js:78
        const txid = yield connection.sendRawTransaction(signed.serialize(), {
                                                                ^

TypeError: Cannot read properties of undefined (reading 'serialize')
    at /home/farseen/Projects/MLabs/Nezha/francium/francium-test/node_modules/francium-sdk/dist/utils/sign.js:78:65
    at Generator.next (<anonymous>)
    at fulfilled (/home/farseen/Projects/MLabs/Nezha/francium/francium-test/node_modules/francium-sdk/dist/utils/sign.js:5:58)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)

*/

export async function main() {
	let connection = new Connection("https://francium.genesysgo.net", "confirmed");
	let f = new FranciumSDK({ connection });

	let { trx, signers } = await f.getLendingDepositTransaction("SOL", new BN(0.00001), userKeypair.publicKey, {});

	// A fake wallet that signs the tx using a constant key
	let wallet = {
		publicKey: userKeypair.publicKey,
		signTransaction: function(trx) {
			trx.sign(userKeypair);
			return trx;
		},
	};

	let res = await f.sendSingleTransaction(trx, wallet, signers);
	console.log(res);
}

await main();
