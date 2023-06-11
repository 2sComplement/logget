import { Request, Response } from "express";
import fs, { WriteStream } from "fs";
import path from "path";
import { Dir, DirectoryContents } from "../models/DirectoryContents";
import { Transform } from "stream";
import { FilteredStream } from "../dal/FilteredStream";

export const getLogFiles = (req: Request, res: Response, root: string) => {
    if (!fs.existsSync(root)) {
        res.statusCode = 400;
        res.send(`Invalid path '${root}'`);
    } else {
        const dirents: fs.Dirent[] = fs.readdirSync(root, {
            withFileTypes: true,
        });
        const files = [];
        const dirs = [];
        for (var i = 0; i < dirents.length; i++) {
            const dirent = dirents[i];
            if (dirent.isDirectory()) {
                const dir: Dir = {
                    name: dirent.name,
                };
                dirs.push(dir);
            } else {
                const fullPath = path.join(root, dirent.name);
                const stats = fs.statSync(fullPath);
                const file = {
                    name: dirent.name,
                    size: stats.size,
                };
                files.push(file);
            }
        }
        const dirContents: DirectoryContents = {
            path: root,
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
            res.writeHead(200, {
                "Content-Type": "application/octet-stream",
                // "Content-Disposition": `attachment; ${fileName}`,
                // "Content-Length": stats.size,
            });

            const search = req.query.search as string;
            // const tail = req.query.tail;

            const readStream = fs.createReadStream(fullPath);

            if (search) {
                const filter = (chunk: any) => chunk.toString().search(search) >= 0
                const filteredStream = new FilteredStream(filter);
                readStream.pipe(filteredStream).pipe(res);
            } else {
                readStream.pipe(res);
            }
        }
    }
};
