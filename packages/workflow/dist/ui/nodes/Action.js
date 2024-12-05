"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlankNode = exports.ActionNode = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@xyflow/react");
const Provider_1 = require("../Provider");
const Handles_1 = require("./Handles");
/**
 * ActionNode represents a single action in the workflow.
 *
 * @param action - The action within the workflow that this node represents.
 * @param direction - The direction of the workflow, used to determine how handles are placed.
 */
const ActionNode = ({ action, node, direction }) => {
    const { selectedNode, availableActions } = (0, Provider_1.useProvider)();
    const engineAction = availableActions.find(a => a.kind === action.kind);
    const isSelected = (selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.type) === "action" && selectedNode.id === node.id;
    return ((0, jsx_runtime_1.jsxs)("div", { className: `wf-node wf-action-node ${isSelected ? "wf-node-selected" : ""}`, children: [(0, jsx_runtime_1.jsx)(react_1.Handle, Object.assign({}, (0, Handles_1.targetHandleProps)(direction))), (0, jsx_runtime_1.jsxs)("div", { className: "wf-node-title", children: [(0, jsx_runtime_1.jsx)("div", { className: "wf-node-icon", children: (engineAction === null || engineAction === void 0 ? void 0 : engineAction.icon) || (0, jsx_runtime_1.jsx)(DefaultIcon, {}) }), (0, jsx_runtime_1.jsx)("p", { children: action.name || (engineAction === null || engineAction === void 0 ? void 0 : engineAction.name) || action.kind })] }), (0, jsx_runtime_1.jsx)("p", { className: "wf-node-description", children: action.description || (engineAction === null || engineAction === void 0 ? void 0 : engineAction.description) || "Performs an action" }), (0, jsx_runtime_1.jsx)(Handles_1.AddHandle, Object.assign({}, (0, Handles_1.sourceHandleProps)(direction), { node: node, action: action }))] }));
};
exports.ActionNode = ActionNode;
/**
 * BlankNode is a placeholder node, used as a placeholder for users to select
 * an action after hitting the "Add Action" handle.
 *
 * BlankNodes are temporary;  the state is stored in the provider context.  As
 * soon as a click happens outside of blank node the blank node is deleted.
 */
const BlankNode = ({ direction }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: "wf-node wf-blank-node", children: (0, jsx_runtime_1.jsx)(react_1.Handle, Object.assign({}, (0, Handles_1.targetHandleProps)(direction))) }));
};
exports.BlankNode = BlankNode;
const DefaultIcon = () => ((0, jsx_runtime_1.jsx)("svg", { width: "20", height: "20", viewBox: "0 0 20 18", fill: "none", children: (0, jsx_runtime_1.jsx)("path", { fill: "#9B9B9B", d: "M12.905 10.75a3.001 3.001 0 0 1-5.81 0H3.25v-1.5h3.845a3.002 3.002 0 0 1 5.81 0h3.845v1.5h-3.845ZM10 11.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" }) }));
//# sourceMappingURL=Action.js.map