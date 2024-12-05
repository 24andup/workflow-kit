import React from 'react';
import { Workflow } from "../types";
export type EditorProps = {
    direction?: Direction;
    children?: React.ReactNode;
};
export type Direction = "right" | "down";
export declare const Editor: (props: EditorProps) => import("react/jsx-runtime").JSX.Element;
export type TriggerProps = {
    trigger?: any;
};
export type WorkflowProps = {
    workflow?: Workflow;
};
//# sourceMappingURL=Editor.d.ts.map