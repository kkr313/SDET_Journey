/**
 * Coding Solutions Data
 * Contains all the coding problem solutions for the practice section
 */

window.codingSolutions = {
    'two-sum': {
        python: `def two_sum(nums, target):
    """
    Find two numbers that add up to target.
    
    Time Complexity: O(n)
    Space Complexity: O(n)
    """
    seen = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    
    return []

# Test cases
test_cases = [
    ([2, 7, 11, 15], 9),
    ([3, 2, 4], 6),
    ([3, 3], 6)
]

for nums, target in test_cases:
    result = two_sum(nums, target)
    print(f"Input: nums = {nums}, target = {target}")
    print(f"Output: {result}")
    print()`,
        javascript: `function twoSum(nums, target) {
    /**
     * Find two numbers that add up to target.
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(n)
     */
    const seen = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }
        seen.set(nums[i], i);
    }
    
    return [];
}

// Test cases
const testCases = [
    [[2, 7, 11, 15], 9],
    [[3, 2, 4], 6],
    [[3, 3], 6]
];

testCases.forEach(([nums, target]) => {
    const result = twoSum(nums, target);
    console.log(\`Input: nums = [\${nums.join(', ')}], target = \${target}\`);
    console.log(\`Output: [\${result.join(', ')}]\`);
    console.log('');
});`
    },
    'valid-palindrome': {
        python: `def is_palindrome(s):
    """
    Check if string is a valid palindrome.
    
    Time Complexity: O(n)
    Space Complexity: O(1)
    """
    left, right = 0, len(s) - 1
    
    while left < right:
        # Skip non-alphanumeric characters
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        
        # Compare characters (case insensitive)
        if s[left].lower() != s[right].lower():
            return False
        
        left += 1
        right -= 1
    
    return True

# Test cases
test_cases = [
    "A man, a plan, a canal: Panama",
    "race a car",
    " "
]

for s in test_cases:
    result = is_palindrome(s)
    print(f'Input: "{s}"')
    print(f"Output: {result}")
    print()`,
        javascript: `function isPalindrome(s) {
    /**
     * Check if string is a valid palindrome.
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(1)
     */
    let left = 0;
    let right = s.length - 1;
    
    while (left < right) {
        // Skip non-alphanumeric characters
        while (left < right && !isAlphanumeric(s[left])) {
            left++;
        }
        while (left < right && !isAlphanumeric(s[right])) {
            right--;
        }
        
        // Compare characters (case insensitive)
        if (s[left].toLowerCase() !== s[right].toLowerCase()) {
            return false;
        }
        
        left++;
        right--;
    }
    
    return true;
}

function isAlphanumeric(char) {
    return /[a-zA-Z0-9]/.test(char);
}

// Test cases
const testCases = [
    "A man, a plan, a canal: Panama",
    "race a car",
    " "
];

testCases.forEach(s => {
    const result = isPalindrome(s);
    console.log(\`Input: "\${s}"\`);
    console.log(\`Output: \${result}\`);
    console.log('');
});`
    },
    'maximum-subarray': {
        python: `def max_subarray(nums):
    """
    Find maximum sum of contiguous subarray (Kadane's Algorithm).
    
    Time Complexity: O(n)
    Space Complexity: O(1)
    """
    max_sum = current_sum = nums[0]
    
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    
    return max_sum

# Test cases
test_cases = [
    [-2, 1, -3, 4, -1, 2, 1, -5, 4],
    [1],
    [5, 4, -1, 7, 8]
]

for nums in test_cases:
    result = max_subarray(nums)
    print(f"Input: {nums}")
    print(f"Output: {result}")
    print()`,
        javascript: `function maxSubarray(nums) {
    /**
     * Find maximum sum of contiguous subarray (Kadane's Algorithm).
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(1)
     */
    let maxSum = nums[0];
    let currentSum = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
}

// Test cases
const testCases = [
    [-2, 1, -3, 4, -1, 2, 1, -5, 4],
    [1],
    [5, 4, -1, 7, 8]
];

testCases.forEach(nums => {
    const result = maxSubarray(nums);
    console.log(\`Input: [\${nums.join(', ')}]\`);
    console.log(\`Output: \${result}\`);
    console.log('');
});`
    },
    'binary-search': {
        python: `def binary_search(nums, target):
    """
    Binary search in sorted array.
    
    Time Complexity: O(log n)
    Space Complexity: O(1)
    """
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1

# Test cases
test_cases = [
    ([-1, 0, 3, 5, 9, 12], 9),
    ([-1, 0, 3, 5, 9, 12], 2),
    ([5], 5)
]

for nums, target in test_cases:
    result = binary_search(nums, target)
    print(f"Input: nums = {nums}, target = {target}")
    print(f"Output: {result}")
    print()`,
        javascript: `function binarySearch(nums, target) {
    /**
     * Binary search in sorted array.
     * 
     * Time Complexity: O(log n)
     * Space Complexity: O(1)
     */
    let left = 0;
    let right = nums.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (nums[mid] === target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}

// Test cases
const testCases = [
    [[-1, 0, 3, 5, 9, 12], 9],
    [[-1, 0, 3, 5, 9, 12], 2],
    [[5], 5]
];

testCases.forEach(([nums, target]) => {
    const result = binarySearch(nums, target);
    console.log(\`Input: nums = [\${nums.join(', ')}], target = \${target}\`);
    console.log(\`Output: \${result}\`);
    console.log('');
});`
    },
    'reverse-linked-list': {
        python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    """
    Reverse a singly linked list.
    
    Time Complexity: O(n)
    Space Complexity: O(1)
    """
    prev = None
    current = head
    
    while current:
        next_temp = current.next
        current.next = prev
        prev = current
        current = next_temp
    
    return prev

def list_to_array(head):
    """Helper function to convert linked list to array for printing."""
    result = []
    current = head
    while current:
        result.append(current.val)
        current = current.next
    return result

def array_to_list(arr):
    """Helper function to convert array to linked list."""
    if not arr:
        return None
    head = ListNode(arr[0])
    current = head
    for val in arr[1:]:
        current.next = ListNode(val)
        current = current.next
    return head

# Test cases
test_cases = [
    [1, 2, 3, 4, 5],
    [1, 2],
    []
]

for arr in test_cases:
    head = array_to_list(arr)
    reversed_head = reverse_list(head)
    result = list_to_array(reversed_head)
    print(f"Input: {arr}")
    print(f"Output: {result}")
    print()`,
        javascript: `class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

function reverseList(head) {
    /**
     * Reverse a singly linked list.
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(1)
     */
    let prev = null;
    let current = head;
    
    while (current !== null) {
        const nextTemp = current.next;
        current.next = prev;
        prev = current;
        current = nextTemp;
    }
    
    return prev;
}

function listToArray(head) {
    // Helper function to convert linked list to array for printing
    const result = [];
    let current = head;
    while (current !== null) {
        result.push(current.val);
        current = current.next;
    }
    return result;
}

function arrayToList(arr) {
    // Helper function to convert array to linked list
    if (arr.length === 0) return null;
    const head = new ListNode(arr[0]);
    let current = head;
    for (let i = 1; i < arr.length; i++) {
        current.next = new ListNode(arr[i]);
        current = current.next;
    }
    return head;
}

// Test cases
const testCases = [
    [1, 2, 3, 4, 5],
    [1, 2],
    []
];

testCases.forEach(arr => {
    const head = arrayToList(arr);
    const reversedHead = reverseList(head);
    const result = listToArray(reversedHead);
    console.log(\`Input: [\${arr.join(', ')}]\`);
    console.log(\`Output: [\${result.join(', ')}]\`);
    console.log('');
});`
    },
    'longest-substring': {
        python: `def length_of_longest_substring(s):
    """
    Find length of longest substring without repeating characters.
    
    Time Complexity: O(n)
    Space Complexity: O(min(m,n))
    """
    char_set = set()
    left = 0
    max_length = 0
    
    for right in range(len(s)):
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        char_set.add(s[right])
        max_length = max(max_length, right - left + 1)
    
    return max_length

# Test cases
test_cases = ["abcabcbb", "bbbbb", "pwwkew", ""]

for s in test_cases:
    result = length_of_longest_substring(s)
    print(f'Input: "{s}"')
    print(f"Output: {result}")
    print()`,
        javascript: `function lengthOfLongestSubstring(s) {
    /**
     * Find length of longest substring without repeating characters.
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(min(m,n))
     */
    const charSet = new Set();
    let left = 0;
    let maxLength = 0;
    
    for (let right = 0; right < s.length; right++) {
        while (charSet.has(s[right])) {
            charSet.delete(s[left]);
            left++;
        }
        charSet.add(s[right]);
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}

// Test cases
const testCases = ["abcabcbb", "bbbbb", "pwwkew", ""];

testCases.forEach(s => {
    const result = lengthOfLongestSubstring(s);
    console.log(\`Input: "\${s}"\`);
    console.log(\`Output: \${result}\`);
    console.log('');
});`
    },
    'container-water': {
        python: `def max_area(height):
    """
    Find container with most water using two pointers.
    
    Time Complexity: O(n)
    Space Complexity: O(1)
    """
    left, right = 0, len(height) - 1
    max_water = 0
    
    while left < right:
        # Calculate current area
        width = right - left
        current_height = min(height[left], height[right])
        current_area = width * current_height
        max_water = max(max_water, current_area)
        
        # Move pointer with smaller height
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    
    return max_water

# Test cases
test_cases = [
    [1,8,6,2,5,4,8,3,7],
    [1,1],
    [4,3,2,1,4]
]

for height in test_cases:
    result = max_area(height)
    print(f"Input: {height}")
    print(f"Output: {result}")
    print()`,
        javascript: `function maxArea(height) {
    /**
     * Find container with most water using two pointers.
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(1)
     */
    let left = 0;
    let right = height.length - 1;
    let maxWater = 0;
    
    while (left < right) {
        // Calculate current area
        const width = right - left;
        const currentHeight = Math.min(height[left], height[right]);
        const currentArea = width * currentHeight;
        maxWater = Math.max(maxWater, currentArea);
        
        // Move pointer with smaller height
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return maxWater;
}

// Test cases
const testCases = [
    [1,8,6,2,5,4,8,3,7],
    [1,1],
    [4,3,2,1,4]
];

testCases.forEach(height => {
    const result = maxArea(height);
    console.log(\`Input: [\${height.join(', ')}]\`);
    console.log(\`Output: \${result}\`);
    console.log('');
});`
    }
};
