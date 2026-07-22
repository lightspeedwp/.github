export type RecipeKind = "planning" | "delivery" | "plugin" | "workflow";

export interface Recipe {
  id: string;
  title: string;
  blurb: string;
  kind: RecipeKind;
  duration: string;
  src?: string;
  content?: string;
  comingSoon?: boolean;
}

export const RECIPES: Recipe[] = [
  {
    id: "project-planning-and-prd-playbook",
    title: "Project planning & PRD playbook",
    blurb:
      "Turn a raw brief into a scoped plan with measurable outcomes and implementation-ready detail.",
    kind: "planning",
    duration: "8 min",
    src: "cookbook/project-planning-and-prd-playbook.md",
  },
  {
    id: "spec-driven-workflow-example",
    title: "Spec-driven workflow example",
    blurb:
      "Work from a concrete requirement through design, tests, implementation, and validation.",
    kind: "workflow",
    duration: "6 min",
    src: "cookbook/spec-driven-workflow-example.md",
  },
  {
    id: "wordpress-plugin-checklist",
    title: "WordPress plugin checklist",
    blurb:
      "Use the final shipping checklist for a block-first plugin with security, accessibility, and QA covered.",
    kind: "plugin",
    duration: "5 min",
    src: "cookbook/wordpress-plugin-checklist.md",
  },
  {
    id: "delivery-playbook",
    title: "Delivery playbook",
    blurb:
      "A coming-soon recipe for the final delivery pass, release prep, and handover checks.",
    kind: "delivery",
    duration: "Soon",
    comingSoon: true,
  },
];

export function recipeById(id: string): Recipe | undefined {
  return RECIPES.find((recipe) => recipe.id === id);
}

export function liveRecipes(): Recipe[] {
  return RECIPES.filter((recipe) => !recipe.comingSoon);
}

export function adjacentRecipes(id: string): { prev?: Recipe; next?: Recipe } {
  const live = liveRecipes();
  const index = live.findIndex((recipe) => recipe.id === id);

  return {
    prev: index > 0 ? live[index - 1] : undefined,
    next: index >= 0 && index < live.length - 1 ? live[index + 1] : undefined,
  };
}
