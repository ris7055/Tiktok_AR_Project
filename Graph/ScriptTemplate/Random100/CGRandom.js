"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CGRandom = void 0;
const ScriptNodeAPI_1 = require('../Utils/ScriptNodeAPI');
class CGRandom extends ScriptNodeAPI_1.BaseNode {
    constructor() {
        super();
        this.disableDataFlow = true;
    }
    getOutput(index) {
        if (!this.inputs[0] === undefined || !this.inputs[1] === undefined) {
            return 0;
        }
        if (this.inputs[0]() === undefined || !this.inputs[1]() === undefined) {
            return 0;
        }
        const upper = Math.max(this.inputs[0](), this.inputs[1]());
        const lower = Math.min(this.inputs[0](), this.inputs[1]());
        return Number((Math.random() * Math.abs(upper - lower) + lower).toFixed(3));
    }
}
exports.CGRandom = CGRandom;
//# sourceMappingURL=CGRandom.js.map