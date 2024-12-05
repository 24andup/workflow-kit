"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provider = exports.useProvider = exports.useSidebarPosition = exports.useAvailableActions = exports.useTrigger = exports.useWorkflow = exports.useOnChange = exports.ProviderContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const layout_1 = require("./layout");
exports.ProviderContext = react_1.default.createContext(undefined);
const useOnChange = () => {
    var _a;
    const ctx = (0, react_1.useContext)(exports.ProviderContext);
    return (_a = ctx === null || ctx === void 0 ? void 0 : ctx.onChange) !== null && _a !== void 0 ? _a : (() => { });
};
exports.useOnChange = useOnChange;
/**
 * Hook for accessing the workflow we're modifying
 *
 */
const useWorkflow = () => {
    const ctx = (0, react_1.useContext)(exports.ProviderContext);
    return ctx === null || ctx === void 0 ? void 0 : ctx.workflow;
};
exports.useWorkflow = useWorkflow;
/**
 * Hook for accessing the trigger which runs the workflow.
 *
 */
const useTrigger = () => {
    const ctx = (0, react_1.useContext)(exports.ProviderContext);
    return ctx === null || ctx === void 0 ? void 0 : ctx.trigger;
};
exports.useTrigger = useTrigger;
/**
 * Hook for accessing the available actions we can use within
 * the workflow.
 *
 */
const useAvailableActions = () => {
    var _a;
    const ctx = (0, react_1.useContext)(exports.ProviderContext);
    return (_a = ctx === null || ctx === void 0 ? void 0 : ctx.availableActions) !== null && _a !== void 0 ? _a : [];
};
exports.useAvailableActions = useAvailableActions;
/**
 * Hook for accessing the position of the sidebar.  Only for internal
 * use.
 *
 * @returns the position of the sidebar.
 */
const useSidebarPosition = () => {
    var _a;
    const ctx = (0, react_1.useContext)(exports.ProviderContext);
    return (_a = ctx === null || ctx === void 0 ? void 0 : ctx.sidebarPosition) !== null && _a !== void 0 ? _a : "right";
};
exports.useSidebarPosition = useSidebarPosition;
const useProvider = () => {
    const ctx = (0, react_1.useContext)(exports.ProviderContext);
    if (!ctx) {
        throw new Error("useProvider must be used within a Provider");
    }
    return ctx;
};
exports.useProvider = useProvider;
const Provider = (props) => {
    const { children, workflow, trigger, onChange, availableActions } = props;
    const [sidebarPosition, setSidebarPosition] = (0, react_1.useState)("right");
    const [selectedNode, setSelectedNode] = (0, react_1.useState)(undefined);
    const [blankNode, setBlankNode] = (0, react_1.useState)(undefined);
    const appendAction = (action, parentID, edge) => {
        var _a, _b, _c, _d;
        const id = (((_b = (_a = workflow === null || workflow === void 0 ? void 0 : workflow.actions) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) + 1).toString();
        const workflowCopy = Object.assign(Object.assign({}, workflow), { actions: ((_c = workflow === null || workflow === void 0 ? void 0 : workflow.actions) !== null && _c !== void 0 ? _c : []).slice(), edges: ((_d = workflow === null || workflow === void 0 ? void 0 : workflow.edges) !== null && _d !== void 0 ? _d : []).slice() });
        workflowCopy.actions.push({
            id,
            kind: action.kind,
            name: action.name,
        });
        workflowCopy.edges.push(Object.assign(Object.assign({}, (edge || {})), { from: parentID, to: id }));
        onChange(workflowCopy);
        setBlankNode(undefined);
        // Parse the workflow and find the new node for selection.
        const parsed = (0, layout_1.parseWorkflow)({ workflow: workflowCopy, trigger });
        const newNode = parsed.nodes.find((n) => n.id === id);
        if (newNode) {
            setSelectedNode(newNode);
        }
    };
    const deleteAction = (actionID) => {
        if (!workflow)
            return;
        const workflowCopy = Object.assign(Object.assign({}, workflow), { actions: workflow.actions.filter(action => action.id !== actionID), edges: workflow.edges.slice() });
        // Find the parent edge and remove it
        const parentEdgeIndex = workflowCopy.edges.findIndex(edge => edge.to === actionID);
        const parentEdge = workflowCopy.edges[parentEdgeIndex];
        if (!parentEdge) {
            return;
        }
        workflowCopy.edges.splice(parentEdgeIndex, 1);
        // Find child edges and update them
        const childEdges = workflowCopy.edges.filter(edge => edge.from === actionID);
        childEdges.forEach(childEdge => {
            const updatedChildEdge = Object.assign(Object.assign({}, childEdge), { from: parentEdge.from });
            const index = workflowCopy.edges.findIndex(edge => edge.to === childEdge.to && edge.from === actionID);
            workflowCopy.edges[index] = updatedChildEdge;
        });
        onChange(workflowCopy);
    };
    // TODO: Add customizable React components here to the Provider
    return ((0, jsx_runtime_1.jsx)(exports.ProviderContext.Provider, { value: {
            workflow,
            trigger,
            onChange,
            availableActions,
            sidebarPosition,
            setSidebarPosition,
            selectedNode,
            setSelectedNode,
            blankNode,
            setBlankNode,
            appendAction,
            deleteAction,
        }, children: children }));
};
exports.Provider = Provider;
//# sourceMappingURL=Provider.js.map