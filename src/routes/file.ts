import { Request, Response } from "express";
import fs from "fs";
import path from "path"

export const getFile = (req: Request, res: Response) => {
    
    const filePath = req.query.path as string;

    if (!filePath) {
        res.statusCode = 400;
        res.send(`Missing required query param: 'path'`);
    } else if (!fs.existsSync(filePath)) {
        res.statusCode = 400;
        res.send(`File does not exist: '${filePath}`);
    } else {
        const stats: fs.Stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            res.statusCode = 400;
            res.send(`Path must point to a file: '${filePath}`);
        } else {
            res.writeHead(200, {
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': `attachment; ${path.basename(filePath)}`,
                'Content-Length': stats.size
            });
            const rs = fs.createReadStream(filePath);
            rs.pipe(res);
        }
    }
}