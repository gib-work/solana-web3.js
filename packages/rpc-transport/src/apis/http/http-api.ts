import { IRpcApi, RpcRequest } from '../../json-rpc-types';
import { IRpcApiMethods, RpcApiConfig } from '../api-types';

export function createJsonRpcApi<TRpcMethods extends IRpcApiMethods>(config?: RpcApiConfig): IRpcApi<TRpcMethods> {
    return new Proxy({} as IRpcApi<TRpcMethods>, {
        defineProperty() {
            return false;
        },
        deleteProperty() {
            return false;
        },
        get<TMethodName extends keyof IRpcApi<TRpcMethods>>(
            ...args: Parameters<NonNullable<ProxyHandler<IRpcApi<TRpcMethods>>['get']>>
        ) {
            const [_, p] = args;
            const methodName = p.toString() as keyof TRpcMethods as string;
            return function (
                ...rawParams: Parameters<
                    TRpcMethods[TMethodName] extends CallableFunction ? TRpcMethods[TMethodName] : never
                >
            ): RpcRequest<ReturnType<TRpcMethods[TMethodName]>> {
                const params = config?.patchParameters ? config?.patchParameters(rawParams, methodName) : rawParams;
                const responseProcessor = config?.patchResponse
                    ? config?.patchResponse<ReturnType<TRpcMethods[TMethodName]>>
                    : (rawResponse: unknown) => rawResponse as ReturnType<TRpcMethods[TMethodName]>;
                return {
                    methodName,
                    params,
                    responseProcessor,
                };
            };
        },
    });
}
