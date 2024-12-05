import { type RunArgs, type EngineOptions, type EngineAction, type WorkflowAction, type Loader, type Workflow, DAG, TriggerEvent } from "./types";
export declare class Engine {
    #private;
    constructor(options: EngineOptions);
    /**
     * Returns all actions added to the engine
     *
     */
    get actions(): Record<string, EngineAction>;
    /**
     * Replaces all actions in the current engine
     *
     */
    set actions(actions: Array<EngineAction>);
    /**
     * Returns all actions added to the engine
     *
     */
    get loader(): Loader | undefined;
    /**
     * Replaces all actions in the current engine
     *
     */
    set loader(loader: Loader);
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
    graph(flow: Workflow): DAG;
    /**
     * run executes a new Workflow of a workflow durably, using the step tooling provided.
     *
     */
    run: ({ event, step, workflow }: RunArgs) => Promise<ExecutionState>;
}
export interface ExecutionOpts {
    engine: Engine;
    graph: DAG;
    workflow: Workflow;
    event: TriggerEvent;
    step: any;
}
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
export declare class ExecutionState {
    #private;
    constructor(opts: ExecutionOpts, state?: Record<string, any>);
    get state(): Map<string, any>;
    execute: () => Promise<void>;
    /**
     * resolveInputs itarates through the action configuration, updating any referenced
     * variables within the config.
     *
     */
    resolveInputs: (action: WorkflowAction) => Record<string, any>;
    interpolate: (value: any, output?: any) => any;
}
//# sourceMappingURL=engine.d.ts.map