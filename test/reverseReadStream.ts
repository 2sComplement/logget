import { expect, assert } from "chai";
import fs from "fs";
import ReverseReadStream from "../src/dal/ReverseReadStream";

const newline = process.platform === "win32" ? "\r\n" : "\n";

describe("ReverseReadStream tests", () => {
    it("Passes a baseline test", (done) => {
        const rrs = fs.createReadStream("./test/test.txt");
        const chunks: string[] = [];
        const expected = ["one", "two", "three", "four", "five", "six"].join(newline);

        rrs.on("data", (data) => chunks.push(data.toString()));
        rrs.on("end", () => {
            expect(chunks.join(newline)).to.equal(expected);
            done();
        });
        rrs.on("error", (err) => {
            assert.fail(err.message);
        });
    });

    it("Reads a file in reverse", (done) => {
        const rrs = new ReverseReadStream("./test/test.txt");
        const chunks: string[] = [];
        const expected = ["six", "five", "four", "three", "two", "one"].join(newline);

        rrs.on("data", (data) => {
            chunks.push(data.toString());
        });
        rrs.on("end", () => {
            expect(chunks.join(newline)).to.equal(expected);
            done();
        });
        rrs.on("error", (err) => {
            assert.fail(err.message);
        });
    });
});
