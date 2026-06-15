# -*- coding: utf-8 -*-

def get_fallback_response(message):
    msg = message.lower()

    if any(w in msg for w in ["bubble", "selection", "insertion", "merge", "quick", "sort"]):
        return (
            "Sorting Algorithms - Complexity Comparison!\n\n"
            "Bubble:    O(n2) time, O(1) space\n"
            "Selection: O(n2) time, O(1) space\n"
            "Insertion: O(n2) time, O(1) space\n"
            "Merge:     O(nlogn) time, O(n) space\n"
            "Quick:     O(nlogn) avg, O(n2) worst\n\n"
            "Bubble Sort Example:\n"
            "Array: [64, 34, 25, 12]\n"
            "Pass 1: [34, 25, 12, 64]\n"
            "Pass 2: [25, 12, 34, 64]\n"
            "Pass 3: [12, 25, 34, 64] Sorted!\n\n"
            "Try the Sorting Visualizer!"
        )

    elif any(w in msg for w in ["array", "arrays"]):
        return (
            "Arrays - Complete Guide!\n\n"
            "Operations and Complexity:\n"
            "- Access: O(1)\n"
            "- Search: O(n)\n"
            "- Insert: O(n)\n"
            "- Delete: O(n)\n\n"
            "Try the Array Visualizer!"
        )

    elif any(w in msg for w in ["linked list", "linkedlist"]):
        return (
            "Linked Lists - Complete Guide!\n\n"
            "Types: Singly, Doubly, Circular\n\n"
            "Operations:\n"
            "- Access: O(n)\n"
            "- Insert at head: O(1)\n"
            "- Delete: O(n)\n\n"
            "Try the Linked List Visualizer!"
        )

    elif "stack" in msg:
        return (
            "Stack - LIFO Data Structure!\n\n"
            "Operations: Push O(1), Pop O(1), Peek O(1)\n\n"
            "Uses: Function calls, Undo/Redo, Browser back\n\n"
            "Try the Stack Visualizer!"
        )

    elif "queue" in msg:
        return (
            "Queue - FIFO Data Structure!\n\n"
            "Operations: Enqueue O(1), Dequeue O(1)\n\n"
            "Types: Simple, Circular, Priority, Deque\n\n"
            "Try the Queue Visualizer!"
        )

    elif any(w in msg for w in ["tree", "bst", "binary"]):
        return (
            "Trees - Hierarchical Data Structure!\n\n"
            "BST Operations:\n"
            "- Insert: O(log n) avg\n"
            "- Search: O(log n) avg\n\n"
            "Traversals: Inorder, Preorder, Postorder\n\n"
            "Try the Tree Visualizer!"
        )

    elif any(w in msg for w in ["graph", "bfs", "dfs"]):
        return (
            "Graphs - Network Data Structure!\n\n"
            "BFS: Level by level, uses Queue, O(V+E)\n"
            "DFS: Depth first, uses Stack, O(V+E)\n\n"
            "Try the Graph Visualizer!"
        )

    elif any(w in msg for w in ["hash", "hashmap"]):
        return (
            "Hash Tables - O(1) Average!\n\n"
            "Operations: Insert, Search, Delete all O(1) avg\n\n"
            "Collision: Chaining or Open Addressing\n\n"
            "Try the Hash Table Visualizer!"
        )

    elif any(w in msg for w in ["big o", "complexity"]):
        return (
            "Big O Notation Guide!\n\n"
            "O(1) < O(log n) < O(n) < O(nlogn) < O(n2) < O(2n)\n\n"
            "Rules:\n"
            "- Drop constants: O(2n) = O(n)\n"
            "- Nested loops multiply complexities"
        )

    else:
        return (
            "DSA Guru Assistant here!\n\n"
            "I can help with:\n"
            "- Arrays, Linked Lists, Stacks, Queues\n"
            "- Trees, Graphs, Hash Tables\n"
            "- Sorting and Searching algorithms\n"
            "- Big O complexity analysis\n\n"
            "Try asking about any DSA topic!"
        )
