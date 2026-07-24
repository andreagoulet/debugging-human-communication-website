import { defineCollection, z } from 'astro:content';

// Reusable schema for paragraphs with optional emphasis
const paragraphSchema = z.object({
  text: z.string(),
  emphasis: z.enum(['bold', 'italic']).optional(),
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
    waysIn: z.object({
      eyebrow: z.string(),
      title: z.string(),
      description: z.string(),
      fitCall: z.object({
        title: z.string(),
        priceLabel: z.string(),
        description: z.string(),
        features: z.array(z.string()).optional(),
        ctaText: z.string(),
      }),
    }).optional(),
    membership: z.object({
      eyebrow: z.string(),
      title: z.string(),
      description: z.string().optional(),
      included: z.array(z.object({
        title: z.string(),
        schedule: z.string().optional(),
        description: z.string(),
      })).optional(),
      price: z.number(),
      period: z.string(),
      terms: z.string().optional(),
      bestForTitle: z.string().optional(),
      bestFor: z.array(z.string()).optional(),
    }).optional(),
    privateCoaching: z.object({
      eyebrow: z.string(),
      title: z.string(),
      description: z.string().optional(),
      features: z.array(z.string()).optional(),
      price: z.number(),
      period: z.string(),
      terms: z.string().optional(),
      bestForTitle: z.string().optional(),
      bestFor: z.array(z.string()).optional(),
    }).optional(),
    teams: z.object({
      eyebrow: z.string(),
      title: z.string(),
      description: z.string(),
      offerings: z.array(z.object({
        title: z.string(),
        description: z.string(),
      })).optional(),
      ctaText: z.string(),
    }).optional(),
    tiers: z.array(z.object({
      title: z.string(),
      price: z.number(),
      priceLabel: z.string().optional(),
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

    // Legal pages (privacy, terms) — nested hero + free-form sections
    hero: z.object({
      headline: z.string(),
      effectiveDate: z.string().optional(),
      company: z.string().optional(),
      contactEmail: z.string().optional(),
    }).optional(),
    sections: z.array(z.any()).optional(),
  }),
});

// Shared collection contains testimonials (shared/testimonials/) and community agreement (shared/community-agreement/).
// Uses z.any() because the two content types have distinct schemas.
// Files are distinguished by their entry ID path prefix.
const sharedCollection = defineCollection({
  type: 'content',
  schema: z.any(),
});

// Landing pages collection uses z.any() because each page has a distinct schema.
// Type safety is enforced at the page level where the data is consumed.
const landingPagesCollection = defineCollection({
  type: 'content',
  schema: z.any(),
});

// Agenda collection: one entry per facilitator-script section.
// Frontmatter holds the schedule metadata; the markdown body holds the prose.
const agendaCollection = defineCollection({
  type: 'content',
  schema: z.object({
    order: z.number(),
    title: z.string(),
    timing: z.string(),
    anchor: z.string(),
    start: z.string(),
    end: z.string(),
    min: z.number(),
  }),
});

export const collections = {
  website: homepageCollection,
  shared: sharedCollection,
  'landing-pages': landingPagesCollection,
  agenda: agendaCollection,
};
