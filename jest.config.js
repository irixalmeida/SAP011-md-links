module.exports = {
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  testEnvironment: "node",
  transformIgnorePatterns: ["node_modules/(?!(node-fetch|fetch-blob)/)"],
};
