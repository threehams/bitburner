/**
 * Represents a City in the Bladeburner mechanic
 */
import { MathRandomRef } from "../utils/MathRandomRef";

import { Generic_fromJSON, Generic_toJSON, Reviver } from "../../utils/JSONReviver";

import { addOffset } from "../../utils/helpers/addOffset";
import { getRandomInt } from "../../utils/helpers/getRandomInt";

export const CityNames = ["Aevum", "Chongqing", "Sector-12", "New Tokyo", "Ishima", "Volhaven"];
export const PopulationThreshold = 1e9; // Population which determines baseline success rate

interface IConstructorParams {
    comms?: number;
    name?: string;
    pop?: number;
}

interface IChangePopulationByCountParams {
    estChange?: number;
    estOffset?: number;
}

interface IChangePopulationByPercentageParams {
    changeEstEqually?: boolean;
    nonZero?: boolean;
}

export class City {
    /**
     * Initiatizes a City object from a JSON save state.
     */
    static fromJSON(value: any): City {
        return Generic_fromJSON(City, value.data);
    }

    /**
     * City's "chaos" level. Represents tensions between humans and Synthoids.
     * Negatively affects success rates
     */
    chaos: number = 0;

    

    /**
     * Number of Synthoid communities in this city
     */
    comms: number = getRandomInt(5, 150);

    /**
     * Player's estimate of how many Synthoid communities there are in this city
     */
    commsEst: number = this.comms + getRandomInt(-5, 5);

    /**
     * City Name
     */
    name: string = CityNames[2];

    /**
     * City's actual population
     */
    pop: number = getRandomInt(PopulationThreshold, 1.5 * PopulationThreshold);

    /**
     * Player's estimate of this city's population
     */
    popEst: number = this.pop * (MathRandomRef() + 0.5);

    constructor(params: IConstructorParams = {}) {
        if (params.name != null && typeof params.name === "string") {
            this.name = params.name;
        }

        if (params.pop != null && typeof params.pop === "number") {
            this.pop = params.pop;
            this.popEst = this.pop * (MathRandomRef + 0.5);
        }

        if (params.comms != null && typeof params.comms === "number") {
            this.comms = params.comms;
            this.commsEst = this.comms + getRandomInt(-5, 5);
            if (this.commsEst < 0) { this.commsEst = 0; }
        }
    }

    /**
     * Improves the player's population estimate for this city ADDITIVELY.
     * @param n - Number by which to improve the player's population estimate
     */
    improvePopulationEstimateByCount(n: number): void {
        if (typeof n !== "number" || isNaN(n)) {
            throw new Error("NaN passeed into City.improvePopulationEstimateByCount()");
        }

        if (this.popEst < this.pop) {
            this.popEst += n;
            if (this.popEst > this.pop) {this.popEst = this.pop;}
        } else if (this.popEst > this.pop) {
            this.popEst -= n;
            if (this.popEst < this.pop) {this.popEst = this.pop;}
        }
    }

    /**
     * Improves the player's population estimate for this city MULTIPLICATIVELY.
     * @param p - Percentage by which to improve the player's population estimate.
     *            Note this is the percentage, NOT the multiplier. e.g. pass in p = 5 for 5%
     * @param skillMult - Improved effectiveness from Bladeburner skills
     */
    improvePopulationEstimateByPercentage(p: number, skillMult: number=1): void {
        const pMulted = p * skillMult;
        if (typeof pMulted !== "number" || isNaN(pMulted)) {
            throw new Error("NaN passed into City.improvePopulationEstimateByPercentage()");
        }

        if (this.popEst < this.pop) {
            ++this.popEst; // In case estimate is 0
            this.popEst *= (1 + (pMulted / 100));
            if (this.popEst > this.pop) {this.popEst = this.pop;}
        } else if (this.popEst > this.pop) {
            this.popEst *= (1 - (pMulted / 100));
            if (this.popEst < this.pop) {this.popEst = this.pop;}
        }
    }

    /**
     * Improves the player's estimate of this city's synthoid communities ADDITIVELY.
     * @param n - Number by which to improve the player's synthoid community estimate
     */
    improveCommunityEstimate(n: number=1) {
        if (typeof n !== "number" || isNaN(n)) {
            throw new Error("NaN passed into City.improveCommunityEstimate()");
        }

        if (this.commsEst < this.comms) {
            this.commsEst += n;
            if (this.commsEst > this.comms) {this.commsEst = this.comms;}
        } else if (this.commsEst > this.comms) {
            this.commsEst -= n;
            if (this.commsEst < this.comms) {this.commsEst = this.comms;}
        }
    }

    /**
     * Change this city's population ADDITVELY.
     * @param n - Amount by which to change this city's population. Additive. Use
     *            negative numbers to reduce population
     * @param params - Optional configuration:
     *                  estChange(int): How much the estimate should change by (additive)
     *                  estOffset(int): Add offset to estimate (offset by percentage)
     */
    changePopulationByCount(n: number, params: IChangePopulationByCountParams={}) {
        if (typeof n !== "number" || isNaN(n)) {
            throw new Error("NaN passed into City.changePopulationByCount()");
        }
        this.pop += n;

        if (params.estChange && !isNaN(params.estChange)) {
            this.popEst += params.estChange;
        }

        if (params.estOffset) {
            this.popEst = addOffset(this.popEst, params.estOffset);
        }

        this.popEst = Math.max(this.popEst, 0);
    }

    /**
     * Change this city's population MULTIPLICATIVELY
     * @param p - Percentage by which to change this city's population.
     * @param params - Optional configuration:
     *                  changeEstEqually(bool) - Change the pop est by an equal amount
     *                  nonZero(bool) - Set to true to ensure that population always changed by at least 1
     * @returns Amount by which population changed
     */
    changePopulationByPercentage(p: number, params: IChangePopulationByPercentageParams={}): number | null {
        if (typeof p !== "number" || isNaN(p)) {
            throw new Error("NaN passed into City.changePopulationByPercentage()");
        }
        if (p === 0) { return 0; }

        let change = Math.round(this.pop * (p / 100));

        // Population always changes by at least 1
        if (params.nonZero && change === 0) {
            p > 0 ? change = 1 : change = -1;
        }

        this.pop += change;
        if (params.changeEstEqually) {
            this.popEst += change;
            if (this.popEst < 0) {this.popEst = 0;}
        }

        return change;
    }

    /**
     * Change this city's chaos ADDITVELY.
     * @param n - Amount by which to change cause. Use negative numbers to reduce chaos
     */
    changeChaosByCount(n: number) {
        if (typeof n !== "number" || isNaN(n)) {
            throw new Error("NaN passed into City.changeChaosByCount()");
        }
        if (n === 0) { return; }

        this.chaos += n;
        if (this.chaos < 0) { this.chaos = 0; }
    }

    /**
     * Change this city's chaos MULTIPLICATIVELY
     * @param p - Percentage by which to change this city's population. This is the
     *            percent, not the multiplier (e.g. pass in p = 5 for 5%)
     */
    changeChaosByPercentage(p: number) {
        if (typeof p !== "number" || isNaN(p)) {
            throw new Error("NaN passed into City.chaosChaosByPercentage()");
        }
        if (p === 0) { return; }

        const change = this.chaos * (p / 100);
        this.chaos += change;
        if (this.chaos < 0) { this.chaos = 0; }
    }

    /**
     * Serialize the current object to a JSON save state.
     */
    toJSON(): any {
        return Generic_toJSON("City", this);
    }
}

Reviver.constructors.City = City;
