import { Transform, TransformCallback } from "stream";

const newline = process.platform === "win32" ? "\r\n" : "\n";

export class FilteredStream extends Transform {
    private filter: (chunk: string) => boolean;

    constructor(filter: (chunk: string) => boolean) {
        super();
        this.filter = filter;
    }

    _transform(
        chunk: Buffer | string,
        encoding: BufferEncoding,
        callback: TransformCallback
    ) {
        const lines: string[] = chunk.toString().split(newline);
        const result: string[] = [];

        for (let i = 0; i < lines.length; i++) {
            if (this.filter(lines[i])) {
                result.push(lines[i]);
            }
        }
        this.push(result.join(newline));
        callback();
    }
}
