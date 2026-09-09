/** Portable, public character direction. Narrative is authored character direction, not a capability claim. */
interface CharacterDefinition {
    readonly schemaVersion: 1;
    readonly id: string;
    readonly revision: string;
    readonly name: string;
    readonly premise: string;
    readonly voice: readonly string[];
    readonly relationships: readonly string[];
    readonly boundaries: readonly string[];
}
declare const KAIOS_CHARACTER: CharacterDefinition;
/** Compile an application-owned character definition. Do not pass untrusted character cards here. */
declare function compileCharacterPrompt(character?: CharacterDefinition): string;

export { type CharacterDefinition, KAIOS_CHARACTER, compileCharacterPrompt };
