import { expect } from "chai";
import { reverseStringArrayReturnCharLength } from "../src/utils";

describe("Utils tests", () => {
    it("Reverse array util works as expected on array with a single element", () => {
        const arr = ["one"];
        const expectedArr = ["one"];
        const expectedLength = 3;
        const actualLength = reverseStringArrayReturnCharLength(arr);
        expect(arr).deep.equal(expectedArr);
        expect(actualLength).deep.equal(expectedLength);
    });
    it("Reverse array util works as expected on arrays with an odd number of elements", () => {
        const arr = ["one", "two", "three"];
        const expectedArr = ["three", "two", "one"];
        const expectedLength = 11;
        const actualLength = reverseStringArrayReturnCharLength(arr);
        expect(arr).deep.equal(expectedArr);
        expect(actualLength).deep.equal(expectedLength);
    });

    it("Reverse array util works as expected on arrays with an even number of elements", () => {
        const arr = ["one", "two", "three", "four"];
        const expectedArr = ["four", "three", "two", "one"];
        const expectedLength = 15;
        const actualLength = reverseStringArrayReturnCharLength(arr);
        expect(arr).deep.equal(expectedArr);
        expect(actualLength).deep.equal(expectedLength);
    });
});
