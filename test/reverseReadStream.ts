import { expect, assert } from "chai";
import { newline } from "../src/utils";
import ReverseReadStream from "../src/streams/ReverseReadStream";

describe("ReverseReadStream tests", () => {
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
    
    it("Reads a long file in reverse", (done) => {
        const rrs = new ReverseReadStream("./test/longTest.txt");
        let numLines = 0;
        let firstLine = "";
        let lastLine = "";
        const expectedNumLines = 8766;

        rrs.on("data", (data) => {
            const lines: string[] = data.toString().split(newline);
            if (firstLine === "") {
                console.log(`firstline = ${lines[0]}`)
                firstLine = lines[0];
            }
            lastLine = lines[lines.length - 1];
            numLines += lines.length;
        });
        rrs.on("end", () => {
            expect(lastLine).to.equal("2023-01-01");
            expect(firstLine).to.equal("2046-12-31");
            expect(numLines).to.equal(expectedNumLines);
            done();
        });
        rrs.on("error", (err) => {
            assert.fail(err.message);
        });
    });
});
