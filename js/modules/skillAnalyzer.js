export class SkillAnalyzer {
  static analyzeSkills(skills) {
    const categories = {
      technical: [],
      soft: [],
      domain: [],
    };

    const skillKeywords = {
      technical: ['programming', 'development', 'engineering', 'software', 'code'],
      soft: ['leadership', 'communication', 'management', 'teamwork'],
      domain: ['marketing', 'sales', 'finance', 'healthcare'],
    };

    skills.forEach(skill => {
      for (const [category, keywords] of Object.entries(skillKeywords)) {
        if (keywords.some(keyword => skill.name.toLowerCase().includes(keyword))) {
          categories[category].push(skill);
          break;
        }
      }
    });

    return {
      categories,
      recommendations: this.generateRecommendations(categories),
      gaps: this.identifySkillGaps(categories),
    };
  }

  static generateRecommendations(categories) {
    const recommendations = [];
    if (categories.technical.length < 3) {
      recommendations.push('Consider adding more technical skills');
    }
    if (categories.soft.length < 2) {
      recommendations.push('Add leadership and communication skills');
    }
    return recommendations;
  }

  static identifySkillGaps(categories) {
    const industryStandards = {
      technical: 5,
      soft: 3,
      domain: 2,
    };

    return Object.entries(industryStandards)
      .filter(([category, standard]) => categories[category].length < standard)
      .map(([category, standard]) => ({
        category,
        current: categories[category].length,
        required: standard,
      }));
  }
}