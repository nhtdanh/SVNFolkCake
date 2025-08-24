const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT;
const uri = process.env.MONGODB_URI;
async function startServer() {
  try {
    await mongoose.connect(uri);
    //await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error run server", error);
  }
}

startServer();
