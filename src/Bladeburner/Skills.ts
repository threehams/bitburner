/**
 * Map of all Bladeburner skills. Maps name -> Skill object
 */
import { Skill, IConstructorParams } from "./Skill";
import { SkillsMetadata } from "./data/SkillsMetadata";
import { IMap } from "../types";

export let Skills: IMap<Skill> = {};

function constructSkill(p: IConstructorParams) {
    Skills[p.name] = new Skill(p);
}

export function initBladeburnerSkills() {
    Skills = {};

    for (const metadata of SkillsMetadata) {
        constructSkill(metadata);
    }
}
