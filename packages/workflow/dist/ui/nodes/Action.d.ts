import { Node } from "@xyflow/react";
import { WorkflowAction } from "../../";
import { Direction } from "../Editor";
export type ActionNodeProps = {
    action: WorkflowAction;
    node: Node;
    direction: Direction;
};
/**
 * ActionNode represents a single action in the workflow.
 *
 * @param action - The action within the workflow that this node represents.
 * @param direction - The direction of the workflow, used to determine how handles are placed.
 */
export declare const ActionNode: ({ action, node, direction }: ActionNodeProps) => import("react/jsx-runtime").JSX.Element;
/**
 * BlankNode is a placeholder node, used as a placeholder for users to select
 * an action after hitting the "Add Action" handle.
 *
 * BlankNodes are temporary;  the state is stored in the provider context.  As
 * soon as a click happens outside of blank node the blank node is deleted.
 */
export declare const BlankNode: ({ direction }: {
    direction: Direction;
}) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Action.d.ts.map