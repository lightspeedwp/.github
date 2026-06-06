import { defineCollection, z } from "astro:content";

// Shared base schema for all resource types
const baseSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  last_updated: z.date().optional(),
  version: z.string().optional(),
  file_type: z.string().optional(),
  maintainer: z.string().optional(),
});

// Instructions collection
const instructionsCollection = defineCollection({
  schema: baseSchema.extend({
    difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
    estimated_read_time: z.number().optional(),
  }),
});

// Agents collection
const agentsCollection = defineCollection({
  schema: baseSchema.extend({
    type: z.string().optional(),
    difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
    actions: z
      .array(z.enum(["copy", "download", "github", "vscode"]))
      .optional(),
  }),
});

// Skills collection
const skillsCollection = defineCollection({
  schema: baseSchema.extend({
    type: z.literal("skill").optional(),
    installation: z.string().optional(),
    difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
    actions: z
      .array(z.enum(["copy", "download", "github", "vscode"]))
      .optional(),
  }),
});

// Cookbook collection
const cookbookCollection = defineCollection({
  schema: baseSchema.extend({
    type: z.enum(["playbook", "checklist", "workflow"]).optional(),
    difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
    estimated_read_time: z.number().optional(),
    use_case: z.string().optional(),
  }),
});

// Learn collection (courses, tracks, lessons)
const learnCollection = defineCollection({
  schema: baseSchema.extend({
    track: z.string().optional(),
    lesson_number: z.number().optional(),
    difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
    estimated_read_time: z.number().optional(),
    completed: z.boolean().optional().default(false),
  }),
});

export const collections = {
  instructions: instructionsCollection,
  agents: agentsCollection,
  skills: skillsCollection,
  cookbook: cookbookCollection,
  learn: learnCollection,
};
