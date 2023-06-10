import express, { Request, Response } from "express";
import fs from "fs"
import path from "path"
import { File, Dir, DirectoryContents } from "../models/DirectoryContents";

const defaultPath = "/var/log"

export const listDirectoryContents = (req: Request, res: Response) => {

    const basePath = req.query.path as string ?? defaultPath;

    if (!fs.existsSync(basePath)) {
        res.statusCode = 400;
        res.send(`Invalid path '${basePath}'`)
    } else {
        const dirents : fs.Dirent[] = fs.readdirSync(basePath, { withFileTypes: true });
        const files = [];
        const dirs = [];
        for (var i = 0; i < dirents.length; i++) {
            const dirent = dirents[i];
            if (dirent.isDirectory()) {
                const dir: Dir = {
                    name: dirent.name
                }
                dirs.push(dir)
            } else {
                const stats: fs.Stats = fs.statSync(path.join(basePath, dirent.name));
                const file = {
                    name: dirent.name,
                    size: stats.size
                }
                files.push(file);
            }
        }
        const dirContents: DirectoryContents = {
            path: basePath,
            files: files,
            dirs: dirs
        }
        res.send(dirContents);
    }
}