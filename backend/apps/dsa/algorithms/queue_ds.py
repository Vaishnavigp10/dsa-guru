def queue_enqueue(queue, value):
    steps = []
    current = queue[:]

    steps.append({
        "queue": current[:],
        "highlights": [],
        "description": f"Enqueueing {value} at REAR",
        "front": 0,
        "rear": len(current) - 1
    })

    current.append(value)
    steps.append({
        "queue": current[:],
        "highlights": [len(current) - 1],
        "description": f"✅ {value} added at REAR. Queue: {current}",
        "front": 0,
        "rear": len(current) - 1
    })

    return {
        "steps": steps,
        "final": current,
        "complexity": {"time": "O(1)", "space": "O(1)"}
    }


def queue_dequeue(queue):
    steps = []
    current = queue[:]

    steps.append({
        "queue": current[:],
        "highlights": [],
        "description": f"Dequeuing from FRONT",
        "front": 0,
        "rear": len(current) - 1
    })

    if not current:
        steps.append({
            "queue": current[:],
            "highlights": [],
            "description": "❌ Queue Underflow! Queue is empty.",
            "front": 0,
            "rear": -1
        })
        return {"steps": steps, "final": current, "dequeued": None,
                "complexity": {"time": "O(1)", "space": "O(1)"}}

    steps.append({
        "queue": current[:],
        "highlights": [0],
        "description": f"Removing FRONT element: {current[0]}",
        "front": 0,
        "rear": len(current) - 1
    })

    dequeued = current.pop(0)
    steps.append({
        "queue": current[:],
        "highlights": [0] if current else [],
        "description": f"✅ Dequeued {dequeued}. New FRONT = {current[0] if current else 'Empty'}",
        "front": 0,
        "rear": len(current) - 1
    })

    return {
        "steps": steps,
        "final": current,
        "dequeued": dequeued,
        "complexity": {"time": "O(1)", "space": "O(1)"}
    }