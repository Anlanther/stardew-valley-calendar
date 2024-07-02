module.exports = () => ({
  "schemas-to-ts": {
    enabled: true,
    config: {
      acceptedNodeEnvs: ["development"],
      commonInterfacesFolderName: "schemas-to-ts",
      alwaysAddEnumSuffix: false,
      alwaysAddComponentSuffix: true,
      usePrettierIfAvailable: true,
      logLevel: 2,
      destinationFolder: undefined,
    },
  },
  graphql: {
    config: {
      endpoint: "/graphql",
      shadowCRUD: true,
      playgroundAlways: false,
      depthLimit: 20,
      amountLimit: 100,
      apolloServer: {
        tracing: false,
      },
    },
  },
});
