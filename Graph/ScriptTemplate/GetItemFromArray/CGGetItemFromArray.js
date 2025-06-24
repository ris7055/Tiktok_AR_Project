"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CGGetItemFromArray = void 0;
const ScriptNodeAPI_1 = require('../Utils/ScriptNodeAPI');
class CGGetItemFromArray extends ScriptNodeAPI_1.BaseNode {
    constructor() {
        super();
    }
    clamp(value, min, max) {
        return Math.min(max, Math.max(value, min));
    }
    getOutput() {
        var _a;
        const idx = this.inputs[0]();
        const array = this.inputs[1]();
        if (array === null || array === undefined || idx === null || idx === undefined) {
            return;
        }
        const len = array.length;
        const itemIndex = this.clamp(Math.floor(idx), 0, len - 1);
        if (array[itemIndex] === null || array[itemIndex] === undefined) {
            return (0, ScriptNodeAPI_1.getDefaultValue)((_a = this.valueType) !== null && _a !== void 0 ? _a : '');
        }
        return array[itemIndex];
    }
}
exports.CGGetItemFromArray = CGGetItemFromArray;
//# sourceMappingURL=CGGetItemFromArray.js.map