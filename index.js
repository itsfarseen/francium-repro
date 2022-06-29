// francium-sdk is a commonjs library
// We are using ESM for top-level await support
import francium from 'francium-sdk';
const FranciumSDK = francium.default;

import { Keypair, Connection, sendAndConfirmTransaction } from '@solana/web3.js';
import BN from "bn.js";

import { userSecret } from './keys.js'

const userKeypair = Keypair.fromSecretKey(new Uint8Array(userSecret));

/* Error:
Wallet Pubkey: 2RV3rpMFWyQyxtKuKJr4yVjvjLWGw5acE3YBsG1TsJs8
/home/farseen/Projects/MLabs/Nezha/francium/francium-test/node_modules/@solana/web3.js/lib/index.cjs.js:7471
			throw new SendTransactionError('failed to send transaction: ' + res.error.message, logs);
						^

SendTransactionError: failed to send transaction: Transaction simulation failed: Attempt to debit an account but found no record of a prior credit.
		at Connection.sendEncodedTransaction (/home/farseen/Projects/MLabs/Nezha/francium/francium-test/node_modules/@solana/web3.js/lib/index.cjs.js:7471:13)
		at processTicksAndRejections (node:internal/process/task_queues:96:5)
		at async Connection.sendRawTransaction (/home/farseen/Projects/MLabs/Nezha/francium/francium-test/node_modules/@solana/web3.js/lib/index.cjs.js:7432:20)
		at async Connection.sendTransaction (/home/farseen/Projects/MLabs/Nezha/francium/francium-test/node_modules/@solana/web3.js/lib/index.cjs.js:7422:12)
		at async sendAndConfirmTransaction (/home/farseen/Projects/MLabs/Nezha/francium/francium-test/node_modules/@solana/web3.js/lib/index.cjs.js:3136:21)
		at async main (file:///home/farseen/Projects/MLabs/Nezha/francium/francium-test/index.js:85:12)
		at async file:///home/farseen/Projects/MLabs/Nezha/francium/francium-test/index.js:89:1 {
	logs: []
}
*/

export async function main() {
	console.log("Wallet Pubkey:", userKeypair.publicKey.toBase58());

	let connection = new Connection("https://francium.genesysgo.net", "confirmed");
	let f = new FranciumSDK({ connection });

	let { trx, signers } = await f.getLendingDepositTransaction("SOL", new BN(0.00001), userKeypair.publicKey, {});

	let res = await sendAndConfirmTransaction(connection, trx, [...signers, userKeypair]);
	console.log(res);
}

await main();
