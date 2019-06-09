/**
 * Base class representing a Bladeburner contract/operation action
 */
import { IStatMap, IMap } from "../types";

import { checkWeightingObject } from "../utils/checkWeightingObject";

import { Generic_fromJSON, Generic_toJSON, Reviver } from "../../utils/JSONReviver";

import { addOffset } from "../../utils/helpers/addOffset";
import { getRandomInt } from "../../utils/helpers/getRandomInt";

export interface IConstructorParams {
    name: string;
    desc: string;
    baseDifficulty: number;
    difficultyFac: number;
    rewardFac?: number;
    rankGain: number;
    rankLoss?: number;
    hpLoss?: number;
    isStealth?: boolean;
    isKill?: boolean;
    count: number;
    countGrowth: number;
    weights: IStatMap<number>;
    decays: IStatMap<number>;
}

const DefaultParams = {
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

export class Action {
    /**
     * Initiatizes an Action object from a JSON save state.
     */
    static fromJSON(value: any): Action {
        return Generic_fromJSON(Action, value.data);
    }

    /**
     * Name & identifier of action
     */
    name: string;

    /**
     * Description of action
     */
    desc: string;

    /**
     * Player's current level for this action
     */
    level: number = 1;

    /**
     * Maximum level the player can set for this action
     */
    maxLevel: number = 1;

    /**
     * Whether the action's level should auto-advance with the max level increases
     */
    autoLevel: boolean = true;

    /**
     * Action's base difficulty. Numerical representation of how likely the player
     * is to succeed at this.
     */
    baseDifficulty: number;

    /**
     * Multiplier that affects how the difficulty increases with level
     */
    difficultyFac: number = 1.01;

    /**
     * Property that describes how the action's reward scales with its level
     */
    rewardFac: number = 1.02;

    /**
     * Number of times the player has succeeded at this action
     */
    successes: number = 0;

    /**
     * Number of times the player has failed at this action
     */
    failures: number = 0;

    /**
     * Base amount of rank gained when successfully completing this action.
     * Scales with level
     */
    rankGain: number;

    /**
     * Base amount of rank lost when failing at this action. Scales with level
     */
    rankLoss: number = 0;

    /**
     * Base amount of HP lost when failing at this action. Scales with difficulty
     */
    hpLoss: number = 0;

    /**
     * Whether this is a stealth action
     */
    isStealth: boolean = false;

    /**
     * Whether this is a "killing" action (involves retirement)
     */
    isKill: boolean = false;

    /**
     * Number of actions remaining
     */
    count: number;

    /**
     * Rate at which this action's count increases over time
     */
    countGrowth: number;

    /**
     * Weighting of each stat in determining action success rate. Must total
     * to 100
     */
    weights: IStatMap<number>;

    /**
     * Map of each stat that describes the diminishing returns that stats have on
     * this action's success chance
     */
    decays: IStatMap<number>;

    constructor(params: IConstructorParams=DefaultParams) {
        this.name = params.name;
        this.desc = params.desc;
        this.baseDifficulty = addOffset(params.baseDifficulty, 10);
        this.difficultyFac = params.difficultyFac;
        this.rankGain = params.rankGain;
        this.count = params.count;
        this.countGrowth = params.countGrowth;

        if (typeof params.rewardFac === "number") { this.rewardFac = params.rewardFac; }
        if (typeof params.rankLoss === "number") { this.rankLoss = params.rankLoss; }
        if (typeof params.hpLoss === "number") { this.hpLoss = params.hpLoss; }
        if (typeof params.isStealth === "boolean") { this.isStealth = params.isStealth; }
        if (typeof params.isKill === "boolean") { this.isKill = params.isKill; }

        this.weights = params.weights;
        this.decays = params.decays;

        // Validate stat weights and decays
        if (!checkWeightingObject(this.weights as IMap<number>, 1)) {
            throw new Error(`Invalid stat weights when construction Bladeburner Action ${this.name}`);
        }
        for (const decay in this.decays) {
            if (this.decays[decay] != null && this.decays[decay]! > 1) {
                throw new Error(`Invalid decays when constructing Bladeburner Action ${this.name}`);
            }
        }
    }

    getDifficulty = function() {
        var difficulty = this.baseDifficulty * Math.pow(this.difficultyFac, this.level-1);
        if (isNaN(difficulty)) {throw new Error("Calculated NaN in Action.getDifficulty()");}
        return difficulty;
    }

    /**
     * @inst - Bladeburner Object
     * @params - options:
     *  est (bool): Get success chance estimate instead of real success chance
     */
    getSuccessChance = function(inst, params={}) {
        if (inst == null) {throw new Error("Invalid Bladeburner instance passed into Action.getSuccessChance");}
        var difficulty = this.getDifficulty();
        var competence = 0;
        for (var stat in this.weights) {
            if (this.weights.hasOwnProperty(stat)) {
                var playerStatLvl = Player.queryStatFromString(stat);
                var key = "eff" + stat.charAt(0).toUpperCase() + stat.slice(1);
                var effMultiplier = inst.skillMultipliers[key];
                if (effMultiplier == null) {
                    console.log("ERROR: Failed to find Bladeburner Skill multiplier for: " + stat);
                    effMultiplier = 1;
                }
                competence += (this.weights[stat] * Math.pow(effMultiplier*playerStatLvl, this.decays[stat]));
            }
        }
        competence *= inst.calculateStaminaPenalty();

        // For Operations, factor in team members
        if (this instanceof Operation || this instanceof BlackOperation) {
            if (this.teamCount && this.teamCount > 0) {
                this.teamCount = Math.min(this.teamCount, inst.teamSize);
                var teamMultiplier = Math.pow(this.teamCount, 0.05);
                competence *= teamMultiplier;
            }
        }

        // Lower city population results in lower chances
        if (!(this instanceof BlackOperation)) {
            var city = inst.getCurrentCity();
            if (params.est) {
                competence *= Math.pow((city.popEst / PopulationThreshold), PopulationExponent);
            } else {
                competence *= Math.pow((city.pop / PopulationThreshold), PopulationExponent);
            }

            // Too high of a chaos results in lower chances
            if (city.chaos > ChaosThreshold) {
                var diff = 1 + (city.chaos - ChaosThreshold);
                var mult = Math.pow(diff, 0.1);
                difficulty *= mult;
            }

            // For Raid Operations, no communities = fail
            if (this instanceof Operation && this.name === "Raid") {
                if (city.comms <= 0) {return 0;}
            }
        }

        // Factor skill multipliers into success chance
        competence *= inst.skillMultipliers.successChanceAll;
        if (this instanceof Operation || this instanceof BlackOperation) {
            competence *= inst.skillMultipliers.successChanceOperation;
        }
        if (this instanceof Contract) {
            competence *= inst.skillMultipliers.successChanceContract;
        }
        if (this.isStealth) {
            competence *= inst.skillMultipliers.successChanceStealth;
        }
        if (this.isKill) {
            competence *= inst.skillMultipliers.successChanceKill;
        }

        // Augmentation multiplier
        competence *= Player.bladeburner_success_chance_mult;

        if (isNaN(competence)) {throw new Error("Competence calculated as NaN in Action.getSuccessChance()");}
        return Math.min(1, competence / difficulty);
    }

    /**
     * Tests for success. Should be called when an action has completed
     * @param inst {Bladeburner} - Bladeburner instance
     */
    attempt = function(inst) {
        return (Math.random() < this.getSuccessChance(inst));
    }

    getActionTime = function(inst) {
        var difficulty = this.getDifficulty();
        var baseTime = difficulty / DifficultyToTimeFactor;
        var skillFac = inst.skillMultipliers.actionTime; // Always < 1

        var effAgility      = Player.agility * inst.skillMultipliers.effAgi;
        var effDexterity    = Player.dexterity * inst.skillMultipliers.effDex;
        var statFac = 0.5 * (Math.pow(effAgility, EffAgiExponentialFactor) +
                             Math.pow(effDexterity, EffDexExponentialFactor) +
                             (effAgility / EffAgiLinearFactor) +
                             (effDexterity / EffDexLinearFactor)); // Always > 1

        baseTime = Math.max(1, baseTime * skillFac / statFac);

        if (this instanceof Contract) {
            return Math.ceil(baseTime);
        } else if (this instanceof Operation) {
            return Math.ceil(baseTime);
        } else if (this instanceof BlackOperation) {
            return Math.ceil(baseTime * 1.5);
        } else {
            throw new Error("Unrecognized Action Type in Action.getActionTime(this). Must be either Contract, Operation, or BlackOperation");
        }
    }

    getSuccessesNeededForNextLevel = function(baseSuccessesPerLevel) {
        return Math.ceil((0.5) * (this.maxLevel) * (2 * baseSuccessesPerLevel + (this.maxLevel-1)));
    }

    setMaxLevel = function(baseSuccessesPerLevel) {
        if (this.successes >= this.getSuccessesNeededForNextLevel(baseSuccessesPerLevel)) {
            ++this.maxLevel;
        }
    }

    /**
     * Serialize the current object to a JSON save state.
     */
    toJSON(): any {
        return Generic_toJSON("Action", this);
    }

 }

 Reviver.constructors.Action = Action;
