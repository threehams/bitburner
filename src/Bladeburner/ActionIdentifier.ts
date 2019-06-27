/**
 * Identifier for a Bladeburner action. Defines both the type and name of the
 * action
 */
import { ActionTypes } from "./data/ActionTypes";
import { Generic_fromJSON, Generic_toJSON, Reviver } from "../../utils/JSONReviver";

interface IConstructorParams {
    name: string;
    type: ActionTypes;
}

const DefaultParams = {
    name: "",
    type: ActionTypes.Idle,
}

export class ActionIdentifier {
    /**
     * Initiatizes a ActionIdentifier object from a JSON save state.
     */
    static fromJSON(value: any): ActionIdentifier {
        return Generic_fromJSON(ActionIdentifier, value.data);
    }

    /**
     * Name of action
     */
    name: string;

    /**
     * Type of action
     */
    type: ActionTypes;

    constructor(params: IConstructorParams=DefaultParams) {
        this.name = params.name;
        this.type = params.type;
    }

    /**
     * Serialize the current object to a JSON save state.
     */
    toJSON(): any {
        return Generic_toJSON("ActionIdentifier", this);
    }
}

Reviver.constructors.ActionIdentifier = ActionIdentifier;
