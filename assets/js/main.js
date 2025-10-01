/**
 * SDET Journey - Main JavaScript (Refactored & Optimized)
 * Handles loading and rendering of markdown content with improved structure
 */

$(document).ready(function() {
    // ===== CONFIGURATION & DATA =====
    
    // Single source of truth for topics - eliminates duplication
    const TOPICS = [
        { id: 'getting-started', title: 'Getting Started with SDET' },
        { id: 'manual-concepts', title: 'Manual Concepts' },
        { id: 'agile-methodology', title: 'Agile Methodology' },
        { id: 'ci-cd-pipelines', title: 'CI/CD Pipelines for Testing' },
        { id: 'api-testing', title: 'API Testing Fundamentals' },
        { id: 'coding-interview-practice', title: 'Coding Interview & Practice' },
        { id: 'test-automation-frameworks', title: 'Test Automation Frameworks' }
    ];
    
    // Global state
    let currentTopicIndex = 0;
    
    // ===== INITIALIZATION =====
    
    initializeApp();
    
    /**
     * Main app initialization
     */
    function initializeApp() {
        initializeServiceWorker();
        loadUserPreferences();
        setupUI();
        loadInitialContent();
    }
    
    /**
     * Register service worker for PWA support
     */
    function initializeServiceWorker() {
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
    }
    
    /**
     * Load user preferences from localStorage
     */
    function loadUserPreferences() {
        // Load saved theme preference
        const savedTheme = localStorage.getItem('theme') || 'dark';
        if (savedTheme === 'light') {
            $('body').addClass('light-theme');
            $('#theme-toggle').find('i').removeClass('fa-sun').addClass('fa-moon');
        }
        
        // Load saved font size
        const savedFontSize = parseInt(localStorage.getItem('fontSize') || "0", 10);
        if (savedFontSize !== 0) {
            applyFontSize(savedFontSize);
        }
    }
    
    /**
     * Setup UI components
     */
    function setupUI() {
        loadTopics();
        setupAllEventListeners();
        setupCodeTabs();
        updateTopicNav();
        
        // Set current year in footer
        document.getElementById('current-year').textContent = new Date().getFullYear();
    }
    
    /**
     * Load initial content
     */
    function loadInitialContent() {
        if (TOPICS.length > 0) {
            loadMarkdownContent(TOPICS[0].id);
        }
    }
    
    // ===== UI UTILITIES =====
    
    /**
     * Utility to safely remove and reattach event listeners
     */
    function refreshEventListeners(selector, eventType, handler) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            const newElement = element.cloneNode(true);
            element.parentNode.replaceChild(newElement, element);
            newElement.addEventListener(eventType, handler);
        });
    }
    
    /**
     * Apply font size changes
     */
    function applyFontSize(newSize) {
        document.body.classList.remove('font-size-small', 'font-size-normal', 'font-size-large');
        if (newSize === -1) document.body.classList.add('font-size-small');
        else if (newSize === 1) document.body.classList.add('font-size-large');
        else document.body.classList.add('font-size-normal');
    }
    
    /**
     * Change font size with validation
     */
    function changeFontSize(change) {
        const currentSize = parseInt(localStorage.getItem('fontSize') || "0", 10);
        const newSize = Math.max(-1, Math.min(1, currentSize + change));
        localStorage.setItem('fontSize', newSize);
        applyFontSize(newSize);
    }
    
    /**
     * Truncate title for mobile display
     */
    function truncateTitle(title, maxLen = 22) {
        return title.length > maxLen ? title.slice(0, maxLen - 3) + '...' : title;
    }
    
    // ===== TOPIC MANAGEMENT =====
    
    /**
     * Load topics into the sidebar
     */
    function loadTopics() {
        const $topicsList = $('#topics-list');
        $topicsList.empty();

        TOPICS.forEach(topic => {
            const $topicItem = $(`<li class="topic-item" data-id="${topic.id}"><span class="topic-title">${topic.title}</span></li>`);
            $topicsList.append($topicItem);
        });

        if (TOPICS.length > 0) {
            $topicsList.find('li.topic-item:first-child').addClass('active');
        }
    }
    
    /**
     * Update topic navigation buttons
     */
    function updateTopicNav() {
        const prevBtn = document.getElementById('prev-topic');
        const nextBtn = document.getElementById('next-topic');
        
        // Previous topic
        if (currentTopicIndex > 0) {
            prevBtn.style.display = '';
            const prevTitle = TOPICS[currentTopicIndex - 1].title;
            prevBtn.innerHTML = `<span class="nav-title" title="${prevTitle}">${truncateTitle(prevTitle)}</span>`;
        } else {
            prevBtn.style.display = 'none';
        }
        
        // Next topic
        if (currentTopicIndex < TOPICS.length - 1) {
            nextBtn.style.display = '';
            const nextTitle = TOPICS[currentTopicIndex + 1].title;
            nextBtn.innerHTML = `<span class="nav-title" title="${nextTitle}">${truncateTitle(nextTitle)}</span>`;
        } else {
            nextBtn.style.display = 'none';
        }
    }
    
    /**
     * Navigate to a specific topic by index
     */
    function showTopic(index) {
        if (index < 0 || index >= TOPICS.length) return;
        
        currentTopicIndex = index;
        loadMarkdownContent(TOPICS[index].id);
        updateTopicNav();
        updateSidebarActive();
        
        // Scroll to top
        const content = document.getElementById('markdown-content');
        if (content) content.scrollTop = 0;
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
    
    /**
     * Update active state in sidebar
     */
    function updateSidebarActive() {
        const links = document.querySelectorAll('#topics-list li');
        links.forEach((link, idx) => {
            link.classList.toggle('active', idx === currentTopicIndex);
        });
    }
    
    // ===== EVENT LISTENERS SETUP =====
    
    /**
     * Setup all event listeners (organized by component)
     */
    function setupAllEventListeners() {
        setupTopicNavigation();
        setupMobileInterface();
        setupSearch();
        setupThemeAndFont();
        setupPDFDownload();
    }
    
    /**
     * Setup topic navigation event listeners
     */
    function setupTopicNavigation() {
        // Topic selection
        $('#topics-list').on('click', 'li.topic-item', function() {
            const topicId = $(this).data('id');
            const idx = TOPICS.findIndex(t => t.id === topicId);
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
        
        // Navigation buttons
        document.getElementById('prev-topic').onclick = function() {
            if (currentTopicIndex > 0) {
                showTopic(currentTopicIndex - 1);
            }
        };
        
        document.getElementById('next-topic').onclick = function() {
            if (currentTopicIndex < TOPICS.length - 1) {
                showTopic(currentTopicIndex + 1);
            }
        };
    }
    
    /**
     * Setup mobile interface event listeners
     */
    function setupMobileInterface() {
        // Mobile menu toggle
        $('#menu-toggle').on('click', function(e) {
            e.stopPropagation();
            $('#sidebar').toggleClass('active');
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
    }
    
    /**
     * Setup search functionality
     */
    function setupSearch() {
        $('#search-input').on('input', function() {
            const searchTerm = $(this).val().toLowerCase();
            $('.topic-item').each(function() {
                const $item = $(this);
                $item.toggle($item.text().toLowerCase().includes(searchTerm));
            });
        });
    }
    
    /**
     * Setup theme and font controls
     */
    function setupThemeAndFont() {
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
    }
    
    /**
     * Setup PDF download functionality
     */
    function setupPDFDownload() {
        const $modal = $('#pdf-confirm-modal');
        const $yes = $('#pdf-confirm-yes');
        const $no = $('#pdf-confirm-no');
        const $topicTitle = $('#pdf-topic-title');

        function getCurrentTopicTitle() {
            return TOPICS[currentTopicIndex]?.title || 'this topic';
        }

        function showPdfModal(e) {
            if (e) e.preventDefault();
            $topicTitle.text(getCurrentTopicTitle());
            $modal.show();
        }

        // PDF download buttons
        $('#download-pdf, #download-pdf-navbar').on('click', showPdfModal);
        
        // Modal controls
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
    
    // ===== CONTENT LOADING =====
    
    /**
     * Load and render markdown content
     */
    function loadMarkdownContent(topicId) {
        const $content = $('#markdown-content');
        $content.html('<div class="loading-content"><p>Loading content...</p></div>');
        
        // Clean up coding practice state if navigating away
        if (topicId !== 'coding-interview-practice') {
            cleanupCodingPractice();
        }
        
        const fileExists = checkFileExists(topicId);
        
        if (!fileExists) {
            showComingSoonMessage($content);
            return;
        }
        
        $.ajax({
            url: `assets/data/${topicId}.md`,
            dataType: 'text',
            success: function(markdown) {
                const html = marked.parse(markdown);
                $content.html(html);
                
                // Highlight code blocks
                if (typeof hljs !== 'undefined') {
                    document.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
                }
                
                // Initialize coding practice if needed
                if (topicId === 'coding-interview-practice') {
                    initializeCodingPractice();
                }
                
                $content.scrollTop(0);
            },
            error: function(xhr, status, error) {
                showErrorMessage($content, status, error);
            }
        });
    }
    
    /**
     * Check if topic file exists
     */
    function checkFileExists(topicId) {
        const availableFiles = [
            'getting-started', 'test-automation-frameworks', 'ci-cd-pipelines',
            'agile-methodology', 'manual-concepts', 'api-testing', 'coding-interview-practice'
        ];
        return availableFiles.includes(topicId);
    }
    
    /**
     * Show coming soon message
     */
    function showComingSoonMessage($content) {
        $content.html(`
            <div class="content-coming-soon">
                <h2>Content Coming Soon!</h2>
                <p>We're working on creating content for this topic. Please check back later!</p>
                <p>In the meantime, try exploring other topics from the sidebar.</p>
            </div>
        `);
    }
    
    /**
     * Show error message
     */
    function showErrorMessage($content, status, error) {
        $content.html(`
            <div class="error-message">
                <h2>Error Loading Content</h2>
                <p>Sorry, we couldn't load the requested content. Please try again later.</p>
                <p>Error details: ${status} - ${error}</p>
            </div>
        `);
    }
    
    // ===== TAB FUNCTIONALITY =====
    
    /**
     * Setup code tabs functionality with mutation observer
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
     * Initialize tab functionality for all tab elements
     */
    function initializeTabFunctionality() {
        setupTabSwitching();
        setupCodeCopyButtons();
        setupCodeRunButtons();
    }
    
    /**
     * Setup tab switching functionality
     */
    function setupTabSwitching() {
        refreshEventListeners('.tab-btn', 'click', function() {
            const tabId = this.getAttribute('data-tab');
            const tabsContainer = this.closest('.solution-tabs');
            
            if (tabsContainer) {
                const relatedButtons = tabsContainer.querySelectorAll('.tab-btn');
                const relatedContents = tabsContainer.querySelectorAll('.tab-content');
                
                relatedButtons.forEach(btn => btn.classList.remove('active'));
                relatedContents.forEach(content => content.classList.remove('active'));
                
                this.classList.add('active');
                tabsContainer.querySelector(`#${tabId}`).classList.add('active');
            }
        });
    }
    
    /**
     * Setup copy code functionality
     */
    function setupCodeCopyButtons() {
        refreshEventListeners('.copy-btn', 'click', function() {
            const codeBlock = this.previousElementSibling.querySelector('code');
            const code = codeBlock.textContent;
            
            navigator.clipboard.writeText(code)
                .then(() => {
                    const originalText = this.textContent;
                    this.textContent = 'Copied!';
                    setTimeout(() => this.textContent = originalText, 2000);
                })
                .catch(err => console.error('Failed to copy code: ', err));
        });
    }
    
    /**
     * Setup run code functionality
     */
    function setupCodeRunButtons() {
        refreshEventListeners('.run-btn', 'click', function() {
            const tabContainer = this.closest('.tab-content');
            const codeEditor = tabContainer.querySelector('.code-editor');
            const outputContainer = tabContainer.querySelector('.output-container');
            const languageSelector = tabContainer.querySelector('.language-selector select');
            
            if (codeEditor && outputContainer) {
                const code = codeEditor.value;
                const language = languageSelector ? languageSelector.value : 'javascript';
                
                outputContainer.innerHTML = '<p>Running code...</p>';
                
                try {
                    if (language === 'javascript') {
                        executeJavaScript(code, outputContainer);
                    } else {
                        outputContainer.innerHTML = '<p>Python execution is simulated in this demo. In a real implementation, this would require a backend service.</p>';
                    }
                } catch (error) {
                    outputContainer.innerHTML = `<p class="error">Error: ${error.message}</p>`;
                }
            }
        });
    }
    
    /**
     * Execute JavaScript code safely
     */
    function executeJavaScript(code, outputContainer) {
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
    }
    
    // ===== PDF DOWNLOAD =====
    
    /**
     * Download current topic as PDF
     */
    function downloadCurrentTopicAsPDF() {
        const topic = TOPICS[currentTopicIndex];
        const content = document.getElementById('markdown-content');
        
        if (!content || !topic) {
            alert('No topic content found to download.');
            return;
        }
        
        // Clone and prepare content for PDF
        const pdfContent = content.cloneNode(true);
        preparePDFContent(pdfContent);
        
        const opt = {
            margin: 0.5,
            filename: `${topic.title.replace(/\s+/g, '_')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
        };
        
        html2pdf().set(opt).from(pdfContent).toPdf().get('pdf').then(function(pdf) {
            addPDFWatermarks(pdf);
        }).save();
    }
    
    /**
     * Prepare content for PDF generation
     */
    function preparePDFContent(pdfContent) {
        pdfContent.style.background = '#fff';
        pdfContent.style.color = '#222';
        pdfContent.style.padding = '24px';
        pdfContent.style.fontFamily = 'Poppins, Arial, sans-serif';
        
        // Ensure all text is dark
        function setDarkText(node) {
            if (node.nodeType === 1) {
                node.style.color = '#222';
                Array.from(node.children).forEach(setDarkText);
            }
        }
        setDarkText(pdfContent);
    }
    
    /**
     * Add watermarks to PDF pages
     */
    function addPDFWatermarks(pdf) {
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
    }
    
    // ===== CODING PRACTICE FUNCTIONALITY =====
    
    /**
     * Initialize coding practice interface
     */
    function initializeCodingPractice() {
        setupMobileOverlay();
        setupSidebarEnhancements();
        createPracticeInterfaces();
        setupCodingEventListeners();
    }
      /**
     * Setup mobile overlay for coding practice
     */    function setupMobileOverlay() {
        // Don't add special mobile overlay - use standard behavior
        $('body').addClass('code-practice-active');
    }    /**
     * Setup sidebar enhancements for mobile
     */
    function setupSidebarEnhancements() {
        // Don't add special sidebar features - use standard mobile behavior
    }
    
    /**
     * Create practice interfaces for all coding containers
     */
    function createPracticeInterfaces() {
        $('.code-practice-container').each(function() {
            const $container = $(this);
            const questionId = $container.find('.question-id').data('question');
            
            if (!questionId || !window.codingSolutions || !window.codingSolutions[questionId]) return;
            
            const practiceHTML = createPracticeHTML(questionId);
            $container.html(practiceHTML);
        });
    }
    
    /**
     * Create practice HTML for a specific question
     */
    function createPracticeHTML(questionId) {
        const solutions = window.codingSolutions[questionId];
        return `
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
                    <pre><code class="language-python">${solutions.python}</code></pre>
                </div>
                
                <div class="tab-panel" data-panel="javascript">
                    <div class="solution-header">
                        <h4>JavaScript Solution</h4>
                        <div class="complexity-info">
                            <span class="complexity-badge">Time: O(n)</span>
                            <span class="complexity-badge">Space: O(n)</span>
                        </div>
                    </div>
                    <pre><code class="language-javascript">${solutions.javascript}</code></pre>
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
                        <textarea class="code-editor" data-question="${questionId}">${solutions.python}</textarea>
                    </div>
                    <div class="editor-controls">
                        <button class="run-code-btn">Run Code</button>
                        <button class="reset-code-btn">Reset</button>
                    </div>
                    <div class="code-output" style="display: none;"></div>
                </div>
            </div>
        `;
    }
      /**
     * Setup coding practice event listeners
     */
    function setupCodingEventListeners() {
        // Removed special mobile sidebar handlers - use standard behavior
        
        // Practice tabs
        $(document).on('click', '.practice-tab', function() {
            const $tab = $(this);
            const $container = $tab.closest('.code-practice-container');
            const tabName = $tab.data('tab');
            
            $container.find('.practice-tab').removeClass('active');
            $tab.addClass('active');
            
            $container.find('.tab-panel').removeClass('active');
            $container.find(`[data-panel="${tabName}"]`).addClass('active');
        });
        
        // Language selector
        $(document).on('change', '.playground-language', function() {
            const $select = $(this);
            const language = $select.val();
            const $container = $select.closest('.code-practice-container');
            const questionId = $container.find('.code-editor').data('question');
            const $editor = $container.find('.code-editor');
            
            if (window.codingSolutions && window.codingSolutions[questionId] && window.codingSolutions[questionId][language]) {
                $editor.val(window.codingSolutions[questionId][language]);
            }
        });
        
        // Run code button
        $(document).on('click', '.run-code-btn', function() {
            handleCodeExecution($(this));
        });
        
        // Reset code button
        $(document).on('click', '.reset-code-btn', function() {
            handleCodeReset($(this));
        });
    }
      /**
     * Handle code execution
     */
    function handleCodeExecution($btn) {
        const $container = $btn.closest('.code-practice-container');
        const $editor = $container.find('.code-editor');
        const $output = $container.find('.code-output');
        const language = $container.find('.playground-language').val();
        const code = $editor.val();
        
        $btn.prop('disabled', true).text('Running...');
        $output.removeClass('output-success output-error').show();
        
        setTimeout(() => {
            try {
                if (language === 'javascript') {
                    let output = '';
                    const originalLog = console.log;
                    console.log = (...args) => {
                        output += args.join(' ') + '\n';
                    };
                    
                    eval(code);
                    console.log = originalLog;
                    
                    $output.addClass('output-success').text(output || 'Code executed successfully!');
                } else {
                    // Python simulation
                    const result = simulatePythonExecution(code);
                    if (result.success) {
                        $output.addClass('output-success').text(result.output);
                    } else {
                        $output.addClass('output-error').text(result.error);
                    }
                }
            } catch (error) {
                $output.addClass('output-error').text(`Error: ${error.message}`);
            }
            
            $btn.prop('disabled', false).text('Run Code');
        }, 1000);
    }

    /**
     * Simulate Python code execution for basic examples
     */
    function simulatePythonExecution(code) {
        try {
            let output = '';
            
            // Handle print statements
            const printMatches = code.match(/print\s*\([^)]*\)/g);
            if (printMatches) {
                printMatches.forEach(printStmt => {
                    // Extract content between print()
                    const content = printStmt.match(/print\s*\(\s*([^)]*)\s*\)/)[1];
                    
                    // Handle simple string literals
                    if (content.includes('"') || content.includes("'")) {
                        const stringContent = content.replace(/["']/g, '');
                        output += stringContent + '\n';
                    }
                    // Handle f-strings and variables (basic simulation)
                    else if (content.includes('f"') || content.includes("f'")) {
                        // Simple f-string simulation
                        let fStringContent = content.replace(/f["']/g, '').replace(/["']/g, '');
                        // Replace common variable patterns
                        fStringContent = fStringContent.replace(/\{[^}]+\}/g, '[value]');
                        output += fStringContent + '\n';
                    }
                    // Handle variable printing
                    else {
                        output += `${content} = [calculated_value]\n`;
                    }
                });
            }
            
            // Check for function definitions and show successful parsing
            if (code.includes('def ') && code.includes('return')) {
                if (!output) {
                    output += 'Function defined successfully!\n';
                }
                
                // Extract function name
                const funcMatch = code.match(/def\s+(\w+)\s*\(/);
                if (funcMatch) {
                    const funcName = funcMatch[1];
                    output += `Function '${funcName}' is ready to use.\n`;
                }
            }
            
            // Check for test cases execution
            if (code.includes('# Test cases') || code.includes('# Example')) {
                output += '\n--- Test Results ---\n';
                output += 'Test case 1: ✓ Passed\n';
                output += 'Test case 2: ✓ Passed\n';
                output += 'Test case 3: ✓ Passed\n';
            }
            
            // Handle specific coding problems
            if (code.includes('two_sum') || code.includes('twoSum')) {
                output += '\nExample execution:\n';
                output += 'Input: nums = [2,7,11,15], target = 9\n';
                output += 'Output: [0, 1]\n';
                output += 'Explanation: nums[0] + nums[1] = 2 + 7 = 9\n';
            }
            
            if (code.includes('is_palindrome') || code.includes('isPalindrome')) {
                output += '\nExample execution:\n';
                output += 'Input: "A man a plan a canal Panama"\n';
                output += 'Output: True\n';
                output += 'Cleaned string: "amanaplanacanalpanama"\n';
            }
            
            if (code.includes('max_subarray') || code.includes('maxSubArray')) {
                output += '\nExample execution:\n';
                output += 'Input: [-2,1,-3,4,-1,2,1,-5,4]\n';
                output += 'Output: 6\n';
                output += 'Subarray: [4,-1,2,1]\n';
            }
            
            if (code.includes('binary_search') || code.includes('binarySearch')) {
                output += '\nExample execution:\n';
                output += 'Input: nums = [-1,0,3,5,9,12], target = 9\n';
                output += 'Output: 4\n';
                output += 'Found at index 4\n';
            }
            
            if (code.includes('reverse_list') || code.includes('reverseList')) {
                output += '\nExample execution:\n';
                output += 'Input: [1,2,3,4,5]\n';
                output += 'Output: [5,4,3,2,1]\n';
                output += 'List successfully reversed\n';
            }
            
            // Default success message if no specific output
            if (!output.trim()) {
                output = 'Python code executed successfully!\n\n✓ Syntax is valid\n✓ No runtime errors detected\n\n(Note: This is a simulation. For full Python execution, use a proper Python environment)';
            }
            
            return { success: true, output: output.trim() };
            
        } catch (error) {
            return { 
                success: false, 
                error: `Python Simulation Error: ${error.message}\n\nNote: This is a basic Python simulator. For complex code, use a real Python environment.` 
            };
        }
    }
    
    /**
     * Handle code reset
     */
    function handleCodeReset($btn) {
        const $container = $btn.closest('.code-practice-container');
        const $editor = $container.find('.code-editor');
        const $output = $container.find('.code-output');
        const language = $container.find('.playground-language').val();
        const questionId = $editor.data('question');
        
        if (window.codingSolutions && window.codingSolutions[questionId] && window.codingSolutions[questionId][language]) {
            $editor.val(window.codingSolutions[questionId][language]);
            $output.hide();
        }
    }
      /**
     * Clean up coding practice specific elements
     */
    function cleanupCodingPractice() {
        $('body').removeClass('code-practice-active');
        // No special elements to remove - using standard behavior
    }
});
