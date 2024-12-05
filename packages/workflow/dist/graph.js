"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bfs = exports.newDAG = exports.SourceNodeID = void 0;
const graphology_1 = require("graphology");
const has_cycle_1 = __importDefault(require("graphology-dag/has-cycle"));
exports.SourceNodeID = "$source";
const newDAG = (flow) => {
    const g = new graphology_1.DirectedGraph();
    // Always add the triggering event as a source node.
    g.mergeNode(exports.SourceNodeID, { id: exports.SourceNodeID, kind: exports.SourceNodeID });
    for (let action of flow.actions) {
        if (g.hasNode(action.id)) {
            throw new Error(`Workflow has two actions with the same ID: ${action.id}`);
        }
        g.addNode(action.id, { id: action.id, kind: "$action", action });
    }
    for (let edge of flow.edges) {
        if (!g.hasNode(edge.from)) {
            throw new Error(`Workflow references an unknown action: ${edge.from}`);
        }
        if (!g.hasNode(edge.to)) {
            throw new Error(`Workflow references an unknown action: ${edge.to}`);
        }
        g.addEdge(edge.from, edge.to, { edge });
    }
    if ((0, has_cycle_1.default)(g)) {
        throw new Error("Workflow instance must be a DAG;  the given workflow has at least one cycle.");
    }
    if (g.outDegree(exports.SourceNodeID) === 0) {
        throw new Error("Workflow has no starting actions");
    }
    g.forEachNode((id, attrs) => {
        var _a;
        if (id !== exports.SourceNodeID && g.inEdges(id).length === 0) {
            throw new Error(`An action is disconnected and will never run: ${((_a = attrs === null || attrs === void 0 ? void 0 : attrs.action) === null || _a === void 0 ? void 0 : _a.id) || id}`);
        }
    });
    return g;
};
exports.newDAG = newDAG;
const bfs = async (graph, cb) => {
    if (graph.order <= 1) {
        // Only the event/source exists; do nothing.
        return;
    }
    ;
    const queue = [exports.SourceNodeID];
    const seen = new Set();
    while (queue.length > 0) {
        let next = queue.shift();
        const nodes = [];
        // Iterate through all children given the parent node in the queue, then push these
        // into a list for processing.
        graph.forEachOutNeighbor(next, (id, node) => {
            if (seen.has(id)) {
                return;
            }
            // We want to iterate into each action afterwards, outside of this function
            // for async support.
            nodes.push(node);
            // And we want to do a BFS search down the tree itself.
            queue.push(id);
        });
        // For each child node found, start processing the actions.  `cb` should include Inngest's
        // step.run tooling for deterministic durability, here.
        for (let node of nodes) {
            if (!node.action) {
                // We don't need to process anything here.
                continue;
            }
            const iter = graph.edgeEntries(next, node.id);
            const edge = iter.next();
            if (!edge || (edge === null || edge === void 0 ? void 0 : edge.done) == true) {
                // Should never happen due to DAG validation.
                throw new Error(`Error finding edge during DAG iteration: ${next} -> ${node.id}`);
            }
            await cb(node.action, edge.value.attributes.edge);
        }
    }
};
exports.bfs = bfs;
//# sourceMappingURL=graph.js.map