import { Node, Edge, Rect } from '@xyflow/react';
import { TriggerProps, WorkflowProps, type Direction } from './Editor';
type LayoutArgs = {
    nodes: Node[];
    edges: Edge[];
    width: number;
    height: number;
    direction: Direction;
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    nodesInitialized: boolean;
    defaultNodeMeasure: {
        width: number;
        height: number;
    } | undefined;
};
export declare const useLayout: (args: LayoutArgs) => Rect;
export declare const getLayoutedElements: (nodes: Node[], edges: Edge[], direction: Direction) => {
    nodes: Node[];
    edges: Edge[];
    rect: Rect;
};
type parseWorkflowProps = WorkflowProps & TriggerProps & {
    blankNodeParent?: Node;
};
export declare const parseWorkflow: ({ workflow, trigger, blankNodeParent }: parseWorkflowProps) => {
    nodes: Node[];
    edges: Edge[];
};
export {};
//# sourceMappingURL=layout.d.ts.map