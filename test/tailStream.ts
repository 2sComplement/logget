import { expect, assert } from "chai";
import { newline } from "../src/utils";
import TailStream from "../src/streams/TailStream";
import fs from "fs";

describe("TailStream tests", () => {
    it("Tails the last n lines", (done) => {
        const rrs = fs.createReadStream("./test/test.testlog");
        const tail = new TailStream(3, false);
        const chunks: string[] = [];
        const expected = ["four", "five", "six"].join(newline);

        const result = rrs.pipe(tail);

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
