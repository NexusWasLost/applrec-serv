import { Hono } from "hono";
import { cors } from 'hono/cors'
import home from "./routes/home.js";
import applrec from "./routes/applrec.js";

const app = new Hono();

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))

app.route("/", home);
app.route("/api", applrec);

export default app;
