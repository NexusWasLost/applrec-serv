import { Hono } from "hono";
import { neon } from "@neondatabase/serverless";

const applrec = new Hono();

applrec.get("/get-appl", async function (c) {
    try {
        const sql = neon(c.env.REMOTE_DB_URL);
        const data = await sql.query(`SELECT * FROM applrec
        ORDER BY appl_id DESC LIMIT 50`);

        return c.json({
            message: "Data Fetched",
            data: data
        }, 200);
    }
    catch (error) {
        console.log(error);
        return c.json({
            message: "Failed to fetch data"
        }, 500);
    }
});

applrec.get("/search", async function (c) {
    try {
        const param = c.req.query('q');
        if (!param) {
            return c.json({
                message: "No search Param provided"
            }, 400);
        }

        const sql = neon(c.env.REMOTE_DB_URL);
        let data = await sql.query(`
            SELECT * FROM applrec
            WHERE companyname ILIKE '%${param}%'
        `);

        if (data.length === 0) {
            data = "No Matching fields";
        }

        return c.json({
            message: "Data Fetched",
            data: data
        }, 200);
    }
    catch (error) {
        console.log(error);
        return c.json({
            message: "Failed to Search"
        }, 500);
    }
});

applrec.get("/search-by-date", async function (c) {
    try {
        const date = c.req.query('d');
        if (!date) {
            return c.json({
                message: "No search Date provided"
            }, 400);
        }

        console.log(date);

        const sql = neon(c.env.REMOTE_DB_URL);
        let data = await sql.query(`
            SELECT * FROM applrec
            WHERE appldate = '${ date }'
            ORDER BY appldate DESC
        `);

        if (data.length === 0) {
            data = "No Matching fields";
        }

        return c.json({
            message: "Data Recieved",
            data: data
        }, 200);
    }
    catch (error) {
        console.log(error);
        return c.json({
            message: "Failed to Search"
        }, 500);
    }
});

applrec.post("/apply", async function (c) {
    try {
        const { appldate, companyname, position, url, status } = await c.req.json();
        const sql = neon(c.env.REMOTE_DB_URL);

        const data = await sql.query(`
        INSERT INTO applrec (appldate, companyname, position, url, status)
        VALUES('${appldate}', '${companyname}', '${position}', '${url}', '${status}')
        `);

        return c.json({
            message: "Data inserted successfully"
        }, 200)
    }
    catch (error) {
        console.log(error);
        return c.json({
            message: "Failed to Insert data"
        }, 500);
    }

});

export default applrec;
