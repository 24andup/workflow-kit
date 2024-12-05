import { WorkflowAction, type Workflow, type WorkflowEdge, type DAG } from "./types";
export declare const SourceNodeID = "$source";
export declare const newDAG: (flow: Workflow) => DAG;
export declare const bfs: (graph: DAG, cb: (node: WorkflowAction, edge: WorkflowEdge) => Promise<any>) => Promise<any>;
//# sourceMappingURL=graph.d.ts.map