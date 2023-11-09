import { GraphQLResolveInfo } from 'graphql';

import { createGraphQLCache, GraphQLCache } from './cache';
import { resolveAccount } from './resolvers/account';
import { resolveBlock } from './resolvers/block';
import { resolveProgramAccounts } from './resolvers/program-accounts';
import { resolveTransaction } from './resolvers/transaction';
import { createRpcGraphQL } from './rpc';
import { AccountQueryArgs } from './schema/account';
import { BlockQueryArgs } from './schema/block';
import { ProgramAccountsQueryArgs } from './schema/program-accounts';
import { TransactionQueryArgs } from './schema/transaction';

export type Rpc = Parameters<typeof createRpcGraphQL>[0];

export interface RpcGraphQLContext {
    cache: GraphQLCache;
    resolveAccount(args: AccountQueryArgs, info?: GraphQLResolveInfo): ReturnType<typeof resolveAccount>;
    resolveBlock(args: BlockQueryArgs): ReturnType<typeof resolveBlock>;
    resolveProgramAccounts(args: ProgramAccountsQueryArgs): ReturnType<typeof resolveProgramAccounts>;
    resolveTransaction(args: TransactionQueryArgs): ReturnType<typeof resolveTransaction>;
    rpc: Rpc;
}

export function createSolanaGraphQLContext(rpc: Rpc): RpcGraphQLContext {
    const cache = createGraphQLCache();
    return {
        cache,
        resolveAccount(args, info?) {
            return resolveAccount(args, this.cache, this.rpc, info);
        },
        resolveBlock(args) {
            return resolveBlock(args, this.cache, this.rpc);
        },
        resolveProgramAccounts(args) {
            return resolveProgramAccounts(args, this.cache, this.rpc);
        },
        resolveTransaction(args) {
            return resolveTransaction(args, this.cache, this.rpc);
        },
        rpc,
    };
}
