import app from "./app.js";
import "dotenv/config";
import connectDB from "./db/db.js";

const PORT = process.env.PORT || 7001;

connectDB()
  .then(
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    })
  )
  .catch((error) => {
    console.log(error.message);
  });
