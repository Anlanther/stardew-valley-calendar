module.exports = () => ({
  "schemas-to-ts": {
    enabled: true,
    config: {
      acceptedNodeEnvs: ["development"],
      commonInterfacesFolderName: "schemas-to-ts",
      alwaysAddEnumSuffix: false,
      alwaysAddComponentSuffix: false,
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
      depthLimit: 7,
      amountLimit: 100,
      apolloServer: {
        tracing: false,
      },
    },
  },
});
