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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sourceHandleProps = exports.targetHandleProps = exports.AddHandle = exports.NewBlankNode = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = require("@xyflow/react");
const Popover = __importStar(require("@radix-ui/react-popover"));
const Provider_1 = require("../Provider");
const NewBlankNode = (parent, edge) => ({
    id: '$blank',
    type: 'blank',
    position: { x: 0, y: 0 },
    data: {
        parent: parent,
        edge: edge
    }
});
exports.NewBlankNode = NewBlankNode;
const AddHandle = (props) => {
    var _a, _b;
    const { node, action } = props, rest = __rest(props, ["node", "action"]);
    const { setBlankNode, setSelectedNode, availableActions } = (0, Provider_1.useProvider)();
    const [menuOpen, setMenuOpen] = (0, react_1.useState)(false);
    // We want to find out whether the engine action's definition has any built-in edges,
    // or if we disable the 'Add new node' handle.
    const engineAction = availableActions.find((ea) => ea.kind === (action === null || action === void 0 ? void 0 : action.kind));
    const edges = ((_a = engineAction === null || engineAction === void 0 ? void 0 : engineAction.edges) === null || _a === void 0 ? void 0 : _a.edges) || [];
    if (((_b = engineAction === null || engineAction === void 0 ? void 0 : engineAction.edges) === null || _b === void 0 ? void 0 : _b.allowAdd) === false && edges.length === 0) {
        return null;
    }
    // This is the default handler for adding a new blank node.
    const addNode = (edge) => {
        const blankNode = (0, exports.NewBlankNode)(node, edge);
        setBlankNode(blankNode);
        setSelectedNode(blankNode);
        return blankNode;
    };
    const renderHandle = (onClick) => ((0, jsx_runtime_1.jsx)(react_2.Handle, Object.assign({}, rest, { className: "wf-add-handle", onClick: onClick, children: (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", children: (0, jsx_runtime_1.jsx)("path", { d: "M12 5V19M5 12H19", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }) }) })));
    if (!edges.length) {
        return renderHandle(() => addNode());
    }
    return ((0, jsx_runtime_1.jsxs)(Popover.Root, { open: menuOpen, onOpenChange: setMenuOpen, children: [(0, jsx_runtime_1.jsx)(Popover.Trigger, { asChild: true, children: 
                // This handler has no onClick, as we instead handle everything within the popover
                renderHandle() }), (0, jsx_runtime_1.jsx)(Popover.Portal, { children: (0, jsx_runtime_1.jsx)(Popover.Content, { children: (0, jsx_runtime_1.jsx)("div", { className: "wf-add-handle-menu", children: edges.map((edge) => ((0, jsx_runtime_1.jsx)("div", { className: "wf-add-handle-menu-item", onClick: () => {
                                const blankNode = addNode(edge);
                                setMenuOpen(false);
                                // This is a hack to auto-select the blank node.  We need to fix this shit.
                                window === null || window === void 0 ? void 0 : window.setTimeout(() => { setSelectedNode(blankNode); }, 0);
                            }, children: (0, jsx_runtime_1.jsx)("p", { className: "wf-add-handle-menu-label", children: edge.name }) }, edge.name))) }) }) })] }));
};
exports.AddHandle = AddHandle;
const targetHandleProps = (direction) => {
    return {
        type: "target",
        position: direction === "down" ? react_2.Position.Top : react_2.Position.Left,
        className: "wf-target-handle",
    };
};
exports.targetHandleProps = targetHandleProps;
const sourceHandleProps = (direction) => {
    return {
        type: "source",
        position: direction === "down" ? react_2.Position.Bottom : react_2.Position.Right,
    };
};
exports.sourceHandleProps = sourceHandleProps;
//# sourceMappingURL=Handles.js.map