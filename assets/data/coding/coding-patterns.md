# Coding Patterns & Techniques

## Introduction

Master common coding patterns and problem-solving techniques frequently asked in technical interviews.

## Common Coding Patterns

### 1. Two Pointers Pattern
Used for array/string problems where you need to compare or traverse elements.

```python
def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    
    while left < right:
        current_sum = arr[left] + arr[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return []
```

### 2. Sliding Window Pattern
Useful for problems involving subarrays or substrings.

```python
def max_subarray_sum(arr, k):
    max_sum = window_sum = sum(arr[:k])
    
    for i in range(len(arr) - k):
        window_sum = window_sum - arr[i] + arr[i + k]
        max_sum = max(max_sum, window_sum)
    
    return max_sum
```

### 3. Fast & Slow Pointers (Floyd's Algorithm)
Detect cycles in linked lists.

```python
def has_cycle(head):
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False
```

### 4. Merge Intervals
```python
def merge_intervals(intervals):
    if not intervals:
        return []
    
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    
    for current in intervals[1:]:
        if current[0] <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], current[1])
        else:
            merged.append(current)
    
    return merged
```

### 5. Recursion & Backtracking
```python
def generate_permutations(nums):
    result = []
    
    def backtrack(path, remaining):
        if not remaining:
            result.append(path[:])
            return
        
        for i in range(len(remaining)):
            path.append(remaining[i])
            backtrack(path, remaining[:i] + remaining[i+1:])
            path.pop()
    
    backtrack([], nums)
    return result
```

### 6. Dynamic Programming
```python
# Fibonacci with DP
def fibonacci(n):
    if n <= 1:
        return n
    
    dp = [0] * (n + 1)
    dp[1] = 1
    
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    
    return dp[n]
```

### 7. Binary Search Pattern
```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1
```

### 8. BFS & DFS
```python
# BFS
from collections import deque

def bfs(graph, start):
    visited = set()
    queue = deque([start])
    
    while queue:
        node = queue.popleft()
        if node not in visited:
            visited.add(node)
            queue.extend(graph[node])
    
    return visited

# DFS
def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    
    visited.add(start)
    for neighbor in graph[start]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
    
    return visited
```

## Problem-Solving Framework

1. **Understand the Problem**: Read carefully, identify inputs/outputs
2. **Explore Examples**: Test with simple cases
3. **Break It Down**: Pseudocode or comments
4. **Solve/Simplify**: Start with simpler version
5. **Refactor**: Optimize time and space complexity

## Time Complexity Cheat Sheet

| Pattern | Time Complexity | Space Complexity |
|---------|----------------|------------------|
| Two Pointers | O(n) | O(1) |
| Sliding Window | O(n) | O(1) |
| Binary Search | O(log n) | O(1) |
| DFS/BFS | O(V + E) | O(V) |
| Dynamic Programming | O(n²) or O(n) | O(n) |

## Coming Soon

- More advanced patterns
- Graph algorithms
- String manipulation patterns
- Bit manipulation techniques
- System design patterns

---

**Note:** Detailed examples with multiple language implementations coming soon!
