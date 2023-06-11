import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { Dir, DirectoryContents } from "../models/DirectoryContents";
import { FilteredStream } from "../dal/FilteredStream";
import { TailStream } from "../dal/TailStream";

export const getLogFiles = (req: Request, res: Response, dir: string) => {
    if (!fs.existsSync(dir)) {
        res.statusCode = 400;
        res.send(`Invalid path '${dir}'`);
    } else {
        const dirents: fs.Dirent[] = fs.readdirSync(dir, {
            withFileTypes: true,
        });
        const files = [];
        const dirs = [];
        for (let i = 0; i < dirents.length; i++) {
            const dirent = dirents[i];
            if (dirent.isDirectory()) {
                const dir: Dir = {
                    name: dirent.name,
                };
                dirs.push(dir);
            } else {
                const fullPath = path.join(dir, dirent.name);
                const stats = fs.statSync(fullPath);
                const file = {
                    name: dirent.name,
                    size: stats.size,
                };
                files.push(file);
            }
        }
        const dirContents: DirectoryContents = {
            path: dir,
            files: files,
            dirs: dirs,
        };
        res.send(dirContents);
    }
};

export const getLogFile = (
    req: Request,
    res: Response,
    root: string,
    fileName: string
) => {
    const fullPath = path.join(root, fileName);

    // TODO consider returning the same error for both these cases for obscurity
    if (!fs.existsSync(fullPath)) {
        res.statusCode = 400;
        res.send(`File does not exist: '${fullPath}`);
    } else {
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
            res.statusCode = 400;
            res.send(`Path must point to a file: '${fullPath}`);
        } else {
            const search = req.query.search as string;
            const last = req.query.last as string;
            const intLast = parseInt(last);
            if (last && !intLast) {
                res.statusCode = 400;
                res.send(`Query param 'last' must be a number`);
                return;
            }

            res.writeHead(200, {
                "Content-Type": "application/octet-stream",
                // "Content-Disposition": `attachment; ${fileName}`,
                // "Content-Length": stats.size,
            });

            const readStream = fs.createReadStream(fullPath);

            if (search) {
                const filter = (chunk: string) =>
                    chunk.toString().search(search) >= 0;
                const filteredStream = new FilteredStream(filter);

                if (intLast) {
                    const tailStream = new TailStream(intLast);
                    readStream.pipe(filteredStream).pipe(tailStream).pipe(res);
                } else {
                    readStream.pipe(filteredStream).pipe(res);
                }
            } else if (intLast) {
                // Not technically a requirement but it might be useful to return the last n lines of the log file
                const tailStream = new TailStream(intLast);
                readStream.pipe(tailStream).pipe(res);
            } else {
                readStream.pipe(res);
            }
        }
    }
};
