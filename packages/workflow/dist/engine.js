"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Engine_options, _Engine_actionKinds, _Engine_actionMap, _ExecutionState_opts, _ExecutionState_state;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionState = exports.Engine = void 0;
const graph_1 = require("./graph");
const value_1 = require("@sinclair/typebox/value");
const interpolation_1 = require("./interpolation");
class Engine {
    constructor(options) {
        _Engine_options.set(this, void 0);
        _Engine_actionKinds.set(this, void 0);
        _Engine_actionMap.set(this, void 0);
        /**
         * run executes a new Workflow of a workflow durably, using the step tooling provided.
         *
         */
        this.run = async ({ event, step, workflow }) => {
            const { loader } = __classPrivateFieldGet(this, _Engine_options, "f");
            if (!workflow && !loader) {
                throw new Error("Cannot run workflows without a workflow instance specified.");
            }
            if (!workflow && loader) {
                // Always load the workflow within a step so that it's declarative.
                workflow = await step.run("Load workflow configuration", async () => {
                    try {
                        return await loader(event);
                    }
                    catch (e) {
                        // TODO: Is this an WorkflowNotFound error?
                    }
                });
            }
            if (!workflow) {
                throw new Error("No workflow instance specified.");
            }
            let graph = this.graph(workflow);
            // Workflows use `step.run` to manage implicit step state, orchestration, and
            // execution, storing the ouput of each action within a custom state object for
            // mapping inputs/outputs between steps by references within action metadata.
            //
            // Unlike regular Inngest step functions, workflow instances have no programming flow
            // and so we must maintain some state mapping ourselves.
            let state = new ExecutionState({
                engine: this,
                graph,
                workflow,
                event,
                step,
            });
            await state.execute();
            return state;
        };
        __classPrivateFieldSet(this, _Engine_options, options, "f");
        __classPrivateFieldSet(this, _Engine_actionKinds, new Set(), "f");
        __classPrivateFieldSet(this, _Engine_actionMap, {}, "f");
        this.actions = __classPrivateFieldGet(this, _Engine_options, "f").actions || [];
    }
    /**
     * Returns all actions added to the engine
     *
     */
    get actions() {
        return __classPrivateFieldGet(this, _Engine_actionMap, "f");
    }
    /**
     * Replaces all actions in the current engine
     *
     */
    set actions(actions) {
        __classPrivateFieldGet(this, _Engine_options, "f").actions = actions;
        __classPrivateFieldSet(this, _Engine_actionKinds, new Set(), "f");
        for (let action of __classPrivateFieldGet(this, _Engine_options, "f").actions) {
            if (__classPrivateFieldGet(this, _Engine_actionKinds, "f").has(action.kind)) {
                throw new Error(`Duplicate action kind: ${action.kind}`);
            }
            __classPrivateFieldGet(this, _Engine_actionKinds, "f").add(action.kind);
            __classPrivateFieldGet(this, _Engine_actionMap, "f")[action.kind] = action;
        }
    }
    /**
     * Returns all actions added to the engine
     *
     */
    get loader() {
        return __classPrivateFieldGet(this, _Engine_options, "f").loader;
    }
    /**
     * Replaces all actions in the current engine
     *
     */
    set loader(loader) {
        __classPrivateFieldGet(this, _Engine_options, "f").loader = loader;
    }
    /**
     * Graph returns a graph for the given workflow instance, and also ensures that the given
     * Workflow is valid and has no errors.
     *
     * It checks for cycles, disconnected vertices and edges, references are valid, and that
     * actions exist within the workflow instance.
     *
     * If the JSON is invalid, this throws an error.
     *
     */
    graph(flow) {
        var _a;
        for (let action of flow.actions) {
            // Validate that the action kind exists within the engine.
            if (!__classPrivateFieldGet(this, _Engine_actionKinds, "f").has(action.kind)) {
                throw new Error("Workflow instance references unknown action kind: " + action.kind);
            }
            // Validate that the workflow action's input types match the expected
            // types defined on the engine's action
            for (const [name, input] of Object.entries((((_a = __classPrivateFieldGet(this, _Engine_actionMap, "f")[action.kind]) === null || _a === void 0 ? void 0 : _a.inputs) || {}))) {
                const wval = (action.inputs || {})[name];
                // If this is a ref, we can't yet validate as we don't have state.
                if ((0, interpolation_1.refs)(wval).length === 0) {
                    try {
                        value_1.Value.Assert(input.type, wval);
                    }
                    catch (e) {
                        throw new Error(`Action '${action.id}' has an invalid input for '${name}': ${e.message}`);
                    }
                    continue;
                }
                // TODO: Ensure that refs are valid.
                // TODO: Attempt to grab the output type of the action this is referencing, if this
                // is an action, and validate that (recursively)
            }
        }
        const graph = (0, graph_1.newDAG)(flow);
        return graph;
    }
}
exports.Engine = Engine;
_Engine_options = new WeakMap(), _Engine_actionKinds = new WeakMap(), _Engine_actionMap = new WeakMap();
/**
 * ExecutionState iterates through a given Workflow and graph, ensuring that we call
 * each action within the graph in order, durably.
 *
 * Because each action in a workflow can reference previous action's outputs and event data, it
 * also resolves references and manages action data.
 *
 * Note that this relies on Inngest's step functionality for durability and function state
 * management.
 *
 */
class ExecutionState {
    constructor(opts, state) {
        _ExecutionState_opts.set(this, void 0);
        _ExecutionState_state.set(this, void 0);
        this.execute = async () => {
            const { event, step, graph, workflow, engine } = __classPrivateFieldGet(this, _ExecutionState_opts, "f");
            await (0, graph_1.bfs)(graph, async (action, edge) => {
                if (edge.conditional) {
                    const { type, ref, value } = edge.conditional || {};
                    // We allow "!ref($.output)" to refer to the previous action's output.
                    // Here we must grab the previous step's state for interpolation as the result.
                    const previousActionOutput = __classPrivateFieldGet(this, _ExecutionState_state, "f").get(edge.from);
                    const input = this.interpolate(ref, previousActionOutput);
                    switch (type) {
                        case "if":
                            if (!input) {
                                // This doesn't match, so we skip this edge.
                                return;
                            }
                            break;
                        case "else":
                            if (!!input) {
                                // This doesn't match, so we skip this edge.
                                return;
                            }
                            break;
                        case "match":
                            // Because object equality is what it is, we JSON stringify both
                            // values here.
                            if (JSON.stringify(input) !== JSON.stringify(value)) {
                                // This doesn't match, so we skip this edge.
                                return;
                            }
                    }
                }
                // Find the base action from the workflow class.  This includes the handler
                // to invoke.
                const base = engine.actions[action.kind];
                if (!base) {
                    throw new Error(`Unable to find workflow action for kind: ${action.kind}`);
                }
                // Invoke the action directly.
                //
                // Note: The handler should use Inngest's step API within handlers, ensuring
                // that nodes in the workflow execute once, durably.
                const workflowAction = Object.assign(Object.assign({}, action), { inputs: this.resolveInputs(action) });
                const result = await base.handler({
                    event,
                    step,
                    workflow,
                    workflowAction,
                    state: __classPrivateFieldGet(this, _ExecutionState_state, "f"),
                });
                // And set our state.  This may be a previously memoized output.
                __classPrivateFieldGet(this, _ExecutionState_state, "f").set(action.id, result);
            });
        };
        /**
         * resolveInputs itarates through the action configuration, updating any referenced
         * variables within the config.
         *
         */
        this.resolveInputs = (action) => {
            var _a;
            // For each action, check to see if it references any prior input.
            return (0, interpolation_1.resolveInputs)((_a = action.inputs) !== null && _a !== void 0 ? _a : {}, {
                state: Object.fromEntries(__classPrivateFieldGet(this, _ExecutionState_state, "f")),
                event: __classPrivateFieldGet(this, _ExecutionState_opts, "f").event
            });
        };
        this.interpolate = (value, output) => {
            return (0, interpolation_1.interpolate)(value, {
                state: Object.fromEntries(__classPrivateFieldGet(this, _ExecutionState_state, "f")),
                event: __classPrivateFieldGet(this, _ExecutionState_opts, "f").event,
                // output is an optional output from the previous step, used to
                // interpolate conditional edges. 
                output,
            });
        };
        __classPrivateFieldSet(this, _ExecutionState_opts, opts, "f");
        __classPrivateFieldSet(this, _ExecutionState_state, new Map(Object.entries(state || {})), "f");
    }
    get state() {
        return __classPrivateFieldGet(this, _ExecutionState_state, "f");
    }
}
exports.ExecutionState = ExecutionState;
_ExecutionState_opts = new WeakMap(), _ExecutionState_state = new WeakMap();
//# sourceMappingURL=engine.js.map