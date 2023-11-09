/* eslint-disable sort-keys-fix/sort-keys-fix */
import { Address } from '@solana/addresses';
import { DataSlice, Slot } from '@solana/rpc-core/dist/types/rpc-methods/common';
import { GraphQLResolveInfo } from 'graphql';

import { RpcGraphQLContext } from '../context';

export type AccountQueryArgs = {
    address: Address;
    dataSlice?: DataSlice;
    encoding?: 'base58' | 'base64' | 'base64+zstd' | 'jsonParsed';
    commitment?: 'processed' | 'confirmed' | 'finalized';
    minContextSlot?: Slot;
};

export const accountTypeDefs = /* GraphQL */ `
    # Account interface
    interface Account {
        address: String
        encoding: String
        executable: Boolean
        lamports: BigInt
        owner: Account
        rentEpoch: BigInt
    }

    # An account with base58 encoded data
    type AccountBase58 implements Account {
        address: String
        data: String
        encoding: String
        executable: Boolean
        lamports: BigInt
        owner: Account
        rentEpoch: BigInt
    }

    # An account with base64 encoded data
    type AccountBase64 implements Account {
        address: String
        data: String
        encoding: String
        executable: Boolean
        lamports: BigInt
        owner: Account
        rentEpoch: BigInt
    }

    # An account with base64+zstd encoded data
    type AccountBase64Zstd implements Account {
        address: String
        data: String
        encoding: String
        executable: Boolean
        lamports: BigInt
        owner: Account
        rentEpoch: BigInt
    }

    # Interface for JSON-parsed meta
    type JsonParsedMeta {
        program: String
        space: BigInt
        type: String
    }
    interface AccountJsonParsed {
        meta: JsonParsedMeta
    }

    # A nonce account
    type NonceAccountFeeCalculator {
        lamportsPerSignature: String
    }
    type NonceAccountData {
        authority: Account
        blockhash: String
        feeCalculator: NonceAccountFeeCalculator
    }
    type NonceAccount implements Account & AccountJsonParsed {
        address: String
        data: NonceAccountData
        encoding: String
        executable: Boolean
        lamports: BigInt
        meta: JsonParsedMeta
        owner: Account
        rentEpoch: BigInt
    }

    # A lookup table account
    type LookupTableAccountData {
        addresses: [String]
        authority: Account
        deactivationSlot: String
        lastExtendedSlot: String
        lastExtendedSlotStartIndex: Int
    }
    type LookupTableAccount implements Account & AccountJsonParsed {
        address: String
        data: LookupTableAccountData
        encoding: String
        executable: Boolean
        lamports: BigInt
        meta: JsonParsedMeta
        owner: Account
        rentEpoch: BigInt
    }

    # A mint account
    type MintAccountData {
        decimals: Int
        freezeAuthority: Account
        isInitialized: Boolean
        mintAuthority: Account
        supply: String
    }
    type MintAccount implements Account & AccountJsonParsed {
        address: String
        data: MintAccountData
        encoding: String
        executable: Boolean
        lamports: BigInt
        meta: JsonParsedMeta
        owner: Account
        rentEpoch: BigInt
    }

    # A token account
    type TokenAccountTokenAmount {
        amount: String
        decimals: Int
        uiAmount: BigInt
        uiAmountString: String
    }
    type TokenAccountData {
        isNative: Boolean
        mint: Account
        owner: Account
        state: String
        tokenAmount: TokenAccountTokenAmount
    }
    type TokenAccount implements Account & AccountJsonParsed {
        address: String
        data: TokenAccountData
        encoding: String
        executable: Boolean
        lamports: BigInt
        meta: JsonParsedMeta
        owner: Account
        rentEpoch: BigInt
    }

    # A stake account
    type StakeAccountDataMetaAuthorized {
        staker: Account
        withdrawer: Account
    }
    type StakeAccountDataMetaLockup {
        custodian: Account
        epoch: BigInt
        unixTimestamp: BigInt
    }
    type StakeAccountDataMeta {
        authorized: StakeAccountDataMetaAuthorized
        lockup: StakeAccountDataMetaLockup
        rentExemptReserve: String
    }
    type StakeAccountDataStakeDelegation {
        activationEpoch: BigInt
        deactivationEpoch: BigInt
        stake: String
        voter: Account
        warmupCooldownRate: Int
    }
    type StakeAccountDataStake {
        creditsObserved: BigInt
        delegation: StakeAccountDataStakeDelegation
    }
    type StakeAccountData {
        meta: StakeAccountDataMeta
        stake: StakeAccountDataStake
    }
    type StakeAccount implements Account & AccountJsonParsed {
        address: String
        data: StakeAccountData
        encoding: String
        executable: Boolean
        lamports: BigInt
        meta: JsonParsedMeta
        owner: Account
        rentEpoch: BigInt
    }

    # A vote account
    type VoteAccountDataAuthorizedVoter {
        authorizedVoter: Account
        epoch: BigInt
    }
    type VoteAccountDataEpochCredit {
        credits: String
        epoch: BigInt
        previousCredits: String
    }
    type VoteAccountDataLastTimestamp {
        slot: BigInt
        timestamp: BigInt
    }
    type VoteAccountDataVote {
        confirmationCount: Int
        slot: BigInt
    }
    type VoteAccountData {
        authorizedVoters: [VoteAccountDataAuthorizedVoter]
        authorizedWithdrawer: Account
        commission: Int
        epochCredits: [VoteAccountDataEpochCredit]
        lastTimestamp: VoteAccountDataLastTimestamp
        node: Account
        priorVoters: [String]
        rootSlot: BigInt
        votes: [VoteAccountDataVote]
    }
    type VoteAccount implements Account & AccountJsonParsed {
        address: String
        data: VoteAccountData
        encoding: String
        executable: Boolean
        lamports: BigInt
        meta: JsonParsedMeta
        owner: Account
        rentEpoch: BigInt
    }
`;

export const accountResolvers = {
    Account: {
        __resolveType(account: { encoding: string; meta: { program: string; type: string } }) {
            if (account.encoding === 'base58') {
                return 'AccountBase58';
            }
            if (account.encoding === 'base64') {
                return 'AccountBase64';
            }
            if (account.encoding === 'base64+zstd') {
                return 'AccountBase64Zstd';
            }
            if (account.encoding === 'jsonParsed') {
                if (account.meta.program === 'nonce') {
                    return 'NonceAccount';
                }
                if (account.meta.type === 'mint' && account.meta.program === 'spl-token') {
                    return 'MintAccount';
                }
                if (account.meta.type === 'account' && account.meta.program === 'spl-token') {
                    return 'TokenAccount';
                }
                if (account.meta.program === 'stake') {
                    return 'StakeAccount';
                }
                if (account.meta.type === 'vote' && account.meta.program === 'vote') {
                    return 'VoteAccount';
                }
                if (account.meta.type === 'lookupTable' && account.meta.program === 'address-lookup-table') {
                    return 'LookupTableAccount';
                }
            }
            return 'AccountBase64';
        },
    },
    AccountBase58: {
        owner(
            parent: { owner: Address },
            args: AccountQueryArgs,
            context: RpcGraphQLContext,
            info: GraphQLResolveInfo | undefined
        ) {
            return context.resolveAccount({ ...args, address: parent.owner }, info);
        },
    },
    AccountBase64: {
        owner(
            parent: { owner: Address },
            args: AccountQueryArgs,
            context: RpcGraphQLContext,
            info: GraphQLResolveInfo | undefined
        ) {
            return context.resolveAccount({ ...args, address: parent.owner }, info);
        },
    },
    AccountBase64Zstd: {
        owner(
            parent: { owner: Address },
            args: AccountQueryArgs,
            context: RpcGraphQLContext,
            info: GraphQLResolveInfo | undefined
        ) {
            return context.resolveAccount({ ...args, address: parent.owner }, info);
        },
    },
    NonceAccountData: {
        authority(
            parent: { authority: Address },
            args: AccountQueryArgs,
            context: RpcGraphQLContext,
            info: GraphQLResolveInfo | undefined
        ) {
            return context.resolveAccount({ ...args, address: parent.authority }, info);
        },
    },
    NonceAccount: {
        owner(
            parent: { owner: Address },
            args: AccountQueryArgs,
            context: RpcGraphQLContext,
            info: GraphQLResolveInfo | undefined
        ) {
            return context.resolveAccount({ ...args, address: parent.owner }, info);
        },
    },
    LookupTableAccountData: {
        authority(
            parent: { authority: Address },
            args: AccountQueryArgs,
            context: RpcGraphQLContext,
            info: GraphQLResolveInfo | undefined
        ) {
            return context.resolveAccount({ ...args, address: parent.authority }, info);
        },
    },
    LookupTableAccount: {
        owner(
            parent: { owner: Address },
            args: AccountQueryArgs,
            context: RpcGraphQLContext,
            info: GraphQLResolveInfo | undefined
        ) {
            return context.resolveAccount({ ...args, address: parent.owner }, info);
        },
    },
    MintAccountData: {
        freezeAuthority(
            parent: { freezeAuthority: Address },
            args: AccountQueryArgs,
            context: RpcGraphQLContext,
            info: GraphQLResolveInfo | undefined
        ) {
            return context.resolveAccount({ ...args, address: parent.freezeAuthority }, info);
        },
        mintAuthority(
            parent: { mintAuthority: Address },
            args: AccountQueryArgs,
            context: RpcGraphQLContext,
            info: GraphQLResolveInfo | undefined
        ) {
            return context.resolveAccount({ ...args, address: parent.mintAuthority }, info);
        },
    },
    MintAccount: {
        owner(
            parent: { owner: Address },
            args: AccountQueryArgs,
            context: RpcGraphQLContext,
            info: GraphQLResolveInfo | undefined
        ) {
            return context.resolveAccount({ ...args, address: parent.owner }, info);
        },
    },
    TokenAccountData: {
        mint(
            parent: { mint: Address },
            args: AccountQueryArgs,
            context: RpcGraphQLContext,
            info: GraphQLResolveInfo | undefined
        ) {
            return context.resolveAccount({ ...args, address: parent.mint }, info);
        },
        owner(
            parent: { owner: Address },
            args: AccountQueryArgs,
            context: RpcGraphQLContext,
            info: GraphQLResolveInfo | undefined
        ) {
            if (parent.owner) {
                return context.resolveAccount({ ...args, address: parent.owner }, info);
            }
            return null;
        },
    },
    TokenAccount: {
        owner(
            parent: { owner: Address },
            args: AccountQueryArgs,
            context: RpcGraphQLContext,
            info: GraphQLResolveInfo | undefined
        ) {
            if (parent.owner) {
                return context.resolveAccount({ ...args, address: parent.owner }, info);
            }
            return null;
        },
    },
    StakeAccountDataMetaAuthorized: {
        staker(
            parent: { staker: Address },
            args: AccountQueryArgs,
            context: RpcGraphQLContext,
            info: GraphQLResolveInfo | undefined
        ) {
            if (parent.staker) {
                return context.resolveAccount({ ...args, address: parent.staker }, info);
            }
            return null;
        },
        withdrawer(
            parent: { withdrawer: Address },
            args: AccountQueryArgs,
            context: RpcGraphQLContext,
            info: GraphQLResolveInfo | undefined
        ) {
            if (parent.withdrawer) {
                return context.resolveAccount({ ...args, address: parent.withdrawer }, info);
            }
            return null;
        },
    },
    StakeAccountDataMetaLockup: {
        custodian(
            parent: { custodian: Address },
            args: AccountQueryArgs,
            context: RpcGraphQLContext,
            info: GraphQLResolveInfo | undefined
        ) {
            if (parent.custodian) {
                return context.resolveAccount({ ...args, address: parent.custodian }, info);
            }
            return null;
        },
    },
    StakeAccountDataStakeDelegation: {
        voter(
            parent: { voter: Address },
            args: AccountQueryArgs,
            context: RpcGraphQLContext,
            info: GraphQLResolveInfo | undefined
        ) {
            if (parent.voter) {
                return context.resolveAccount({ ...args, address: parent.voter }, info);
            }
            return null;
        },
    },
    StakeAccount: {
        owner(
            parent: { owner: Address },
            args: AccountQueryArgs,
            context: RpcGraphQLContext,
            info: GraphQLResolveInfo | undefined
        ) {
            if (parent.owner) {
                return context.resolveAccount({ ...args, address: parent.owner }, info);
            }
            return null;
        },
    },
    VoteAccountDataAuthorizedVoter: {
        authorizedVoter(
            parent: { authorizedVoter: Address },
            args: AccountQueryArgs,
            context: RpcGraphQLContext,
            info: GraphQLResolveInfo | undefined
        ) {
            if (parent.authorizedVoter) {
                return context.resolveAccount({ ...args, address: parent.authorizedVoter }, info);
            }
            return null;
        },
    },
    VoteAccountData: {
        authorizedWithdrawer(
            parent: { authorizedWithdrawer: Address },
            args: AccountQueryArgs,
            context: RpcGraphQLContext,
            info: GraphQLResolveInfo | undefined
        ) {
            if (parent.authorizedWithdrawer) {
                return context.resolveAccount({ ...args, address: parent.authorizedWithdrawer }, info);
            }
            return null;
        },
        node(
            parent: { nodePubkey: Address },
            args: AccountQueryArgs,
            context: RpcGraphQLContext,
            info: GraphQLResolveInfo | undefined
        ) {
            if (parent.nodePubkey) {
                return context.resolveAccount({ ...args, address: parent.nodePubkey }, info);
            }
            return null;
        },
    },
    VoteAccount: {
        owner(
            parent: { owner: Address },
            args: AccountQueryArgs,
            context: RpcGraphQLContext,
            info: GraphQLResolveInfo | undefined
        ) {
            if (parent.owner) {
                return context.resolveAccount({ ...args, address: parent.owner }, info);
            }
            return null;
        },
    },
};
