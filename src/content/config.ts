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
  }),
});

export const collections = {
  homepage: homepageCollection,
};
