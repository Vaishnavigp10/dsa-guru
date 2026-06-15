def stack_push(stack, value):
    steps = []
    current = stack[:]

    steps.append({
        "stack": current[:],
        "highlights": [],
        "description": f"Pushing {value} onto stack. TOP = {current[-1] if current else 'Empty'}",
        "top": len(current) - 1
    })

    steps.append({
        "stack": current[:],
        "highlights": [],
        "description": f"Checking if stack is full... No overflow.",
        "top": len(current) - 1
    })

    current.append(value)
    steps.append({
        "stack": current[:],
        "highlights": [len(current) - 1],
        "description": f"✅ Pushed {value}. New TOP = {current[-1]}",
        "top": len(current) - 1
    })

    return {
        "steps": steps,
        "final": current,
        "complexity": {"time": "O(1)", "space": "O(1)"}
    }


def stack_pop(stack):
    steps = []
    current = stack[:]

    steps.append({
        "stack": current[:],
        "highlights": [],
        "description": f"Popping from stack. TOP = {current[-1] if current else 'Empty'}",
        "top": len(current) - 1
    })

    if not current:
        steps.append({
            "stack": current[:],
            "highlights": [],
            "description": "❌ Stack Underflow! Cannot pop from empty stack.",
            "top": -1
        })
        return {"steps": steps, "final": current, "popped": None,
                "complexity": {"time": "O(1)", "space": "O(1)"}}

    steps.append({
        "stack": current[:],
        "highlights": [len(current) - 1],
        "description": f"Removing TOP element: {current[-1]}",
        "top": len(current) - 1
    })

    popped = current.pop()
    steps.append({
        "stack": current[:],
        "highlights": [len(current) - 1] if current else [],
        "description": f"✅ Popped {popped}. New TOP = {current[-1] if current else 'Empty'}",
        "top": len(current) - 1
    })

    return {
        "steps": steps,
        "final": current,
        "popped": popped,
        "complexity": {"time": "O(1)", "space": "O(1)"}
    }


def stack_peek(stack):
    steps = []
    current = stack[:]

    steps.append({
        "stack": current[:],
        "highlights": [],
        "description": "Peeking at TOP of stack...",
        "top": len(current) - 1
    })

    if not current:
        steps.append({
            "stack": current[:],
            "highlights": [],
            "description": "❌ Stack is empty. Nothing to peek.",
            "top": -1
        })
        return {"steps": steps, "final": current, "top_value": None,
                "complexity": {"time": "O(1)", "space": "O(1)"}}

    steps.append({
        "stack": current[:],
        "highlights": [len(current) - 1],
        "description": f"✅ TOP = {current[-1]} (not removed)",
        "top": len(current) - 1
    })

    return {
        "steps": steps,
        "final": current,
        "top_value": current[-1],
        "complexity": {"time": "O(1)", "space": "O(1)"}
    }