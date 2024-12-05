"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Editor = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = require("@xyflow/react");
const layout_1 = require("./layout");
const nodes_1 = require("./nodes");
const Provider_1 = require("./Provider");
const Editor = (props) => {
    // Force the correct enum if the user passes in a string via non-TS usage.
    const direction = props.direction === "right" ? "right" : "down";
    const sidebarPosition = (0, Provider_1.useSidebarPosition)();
    let className = sidebarPosition === "left" ? "wf-editor-left-sidebar" : "";
    return ((0, jsx_runtime_1.jsx)(react_2.ReactFlowProvider, { children: (0, jsx_runtime_1.jsxs)("div", { className: `wf-editor ${className}`, children: [(0, jsx_runtime_1.jsx)(EditorUI, Object.assign({}, props, { direction: direction })), props.children] }) }));
};
exports.Editor = Editor;
const EditorUI = ({ direction = "down" }) => {
    var _a, _b, _c, _d;
    const { workflow, trigger, setSelectedNode, blankNode, setBlankNode } = (0, Provider_1.useProvider)();
    const nodesInitialized = (0, react_2.useNodesInitialized)();
    // Retain the initial node measurement for computing layout when Workflow is refreshed.
    const [defaultNodeMeasure, setDefaultNodeMeasure] = (0, react_1.useState)(undefined);
    // Store a reference to the parent div to compute layout
    const ref = (0, react_1.useRef)(null);
    const { nodes: initialNodes, edges: initialEdges } = (0, react_1.useMemo)(() => (0, layout_1.parseWorkflow)({ workflow, trigger }), []);
    const [nodes, setNodes, onNodesChange] = (0, react_2.useNodesState)(initialNodes);
    const [edges, setEdges, onEdgesChange] = (0, react_2.useEdgesState)(initialEdges);
    // Lay out the nodes in the graph.
    const layoutRect = (0, layout_1.useLayout)({
        nodes: nodes,
        edges: edges,
        width: (_b = (_a = ref.current) === null || _a === void 0 ? void 0 : _a.offsetWidth) !== null && _b !== void 0 ? _b : 0,
        height: (_d = (_c = ref.current) === null || _c === void 0 ? void 0 : _c.offsetHeight) !== null && _d !== void 0 ? _d : 0,
        direction,
        setNodes,
        setEdges,
        nodesInitialized,
        defaultNodeMeasure,
    });
    useHandleBlankNode(nodes, edges, setNodes, setEdges, direction, defaultNodeMeasure);
    useCenterGraph(layoutRect, ref);
    // When the workflow changes, we need to re-layout the graph.
    (0, react_1.useEffect)(() => {
        const { nodes, edges } = (0, layout_1.parseWorkflow)({ workflow, trigger });
        setNodes(nodes);
        setEdges(edges);
    }, [JSON.stringify((workflow === null || workflow === void 0 ? void 0 : workflow.edges) || [])]);
    const nodeTypes = (0, react_1.useMemo)(() => ({
        trigger: (node) => {
            const { trigger } = node.data;
            return (0, jsx_runtime_1.jsx)(nodes_1.TriggerNode, { trigger: trigger, node: node, direction: direction });
        },
        action: (node) => {
            const { action } = node.data;
            return (0, jsx_runtime_1.jsx)(nodes_1.ActionNode, { action: action, node: node, direction: direction });
        },
        blank: () => {
            return (0, jsx_runtime_1.jsx)(nodes_1.BlankNode, { direction: direction });
        }
    }), [direction]);
    return ((0, jsx_runtime_1.jsx)("div", { className: "wf-editor-parent", ref: ref, children: (0, jsx_runtime_1.jsx)(react_2.ReactFlow, { nodeTypes: nodeTypes, nodes: nodes, edges: edges, edgesFocusable: false, edgesReconnectable: false, onClick: (event) => {
                // If the event target is not a node, set the selected node to undefined.
                let target = event.target, isNode = false, isBlank = false;
                const results = searchParents(target, ["wf-node", "wf-blank-node"], ref.current);
                if (!results["wf-blank-node"] && !!blankNode) {
                    // Remove the blank node, as we've clicked elsewhere.
                    setBlankNode(undefined);
                }
                if (!results["wf-node"]) {
                    // Unselect any selected node, as we're not clicking on a node.
                    setSelectedNode(undefined);
                }
            }, onNodeClick: (event, node) => {
                // Ensure we're not clicking the "add" handle.  When we click
                // the add handle, we automatically select the blank node.  Selecting
                // the node here would override that selection.
                const results = searchParents(event.target, ["wf-add-handle"], ref.current);
                if (results["wf-add-handle"]) {
                    return;
                }
                setSelectedNode(node);
                event.preventDefault();
            }, onNodesChange: (args) => {
                var _a;
                // Required to store .measured in nodes for computing layout.
                onNodesChange(args);
                if (!defaultNodeMeasure && args.length > 0 && ((_a = args[0]) === null || _a === void 0 ? void 0 : _a.type) === 'dimensions') {
                    const item = args[0]; // TODO: Fix types
                    setDefaultNodeMeasure(item === null || item === void 0 ? void 0 : item.dimensions);
                }
            }, proOptions: { hideAttribution: true } }, direction) }));
};
const useCenterGraph = (layoutRect, ref) => {
    const flow = (0, react_2.useReactFlow)();
    const nodesInitialized = (0, react_2.useNodesInitialized)();
    const [centered, setCentered] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (!nodesInitialized) {
            return;
        }
        if (centered) {
            return;
        }
        // Only do this once per render.
        setCentered(true);
        // If the workflow is too big for the current viewport, zoom out.
        // Otherwise, don't zoom in and center the current graph.
        if (((layoutRect === null || layoutRect === void 0 ? void 0 : layoutRect.width) > ((_b = (_a = ref.current) === null || _a === void 0 ? void 0 : _a.offsetWidth) !== null && _b !== void 0 ? _b : 0))
            || ((layoutRect === null || layoutRect === void 0 ? void 0 : layoutRect.height) > ((_d = (_c = ref.current) === null || _c === void 0 ? void 0 : _c.offsetHeight) !== null && _d !== void 0 ? _d : 0))) {
            flow.fitView();
            return;
        }
        const w = (_f = (_e = ref.current) === null || _e === void 0 ? void 0 : _e.offsetWidth) !== null && _f !== void 0 ? _f : 0;
        const h = (_h = (_g = ref.current) === null || _g === void 0 ? void 0 : _g.offsetHeight) !== null && _h !== void 0 ? _h : 0;
        if (w === 0 || h === 0) {
            return;
        }
        const fitRect = {
            x: -1 * (w - layoutRect.width) / 2, // center the node rect in the viewport
            y: -1 * (h - layoutRect.height) / 2,
            width: w, // use viewport width
            height: h, // use viewport height
        };
        flow.fitBounds(fitRect);
    }, [nodesInitialized]);
};
// useHandleBlankNode is a hook that handles the logic for adding and removing
// blank nodes in a graph.
//
// Blank nodes are added when clicking the "AddHandle".  This mutates the Provider
// state, which we then listen to here in order to manipulate react flow.
const useHandleBlankNode = (nodes, edges, setNodes, setEdges, direction, defaultNodeMeasure) => {
    const { blankNode } = (0, Provider_1.useProvider)();
    (0, react_1.useEffect)(() => {
        var _a;
        // We must manually update the react-flow nodes and edges as they're controlled
        // via internal state.
        if (blankNode) {
            // Add the blank node and its edge.
            // Ensure that the blank node's measured entry is filled. This fixes a layout bug shift.
            // Measured is undefined when a node is being added, and is filled after react-flow renders
            // the node for the first time.
            if (!blankNode.measured) {
                blankNode.measured = ((_a = nodes[0]) === null || _a === void 0 ? void 0 : _a.measured) || defaultNodeMeasure;
            }
            const newNodes = [...nodes, blankNode];
            const newEdges = [...edges, {
                    id: `blank-node-edge`,
                    source: blankNode.data.parent.id,
                    target: '$blank',
                    type: 'smoothstep',
                }];
            // For each node, ensure there's a measured entry.
            // Re-layout the graph prior to re-rendering.
            const result = (0, layout_1.getLayoutedElements)(newNodes, newEdges, direction);
            setNodes(result.nodes);
            setEdges(result.edges);
        }
        else {
            // Remove the blank node and its edge.
            setNodes(nodes.filter((node) => node.id !== '$blank'));
            setEdges(edges.filter((edge) => edge.target !== '$blank'));
        }
    }, [blankNode]);
};
// searchParents is a utility to search parent elements for given clasnames.  It returns
// a record of whether each class was found.
const searchParents = (target, search, until) => {
    const result = {};
    while (target !== until) {
        for (const key of search) {
            if (target.classList.contains(key)) {
                result[key] = true;
            }
        }
        target = target.parentElement;
        if (!target) {
            break;
        }
    }
    return result;
};
//# sourceMappingURL=Editor.js.map