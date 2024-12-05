import { TriggerProps, Direction } from "../Editor";
import { Node } from "@xyflow/react";
export type TriggerNodeProps = TriggerProps & {
    direction: Direction;
    node: Node;
};
/**
 * TriggerNode represents the trigger of the workflow.
 *
 * @param trigger - The trigger within the workflow.
 * @param direction - The direction of the workflow, used to determine how handles are placed.
 */
export declare const TriggerNode: ({ trigger, node, direction }: TriggerNodeProps) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Trigger.d.ts.map