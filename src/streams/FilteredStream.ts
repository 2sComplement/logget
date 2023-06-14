import { Transform, TransformCallback } from "stream";
import { newline } from "../utils";

export default class FilteredStream extends Transform {
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
