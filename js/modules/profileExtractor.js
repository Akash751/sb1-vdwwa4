import { SELECTORS } from '../utils/constants.js';
import { AIAnalyzer } from './aiAnalyzer.js';

export class ProfileExtractor {
  // ... previous methods remain the same ...

  static async enrichProfileData(profile) {
    try {
      // Add AI-powered analysis
      profile.aiAnalysis = await AIAnalyzer.analyzeProfile(profile);
      return profile;
    } catch (error) {
      console.error('Failed to enrich profile data:', error);
      return profile;
    }
  }
}