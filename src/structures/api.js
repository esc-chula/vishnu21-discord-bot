module.exports = class api extends require("lavacord").Rest {
  static async load(node, query, lsClient) {
    const spotify = lsClient ? lsClient.nodes.get(node.id) : undefined;
    return lsClient && lsClient.isValidURL(query)
      ? await spotify.load(query)
      : await super.load(node, query);
  }
};
