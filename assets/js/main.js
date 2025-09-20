/**
 * SDET Learning Hub - Main JavaScript
 * Handles loading and rendering of markdown content, tab system, and code execution
 */

$(document).ready(function() {
    // Register service worker for PWA support
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/assets/js/service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(error => {
                    console.log('ServiceWorker registration failed: ', error);
                });
        });
    }
    
    // Add PWA install prompt
    let deferredPrompt;
    const installButton = document.createElement('button');
    installButton.style.display = 'none';
    installButton.classList.add('install-button');
    installButton.textContent = 'Install App';
    document.querySelector('.header-controls').prepend(installButton);
    
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        // Update UI to notify the user they can add to home screen
        installButton.style.display = 'block';
    });
    
    installButton.addEventListener('click', (e) => {
        // Hide our user interface that shows our A2HS button
        installButton.style.display = 'none';
        // Show the prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            deferredPrompt = null;
        });
    });
    
    // Define available topics (in a real app, this might come from an API)
    const topics = [
        { 
            id: 'getting-started', 
            title: 'Getting Started with SDET'
        },
        { 
            id: 'manual-concepts', 
            title: 'Manual Concepts'
        },
        { 
            id: 'agile-methodology', 
            title: 'Agile Methodology'
        },
        { 
            id: 'ci-cd-pipelines', 
            title: 'CI/CD Pipelines for Testing'
        },
        { 
            id: 'api-testing', 
            title: 'API Testing Fundamentals'
        },
        { 
            id: 'test-automation-frameworks', 
            title: 'Test Automation Frameworks'
        },
        { 
            id: 'code-interview', 
            title: 'Coding Interview Questions'
        },
        { 
            id: 'selenium-webdriver', 
            title: 'Selenium WebDriver Deep Dive'
        },
        { 
            id: 'mobile-testing', 
            title: 'Mobile App Testing'
        },
        { 
            id: 'performance-testing', 
            title: 'Performance Testing Basics'
        },
        { 
            id: 'test-design', 
            title: 'Test Design Patterns'
        }
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
        $('#current-year').text(new Date().getFullYear());
        
        // Load the first topic by default (if available)
        if (topics.length > 0) {
            loadMarkdownContent(topics[0].id);
        }
    }

    /**
     * Load topics into the sidebar with simplified structure
     */
    function loadTopics() {
        const $topicsList = $('#topics-list');
        $topicsList.empty();

        topics.forEach(topic => {
            // Create topic item
            const $topicItem = $(`
                <li class="topic-item" data-id="${topic.id}">
                    <span class="topic-title">${topic.title}</span>
                </li>
            `);
            
            // Add to the topics list
            $topicsList.append($topicItem);
        });

        // Set the first topic as active
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
            
            // Update active state
            $('#topics-list li').removeClass('active');
            $(this).addClass('active');
            
            // Load the selected markdown content
            loadMarkdownContent(topicId);
            
            // Reset scroll position to top
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
            
            // Search through all topics
            $('.topic-item').each(function() {
                const itemText = $(this).text().toLowerCase();
                const $item = $(this);
                
                if (itemText.includes(searchTerm)) {
                    $item.show();
                } else {
                    $item.hide();
                }
            });
        });

        // Close sidebar when clicking outside on mobile
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
            
            // Save theme preference
            const isLightTheme = $('body').hasClass('light-theme');
            localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
            
            // Update toggle icon
            const $icon = $(this).find('i');
            if (isLightTheme) {
                $icon.removeClass('fa-sun').addClass('fa-moon');
            } else {
                $icon.removeClass('fa-moon').addClass('fa-sun');
            }
        });

        // Font size controls
        $('#font-decrease').on('click', function() {
            changeFontSize(-1);
        });
        
        $('#font-increase').on('click', function() {
            changeFontSize(1);
        });
        
        // Load saved theme preference
        const savedTheme = localStorage.getItem('theme') || 'dark';
        if (savedTheme === 'light') {
            $('body').addClass('light-theme');
            $('#theme-toggle').find('i').removeClass('fa-sun').addClass('fa-moon');
        }
        
        // Load saved font size
        const savedFontSize = localStorage.getItem('fontSize') || 0;
        if (savedFontSize !== 0) {
            changeFontSize(parseInt(savedFontSize));
        }
    }
    
    /**
     * Change font size of content
     * @param {number} change - Amount to change (positive to increase, negative to decrease)
     */
    function changeFontSize(change) {
        const currentSize = parseInt(localStorage.getItem('fontSize') || 0);
        const newSize = Math.max(-1, Math.min(1, currentSize + change));
        
        // Save the new size
        localStorage.setItem('fontSize', newSize);
        
        // Apply the font size to body
        document.body.classList.remove('font-size-small', 'font-size-normal', 'font-size-large');
        
        if (newSize === -1) {
            document.body.classList.add('font-size-small');
        } else if (newSize === 1) {
            document.body.classList.add('font-size-large');
        } else {
            document.body.classList.add('font-size-normal');
        }
    }

    /**
     * Load and render markdown content
     * @param {string} topicId - The ID of the topic to load
     */
    function loadMarkdownContent(topicId) {
        const $content = $('#markdown-content');
        
        // Show loading state
        $content.html('<div class="loading-content"><p>Loading content...</p></div>');
        
        // Map topic IDs to their correct file names
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
        
        // Get the base topic ID for file path
        let baseTopicId = topicId;
        
        // Check if we need to map this topic ID to a different filename
        if (topicFileMap[baseTopicId]) {
            baseTopicId = topicFileMap[baseTopicId];
        }
        
        // Check if the file exists in our known files list
        const availableFiles = ['getting-started', 'test-automation-frameworks', 'ci-cd-pipelines','agile-methodology','manual-concepts', 'api-testing', 'code-interview'];
        const fileExists = availableFiles.includes(baseTopicId);
        
        // If file doesn't exist, show a friendly message
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
        
        // Fetch the markdown file
        $.ajax({
            url: `assets/data/${baseTopicId}.md`,
            dataType: 'text',
            success: function(markdown) {
                // Process markdown with custom extensions
                const html = processMarkdown(markdown);
                
                // Update the content area with the parsed HTML
                $content.html(html);
                
                // Initialize tab system
                initTabSystem();
                
                // Check if this is a subtopic by looking for a hyphen in the ID
                const isSubtopic = topicId.includes('-') && topicId !== baseTopicId;
                
                // If it's a subtopic, expand its parent topic
                if (isSubtopic) {
                    // Find the parent topic
                    const $parentTopic = $(`#topics-list li[data-id="${baseTopicId}"]`);
                    const $subtopicsList = $parentTopic.next('.subtopics');
                    const $toggleIcon = $parentTopic.find('.toggle-icon');
                    
                    // Expand the subtopics list
                    $subtopicsList.addClass('expanded');
                    $toggleIcon.addClass('rotated');
                    
                    // Make sure the subtopic is visible and highlighted
                    const $subtopicItem = $(`#topics-list li[data-id="${topicId}"]`);
                    $subtopicItem.addClass('active').show();
                    
                    // Extract the section ID from the subtopic ID (part after the base topic ID)
                    const sectionId = topicId.substring(baseTopicId.length + 1);
                    
                    // Try to find a heading with that ID or similar text
                    const $section = $(`#markdown-content h1[id="${sectionId}"], #markdown-content h2[id="${sectionId}"], #markdown-content h3[id="${sectionId}"]`);
                    
                    if ($section.length) {
                        // Scroll to the section with a slight delay to ensure content is rendered
                        setTimeout(() => {
                            $section[0].scrollIntoView({ behavior: 'smooth' });
                            
                            // Highlight the section briefly
                            $section.addClass('highlight-section');
                            setTimeout(() => {
                                $section.removeClass('highlight-section');
                            }, 2000);
                        }, 100);
                    }
                } else {
                    // Scroll to top for main topics
                    $content.scrollTop(0);
                }
                
                // Apply syntax highlighting to code blocks if hljs is available
                if (typeof hljs !== 'undefined') {
                    document.querySelectorAll('pre code').forEach((block) => {
                        hljs.highlightElement(block);
                    });
                }
                
                // Initialize Mermaid diagrams if available
                if (typeof mermaid !== 'undefined') {
                    mermaid.init(undefined, document.querySelectorAll('.mermaid'));
                }
            },
            error: function(xhr, status, error) {
                // Handle error
                $content.html(`
                    <div class="error-message">
                        <h2>Error Loading Content</h2>
                        <p>Sorry, we couldn't load the requested content. Please try again later.</p>
                        <p>Error details: ${error}</p>
                    </div>
                `);
            }
        });
    }
    
    /**
     * Process markdown content with custom extensions
     * @param {string} markdown - The markdown content to process
     * @returns {string} - The processed HTML
     */
    function processMarkdown(markdown) {
        // Configure marked options
        marked.setOptions({
            breaks: true,
            gfm: true,
            headerIds: true
        });

        // Custom renderer for code blocks
        const renderer = new marked.Renderer();
        
        // Store the original code renderer
        const originalCodeRenderer = renderer.code;
        
        // Custom code renderer
        renderer.code = function(code, language) {
            if (language === 'mermaid') {
                return `<div class="mermaid">${code}</div>`;
            }
            return originalCodeRenderer.call(this, code, language);
        };

        // Process the markdown
        let html = marked.parse(markdown, { renderer });
        
        // Process custom tab elements
        html = processTabElements(html);
        
        // Process code execution blocks
        html = processCodeExecutionBlocks(html);
        
        return html;
    }
    
    /**
     * Process custom tab elements in HTML
     * @param {string} html - The HTML content
     * @returns {string} - Processed HTML with tab system
     */
    function processTabElements(html) {
        // Regular expression to find tab elements
        const tabsRegex = /<tabs>([\s\S]*?)<\/tabs>/g;
        
        return html.replace(tabsRegex, function(match, tabsContent) {
            // Extract individual tabs
            const tabRegex = /<tab name="(.*?)">([\s\S]*?)<\/tab>/g;
            let tabMatch;
            let tabNavItems = '';
            let tabContentItems = '';
            let index = 0;
            
            // Generate unique ID for this tab group
            const tabGroupId = 'tabs-' + Math.random().toString(36).substr(2, 9);
            
            // Process each tab
            while ((tabMatch = tabRegex.exec(tabsContent)) !== null) {
                const tabName = tabMatch[1];
                const tabContent = tabMatch[2];
                const tabId = `${tabGroupId}-tab-${index}`;
                const isActive = index === 0 ? 'active' : '';
                
                tabNavItems += `<button class="tab-button ${isActive}" data-tab="${tabId}">${tabName}</button>`;
                tabContentItems += `<div id="${tabId}" class="tab-content ${isActive}">${tabContent}</div>`;
                
                index++;
            }
            
            // Return the complete tab system HTML
            return `
                <div class="tabs" id="${tabGroupId}">
                    <div class="tab-nav">${tabNavItems}</div>
                    ${tabContentItems}
                </div>
            `;
        });
    }
    
    /**
     * Process code execution blocks
     * @param {string} html - The HTML content
     * @returns {string} - Processed HTML with code execution blocks
     */
    function processCodeExecutionBlocks(html) {
        // Regular expression to find code execution blocks
        const codeExecRegex = /<code-execution language="(.*?)">([\s\S]*?)<\/code-execution>/g;
        
        return html.replace(codeExecRegex, function(match, language, code) {
            // Generate unique ID for this code execution block
            const blockId = 'code-exec-' + Math.random().toString(36).substr(2, 9);
            
            return `
                <div class="code-execution" id="${blockId}" data-language="${language}">
                    <pre><code class="language-${language}">${escapeHtml(code)}</code></pre>
                    <button class="run-button" data-target="${blockId}" onclick="executeCode('${blockId}', '${language}')">Run Code</button>
                    <div class="code-execution-result" id="${blockId}-result"></div>
                </div>
            `;
        });
    }
    
    /**
     * Execute code from the Result tab or code execution blocks
     * @param {string|Element} inputIdOrElement - The input element or ID
     * @param {string} resultIdOrLanguage - The result area ID or language
     */
    function executeCode(inputIdOrElement, resultIdOrLanguage) {
        let code, language, resultArea;
        
        // Handle different calling scenarios
        if (typeof inputIdOrElement === 'string' && inputIdOrElement.startsWith('code-input')) {
            // Called from Result tab
            const codeInputId = inputIdOrElement;
            const resultAreaId = resultIdOrLanguage;
            
            // Get the code and language
            const codeInput = document.getElementById(codeInputId);
            const languageSelector = document.getElementById(codeInputId === 'code-input' ? 'language-selector' : 'language-selector-2');
            
            if (!codeInput || !languageSelector) {
                console.error('Code input or language selector not found');
                return;
            }
            
            code = codeInput.value;
            language = languageSelector.value;
            resultArea = document.getElementById(resultAreaId);
        } else if (typeof inputIdOrElement === 'string' && inputIdOrElement.startsWith('code-exec-')) {
            // Called from code execution block
            const blockId = inputIdOrElement;
            language = resultIdOrLanguage;
            
            // Get the code from the pre>code element
            const codeBlock = document.querySelector(`#${blockId} pre code`);
            if (!codeBlock) {
                console.error('Code block not found');
                return;
            }
            
            code = codeBlock.textContent;
            resultArea = document.getElementById(`${blockId}-result`);
        } else {
            console.error('Invalid parameters for executeCode');
            return;
        }
        
        if (!resultArea) {
            console.error('Result area not found');
            return;
        }
        
        // Show loading message
        resultArea.innerHTML = 'Executing code...';
        resultArea.style.display = 'block';
        resultArea.classList.remove('execution-error');
        resultArea.classList.remove('execution-success');
        
        // Simulate code execution (in a real app, this would send to a backend)
        setTimeout(() => {
            try {
                let result;
                
                if (language === 'javascript') {
                    // For JavaScript, we can actually execute it in the browser
                    try {
                        // Capture console.log output
                        const originalLog = console.log;
                        let logs = [];
                        
                        console.log = function() {
                            logs.push(Array.from(arguments).join(' '));
                            originalLog.apply(console, arguments);
                        };
                        
                        // Execute the code
                        eval(code);
                        
                        // Restore console.log
                        console.log = originalLog;
                        
                        // Display the logs
                        result = logs.join('<br>');
                        resultArea.classList.add('execution-success');
                    } catch (error) {
                        result = 'Error: ' + error.message;
                        resultArea.classList.add('execution-error');
                    }
                } else if (language === 'python') {
                    // For Python, we would need a backend service
                    // This is a simulation
                    if (code.includes('reverse_string')) {
                        result = "['o', 'l', 'l', 'e', 'h']";
                        resultArea.classList.add('execution-success');
                    } else if (code.includes('find_duplicate')) {
                        result = "2";
                        resultArea.classList.add('execution-success');
                    } else {
                        result = "Simulated Python execution result";
                        resultArea.classList.add('execution-success');
                    }
                } else {
                    result = `Execution for ${language} is not supported in this demo.`;
                    resultArea.classList.add('execution-error');
                }
                
                resultArea.innerHTML = result;
            } catch (error) {
                resultArea.innerHTML = 'Error: ' + error.message;
                resultArea.classList.add('execution-error');
            }
        }, 500);
    }
    
    // Make executeCode function globally available
    window.mainExecuteCode = executeCode;
    
    /**
     * Copy code to clipboard
     * @param {Element} button - The button that was clicked
     */
    function copyCode(button) {
        // Find the closest pre > code element
        const codeBlock = button.parentElement.querySelector('pre code') || 
                          button.parentElement.querySelector('code');
        
        if (!codeBlock) {
            console.error('No code block found to copy');
            return;
        }
        
        // Get the text content
        const codeText = codeBlock.textContent;
        
        // Create a temporary textarea to copy from
        const textarea = document.createElement('textarea');
        textarea.value = codeText;
        textarea.style.position = 'fixed';  // Prevent scrolling to the bottom
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            // Execute the copy command
            document.execCommand('copy');
            
            // Visual feedback
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.style.backgroundColor = 'var(--primary-color)';
            button.style.color = 'white';
            
            // Reset after a short delay
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = '';
                button.style.color = '';
            }, 1500);
        } catch (err) {
            console.error('Failed to copy code: ', err);
        } finally {
            // Clean up
            document.body.removeChild(textarea);
        }
    }
    
    /**
     * Escape HTML special characters
     * @param {string} html - The HTML string to escape
     * @returns {string} - Escaped HTML string
     */
    function escapeHtml(html) {
        const escapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        
        return html.replace(/[&<>"']/g, function(m) {
            return escapeMap[m];
        });
    }
    
    /**
     * Initialize tab system event handlers
     */
    function initTabSystem() {
        // Tab switching
        $('.tab-button').off('click').on('click', function() {
            const tabId = $(this).data('tab');
            const $tabGroup = $(this).closest('.tabs');
            
            // Update active tab button
            $tabGroup.find('.tab-button').removeClass('active');
            $(this).addClass('active');
            
            // Update active tab content
            $tabGroup.find('.tab-content').removeClass('active');
            $(`#${tabId}`).addClass('active');
        });
        
        // Code execution
        $('.run-button').off('click').on('click', function() {
            const targetId = $(this).data('target');
            const $codeBlock = $(`#${targetId}`);
            const language = $codeBlock.data('language');
            const code = $codeBlock.find('code').text();
            const $resultArea = $(`#${targetId}-result`);
            
            // Show loading indicator
            $resultArea.html('<div class="loading">Executing code...</div>');
            $resultArea.show();
            
            // Execute the code based on language
            executeCode(code, language, $resultArea);
        });
    }
    
    /**
     * Execute code and display results
     * @param {string} code - The code to execute
     * @param {string} language - The programming language
     * @param {jQuery} $resultArea - The result display area
     */
    function executeCode(code, language, $resultArea) {
        // In a real application, this would send the code to a backend service
        // For this demo, we'll simulate execution with predefined outputs
        
        setTimeout(() => {
            try {
                let result = '';
                
                if (language === 'python') {
                    // Simulate Python execution
                    if (code.includes('reverse_string')) {
                        result = "['o', 'l', 'l', 'e', 'h']";
                    } else if (code.includes('find_duplicate')) {
                        result = "2";
                    } else if (code.includes('test_api_get')) {
                        result = `API GET request simulation:
{
    "userId": 1,
    "id": 1,
    "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    "body": "quia et suscipit\\nsuscipit recusandae consequuntur expedita et cum\\nreprehenderit molestiae ut ut quas totam\\nnostrum rerum est autem sunt rem eveniet architecto"
}
API test passed!`;
                    } else {
                        result = "Code executed successfully!";
                    }
                } else if (language === 'javascript') {
                    // Simulate JavaScript execution
                    if (code.includes('reverseString')) {
                        result = "['o', 'l', 'l', 'e', 'h']";
                    } else if (code.includes('findDuplicate')) {
                        result = "2";
                    } else if (code.includes('testApiGet')) {
                        result = `API test passed!
Response: {
    "userId": 1,
    "id": 1,
    "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    "body": "quia et suscipit\\nsuscipit recusandae consequuntur expedita et cum\\nreprehenderit molestiae ut ut quas totam\\nnostrum rerum est autem sunt rem eveniet architecto"
}`;
                    } else {
                        result = "Code executed successfully!";
                    }
                } else {
                    result = "Unsupported language for execution";
                }
                
                // Display the result
                $resultArea.html(`<pre>${result}</pre>`);
                
            } catch (error) {
                // Display error
                $resultArea.html(`<pre class="error">Error: ${error.message}</pre>`);
            }
        }, 1000); // Simulate execution delay
    }
});