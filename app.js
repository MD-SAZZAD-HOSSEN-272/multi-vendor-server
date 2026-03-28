import express from "express";
import cors from "cors";
const port = process.env.PORT || 5000;
// import router from "./controllers/register/route.js";
import registerRoute from "./controllers/register/route.js";
import loginRoute from "./controllers/login/route.js";  
import getMeRoute from "./controllers/getMe/route.js";
import vendorRoute from "./controllers/vendor/route.js";
import ordersRoute from "./controllers/oreders/route.js";
import tokenVerify1, { tokenVerifyRole } from "./tokenVerify/tokenverify.js";

const app = express();
app.use(cors());
app.use(express.json());
// app.use(router);

app.get("/", (req, res) => {
  res.send("Welcome to the Multi Vendor API");
});


app.use("/api/auth", registerRoute);
app.use("/api/auth", loginRoute);
app.use("/api/auth/", tokenVerify1, getMeRoute);
app.use("/api/vendor", tokenVerify1, tokenVerifyRole("vendor"), vendorRoute);
app.use("/api/user", tokenVerify1, tokenVerifyRole("user"),  ordersRoute);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


export default app;
