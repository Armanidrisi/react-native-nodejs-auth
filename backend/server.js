const express = require("express");
const connectToMongo = require("./utils/db");
const auth = require("./routes/auth");

const app = express();
const PORT = 3000;
const URI = "";

app.use(express.json());
connectToMongo(URI);
app.use("/auth", auth);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
