/**
 * Bladeburner Operation class
 */
import { Action, IActionConstructorParams } from "./Action";

import { IStatMap } from "../types";

import { Generic_fromJSON, Generic_toJSON, Reviver } from "../../utils/JSONReviver";
import { getRandomInt } from "../../utils/helpers/getRandomInt";

export interface IOperationConstructorParams extends IActionConstructorParams {
    name: string;
    desc: string;
    baseDifficulty: number;
    difficultyFac?: number;
    rewardFac?: number;
    rankGain: number;
    rankLoss?: number;
    reqdRank?: number;
    hpLoss?: number;
    isStealth?: boolean;
    isKill?: boolean;
    count?: number;
    countGrowth?: number;
    weights: IStatMap<number>;
    decays: IStatMap<number>;
}

const OperationDefaultParams = {
    name: "",
    desc: "",
    baseDifficulty: 100,
    difficultyFac: 1.01,
    rankGain: 0,
    count: getRandomInt(1e3, 25e3),
    countGrowth: getRandomInt(1, 5),
    weights: { hack: 1/7, str: 1/7, def: 1/7, dex: 1/7, agi: 1/7, cha: 1/7, int: 1/7 },
    decays: { hack: 0.9, str: 0.9, def: 0.9, dex: 0.9, agi: 0.9, cha: 0.9, int: 0.9 },
}

export class Operation extends Action {
    /**
     * Initiatizes a Operation object from a JSON save state.
     */
    static fromJSON(value: any): Operation {
        return Generic_fromJSON(Operation, value.data);
    }

    /**
     * Bladeburner rank required to run this operation
     */
    reqdRank: number = 100;

    /**
     * Number of Bladeburner team members assigned to this operation
     */
    teamCount: number = 0;

    constructor(params: IOperationConstructorParams=OperationDefaultParams) {
        super(params);

        if (typeof params.reqdRank === "number") {
            this.reqdRank = params.reqdRank;
        }
    }

    /**
     * Serialize the current object to a JSON save state.
     */
    toJSON(): any {
        return Generic_toJSON("Operation", this);
    }
}

Reviver.constructors.Operation = Operation;
