// francium-sdk is a commonjs library
// We are using ESM for top-level await support
import francium from 'francium-sdk';
const FranciumSDK = francium.default;

import { Keypair, Connection, sendAndConfirmTransaction } from '@solana/web3.js';
import BN from "bn.js";

import {userSecret} from './keys.js'

const userKeypair = Keypair.fromSecretKey(new Uint8Array(userSecret));

/* Error:

	/home/farseen/Projects/MLabs/Nezha/francium/francium-test/node_modules/@solana/web3.js/lib/index.cjs.js:2661
      return x.pubkey.toBase58().localeCompare(y.pubkey.toBase58());
                      ^
TypeError: x.pubkey.toBase58 is not a function
    at /home/farseen/Projects/MLabs/Nezha/francium/francium-test/node_modules/@solana/web3.js/lib/index.cjs.js:2661:23
    at Array.sort (<anonymous>)
    at Transaction.compileMessage (/home/farseen/Projects/MLabs/Nezha/francium/francium-test/node_modules/@solana/web3.js/lib/index.cjs.js:2649:17)
    at Transaction._compile (/home/farseen/Projects/MLabs/Nezha/francium/francium-test/node_modules/@solana/web3.js/lib/index.cjs.js:2756:26)
    at Transaction.partialSign (/home/farseen/Projects/MLabs/Nezha/francium/francium-test/node_modules/@solana/web3.js/lib/index.cjs.js:2894:26)
    at /home/farseen/Projects/MLabs/Nezha/francium/francium-test/node_modules/francium-sdk/dist/utils/sign.js:73:17
    at Generator.next (<anonymous>)
    at fulfilled (/home/farseen/Projects/MLabs/Nezha/francium/francium-test/node_modules/francium-sdk/dist/utils/sign.js:5:58)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)

*/

// Try to send the transaction ourselves instead of using FranciumSDK.sendSingleTransaction()
// 	This also returns the above error.
export async function main_alt() {
	let connection = new Connection("https://francium.genesysgo.net", "confirmed");
	let f = new FranciumSDK({ connection });

	let { trx, signers } = await f.getLendingDepositTransaction("SOL", new BN(0.00001), userKeypair.publicKey, {});

	let res = await sendAndConfirmTransaction(connection, trx, [...signers, userKeypair], { commitment: 'confirmed' });
	console.log(res);
}

export async function main() {
	let connection = new Connection("https://francium.genesysgo.net", "confirmed");
	let f = new FranciumSDK({ connection });

	let { trx, signers } = await f.getLendingDepositTransaction("SOL", new BN(0.00001), userKeypair.publicKey, {});

	// A fake wallet that signs the tx using a constant key
	let wallet = {
		publicKey: userKeypair.publicKey,
		signTransaction: function(trx) {
			trx.sign(userKeypair);
		},
	};

	let res = await f.sendSingleTransaction(trx, wallet, signers);
	console.log(res);
}

await main();
