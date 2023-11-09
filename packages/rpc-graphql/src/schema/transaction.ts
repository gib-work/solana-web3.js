import { Signature } from '@solana/keys';
import { Commitment } from '@solana/rpc-types';
import { TransactionVersion } from '@solana/transactions';

export type TransactionQueryArgs = {
    signature: Signature;
    commitment?: Commitment;
    encoding?: 'base58' | 'base64' | 'json' | 'jsonParsed';
    maxSupportedTransactionVersion?: Exclude<TransactionVersion, 'legacy'>;
};

// TODO: Types
// TODO: Resolvers
