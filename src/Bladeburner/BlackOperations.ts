/**
 * Object containing all Bladeburner black operations as a map of
 * names -> BlackOperation objects
 */
import {
    BlackOperation,
    IBlackOperationConstructorParams
} from "./BlackOperation";
import { BlackOperationsMetadata  }from "./data/BlackOperationsMetadata";

import { IMap } from "../types";

export const BlackOperations: IMap<BlackOperation> = {};

function constructBlackOperation(metadata: IBlackOperationConstructorParams) {
    BlackOperations[metadata.name] = new BlackOperation(metadata);
}

export function initBladeburnerBlackOperations() {
    for (const metadata of BlackOperationsMetadata) {
        constructBlackOperation(metadata);
    }
}
