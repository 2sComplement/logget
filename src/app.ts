import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { listDirectoryContents } from "./routes/list";
import { getFile } from "./routes/file";


dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get("/list", (req: Request, res: Response) => {
    try {
        listDirectoryContents(req, res);
    }
    catch (e) {
        res.statusCode = 500;
        res.send(e);
    }
});

app.get("/file", (req: Request, res: Response) => {
    try {
        getFile(req, res);
    }
    catch (e) {
        res.statusCode = 500;
        res.send(e);
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
