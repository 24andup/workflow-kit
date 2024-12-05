"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SidebarHeader = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Provider_1 = require("../Provider");
const SidebarHeader = () => {
    const { selectedNode, setSelectedNode, deleteAction } = (0, Provider_1.useProvider)();
    return ((0, jsx_runtime_1.jsxs)("div", { className: "wf-sidebar-header", children: [(0, jsx_runtime_1.jsx)("div", { children: (selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.type) === "action" && ((0, jsx_runtime_1.jsx)("button", { className: "wf-cursor-pointer wf-sidebar-back", onClick: () => setSelectedNode(undefined), children: (0, jsx_runtime_1.jsx)(BackArrow, {}) })) }), (0, jsx_runtime_1.jsx)("div", { children: (selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.type) === "action" && ((0, jsx_runtime_1.jsx)("button", { className: "wf-cursor-pointer wf-sidebar-delete", onClick: () => {
                        const { action } = selectedNode.data;
                        if (!action) {
                            return;
                        }
                        deleteAction(action === null || action === void 0 ? void 0 : action.id);
                        setSelectedNode(undefined);
                    }, children: "Delete action" })) })] }));
};
exports.SidebarHeader = SidebarHeader;
const BackArrow = () => ((0, jsx_runtime_1.jsx)("svg", { width: "20", height: "20", viewBox: "0 0 20 20", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: (0, jsx_runtime_1.jsx)("path", { d: "M16 10H5M5 10L8 7M5 10L8 13", stroke: "currentColor", strokeWidth: "1", strokeLinecap: "round", strokeLinejoin: "round" }) }));
//# sourceMappingURL=Header.js.map