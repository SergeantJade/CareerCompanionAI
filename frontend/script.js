// Production-ready JavaScript for Career Companion - 405 ERROR FIX

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    animateHeartbeat();
    setupFormHandler();
    addEventListeners();
}

function animateHeartbeat() {
    const path = document.getElementById('pulse');
    const dot = document.getElementById('heart-dot');
    
    if (!path || !dot) return;

    function animate() {
        const pathLen = path.getTotalLength();
        let dir = 1;
        let progress = 0;

        function step() {
            progress += dir * 2.5;
            if (progress >= pathLen || progress <= 0) dir *= -1;

            const pos = path.getPointAtLength(progress);
            dot.setAttribute('cx', pos.x);
            dot.setAttribute('cy', pos.y);

            const time = performance.now();
            const p1 = 0.5 + Math.abs(Math.sin(time/200 + progress/15)) * 0.5;
            const r = 8 + 4 * p1;
            
            dot.setAttribute('r', r);
            dot.setAttribute('opacity', 0.8 + p1 * 0.2);
            
            const hue = (time/50 + progress/10) % 360;
            dot.setAttribute('fill', `hsl(${hue}, 70%, 60%)`);
            dot.setAttribute('stroke', `hsl(${hue + 60}, 80%, 80%)`);

            const pathHue = (time/100 + progress/20) % 360;
            path.setAttribute('stroke', `hsl(${pathHue}, 60%, 50%)`);

            requestAnimationFrame(step);
        }
        step();
    }
    animate();
}

function setupFormHandler() {
    const form = document.getElementById('profileForm');
    
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = collectFormData();
        
        if (!validateFormData(formData)) {
            showError('Please fill in all required fields');
            return;
        }
        
        await performAnalysis(formData);
    });
}

function collectFormData() {
    return {
        skills: document.getElementById('skills')?.value?.trim() || '',
        projects: document.getElementById('projects')?.value?.trim() || '',
        events: document.getElementById('events')?.value?.trim() || '',
        experience: document.getElementById('experience')?.value || 'beginner',
        location: document.getElementById('location')?.value?.trim() || ''
    };
}

function validateFormData(data) {
    if (!data || typeof data !== 'object') return false;
    if (!data.skills || data.skills.length === 0) return false;
    return true;
}

async function performAnalysis(formData) {
    showLoadingState();
    
    try {
        console.log('🚀 Sending request to backend:', formData);
        
        const response = await fetch('/api/comprehensive-analysis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        console.log('📥 Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Backend error:', errorText);
            throw new Error(`Backend Error ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('✅ Backend response received:', result);
        
        hideLoadingState();
        
        if (result.error) {
            console.error('Backend returned error:', result.error);
            throw new Error(result.error);
        } else {
            displayComprehensiveResults(result);
        }
        
    } catch (error) {
        console.error('❌ Analysis error:', error);
        hideLoadingState();
        showError(`Analysis failed: ${error.message}`);
        displayFallbackResults(formData);
    }
}

function showLoadingState() {
    const loadingEl = document.getElementById('loadingState');
    const btnEl = document.getElementById('analyzeBtn');
    
    if (loadingEl) loadingEl.classList.add('show');
    if (btnEl) btnEl.disabled = true;
    
    animateProgressBar();
}

function hideLoadingState() {
    const loadingEl = document.getElementById('loadingState');
    const btnEl = document.getElementById('analyzeBtn');
    
    if (loadingEl) loadingEl.classList.remove('show');
    if (btnEl) btnEl.disabled = false;
    
    const progressEl = document.getElementById('progressFill');
    if (progressEl) progressEl.style.width = '0%';
}

function animateProgressBar() {
    const progressEl = document.getElementById('progressFill');
    if (!progressEl) return;
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 90) progress = 90;
        
        progressEl.style.width = `${progress}%`;
        
        if (progress >= 90) {
            clearInterval(interval);
        }
    }, 300);
    
    setTimeout(() => {
        clearInterval(interval);
        progressEl.style.width = '100%';
    }, 5000);
}

function displayComprehensiveResults(data) {
    if (!data || typeof data !== 'object') {
        console.error('❌ Invalid result data:', data);
        displayFallbackResults({});
        return;
    }
    
    console.log('📊 Displaying comprehensive results');
    
    const ai = data.ai_analysis || {};
    const jobs = data.job_market || {};
    const skills = data.skill_demand || {};
    const salary = data.salary_insights || {};
    const trends = data.future_trends || {};
    
    const resultsHTML = `
        <div class="api-section ai-analysis fadein">
            <div class="result-title">🤖 AI-Powered Career Analysis</div>
            <div class="analysis-content">
                ${ai.roadmap || 'Analysis in progress...'}
            </div>
            <div class="stat-item">
                <span>Confidence Score:</span>
                <span class="stat-value">${ai.confidence_score || 'N/A'}%</span>
            </div>
            <div class="stat-item">
                <span>Analysis Type:</span>
                <span class="stat-value">${ai.analysis_type || 'N/A'}</span>
            </div>
        </div>

        <div class="api-section job-market fadein">
            <div class="result-title">📊 Real-Time Job Market</div>
            <div class="stat-item">
                <span>Available Positions:</span>
                <span class="stat-value">${jobs.total_openings?.toLocaleString() || 'N/A'}</span>
            </div>
            <div class="stat-item">
                <span>Growth Rate:</span>
                <span class="stat-value">${jobs.job_growth_rate || 'N/A'}%</span>
            </div>
            <div class="stat-item">
                <span>Remote Opportunities:</span>
                <span class="stat-value">${jobs.remote_percentage || 'N/A'}%</span>
            </div>
            <div class="stat-item">
                <span>Location Demand:</span>
                <span class="stat-value">${jobs.location_demand || 'N/A'}</span>
            </div>
            ${jobs.top_companies?.length ? 
                `<div><strong>Top Hiring Companies:</strong><br>${jobs.top_companies.map(c => Array.isArray(c) ? c[0] : c).slice(0,5).join(', ')}</div>` 
                : ''
            }
        </div>

        <div class="api-section skill-demand fadein">
            <div class="result-title">🎯 Skill Demand Analysis</div>
            <div class="stat-item">
                <span>Overall Demand:</span>
                <span class="stat-value">${skills.overall_demand || 'N/A'}</span>
            </div>
            ${skills.skills?.length ? skills.skills.map(skill => `
                <div class="stat-item">
                    <span>${skill.skill || 'Unknown'}:</span>
                    <span class="stat-value">${skill.demand_score || 0}% demand (${skill.growth_trend || 'stable'})</span>
                </div>
            `).join('') : '<div>Skill analysis in progress...</div>'}
        </div>

        <div class="api-section salary-data fadein">
            <div class="result-title">💰 Salary Insights</div>
            <div class="stat-item">
                <span>Entry Level:</span>
                <span class="stat-value">$${salary.entry_level?.toLocaleString() || 'N/A'}</span>
            </div>
            <div class="stat-item">
                <span>Mid Level:</span>
                <span class="stat-value">$${salary.mid_level?.toLocaleString() || 'N/A'}</span>
            </div>
            <div class="stat-item">
                <span>Senior Level:</span>
                <span class="stat-value">$${salary.senior_level?.toLocaleString() || 'N/A'}</span>
            </div>
        </div>

        <div class="api-section future-trends fadein">
            <div class="result-title">🔮 Future Career Trends</div>
            <div class="stat-item">
                <span>5-Year Outlook:</span>
                <span class="stat-value">${trends.job_outlook || 'Positive'}</span>
            </div>
            <div class="stat-item">
                <span>Projected Growth:</span>
                <span class="stat-value">${trends.growth_projection || 'N/A'}</span>
            </div>
            <div class="stat-item">
                <span>Automation Risk:</span>
                <span class="stat-value">${trends.automation_risk || 'Low'}</span>
            </div>
        </div>

        <div class="api-section">
            <div style="font-size: 0.9rem; color: #666; text-align: center;">
                ✅ Analysis completed at ${new Date(data.timestamp || Date.now()).toLocaleString()}
            </div>
        </div>
    `;
    
    showResults(resultsHTML);
}

function displayFallbackResults(data) {
    const fallbackHTML = `
        <div class="api-section ai-analysis fadein">
            <div class="result-title">⚠️ Connection Issue</div>
            <div>Unable to connect to the backend server.</div>
            <div style="margin-top: 15px;">
                <strong>Your Skills:</strong> ${data.skills || 'Not specified'}<br>
                <strong>Quick Recommendations:</strong><br>
                • Build portfolio projects<br>
                • Join tech communities<br>
                • Practice coding regularly
            </div>
        </div>
    `;
    
    showResults(fallbackHTML);
}

function showResults(html) {
    const resultsEl = document.getElementById('results');
    if (!resultsEl) return;
    
    resultsEl.innerHTML = html;
    resultsEl.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

function showError(message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.style.cssText = `
        background: #ff6b6b;
        color: white;
        padding: 15px;
        border-radius: 10px;
        margin: 15px 0;
        text-align: center;
    `;
    errorEl.textContent = message;
    
    const formEl = document.getElementById('skill-input');
    if (formEl) {
        const existingError = formEl.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        formEl.appendChild(errorEl);
        
        setTimeout(() => errorEl.remove(), 5000);
    }
}

function addEventListeners() {
    const skillsInput = document.getElementById('skills');
    if (skillsInput) {
        skillsInput.addEventListener('blur', function() {
            if (this.value.trim().length < 2) {
                this.style.borderColor = '#ff6b6b';
            } else {
                this.style.borderColor = '#4ecdc4';
            }
        });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        collectFormData,
        validateFormData,
        displayComprehensiveResults
    };
}
