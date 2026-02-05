import { Hono } from "hono";
import { cors } from "hono/cors"
import home from "./routes/home.js";
import applrec from "./routes/applrec.js";

const app = new Hono();

//handle cors
app.use("/api/*", async function (c, next) {
  const corsMiddleware = cors({
    origin: c.env.ORIGIN,
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
  });

  return corsMiddleware(c, next);
});

//only let the frontend make request
app.use("/api/*", async function (c, next) {
  const origin = c.req.header("Origin");
  if (origin !== c.env.ORIGIN) {
    return c.json({
      message: "You are not allowed !!"
    }, 403);
  }

  await next();
});

app.route("/", home);
app.route("/api", applrec);

export default app;
