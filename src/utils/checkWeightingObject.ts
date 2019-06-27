import { IMap } from "../types";

/**
 * Function that checks an object to ensure that the sum of all of its
 * numeric properties is equal to a target value. This is typically used
 * to validate "weighting" objects in the game.
 */
export function checkWeightingObject(weights: IMap<number>, target: number=100): boolean {
    let sum = 0;
    for (const weight in weights) {
        if (typeof weights[weight] !== "number") {
            console.warn(`checkWeightingObject() encountered non-numeric: ${weights[weight]}`);
            continue;
        }

        sum += weights[weight];
    }

    return Math.abs(sum - target) < 10 * Number.EPSILON;
}
