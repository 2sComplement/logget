import { Readable } from "stream";
import fs from "fs";
// import StringDecoder from 'string_decoder'

const newline = process.platform === "win32" ? "\r\n" : "\n";

export default class ReverseReadStream extends Readable {
    private chunkSize = 1024 * 64;
    private filePath: string;
    private position: number | null;

    constructor(filePath: string) {
        super();
        this.filePath = filePath;
        this.position = null;
    }

    _readChunk() {
        if (this.position !== null && this.position > 0) {
            const pos = this.position;
            const chunkSize = Math.min(this.chunkSize, this.position);
            const buffer = Buffer.alloc(chunkSize);
            fs.open(this.filePath, "r", (err, fd) => {
                if (err) {
                    this.emit("error", err);
                } else {
                    fs.read(fd, buffer, 0, chunkSize, pos - chunkSize, (err, bytesRead) => {
                        if (err) {
                            this.emit("error", err);
                        } else {
                            if (this.position && bytesRead > 0) {

                                // Split on newlines, and discard the first line in the chunk, since it may not be a full line.
                                // Push these in reverse order

                                const lines = buffer.toString().split(newline);
                                if (lines.length === 1) {
                                    this.push(lines[0]);
                                    this.position -= lines[0].length;
                                    this.position -= newline.length;
                                } else {

                                    //TODO make this more efficient
                                    const revLines = [];
                                    for (let i = lines.length - 1; i > 0; i--) {
                                        revLines.push(lines[i]);
                                        this.position -= lines[i].length;
                                        this.position -= newline.length;
                                    }
                                    this.push(revLines.join(newline));
                                }
                            }
                        }
                    });
                }
                fs.close(fd, (err) => {
                    if (err) {
                        this.emit("err", err);
                    }
                });
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
