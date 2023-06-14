export const newline = '\n'; // process.platform === "win32" ? "\r\n" : "\n";
console.log(`Current platform: ${process.platform}`)

/**
 * Reverses the provided string array in place using constant memory space.
 * @param arr The array to be mutated/reversed.
 * @returns The total length of all elements in the array.
 */
export function reverseStringArrayReturnCharLength(arr: string[]) {

    if (!arr || arr.length ===0) {
        return 0;
    }

    const halfway = Math.floor(arr.length / 2);
    let length = 0;

    for (let i = 0; i < halfway; i++) {
        length += arr[i].length + arr[arr.length - i - 1].length;
        [arr[i], arr[arr.length - i - 1]] = [arr[arr.length - i - 1], arr[i]];
    }

    if (arr.length === 1) {
        length = arr[0].length;
    } else if (arr.length % 2 === 1) {
        length += arr[halfway + 1].length;
    }

    return length;
}
