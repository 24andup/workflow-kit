import React from 'react';
import { Node } from '@xyflow/react';
import { PublicEngineAction, PublicEngineEdge, Workflow } from "../types";
import { BlankNodeType } from './nodes';
export type ProviderProps = {
    workflow: Workflow;
    trigger: any;
    availableActions: PublicEngineAction[];
    onChange: (w: Workflow) => any;
};
export type ProviderContextType = ProviderProps & {
    sidebarPosition: "right" | "left";
    setSidebarPosition: (p: "right" | "left") => void;
    selectedNode: Node<any> | undefined;
    setSelectedNode: (n: Node | undefined) => void;
    blankNode?: BlankNodeType | undefined;
    setBlankNode: (n: BlankNodeType | undefined) => void;
    appendAction: (action: PublicEngineAction, parentID: string, edge?: PublicEngineEdge) => void;
    deleteAction: (actionID: string) => void;
};
export declare const ProviderContext: React.Context<ProviderContextType | undefined>;
export declare const useOnChange: () => (w: Workflow) => void;
/**
 * Hook for accessing the workflow we're modifying
 *
 */
export declare const useWorkflow: () => Workflow | undefined;
/**
 * Hook for accessing the trigger which runs the workflow.
 *
 */
export declare const useTrigger: () => any;
/**
 * Hook for accessing the available actions we can use within
 * the workflow.
 *
 */
export declare const useAvailableActions: () => PublicEngineAction[];
/**
 * Hook for accessing the position of the sidebar.  Only for internal
 * use.
 *
 * @returns the position of the sidebar.
 */
export declare const useSidebarPosition: () => "right" | "left";
export declare const useProvider: () => ProviderContextType;
export declare const Provider: (props: ProviderProps & {
    children: React.ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Provider.d.ts.map