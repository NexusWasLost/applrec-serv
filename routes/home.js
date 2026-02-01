import { Hono } from "hono";

const home = new Hono();

home.get("/", function(c){
    return c.json({
        message: "Hi from applrec",
    }, 200);
});

export default home;
