# Coding Interview & Practice

Welcome to the comprehensive coding interview preparation section! Here you'll find carefully curated programming questions with detailed explanations, optimal solutions, and interactive coding playground to practice.

## 🎯 How to Use This Section

1. **Study the Problem**: Read the problem statement and examples carefully
2. **Understand the Approach**: Review the detailed explanation and complexity analysis
3. **View Solutions**: Check optimized solutions in Python and JavaScript
4. **Practice**: Use the interactive playground to write and test your own code
5. **Run Tests**: Execute your code with sample test cases

---

## Array and String Problems

### 1. Two Sum Problem
**Difficulty:** Easy  
**Topics:** Arrays, Hash Tables

**Problem Statement:**
Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.

**Example:**
```
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
```

**Detailed Explanation:**
The naive approach would be to use nested loops to check every pair of numbers, but this has O(n²) time complexity. 

The optimal solution uses a hash map to store numbers we've seen along with their indices. For each number, we check if its complement (target - current number) exists in the hash map. If it does, we've found our pair. If not, we add the current number and its index to the hash map.

**Time Complexity:** O(n) - single pass through the array  
**Space Complexity:** O(n) - hash map storage

<div class="code-practice-container">
<div class="question-id" data-question="two-sum"></div>
</div>

---

### 2. Valid Palindrome
**Difficulty:** Easy  
**Topics:** Strings, Two Pointers

**Problem Statement:**
A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string `s`, return `true` if it is a palindrome, or `false` otherwise.

**Example:**
```
Input: s = "A man, a plan, a canal: Panama"
Output: true
Explanation: "amanaplanacanalpanama" is a palindrome.
```

**Detailed Explanation:**
We use the two-pointer technique. Start with pointers at both ends of the string and move them towards each other. Skip non-alphanumeric characters and compare characters after converting to lowercase. If any pair doesn't match, it's not a palindrome.

**Time Complexity:** O(n) - single pass through the string  
**Space Complexity:** O(1) - only using two pointers

<div class="code-practice-container">
<div class="question-id" data-question="valid-palindrome"></div>
</div>

---

### 3. Maximum Subarray (Kadane's Algorithm)
**Difficulty:** Medium  
**Topics:** Arrays, Dynamic Programming

**Problem Statement:**
Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.

**Example:**
```
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: [4,-1,2,1] has the largest sum = 6.
```

**Detailed Explanation:**
Kadane's algorithm maintains a running sum of the current subarray. If the running sum becomes negative, we reset it to 0 (start a new subarray). We keep track of the maximum sum seen so far.

**Time Complexity:** O(n) - single pass through the array  
**Space Complexity:** O(1) - only using variables

<div class="code-practice-container">
<div class="question-id" data-question="maximum-subarray"></div>
</div>

---

### 4. Binary Search
**Difficulty:** Easy  
**Topics:** Arrays, Binary Search

**Problem Statement:**
Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return -1.

**Example:**
```
Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4
Explanation: 9 exists in nums and its index is 4
```

**Detailed Explanation:**
Binary search repeatedly divides the search space in half. Compare the middle element with the target. If equal, return the index. If target is smaller, search the left half. If larger, search the right half.

**Time Complexity:** O(log n) - halving search space each iteration  
**Space Complexity:** O(1) - iterative approach

<div class="code-practice-container">
<div class="question-id" data-question="binary-search"></div>
</div>

---

### 5. Reverse Linked List
**Difficulty:** Easy  
**Topics:** Linked Lists, Recursion

**Problem Statement:**
Given the head of a singly linked list, reverse the list, and return the reversed list.

**Example:**
```
Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]
```

**Detailed Explanation:**
We can solve this iteratively by maintaining three pointers: previous, current, and next. For each node, we reverse the link to point to the previous node instead of the next node.

**Time Complexity:** O(n) - visit each node once  
**Space Complexity:** O(1) - iterative approach

<div class="code-practice-container">
<div class="question-id" data-question="reverse-linked-list"></div>
</div>

---

## Advanced Problems

### 6. Longest Substring Without Repeating Characters
**Difficulty:** Medium  
**Topics:** Strings, Sliding Window, Hash Table

**Problem Statement:**
Given a string `s`, find the length of the longest substring without repeating characters.

**Example:**
```
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.
```

**Detailed Explanation:**
Use the sliding window technique with two pointers. Expand the right pointer to include new characters. When a duplicate is found, move the left pointer to exclude the duplicate. Keep track of the maximum window size.

**Time Complexity:** O(n) - single pass through the string  
**Space Complexity:** O(min(m,n)) - where m is charset size

<div class="code-practice-container">
<div class="question-id" data-question="longest-substring"></div>
</div>

---

### 7. Container With Most Water
**Difficulty:** Medium  
**Topics:** Arrays, Two Pointers

**Problem Statement:**
Given `n` non-negative integers representing the height of lines, find two lines that together with the x-axis form a container that contains the most water.

**Example:**
```
Input: height = [1,8,6,2,5,4,8,3,7]
Output: 49
Explanation: The maximum area is between heights 8 and 7.
```

**Detailed Explanation:**
Use two pointers starting from both ends. Calculate the area and move the pointer with the smaller height inward, as moving the taller one won't increase the area.

**Time Complexity:** O(n) - single pass  
**Space Complexity:** O(1) - only using two pointers

<div class="code-practice-container">
<div class="question-id" data-question="container-water"></div>
</div>

---

## Tips for Coding Interviews

### 🧠 Problem-Solving Strategy
1. **Understand the Problem**: Ask clarifying questions
2. **Think Out Loud**: Explain your thought process
3. **Start Simple**: Begin with a brute force solution
4. **Optimize**: Look for patterns and optimize time/space complexity
5. **Test**: Walk through examples and edge cases

### ⚡ Common Patterns
- **Two Pointers**: For arrays and strings
- **Sliding Window**: For substring problems
- **Hash Maps**: For frequency and lookup problems
- **Binary Search**: For sorted arrays
- **Dynamic Programming**: For optimization problems

### 🎯 Interview Best Practices
- Write clean, readable code
- Handle edge cases
- Explain time and space complexity
- Test with examples
- Be prepared to optimize further
