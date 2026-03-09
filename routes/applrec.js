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
            WHERE companyname ILIKE '%' || $1 || '%'`,
            [param]
        );

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

        const sql = neon(c.env.REMOTE_DB_URL);
        let data = await sql.query(`
            SELECT * FROM applrec
            WHERE appldate = $1
            ORDER BY appldate DESC`,
            [date]
        );

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

applrec.get("/search-by-id", async function (c) {
    try {
        const id = c.req.query("id");
        if (!id) {
            return c.json({
                message: "No id provided"
            }, 400);
        }

        const sql = neon(c.env.REMOTE_DB_URL);
        let data = await sql.query(`
            SELECT
            TO_CHAR(appldate, 'YYYY-MM-DD') AS appldate,
            companyname, position, url, status, notes
            FROM applrec WHERE appl_id = $1`,
            [id]
        );

        if (data.length === 0) {
            data = "No Matching fields";
        }

        return c.json({
            message: "Fetch for Update Successful",
            data: data
        }, 200);
    }
    catch (error) {
        console.log(error);
        return c.json({
            message: "Failed to Search"
        }, 500);
    }
})

applrec.put("/update-appl", async function (c) {
    try {
        const { id, appldate, companyname, position, url, status, notes } = await c.req.json();
        if (!id) {
            return c.json({
                message: "No id provided"
            }, 400);
        }

        const sql = neon(c.env.REMOTE_DB_URL);
        const data = await sql.query(`
        UPDATE applrec
        SET
        appldate = $1, companyname = $2,
        position = $3, url = $4,
        status = $5, notes = $6
        WHERE appl_id = $7`,
            [appldate, companyname, position, url, status, notes, id]
        );

        return c.json({
            message: "Update Data recieved successfully"
        }, 200);
    }
    catch (error) {
        console.log(error);
        return c.json({
            message: "Failed to Update"
        }, 500);
    }
})

applrec.post("/apply", async function (c) {
    try {
        const { appldate, companyname, position, url, status, notes } = await c.req.json();
        const sql = neon(c.env.REMOTE_DB_URL);

        const data = await sql.query(`
            INSERT INTO applrec (appldate, companyname, position, url, status, notes)
            VALUES($1, $2, $3, $4, $5, $6)`,
            [appldate, companyname, position, url, status, notes]
        );

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

applrec.delete("/del-appl", async function (c) {
    try {
        const { id } = await c.req.json();
        if (!id) {
            return c.json({
                message: "No id provided"
            }, 400);
        }

        const sql = neon(c.env.REMOTE_DB_URL);
        const data = await sql.query(`
        DELETE FROM applrec
        WHERE appl_id = $1`,
            [id]
        );

        return c.json({
            message: "Application Deleted Successfully"
        }, 200);
    }
    catch (error) {
        console.log(error);
        return c.json({
            message: "Failed to Delete data"
        }, 500);
    }
});

export default applrec;
