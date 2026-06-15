# ─────────────────────────────────────────────
#  Hash Functions
# ─────────────────────────────────────────────
def hash_division(key, size=10):
    """Division method: h(k) = k mod size"""
    if isinstance(key, int):
        return key % size
    return sum(ord(c) for c in str(key)) % size


def hash_multiplication(key, size=10):
    """Multiplication method: h(k) = floor(size * (k*A mod 1))"""
    A = 0.6180339887  # (sqrt(5)-1)/2
    if isinstance(key, int):
        val = key
    else:
        val = sum(ord(c) for c in str(key))
    return int(size * ((val * A) % 1))


def hash_folding(key, size=10):
    """Folding method: split key into parts, add them"""
    s = str(key)
    parts = [s[i:i+2] for i in range(0, len(s), 2)]
    total = sum(int(p) for p in parts if p.isdigit())
    if not total:
        total = sum(ord(c) for c in s)
    return total % size


# ─────────────────────────────────────────────
#  Open Hashing (Chaining)
# ─────────────────────────────────────────────
def hash_chaining_insert(table, key, value, size=10):
    """
    Open Hashing / Chaining:
    table format: {bucket_index: [[key, value], ...]}
    """
    steps = []
    current = {k: list(v) for k, v in table.items()}
    hash_idx = hash_division(key, size)

    steps.append({
        "table":       current,
        "hash_index":  None,
        "description": f"Inserting key='{key}', value='{value}' using Chaining",
        "method":      "chaining",
        "size":        size
    })

    steps.append({
        "table":       current,
        "hash_index":  hash_idx,
        "description": f"Hash('{key}') = {sum(ord(c) for c in str(key)) if not isinstance(key, int) else key} % {size} = {hash_idx}",
        "method":      "chaining",
        "size":        size
    })

    bucket_key = str(hash_idx)
    if bucket_key in current and len(current[bucket_key]) > 0:
        steps.append({
            "table":       current,
            "hash_index":  hash_idx,
            "description": f"⚠️ Collision at bucket {hash_idx}! Using chaining — appending to linked list",
            "method":      "chaining",
            "size":        size
        })

    if bucket_key not in current:
        current[bucket_key] = []

    current[bucket_key].append([key, value])

    steps.append({
        "table":       current,
        "hash_index":  hash_idx,
        "description": f"✅ Inserted [{key}:{value}] at bucket {hash_idx}. Chain length: {len(current[bucket_key])}",
        "method":      "chaining",
        "size":        size
    })

    return {
        "steps":      steps,
        "final":      current,
        "hash_index": hash_idx,
        "complexity": {"time": "O(1) avg, O(n) worst", "space": "O(n)"}
    }


def hash_chaining_search(table, key, size=10):
    steps = []
    current = {k: list(v) for k, v in table.items()}
    hash_idx = hash_division(key, size)

    steps.append({
        "table":       current,
        "hash_index":  None,
        "description": f"Searching for key='{key}' using Chaining",
        "method":      "chaining",
        "size":        size
    })

    steps.append({
        "table":       current,
        "hash_index":  hash_idx,
        "description": f"Hash('{key}') = {hash_idx} → Go to bucket {hash_idx}",
        "method":      "chaining",
        "size":        size
    })

    bucket_key = str(hash_idx)
    bucket     = current.get(bucket_key, [])
    found      = False
    found_val  = None

    for i, pair in enumerate(bucket):
        steps.append({
            "table":       current,
            "hash_index":  hash_idx,
            "description": f"Checking chain item {i+1}: key='{pair[0]}'",
            "method":      "chaining",
            "size":        size
        })
        if pair[0] == key:
            found     = True
            found_val = pair[1]
            steps.append({
                "table":       current,
                "hash_index":  hash_idx,
                "description": f"✅ Found! '{key}' = '{found_val}' at bucket {hash_idx}, position {i}",
                "method":      "chaining",
                "size":        size
            })
            break

    if not found:
        steps.append({
            "table":       current,
            "hash_index":  hash_idx,
            "description": f"❌ Key '{key}' not found in bucket {hash_idx}",
            "method":      "chaining",
            "size":        size
        })

    return {
        "steps":      steps,
        "final":      current,
        "found":      found,
        "value":      found_val,
        "hash_index": hash_idx,
        "complexity": {"time": "O(1) avg, O(n) worst", "space": "O(1)"}
    }


def hash_chaining_delete(table, key, size=10):
    steps = []
    current = {k: list(v) for k, v in table.items()}
    hash_idx = hash_division(key, size)

    steps.append({
        "table":       current,
        "hash_index":  None,
        "description": f"Deleting key='{key}' using Chaining",
        "method":      "chaining",
        "size":        size
    })

    steps.append({
        "table":       current,
        "hash_index":  hash_idx,
        "description": f"Hash('{key}') = {hash_idx} → Go to bucket {hash_idx}",
        "method":      "chaining",
        "size":        size
    })

    bucket_key = str(hash_idx)
    bucket     = current.get(bucket_key, [])
    found      = False

    for i, pair in enumerate(bucket):
        if pair[0] == key:
            bucket.pop(i)
            current[bucket_key] = bucket
            found = True
            steps.append({
                "table":       current,
                "hash_index":  hash_idx,
                "description": f"✅ Deleted '{key}' from bucket {hash_idx}",
                "method":      "chaining",
                "size":        size
            })
            break

    if not found:
        steps.append({
            "table":       current,
            "hash_index":  hash_idx,
            "description": f"❌ Key '{key}' not found",
            "method":      "chaining",
            "size":        size
        })

    return {
        "steps":      steps,
        "final":      current,
        "found":      found,
        "hash_index": hash_idx,
        "complexity": {"time": "O(1) avg, O(n) worst", "space": "O(1)"}
    }


# ─────────────────────────────────────────────
#  Closed Hashing (Open Addressing)
# ─────────────────────────────────────────────
EMPTY   = None
DELETED = "__DELETED__"


def linear_probe(hash_idx, i, size):
    return (hash_idx + i) % size


def quadratic_probe(hash_idx, i, size):
    return (hash_idx + i * i) % size


def double_hash_probe(hash_idx, i, size, key):
    h2 = 7 - (hash_division(key, 7))
    return (hash_idx + i * h2) % size


def hash_open_addressing_insert(table, key, value, size=10, probe='linear'):
    """
    Closed Hashing / Open Addressing
    table format: list of size `size`, each slot is None, DELETED, or [key, value]
    """
    steps = []

    # Initialize table if needed
    if not table or len(table) != size:
        current = [None] * size
    else:
        current = list(table)

    hash_idx = hash_division(key, size)

    steps.append({
        "table":       current[:],
        "hash_index":  None,
        "probe_index": None,
        "description": f"Inserting '{key}':'{value}' using {probe.title()} Probing",
        "method":      f"open_{probe}",
        "size":        size
    })

    steps.append({
        "table":       current[:],
        "hash_index":  hash_idx,
        "probe_index": hash_idx,
        "description": f"Hash('{key}') = {hash_idx} → Try slot {hash_idx}",
        "method":      f"open_{probe}",
        "size":        size
    })

    inserted = False
    for i in range(size):
        if probe == 'linear':
            idx = linear_probe(hash_idx, i, size)
        elif probe == 'quadratic':
            idx = quadratic_probe(hash_idx, i, size)
        else:
            idx = double_hash_probe(hash_idx, i, size, key)

        if i > 0:
            steps.append({
                "table":       current[:],
                "hash_index":  hash_idx,
                "probe_index": idx,
                "description": f"⚠️ Collision! {probe.title()} probe {i}: Try slot {idx}",
                "method":      f"open_{probe}",
                "size":        size
            })

        if current[idx] is None or current[idx] == DELETED:
            current[idx] = [key, value]
            steps.append({
                "table":       current[:],
                "hash_index":  hash_idx,
                "probe_index": idx,
                "description": f"✅ Inserted [{key}:{value}] at slot {idx} (probe {i})",
                "method":      f"open_{probe}",
                "size":        size
            })
            inserted = True
            break

    if not inserted:
        steps.append({
            "table":       current[:],
            "hash_index":  hash_idx,
            "probe_index": None,
            "description": "❌ Table is FULL! Cannot insert",
            "method":      f"open_{probe}",
            "size":        size
        })

    return {
        "steps":      steps,
        "final":      current,
        "hash_index": hash_idx,
        "complexity": {"time": "O(1) avg, O(n) worst", "space": "O(1)"}
    }


def hash_open_addressing_search(table, key, size=10, probe='linear'):
    steps = []
    current = list(table) if table else [None] * size
    hash_idx = hash_division(key, size)

    steps.append({
        "table":       current[:],
        "hash_index":  None,
        "probe_index": None,
        "description": f"Searching '{key}' using {probe.title()} Probing",
        "method":      f"open_{probe}",
        "size":        size
    })

    found     = False
    found_val = None

    for i in range(size):
        if probe == 'linear':
            idx = linear_probe(hash_idx, i, size)
        elif probe == 'quadratic':
            idx = quadratic_probe(hash_idx, i, size)
        else:
            idx = double_hash_probe(hash_idx, i, size, key)

        slot = current[idx]

        steps.append({
            "table":       current[:],
            "hash_index":  hash_idx,
            "probe_index": idx,
            "description": f"Probe {i}: Check slot {idx} → {'Empty' if slot is None else ('Deleted' if slot == DELETED else str(slot))}",
            "method":      f"open_{probe}",
            "size":        size
        })

        if slot is None:
            steps.append({
                "table":       current[:],
                "hash_index":  hash_idx,
                "probe_index": idx,
                "description": f"❌ Empty slot found — '{key}' not in table",
                "method":      f"open_{probe}",
                "size":        size
            })
            break
        elif slot != DELETED and slot[0] == key:
            found     = True
            found_val = slot[1]
            steps.append({
                "table":       current[:],
                "hash_index":  hash_idx,
                "probe_index": idx,
                "description": f"✅ Found '{key}' = '{found_val}' at slot {idx}",
                "method":      f"open_{probe}",
                "size":        size
            })
            break

    return {
        "steps":      steps,
        "final":      current,
        "found":      found,
        "value":      found_val,
        "hash_index": hash_idx,
        "complexity": {"time": "O(1) avg, O(n) worst", "space": "O(1)"}
    }


def hash_open_addressing_delete(table, key, size=10, probe='linear'):
    steps = []
    current = list(table) if table else [None] * size
    hash_idx = hash_division(key, size)

    steps.append({
        "table":       current[:],
        "hash_index":  None,
        "probe_index": None,
        "description": f"Deleting '{key}' using {probe.title()} Probing",
        "method":      f"open_{probe}",
        "size":        size
    })

    found = False

    for i in range(size):
        if probe == 'linear':
            idx = linear_probe(hash_idx, i, size)
        elif probe == 'quadratic':
            idx = quadratic_probe(hash_idx, i, size)
        else:
            idx = double_hash_probe(hash_idx, i, size, key)

        slot = current[idx]

        steps.append({
            "table":       current[:],
            "hash_index":  hash_idx,
            "probe_index": idx,
            "description": f"Probe {i}: Check slot {idx}",
            "method":      f"open_{probe}",
            "size":        size
        })

        if slot is None:
            break
        elif slot != DELETED and slot[0] == key:
            current[idx] = DELETED
            found = True
            steps.append({
                "table":       current[:],
                "hash_index":  hash_idx,
                "probe_index": idx,
                "description": f"✅ Deleted '{key}' from slot {idx}. Marked as DELETED (tombstone)",
                "method":      f"open_{probe}",
                "size":        size
            })
            break

    if not found:
        steps.append({
            "table":       current[:],
            "hash_index":  hash_idx,
            "probe_index": None,
            "description": f"❌ Key '{key}' not found",
            "method":      f"open_{probe}",
            "size":        size
        })

    return {
        "steps":      steps,
        "final":      current,
        "found":      found,
        "hash_index": hash_idx,
        "complexity": {"time": "O(1) avg, O(n) worst", "space": "O(1)"}
    }


# ─── Legacy wrappers (keep old API working) ───
def hash_insert(table, key, value, size=10):
    return hash_chaining_insert(table, key, value, size)

def hash_search(table, key, size=10):
    return hash_chaining_search(table, key, size)

def hash_delete(table, key, size=10):
    return hash_chaining_delete(table, key, size)