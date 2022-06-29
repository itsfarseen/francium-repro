// francium-sdk is a commonjs library
// We are using ESM for top-level await support
import francium from 'francium-sdk';
const FranciumSDK = francium.default;

import { Keypair, Connection, sendAndConfirmTransaction } from '@solana/web3.js';
import BN from "bn.js";

import {userSecret} from './keys.js'

const userKeypair = Keypair.fromSecretKey(new Uint8Array(userSecret));

export async function main() {
	let connection = new Connection("https://francium.genesysgo.net", "confirmed");
	let f = new FranciumSDK({ connection });

	let { trx, signers } = await f.getLendingDepositTransaction("SOL", new BN(0.00001), userKeypair.publicKey, {});

	let res = await sendAndConfirmTransaction(connection, trx, [...signers, userKeypair], { commitment: 'confirmed' });
	console.log(res);
}

await main();
