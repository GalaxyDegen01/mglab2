import { t, updateLanguage, updatePageText, detectTimezone, setTimezone, convertToTimezone, updateCurrentTimezoneInfo, ultimoIncentivoPeru, currentTimezone } from './utils.js';
import { updateIncentivosDisplay, populateSearchSelector, searchIncentivoDates, loadMoreIncentivos } from './craftincentives.js';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('CraftIncentives initialized');
    
    document.body.classList.add('dark');
    detectTimezone();
    setupTimezoneSelector();
    setupSearchSelector();
    setupPageNavigation();
    updateIncentivosDisplay();
});

function setupPageNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            showPage(page);
        });
    });
}

function showPage(pageName) {
    // Hide all pages
    const allPages = document.querySelectorAll('.page-content');
    allPages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    const selectedPage = document.getElementById(pageName);
    if (selectedPage) {
        selectedPage.classList.add('active');
        
        // Update nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageName) {
                link.classList.add('active');
            }
        });
        
        // Refresh incentives display
        if (pageName === 'incentivos') {
            updateIncentivosDisplay();
        }
    }
}

function setupTimezoneSelector() {
    const selector = document.getElementById('timezoneSelect');
    if (!selector) return;
    
    // Populate timezone options
    const commonTimezones = [
        { value: 'auto', label: 'Auto-detect', group: 'system' },
        { value: 'America/Lima', label: 'Peru (UTC-5)', group: 'america' },
        { value: 'America/New_York', label: 'Eastern Time (UTC-5/-4)', group: 'america' },
        { value: 'America/Chicago', label: 'Central Time (UTC-6/-5)', group: 'america' },
        { value: 'America/Denver', label: 'Mountain Time (UTC-7/-6)', group: 'america' },
        { value: 'America/Los_Angeles', label: 'Pacific Time (UTC-8/-7)', group: 'america' },
        { value: 'Europe/London', label: 'London (UTC+0/+1)', group: 'europe' },
        { value: 'Europe/Madrid', label: 'Spain (UTC+1/+2)', group: 'europe' },
        { value: 'Europe/Paris', label: 'Central Europe (UTC+1/+2)', group: 'europe' },
        { value: 'Europe/Moscow', label: 'Moscow (UTC+3)', group: 'europe' },
        { value: 'Asia/Dubai', label: 'Dubai (UTC+4)', group: 'asia' },
        { value: 'Asia/India', label: 'India (UTC+5:30)', group: 'asia' },
        { value: 'Asia/Bangkok', label: 'Bangkok (UTC+7)', group: 'asia' },
        { value: 'Asia/Shanghai', label: 'China (UTC+8)', group: 'asia' },
        { value: 'Asia/Tokyo', label: 'Japan (UTC+9)', group: 'asia' },
        { value: 'Australia/Sydney', label: 'Sydney (UTC+10/+11)', group: 'oceania' },
    ];
    
    selector.innerHTML = '';
    commonTimezones.forEach(tz => {
        const option = document.createElement('option');
        option.value = tz.value;
        option.textContent = tz.label;
        selector.appendChild(option);
    });
    
    // Set saved timezone or auto-detect
    const savedTz = localStorage.getItem('selectedTimezone');
    if (savedTz) {
        selector.value = savedTz;
        if (savedTz !== 'auto') {
            setTimezone(savedTz);
        }
    } else {
        selector.value = 'auto';
    }
    
    selector.addEventListener('change', (e) => {
        const tz = e.target.value;
        localStorage.setItem('selectedTimezone', tz);
        
        if (tz === 'auto') {
            detectTimezone();
        } else {
            setTimezone(tz);
        }
        updateIncentivosDisplay();
    });
}

function setupSearchSelector() {
    const searchSelect = document.getElementById('searchIncentive');
    if (!searchSelect) return;
    
    populateSearchSelector();
    
    searchSelect.addEventListener('change', (e) => {
        const selectedIncentive = e.target.value;
        searchIncentivoDates(selectedIncentive);
    });
}

// Export functions for global access
window.showPage = showPage;
window.loadMoreIncentivos = loadMoreIncentivos;
