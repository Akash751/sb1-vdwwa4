import { AIAnalyzer } from './aiAnalyzer.js';

export class InMailAssistant {
  static templates = {
    connection: {
      title: "Connection Request",
      body: "Hi {{name}}, I noticed your work in {{industry}} and would love to connect to share insights about {{commonInterest}}."
    },
    opportunity: {
      title: "Career Opportunity",
      body: "Hi {{name}}, I'm reaching out regarding an exciting opportunity at {{company}} that aligns with your experience in {{expertise}}."
    },
    collaboration: {
      title: "Project Collaboration",
      body: "Hi {{name}}, I'm impressed by your work on {{project}} and would love to discuss potential collaboration opportunities."
    }
  };

  static async generateInMail(profile, template, customization = {}) {
    try {
      const analysis = await AIAnalyzer.analyzeProfile(profile);
      const context = {
        name: profile.name,
        industry: profile.industry,
        expertise: analysis.keywords[0],
        commonInterest: analysis.industryAlignment[0],
        project: profile.experience[0]?.title || 'your recent projects',
        company: customization.company || 'our company',
        ...customization
      };

      let content = this.templates[template].body;
      for (const [key, value] of Object.entries(context)) {
        content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
      }

      return {
        title: this.templates[template].title,
        content: await this.enhanceContent(content, profile)
      };
    } catch (error) {
      console.error('Failed to generate InMail:', error);
      throw new Error('InMail generation failed');
    }
  }

  static async enhanceContent(content, profile) {
    const prompt = `
      Enhance this InMail message while maintaining professionalism and authenticity:
      
      Original message: ${content}
      
      Recipient's profile:
      - Name: ${profile.name}
      - Title: ${profile.headline}
      - Industry: ${profile.industry}
      
      Make it more personalized and engaging while keeping it concise.
    `;

    try {
      const enhancement = await AIAnalyzer.getGroqAnalysis({ messages: [{ role: 'user', content: prompt }] });
      return enhancement.trim();
    } catch (error) {
      return content;
    }
  }

  static async suggestFollowUp(previousMessage, responseType = 'none') {
    const context = {
      original: previousMessage,
      response: responseType
    };

    const prompt = `
      Suggest a follow-up message for this LinkedIn conversation:
      Original message: ${context.original}
      Response type: ${context.response}
      
      Provide a professional and engaging follow-up that moves the conversation forward.
    `;

    try {
      return await AIAnalyzer.getGroqAnalysis({ messages: [{ role: 'user', content: prompt }] });
    } catch (error) {
      console.error('Failed to generate follow-up:', error);
      throw new Error('Follow-up generation failed');
    }
  }
}