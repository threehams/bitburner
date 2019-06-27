/**
 * Object containing all Bladeburner general actions as a map of
 * names -> Action objects
 */
import { Action, IActionConstructorParams } from "./Action";
import { GeneralActionsMetadata } from "./data/GeneralActionsMetadata";

import { IMap } from "../types";

export const GeneralActions: IMap<Action> = {};

function constructGeneralAction(metadata: IActionConstructorParams) {
    GeneralActions[metadata.name] = new Action(metadata);
}

export function initBladeburnerGeneralActions() {
    for (const metadata of GeneralActionsMetadata) {
        constructGeneralAction(metadata);
    }
}
