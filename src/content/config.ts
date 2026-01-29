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
    tiers: z.array(z.object({
      title: z.string(),
      price: z.number(),
      period: z.string().optional(),
      description: z.string(),
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

    // Footer
    contactEmail: z.string().optional(),
    copyright: z.string().optional(),
    termsUrl: z.string().optional(),
    privacyUrl: z.string().optional(),
  }),
});

export const collections = {
  homepage: homepageCollection,
  'hallway-track-page': hallwayTrackCollection,
};
