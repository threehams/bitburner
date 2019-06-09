/**
 * Bladeburner Skill class
 *
 * Implementation notes:
 *  - The player's level of a particular Bladeburner skill is stored and managed
 *    outside of this class.
 *  - The properties that define the effects of the skills are numbers that represent
 *    the ADDITIVE percentage effect granted by the skill. For example, if a skill
 *    grants +5% of "x" per level, then its "x" property should be 5
 *  - Unless otherwise stated, the effects of skills are additive with themselves./
 *    (2 levels in a skill that grants +5% results in +10% total, not 10.25%)
 */
import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";

export interface IConstructorParams {
    name: string;
    desc: string;
    baseCost: number;
    costInc: number;
    maxLvl?: number;
    successChanceAll?: number;
    successChanceStealth?: number;
    successChanceKill?: number;
    successChanceContract?: number;
    successChanceOperation?: number;
    successChanceEstimate?: number;
    actionTime?: number;
    effHack?: number;
    effStr?: number;
    effDef?: number;
    effDex?: number;
    effAgi?: number;
    effCha?: number;
    stamina?: number;
    money?: number;
    expGain?: number;
    weaponAbility?: number;
    gunAbility?: number;
}

const DefaultParams = {
    name: "foo",
    desc: "foo",
    baseCost: 1,
    costInc: 1,
}

export class Skill {
    /**
     * Skill name
     */
    name: string;

    /**
     * Description of the skill
     */
    desc: string;

    /**
     * Base number of skill points required to upgrade this skill
     */
    baseCost: number;

    /**
     * Amount by which the skill point cost increases (additively)
     * for each level of this skill
     */
    costInc: number;

    /**
     * Maximum level of this skill. Optional. (NO max level if this property
     * doesn't exist)
     */
    maxLvl?: number;

    /**
     * Percent multiplier granted by this skill for the player's success chance in all
     * Bladeburner actions (contracts, operations, blackops).
     */
    successChanceAll?: number;

    /**
     * Percent multiplier granted by this skill for the player's success chance
     * in all Bladeburner contracts.
     */
    successChanceContract?: number;

    /**
     * Percent multiplier granted by this skill for the player's success chance in all
     * Bladeburner operations (including blackops).
     */
    successChanceOperation?: number;

    /**
     * Percent multiplier granted by this skill for the player's success chance in all
     * Bladeburner actions that involve retirement.
     */
    successChanceKill?: number;

    /**
     * Percent multiplier granted by this skill for the player's success chance in all
     * Bladeburner actions that involve stealth.
     */
    successChanceStealth?: number;

    /**
     * Percent multiplier granted by this skill that affects the effectiveness of all
     * actions that increase synthoid population/community estimate (e.g.
     * field analysis, Investigation Op, Undercover Op, etc.)
     */
    successChanceEstimate?: number;

    /**
     * Percent multiplier granted by this skill for the amount of time it takes
     * the player to complete contracts & operations
     */
    actionTime?: number;

    /**
     * Percent multiplier granted by this skill for increasing the player's
     * effective hacking level in all Bladeburner actions
     */
    effHack?: number;

    /**
     * Percent multiplier granted by this skill for increasing the player's
     * effective strength in all Bladeburner actions
     */
    effStr?: number;

    /**
     * Percent multiplier granted by this skill for increasing the player's
     * effective defense in all Bladeburner actions
     */
    effDef?: number;

    /**
     * Percent multiplier granted by this skill for increasing the player's
     * effective dexterity in all Bladeburner actions
     */
    effDex?: number;

    /**
     * Percent multiplier granted by this skill for increasing the player's
     * effective agility in all Bladeburner actions
     */
    effAgi?: number;

    /**
     * Percent multiplier granted by this skill for increasing the player's
     * effective charisma in all Bladeburner actions
     */
    effCha?: number;

    /**
     * Percent multiplier granted by this skill for increasing the player's
     * max Bladeburner stamina
     */
    stamina?: number;

    /**
     * Percent multiplier granted by this skill for increasing the player's
     * money gain from Bladeburner contracts
     */
    money?: number;

    /**
     * Percent multiplier granted by this skill for increasing the player's
     * experience gain from all Bladeburner actions (contracts & operations)
     */
    expGain?: number;

    /**
     * Not yet implemented. Might be used in the future
     */
    weaponAbility?: number;
    gunAbility?: number;

    constructor(params: IConstructorParams=DefaultParams) {
        if (params.name) {
            this.name = params.name;
        } else {
            throw new Error("Failed to initialize Bladeburner Skill. No name was specified in ctor");
        }
        if (params.desc) {
            this.desc = params.desc;
        } else {
            throw new Error("Failed to initialize Bladeburner Skills. No desc was specified in ctor");
        }
        this.baseCost       = params.baseCost   ? params.baseCost   : 1; // Cost is in Skill Points
        this.costInc        = params.costInc    ? params.costInc    : 1; // Additive cost increase per level

        if (params.maxLvl) { this.maxLvl = params.maxLvl; }

        if (params.successChanceAll)        { this.successChanceAll         = params.successChanceAll; }
        if (params.successChanceStealth)    { this.successChanceStealth     = params.successChanceStealth; }
        if (params.successChanceKill)       { this.successChanceKill        = params.successChanceKill; }
        if (params.successChanceContract)   { this.successChanceContract    = params.successChanceContract; }
        if (params.successChanceOperation)  { this.successChanceOperation   = params.successChanceOperation; }
        if (params.successChanceEstimate)   { this.successChanceEstimate    = params.successChanceEstimate; }
        if (params.actionTime)              { this.actionTime               = params.actionTime; }
        if (params.effHack)                 { this.effHack                  = params.effHack; }
        if (params.effStr)                  { this.effStr                   = params.effStr; }
        if (params.effDef)                  { this.effDef                   = params.effDef; }
        if (params.effDex)                  { this.effDex                   = params.effDex; }
        if (params.effAgi)                  { this.effAgi                   = params.effAgi; }
        if (params.effCha)                  { this.effCha                   = params.effCha; }
        if (params.stamina)                 { this.stamina                  = params.stamina; }
        if (params.money)                   { this.money                    = params.money; }
        if (params.expGain)                 { this.expGain                  = params.expGain; }
        if (params.weaponAbility)           { this.weaponAbility            = params.weaponAbility; }
        if (params.gunAbility)              { this.gunAbility               = params.gunAbility; }
    }

    calculateCost(currentLevel: number): number {
        return Math.floor((this.baseCost + (currentLevel * this.costInc)) * BitNodeMultipliers.BladeburnerSkillCost);
    }
}
