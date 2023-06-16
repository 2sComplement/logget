import { Readable } from "stream";
import { newline, reverseStringArrayReturnCharLength } from "../utils";
import fs from "fs";

/**
 * Stream that reverses a file, with an optional tail option that only streams the last N lines of the file.
 */
export default class ReverseReadStream extends Readable {
    private chunkSize = 1024 * 64;
    private tail: number | null = null;
    private filePath: string;
    private position: number | null;

    constructor(filePath: string, tail?: number) {
        super();
        this.filePath = filePath;
        this.position = null;
        if (tail) {
            this.tail = tail;
        }
    }

    _readRestOfLine(fd: number, removed: string) {
        let restOfLine = removed; // What we have in the line so far
        let keepGoing = true;
        while (this.position && keepGoing) {
            const buffer = Buffer.alloc(1);
            const bytesRead = fs.readSync(fd, buffer, 0, 1, this.position);
            const bufferAsString = buffer.toString();
            if (bytesRead === 0 || bufferAsString === newline) {
                keepGoing = false;
            } else {
                restOfLine = bufferAsString + restOfLine;
                this.position--;
            }
        }
        return restOfLine;
    }

    _readChunk() {
        const isTailValid = this.tail === null || (this.tail !== null && this.tail > 0);
        if (this.position !== null && this.position > 0 && isTailValid) {
            const pos = this.position;
            const chunkSize = Math.min(this.chunkSize, this.position);
            const buffer = Buffer.alloc(chunkSize);
            fs.open(this.filePath, "r", (err, fd) => {
                if (err) {
                    this.emit("error", err);
                } else {
                    // console.log(`read chunk - ${this.position}`)
                    fs.read(fd, buffer, 0, chunkSize, pos - chunkSize, (err, bytesRead) => {
                        if (err) {
                            this.emit("error", err);
                        } else {
                            if (this.position && bytesRead > 0) {
                                // Split on newlines, and discard the first line in the chunk, since it may not be a full line.
                                // Push these in reverse order

                                const lines = buffer
                                    .toString()
                                    .split(newline)
                                    .filter((line) => line !== "");

                                reverseStringArrayReturnCharLength(lines);

                                if (bytesRead === this.position) {
                                    // The whole file has been read
                                    this.position -= bytesRead;
                                } else if (lines.length > 0) {
                                    // Throw away the first line since it may not be whole
                                    const removed = lines.pop();

                                    if (removed && removed.length === bytesRead) {
                                        this.position -= bytesRead;
                                        this.position--;

                                        const wholeLine = this._readRestOfLine(fd, removed);

                                        lines.unshift(wholeLine);
                                        lines[lines.length - 1] += newline;
                                    } else {
                                        let totalRead = bytesRead;

                                        if (removed) {
                                            totalRead -= removed.length;
                                            lines[lines.length - 1] += newline;
                                        }

                                        this.position -= totalRead;

                                        if (this.tail !== null) {
                                            this.tail -= lines.length;
                                        }
                                    }
                                }
                                this.push(lines.join(newline));
                            }
                        }

                        fs.close(fd, (err) => {
                            if (err) {
                                this.emit("err", err);
                            }
                        });
                    });
                }
            });
        } else {
            // We're finished
            this.push(null);
        }
    }

    _read() {
        if (this.position === null) {
            fs.stat(this.filePath, (err, stats) => {
                if (err) {
                    this.emit("error", err);
                } else {
                    const fileSize = stats.size;
                    // Start at the end of the file
                    this.position = fileSize;
                    this._readChunk();
                }
            });
        } else {
            this._readChunk();
        }
    }
}
