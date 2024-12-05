"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = require("./engine");
const graph_1 = require("./graph");
const typebox_1 = require("@sinclair/typebox");
const builtin_1 = require("./builtin");
test("execution", async () => {
    const engine = new engine_1.Engine({
        actions: [
            ...Object.values(builtin_1.builtinActions),
            {
                kind: "multiply",
                name: "Multiply some numbers",
                handler: async (args) => {
                    var _a, _b, _c, _d;
                    return (((_b = (_a = args.workflowAction) === null || _a === void 0 ? void 0 : _a.inputs) === null || _b === void 0 ? void 0 : _b.a) || 0) * (((_d = (_c = args.workflowAction) === null || _c === void 0 ? void 0 : _c.inputs) === null || _d === void 0 ? void 0 : _d.b) || 0);
                },
                inputs: {
                    a: {
                        type: typebox_1.Type.Number({
                            description: "Numerator",
                        }),
                    },
                    b: {
                        type: typebox_1.Type.Number({
                            description: "Denominator",
                        }),
                    },
                },
                outputs: typebox_1.Type.Number(),
            }
        ]
    });
    const workflow = {
        actions: [
            {
                id: "stepA",
                kind: "multiply",
                name: "Multiply some numbers",
                inputs: {
                    a: 7,
                    b: 6,
                },
            },
            // Only continue if the result is 7*6
            {
                id: "if-a",
                kind: "builtin:if",
                name: "If A is 42",
                inputs: {
                    condition: {
                        "==": [
                            "!ref($.state.stepA)",
                            7 * 6,
                        ],
                    },
                },
            },
            {
                id: "stepB-true",
                kind: "multiply",
                name: "multiply result of A",
                inputs: {
                    a: "!ref($.state.stepA)",
                    b: "!ref($.event.data.age)",
                },
            },
            {
                id: "stepB-false",
                kind: "multiply",
                name: "Should never run.",
                inputs: {
                    a: "!ref($.state.stepA)",
                    b: "!ref($.event.data.age)",
                },
            },
            // Finally, run a conditional to match on numeric values.
            {
                id: "stepC-true",
                kind: "multiply",
                name: "Multiply 2 and 9",
                inputs: {
                    a: 2,
                    b: 9,
                },
            },
            {
                id: "stepC-false",
                kind: "multiply",
                name: "Never runs, as equality is false",
                inputs: {
                    a: 2,
                    b: 9,
                },
            },
        ],
        edges: [
            { from: graph_1.SourceNodeID, to: "stepA" },
            { from: "stepA", to: "if-a" },
            // Check "true" branches of the builtin:if action
            { from: "if-a", to: "stepB-true", conditional: { type: "if", ref: "!ref($.output.result)" } },
            // if-a should evaluate to true so this never runs.
            { from: "if-a", to: "stepB-false", conditional: { type: "else", ref: "!ref($.output.result)" } },
            // Check that "match" works with non-string values.
            { from: "stepB-true", to: "stepC-true", conditional: { type: "match", ref: "!ref($.output)", value: 42 * 99 } },
            // This should never run, as the value is not equal (type equality).
            { from: "stepB-true", to: "stepC-false", conditional: { type: "match", ref: "!ref($.output)", value: (42 * 99).toString() } },
        ],
    };
    const es = await engine.run({
        workflow,
        event: {
            name: "auth/user.created",
            data: {
                name: "test user",
                age: 99,
            }
        },
        step: {},
    });
    expect(es.state.get("stepA")).toBe(42);
    expect(es.state.get("stepB-true")).toBe(42 * 99);
    expect(es.state.get("stepC-true")).toBe(2 * 9);
    // Shouldn't run, as the if-a step is true
    expect(es.state.get("stepB-false")).toBe(undefined);
    expect(es.state.get("stepC-false")).toBe(undefined);
});
//# sourceMappingURL=engine.execution.test.js.map