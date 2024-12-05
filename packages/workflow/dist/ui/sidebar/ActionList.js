"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionListItem = exports.ActionList = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Provider_1 = require("../Provider");
const ActionList = ({ actions }) => {
    const { workflow, onChange, blankNode, setBlankNode, appendAction } = (0, Provider_1.useProvider)();
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "wf-sidebar-content", children: "Select an action" }), (0, jsx_runtime_1.jsx)("div", { className: "wf-sidebar-content", children: actions.map((action) => ((0, jsx_runtime_1.jsx)(exports.ActionListItem, { action: action, onClick: () => {
                        if (blankNode === undefined) {
                            return;
                        }
                        appendAction(action, blankNode === null || blankNode === void 0 ? void 0 : blankNode.data.parent.id, blankNode === null || blankNode === void 0 ? void 0 : blankNode.data.edge);
                    } }, action.kind))) })] }));
};
exports.ActionList = ActionList;
const ActionListItem = ({ action, onClick }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: "wf-sidebar-action-list-item", onClick: onClick, children: action.name }));
};
exports.ActionListItem = ActionListItem;
//# sourceMappingURL=ActionList.js.map