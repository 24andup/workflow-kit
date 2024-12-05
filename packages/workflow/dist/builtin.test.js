"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builtin_1 = require("./builtin");
const interpolation_1 = require("./interpolation");
describe("builtin:if", () => {
    // This tests the handler logic of the builtin:if action.
    const action = builtin_1.builtinActions["builtin:if"];
    if (!action) {
        throw new Error("builtin:if action not found");
    }
    it("evaluates simple conditions without refs", async () => {
        const workflowAction = {
            id: "1",
            kind: "builtin:if",
            inputs: {
                condition: { "==": [1, 1] },
            },
        };
        let result = await action.handler(handlerInput(workflowAction));
        expect(result).toEqual({ result: true });
        workflowAction.inputs = { condition: { "==": [2, 1] } };
        result = await action.handler(handlerInput(workflowAction));
        expect(result).toEqual({ result: false });
    });
    it("evaluates complex conditions with refs", async () => {
        const state = new Map(Object.entries({ action_a: 1.123 }));
        const event = { data: { name: "jimothy" } };
        const workflowAction = {
            id: "1",
            kind: "builtin:if",
            inputs: (0, interpolation_1.resolveInputs)({
                condition: {
                    and: [
                        { "==": ["!ref($.state.action_a)", 1.123] },
                        { "==": ["!ref($.event.data.name)", "jimothy"] },
                    ],
                },
            }, { state: Object.fromEntries(state), event }),
        };
        let result = await action.handler({
            workflowAction,
            event,
            state,
            step: {},
            workflow: {
                actions: [workflowAction],
                edges: [],
            },
        });
        expect(result).toEqual({ result: true });
    });
    const handlerInput = (workflowAction) => {
        return {
            workflowAction,
            event: {
                data: {
                    age: 82.1,
                    likes: ["a"],
                },
            },
            step: {},
            workflow: {
                actions: [workflowAction],
                edges: [],
            },
            state: new Map(),
        };
    };
});
//# sourceMappingURL=builtin.test.js.map