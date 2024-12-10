"use strict";
// TODO: Define builtin nodes, like if statements.
Object.defineProperty(exports, "__esModule", { value: true });
exports.builtinActions = void 0;
const typebox_1 = require("@sinclair/typebox");
const json_logic_js_1 = require("json-logic-js");
exports.builtinActions = {
    "builtin:if": {
        kind: "builtin:if",
        name: "If",
        description: "If / else branch",
        handler: async ({ workflowAction }) => {
            var _a;
            if (!!!((_a = workflowAction.inputs) === null || _a === void 0 ? void 0 : _a.condition)) {
                // Always true.
                return { result: true };
            }
            const result = (0, json_logic_js_1.apply)(workflowAction.inputs.condition);
            return { result };
        },
        inputs: {
            condition: {
                type: typebox_1.Type.Object({}, {
                    title: "Condition",
                    description: "Condition to evaluate",
                    examples: [
                        // NOTE:  Vars aren't necessary, as actions are already interpolated.
                        { "==": ["!ref($.event.data.likes)", "a"] },
                        {
                            "and": [
                                { "==": ["!ref($.event.data.likes)", 1.123] }, // NOTE: 1.123 is a float, not a string.  Interpolation handles this.
                                { "==": ["!ref($.event.data.likes)", "b"] },
                            ]
                        },
                    ],
                }),
            },
        },
        outputs: {
            result: {
                type: typebox_1.Type.Boolean({
                    title: "Result",
                    description: "Result of the condition",
                }),
            },
        },
        edges: {
            allowAdd: false,
            edges: [
                { name: "True", conditional: { type: "if", ref: "!ref($.output.result)" } },
                { name: "False", conditional: { type: "else", ref: "!ref($.output.result)" } },
            ]
        },
    }
};
//# sourceMappingURL=builtin.js.map