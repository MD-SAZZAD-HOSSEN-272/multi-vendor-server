import express from "express";
import cors from "cors";
const port = process.env.PORT || 5000;
// import router from "./controllers/register/route.js";
import registerRoute from "./controllers/register/route.js";
import loginRoute from "./controllers/login/route.js";  
import tokenVerify from "./tokenVerify/tokenverify.js";
import getMeRoute from "./controllers/getMe/route.js";

const app = express();
app.use(cors());
app.use(express.json());
// app.use(router);

app.get("/", (req, res) => {
  res.send("Welcome to the Multi Vendor API");
});


app.use("/api/auth", registerRoute);
app.use("/api/auth", loginRoute);
app.use("/api/auth/", tokenVerify, getMeRoute);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


export default app;
