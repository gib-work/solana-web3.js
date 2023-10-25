import { createJsonRpc } from '../../json-rpc';
import { createHttpTransport } from '../../transports/http/http-transport';
import { createJsonRpcApi } from '../http/http-api';

// Define the method's response payload
type NftCollectionDetailsApiResponse = Readonly<{
    address: string;
    circulatingSupply: number;
    description: string;
    erc721: boolean;
    erc1155: boolean;
    genesisBlock: string;
    genesisTransaction: string;
    name: string;
    totalSupply: number;
}>;

// Set up an interface for the request method
interface NftCollectionDetailsApi {
    // Define the method's name, parameters and response type
    qn_fetchNFTCollectionDetails(args: { contracts: string[] }): NftCollectionDetailsApiResponse;
}

// Export the type spec for downstream users
export type QuickNodeRpcMethods = NftCollectionDetailsApi;

// Create the custom API
const api = createJsonRpcApi<QuickNodeRpcMethods>();

// Set up an HTTP transport
const transport = createHttpTransport({ url: 'http://127.0.0.1:8899' });

// Create the RPC client
const quickNodeRpc = createJsonRpc<QuickNodeRpcMethods>({ api, transport });
