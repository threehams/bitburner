/**
 * Metadata for initializing Bladeburner Skill objects
 */
import { SkillNames } from "../SkillNames";
import { IConstructorParams } from "../Skill";

export const SkillsMetadata: IConstructorParams[] = [
    {
        name:SkillNames.BladesIntuition,
        desc:"Each level of this skill increases your success chance " +
             "for all Contracts, Operations, and BlackOps by 3%",
        baseCost: 3, costInc: 2.1,
        successChanceAll:3
    }, {
        name:SkillNames.Cloak,
        desc:"Each level of this skill increases your " +
             "success chance in stealth-related Contracts, Operations, and BlackOps by 5.5%",
        baseCost: 2, costInc: 1.1,
        successChanceStealth:5.5
    }, {
        name:SkillNames.ShortCircuit,
        desc:"Each level of this skill increases your success chance " +
             "in Contracts, Operations, and BlackOps that involve retirement by 5.5%",
        baseCost: 2, costInc: 2.1,
        successChanceKill:5.5
    }, {
        name:SkillNames.DigitalObserver,
        desc:"Each level of this skill increases your success chance in " +
             "all Operations and BlackOps by 4%",
        baseCost: 2, costInc: 2.1,
        successChanceOperation:4
    }, {
        name:SkillNames.Tracer,
        desc:"Each level of this skill increases your success chance in " +
             "all Contracts by 4%",
        baseCost: 2, costInc: 2.1,
        successChanceContract:4
    }, {
        name:SkillNames.Overclock,
        desc:"Each level of this skill decreases the time it takes " +
             "to attempt a Contract, Operation, and BlackOp by 1% (Max Level: 90)",
        baseCost: 3, costInc: 1.4, maxLvl: 90,
        actionTime:1
    }, {
        name: SkillNames.Reaper,
        desc: "Each level of this skill increases your effective combat stats for Bladeburner actions by 2%",
        baseCost: 2, costInc: 2.1,
        effStr: 2, effDef: 2, effDex: 2, effAgi: 2
    }, {
        name:SkillNames.EvasiveSystem,
        desc:"Each level of this skill increases your effective " +
             "dexterity and agility for Bladeburner actions by 3%",
        baseCost: 2, costInc: 2.1,
        effDex: 3, effAgi: 3
    }, {
        name:SkillNames.Tact,
        desc:"Each level of this skill increases your effective charisma " +
             "for Bladeburner actions by 4%",
        baseCost: 2, costInc: 2.1,
        effCha: 4,
    }, {
        name:SkillNames.Datamancer,
        desc:"Each level of this skill increases your effectiveness in " +
             "synthoid population analysis and investigation by 5%. " +
             "This affects all actions that can potentially increase " +
            "the accuracy of your synthoid population/community estimates.",
        baseCost:3, costInc:1,
        successChanceEstimate:5
    }, {
        name:SkillNames.CybersEdge,
        desc:"Each level of this skill increases your max stamina by 2%",
        baseCost:1, costInc:3,
        stamina:2
    }, {
        name: SkillNames.HandsOfMidas,
        desc: "Each level of this skill increases the amount of money you receive from Contracts by 10%",
        baseCost: 2, costInc: 2.5,
        money: 10,
    }, {
        name: SkillNames.Hyperdrive,
        desc: "Each level of this skill increases the experience earned from Contracts, Operations, and BlackOps by 10%",
        baseCost: 1, costInc: 2.5,
        expGain: 10,
    },
]
