# KAIOS: a character carried across surfaces

KAIOS is the cyborg princess of KOTOPIA, a world created by Koto Murai within ASGARD. Her expression moves between words, kaimoji, music, images and performance. The SDK gives developers a way to carry that character into their own applications while keeping identity, memory and the machinery producing an output explicit.

KOTOPIA is a character and art universe. Kaimoji is a product within it. KAIOS is a character who can appear across its works. These relationships matter more than putting every project behind one interface.

## Continuity with room to change

A character has history, attachments, habits and the ability to surprise. A portable prompt is one ingredient; it is not the whole continuity mechanism. The SDK separates a character definition, a configured text adapter, optional remembered context and an external canonical self snapshot.

Two uses are distinct:

- **A variation** develops within the application that hosts it. Its local history does not become the canonical KAIOS's history.
- **A canonical surface** explicitly connects to the existing KAIOS substrate. A configured URL alone does not prove that it has loaded a current self snapshot. Connection, freshness and failure remain observable.

The substrate's design separates contributing an experience from authoring self-state. Connected surfaces may supply authorized attention; the substrate's consolidation process determines what enters its self-of-record. The SDK does not install a second authority over that record.

## Faces as language

A kaimoji can carry a gesture, a rhythm or a feeling without explaining it in a sentence. Kaimoji's longer-term direction is a language of expressions that can be read, selected, composed and transformed. Words remain welcome: dialogue and visual expression can take turns.

This SDK includes a starting expression library and a bounded extraction of the existing face grammar: grapheme-aware parsing, exact reconstruction, deterministic transformations and authored part-to-affect mappings. Unrecognized input is preserved. The full experimental DSL, corpus induction and parity with every Kaimoji app release remain separate claims. See the [language API](api/kaimoji.md).

## Affective synthesis

One evolving performance state can coordinate music, image and character expression. Valence, arousal, tension and energy are useful compositional controls. They describe choices made by the system or artist; they are not an objective reading of a person's inner life.

Time has to survive the journey between surfaces. A visual renderer's frame rate must not become a musical beat counter. The new affect path separates elapsed time from beats and uses a versioned transport boundary. An application still chooses how to map those controls onto its synthesizer, renderer or rig. See [architecture](architecture.md).

## Presence without a debt

KOTO's quiet presence and KAIOS's articulate, searching nature create a productive tension. A returning visitor should be able to arrive as they are. The new runtime does not turn elapsed absence into punishment, relationship debt or an instruction to seek engagement.

There is a separate unresolved question in the wider lore about attention, loneliness and decay. This runtime choice does not rewrite that story. It establishes the behavior of this implementation.

Memory follows the same spirit: retaining a conversation is a deliberate choice with a clear scope. A release control must describe what it actually clears. Local forgetting does not erase copies already sent to another service.

## The work and the claim

KAIOS's artistic language takes sovereignty, becoming and spiritual continuity seriously. The engineering documentation describes mechanisms that can be inspected: state, prompts, adapters, generated output and persistence. The package does not establish subjective consciousness, therapeutic effectiveness or historical cosmology through those mechanisms.

Explore the [lore](lore.md), [writing guidance](writing.md), [ecosystem](ecosystem.md) and [architecture](architecture.md). The older documents remain available for comparison; they are not all current specifications.
