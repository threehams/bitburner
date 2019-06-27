/**
 * Bladeburner Black Operation class
 */
import { Operation, IOperationConstructorParams } from "./Operation";

import { Generic_fromJSON, Generic_toJSON, Reviver } from "../../utils/JSONReviver";
import { getRandomInt } from "../../utils/helpers/getRandomInt";

// Black operations must have certain properties when constructed
export interface IBlackOperationConstructorParams extends IOperationConstructorParams {
    hpLoss: number;
    rankLoss: number;
    reqdRank: number;
}

const BlackOperationDefaultParams = {
    name: "",
    desc: "",
    baseDifficulty: 100,
    difficultyFac: 1.01,
    hpLoss: 0,
    rankGain: 0,
    rankLoss: 0,
    reqdRank: 0,
    count: getRandomInt(1e3, 25e3),
    countGrowth: getRandomInt(1, 5),
    weights: { hack: 1/7, str: 1/7, def: 1/7, dex: 1/7, agi: 1/7, cha: 1/7, int: 1/7 },
    decays: { hack: 0.9, str: 0.9, def: 0.9, dex: 0.9, agi: 0.9, cha: 0.9, int: 0.9 },
}

export class BlackOperation extends Operation {
    /**
     * Initiatizes a BlackOperation object from a JSON save state.
     */
    static fromJSON(value: any): BlackOperation {
        return Generic_fromJSON(BlackOperation, value.data);
    }

    constructor(params: IBlackOperationConstructorParams=BlackOperationDefaultParams) {
        super(params);

        // BlackOps are one time operations
        this.count = 1;
        this.countGrowth = 0;
    }

    /**
     * Serialize the current object to a JSON save state.
     */
    toJSON(): any {
        return Generic_toJSON("BlackOperation", this);
    }
}

Reviver.constructors.BlackOperation = BlackOperation;
