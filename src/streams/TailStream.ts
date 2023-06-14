import { Transform, TransformCallback } from "stream";
import { newline } from "../utils";

export default class TailStream extends Transform {
    private numResults: number;
    private results: string[];
    private isReversed: boolean;

    constructor(numResults: number, isReversed = true) {
        super();
        this.numResults = numResults;
        this.results = [];
        this.isReversed = isReversed;
    }

    _transform(chunk: Buffer | string, encoding: BufferEncoding, callback: TransformCallback) {
        const lines: string[] = chunk
            .toString()
            .split(newline)
            .filter((line) => line !== "");
        this.results.push(...lines);

        // Remove elements from the results if they exceed numResults
        if (this.results.length > this.numResults) {
            if (this.isReversed) {
                // Stream is in reverse order - remove from the end of the array
                const numToRemove = this.results.length - this.numResults;
                this.results.splice(this.results.length - numToRemove);
            } else {
                // Stream is in order - remove from the start of the array
                this.results.splice(0, this.results.length - this.numResults);
            }
        }
        callback();
    }

    _flush(callback: TransformCallback) {
        this.push(this.results.join(newline));
        callback();
    }
}
