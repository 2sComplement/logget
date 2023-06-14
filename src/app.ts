import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { getFromPath, getLogFiles } from "./routes/logs";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// Mostly just for testing on windows
const root = process.platform === "win32" ? "C:/temp" : "/var/log";

app.get("/logs", (req: Request, res: Response) => {
    try {
        getLogFiles(req, res, root);
    } catch (e) {
        res.statusCode = 500;
        res.send(e);
    }
});

app.get("/logs/:path(*)", (req: Request, res: Response) => {
    try {
        const logPath = req.params.path;
        getFromPath(req, res, root, logPath);
    } catch (e) {
        res.statusCode = 500;
        res.send(e);
    }
});

app.listen(port, () => {
    console.log(`Logget listening on port ${port} serving files from ${root}`);
});
