import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLResolveInfo } from 'graphql';

import { RpcGraphQLContext } from '../context';
import { AccountQueryArgs, accountResolvers, accountTypeDefs } from './account';
// import { BlockQueryArgs } from './block';
import { inputResolvers, inputTypeDefs } from './common/inputs';
import { scalarResolvers, scalarTypeDefs } from './common/scalars';
import { ProgramAccountsQueryArgs } from './program-accounts';
// import { TransactionQueryArgs } from './transaction';

const schemaTypeDefs = /* GraphQL */ `
    type Query {
        account(
            address: String!
            commitment: Commitment
            dataSlice: DataSlice
            encoding: AccountEncoding
            minContextSlot: BigInt
        ): Account
        # block(
        #     slot: BigInt!
        #     commitment: Commitment
        #     encoding: TransactionEncoding
        #     maxSupportedTransactionVersion: TransactionVersion
        #     rewards: Boolean
        #     transactionDetails: BlockTransactionDetails
        # ): Block
        programAccounts(
            programAddress: String!
            commitment: Commitment
            dataSlice: DataSlice
            encoding: AccountEncoding
            filters: [ProgramAccountsFilter]
            minContextSlot: BigInt
            withContext: Boolean
        ): [Account]
        # transaction(
        #     signature: String!
        #     commitment: Commitment
        #     encoding: TransactionEncoding
        #     maxSupportedTransactionVersion: TransactionVersion
        # ): Transaction
    }

    schema {
        query: Query
    }
`;

const schemaResolvers = {
    Query: {
        account(_: unknown, args: AccountQueryArgs, context: RpcGraphQLContext, info: GraphQLResolveInfo | undefined) {
            return context.resolveAccount(args, info);
        },
        // block(_: unknown, args: BlockQueryArgs, context: RpcGraphQLContext) {
        //     return context.resolveBlock(args);
        // },
        programAccounts(_: unknown, args: ProgramAccountsQueryArgs, context: RpcGraphQLContext) {
            return context.resolveProgramAccounts(args);
        },
        // transaction(_: unknown, args: TransactionQueryArgs, context: RpcGraphQLContext) {
        //     return context.resolveTransaction(args);
        // },
    },
};

export function createSolanaGraphQLSchema() {
    return makeExecutableSchema({
        resolvers: {
            ...accountResolvers,
            ...inputResolvers,
            ...scalarResolvers,
            ...schemaResolvers,
        },
        typeDefs: [accountTypeDefs, inputTypeDefs, scalarTypeDefs, schemaTypeDefs],
    });
}
