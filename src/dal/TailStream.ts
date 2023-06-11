import { Transform, TransformCallback } from "stream";

// TODO put this somewhere common
const newline = process.platform === "win32" ? "\r\n" : "\n";

export class TailStream extends Transform {
    private numResults: number;
    private results: string[];

    constructor(numResults: number) {
        super();
        this.numResults = numResults;
        this.results = [];
    }

    _transform(
        chunk: Buffer | string,
        encoding: BufferEncoding,
        callback: TransformCallback
    ) {
        const lines: string[] = chunk.toString().split(newline);
        this.results.push(...lines);
        if (this.results.length > this.numResults) {
            this.results.splice(0, this.results.length - this.numResults);
        }
        callback();
    }

    _flush(callback: TransformCallback) {
        this.push(this.results.join(newline));
        callback();
    }
}
