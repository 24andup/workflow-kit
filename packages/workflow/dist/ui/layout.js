"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseWorkflow = exports.getLayoutedElements = exports.useLayout = void 0;
const react_1 = require("react");
const dagre_1 = __importDefault(require("@dagrejs/dagre"));
const Provider_1 = require("./Provider");
const useLayout = (args) => {
    const { workflow, trigger } = (0, Provider_1.useProvider)();
    const { width, height, direction, setNodes, setEdges, nodesInitialized } = args;
    let { nodes, edges } = args;
    // Force a redraw any time the actions or edges change.
    const parsed = (0, exports.parseWorkflow)({ workflow, trigger });
    if (parsed.nodes.length > nodes.length) {
        nodes = parsed.nodes;
        edges = parsed.edges;
    }
    return (0, react_1.useMemo)(() => {
        if (!nodesInitialized) {
            return { x: 0, y: 0, width: 0, height: 0 };
        }
        // Ensure theres a measured property on every node.
        const nodesWithMeasures = nodes.map((node) => {
            if (!node.measured) {
                return Object.assign(Object.assign({}, node), { measured: args.defaultNodeMeasure });
            }
            return node;
        });
        const { nodes: newNodes, edges: newEdges, rect } = (0, exports.getLayoutedElements)(nodesWithMeasures, edges, direction);
        setNodes(newNodes);
        setEdges(newEdges);
        return rect;
    }, [JSON.stringify(nodes), JSON.stringify(edges), width, height, direction, nodesInitialized]);
};
exports.useLayout = useLayout;
const getLayoutedElements = (nodes, edges, direction) => {
    const g = new dagre_1.default.graphlib.Graph({ directed: true }).setDefaultEdgeLabel(() => ({}));
    let nodePadding = 60; // TODO: Make this configurable.
    if (direction === "right") {
        nodePadding += 50;
    }
    g.setGraph({
        nodesep: 100, // TODO: Make this configurable. xpad
        ranksep: nodePadding, // TODO: Make this configurable.  ypad
        rankdir: direction === "down" ? "TB" : "LR"
    });
    // Add all nodes to the graph to compute the ideal layout
    nodes.forEach((node) => {
        var _a, _b, _c, _d;
        return g.setNode(node.id, {
            width: (_b = (_a = node.measured) === null || _a === void 0 ? void 0 : _a.width) !== null && _b !== void 0 ? _b : 0,
            height: (_d = (_c = node.measured) === null || _c === void 0 ? void 0 : _c.height) !== null && _d !== void 0 ? _d : 0,
            node,
        });
    });
    edges.forEach((edge) => g.setEdge(edge.source, edge.target));
    dagre_1.default.layout(g);
    // Calculate the bounding rects of the graph.
    const layout = g.nodes().map((nodeID) => {
        var _a, _b, _c, _d;
        const dagreNode = g.node(nodeID);
        const node = dagreNode.node;
        const x = dagreNode.x - ((_b = (_a = node.measured) === null || _a === void 0 ? void 0 : _a.width) !== null && _b !== void 0 ? _b : 0) / 2;
        const y = dagreNode.y - ((_d = (_c = node.measured) === null || _c === void 0 ? void 0 : _c.height) !== null && _d !== void 0 ? _d : 0) / 2;
        return Object.assign(Object.assign({}, node), { position: { x, y } });
    });
    const minX = Math.min(...layout.map((node) => node.position.x));
    const minY = Math.min(...layout.map((node) => node.position.y));
    const maxX = Math.max(...layout.map((node) => { var _a, _b; return node.position.x + ((_b = (_a = node.measured) === null || _a === void 0 ? void 0 : _a.width) !== null && _b !== void 0 ? _b : 0); }));
    const maxY = Math.max(...layout.map((node) => { var _a, _b; return node.position.y + ((_b = (_a = node.measured) === null || _a === void 0 ? void 0 : _a.height) !== null && _b !== void 0 ? _b : 0); }));
    return {
        nodes: layout,
        edges,
        rect: {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
        }
    };
};
exports.getLayoutedElements = getLayoutedElements;
const parseWorkflow = ({ workflow, trigger, blankNodeParent }) => {
    const nodes = [];
    const edges = [];
    // Add trigger node
    nodes.push({
        id: '$source',
        type: 'trigger',
        position: { x: 0, y: 0 },
        data: { trigger }
    });
    // Always handle the blank node case.
    if (blankNodeParent) {
        nodes.push({
            id: '$blank',
            type: 'blank',
            position: { x: 0, y: 0 },
            data: { parent: blankNodeParent }
        });
        edges.push({
            id: `blank-node-edge`,
            source: blankNodeParent.id,
            target: '$blank',
            type: 'smoothstep',
        });
    }
    if (!workflow) {
        return { nodes, edges };
    }
    (workflow.actions || []).forEach((action, index) => {
        nodes.push({
            id: action.id,
            type: 'action',
            position: { x: 0, y: 0 },
            data: { action }
        });
    });
    (workflow.edges || []).forEach((edge) => {
        edges.push({
            id: `${edge.from}-${edge.to}`,
            source: edge.from,
            target: edge.to,
            label: edge.name,
            type: 'smoothstep',
        });
    });
    // TODO: Always add an end node to every sink.
    return { nodes, edges };
};
exports.parseWorkflow = parseWorkflow;
//# sourceMappingURL=layout.js.map