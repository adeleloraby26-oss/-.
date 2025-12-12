/**
 * Website Data Management Utility
 * This file provides easy access to all website content and helper functions
 */

class WebsiteDataManager {
    constructor() {
        this.data = null;
        this.isLoaded = false;
    }

    /**
     * Load website data from JSON file
     */
    async loadData() {
        try {
            const response = await fetch('static/data/website-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.data = await response.json();
            this.isLoaded = true;
            return this.data;
        } catch (error) {
            console.error('Error loading website data:', error);
            throw error;
        }
    }

    /**
     * Get all website data
     */
    getAllData() {
        if (!this.isLoaded) {
            throw new Error('Data not loaded. Call loadData() first.');
        }
        return this.data;
    }

    /**
     * Get site information
     */
    getSiteInfo() {
        return this.data?.siteInfo;
    }

    /**
     * Get profile information
     */
    getProfile() {
        return this.data?.profile;
    }

    /**
     * Get statistics
     */
    getStats() {
        return this.data?.stats;
    }

    /**
     * Get skills
     */
    getSkills() {
        return this.data?.skills;
    }

    /**
     * Get all projects
     */
    getProjects() {
        return this.data?.projects;
    }

    /**
     * Get project by ID
     */
    getProjectById(id) {
        return this.data?.projects?.find(project => project.id === id);
    }

    /**
     * Get projects by technology
     */
    getProjectsByTechnology(tech) {
        return this.data?.projects?.filter(project => 
            project.technologies.some(t => 
                t.toLowerCase().includes(tech.toLowerCase())
            )
        );
    }

    /**
     * Get reviews
     */
    getReviews() {
        return this.data?.reviews;
    }

    /**
     * Get services
     */
    getServices() {
        return this.data?.services;
    }

    /**
     * Get contact information
     */
    getContact() {
        return this.data?.contact;
    }

    /**
     * Get navigation items
     */
    getNavigation() {
        return this.data?.navigation;
    }

    /**
     * Get footer information
     */
    getFooter() {
        return this.data?.footer;
    }

    /**
     * Render projects section
     */
    renderProjects(container) {
        if (!this.isLoaded) return;
        
        const projects = this.getProjects();
        if (!projects) return;

        container.innerHTML = projects.map(project => `
            <div class="project-card fade-in">
                <div class="project-image">
                    <i class="${project.icon}"></i>
                </div>
                <div class="project-info">
                    <h3>${project.name}</h3>
                    <p>${project.description}</p>
                    <div class="project-tech">
                        ${project.technologies.map(tech => 
                            `<span class="tech-tag">${tech}</span>`
                        ).join('')}
                    </div>
                    <div class="project-links">
                        ${project.links.map(link => `
                            <a href="${link.url}" class="project-link" target="_blank">
                                <i class="${link.icon}"></i>
                                ${link.text}
                            </a>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Render skills section
     */
    renderSkills(container) {
        if (!this.isLoaded) return;
        
        const skills = this.getSkills();
        if (!skills) return;

        container.innerHTML = skills.map(skill => `
            <div class="skill-category scale-in">
                <h3><i class="${skill.icon}"></i>${skill.category}</h3>
                <div class="skill-tags">
                    ${skill.skills.map(s => 
                        `<span class="skill-tag">${s}</span>`
                    ).join('')}
                </div>
            </div>
        `).join('');
    }

    /**
     * Render reviews section
     */
    renderReviews(container) {
        if (!this.isLoaded) return;
        
        const reviews = this.getReviews();
        if (!reviews) return;

        const { summary, items } = reviews;
        
        container.innerHTML = `
            <div class="rating-summary fade-in">
                <div class="rating-number">${summary.rating}</div>
                <div class="rating-stars">
                    ${'<i class="fas fa-star"></i>'.repeat(Math.floor(parseFloat(summary.rating)))}
                    ${parseFloat(summary.rating) % 1 !== 0 ? '<i class="far fa-star"></i>' : ''}
                </div>
                <div class="rating-text">${summary.text}</div>
            </div>
            <div class="reviews-grid">
                ${items.map(review => `
                    <div class="review-card fade-in">
                        <div class="review-date">${review.date}</div>
                        <div class="review-header">
                            <div class="review-avatar">${review.avatar}</div>
                            <div class="review-info">
                                <h4>${review.name}</h4>
                                <div class="review-role">${review.role}</div>
                            </div>
                        </div>
                        <div class="review-stars">
                            ${'<i class="fas fa-star"></i>'.repeat(review.rating)}
                            ${'<i class="far fa-star"></i>'.repeat(5 - review.rating)}
                        </div>
                        <div class="review-text">${review.text}</div>
                        ${review.projectId ? `
                            <div class="review-project">
                                <a href="project-gallery.html?project=${review.projectId}" class="review-project-link" target="_blank">
                                    <i class="fas fa-images"></i>
                                    View Project
                                </a>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Render services section
     */
    renderServices(container) {
        if (!this.isLoaded) return;
        
        const services = this.getServices();
        if (!services) return;

        container.innerHTML = services.map(service => `
            <div class="service-card scale-in">
                <div class="service-icon">
                    <i class="${service.icon}"></i>
                </div>
                <h3>${service.title}</h3>
                <p>${service.description}</p>
                <div class="service-price">${service.price}</div>
            </div>
        `).join('');
    }

    /**
     * Render contact section
     */
    renderContact(container) {
        if (!this.isLoaded) return;
        
        const contact = this.getContact();
        if (!contact) return;

        container.innerHTML = `
            <div class="contact-info slide-in-left">
                <h3>Get In Touch</h3>
                <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <div>
                        <strong>Phone</strong><br>
                        ${contact.phone}
                    </div>
                </div>
                <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <div>
                        <strong>Email</strong><br>
                        ${contact.email}
                    </div>
                </div>
                <div class="contact-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <div>
                        <strong>Location</strong><br>
                        ${contact.location}
                    </div>
                </div>
                <div class="contact-item">
                    <i class="fas fa-birthday-cake"></i>
                    <div>
                        <strong>Age</strong><br>
                        ${contact.age}
                    </div>
                </div>
                <div class="contact-item">
                    <i class="fas fa-globe"></i>
                    <div>
                        <strong>Languages</strong><br>
                        ${contact.languages}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render social links
     */
    renderSocialLinks(container) {
        if (!this.isLoaded) return;
        
        const contact = this.getContact();
        if (!contact?.socialLinks) return;

        container.innerHTML = contact.socialLinks.map(social => `
            <a href="${social.url}" class="social-link" title="${social.title}" target="_blank">
                <i class="${social.icon}"></i>
            </a>
        `).join('');
    }

    /**
     * Render navigation
     */
    renderNavigation(container) {
        if (!this.isLoaded) return;
        
        const navigation = this.getNavigation();
        if (!navigation) return;

        container.innerHTML = navigation.map(nav => `
            <li><a href="${nav.href}" class="nav-link">${nav.text}</a></li>
        `).join('');
    }

    /**
     * Render footer
     */
    renderFooter(container) {
        if (!this.isLoaded) return;
        
        const footer = this.getFooter();
        if (!footer) return;

        container.innerHTML = `
            <p>${footer.copyright}</p>
            <p>${footer.tagline}</p>
            <p>${footer.credit}</p>
        `;
    }

    /**
     * Update page title and meta information
     */
    updatePageMeta() {
        if (!this.isLoaded) return;
        
        const siteInfo = this.getSiteInfo();
        if (siteInfo) {
            document.title = siteInfo.title;
            // You can add more meta tag updates here
        }
    }

    /**
     * Search projects by keyword
     */
    searchProjects(keyword) {
        if (!this.isLoaded) return [];
        
        const projects = this.getProjects();
        if (!projects) return [];

        const searchTerm = keyword.toLowerCase();
        return projects.filter(project => 
            project.name.toLowerCase().includes(searchTerm) ||
            project.description.toLowerCase().includes(searchTerm) ||
            project.technologies.some(tech => 
                tech.toLowerCase().includes(searchTerm)
            )
        );
    }

    /**
     * Get projects count by category
     */
    getProjectsCountByCategory() {
        if (!this.isLoaded) return {};
        
        const projects = this.getProjects();
        if (!projects) return {};

        const categories = {};
        projects.forEach(project => {
            project.technologies.forEach(tech => {
                categories[tech] = (categories[tech] || 0) + 1;
            });
        });
        return categories;
    }
}

// Create global instance
const websiteData = new WebsiteDataManager();

// Auto-load data when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await websiteData.loadData();
        console.log('Website data loaded successfully');
        
        // Auto-update page meta
        websiteData.updatePageMeta();
        
        // Dispatch custom event when data is loaded
        document.dispatchEvent(new CustomEvent('websiteDataLoaded', { 
            detail: { data: websiteData.getAllData() } 
        }));
    } catch (error) {
        console.error('Failed to load website data:', error);
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebsiteDataManager;
}
