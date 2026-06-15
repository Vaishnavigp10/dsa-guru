from collections import deque


# ─────────────────────────────────────────────
#  Helper: array-based BST utilities
# ─────────────────────────────────────────────
def build_tree_array(values):
    """Build BST from list of values, return array representation."""
    if not values:
        return []
    root = None
    nodes = {}

    class Node:
        def __init__(self, val):
            self.val = val
            self.left = None
            self.right = None

    def insert(root, val):
        if root is None:
            return Node(val)
        if val < root.val:
            root.left = insert(root.left, val)
        else:
            root.right = insert(root.right, val)
        return root

    for v in values:
        root = insert(root, v)

    # Convert to array representation
    result = []
    queue = deque([(root, 0)])
    max_idx = 0
    node_map = {}

    while queue:
        node, idx = queue.popleft()
        if node:
            node_map[idx] = node.val
            max_idx = max(max_idx, idx)
            queue.append((node.left,  2 * idx + 1))
            queue.append((node.right, 2 * idx + 2))

    arr = [None] * (max_idx + 1)
    for idx, val in node_map.items():
        arr[idx] = val
    return arr


def tree_to_edges(nodes):
    """Convert array representation to edge list for rendering."""
    edges = []
    for i in range(len(nodes)):
        if nodes[i] is None:
            continue
        left  = 2 * i + 1
        right = 2 * i + 2
        if left < len(nodes) and nodes[left] is not None:
            edges.append({'from': i, 'to': left})
        if right < len(nodes) and nodes[right] is not None:
            edges.append({'from': i, 'to': right})
    return edges


# ─────────────────────────────────────────────
#  BST Operations
# ─────────────────────────────────────────────
def bst_insert(nodes, value):
    steps = []
    tree  = nodes[:]

    steps.append({
        "tree":        tree[:],
        "highlights":  [],
        "description": f"Inserting {value} into BST",
        "edges":       tree_to_edges(tree),
        "current_node": None
    })

    if not tree or all(n is None for n in tree):
        tree = [value]
        steps.append({
            "tree":        tree[:],
            "highlights":  [0],
            "description": f"Tree was empty. {value} becomes ROOT.",
            "edges":       [],
            "current_node": 0
        })
        return {
            "steps": steps,
            "final": tree,
            "edges": tree_to_edges(tree),
            "complexity": {"time": "O(log n) avg, O(n) worst", "space": "O(1)"}
        }

    i = 0
    while i < len(tree):
        while len(tree) <= i:
            tree.append(None)

        if tree[i] is None:
            tree[i] = value
            steps.append({
                "tree":        tree[:],
                "highlights":  [i],
                "description": f"✅ Inserted {value} at position {i}",
                "edges":       tree_to_edges(tree),
                "current_node": i
            })
            break

        steps.append({
            "tree":        tree[:],
            "highlights":  [i],
            "description": f"Comparing {value} with node {tree[i]}",
            "edges":       tree_to_edges(tree),
            "current_node": i
        })

        if value < tree[i]:
            steps.append({
                "tree":        tree[:],
                "highlights":  [i],
                "description": f"{value} < {tree[i]} → Go LEFT",
                "edges":       tree_to_edges(tree),
                "current_node": i
            })
            i = 2 * i + 1
        elif value > tree[i]:
            steps.append({
                "tree":        tree[:],
                "highlights":  [i],
                "description": f"{value} > {tree[i]} → Go RIGHT",
                "edges":       tree_to_edges(tree),
                "current_node": i
            })
            i = 2 * i + 2
        else:
            steps.append({
                "tree":        tree[:],
                "highlights":  [i],
                "description": f"⚠️ {value} already exists in BST!",
                "edges":       tree_to_edges(tree),
                "current_node": i
            })
            break

    return {
        "steps": steps,
        "final": tree,
        "edges": tree_to_edges(tree),
        "complexity": {"time": "O(log n) avg, O(n) worst", "space": "O(1)"}
    }


def bst_search(nodes, value):
    steps = []
    tree  = nodes[:]

    steps.append({
        "tree":        tree[:],
        "highlights":  [],
        "description": f"Searching for {value} in BST",
        "edges":       tree_to_edges(tree),
        "current_node": None
    })

    i     = 0
    found = False

    while i < len(tree) and tree[i] is not None:
        steps.append({
            "tree":        tree[:],
            "highlights":  [i],
            "description": f"Visiting node {tree[i]}",
            "edges":       tree_to_edges(tree),
            "current_node": i
        })

        if tree[i] == value:
            steps.append({
                "tree":        tree[:],
                "highlights":  [i],
                "description": f"✅ Found {value} at position {i}!",
                "edges":       tree_to_edges(tree),
                "current_node": i
            })
            found = True
            break
        elif value < tree[i]:
            steps.append({
                "tree":        tree[:],
                "highlights":  [i],
                "description": f"{value} < {tree[i]} → Go LEFT",
                "edges":       tree_to_edges(tree),
                "current_node": i
            })
            i = 2 * i + 1
        else:
            steps.append({
                "tree":        tree[:],
                "highlights":  [i],
                "description": f"{value} > {tree[i]} → Go RIGHT",
                "edges":       tree_to_edges(tree),
                "current_node": i
            })
            i = 2 * i + 2

    if not found:
        steps.append({
            "tree":        tree[:],
            "highlights":  [],
            "description": f"❌ {value} not found in BST.",
            "edges":       tree_to_edges(tree),
            "current_node": None
        })

    return {
        "steps": steps,
        "final": tree,
        "found": found,
        "edges": tree_to_edges(tree),
        "complexity": {"time": "O(log n) avg, O(n) worst", "space": "O(1)"}
    }


def bst_delete(nodes, value):
    steps = []
    tree  = nodes[:]

    steps.append({
        "tree":        tree[:],
        "highlights":  [],
        "description": f"Deleting {value} from BST",
        "edges":       tree_to_edges(tree),
        "current_node": None
    })

    def find_min_idx(arr, idx):
        while 2 * idx + 1 < len(arr) and arr[2 * idx + 1] is not None:
            idx = 2 * idx + 1
        return idx

    i = 0
    while i < len(tree) and tree[i] is not None:
        steps.append({
            "tree":        tree[:],
            "highlights":  [i],
            "description": f"Checking node {tree[i]}",
            "edges":       tree_to_edges(tree),
            "current_node": i
        })

        if tree[i] == value:
            left  = 2 * i + 1
            right = 2 * i + 2
            has_left  = left  < len(tree) and tree[left]  is not None
            has_right = right < len(tree) and tree[right] is not None

            if not has_left and not has_right:
                tree[i] = None
                steps.append({
                    "tree":        tree[:],
                    "highlights":  [],
                    "description": f"✅ Deleted leaf node {value}",
                    "edges":       tree_to_edges(tree),
                    "current_node": None
                })
            elif has_right:
                min_idx = find_min_idx(tree, right)
                tree[i] = tree[min_idx]
                tree[min_idx] = None
                steps.append({
                    "tree":        tree[:],
                    "highlights":  [i],
                    "description": f"✅ Replaced {value} with inorder successor {tree[i]}",
                    "edges":       tree_to_edges(tree),
                    "current_node": i
                })
            else:
                tree[i] = tree[left]
                tree[left] = None
                steps.append({
                    "tree":        tree[:],
                    "highlights":  [i],
                    "description": f"✅ Replaced {value} with left child {tree[i]}",
                    "edges":       tree_to_edges(tree),
                    "current_node": i
                })
            break
        elif value < tree[i]:
            i = 2 * i + 1
        else:
            i = 2 * i + 2

    return {
        "steps": steps,
        "final": tree,
        "edges": tree_to_edges(tree),
        "complexity": {"time": "O(log n) avg, O(n) worst", "space": "O(1)"}
    }


# ─────────────────────────────────────────────
#  Traversals
# ─────────────────────────────────────────────
def tree_inorder(nodes):
    steps  = []
    tree   = nodes[:]
    result = []

    steps.append({
        "tree":        tree[:],
        "highlights":  [],
        "description": "Starting Inorder Traversal (Left → Root → Right)",
        "edges":       tree_to_edges(tree),
        "result":      []
    })

    def inorder(i):
        if i >= len(tree) or tree[i] is None:
            return
        inorder(2 * i + 1)
        result.append(tree[i])
        steps.append({
            "tree":        tree[:],
            "highlights":  [i],
            "description": f"Visiting node {tree[i]} → Result: {result}",
            "edges":       tree_to_edges(tree),
            "result":      result[:]
        })
        inorder(2 * i + 2)

    inorder(0)
    steps.append({
        "tree":        tree[:],
        "highlights":  [],
        "description": f"✅ Inorder complete: {result}",
        "edges":       tree_to_edges(tree),
        "result":      result[:]
    })

    return {
        "steps": steps,
        "final": tree,
        "traversal_result": result,
        "edges": tree_to_edges(tree),
        "complexity": {"time": "O(n)", "space": "O(n)"}
    }


def tree_preorder(nodes):
    steps  = []
    tree   = nodes[:]
    result = []

    steps.append({
        "tree":        tree[:],
        "highlights":  [],
        "description": "Starting Preorder Traversal (Root → Left → Right)",
        "edges":       tree_to_edges(tree),
        "result":      []
    })

    def preorder(i):
        if i >= len(tree) or tree[i] is None:
            return
        result.append(tree[i])
        steps.append({
            "tree":        tree[:],
            "highlights":  [i],
            "description": f"Visiting node {tree[i]} → Result: {result}",
            "edges":       tree_to_edges(tree),
            "result":      result[:]
        })
        preorder(2 * i + 1)
        preorder(2 * i + 2)

    preorder(0)
    steps.append({
        "tree":        tree[:],
        "highlights":  [],
        "description": f"✅ Preorder complete: {result}",
        "edges":       tree_to_edges(tree),
        "result":      result[:]
    })

    return {
        "steps": steps,
        "final": tree,
        "traversal_result": result,
        "edges": tree_to_edges(tree),
        "complexity": {"time": "O(n)", "space": "O(n)"}
    }


def tree_postorder(nodes):
    steps  = []
    tree   = nodes[:]
    result = []

    steps.append({
        "tree":        tree[:],
        "highlights":  [],
        "description": "Starting Postorder Traversal (Left → Right → Root)",
        "edges":       tree_to_edges(tree),
        "result":      []
    })

    def postorder(i):
        if i >= len(tree) or tree[i] is None:
            return
        postorder(2 * i + 1)
        postorder(2 * i + 2)
        result.append(tree[i])
        steps.append({
            "tree":        tree[:],
            "highlights":  [i],
            "description": f"Visiting node {tree[i]} → Result: {result}",
            "edges":       tree_to_edges(tree),
            "result":      result[:]
        })

    postorder(0)
    steps.append({
        "tree":        tree[:],
        "highlights":  [],
        "description": f"✅ Postorder complete: {result}",
        "edges":       tree_to_edges(tree),
        "result":      result[:]
    })

    return {
        "steps": steps,
        "final": tree,
        "traversal_result": result,
        "edges": tree_to_edges(tree),
        "complexity": {"time": "O(n)", "space": "O(n)"}
    }


def tree_level_order(nodes):
    steps  = []
    tree   = nodes[:]
    result = []
    queue  = deque([0])

    steps.append({
        "tree":        tree[:],
        "highlights":  [],
        "description": "Starting Level-Order (BFS) Traversal",
        "edges":       tree_to_edges(tree),
        "result":      []
    })

    while queue:
        i = queue.popleft()
        if i >= len(tree) or tree[i] is None:
            continue
        result.append(tree[i])
        steps.append({
            "tree":        tree[:],
            "highlights":  [i],
            "description": f"Level-order visiting node {tree[i]} → Result: {result}",
            "edges":       tree_to_edges(tree),
            "result":      result[:]
        })
        queue.append(2 * i + 1)
        queue.append(2 * i + 2)

    steps.append({
        "tree":        tree[:],
        "highlights":  [],
        "description": f"✅ Level-order complete: {result}",
        "edges":       tree_to_edges(tree),
        "result":      result[:]
    })

    return {
        "steps": steps,
        "final": tree,
        "traversal_result": result,
        "edges": tree_to_edges(tree),
        "complexity": {"time": "O(n)", "space": "O(n)"}
    }


# ─────────────────────────────────────────────
#  AVL Tree
# ─────────────────────────────────────────────
class AVLNode:
    def __init__(self, val):
        self.val    = val
        self.left   = None
        self.right  = None
        self.height = 1


def avl_height(node):
    return node.height if node else 0


def avl_balance(node):
    return avl_height(node.left) - avl_height(node.right) if node else 0


def avl_rotate_right(y):
    x  = y.left
    T2 = x.right
    x.right = y
    y.left  = T2
    y.height = 1 + max(avl_height(y.left), avl_height(y.right))
    x.height = 1 + max(avl_height(x.left), avl_height(x.right))
    return x


def avl_rotate_left(x):
    y  = x.right
    T2 = y.left
    y.left  = x
    x.right = T2
    x.height = 1 + max(avl_height(x.left), avl_height(x.right))
    y.height = 1 + max(avl_height(y.left), avl_height(y.right))
    return y


def avl_to_array(root):
    if not root:
        return []
    result = {}
    queue  = deque([(root, 0)])
    max_i  = 0

    while queue:
        node, i = queue.popleft()
        if node:
            result[i] = node.val
            max_i     = max(max_i, i)
            queue.append((node.left,  2 * i + 1))
            queue.append((node.right, 2 * i + 2))

    arr = [None] * (max_i + 1)
    for i, v in result.items():
        arr[i] = v
    return arr


def avl_insert_node(root, val, steps):
    if not root:
        return AVLNode(val)

    if val < root.val:
        root.left = avl_insert_node(root.left, val, steps)
    elif val > root.val:
        root.right = avl_insert_node(root.right, val, steps)
    else:
        return root

    root.height = 1 + max(avl_height(root.left), avl_height(root.right))
    balance     = avl_balance(root)

    # LL
    if balance > 1 and val < root.left.val:
        steps.append({
            "tree":        avl_to_array(root),
            "highlights":  [],
            "description": f"⚖️ LL Case: Right rotation at {root.val}",
            "edges":       tree_to_edges(avl_to_array(root)),
            "rotation":    "right"
        })
        return avl_rotate_right(root)
    # RR
    if balance < -1 and val > root.right.val:
        steps.append({
            "tree":        avl_to_array(root),
            "highlights":  [],
            "description": f"⚖️ RR Case: Left rotation at {root.val}",
            "edges":       tree_to_edges(avl_to_array(root)),
            "rotation":    "left"
        })
        return avl_rotate_left(root)
    # LR
    if balance > 1 and val > root.left.val:
        steps.append({
            "tree":        avl_to_array(root),
            "highlights":  [],
            "description": f"⚖️ LR Case: Left-Right rotation at {root.val}",
            "edges":       tree_to_edges(avl_to_array(root)),
            "rotation":    "left-right"
        })
        root.left = avl_rotate_left(root.left)
        return avl_rotate_right(root)
    # RL
    if balance < -1 and val < root.right.val:
        steps.append({
            "tree":        avl_to_array(root),
            "highlights":  [],
            "description": f"⚖️ RL Case: Right-Left rotation at {root.val}",
            "edges":       tree_to_edges(avl_to_array(root)),
            "rotation":    "right-left"
        })
        root.right = avl_rotate_right(root.right)
        return avl_rotate_left(root)

    return root


def avl_insert(existing_nodes, value):
    steps = []

    # Build existing AVL tree
    root = None

    def _insert(r, v):
        return avl_insert_node(r, v, [])

    for v in existing_nodes:
        if v is not None:
            root = _insert(root, v)

    steps.append({
        "tree":        avl_to_array(root),
        "highlights":  [],
        "description": f"Inserting {value} into AVL Tree",
        "edges":       tree_to_edges(avl_to_array(root)),
        "current_node": None
    })

    root = avl_insert_node(root, value, steps)
    final = avl_to_array(root)

    steps.append({
        "tree":        final,
        "highlights":  [],
        "description": f"✅ Inserted {value}. AVL tree is balanced! Height: {avl_height(root)}",
        "edges":       tree_to_edges(final),
        "current_node": None
    })

    return {
        "steps":      steps,
        "final":      final,
        "edges":      tree_to_edges(final),
        "complexity": {"time": "O(log n)", "space": "O(log n)"}
    }


# ─────────────────────────────────────────────
#  Heap Operations
# ─────────────────────────────────────────────
def heap_insert(nodes, value, heap_type='max'):
    steps = []
    heap  = nodes[:]

    steps.append({
        "tree":        heap[:],
        "highlights":  [],
        "description": f"Inserting {value} into {heap_type.upper()} Heap",
        "edges":       tree_to_edges(heap),
        "current_node": None
    })

    heap.append(value)
    i = len(heap) - 1

    steps.append({
        "tree":        heap[:],
        "highlights":  [i],
        "description": f"Added {value} at position {i}. Starting bubble-up...",
        "edges":       tree_to_edges(heap),
        "current_node": i
    })

    while i > 0:
        parent = (i - 1) // 2
        should_swap = (heap_type == 'max' and heap[i] > heap[parent]) or \
                      (heap_type == 'min' and heap[i] < heap[parent])

        steps.append({
            "tree":        heap[:],
            "highlights":  [i, parent],
            "description": f"Comparing {heap[i]} with parent {heap[parent]}",
            "edges":       tree_to_edges(heap),
            "current_node": i
        })

        if should_swap:
            heap[i], heap[parent] = heap[parent], heap[i]
            steps.append({
                "tree":        heap[:],
                "highlights":  [parent],
                "description": f"Swapped! {heap[parent]} moved up to position {parent}",
                "edges":       tree_to_edges(heap),
                "current_node": parent
            })
            i = parent
        else:
            steps.append({
                "tree":        heap[:],
                "highlights":  [i],
                "description": f"Heap property satisfied! No swap needed.",
                "edges":       tree_to_edges(heap),
                "current_node": i
            })
            break

    steps.append({
        "tree":        heap[:],
        "highlights":  [],
        "description": f"✅ {heap_type.upper()} Heap property maintained! Root = {heap[0]}",
        "edges":       tree_to_edges(heap),
        "current_node": None
    })

    return {
        "steps":      steps,
        "final":      heap,
        "edges":      tree_to_edges(heap),
        "complexity": {"time": "O(log n)", "space": "O(1)"}
    }


def heap_extract(nodes, heap_type='max'):
    steps = []
    heap  = nodes[:]

    if not heap:
        return {
            "steps":      [{"tree": [], "highlights": [], "description": "Heap is empty!", "edges": []}],
            "final":      [],
            "edges":      [],
            "complexity": {"time": "O(log n)", "space": "O(1)"}
        }

    extracted = heap[0]
    steps.append({
        "tree":        heap[:],
        "highlights":  [0],
        "description": f"Extracting {'MAX' if heap_type == 'max' else 'MIN'} = {extracted} from root",
        "edges":       tree_to_edges(heap),
        "current_node": 0
    })

    heap[0] = heap[-1]
    heap.pop()

    steps.append({
        "tree":        heap[:],
        "highlights":  [0],
        "description": f"Moved last element {heap[0] if heap else 'N/A'} to root. Heapifying down...",
        "edges":       tree_to_edges(heap),
        "current_node": 0
    })

    i = 0
    n = len(heap)

    while True:
        target = i
        left   = 2 * i + 1
        right  = 2 * i + 2

        if heap_type == 'max':
            if left  < n and heap[left]  > heap[target]: target = left
            if right < n and heap[right] > heap[target]: target = right
        else:
            if left  < n and heap[left]  < heap[target]: target = left
            if right < n and heap[right] < heap[target]: target = right

        if target == i:
            break

        heap[i], heap[target] = heap[target], heap[i]
        steps.append({
            "tree":        heap[:],
            "highlights":  [i, target],
            "description": f"Swapped {heap[target]} and {heap[i]} to maintain heap property",
            "edges":       tree_to_edges(heap),
            "current_node": target
        })
        i = target

    steps.append({
        "tree":        heap[:],
        "highlights":  [],
        "description": f"✅ Extracted {extracted}. Heap restructured!",
        "edges":       tree_to_edges(heap),
        "current_node": None
    })

    return {
        "steps":      steps,
        "final":      heap,
        "extracted":  extracted,
        "edges":      tree_to_edges(heap),
        "complexity": {"time": "O(log n)", "space": "O(1)"}
    }
    # ─────────────────────────────────────────────
#  AVL Delete
# ─────────────────────────────────────────────
def avl_delete_node(root, val, steps):
    if not root:
        return root

    if val < root.val:
        root.left = avl_delete_node(root.left, val, steps)
    elif val > root.val:
        root.right = avl_delete_node(root.right, val, steps)
    else:
        steps.append({
            "tree":        avl_to_array(root),
            "highlights":  [],
            "description": f"Found {val} — deleting node",
            "edges":       tree_to_edges(avl_to_array(root)),
        })
        if not root.left:
            return root.right
        elif not root.right:
            return root.left

        # Find inorder successor
        successor = root.right
        while successor.left:
            successor = successor.left
        root.val   = successor.val
        root.right = avl_delete_node(root.right, successor.val, steps)

    if not root:
        return root

    root.height = 1 + max(avl_height(root.left), avl_height(root.right))
    balance     = avl_balance(root)

    # LL
    if balance > 1 and avl_balance(root.left) >= 0:
        steps.append({
            "tree":        avl_to_array(root),
            "highlights":  [],
            "description": f"⚖️ Rebalancing after delete: Right rotation at {root.val}",
            "edges":       tree_to_edges(avl_to_array(root)),
        })
        return avl_rotate_right(root)
    # LR
    if balance > 1 and avl_balance(root.left) < 0:
        root.left = avl_rotate_left(root.left)
        steps.append({
            "tree":        avl_to_array(root),
            "highlights":  [],
            "description": f"⚖️ LR Rebalance after delete at {root.val}",
            "edges":       tree_to_edges(avl_to_array(root)),
        })
        return avl_rotate_right(root)
    # RR
    if balance < -1 and avl_balance(root.right) <= 0:
        steps.append({
            "tree":        avl_to_array(root),
            "highlights":  [],
            "description": f"⚖️ Rebalancing after delete: Left rotation at {root.val}",
            "edges":       tree_to_edges(avl_to_array(root)),
        })
        return avl_rotate_left(root)
    # RL
    if balance < -1 and avl_balance(root.right) > 0:
        root.right = avl_rotate_right(root.right)
        steps.append({
            "tree":        avl_to_array(root),
            "highlights":  [],
            "description": f"⚖️ RL Rebalance after delete at {root.val}",
            "edges":       tree_to_edges(avl_to_array(root)),
        })
        return avl_rotate_left(root)

    return root


def avl_delete(existing_nodes, value):
    steps = []

    # Build AVL tree from existing nodes
    root = None
    def _insert(r, v):
        return avl_insert_node(r, v, [])
    for v in existing_nodes:
        if v is not None:
            root = _insert(root, v)

    steps.append({
        "tree":        avl_to_array(root),
        "highlights":  [],
        "description": f"Deleting {value} from AVL Tree",
        "edges":       tree_to_edges(avl_to_array(root)),
    })

    root  = avl_delete_node(root, value, steps)
    final = avl_to_array(root) if root else []

    steps.append({
        "tree":        final,
        "highlights":  [],
        "description": f"✅ Deleted {value}. AVL tree rebalanced! Height: {avl_height(root)}",
        "edges":       tree_to_edges(final),
    })

    return {
        "steps":      steps,
        "final":      final,
        "edges":      tree_to_edges(final),
        "complexity": {"time": "O(log n)", "space": "O(log n)"}
    }


def avl_search(existing_nodes, value):
    steps = []

    root = None
    def _insert(r, v):
        return avl_insert_node(r, v, [])
    for v in existing_nodes:
        if v is not None:
            root = _insert(root, v)

    steps.append({
        "tree":        avl_to_array(root),
        "highlights":  [],
        "description": f"Searching for {value} in AVL Tree",
        "edges":       tree_to_edges(avl_to_array(root)),
    })

    current = root
    found   = False

    while current:
        arr = avl_to_array(root)
        # find index of current node
        idx = next((i for i, v in enumerate(arr) if v == current.val), None)

        steps.append({
            "tree":        arr,
            "highlights":  [idx] if idx is not None else [],
            "description": f"Visiting node {current.val}",
            "edges":       tree_to_edges(arr),
        })

        if value == current.val:
            steps.append({
                "tree":        arr,
                "highlights":  [idx] if idx is not None else [],
                "description": f"✅ Found {value}!",
                "edges":       tree_to_edges(arr),
            })
            found = True
            break
        elif value < current.val:
            steps.append({
                "tree":        arr,
                "highlights":  [idx] if idx is not None else [],
                "description": f"{value} < {current.val} → Go LEFT",
                "edges":       tree_to_edges(arr),
            })
            current = current.left
        else:
            steps.append({
                "tree":        arr,
                "highlights":  [idx] if idx is not None else [],
                "description": f"{value} > {current.val} → Go RIGHT",
                "edges":       tree_to_edges(arr),
            })
            current = current.right

    if not found:
        arr = avl_to_array(root)
        steps.append({
            "tree":        arr,
            "highlights":  [],
            "description": f"❌ {value} not found in AVL Tree",
            "edges":       tree_to_edges(arr),
        })

    final = avl_to_array(root)
    return {
        "steps":      steps,
        "final":      final,
        "found":      found,
        "edges":      tree_to_edges(final),
        "complexity": {"time": "O(log n)", "space": "O(1)"}
    }


# ─────────────────────────────────────────────
#  Red-Black Tree
# ─────────────────────────────────────────────
RED   = True
BLACK = False


class RBNode:
    def __init__(self, val):
        self.val    = val
        self.color  = RED
        self.left   = None
        self.right  = None
        self.parent = None


class RedBlackTree:
    def __init__(self):
        self.NIL  = RBNode(0)
        self.NIL.color = BLACK
        self.NIL.left  = None
        self.NIL.right = None
        self.root = self.NIL

    def insert(self, val):
        node        = RBNode(val)
        node.left   = self.NIL
        node.right  = self.NIL
        node.parent = None
        node.color  = RED

        parent = None
        curr   = self.root

        while curr != self.NIL:
            parent = curr
            if node.val < curr.val:
                curr = curr.left
            else:
                curr = curr.right

        node.parent = parent

        if parent is None:
            self.root = node
        elif node.val < parent.val:
            parent.left = node
        else:
            parent.right = node

        if node.parent is None:
            node.color = BLACK
            return

        if node.parent.parent is None:
            return

        self._fix_insert(node)

    def _fix_insert(self, k):
        while k.parent and k.parent.color == RED:
            if k.parent == k.parent.parent.right:
                u = k.parent.parent.left
                if u.color == RED:
                    u.color          = BLACK
                    k.parent.color   = BLACK
                    k.parent.parent.color = RED
                    k = k.parent.parent
                else:
                    if k == k.parent.left:
                        k = k.parent
                        self._right_rotate(k)
                    k.parent.color        = BLACK
                    k.parent.parent.color = RED
                    self._left_rotate(k.parent.parent)
            else:
                u = k.parent.parent.right
                if u.color == RED:
                    u.color               = BLACK
                    k.parent.color        = BLACK
                    k.parent.parent.color = RED
                    k = k.parent.parent
                else:
                    if k == k.parent.right:
                        k = k.parent
                        self._left_rotate(k)
                    k.parent.color        = BLACK
                    k.parent.parent.color = RED
                    self._right_rotate(k.parent.parent)

            if k == self.root:
                break

        self.root.color = BLACK

    def _left_rotate(self, x):
        y        = x.right
        x.right  = y.left
        if y.left != self.NIL:
            y.left.parent = x
        y.parent = x.parent
        if x.parent is None:
            self.root = y
        elif x == x.parent.left:
            x.parent.left = y
        else:
            x.parent.right = y
        y.left   = x
        x.parent = y

    def _right_rotate(self, x):
        y       = x.left
        x.left  = y.right
        if y.right != self.NIL:
            y.right.parent = x
        y.parent = x.parent
        if x.parent is None:
            self.root = y
        elif x == x.parent.right:
            x.parent.right = y
        else:
            x.parent.left = y
        y.right  = x
        x.parent = y

    def to_array_with_colors(self):
        """Returns (values_array, colors_array) for frontend rendering."""
        if self.root == self.NIL:
            return [], []

        values = {}
        colors = {}
        queue  = deque([(self.root, 0)])
        max_i  = 0

        while queue:
            node, i = queue.popleft()
            if node != self.NIL and node is not None:
                values[i] = node.val
                colors[i] = 'red' if node.color == RED else 'black'
                max_i     = max(max_i, i)
                queue.append((node.left,  2 * i + 1))
                queue.append((node.right, 2 * i + 2))

        arr_v = [None]  * (max_i + 1)
        arr_c = [None]  * (max_i + 1)
        for i in range(max_i + 1):
            arr_v[i] = values.get(i)
            arr_c[i] = colors.get(i)

        return arr_v, arr_c


def rb_insert(existing_nodes, value):
    steps = []

    rbt = RedBlackTree()
    for v in existing_nodes:
        if v is not None:
            rbt.insert(v)

    vals, cols = rbt.to_array_with_colors()
    steps.append({
        "tree":        vals,
        "colors":      cols,
        "highlights":  [],
        "description": f"Inserting {value} into Red-Black Tree",
        "edges":       tree_to_edges(vals),
    })

    rbt.insert(value)
    vals, cols = rbt.to_array_with_colors()

    steps.append({
        "tree":        vals,
        "colors":      cols,
        "highlights":  [],
        "description": f"Inserted {value} as RED node",
        "edges":       tree_to_edges(vals),
    })

    steps.append({
        "tree":        vals,
        "colors":      cols,
        "highlights":  [],
        "description": f"✅ RB Tree fixed! Root is always BLACK. Red nodes have BLACK children.",
        "edges":       tree_to_edges(vals),
    })

    return {
        "steps":      steps,
        "final":      vals,
        "colors":     cols,
        "edges":      tree_to_edges(vals),
        "complexity": {"time": "O(log n)", "space": "O(log n)"}
    }


def rb_search(existing_nodes, value):
    steps = []

    rbt = RedBlackTree()
    for v in existing_nodes:
        if v is not None:
            rbt.insert(v)

    vals, cols = rbt.to_array_with_colors()
    steps.append({
        "tree":        vals,
        "colors":      cols,
        "highlights":  [],
        "description": f"Searching for {value} in Red-Black Tree",
        "edges":       tree_to_edges(vals),
    })

    current = rbt.root
    found   = False

    while current != rbt.NIL and current is not None:
        idx = next((i for i, v in enumerate(vals) if v == current.val), None)
        steps.append({
            "tree":        vals,
            "colors":      cols,
            "highlights":  [idx] if idx is not None else [],
            "description": f"Visiting {'RED' if current.color == RED else 'BLACK'} node {current.val}",
            "edges":       tree_to_edges(vals),
        })

        if value == current.val:
            steps.append({
                "tree":        vals,
                "colors":      cols,
                "highlights":  [idx] if idx is not None else [],
                "description": f"✅ Found {value}!",
                "edges":       tree_to_edges(vals),
            })
            found = True
            break
        elif value < current.val:
            current = current.left
        else:
            current = current.right

    if not found:
        steps.append({
            "tree":        vals,
            "colors":      cols,
            "highlights":  [],
            "description": f"❌ {value} not found",
            "edges":       tree_to_edges(vals),
        })

    return {
        "steps":      steps,
        "final":      vals,
        "colors":     cols,
        "found":      found,
        "edges":      tree_to_edges(vals),
        "complexity": {"time": "O(log n)", "space": "O(1)"}
    }