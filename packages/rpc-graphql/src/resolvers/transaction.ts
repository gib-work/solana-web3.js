import { SolanaRpcMethods } from '@solana/rpc-core';

import { GraphQLCache } from '../cache';
import type { Rpc } from '../context';
import { TransactionQueryArgs } from '../schema/transaction';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function processQueryResponse({ encoding, transaction }: { encoding: string; transaction: any }) {
    const [transactionData, responseEncoding, responseFormat] = Array.isArray(transaction.transaction)
        ? encoding === 'jsonParsed'
            ? [transaction.transaction[0], 'base64', 'unparsed']
            : [transaction.transaction[0], encoding, 'unparsed']
        : encoding === 'jsonParsed'
        ? [transaction.transaction, encoding, 'parsed']
        : [transaction.transaction, encoding, 'unparsed'];
    if (transaction.meta) {
        // Ugly, but tells TypeScript what's happening
        (transaction.meta as { format?: string } & { [key: string]: unknown })['format'] = responseFormat;
    }
    if (transactionData.message) {
        // Ugly, but tells TypeScript what's happening
        (transactionData.message as { format?: string } & { [key: string]: unknown })['format'] = responseFormat;
    }
    return {
        ...transaction,
        encoding: responseEncoding,
        transaction: transactionData,
    };
}

export async function resolveTransaction(
    { signature, encoding = 'jsonParsed', ...config }: TransactionQueryArgs,
    cache: GraphQLCache,
    rpc: Rpc
) {
    const requestConfig = { encoding, ...config };

    const cached = cache.get(signature, requestConfig);
    if (cached !== null) {
        return cached;
    }

    const transaction = await rpc
        .getTransaction(signature, requestConfig as unknown as Parameters<SolanaRpcMethods['getTransaction']>[1])
        .send();

    if (transaction === null) {
        return null;
    }

    const queryResponse = processQueryResponse({ encoding, transaction });

    cache.insert(signature, requestConfig, queryResponse);

    return queryResponse;
}
