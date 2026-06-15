# ─────────────────────────────────────────────
#  Bubble Sort
# ─────────────────────────────────────────────
def bubble_sort(arr):
    steps   = []
    current = arr[:]
    n       = len(current)

    steps.append({
        "array":       current[:],
        "highlights":  [],
        "sorted":      [],
        "pivot":       None,
        "description": f"Starting Bubble Sort on {current}"
    })

    sorted_indices = []
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            steps.append({
                "array":       current[:],
                "highlights":  [j, j + 1],
                "sorted":      sorted_indices[:],
                "pivot":       None,
                "description": f"Comparing {current[j]} and {current[j+1]}"
            })
            if current[j] > current[j + 1]:
                current[j], current[j + 1] = current[j + 1], current[j]
                swapped = True
                steps.append({
                    "array":       current[:],
                    "highlights":  [j, j + 1],
                    "sorted":      sorted_indices[:],
                    "pivot":       None,
                    "description": f"Swapped! Array: {current}"
                })
        sorted_indices.append(n - i - 1)
        if not swapped:
            steps.append({
                "array":       current[:],
                "highlights":  [],
                "sorted":      list(range(n)),
                "pivot":       None,
                "description": "✅ No swaps — array already sorted! Early termination."
            })
            break

    steps.append({
        "array":       current[:],
        "highlights":  [],
        "sorted":      list(range(n)),
        "pivot":       None,
        "description": f"✅ Bubble Sort Complete! Sorted: {current}"
    })

    return {
        "steps":      steps,
        "final":      current,
        "complexity": {"time": "O(n²) avg, O(n) best", "space": "O(1)"}
    }


# ─────────────────────────────────────────────
#  Selection Sort
# ─────────────────────────────────────────────
def selection_sort(arr):
    steps          = []
    current        = arr[:]
    n              = len(current)
    sorted_indices = []

    steps.append({
        "array":       current[:],
        "highlights":  [],
        "sorted":      [],
        "pivot":       None,
        "description": f"Starting Selection Sort on {current}"
    })

    for i in range(n):
        min_idx = i
        steps.append({
            "array":       current[:],
            "highlights":  [i],
            "sorted":      sorted_indices[:],
            "pivot":       i,
            "description": f"Finding minimum from index {i} to {n-1}"
        })
        for j in range(i + 1, n):
            steps.append({
                "array":       current[:],
                "highlights":  [min_idx, j],
                "sorted":      sorted_indices[:],
                "pivot":       min_idx,
                "description": f"Comparing {current[min_idx]} (min) with {current[j]}"
            })
            if current[j] < current[min_idx]:
                min_idx = j
                steps.append({
                    "array":       current[:],
                    "highlights":  [min_idx],
                    "sorted":      sorted_indices[:],
                    "pivot":       min_idx,
                    "description": f"New minimum: {current[min_idx]} at index {min_idx}"
                })

        if min_idx != i:
            current[i], current[min_idx] = current[min_idx], current[i]
            steps.append({
                "array":       current[:],
                "highlights":  [i, min_idx],
                "sorted":      sorted_indices[:],
                "pivot":       None,
                "description": f"Swapped {current[min_idx]} ↔ {current[i]}"
            })

        sorted_indices.append(i)

    steps.append({
        "array":       current[:],
        "highlights":  [],
        "sorted":      list(range(n)),
        "pivot":       None,
        "description": f"✅ Selection Sort Complete! Sorted: {current}"
    })

    return {
        "steps":      steps,
        "final":      current,
        "complexity": {"time": "O(n²)", "space": "O(1)"}
    }


# ─────────────────────────────────────────────
#  Insertion Sort
# ─────────────────────────────────────────────
def insertion_sort(arr):
    steps   = []
    current = arr[:]
    n       = len(current)

    steps.append({
        "array":       current[:],
        "highlights":  [0],
        "sorted":      [0],
        "pivot":       None,
        "description": f"Starting Insertion Sort. First element {current[0]} is trivially sorted."
    })

    for i in range(1, n):
        key = current[i]
        j   = i - 1
        steps.append({
            "array":       current[:],
            "highlights":  [i],
            "sorted":      list(range(i)),
            "pivot":       i,
            "description": f"Picking key = {key} at index {i}"
        })
        while j >= 0 and current[j] > key:
            steps.append({
                "array":       current[:],
                "highlights":  [j, j + 1],
                "sorted":      list(range(i)),
                "pivot":       i,
                "description": f"{current[j]} > {key} → shift {current[j]} right"
            })
            current[j + 1] = current[j]
            j -= 1

        current[j + 1] = key
        steps.append({
            "array":       current[:],
            "highlights":  [j + 1],
            "sorted":      list(range(i + 1)),
            "pivot":       None,
            "description": f"Placed {key} at index {j+1} ✅"
        })

    steps.append({
        "array":       current[:],
        "highlights":  [],
        "sorted":      list(range(n)),
        "pivot":       None,
        "description": f"✅ Insertion Sort Complete! Sorted: {current}"
    })

    return {
        "steps":      steps,
        "final":      current,
        "complexity": {"time": "O(n²) avg, O(n) best", "space": "O(1)"}
    }


# ─────────────────────────────────────────────
#  Merge Sort
# ─────────────────────────────────────────────
def merge_sort(arr):
    steps   = []
    current = arr[:]

    def merge(arr, left, mid, right):
        left_part  = arr[left:mid + 1]
        right_part = arr[mid + 1:right + 1]
        i = j = 0
        k = left

        while i < len(left_part) and j < len(right_part):
            steps.append({
                "array":       arr[:],
                "highlights":  [left + i, mid + 1 + j],
                "sorted":      [],
                "pivot":       None,
                "description": f"Comparing {left_part[i]} and {right_part[j]}"
            })
            if left_part[i] <= right_part[j]:
                arr[k] = left_part[i]
                i += 1
            else:
                arr[k] = right_part[j]
                j += 1
            k += 1

        while i < len(left_part):
            arr[k] = left_part[i]
            i += 1
            k += 1

        while j < len(right_part):
            arr[k] = right_part[j]
            j += 1
            k += 1

        steps.append({
            "array":       arr[:],
            "highlights":  list(range(left, right + 1)),
            "sorted":      [],
            "pivot":       None,
            "description": f"Merged subarray [{left}..{right}]: {arr[left:right+1]}"
        })

    def sort(arr, left, right):
        if left < right:
            mid = (left + right) // 2
            steps.append({
                "array":       arr[:],
                "highlights":  list(range(left, right + 1)),
                "sorted":      [],
                "pivot":       mid,
                "description": f"Dividing [{left}..{right}] at mid={mid}"
            })
            sort(arr, left, mid)
            sort(arr, mid + 1, right)
            merge(arr, left, mid, right)

    steps.append({
        "array":       current[:],
        "highlights":  [],
        "sorted":      [],
        "pivot":       None,
        "description": f"Starting Merge Sort on {current}"
    })

    sort(current, 0, len(current) - 1)

    steps.append({
        "array":       current[:],
        "highlights":  list(range(len(current))),
        "sorted":      list(range(len(current))),
        "pivot":       None,
        "description": f"✅ Merge Sort Complete! Sorted: {current}"
    })

    return {
        "steps":      steps,
        "final":      current,
        "complexity": {"time": "O(n log n)", "space": "O(n)"}
    }


# ─────────────────────────────────────────────
#  Quick Sort
# ─────────────────────────────────────────────
def quick_sort(arr):
    steps   = []
    current = arr[:]

    def partition(arr, low, high):
        pivot = arr[high]
        steps.append({
            "array":       arr[:],
            "highlights":  [high],
            "sorted":      [],
            "pivot":       high,
            "description": f"Pivot = {pivot} at index {high}"
        })
        i = low - 1
        for j in range(low, high):
            steps.append({
                "array":       arr[:],
                "highlights":  [j, high],
                "sorted":      [],
                "pivot":       high,
                "description": f"Comparing {arr[j]} with pivot {pivot}"
            })
            if arr[j] <= pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
                if i != j:
                    steps.append({
                        "array":       arr[:],
                        "highlights":  [i, j],
                        "sorted":      [],
                        "pivot":       high,
                        "description": f"Swapped {arr[j]} ↔ {arr[i]}"
                    })
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        steps.append({
            "array":       arr[:],
            "highlights":  [i + 1],
            "sorted":      [i + 1],
            "pivot":       i + 1,
            "description": f"Pivot {pivot} placed at correct position {i+1} ✅"
        })
        return i + 1

    def sort(arr, low, high):
        if low < high:
            pi = partition(arr, low, high)
            sort(arr, low, pi - 1)
            sort(arr, pi + 1, high)

    steps.append({
        "array":       current[:],
        "highlights":  [],
        "sorted":      [],
        "pivot":       None,
        "description": f"Starting Quick Sort on {current}"
    })

    sort(current, 0, len(current) - 1)

    steps.append({
        "array":       current[:],
        "highlights":  list(range(len(current))),
        "sorted":      list(range(len(current))),
        "pivot":       None,
        "description": f"✅ Quick Sort Complete! Sorted: {current}"
    })

    return {
        "steps":      steps,
        "final":      current,
        "complexity": {"time": "O(n log n) avg, O(n²) worst", "space": "O(log n)"}
    }


# ─────────────────────────────────────────────
#  Heap Sort
# ─────────────────────────────────────────────
def heap_sort(arr):
    steps   = []
    current = arr[:]
    n       = len(current)

    def heapify(arr, n, i):
        largest = i
        left    = 2 * i + 1
        right   = 2 * i + 2

        steps.append({
            "array":       arr[:],
            "highlights":  [i],
            "sorted":      sorted_indices[:],
            "pivot":       i,
            "description": f"Heapifying at index {i}, value={arr[i]}"
        })

        if left < n:
            steps.append({
                "array":       arr[:],
                "highlights":  [largest, left],
                "sorted":      sorted_indices[:],
                "pivot":       i,
                "description": f"Comparing {arr[largest]} with left child {arr[left]}"
            })
            if arr[left] > arr[largest]:
                largest = left

        if right < n:
            steps.append({
                "array":       arr[:],
                "highlights":  [largest, right],
                "sorted":      sorted_indices[:],
                "pivot":       i,
                "description": f"Comparing {arr[largest]} with right child {arr[right]}"
            })
            if arr[right] > arr[largest]:
                largest = right

        if largest != i:
            arr[i], arr[largest] = arr[largest], arr[i]
            steps.append({
                "array":       arr[:],
                "highlights":  [i, largest],
                "sorted":      sorted_indices[:],
                "pivot":       None,
                "description": f"Swapped {arr[largest]} ↔ {arr[i]}"
            })
            heapify(arr, n, largest)

    sorted_indices = []

    steps.append({
        "array":       current[:],
        "highlights":  [],
        "sorted":      [],
        "pivot":       None,
        "description": f"Starting Heap Sort. First build MAX heap from {current}"
    })

    # Build max heap
    for i in range(n // 2 - 1, -1, -1):
        heapify(current, n, i)

    steps.append({
        "array":       current[:],
        "highlights":  [0],
        "sorted":      [],
        "pivot":       0,
        "description": f"MAX Heap built! Root (max) = {current[0]}. Now extract elements."
    })

    # Extract elements
    for i in range(n - 1, 0, -1):
        current[0], current[i] = current[i], current[0]
        sorted_indices.append(i)
        steps.append({
            "array":       current[:],
            "highlights":  [0, i],
            "sorted":      sorted_indices[:],
            "pivot":       None,
            "description": f"Moved max {current[i]} to position {i} ✅"
        })
        heapify(current, i, 0)

    sorted_indices.append(0)
    steps.append({
        "array":       current[:],
        "highlights":  [],
        "sorted":      list(range(n)),
        "pivot":       None,
        "description": f"✅ Heap Sort Complete! Sorted: {current}"
    })

    return {
        "steps":      steps,
        "final":      current,
        "complexity": {"time": "O(n log n)", "space": "O(1)"}
    }


# ─────────────────────────────────────────────
#  Shell Sort
# ─────────────────────────────────────────────
def shell_sort(arr):
    steps   = []
    current = arr[:]
    n       = len(current)
    gap     = n // 2

    steps.append({
        "array":       current[:],
        "highlights":  [],
        "sorted":      [],
        "pivot":       None,
        "description": f"Starting Shell Sort. Initial gap = {gap}"
    })

    while gap > 0:
        steps.append({
            "array":       current[:],
            "highlights":  [],
            "sorted":      [],
            "pivot":       None,
            "description": f"Gap = {gap}: Performing insertion sort on subarrays"
        })

        for i in range(gap, n):
            temp = current[i]
            j    = i

            steps.append({
                "array":       current[:],
                "highlights":  [i],
                "sorted":      [],
                "pivot":       i,
                "description": f"Picking element {temp} at index {i} with gap {gap}"
            })

            while j >= gap and current[j - gap] > temp:
                steps.append({
                    "array":       current[:],
                    "highlights":  [j, j - gap],
                    "sorted":      [],
                    "pivot":       None,
                    "description": f"Comparing {current[j-gap]} > {temp} → shift right by gap {gap}"
                })
                current[j] = current[j - gap]
                j -= gap

            current[j] = temp
            steps.append({
                "array":       current[:],
                "highlights":  [j],
                "sorted":      [],
                "pivot":       None,
                "description": f"Placed {temp} at index {j}"
            })

        gap //= 2

    steps.append({
        "array":       current[:],
        "highlights":  [],
        "sorted":      list(range(n)),
        "pivot":       None,
        "description": f"✅ Shell Sort Complete! Sorted: {current}"
    })

    return {
        "steps":      steps,
        "final":      current,
        "complexity": {"time": "O(n log² n)", "space": "O(1)"}
    }


# ─────────────────────────────────────────────
#  Counting Sort
# ─────────────────────────────────────────────
def counting_sort(arr):
    steps   = []
    current = arr[:]
    n       = len(current)

    if not current:
        return {"steps": [], "final": [], "complexity": {"time": "O(n+k)", "space": "O(k)"}}

    max_val = max(current)
    min_val = min(current)
    k       = max_val - min_val + 1
    count   = [0] * k

    steps.append({
        "array":       current[:],
        "highlights":  [],
        "sorted":      [],
        "count":       count[:],
        "pivot":       None,
        "description": f"Starting Counting Sort. Range: [{min_val}, {max_val}], Count array size: {k}"
    })

    # Count occurrences
    for i, val in enumerate(current):
        count[val - min_val] += 1
        steps.append({
            "array":       current[:],
            "highlights":  [i],
            "sorted":      [],
            "count":       count[:],
            "pivot":       None,
            "description": f"Counting {val}: count[{val - min_val}] = {count[val - min_val]}"
        })

    # Cumulative count
    steps.append({
        "array":       current[:],
        "highlights":  [],
        "sorted":      [],
        "count":       count[:],
        "pivot":       None,
        "description": f"Count array: {count}. Now computing cumulative counts..."
    })

    for i in range(1, k):
        count[i] += count[i - 1]

    steps.append({
        "array":       current[:],
        "highlights":  [],
        "sorted":      [],
        "count":       count[:],
        "pivot":       None,
        "description": f"Cumulative count: {count}. Now placing elements in output."
    })

    # Build output
    output = [0] * n
    for i in range(n - 1, -1, -1):
        val         = current[i]
        idx         = count[val - min_val] - 1
        output[idx] = val
        count[val - min_val] -= 1
        steps.append({
            "array":       output[:],
            "highlights":  [idx],
            "sorted":      [],
            "count":       count[:],
            "pivot":       None,
            "description": f"Placed {val} at output index {idx}"
        })

    steps.append({
        "array":       output[:],
        "highlights":  [],
        "sorted":      list(range(n)),
        "count":       count[:],
        "pivot":       None,
        "description": f"✅ Counting Sort Complete! Sorted: {output}"
    })

    return {
        "steps":      steps,
        "final":      output,
        "complexity": {"time": "O(n + k)", "space": "O(k)"}
    }


# ─────────────────────────────────────────────
#  Radix Sort
# ─────────────────────────────────────────────
def radix_sort(arr):
    steps   = []
    current = arr[:]
    n       = len(current)

    if not current:
        return {"steps": [], "final": [], "complexity": {"time": "O(d*(n+k))", "space": "O(n+k)"}}

    max_val = max(current)

    steps.append({
        "array":       current[:],
        "highlights":  [],
        "sorted":      [],
        "pivot":       None,
        "description": f"Starting Radix Sort. Max value = {max_val}"
    })

    def counting_sort_digit(arr, exp):
        output = [0] * n
        count  = [0] * 10

        steps.append({
            "array":       arr[:],
            "highlights":  [],
            "sorted":      [],
            "pivot":       None,
            "description": f"Processing digit at position {exp} (ones={'ones' if exp==1 else 'tens' if exp==10 else 'hundreds'})"
        })

        for i in range(n):
            digit = (arr[i] // exp) % 10
            count[digit] += 1
            steps.append({
                "array":       arr[:],
                "highlights":  [i],
                "sorted":      [],
                "pivot":       None,
                "description": f"Digit of {arr[i]} at place {exp} = {digit}. count[{digit}]={count[digit]}"
            })

        for i in range(1, 10):
            count[i] += count[i - 1]

        steps.append({
            "array":       arr[:],
            "highlights":  [],
            "sorted":      [],
            "pivot":       None,
            "description": f"Cumulative count for digit place {exp}: {count}"
        })

        for i in range(n - 1, -1, -1):
            digit        = (arr[i] // exp) % 10
            idx          = count[digit] - 1
            output[idx]  = arr[i]
            count[digit] -= 1

        for i in range(n):
            arr[i] = output[i]

        steps.append({
            "array":       arr[:],
            "highlights":  list(range(n)),
            "sorted":      [],
            "pivot":       None,
            "description": f"After sorting by digit place {exp}: {arr}"
        })

    exp = 1
    while max_val // exp > 0:
        counting_sort_digit(current, exp)
        exp *= 10

    steps.append({
        "array":       current[:],
        "highlights":  [],
        "sorted":      list(range(n)),
        "pivot":       None,
        "description": f"✅ Radix Sort Complete! Sorted: {current}"
    })

    return {
        "steps":      steps,
        "final":      current,
        "complexity": {"time": "O(d * (n + k))", "space": "O(n + k)"}
    }


# ─────────────────────────────────────────────
#  Binary Search (Bonus)
# ─────────────────────────────────────────────
def binary_search(arr, target):
    steps   = []
    current = sorted(arr)
    left    = 0
    right   = len(current) - 1
    found   = False

    steps.append({
        "array":       current[:],
        "highlights":  list(range(len(current))),
        "sorted":      list(range(len(current))),
        "pivot":       None,
        "left":        left,
        "right":       right,
        "description": f"Binary Search for {target} in sorted array {current}"
    })

    while left <= right:
        mid = (left + right) // 2
        steps.append({
            "array":       current[:],
            "highlights":  [mid],
            "sorted":      list(range(len(current))),
            "pivot":       mid,
            "left":        left,
            "right":       right,
            "description": f"mid={mid}, arr[mid]={current[mid]}. Search range: [{left}..{right}]"
        })

        if current[mid] == target:
            steps.append({
                "array":       current[:],
                "highlights":  [mid],
                "sorted":      list(range(len(current))),
                "pivot":       mid,
                "left":        left,
                "right":       right,
                "description": f"✅ Found {target} at index {mid}!"
            })
            found = True
            break
        elif current[mid] < target:
            steps.append({
                "array":       current[:],
                "highlights":  list(range(mid + 1, right + 1)),
                "sorted":      list(range(len(current))),
                "pivot":       None,
                "left":        mid + 1,
                "right":       right,
                "description": f"{current[mid]} < {target} → Search RIGHT half [{mid+1}..{right}]"
            })
            left = mid + 1
        else:
            steps.append({
                "array":       current[:],
                "highlights":  list(range(left, mid)),
                "sorted":      list(range(len(current))),
                "pivot":       None,
                "left":        left,
                "right":       mid - 1,
                "description": f"{current[mid]} > {target} → Search LEFT half [{left}..{mid-1}]"
            })
            right = mid - 1

    if not found:
        steps.append({
            "array":       current[:],
            "highlights":  [],
            "sorted":      list(range(len(current))),
            "pivot":       None,
            "left":        left,
            "right":       right,
            "description": f"❌ {target} not found in array"
        })

    return {
        "steps":      steps,
        "final":      current,
        "found":      found,
        "complexity": {"time": "O(log n)", "space": "O(1)"}
    }