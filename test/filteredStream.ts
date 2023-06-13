import { expect, assert } from "chai";
import fs from "fs";
import { FilteredStream } from "../src/dal/FilteredStream";

const newline = process.platform === "win32" ? "\r\n" : "\n";

describe("FilteredStream tests", () => {
    it("Filters based on text search", (done) => {
        const rrs = fs.createReadStream("./test/test.txt");
        const filterOs = (chunk: string) => chunk.toString().search("o") >= 0;
        const filtered = new FilteredStream(filterOs);
        const chunks: string[] = [];
        const expected = ["one", "two", "four"].join(newline);

        const result = rrs.pipe(filtered);

        result.on("data", (data) => chunks.push(data.toString()));
        result.on("end", () => {
            expect(chunks.join(newline)).to.equal(expected);
            done();
        });
        result.on("error", (err) => {
            assert.fail(err.message);
        });
    });
});
