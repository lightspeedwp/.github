/**
 * Every check, in report order.
 */
import type { Check } from '../types';
import { HeadingOrderCheck, ImageAltCheck, SingleH1Check } from './a11y';
import { DatabaseIdCheck, MarkupParseCheck, UnknownBlockCheck } from './markup';
import {
  NestedPatternCheck,
  PatternCategoryCheck,
  PatternEscapingCheck,
  PatternHeaderCheck,
  PatternRecommendedHeaderCheck,
  PatternSlugCheck,
  PatternSlugFilenameCheck,
  PatternTextDomainCheck,
} from './patterns';
import {
  ImportantCheck,
  MediaInCssCheck,
  PseudoStateKeyCheck,
  RawFontFamilyCheck,
  RawHexCheck,
  RawPxCheck,
} from './styles';
import { PatternRefCheck, TemplateNameCheck, TemplatePartRefCheck } from './templates';
import {
  DeclaredFilesCheck,
  DuplicateSlugCheck,
  type SchemaSource,
  ThemeJsonSchemaCheck,
  UndeclaredPartCheck,
} from './theme-json';
import { OrphanedCustomCheck, OrphanedPresetCheck } from './tokens';

export function allChecks(schemas: SchemaSource): Check[] {
  return [
    new ThemeJsonSchemaCheck(schemas),
    new DuplicateSlugCheck(),
    new DeclaredFilesCheck(),
    new UndeclaredPartCheck(),
    new OrphanedPresetCheck(),
    new OrphanedCustomCheck(),
    new PseudoStateKeyCheck(),
    new MediaInCssCheck(),
    new RawPxCheck(),
    new RawHexCheck(),
    new RawFontFamilyCheck(),
    new ImportantCheck(),
    new PatternHeaderCheck(),
    new PatternRecommendedHeaderCheck(),
    new PatternSlugCheck(),
    new PatternSlugFilenameCheck(),
    new PatternCategoryCheck(),
    new NestedPatternCheck(),
    new PatternEscapingCheck(),
    new PatternTextDomainCheck(),
    new TemplateNameCheck(),
    new TemplatePartRefCheck(),
    new PatternRefCheck(),
    new MarkupParseCheck(),
    new UnknownBlockCheck(),
    new DatabaseIdCheck(),
    new SingleH1Check(),
    new HeadingOrderCheck(),
    new ImageAltCheck(),
  ];
}
