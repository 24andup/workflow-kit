"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputFormUI = exports.SidebarActionForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Provider_1 = require("../Provider");
const SidebarActionForm = ({ workflowAction, engineAction }) => {
    if (engineAction === undefined) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "wf-sidebar-form", children: (0, jsx_runtime_1.jsx)("div", { className: "wf-sidebar-content wf-sidebar-error", children: `Action ${workflowAction.kind} not found in provider.` }) }));
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "wf-sidebar-action", children: [(0, jsx_runtime_1.jsx)("p", { className: "wf-sidebar-action-name", children: engineAction.name }), (0, jsx_runtime_1.jsx)("p", { className: "wf-sidebar-action-description", children: engineAction.description })] }), (0, jsx_runtime_1.jsxs)("div", { className: "wf-sidebar-form", children: [(0, jsx_runtime_1.jsx)("span", { className: "wf-sidebar-configure", children: "Configure" }), (0, exports.InputFormUI)(engineAction.inputs || {})] })] }));
};
exports.SidebarActionForm = SidebarActionForm;
const InputFormUI = (inputs) => {
    // TODO: Handle different input types
    // TODO: Allow variables to be inserted into the input, based off of the event
    // or previous actions.
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: Object.entries(inputs).map(([id, input]) => ((0, jsx_runtime_1.jsxs)("label", { children: [input.type.title, (0, jsx_runtime_1.jsx)(FormUIInputRenderer, { input: input, id: id })] }, id))) }));
};
exports.InputFormUI = InputFormUI;
const FormUIInputRenderer = ({ id, input }) => {
    const { selectedNode, onChange, workflow } = (0, Provider_1.useProvider)();
    const action = selectedNode.data.action;
    action.inputs = action.inputs || {};
    const updateWorkflowAction = () => {
        const workflowCopy = Object.assign({}, workflow);
        workflowCopy.actions = workflow.actions.map((a) => a.id !== action.id
            ? a
            : Object.assign(Object.assign({}, a), { inputs: action.inputs }));
        onChange(workflowCopy);
    };
    if (input.fieldType === "textarea") {
        return ((0, jsx_runtime_1.jsx)("textarea", { defaultValue: action.inputs[id], onChange: (e) => {
                action.inputs[id] = e.target.value;
            }, onBlur: () => updateWorkflowAction() }));
    }
    return ((0, jsx_runtime_1.jsx)("input", { type: "text", defaultValue: action.inputs[id], onChange: (e) => {
            action.inputs[id] = e.target.value;
        }, onBlur: () => updateWorkflowAction() }));
};
//# sourceMappingURL=ActionForm.js.map