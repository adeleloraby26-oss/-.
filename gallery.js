document.addEventListener('DOMContentLoaded', () => {
    const galleryImageWrapper = document.querySelector('.gallery-image-wrapper');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const projectTitleElem = document.getElementById('project-title');

    // Fullscreen modal elements
    const fullscreenModal = document.getElementById('fullscreen-modal');
    const fullscreenImage = document.getElementById('fullscreen-image');
    const fullscreenClose = document.getElementById('fullscreen-close');
    const fullscreenPrev = document.getElementById('fullscreen-prev');
    const fullscreenNext = document.getElementById('fullscreen-next');
    const fullscreenCounter = document.getElementById('fullscreen-counter');

    let allProjectsData = {}; // To store data from projects.json
    let currentProject = null;
    let currentImageIndex = 0;

    // Function to get project name from URL query parameter
    const getProjectFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('project');
    };

    // Function to fetch project data from JSON
    const fetchProjectData = async () => {
        try {
            const response = await fetch('static/data/projects.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allProjectsData = await response.json();
            const project = getProjectFromUrl();
            if (project && allProjectsData[project]) {
                loadProject(project);
            } else {
                galleryImageWrapper.innerHTML = '<p style="color: var(--text-light); text-align: center;">Project not found or no project selected. Please select a project from the <a href="index.html#projects" style="color: var(--primary-blue); text-decoration: none;">Projects</a> section.</p>';
                projectTitleElem.textContent = 'Project Gallery';
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            }
        } catch (error) {
            console.error('Error fetching project data:', error);
            galleryImageWrapper.innerHTML = '<p style="color: var(--text-light); text-align: center;">Failed to load project data. Please try again later.</p>';
            projectTitleElem.textContent = 'Project Gallery';
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        }
    };

    // Function to load and display images for the current project
    const loadProject = (projectName) => {
        currentProject = projectName;
        const projectInfo = allProjectsData[currentProject];
        const images = projectInfo.images;
        const imageFolder = projectInfo.image_folder;

        if (!images || images.length === 0) {
            galleryImageWrapper.innerHTML = '<p style="color: var(--text-light); text-align: center;">No images found for this project.</p>';
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            projectTitleElem.textContent = projectInfo.name + ' Gallery';
            return;
        }

        projectTitleElem.textContent = projectInfo.name + ' Gallery';

        galleryImageWrapper.innerHTML = ''; // Clear existing images
        images.forEach((filename, index) => {
            const img = document.createElement('img');
            img.src = imageFolder + filename; // Construct full path
            img.alt = `${projectInfo.name} image ${index + 1}`;
            img.classList.add('gallery-image');
            if (index === currentImageIndex) {
                img.classList.add('active');
            }
            
            // Add click event for fullscreen
            img.addEventListener('click', () => openFullscreen(index));
            
            galleryImageWrapper.appendChild(img);
        });

        updateNavigationButtons();
    };

    // Function to show a specific image with flipping animation
    const showImage = (index, direction) => {
        const images = galleryImageWrapper.querySelectorAll('.gallery-image');
        if (images.length === 0) return;

        // Remove active class from current image
        if (images[currentImageIndex]) {
            images[currentImageIndex].classList.remove('active');
            // Add exit animation
            if (direction === 'next') {
                images[currentImageIndex].style.transform = 'rotateY(-90deg)';
            } else if (direction === 'prev') {
                images[currentImageIndex].style.transform = 'rotateY(90deg)';
            }
            images[currentImageIndex].style.opacity = '0';
        }

        currentImageIndex = (index + images.length) % images.length; // Loop through images

        // Add active class to new image and reset transform for entry animation
        images[currentImageIndex].style.transform = direction === 'next' ? 'rotateY(90deg)' : 'rotateY(-90deg)';
        images[currentImageIndex].style.opacity = '0';
        // Force reflow to ensure animation restarts
        void images[currentImageIndex].offsetWidth; 
        images[currentImageIndex].classList.add('active');
        images[currentImageIndex].style.transform = 'rotateY(0deg)';
        images[currentImageIndex].style.opacity = '1';

        updateNavigationButtons();
    };

    // Function to update navigation button visibility
    const updateNavigationButtons = () => {
        const projectInfo = allProjectsData[currentProject];
        const images = projectInfo ? projectInfo.images : [];
        if (images && images.length > 1) {
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'block';
        } else {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        }
    };

    // Fullscreen functions
    const openFullscreen = (imageIndex) => {
        const projectInfo = allProjectsData[currentProject];
        const images = projectInfo.images;
        const imageFolder = projectInfo.image_folder;
        
        currentImageIndex = imageIndex;
        fullscreenImage.src = imageFolder + images[imageIndex];
        fullscreenImage.alt = `${projectInfo.name} image ${imageIndex + 1}`;
        fullscreenCounter.textContent = `Image ${imageIndex + 1} of ${images.length}`;
        
        fullscreenModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        
        // Show/hide navigation buttons based on image count
        if (images.length > 1) {
            fullscreenPrev.style.display = 'block';
            fullscreenNext.style.display = 'block';
        } else {
            fullscreenPrev.style.display = 'none';
            fullscreenNext.style.display = 'none';
        }
    };

    const closeFullscreen = () => {
        fullscreenModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    };

    const showFullscreenImage = (index, direction) => {
        const projectInfo = allProjectsData[currentProject];
        const images = projectInfo.images;
        
        currentImageIndex = (index + images.length) % images.length;
        const imageFolder = projectInfo.image_folder;
        
        fullscreenImage.src = imageFolder + images[currentImageIndex];
        fullscreenImage.alt = `${projectInfo.name} image ${currentImageIndex + 1}`;
        fullscreenCounter.textContent = `Image ${currentImageIndex + 1} of ${images.length}`;
    };

    // Event listeners for navigation buttons
    prevBtn.addEventListener('click', () => {
        showImage(currentImageIndex - 1, 'prev');
    });

    nextBtn.addEventListener('click', () => {
        showImage(currentImageIndex + 1, 'next');
    });

    // Fullscreen event listeners
    fullscreenClose.addEventListener('click', closeFullscreen);
    
    fullscreenPrev.addEventListener('click', () => {
        showFullscreenImage(currentImageIndex - 1, 'prev');
    });
    
    fullscreenNext.addEventListener('click', () => {
        showFullscreenImage(currentImageIndex + 1, 'next');
    });

    // Close modal when clicking outside the image
    fullscreenModal.addEventListener('click', (e) => {
        if (e.target === fullscreenModal) {
            closeFullscreen();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!fullscreenModal.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeFullscreen();
                break;
            case 'ArrowLeft':
                showFullscreenImage(currentImageIndex - 1, 'prev');
                break;
            case 'ArrowRight':
                showFullscreenImage(currentImageIndex + 1, 'next');
                break;
        }
    });

    // Initial data fetch
    fetchProjectData();

    // Scroll-based animations (copied from index.html to ensure consistency)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all animation elements
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
        observer.observe(el);
    });

    // Mobile Navigation (copied from index.html to ensure consistency)
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
});
