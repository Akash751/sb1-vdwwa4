export class AIAnalyzer {
  static GROQ_API_ENDPOINT = 'https://api.groq.com/v1/completions';
  static MODEL = 'mixtral-8x7b-32768';

  static async analyzeProfile(profile) {
    try {
      const analysis = await this.getGroqAnalysis(profile);
      return this.formatAnalysis(analysis);
    } catch (error) {
      console.error('AI analysis failed:', error);
      throw new Error('Failed to analyze profile');
    }
  }

  static async getGroqAnalysis(profile) {
    const prompt = this.generatePrompt(profile);
    
    const response = await fetch(this.GROQ_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${await this.getApiKey()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are an expert career advisor and LinkedIn profile analyst. Analyze the profile and provide specific, actionable improvements.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      throw new Error('GROQ API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  static generatePrompt(profile) {
    return `
      Please analyze this LinkedIn profile and provide specific improvements:

      Name: ${profile.name}
      Headline: ${profile.headline}
      About: ${profile.about}
      
      Experience:
      ${profile.experience.map(exp => `- ${exp.title} at ${exp.company} (${exp.duration})`).join('\n')}
      
      Skills:
      ${profile.skills.map(skill => `- ${skill.name}`).join('\n')}
      
      Education:
      ${profile.education.map(edu => `- ${edu.degree} in ${edu.field} from ${edu.school}`).join('\n')}

      Please provide:
      1. Profile Strength Analysis
      2. Specific Improvement Suggestions
      3. Industry Trends Alignment
      4. Keyword Optimization
      5. Content Enhancement Ideas
    `;
  }

  static formatAnalysis(analysisText) {
    const sections = analysisText.split('\n\n');
    return {
      profileStrength: this.extractSection(sections, 'Profile Strength Analysis'),
      improvements: this.extractSection(sections, 'Improvement Suggestions'),
      industryAlignment: this.extractSection(sections, 'Industry Trends Alignment'),
      keywords: this.extractSection(sections, 'Keyword Optimization'),
      contentEnhancements: this.extractSection(sections, 'Content Enhancement'),
    };
  }

  static extractSection(sections, sectionName) {
    const section = sections.find(s => s.includes(sectionName));
    return section ? section.split('\n').slice(1) : [];
  }

  static async getApiKey() {
    const { groqApiKey } = await chrome.storage.local.get('groqApiKey');
    if (!groqApiKey) {
      throw new Error('GROQ API key not found');
    }
    return groqApiKey;
  }
}