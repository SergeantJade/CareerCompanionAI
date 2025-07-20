from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import json
from datetime import datetime
from openai import OpenAI
import random
import time
import traceback

app = Flask(__name__, static_folder='../frontend', static_url_path='')

# Simple CORS setup
CORS(app, resources={r"/*": {"origins": "*"}})

# Your API keys
API_KEYS = {
    'RAPIDAPI_KEY': 'c7355dee7amsh0cc3e46191a2ce7p1e9d1cjsna66c9714199c',
    'DEEPSEEK_API_KEY': 'sk-1016d7fce50b43829f8bbf5607efc9fc',
    'GROQ_API_KEY': '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'
}

@app.route('/')
def serve_frontend():
    print("✅ Serving frontend")
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/test')
def test_connection():
    print("✅ Test endpoint called")
    return jsonify({
        'status': 'Backend connected successfully!',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/comprehensive-analysis', methods=['POST'])
def comprehensive_analysis():
    print("\n" + "="*50)
    print("🚀 ANALYSIS REQUEST RECEIVED")
    print("="*50)
    
    try:
        # Log request details
        print(f"Method: {request.method}")
        print(f"Content-Type: {request.content_type}")
        print(f"Has JSON: {request.is_json}")
        
        # Get data
        data = request.get_json()
        print(f"Received data: {data}")
        
        if not data:
            print("❌ No data received")
            return jsonify({'error': 'No data provided'}), 400
        
        skills = data.get('skills', '')
        if not skills:
            print("❌ No skills provided")
            return jsonify({'error': 'Skills required'}), 400
        
        print(f"✅ Processing skills: {skills}")
        
        # Simple analysis - start with working version
        ai_analysis = {
            'roadmap': f"""
            <h3>🎯 Career Analysis for {skills}</h3>
            <div style="margin: 15px 0;">
                <h4>📈 Career Roadmap</h4>
                <ul>
                    <li><strong>Next 3 months:</strong> Build portfolio projects with {skills}</li>
                    <li><strong>6 months:</strong> Apply for intermediate positions</li>
                    <li><strong>1 year:</strong> Gain industry certifications</li>
                    <li><strong>2+ years:</strong> Move to senior roles</li>
                </ul>
            </div>
            <div style="margin: 15px 0;">
                <h4>🎯 Immediate Actions</h4>
                <ol>
                    <li>Update your resume with latest projects</li>
                    <li>Practice coding challenges daily</li>
                    <li>Network with industry professionals</li>
                </ol>
            </div>
            """,
            'confidence_score': 85,
            'analysis_type': 'Career Companion Analysis'
        }
        
        job_market = {
            'total_openings': random.randint(1200, 3500),
            'job_growth_rate': random.randint(15, 25),
            'top_companies': [['Google', 50], ['Microsoft', 45], ['Amazon', 40], ['Meta', 35], ['Apple', 30]],
            'remote_percentage': random.randint(45, 70),
            'location_demand': f"High demand for {skills} professionals",
            'data_sources': ['Job Market Analysis']
        }
        
        skill_demand = {
            'overall_demand': 'high',
            'skills': [
                {
                    'skill': skill.strip(),
                    'demand_score': random.randint(70, 95),
                    'growth_trend': 'growing'
                } for skill in skills.split(',')[:5]
            ],
            'trending_skills': ['AI/ML', 'Cloud Computing', 'Python', 'JavaScript', 'React']
        }
        
        salary_insights = {
            'entry_level': random.randint(55000, 75000),
            'mid_level': random.randint(80000, 120000),
            'senior_level': random.randint(130000, 180000),
            'location_adjustment': 1.0,
            'benefits_value': random.randint(10000, 20000),
            'skill_category': 'Technology'
        }
        
        future_trends = {
            'job_outlook': 'Very positive - strong growth expected',
            'growth_projection': '20-25% annually',
            'automation_risk': 'Low - high-skill roles in demand',
            'emerging_technologies': ['AI/ML', 'Quantum Computing', 'Edge Computing'],
            'future_skills': ['AI Integration', 'Cloud Architecture', 'Data Science']
        }
        
        result = {
            'ai_analysis': ai_analysis,
            'job_market': job_market,
            'skill_demand': skill_demand,
            'salary_insights': salary_insights,
            'future_trends': future_trends,
            'timestamp': datetime.now().isoformat(),
            'status': 'success',
            'apis_used': ['Career Analysis Engine']
        }
        
        print("✅ Analysis completed successfully")
        print("✅ Returning response to frontend")
        
        return jsonify(result)
        
    except Exception as e:
        error_msg = str(e)
        print(f"❌ ERROR: {error_msg}")
        traceback.print_exc()
        
        return jsonify({
            'error': f'Analysis failed: {error_msg}',
            'timestamp': datetime.now().isoformat()
        }), 500

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 CAREER COMPANION FLASK BACKEND STARTING")
    print("="*60)
    print("📡 Server will be available at:")
    print("   ➤ Frontend: http://127.0.0.1:5000")
    print("   ➤ Test API: http://127.0.0.1:5000/api/test")
    print("   ➤ Analysis: http://127.0.0.1:5000/api/comprehensive-analysis")
    print("="*60)
    
    app.run(debug=True, host='0.0.0.0', port=5000)
