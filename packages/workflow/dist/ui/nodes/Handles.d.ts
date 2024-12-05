import { HandleProps } from "@xyflow/react";
import { Node } from "@xyflow/react";
import { Direction } from "../Editor";
import { PublicEngineEdge, WorkflowAction } from "../../types";
export type BlankNodeType = Node<{
    parent: Node;
    /**
     * Edge stores the edge information if this was a predefined edge from eg. an
     * if block.
     */
    edge?: PublicEngineEdge;
}>;
export declare const NewBlankNode: (parent: Node, edge?: PublicEngineEdge) => BlankNodeType;
export declare const AddHandle: (props: HandleProps & {
    node: Node;
    action?: WorkflowAction;
}) => import("react/jsx-runtime").JSX.Element | null;
export declare const targetHandleProps: (direction: Direction) => HandleProps;
export declare const sourceHandleProps: (direction: Direction) => HandleProps;
//# sourceMappingURL=Handles.d.ts.map