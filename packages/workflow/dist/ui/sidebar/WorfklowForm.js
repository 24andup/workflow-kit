"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SidebarWorkflowForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Provider_1 = require("../Provider");
/**
 * The form for editing a workflow's name and description.
 */
const SidebarWorkflowForm = () => {
    const { workflow, onChange } = (0, Provider_1.useProvider)();
    return ((0, jsx_runtime_1.jsxs)("div", { className: "wf-sidebar-form", children: [(0, jsx_runtime_1.jsxs)("label", { children: ["Workflow name", (0, jsx_runtime_1.jsx)("input", { type: "text", defaultValue: workflow === null || workflow === void 0 ? void 0 : workflow.name, placeholder: "Untitled workflow", onBlur: (e) => {
                            onChange(Object.assign(Object.assign({}, workflow), { name: e.target.value }));
                        } })] }), (0, jsx_runtime_1.jsxs)("label", { children: ["Description", (0, jsx_runtime_1.jsx)("textarea", { placeholder: "Add a short description...", defaultValue: workflow === null || workflow === void 0 ? void 0 : workflow.description, rows: 4, onBlur: (e) => {
                            onChange(Object.assign(Object.assign({}, workflow), { description: e.target.value }));
                        } })] })] }));
};
exports.SidebarWorkflowForm = SidebarWorkflowForm;
//# sourceMappingURL=WorfklowForm.js.map