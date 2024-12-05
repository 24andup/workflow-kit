"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriggerNode = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Provider_1 = require("../Provider");
const Handles_1 = require("./Handles");
/**
 * TriggerNode represents the trigger of the workflow.
 *
 * @param trigger - The trigger within the workflow.
 * @param direction - The direction of the workflow, used to determine how handles are placed.
 */
const TriggerNode = ({ trigger, node, direction }) => {
    var _a;
    const { selectedNode, workflow } = (0, Provider_1.useProvider)();
    const isSelected = (selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.type) === "trigger";
    return ((0, jsx_runtime_1.jsxs)("div", { className: `wf-node wf-trigger-node wf-cursor-pointer ${isSelected ? "wf-node-selected" : ""}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "wf-node-title", children: [(0, jsx_runtime_1.jsx)("div", { className: "wf-node-icon", children: (0, jsx_runtime_1.jsx)(Icon, {}) }), (0, jsx_runtime_1.jsx)("p", { children: trigger === undefined ? "Select a trigger" : (_a = trigger === null || trigger === void 0 ? void 0 : trigger.event) === null || _a === void 0 ? void 0 : _a.name })] }), (0, jsx_runtime_1.jsx)("p", { className: "wf-node-description", children: (workflow === null || workflow === void 0 ? void 0 : workflow.description) || "Starts the workflow" }), trigger && (0, jsx_runtime_1.jsx)(Handles_1.AddHandle, Object.assign({}, (0, Handles_1.sourceHandleProps)(direction), { node: node }))] }));
};
exports.TriggerNode = TriggerNode;
const Icon = () => ((0, jsx_runtime_1.jsx)("svg", { width: "20", height: "20", fill: "none", children: (0, jsx_runtime_1.jsx)("path", { fill: "#9B9B9B", d: "M5.5 17.125a2.625 2.625 0 1 1 2.516-3.375h4.234v-1.5h1.5V7.932L12.068 6.25H7.75v1.5h-4.5v-4.5h4.5v1.5h4.318L14.5 2.317 17.682 5.5 15.25 7.93v4.32h1.5v4.5h-4.5v-1.5H8.016A2.626 2.626 0 0 1 5.5 17.125Zm0-3.75a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Zm9.75.375h-1.5v1.5h1.5v-1.5Zm-.75-9.31L13.44 5.5l1.06 1.06 1.06-1.06-1.06-1.06Zm-8.25.31h-1.5v1.5h1.5v-1.5Z" }) }));
//# sourceMappingURL=Trigger.js.map