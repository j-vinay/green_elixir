interface SymptomAnalysis {
  category: string;
  severity: string;
  keywords: string[];
}

interface HerbRecommendation {
  herbId: number;
  herbName: string;
  scientificName: string;
  reason: string;
  dosage: string;
  benefits: string[];
}

interface AIRecommendation {
  analysis: SymptomAnalysis;
  recommendations: HerbRecommendation[];
  disclaimer: string;
  lifestyle: string[];
}

// Symptom to herb mapping based on Ayurvedic principles
const symptomHerbMapping: Record<string, HerbRecommendation[]> = {
  "headache": [
    {
      herbId: 1,
      herbName: "Brahmi",
      scientificName: "Bacopa monnieri",
      reason: "Calms Vata dosha and reduces mental stress",
      dosage: "1-2 teaspoons with warm milk before bed",
      benefits: ["Reduces tension headaches", "Improves mental clarity", "Calms nervous system"]
    },
    {
      herbId: 2,
      herbName: "Ashwagandha",
      scientificName: "Withania somnifera",
      reason: "Adaptogenic properties help manage stress-induced headaches",
      dosage: "500mg twice daily with meals",
      benefits: ["Reduces stress", "Balances cortisol", "Improves sleep quality"]
    }
  ],
  "stress": [
    {
      herbId: 2,
      herbName: "Ashwagandha",
      scientificName: "Withania somnifera",
      reason: "Premier adaptogenic herb for stress management",
      dosage: "500mg twice daily with meals",
      benefits: ["Reduces cortisol levels", "Improves stress resilience", "Enhances energy"]
    },
    {
      herbId: 1,
      herbName: "Brahmi",
      scientificName: "Bacopa monnieri",
      reason: "Supports nervous system and mental clarity",
      dosage: "1-2 teaspoons with warm milk",
      benefits: ["Calms mind", "Improves concentration", "Reduces anxiety"]
    }
  ],
  "sleep": [
    {
      herbId: 1,
      herbName: "Brahmi",
      scientificName: "Bacopa monnieri",
      reason: "Calming properties promote restful sleep",
      dosage: "1 teaspoon with warm milk before bed",
      benefits: ["Improves sleep quality", "Calms nervous system", "Reduces mental fatigue"]
    },
    {
      herbId: 2,
      herbName: "Ashwagandha",
      scientificName: "Withania somnifera",
      reason: "Helps regulate sleep-wake cycle",
      dosage: "500mg 1 hour before bedtime",
      benefits: ["Promotes deep sleep", "Reduces sleep anxiety", "Balances stress hormones"]
    }
  ],
  "digestive": [
    {
      herbId: 6,
      herbName: "Ginger",
      scientificName: "Zingiber officinale",
      reason: "Stimulates digestive fire (Agni) and improves gut health",
      dosage: "1-2 slices fresh ginger with warm water before meals",
      benefits: ["Improves digestion", "Reduces nausea", "Stimulates appetite"]
    },
    {
      herbId: 3,
      herbName: "Turmeric",
      scientificName: "Curcuma longa",
      reason: "Anti-inflammatory properties support digestive health",
      dosage: "1 teaspoon with warm milk or water",
      benefits: ["Reduces inflammation", "Supports liver function", "Aids digestion"]
    }
  ],
  "inflammation": [
    {
      herbId: 3,
      herbName: "Turmeric",
      scientificName: "Curcuma longa",
      reason: "Curcumin provides powerful anti-inflammatory effects",
      dosage: "1-2 teaspoons daily with black pepper",
      benefits: ["Reduces inflammation", "Supports joint health", "Antioxidant properties"]
    },
    {
      herbId: 4,
      herbName: "Neem",
      scientificName: "Azadirachta indica",
      reason: "Natural anti-inflammatory and purifying properties",
      dosage: "2-3 fresh leaves or 500mg extract daily",
      benefits: ["Purifies blood", "Reduces inflammation", "Supports immune system"]
    }
  ],
  "immunity": [
    {
      herbId: 5,
      herbName: "Tulsi",
      scientificName: "Ocimum sanctum",
      reason: "Rasayana herb that strengthens overall immunity",
      dosage: "5-10 fresh leaves or 2 cups tea daily",
      benefits: ["Boosts immunity", "Respiratory support", "Adaptogenic properties"]
    },
    {
      herbId: 3,
      herbName: "Turmeric",
      scientificName: "Curcuma longa",
      reason: "Immune-modulating and antioxidant properties",
      dosage: "1 teaspoon with warm milk daily",
      benefits: ["Strengthens immunity", "Antioxidant support", "Anti-viral properties"]
    }
  ]
};

// Simple keyword extraction and matching
function extractKeywords(text: string): string[] {
  const keywords = text.toLowerCase().match(/\b\w+\b/g) || [];
  return Array.from(new Set(keywords));
}

function categorizeSymptoms(keywords: string[]): SymptomAnalysis {
  const symptomCategories = {
    mental: ["stress", "anxiety", "headache", "sleep", "insomnia", "depression", "worry", "tired", "fatigue"],
    digestive: ["stomach", "digest", "nausea", "bloating", "constipation", "diarrhea", "gas", "appetite"],
    respiratory: ["cough", "cold", "breathing", "asthma", "congestion", "throat", "lung"],
    inflammatory: ["pain", "inflammation", "joint", "arthritis", "swelling", "ache"],
    immunity: ["immune", "sick", "infection", "fever", "weak", "energy"]
  };

  let maxMatches = 0;
  let primaryCategory = "general";
  
  for (const [category, terms] of Object.entries(symptomCategories)) {
    const matches = keywords.filter(keyword => 
      terms.some(term => keyword.includes(term) || term.includes(keyword))
    ).length;
    
    if (matches > maxMatches) {
      maxMatches = matches;
      primaryCategory = category;
    }
  }

  return {
    category: primaryCategory,
    severity: maxMatches > 3 ? "moderate" : "mild",
    keywords: keywords.slice(0, 10)
  };
}

export class NLPService {
  static async analyzeSymptoms(symptomsText: string): Promise<AIRecommendation> {
    try {
      const keywords = extractKeywords(symptomsText);
      const analysis = categorizeSymptoms(keywords);
      
      // Find relevant herbs based on keywords
      let recommendations: HerbRecommendation[] = [];
      
      for (const keyword of keywords) {
        for (const [symptomKey, herbs] of Object.entries(symptomHerbMapping)) {
          if (keyword.includes(symptomKey) || symptomKey.includes(keyword)) {
            recommendations.push(...herbs);
          }
        }
      }
      
      // Remove duplicates and limit to top 3
      const uniqueRecommendations = recommendations
        .filter((herb, index, self) => 
          index === self.findIndex(h => h.herbId === herb.herbId)
        )
        .slice(0, 3);
      
      // Fallback recommendations if no specific matches
      if (uniqueRecommendations.length === 0) {
        uniqueRecommendations.push(
          {
            herbId: 3,
            herbName: "Turmeric",
            scientificName: "Curcuma longa",
            reason: "General wellness and anti-inflammatory support",
            dosage: "1 teaspoon with warm milk daily",
            benefits: ["General wellness", "Anti-inflammatory", "Immune support"]
          },
          {
            herbId: 5,
            herbName: "Tulsi",
            scientificName: "Ocimum sanctum",
            reason: "Adaptogenic support for overall health",
            dosage: "2 cups tea daily or 5-10 fresh leaves",
            benefits: ["Adaptogenic support", "Respiratory health", "Stress relief"]
          }
        );
      }

      const lifestyleRecommendations = this.getLifestyleRecommendations(analysis.category);

      return {
        analysis,
        recommendations: uniqueRecommendations,
        disclaimer: "These recommendations are based on traditional Ayurvedic principles and are for educational purposes only. Please consult with qualified healthcare professionals before starting any herbal regimen, especially if you have existing health conditions or are taking medications.",
        lifestyle: lifestyleRecommendations
      };
    } catch (error) {
      console.error("Error in NLP analysis:", error);
      throw new Error("Failed to analyze symptoms. Please try again.");
    }
  }

  private static getLifestyleRecommendations(category: string): string[] {
    const lifestyleMap: Record<string, string[]> = {
      mental: [
        "Practice daily meditation or pranayama (breathing exercises)",
        "Maintain regular sleep schedule (10pm-6am)",
        "Avoid excessive screen time before bed",
        "Include gentle yoga or walking in daily routine"
      ],
      digestive: [
        "Eat meals at regular times",
        "Avoid cold drinks with meals",
        "Chew food thoroughly and eat mindfully",
        "Include warm, cooked foods in diet"
      ],
      respiratory: [
        "Practice deep breathing exercises",
        "Stay hydrated with warm liquids",
        "Avoid cold and dry foods",
        "Use steam inhalation with eucalyptus"
      ],
      inflammatory: [
        "Follow anti-inflammatory diet",
        "Apply warm oil massage regularly",
        "Include gentle movement and stretching",
        "Reduce processed and fried foods"
      ],
      immunity: [
        "Maintain regular sleep and wake times",
        "Include fresh fruits and vegetables",
        "Practice stress-reduction techniques",
        "Expose yourself to morning sunlight"
      ],
      general: [
        "Follow daily routine (Dinacharya)",
        "Eat according to your constitution",
        "Practice regular exercise",
        "Maintain work-life balance"
      ]
    };

    return lifestyleMap[category] || lifestyleMap.general;
  }
}
