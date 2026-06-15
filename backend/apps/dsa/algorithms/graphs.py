from collections import deque
import heapq


# ─────────────────────────────────────────────
#  BFS
# ─────────────────────────────────────────────
def graph_bfs(adjacency_list, start):
    steps   = []
    visited = []
    queue   = deque([start])
    seen    = {start}

    steps.append({
        "visited":     [],
        "queue":       [start],
        "current":     None,
        "highlighted_edges": [],
        "description": f"BFS from node {start}. Queue: [{start}]"
    })

    while queue:
        node = queue.popleft()
        visited.append(node)

        steps.append({
            "visited":     visited[:],
            "queue":       list(queue),
            "current":     node,
            "highlighted_edges": [],
            "description": f"Dequeued {node}. Visited: {visited}"
        })

        neighbors = adjacency_list.get(str(node), [])
        for neighbor in sorted(neighbors):
            if neighbor not in seen:
                seen.add(neighbor)
                queue.append(neighbor)
                steps.append({
                    "visited":     visited[:],
                    "queue":       list(queue),
                    "current":     node,
                    "highlighted_edges": [[node, neighbor]],
                    "description": f"Adding neighbor {neighbor} to queue"
                })

    steps.append({
        "visited":     visited[:],
        "queue":       [],
        "current":     None,
        "highlighted_edges": [],
        "description": f"✅ BFS Complete! Order: {visited}"
    })

    return {
        "steps":           steps,
        "traversal_order": visited,
        "complexity":      {"time": "O(V + E)", "space": "O(V)"}
    }


# ─────────────────────────────────────────────
#  DFS
# ─────────────────────────────────────────────
def graph_dfs(adjacency_list, start):
    steps   = []
    visited = []
    seen    = set()

    steps.append({
        "visited":     [],
        "queue":       [start],
        "current":     None,
        "highlighted_edges": [],
        "description": f"DFS from node {start}"
    })

    def dfs(node):
        seen.add(node)
        visited.append(node)
        steps.append({
            "visited":     visited[:],
            "queue":       [],
            "current":     node,
            "highlighted_edges": [],
            "description": f"Visiting node {node}. Visited: {visited}"
        })
        neighbors = adjacency_list.get(str(node), [])
        for neighbor in sorted(neighbors):
            if neighbor not in seen:
                steps.append({
                    "visited":     visited[:],
                    "queue":       [],
                    "current":     node,
                    "highlighted_edges": [[node, neighbor]],
                    "description": f"Exploring edge {node} → {neighbor}"
                })
                dfs(neighbor)

    dfs(start)

    steps.append({
        "visited":     visited[:],
        "queue":       [],
        "current":     None,
        "highlighted_edges": [],
        "description": f"✅ DFS Complete! Order: {visited}"
    })

    return {
        "steps":           steps,
        "traversal_order": visited,
        "complexity":      {"time": "O(V + E)", "space": "O(V)"}
    }


# ─────────────────────────────────────────────
#  Dijkstra's Shortest Path
# ─────────────────────────────────────────────
def graph_dijkstra(adjacency_list, start):
    steps    = []
    dist     = {node: float('inf') for node in adjacency_list}
    dist[str(start)] = 0
    pq       = [(0, start)]
    visited  = set()
    prev     = {node: None for node in adjacency_list}

    steps.append({
        "visited":     [],
        "current":     None,
        "distances":   {k: (0 if k == str(start) else 'INF') for k in adjacency_list},
        "highlighted_edges": [],
        "description": f"Dijkstra from node {start}. All distances = INF except start = 0"
    })

    while pq:
        curr_dist, node = heapq.heappop(pq)
        node_str        = str(node)

        if node in visited:
            continue
        visited.add(node)

        steps.append({
            "visited":     list(visited),
            "current":     node,
            "distances":   {k: (v if v != float('inf') else 'INF') for k, v in dist.items()},
            "highlighted_edges": [],
            "description": f"Processing node {node} with distance {curr_dist}"
        })

        neighbors = adjacency_list.get(node_str, [])

        # Support both [node] and [[node, weight]] formats
        for neighbor_item in neighbors:
            if isinstance(neighbor_item, list):
                neighbor, weight = neighbor_item[0], neighbor_item[1]
            else:
                neighbor, weight = neighbor_item, 1

            neighbor_str = str(neighbor)
            new_dist     = curr_dist + weight

            steps.append({
                "visited":     list(visited),
                "current":     node,
                "distances":   {k: (v if v != float('inf') else 'INF') for k, v in dist.items()},
                "highlighted_edges": [[node, neighbor]],
                "description": f"Checking edge {node}→{neighbor}: {curr_dist} + {weight} = {new_dist}"
            })

            if new_dist < dist.get(neighbor_str, float('inf')):
                dist[neighbor_str] = new_dist
                prev[neighbor_str] = node
                heapq.heappush(pq, (new_dist, neighbor))
                steps.append({
                    "visited":     list(visited),
                    "current":     node,
                    "distances":   {k: (v if v != float('inf') else 'INF') for k, v in dist.items()},
                    "highlighted_edges": [[node, neighbor]],
                    "description": f"✅ Updated distance to {neighbor}: {new_dist}"
                })

    final_dist = {k: (v if v != float('inf') else 'INF') for k, v in dist.items()}

    steps.append({
        "visited":     list(visited),
        "current":     None,
        "distances":   final_dist,
        "highlighted_edges": [],
        "description": f"✅ Dijkstra Complete! Shortest distances from {start}: {final_dist}"
    })

    return {
        "steps":      steps,
        "distances":  final_dist,
        "complexity": {"time": "O((V + E) log V)", "space": "O(V)"}
    }


# ─────────────────────────────────────────────
#  Cycle Detection (Directed Graph)
# ─────────────────────────────────────────────
def graph_cycle_detection(adjacency_list):
    steps   = []
    visited = set()
    rec_stack = set()
    has_cycle = False
    cycle_path = []

    steps.append({
        "visited":     [],
        "current":     None,
        "highlighted_edges": [],
        "description": "Starting cycle detection using DFS + recursion stack"
    })

    def dfs_cycle(node, path):
        nonlocal has_cycle
        visited.add(node)
        rec_stack.add(node)
        path.append(node)

        steps.append({
            "visited":     list(visited),
            "current":     node,
            "rec_stack":   list(rec_stack),
            "highlighted_edges": [],
            "description": f"Visiting {node}. Recursion stack: {list(rec_stack)}"
        })

        neighbors = adjacency_list.get(str(node), [])
        for neighbor in neighbors:
            if isinstance(neighbor, list):
                neighbor = neighbor[0]

            steps.append({
                "visited":     list(visited),
                "current":     node,
                "rec_stack":   list(rec_stack),
                "highlighted_edges": [[node, neighbor]],
                "description": f"Checking edge {node} → {neighbor}"
            })

            if neighbor not in visited:
                if dfs_cycle(neighbor, path):
                    return True
            elif neighbor in rec_stack:
                has_cycle = True
                cycle_path.append(neighbor)
                steps.append({
                    "visited":     list(visited),
                    "current":     neighbor,
                    "rec_stack":   list(rec_stack),
                    "highlighted_edges": [[node, neighbor]],
                    "description": f"🔴 CYCLE DETECTED! {neighbor} is in recursion stack! Cycle: {path + [neighbor]}"
                })
                return True

        rec_stack.discard(node)
        path.pop()
        return False

    nodes = list(adjacency_list.keys())
    for node_str in nodes:
        node = int(node_str)
        if node not in visited:
            if dfs_cycle(node, []):
                break

    if not has_cycle:
        steps.append({
            "visited":     list(visited),
            "current":     None,
            "highlighted_edges": [],
            "description": "✅ No cycle detected! This is a DAG (Directed Acyclic Graph)"
        })

    return {
        "steps":      steps,
        "has_cycle":  has_cycle,
        "complexity": {"time": "O(V + E)", "space": "O(V)"}
    }


# ─────────────────────────────────────────────
#  Topological Sort
# ─────────────────────────────────────────────
def graph_topological_sort(adjacency_list):
    steps    = []
    visited  = set()
    result   = []

    steps.append({
        "visited":     [],
        "current":     None,
        "highlighted_edges": [],
        "result":      [],
        "description": "Starting Topological Sort (DFS-based)"
    })

    def dfs_topo(node):
        visited.add(node)
        steps.append({
            "visited":     list(visited),
            "current":     node,
            "highlighted_edges": [],
            "result":      result[:],
            "description": f"Visiting node {node}"
        })

        neighbors = adjacency_list.get(str(node), [])
        for neighbor in neighbors:
            if isinstance(neighbor, list):
                neighbor = neighbor[0]
            if neighbor not in visited:
                steps.append({
                    "visited":     list(visited),
                    "current":     node,
                    "highlighted_edges": [[node, neighbor]],
                    "result":      result[:],
                    "description": f"Exploring {node} → {neighbor}"
                })
                dfs_topo(neighbor)

        result.insert(0, node)
        steps.append({
            "visited":     list(visited),
            "current":     node,
            "highlighted_edges": [],
            "result":      result[:],
            "description": f"Adding {node} to front of result: {result}"
        })

    for node_str in adjacency_list:
        node = int(node_str)
        if node not in visited:
            dfs_topo(node)

    steps.append({
        "visited":     list(visited),
        "current":     None,
        "highlighted_edges": [],
        "result":      result[:],
        "description": f"✅ Topological Order: {result}"
    })

    return {
        "steps":            steps,
        "topological_order": result,
        "complexity":        {"time": "O(V + E)", "space": "O(V)"}
    }


# ─────────────────────────────────────────────
#  Prim's MST
# ─────────────────────────────────────────────
def graph_prims_mst(adjacency_list, start):
    steps      = []
    visited    = set()
    mst_edges  = []
    total_cost = 0
    pq         = [(0, start, -1)]  # (weight, node, parent)

    steps.append({
        "visited":     [],
        "current":     None,
        "mst_edges":   [],
        "highlighted_edges": [],
        "description": f"Prim's MST from node {start}"
    })

    while pq:
        weight, node, parent = heapq.heappop(pq)

        if node in visited:
            continue

        visited.add(node)

        if parent != -1:
            mst_edges.append([parent, node, weight])
            total_cost += weight
            steps.append({
                "visited":     list(visited),
                "current":     node,
                "mst_edges":   mst_edges[:],
                "highlighted_edges": [[parent, node]],
                "description": f"Added edge {parent}→{node} (weight {weight}) to MST. Total cost: {total_cost}"
            })
        else:
            steps.append({
                "visited":     list(visited),
                "current":     node,
                "mst_edges":   [],
                "highlighted_edges": [],
                "description": f"Starting from node {node}"
            })

        neighbors = adjacency_list.get(str(node), [])
        for neighbor_item in neighbors:
            if isinstance(neighbor_item, list):
                neighbor, w = neighbor_item[0], neighbor_item[1]
            else:
                neighbor, w = neighbor_item, 1

            if neighbor not in visited:
                heapq.heappush(pq, (w, neighbor, node))
                steps.append({
                    "visited":     list(visited),
                    "current":     node,
                    "mst_edges":   mst_edges[:],
                    "highlighted_edges": [[node, neighbor]],
                    "description": f"Added edge {node}→{neighbor} (weight {w}) to priority queue"
                })

    steps.append({
        "visited":     list(visited),
        "current":     None,
        "mst_edges":   mst_edges[:],
        "highlighted_edges": [],
        "description": f"✅ MST Complete! Total cost: {total_cost}. Edges: {mst_edges}"
    })

    return {
        "steps":      steps,
        "mst_edges":  mst_edges,
        "total_cost": total_cost,
        "complexity": {"time": "O(E log V)", "space": "O(V)"}
    }