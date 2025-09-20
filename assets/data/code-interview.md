# Coding Interview Preparation

## Problem Statement

Given an array of integers, find two numbers such that they add up to a specific target number.

## Explanation

The function should return indices of the two numbers such that they add up to the target, where index1 must be less than index2.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

## Solution

<div class="solution-tabs">
  <button class="tab-btn active" data-tab="js-tab">JavaScript</button>
  <button class="tab-btn" data-tab="python-tab">Python</button>
  <button class="tab-btn" data-tab="result-tab">Result</button>
  
  <div id="js-tab" class="tab-content active">
    <div class="code-container">
      <pre><code class="language-javascript">/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return null; // No solution found
}

// Example usage
const nums = [2, 7, 11, 15];
const target = 9;
console.log(twoSum(nums, target)); // Output: [0, 1]</code></pre>
      <button class="copy-btn">Copy</button>
    </div>
  </div>

  <div id="python-tab" class="tab-content">
    <div class="code-container">
      <pre><code class="language-python">def two_sum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    seen = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in seen:
            return [seen[complement], i]
        
        seen[num] = i
    
    return None  # No solution found

# Example usage
nums = [2, 7, 11, 15]
target = 9
print(two_sum(nums, target))  # Output: [0, 1]</code></pre>
      <button class="copy-btn">Copy</button>
    </div>
  </div>

  <div id="result-tab" class="tab-content">
    <div class="code-execution">
      <div class="language-selector">
        <select>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>
      </div>
      <textarea class="code-editor">/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return null; // No solution found
}

// Example usage
const nums = [2, 7, 11, 15];
const target = 9;
console.log(twoSum(nums, target)); // Output: [0, 1]</textarea>
      <button class="run-btn">Run Code</button>
      <div class="output-container">
        <p>Output will appear here...</p>
      </div>
    </div>
  </div>
</div>