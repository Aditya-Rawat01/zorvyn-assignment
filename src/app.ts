import express from "express";
import userRouter from "./modules/users/user.routes";
import recordRouter from "./modules/records/record.routes";
import dashboardRouter from "./modules/dashboard/dashboard.routes";

const app = express();

app.use(express.json());

app.use("/users", userRouter);
app.use("/records", recordRouter)
app.use("/dashboard", dashboardRouter)
// debugging route.
app.get("/", (req, res) => {
  res.send("API is running");
});

export default app;
