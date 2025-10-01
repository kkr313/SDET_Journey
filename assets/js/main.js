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
        // { id: 'code-interview', title: 'Coding Interview Prep' },
        { id: 'selenium-webdriver', title: 'Selenium WebDriver Deep Dive' },
        { id: 'mobile-testing', title: 'Mobile App Testing' },
        { id: 'performance-testing', title: 'Performance Testing Basics' },
        { id: 'test-design', title: 'Test Design Patterns' }
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
    }

    // --- Improved Topic Navigation ---
    const topicFiles = [
        { id: 'getting-started', title: 'Getting Started with SDET' },
        { id: 'manual-concepts', title: 'Manual Concepts' },
        { id: 'agile-methodology', title: 'Agile Methodology' },
        { id: 'api-testing', title: 'API Testing Fundamentals' },
        { id: 'test-automation-frameworks', title: 'Test Automation Frameworks' },
        { id: 'ci-cd-pipelines', title: 'CI/CD Pipelines for Testing' },
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
            prevBtn.innerHTML = `<span class="nav-icon"><i class="fas fa-arrow-left"></i></span><span class="nav-title" title="${topicFiles[currentTopicIndex-1].title}">${truncateTitle(topicFiles[currentTopicIndex-1].title)}</span>`;
        } else {
            prevBtn.style.display = 'none';
        }
        // Next topic
        if (currentTopicIndex < topicFiles.length - 1) {
            nextBtn.style.display = '';
            nextBtn.innerHTML = `<span class="nav-title" title="${topicFiles[currentTopicIndex+1].title}">${truncateTitle(topicFiles[currentTopicIndex+1].title)}</span><span class="nav-icon"><i class="fas fa-arrow-right"></i></span>`;
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
        if (!content) return;
        // Clone content for PDF
        const pdfContent = content.cloneNode(true);
        // Force white background and dark text for PDF
        pdfContent.style.background = '#fff';
        pdfContent.style.color = '#222';
        pdfContent.style.padding = '24px';
        pdfContent.style.fontFamily = 'Poppins, Arial, sans-serif';
        // Recursively set all text to dark
        (function setDarkText(node) {
            if (node.nodeType === 1) {
                node.style.color = '#222';
                Array.from(node.children).forEach(setDarkText);
            }
        })(pdfContent);
        // Use html2pdf and add watermark + page number to every page
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
                // Watermark
                pdf.setFontSize(30);
                pdf.setTextColor(220, 220, 220); // very light gray
                pdf.text('qa-journey.netlify.app', pdf.internal.pageSize.getWidth()/2, pdf.internal.pageSize.getHeight()/2, {
                    angle: 30, align: 'center'
                });
                // Page number (top right)
                pdf.setFontSize(12);
                pdf.setTextColor(80, 80, 80);
                pdf.text(`Page ${i}`, pdf.internal.pageSize.getWidth() - 0.7, 0.7, {align: 'right'});
            }
        }).save();
    }

    // Initial topic nav setup
    updateTopicNav();
});
