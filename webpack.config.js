module.exports = {
  target: "node",
  mode: "production",
  entry: {
    publishToSQS: "./src/controllers/publishToSQS.ts",
    smsNotification: "./src/controllers/smsNotification.ts",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: __dirname + "/dist",
  },
};