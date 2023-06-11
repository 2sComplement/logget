import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { getLogFile, getLogFiles } from "./routes/logs";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

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
        const fullPath = path.join(root, logPath);
        if (!fs.existsSync(fullPath)) {
            res.statusCode = 400;
            res.send(`Invalid path '${fullPath}'`);
        } else {
            const stats = fs.statSync(fullPath);
            if (stats.isDirectory()) {
                getLogFiles(req, res, fullPath);
            } else {
                getLogFile(req, res, root, logPath);
            }
        }
    } catch (e) {
        res.statusCode = 500;
        res.send(e);
    }
});

app.get("/log", (req: Request, res: Response) => {
    try {
        const fileName = req.params.fileName;
        getLogFile(req, res, root, fileName);
    } catch (e) {
        res.statusCode = 500;
        res.send(e);
    }
});

app.listen(port, () => {
    console.log(`Logget listening on port ${port} serving files from ${root}`);
});
