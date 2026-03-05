import { defineCollection, z } from 'astro:content';

// Reusable schema for paragraphs with optional emphasis
const paragraphSchema = z.object({
  text: z.string(),
  emphasis: z.enum(['bold', 'italic']).optional(),
});

// Reusable content block schema for flexible content ordering
// Supports: paragraph, orderedList, bulletList, divider
const contentBlockSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('paragraph'),
    text: z.string(),
    centered: z.boolean().optional(),
  }),
  z.object({
    type: z.literal('orderedList'),
    items: z.array(z.string()),
  }),
  z.object({
    type: z.literal('bulletList'),
    items: z.array(z.string()),
  }),
  z.object({
    type: z.literal('divider'),
  }),
  z.object({
    type: z.literal('faq'),
    questions: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })),
  }),
  z.object({
    type: z.literal('clarifications'),
    subtitle: z.string().optional(),
    items: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })),
  }),
  z.object({
    type: z.literal('fit'),
    goodFit: z.array(z.string()),
    notGoodFit: z.array(z.string()),
  }),
  z.object({
    type: z.literal('cta'),
    text: z.string(),
  }),
]);

const bookedPageCollection = defineCollection({
  type: 'content',
  schema: z.object({
    hero: z.object({
      headline: z.string(),
      subheadline: z.string(),
      paragraphs: z.array(z.string()).optional(),
    }),
    whatToExpect: z.object({
      title: z.string(),
      intro: z.string().optional(),
      items: z.array(z.object({
        icon: z.string(),
        title: z.string(),
        description: z.string(),
      })),
    }),
    howToPrepare: z.object({
      title: z.string(),
      intro: z.string(),
      disclaimer: z.string(),
      questions: z.array(z.object({
        question: z.string(),
        categories: z.array(z.object({
          name: z.string(),
          examples: z.string(),
        })),
      })),
    }),
    yourReport: z.object({
      title: z.string(),
      description: z.string(),
      timeframe: z.string(),
    }),
    whatsNext: z.object({
      title: z.string(),
      intro: z.string(),
      contactText: z.string().optional(),
    }),
    footer: z.object({
      contactEmail: z.string(),
      copyright: z.string(),
      termsUrl: z.string(),
      privacyUrl: z.string(),
    }),
  }),
});

const hallwayTrackCollection = defineCollection({
  type: 'content',
  schema: z.object({
    hero: z.object({
      headline: z.string(),
      subheadline: z.string(),
    }),
    sections: z.array(z.object({
      id: z.string(),
      title: z.string(),
      content: z.array(contentBlockSchema),
    })),
    cta: z.object({
      headline: z.string(),
      text: z.string(),
      subtext: z.string(),
      email: z.string(),
    }),
    footer: z.object({
      copyright: z.string(),
      termsUrl: z.string(),
      privacyUrl: z.string(),
    }),
  }),
});

const homepageCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Common fields
    title: z.string().optional(),
    subtitle: z.string().optional(),

    // Hero specific
    headline: z.string().optional(),
    subheadline: z.string().optional(),
    heroDescription: z.string().optional(),
    ctaText: z.string().optional(),
    ctaSubtext: z.string().optional(),

    // Opening narrative / Meet Andrea intro
    opener: z.string().optional(),
    intro: z.string().optional(),
    paragraphs: z.union([
      z.array(z.string()),
      z.array(paragraphSchema),
    ]).optional(),
    painPointsIntro: z.string().optional(),
    painPoints: z.array(z.string()).optional(),
    closingParagraphs: z.array(z.string()).optional(),

    // Methodology approaches
    approaches: z.array(z.object({
      title: z.string(),
      paragraphs: z.array(z.string()),
      testimonial: z.object({
        quote: z.string(),
        author: z.string(),
        role: z.string().optional(),
      }).optional(),
    })).optional(),

    // Framework steps
    introText: z.string().optional(),
    steps: z.array(z.object({
      number: z.number(),
      title: z.string(),
      description: z.string(),
    })).optional(),

    // Find your lever
    epigraph: z.object({
      quote: z.string(),
      author: z.string(),
    }).optional(),
    introParagraphs: z.array(z.string()).optional(),
    challenges: z.array(z.object({
      title: z.string(),
      description: z.string(),
      tip: z.string(),
    })).optional(),
    closingText: z.string().optional(),
    closing: z.string().optional(),

    // Pricing
    pricingIntro: z.string().optional(),
    journeySteps: z.array(z.object({
      label: z.string(),
      description: z.string(),
    })).optional(),
    tiers: z.array(z.object({
      title: z.string(),
      price: z.number(),
      period: z.string().optional(),
      description: z.string(),
      features: z.array(z.string()).optional(),
      bestFor: z.string().optional(),
      highlight: z.string().optional(),
      featured: z.boolean().optional(),
      guarantee: z.string().optional(),
      ctaText: z.string().optional(),
    })).optional(),
    continuationTitle: z.string().optional(),
    teamCallout: z.object({
      text: z.string(),
      description: z.string(),
      linkText: z.string(),
    }).optional(),

    // Featured testimonial
    testimonial: z.object({
      quote: z.string(),
      author: z.string(),
      role: z.string().optional(),
    }).optional(),

    // FAQ
    questions: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),

    // What this is not
    items: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })).optional(),

    // Who this is for
    goodFit: z.array(z.string()).optional(),
    notGoodFit: z.array(z.string()).optional(),

    // Bullet highlights (e.g. "what this is" section)
    highlights: z.array(z.string()).optional(),

    // Testimonials section (references slugs from testimonials collection)
    featuredSlugs: z.array(z.string()).optional(),

    // CTA section (references a pricing tier by title)
    featuredTier: z.string().optional(),

    // Who this is for (brief homepage version)
    traits: z.array(z.string()).optional(),
    situations: z.array(z.string()).optional(),

    // How we work together
    engagements: z.array(z.object({
      icon: z.string(),
      title: z.string(),
      description: z.string(),
    })).optional(),

    // Footer
    contactEmail: z.string().optional(),
    copyright: z.string().optional(),
    termsUrl: z.string().optional(),
    privacyUrl: z.string().optional(),
  }),
});

const testimonialsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    quote: z.string(),
    author: z.string(),
    role: z.string().optional(),
    featured: z.boolean().optional(),
    order: z.number(),
  }),
});

const communityAgreementCollection = defineCollection({
  type: 'content',
  schema: z.object({
    hero: z.object({
      headline: z.string(),
      intro: z.string(),
    }),
    values: z.array(z.object({
      title: z.string(),
      description: z.string(),
      notOkay: z.array(z.string()).optional(),
      encouraged: z.array(z.string()).optional(),
      examples: z.array(z.object({
        type: z.enum(['bad', 'good']),
        text: z.string(),
      })).optional(),
    })),
    groundsForRemoval: z.object({
      intro: z.string(),
      categories: z.array(z.object({
        title: z.string(),
        description: z.string(),
      })),
      reportText: z.string(),
      reportUrl: z.string(),
    }),
    scope: z.string(),
    attribution: z.object({
      text: z.string(),
      url: z.string(),
    }),
    footer: z.object({
      copyright: z.string(),
    }),
  }),
});

const sbcCollection = defineCollection({
  type: 'content',
  schema: z.any(),
});

export const collections = {
  website: homepageCollection,
  testimonials: testimonialsCollection,
  'hallway-track-page': hallwayTrackCollection,
  'booked-page': bookedPageCollection,
  sbc: sbcCollection,
  'community-agreement': communityAgreementCollection,
};
