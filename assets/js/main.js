/**
 * SDET Journey - Main JavaScript
 * Handles loading and rendering of markdown content
 */

$(document).ready(function() {
    // Register service worker for PWA support
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(error => {
                    console.log('ServiceWorker registration failed: ', error);
                });
        });
    }
      // Define available topics (in a real app, this might come from an API)
    const topics = [
        { id: 'getting-started', title: 'Getting Started with SDET' },
        { id: 'manual-concepts', title: 'Manual Concepts' },
        { id: 'agile-methodology', title: 'Agile Methodology' },
        { id: 'ci-cd-pipelines', title: 'CI/CD Pipelines for Testing' },
        { id: 'api-testing', title: 'API Testing Fundamentals' },
        { id: 'code-practice', title: 'Coding Practice Questions' },
        { id: 'test-automation-frameworks', title: 'Test Automation Frameworks' },
        { id: 'code-interview', title: 'Coding Interview Prep' }
    ];

    // Initialize the application
    initApp();

    /**
     * Initialize the application
     */
    function initApp() {
        loadTopics();
        setupEventListeners();
        
        // Set current year in footer
        document.getElementById('current-year').textContent = new Date().getFullYear();
        
        // Load the first topic by default (if available)
        if (topics.length > 0) {
            loadMarkdownContent(topics[0].id);
        }
        
        // Setup code tabs functionality
        setupCodeTabs();
    }
    
    /**
     * Setup code tabs functionality
     */
    function setupCodeTabs() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    initializeTabFunctionality();
                }
            });
        });
        
        observer.observe(document.getElementById('content'), { childList: true, subtree: true });
        document.addEventListener('DOMContentLoaded', initializeTabFunctionality);
        initializeTabFunctionality();
    }
    
    /**
     * Initialize tab functionality for all tab elements on the page
     */
    function initializeTabFunctionality() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const copyButtons = document.querySelectorAll('.copy-btn');
        const runButtons = document.querySelectorAll('.run-btn');
        
        // Tab switching
        if (tabButtons.length > 0) {
            tabButtons.forEach(button => button.replaceWith(button.cloneNode(true)));
            document.querySelectorAll('.tab-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const tabId = button.getAttribute('data-tab');
                    const tabsContainer = button.closest('.solution-tabs');
                    
                    if (tabsContainer) {
                        const relatedButtons = tabsContainer.querySelectorAll('.tab-btn');
                        const relatedContents = tabsContainer.querySelectorAll('.tab-content');
                        
                        relatedButtons.forEach(btn => btn.classList.remove('active'));
                        relatedContents.forEach(content => content.classList.remove('active'));
                        
                        button.classList.add('active');
                        tabsContainer.querySelector(`#${tabId}`).classList.add('active');
                    }
                });
            });
        }
            
        // Copy code functionality
        if (copyButtons.length > 0) {
            copyButtons.forEach(button => button.replaceWith(button.cloneNode(true)));
            document.querySelectorAll('.copy-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const codeBlock = button.previousElementSibling.querySelector('code');
                    const code = codeBlock.textContent;
                    
                    navigator.clipboard.writeText(code)
                        .then(() => {
                            const originalText = button.textContent;
                            button.textContent = 'Copied!';
                            setTimeout(() => button.textContent = originalText, 2000);
                        })
                        .catch(err => console.error('Failed to copy code: ', err));
                });
            });
        }
        
        // Run code functionality
        if (runButtons.length > 0) {
            runButtons.forEach(button => button.replaceWith(button.cloneNode(true)));
            document.querySelectorAll('.run-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const tabContainer = button.closest('.tab-content');
                    const codeEditor = tabContainer.querySelector('.code-editor');
                    const outputContainer = tabContainer.querySelector('.output-container');
                    const languageSelector = tabContainer.querySelector('.language-selector select');
                    
                    if (codeEditor && outputContainer) {
                        const code = codeEditor.value;
                        const language = languageSelector ? languageSelector.value : 'javascript';
                        
                        outputContainer.innerHTML = '<p>Running code...</p>';
                        
                        try {
                            if (language === 'javascript') {
                                const originalConsoleLog = console.log;
                                let output = '';

                                console.log = function(...args) {
                                    output += args.join(' ') + '<br>';
                                    originalConsoleLog.apply(console, args);
                                };

                                try {
                                    eval(code);
                                } catch (evalError) {
                                    output += `<p class="error">Runtime Error: ${evalError.message}</p>`;
                                }

                                console.log = originalConsoleLog;
                                outputContainer.innerHTML = output || '<p>Code executed successfully with no output.</p>';
                            } else {
                                outputContainer.innerHTML = '<p>Python execution is simulated in this demo. In a real implementation, this would require a backend service.</p>';
                            }
                        } catch (error) {
                            outputContainer.innerHTML = `<p class="error">Error: ${error.message}</p>`;
                        }
                    }
                });
            });
        }
    }

    /**
     * Load topics into the sidebar with simplified structure
     */
    function loadTopics() {
        const $topicsList = $('#topics-list');
        $topicsList.empty();

        topics.forEach(topic => {
            const $topicItem = $(`<li class="topic-item" data-id="${topic.id}"><span class="topic-title">${topic.title}</span></li>`);
            $topicsList.append($topicItem);
        });

        if (topics.length > 0) {
            $topicsList.find('li.topic-item:first-child').addClass('active');
        }
    }

    /**
     * Set up event listeners
     */
    function setupEventListeners() {
        // Topic selection
        $('#topics-list').on('click', 'li.topic-item', function() {
            const topicId = $(this).data('id');
            const idx = topicFiles.findIndex(t => t.id === topicId);
            if (idx !== -1) {
                currentTopicIndex = idx;
                updateTopicNav();
            }
            $('#topics-list li').removeClass('active');
            $(this).addClass('active');
            loadMarkdownContent(topicId);
            $('#content').scrollTop(0);
            window.scrollTo(0, 0);
        });

        // Mobile menu toggle
        $('#menu-toggle').on('click', function(e) {
            e.stopPropagation();
            $('#sidebar').toggleClass('active');
        });

        // Search functionality
        $('#search-input').on('input', function() {
            const searchTerm = $(this).val().toLowerCase();
            $('.topic-item').each(function() {
                const $item = $(this);
                $item.toggle($item.text().toLowerCase().includes(searchTerm));
            });
        });

        // Close sidebar on outside click (mobile)
        $(document).on('click', function(e) {
            if (window.innerWidth <= 768) {
                const $sidebar = $('#sidebar');
                const $menuToggle = $('#menu-toggle');
                if (!$sidebar.is(e.target) && 
                    $sidebar.has(e.target).length === 0 && 
                    !$menuToggle.is(e.target) && 
                    $menuToggle.has(e.target).length === 0 && 
                    $sidebar.hasClass('active')) {
                    $sidebar.removeClass('active');
                }
            }
        });

        // Theme toggle
        $('#theme-toggle').on('click', function() {
            $('body').toggleClass('light-theme');
            const isLightTheme = $('body').hasClass('light-theme');
            localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
            const $icon = $(this).find('i');
            $icon.toggleClass('fa-sun fa-moon');
        });

        // Font size controls
        $('#font-decrease').on('click', () => changeFontSize(-1));
        $('#font-increase').on('click', () => changeFontSize(1));
        
        // Load saved theme preference
        const savedTheme = localStorage.getItem('theme') || 'dark';
        if (savedTheme === 'light') {
            $('body').addClass('light-theme');
            $('#theme-toggle').find('i').removeClass('fa-sun').addClass('fa-moon');
        }
        
        // Load saved font size
        const savedFontSize = parseInt(localStorage.getItem('fontSize') || "0", 10);
        if (savedFontSize !== 0) changeFontSize(savedFontSize);

        // Navbar PDF button event
        $('#download-pdf-navbar').on('click', downloadCurrentTopicAsPDF);
        
        // PDF Download Confirmation Modal Logic
        const $modal = $('#pdf-confirm-modal');
        const $yes = $('#pdf-confirm-yes');
        const $no = $('#pdf-confirm-no');
        const $downloadBtn = $('#download-pdf');
        const $downloadNavbarBtn = $('#download-pdf-navbar');
        const $topicTitle = $('#pdf-topic-title');

        function getCurrentTopicTitle() {
            if (typeof currentTopicIndex !== 'undefined' && window.topicFiles && topicFiles[currentTopicIndex]) {
                return topicFiles[currentTopicIndex].title;
            }
            // fallback: try to get active topic from sidebar
            const active = $('#topics-list li.active .topic-title').text();
            return active || 'this topic';
        }

        function showPdfModal(e) {
            if (e) e.preventDefault();
            $topicTitle.text(getCurrentTopicTitle());
            $modal.show();
        }

        if ($downloadBtn.length) {
            $downloadBtn.off('click').on('click', showPdfModal);
        }
        if ($downloadNavbarBtn.length) {
            $downloadNavbarBtn.off('click').on('click', showPdfModal);
        }
        $yes.on('click', function() {
            $modal.hide();
            downloadCurrentTopicAsPDF();
        });
        $no.on('click', function() {
            $modal.hide();
        });
        // Hide modal on outside click
        $modal.on('click', function(e) {
            if (e.target === this) $modal.hide();
        });
    }
    
    /**
     * Change font size of content
     */
    function changeFontSize(change) {
        const currentSize = parseInt(localStorage.getItem('fontSize') || "0", 10);
        const newSize = Math.max(-1, Math.min(1, currentSize + change));
        localStorage.setItem('fontSize', newSize);
        document.body.classList.remove('font-size-small', 'font-size-normal', 'font-size-large');
        if (newSize === -1) document.body.classList.add('font-size-small');
        else if (newSize === 1) document.body.classList.add('font-size-large');
        else document.body.classList.add('font-size-normal');
    }

    /**
     * Load and render markdown content
     */
    function loadMarkdownContent(topicId) {
        const $content = $('#markdown-content');
        $content.html('<div class="loading-content"><p>Loading content...</p></div>');
        
        const topicFileMap = {
            'getting': 'getting-started',
            'test': 'test-automation-frameworks',
            'ci': 'ci-cd-pipelines',
            'manual':'manual-concepts',
            'agile':'agile-methodology',
            'api': 'api-testing',
            'selenium': 'selenium-webdriver',
            'mobile': 'mobile-testing',
            'performance': 'performance-testing',
            'test-design': 'test-design'
        };
        
        let baseTopicId = topicId;
        if (topicFileMap[baseTopicId]) baseTopicId = topicFileMap[baseTopicId];
        
        const availableFiles = ['getting-started', 'test-automation-frameworks', 'ci-cd-pipelines','agile-methodology','manual-concepts', 'api-testing', 'code-interview'];
        const fileExists = availableFiles.includes(baseTopicId);
        
        if (!fileExists) {
            $content.html(`
                <div class="content-coming-soon">
                    <h2>Content Coming Soon!</h2>
                    <p>We're working on creating content for this topic. Please check back later!</p>
                    <p>In the meantime, try exploring other topics from the sidebar.</p>
                </div>
            `);
            return;
        }
        
        $.ajax({
            url: `assets/data/${baseTopicId}.md`,
            dataType: 'text',
            success: function(markdown) {
                const html = marked.parse(markdown);
                $content.html(html);
                
                const isSubtopic = topicId.includes('-') && topicId !== baseTopicId;
                if (isSubtopic) {
                    const $parentTopic = $(`#topics-list li[data-id="${baseTopicId}"]`);
                    const $subtopicsList = $parentTopic.next('.subtopics');
                    const $toggleIcon = $parentTopic.find('.toggle-icon');
                    
                    $subtopicsList.addClass('expanded');
                    $toggleIcon.addClass('rotated');
                    
                    const $subtopicItem = $(`#topics-list li[data-id="${topicId}"]`);
                    $subtopicItem.addClass('active').show();
                    
                    const sectionId = topicId.substring(baseTopicId.length + 1);
                    const $section = $(`#markdown-content h1[id="${sectionId}"], #markdown-content h2[id="${sectionId}"], #markdown-content h3[id="${sectionId}"]`);
                    
                    if ($section.length) {
                        setTimeout(() => {
                            $section[0].scrollIntoView({ behavior: 'smooth' });
                            $section.addClass('highlight-section');
                            setTimeout(() => $section.removeClass('highlight-section'), 2000);
                        }, 100);
                    }
                } else {
                    $content.scrollTop(0);
                }
                
                if (typeof hljs !== 'undefined') {
                    document.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
                }
                
                // Initialize coding practice interface if this is the code practice page
                if (topicId === 'code-practice') {
                    initializeCodingPractice();
                }
            },
            error: function(xhr, status, error) {
                $content.html(`
                    <div class="error-message">
                        <h2>Error Loading Content</h2>
                        <p>Sorry, we couldn't load the requested content. Please try again later.</p>
                        <p>Error details: ${status} - ${error}</p>
                    </div>
                `);
            }
        });
    }    // --- Improved Topic Navigation ---
    const topicFiles = [
        { id: 'getting-started', title: 'Getting Started with SDET' },
        { id: 'manual-concepts', title: 'Manual Concepts' },
        { id: 'agile-methodology', title: 'Agile Methodology' },
        { id: 'ci-cd-pipelines', title: 'CI/CD Pipelines for Testing' },
        { id: 'api-testing', title: 'API Testing Fundamentals' },
        { id: 'code-practice', title: 'Coding Practice Questions' },
        { id: 'test-automation-frameworks', title: 'Test Automation Frameworks' },
        { id: 'code-interview', title: 'Coding Interview Prep' }
    ];
    let currentTopicIndex = 0;

    function truncateTitle(title, maxLen = 22) {
        return title.length > maxLen ? title.slice(0, maxLen - 3) + '...' : title;
    }

    function updateTopicNav() {
        const prevBtn = document.getElementById('prev-topic');
        const nextBtn = document.getElementById('next-topic');
        // Previous topic
        if (currentTopicIndex > 0) {
            prevBtn.style.display = '';
            prevBtn.innerHTML = `<span class="nav-title" title="${topicFiles[currentTopicIndex-1].title}">${truncateTitle(topicFiles[currentTopicIndex-1].title)}</span>`;
        } else {
            prevBtn.style.display = 'none';
        }
        // Next topic
        if (currentTopicIndex < topicFiles.length - 1) {
            nextBtn.style.display = '';
            nextBtn.innerHTML = `<span class="nav-title" title="${topicFiles[currentTopicIndex+1].title}">${truncateTitle(topicFiles[currentTopicIndex+1].title)}</span>`;
        } else {
            nextBtn.style.display = 'none';
        }
    }

    function showTopic(index) {
        if (index < 0 || index >= topicFiles.length) return;
        currentTopicIndex = index;
        loadMarkdownContent(topicFiles[index].id);
        updateTopicNav();
        updateSidebarActive();
        // Scroll to top of content and window for navigation
        const content = document.getElementById('markdown-content');
        if (content) content.scrollTop = 0;
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }

    document.getElementById('prev-topic').onclick = function() {
        if (currentTopicIndex > 0) {
            showTopic(currentTopicIndex - 1);
        }
    };
    document.getElementById('next-topic').onclick = function() {
        if (currentTopicIndex < topicFiles.length - 1) {
            showTopic(currentTopicIndex + 1);
        }
    };

    function updateSidebarActive() {
        const links = document.querySelectorAll('#topics-list li');
        links.forEach((link, idx) => {
            link.classList.toggle('active', idx === currentTopicIndex);
        });
    }

    // Remove download button from topic nav if present
    const topicNav = document.getElementById('topic-nav');
    const downloadBtn = document.getElementById('download-pdf');
    if (topicNav && downloadBtn) {
        topicNav.removeChild(downloadBtn);
    }

    function downloadCurrentTopicAsPDF() {
        const topic = topicFiles[currentTopicIndex];
        const content = document.getElementById('markdown-content');
        if (!content) {
            alert('No topic content found to download.');
            return;
        }
        // Only download if topic exists
        if (!topic) {
            alert('No topic selected.');
            return;
        }
        // Clone content for PDF
        const pdfContent = content.cloneNode(true);
        pdfContent.style.background = '#fff';
        pdfContent.style.color = '#222';
        pdfContent.style.padding = '24px';
        pdfContent.style.fontFamily = 'Poppins, Arial, sans-serif';
        (function setDarkText(node) {
            if (node.nodeType === 1) {
                node.style.color = '#222';
                Array.from(node.children).forEach(setDarkText);
            }
        })(pdfContent);
        const opt = {
            margin: 0.5,
            filename: `${topic.title.replace(/\s+/g, '_')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
        };
        html2pdf().set(opt).from(pdfContent).toPdf().get('pdf').then(function(pdf) {
            const totalPages = pdf.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(12); 
                pdf.setTextColor(220, 220, 220); 
                pdf.text('qa-journey.netlify.app', pdf.internal.pageSize.getWidth() - 0.7, pdf.internal.pageSize.getHeight() - 0.5, {
                    align: 'right'
                });
                pdf.setFontSize(12);
                pdf.setTextColor(80, 80, 80);
                pdf.text(`Page ${i}`, pdf.internal.pageSize.getWidth() - 0.7, 0.7, {align: 'right'});
            }
        }).save();
    }

    // Initial topic nav setup
    updateTopicNav();

    // Coding Practice Functionality
    const codingSolutions = {
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
    console.log(\`Output: [\${result.join(', ')}]\`);
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
        }
    };

    function initializeCodingPractice() {
        // Add mobile overlay for sidebar
        if (!$('.mobile-overlay').length && window.innerWidth <= 992) {
            $('body').append('<div class="mobile-overlay"></div>');
        }
        
        // Add body class to identify coding practice page
        $('body').addClass('code-practice-active');
        
        // Add close button to sidebar for mobile
        if (window.innerWidth <= 992 && !$('#sidebar .sidebar-close').length) {
            $('#sidebar').prepend('<button class="sidebar-close" style="position: absolute; top: 10px; right: 10px; background: var(--primary-color); color: white; border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; z-index: 10;"><i class="fas fa-times"></i></button>');
        }
        
        // Sidebar close button handler
        $(document).on('click', '.sidebar-close', function() {
            $('#sidebar').removeClass('active');
        });
        
        // Mobile overlay click handler
        $(document).on('click', '.mobile-overlay', function() {
            $('#sidebar').removeClass('active');
        });
        
        // Find all code practice containers
        $('.code-practice-container').each(function() {
            const $container = $(this);
            const questionId = $container.find('.question-id').data('question');
            
            if (!questionId || !codingSolutions[questionId]) return;
            
            // Create the practice interface
            const practiceHTML = `
                <div class="practice-tabs">
                    <button class="practice-tab active" data-tab="explanation">Explanation</button>
                    <button class="practice-tab" data-tab="python">Python Solution</button>
                    <button class="practice-tab" data-tab="javascript">JavaScript Solution</button>
                    <button class="practice-tab" data-tab="playground">Code Playground</button>
                </div>
                <div class="practice-content">
                    <div class="tab-panel active" data-panel="explanation">
                        <div class="solution-header">
                            <h4>Optimal Solution Approach</h4>
                            <div class="complexity-info">
                                <span class="complexity-badge">Time: O(n)</span>
                                <span class="complexity-badge">Space: O(n)</span>
                            </div>
                        </div>
                        <p>The optimal approach uses a hash map to achieve O(n) time complexity. This is significantly better than the brute force O(n²) approach.</p>
                    </div>
                    
                    <div class="tab-panel" data-panel="python">
                        <div class="solution-header">
                            <h4>Python Solution</h4>
                            <div class="complexity-info">
                                <span class="complexity-badge">Time: O(n)</span>
                                <span class="complexity-badge">Space: O(n)</span>
                            </div>
                        </div>
                        <pre><code class="language-python">${codingSolutions[questionId].python}</code></pre>
                    </div>
                    
                    <div class="tab-panel" data-panel="javascript">
                        <div class="solution-header">
                            <h4>JavaScript Solution</h4>
                            <div class="complexity-info">
                                <span class="complexity-badge">Time: O(n)</span>
                                <span class="complexity-badge">Space: O(n)</span>
                            </div>
                        </div>
                        <pre><code class="language-javascript">${codingSolutions[questionId].javascript}</code></pre>
                    </div>
                    
                    <div class="tab-panel" data-panel="playground">
                        <div class="solution-header">
                            <h4>Interactive Code Playground</h4>
                            <div class="language-selector">
                                <select class="playground-language">
                                    <option value="python">Python</option>
                                    <option value="javascript">JavaScript</option>
                                </select>
                            </div>
                        </div>
                        <div class="code-editor-container">
                            <textarea class="code-editor" data-question="${questionId}">${codingSolutions[questionId].python}</textarea>
                        </div>
                        <div class="editor-controls">
                            <button class="run-code-btn">Run Code</button>
                            <button class="reset-code-btn">Reset</button>
                        </div>
                        <div class="code-output" style="display: none;"></div>
                    </div>
                </div>
            `;
            
            $container.html(practiceHTML);
        });
        
        // Set up event listeners for tabs
        $(document).on('click', '.practice-tab', function() {
            const $tab = $(this);
            const $container = $tab.closest('.code-practice-container');
            const tabName = $tab.data('tab');
            
            // Update active tab
            $container.find('.practice-tab').removeClass('active');
            $tab.addClass('active');
            
            // Update active panel
            $container.find('.tab-panel').removeClass('active');
            $container.find(`[data-panel="${tabName}"]`).addClass('active');
        });
        
        // Language selector for playground
        $(document).on('change', '.playground-language', function() {
            const $select = $(this);
            const language = $select.val();
            const $container = $select.closest('.code-practice-container');
            const questionId = $container.find('.code-editor').data('question');
            const $editor = $container.find('.code-editor');
            
            if (codingSolutions[questionId] && codingSolutions[questionId][language]) {
                $editor.val(codingSolutions[questionId][language]);
            }
        });
        
        // Run code button
        $(document).on('click', '.run-code-btn', function() {
            const $btn = $(this);
            const $container = $btn.closest('.code-practice-container');
            const $editor = $container.find('.code-editor');
            const $output = $container.find('.code-output');
            const language = $container.find('.playground-language').val();
            const code = $editor.val();
            
            $btn.prop('disabled', true).text('Running...');
            $output.removeClass('output-success output-error').show();
            
            // Simulate code execution (in a real app, you'd send this to a backend)
            setTimeout(() => {
                try {
                    if (language === 'javascript') {
                        // Capture console.log output
                        let output = '';
                        const originalLog = console.log;
                        console.log = (...args) => {
                            output += args.join(' ') + '\n';
                        };
                        
                        // Execute the code
                        eval(code);
                        
                        // Restore console.log
                        console.log = originalLog;
                        
                        $output.addClass('output-success').text(output || 'Code executed successfully!');
                    } else {
                        // For Python, we'll just show a success message
                        $output.addClass('output-success').text('Python code syntax looks good!\n\n(Note: This is a demo. In a real implementation, code would be executed on a secure backend server.)');
                    }
                } catch (error) {
                    $output.addClass('output-error').text(`Error: ${error.message}`);
                }
                
                $btn.prop('disabled', false).text('Run Code');
            }, 1000);
        });
        
        // Reset code button
        $(document).on('click', '.reset-code-btn', function() {
            const $btn = $(this);
            const $container = $btn.closest('.code-practice-container');
            const $editor = $container.find('.code-editor');
            const $output = $container.find('.code-output');
            const language = $container.find('.playground-language').val();
            const questionId = $editor.data('question');
            
            if (codingSolutions[questionId] && codingSolutions[questionId][language]) {
                $editor.val(codingSolutions[questionId][language]);
                $output.hide();
            }
        });
    }
    
    // Remove coding practice specific classes when navigating away
    function cleanupCodingPractice() {
        $('body').removeClass('code-practice-active');
        $('.mobile-overlay').remove();
        $('.sidebar-close').remove();
    }
    
    // Enhanced loadMarkdownContent to handle cleanup
    const originalLoadMarkdownContent = loadMarkdownContent;
    loadMarkdownContent = function(topicId) {
        // Cleanup previous coding practice state
        if (!topicId || topicId !== 'code-practice') {
            cleanupCodingPractice();
        }
        
        // Call original function
        return originalLoadMarkdownContent.call(this, topicId);
    };
});
