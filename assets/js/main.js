/**
 * SDET Learning Hub - Main JavaScript
 * Handles loading and rendering of markdown content
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
        const availableFiles = ['getting-started', 'test-automation-frameworks', 'ci-cd-pipelines','agile-methodology','manual-concepts', 'api-testing'];
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
                // Parse markdown to HTML using marked.js
                const html = marked.parse(markdown);
                
                // Update the content area with the parsed HTML
                $content.html(html);
                
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
});