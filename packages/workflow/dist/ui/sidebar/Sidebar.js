"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sidebar = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Provider_1 = require("../Provider");
const WorfklowForm_1 = require("./WorfklowForm");
const Footer_1 = require("./Footer");
const ActionList_1 = require("./ActionList");
const ActionForm_1 = require("./ActionForm");
const Header_1 = require("./Header");
const Sidebar = (props) => {
    const { setSidebarPosition } = (0, Provider_1.useProvider)();
    // Set this within context so the parent editor can adjust our
    // flex layouts correctly.
    (0, react_1.useEffect)(() => {
        setSidebarPosition(props.position === "left" ? "left" : "right");
    }, [props.position]);
    let content = props.children || useSidebarContent();
    return ((0, jsx_runtime_1.jsx)("div", { className: "wf-sidebar", children: content }));
};
exports.Sidebar = Sidebar;
const useSidebarContent = () => {
    const { trigger, selectedNode, availableActions } = (0, Provider_1.useProvider)();
    if (trigger === undefined) {
        // TODO (tonyhb): Allow users to define how triggers are selected,
        // including trigger loading passed in to the Provider.
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "wf-sidebar-content", children: "To get started, select a trigger." }), (0, jsx_runtime_1.jsx)(Footer_1.SidebarFooter, {})] }));
    }
    if (selectedNode === undefined) {
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(WorfklowForm_1.SidebarWorkflowForm, {}), (0, jsx_runtime_1.jsx)(Footer_1.SidebarFooter, {})] }));
    }
    switch (selectedNode.type) {
        case "action": {
            const workflowAction = selectedNode.data.action;
            const engineAction = availableActions.find((action) => action.kind === workflowAction.kind);
            return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Header_1.SidebarHeader, {}), (0, jsx_runtime_1.jsx)(ActionForm_1.SidebarActionForm, { workflowAction: workflowAction, engineAction: engineAction }, `node-${selectedNode.id}`), (0, jsx_runtime_1.jsx)(Footer_1.SidebarFooter, {})] }));
        }
        case "blank": {
            return ((0, jsx_runtime_1.jsx)(ActionList_1.ActionList, { actions: availableActions }));
        }
    }
    return ((0, jsx_runtime_1.jsx)("div", { children: selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.type }));
};
//# sourceMappingURL=Sidebar.js.map