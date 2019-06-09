/**
 * Gets a random integer bounded by the values passed in.
 * @param min The minimum value in the range.
 * @param max The maximum value in the range.
 */
import { MathRandomRef } from "../../src/utils/MathRandomRef";

export function getRandomInt(min: number, max: number) {
    const lower: number = Math.min(min, max);
    const upper: number = Math.max(min, max);

    return Math.floor(MathRandomRef() * (upper - lower + 1)) + lower;
}
