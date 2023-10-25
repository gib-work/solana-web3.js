export type RpcApiConfig = Readonly<{
    patchParameters: <T>(params: T, methodName: string) => unknown[];
    patchResponse: <T>(response: unknown, methodName: string) => T;
}>;

export type IRpcApiMethods = {
    [key: string | number | symbol]: (...args: unknown[]) => unknown;
};
