def array_insert(arr, value, index=None):
    steps = []
    current = arr[:]

    steps.append({
        "array": current[:],
        "highlights": [],
        "description": f"Starting array: {current}",
        "pointer": None
    })

    if index is None:
        index = len(current)

    for i in range(len(current)):
        steps.append({
            "array": current[:],
            "highlights": [i],
            "description": f"Checking position {i}...",
            "pointer": i
        })

    current.insert(index, value)
    steps.append({
        "array": current[:],
        "highlights": [index],
        "description": f"Inserted {value} at index {index}",
        "pointer": index
    })

    return {
        "steps": steps,
        "final": current,
        "complexity": {"time": "O(n)", "space": "O(1)"}
    }


def array_delete(arr, index):
    steps = []
    current = arr[:]

    steps.append({
        "array": current[:],
        "highlights": [],
        "description": f"Starting array: {current}",
        "pointer": None
    })

    for i in range(len(current)):
        steps.append({
            "array": current[:],
            "highlights": [i],
            "description": f"Scanning index {i}...",
            "pointer": i
        })
        if i == index:
            steps.append({
                "array": current[:],
                "highlights": [i],
                "description": f"Found element {current[i]} at index {i}. Deleting...",
                "pointer": i
            })
            break

    if index < len(current):
        deleted = current.pop(index)
        steps.append({
            "array": current[:],
            "highlights": [],
            "description": f"Deleted {deleted}. Shifted remaining elements left.",
            "pointer": None
        })

    return {
        "steps": steps,
        "final": current,
        "complexity": {"time": "O(n)", "space": "O(1)"}
    }


def array_search(arr, value):
    steps = []
    current = arr[:]
    found_index = -1

    steps.append({
        "array": current[:],
        "highlights": [],
        "description": f"Searching for {value} using Linear Search",
        "pointer": None
    })

    for i in range(len(current)):
        steps.append({
            "array": current[:],
            "highlights": [i],
            "description": f"Comparing {current[i]} with {value}...",
            "pointer": i
        })
        if current[i] == value:
            found_index = i
            steps.append({
                "array": current[:],
                "highlights": [i],
                "description": f"✅ Found {value} at index {i}!",
                "pointer": i
            })
            break
        else:
            steps.append({
                "array": current[:],
                "highlights": [i],
                "description": f"{current[i]} ≠ {value}. Moving right...",
                "pointer": i
            })

    if found_index == -1:
        steps.append({
            "array": current[:],
            "highlights": [],
            "description": f"❌ {value} not found in array.",
            "pointer": None
        })

    return {
        "steps": steps,
        "final": current,
        "found_index": found_index,
        "complexity": {"time": "O(n)", "space": "O(1)"}
    }


def array_update(arr, index, value):
    steps = []
    current = arr[:]

    steps.append({
        "array": current[:],
        "highlights": [],
        "description": f"Updating index {index} to {value}",
        "pointer": None
    })

    steps.append({
        "array": current[:],
        "highlights": [index],
        "description": f"Accessing index {index} directly (O(1) random access)",
        "pointer": index
    })

    old_val = current[index]
    current[index] = value

    steps.append({
        "array": current[:],
        "highlights": [index],
        "description": f"Updated index {index}: {old_val} → {value}",
        "pointer": index
    })

    return {
        "steps": steps,
        "final": current,
        "complexity": {"time": "O(1)", "space": "O(1)"}
    }