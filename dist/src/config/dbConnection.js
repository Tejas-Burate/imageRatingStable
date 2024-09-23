"use strict";
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose
    .connect(process.env.connectionString, {})
    .then(() => {
    console.log(`🚀 Database Connected Successfully!.., 🕒 Time: ${new Date().toLocaleString()}`);
})
    .catch((err) => {
    console.error(`
      ##############################################
      #  ❌ 🚨 Error Connecting to Database:       #
      #  🔍 Details: ${err.message}
      #  🕒 Time: ${new Date().toLocaleString()} 
      ##############################################
    `);
});
