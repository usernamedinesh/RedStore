require("dotenv").config();
const app = require("./app");
const env = require("./config/envConfig");

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
