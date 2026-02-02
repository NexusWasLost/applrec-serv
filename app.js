import { Hono } from "hono";
import { cors } from "hono/cors"
import home from "./routes/home.js";
import applrec from "./routes/applrec.js";

const app = new Hono();

//handle cors
app.use("/api/*", cors({
  origin: "https://applrec-client.pages.dev",
  allowMethods: ["GET", "POST", "PUT", "DELETE"],
}))

//only let the frontend make request
app.use("/api/*", async function (c, next) {
  const origin = c.req.header("Origin");
  console.log(origin);
  if (origin !== "https://applrec-client.pages.dev") {
    return c.json({
      message: "You are not allowed !!"
    }, 403);
  }

  await next();
});

app.route("/", home);
app.route("/api", applrec);

export default app;
