class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

def build_list(arr):
    if not arr:
        return None
    head = Node(arr[0])
    cur = head
    for v in arr[1:]:
        cur.next = Node(v)
        cur = cur.next
    return head

def to_list(head):
    result = []
    cur = head
    while cur:
        result.append(cur.val)
        cur = cur.next
    return result

def ll_insert(arr, value, position=None):
    steps = []
    current = arr[:]

    steps.append({
        "nodes": current[:],
        "highlights": [],
        "description": f"Linked List: {' → '.join(map(str, current))} → NULL",
        "active_node": None
    })

    if position is None:
        position = len(current)

    steps.append({
        "nodes": current[:],
        "highlights": [],
        "description": f"Traversing to position {position}...",
        "active_node": None
    })

    for i in range(min(position, len(current))):
        steps.append({
            "nodes": current[:],
            "highlights": [i],
            "description": f"Moving pointer to node {i} (value: {current[i]})",
            "active_node": i
        })

    current.insert(position, value)
    steps.append({
        "nodes": current[:],
        "highlights": [position],
        "description": f"✅ Inserted {value} at position {position}. Updated next pointers.",
        "active_node": position
    })

    return {
        "steps": steps,
        "final": current,
        "complexity": {
            "time": "O(n) for traversal, O(1) for insertion",
            "space": "O(1)"
        }
    }


def ll_delete(arr, value):
    steps = []
    current = arr[:]

    steps.append({
        "nodes": current[:],
        "highlights": [],
        "description": f"Deleting node with value {value}",
        "active_node": None
    })

    found = False
    for i in range(len(current)):
        steps.append({
            "nodes": current[:],
            "highlights": [i],
            "description": f"Checking node {i}: value = {current[i]}",
            "active_node": i
        })
        if current[i] == value:
            steps.append({
                "nodes": current[:],
                "highlights": [i],
                "description": f"Found {value} at position {i}. Updating pointers...",
                "active_node": i
            })
            current.pop(i)
            steps.append({
                "nodes": current[:],
                "highlights": [],
                "description": f"✅ Node deleted. List updated: {' → '.join(map(str, current))} → NULL",
                "active_node": None
            })
            found = True
            break

    if not found:
        steps.append({
            "nodes": current[:],
            "highlights": [],
            "description": f"❌ Value {value} not found in list.",
            "active_node": None
        })

    return {
        "steps": steps,
        "final": current,
        "complexity": {"time": "O(n)", "space": "O(1)"}
    }


def ll_search(arr, value):
    steps = []
    current = arr[:]
    found_index = -1

    steps.append({
        "nodes": current[:],
        "highlights": [],
        "description": f"Searching for {value} in linked list",
        "active_node": None
    })

    for i in range(len(current)):
        steps.append({
            "nodes": current[:],
            "highlights": [i],
            "description": f"Visiting node {i}: value = {current[i]}",
            "active_node": i
        })
        if current[i] == value:
            found_index = i
            steps.append({
                "nodes": current[:],
                "highlights": [i],
                "description": f"✅ Found {value} at position {i}!",
                "active_node": i
            })
            break

    if found_index == -1:
        steps.append({
            "nodes": current[:],
            "highlights": [],
            "description": f"❌ {value} not found.",
            "active_node": None
        })

    return {
        "steps": steps,
        "final": current,
        "found_index": found_index,
        "complexity": {"time": "O(n)", "space": "O(1)"}
    }


def ll_traverse(arr):
    steps = []
    current = arr[:]

    steps.append({
        "nodes": current[:],
        "highlights": [],
        "description": "Starting traversal from HEAD",
        "active_node": None
    })

    for i in range(len(current)):
        steps.append({
            "nodes": current[:],
            "highlights": [i],
            "description": f"Visiting node {i}: value = {current[i]}",
            "active_node": i
        })

    steps.append({
        "nodes": current[:],
        "highlights": [],
        "description": "✅ Reached NULL. Traversal complete!",
        "active_node": None
    })

    return {
        "steps": steps,
        "final": current,
        "complexity": {"time": "O(n)", "space": "O(1)"}
    }