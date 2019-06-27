/**
 * Map of all Bladeburner skills. Maps name -> Skill object
 */
import { Skill, IConstructorParams } from "./Skill";
import { SkillsMetadata } from "./data/SkillsMetadata";
import { IMap } from "../types";

export const Skills: IMap<Skill> = {};

function constructSkill(p: IConstructorParams) {
    Skills[p.name] = new Skill(p);
}

export function initBladeburnerSkills() {
    for (const metadata of SkillsMetadata) {
        constructSkill(metadata);
    }
}
