# Claude Code Technical Pack --- KHARTOUM RUG TYCOON

This document gives Claude Code a practical engine recommendation,
project structure, asset sources, GitHub repositories, implementation
rules, and quality gates for building **KHARTOUM RUG TYCOON**.

The goal is a polished 3D game with convincing rugs, cleaning
interaction, Sudanese-inspired environments, business simulation, and a
scalable production workflow.

------------------------------------------------------------------------

# 1. Recommended Technology

## Primary recommendation: Godot 4.x

Use Godot 4.x for an open-source, no-engine-royalty workflow and a
manageable indie production pipeline.

-   Engine: Godot 4.x, stable release.
-   Language: GDScript for gameplay systems.
-   3D content: Blender.
-   Asset interchange: glTF 2.0 / GLB.
-   Version control: Git.
-   Source editor/agent: Claude Code.
-   Textures: PNG, WebP where appropriate, and PBR texture sets.
-   Audio: WAV for source effects, OGG for runtime music/ambience.
-   Data: Godot Resources or JSON for content definitions; versioned
    save data for player progress.

Godot's documentation recommends glTF 2.0 for 3D scene interchange. See
the official import-format guidance:
https://github.com/godotengine/godot-docs/blob/master/tutorials/assets_pipeline/importing_3d_scenes/available_formats.rst

Official 3D export documentation:
https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/exporting_3d_scenes.html

If the project already uses Unity or Unreal, do not migrate
automatically. First inspect the existing project and preserve its
engine unless there is a documented reason to change.

# 2. Core Official Tools

  ---------------------------------------------------------------------------------------------------------
  Tool                    Purpose                 Link
  ----------------------- ----------------------- ---------------------------------------------------------
  Godot Engine            Main 3D game engine     https://github.com/godotengine/godot

  Godot Documentation     Engine API and          https://docs.godotengine.org/en/stable/
                          tutorials               

  Blender                 Modelling, UVs,         https://www.blender.org/
                          rigging, animation,     
                          baking                  

  Blender Manual          Modelling and export    https://docs.blender.org/manual/en/latest/
                          reference               

  Git                     Version control         https://git-scm.com/

  GitHub CLI              Repository and issue    https://cli.github.com/
                          workflow                

  Claude Code Docs        Agent workflow and      https://docs.anthropic.com/en/docs/claude-code/overview
                          configuration           
  ---------------------------------------------------------------------------------------------------------

# 3. GitHub Repositories and Asset Libraries

Use the following as starting points, not as permission to import every
asset blindly. Check the licence of the exact pack or file before
including it in a distributed build.

## 3.1 Godot and Game Architecture

-   **Godot Engine source:** https://github.com/godotengine/godot\
    Engine source, examples, and issue tracking.

-   **Godot demo projects:**
    https://github.com/godotengine/godot-demo-projects\
    Official examples for learning engine patterns. Inspect individual
    demo licences and adapt only what is needed.

-   **Godot Asset Library:** https://godotengine.org/asset-library/\
    Plugins and reusable components. Review maintenance status,
    compatibility, permissions, and licence.

-   **Godot Jolt Physics:** https://github.com/godot-jolt/godot-jolt\
    Optional physics backend. Use only if profiling shows a real need;
    the built-in physics may be sufficient.

-   **Godot Blender Exporter:**
    https://github.com/godotengine/godot-blender-exporter\
    Experimental native scene exporter. Prefer the standard glTF 2.0
    workflow unless this add-on is proven compatible with the project's
    exact versions.

## 3.2 3D Models and Environment Assets

-   **Kenney assets:** https://kenney.nl/assets\
    Game-ready 2D/3D packs, UI, and audio. Many individual packs are
    CC0; verify the licence on each pack page.

-   **Quaternius:** https://quaternius.com/\
    Stylised 3D characters, props, and environment kits. Verify the
    licence for each downloaded pack.

-   **KayKit:** https://kaylousberg.com/game-assets\
    Stylised game asset packs. Check the terms attached to the selected
    pack and edition.

-   **Poly Haven:** https://polyhaven.com/\
    HDRIs, textures, and 3D models. Assets are published under CC0;
    retain source records in the asset ledger.

-   **ambientCG:** https://ambientcg.com/\
    PBR materials and environment assets. Confirm the licence and record
    the asset identifier.

-   **BlenderKit:** https://www.blenderkit.com/\
    Additional models and materials. Asset licences and account
    requirements vary; do not assume all assets are free for commercial
    use.

-   **Sketchfab:** https://sketchfab.com/\
    Useful for reference and models. Filter by licence and inspect each
    model's attribution and redistribution conditions.

-   **OpenGameArt:** https://opengameart.org/\
    Community game assets. Licences vary per upload; verify before use.

## 3.3 Textures, Shaders, and Materials

-   **Material Maker:** https://github.com/RodZill4/material-maker\
    Open-source procedural material authoring tool. Useful for creating
    rug fibres, tile, concrete, painted walls, and fabric patterns.

-   **Godot Shaders:** https://godotshaders.com/\
    Community shader examples. Treat snippets as references; inspect
    licence and compatibility before reuse.

-   **ambientCG:** https://ambientcg.com/\
    PBR texture library.

-   **Poly Haven textures:** https://polyhaven.com/textures\
    PBR materials for realistic surfaces.

## 3.4 UI, Icons, and Fonts

-   **Lucide Icons:** https://github.com/lucide-icons/lucide\
    Clean icon set. Check the repository licence and include required
    notices.

-   **Google Fonts:** https://fonts.google.com/\
    Typography source. Verify the specific font licence.

-   **Noto Fonts:** https://github.com/notofonts\
    Broad script coverage. Useful for Arabic and multilingual UI; test
    Arabic shaping and right-to-left layout in the actual engine.

-   **Godot UI examples:**
    https://github.com/godotengine/godot-demo-projects\
    Use as reference for responsive menus, containers, and input
    handling.

## 3.5 Audio

-   **Kenney audio:** https://kenney.nl/assets\
    Short UI sounds and game audio packs; verify each pack's licence.

-   **Sonniss GDC Audio:** https://sonniss.com/gameaudiogdc\
    Large sound-effect bundles. Read the applicable licence and
    redistribution terms for the exact bundle.

-   **Freesound:** https://freesound.org/\
    Search for machine motors, water spray, footsteps, traffic, and
    workshop ambience. Licences vary; filter carefully and record
    attribution.

-   **jsfxr:** https://sfxr.me/\
    Generate simple original interface and arcade sounds.

# 4. Rug-Specific Art and Simulation Pipeline

Rugs are the hero asset. Do not rely on a flat plane with one static
texture for the final game.

## 4.1 Rug Mesh

Create a reusable rug generator or a small set of well-authored base
meshes: - Rectangular, runner, square, and round silhouettes. - Slightly
irregular edges where appropriate. - Bevelled or softened edge
profile. - Separate backing and pile surface where performance allows. -
UVs suitable for pattern variation and dirt masks.

For close-up cleaning, add controlled pile geometry, cards, or
shader-based fibre detail. Avoid millions of individual strands.

## 4.2 Rug Materials

Create material presets for: - Wool. - Cotton. - Synthetic short pile. -
Synthetic long pile. - Flatweave. - Worn or faded rug. - Wet rug. -
Foam-covered rug.

Use PBR maps where they materially improve the appearance: - Base
colour. - Normal. - Roughness. - Height/displacement only where
performance allows. - Ambient occlusion where useful.

## 4.3 Dirt and Cleaning Masks

Recommended implementation: - A low-resolution or medium-resolution
texture mask per rug. - Dirt intensity stored in a grayscale channel. -
Stain type stored in a separate mask or ID map. - Wetness stored
independently. - Brush footprint updates the mask over time. - Material
shader blends clean and dirty appearance. - Foam is a separate overlay
or particle layer.

Do not regenerate the rug mesh every frame. Update textures or shader
parameters efficiently. Use a lower-resolution simulation texture for
distant rugs and a higher-resolution texture for close-up hero jobs.

## 4.4 Cleaning Tool Feedback

Each tool must have: - Physical dimensions and contact footprint. -
Working range. - Brush speed or pressure. - Water/detergent
consumption. - Noise and power requirements. - Wear and maintenance
condition. - Material compatibility.

A machine should not clean outside its actual brush footprint. Brush
overlap should affect score and dirt removal.

# 5. Recommended Project Folder Structure

``` text
khartoum-rug-tycoon/
├── project.godot
├── README.md
├── CHANGELOG.md
├── TASKS.md
├── ASSET_CREDITS.md
├── LICENSES/
├── addons/
├── assets/
│   ├── characters/
│   ├── vehicles/
│   ├── rugs/
│   │   ├── meshes/
│   │   ├── patterns/
│   │   ├── materials/
│   │   └── masks/
│   ├── tools/
│   ├── furniture/
│   ├── buildings/
│   ├── props/
│   ├── vegetation/
│   ├── ui/
│   ├── audio/
│   └── fonts/
├── scenes/
│   ├── boot/
│   ├── menus/
│   ├── player/
│   ├── city/
│   ├── customer_homes/
│   ├── workshop/
│   ├── rug_cleaning/
│   ├── rug_shop/
│   └── vehicles/
├── scripts/
│   ├── core/
│   ├── player/
│   ├── cleaning/
│   ├── economy/
│   ├── business/
│   ├── customers/
│   ├── inventory/
│   ├── world/
│   ├── ui/
│   └── save/
├── data/
│   ├── rugs/
│   ├── stains/
│   ├── tools/
│   ├── products/
│   ├── customers/
│   ├── jobs/
│   └── economy/
├── shaders/
│   ├── rug/
│   ├── water/
│   ├── foam/
│   └── environment/
├── tests/
└── docs/
    ├── architecture/
    ├── gameplay/
    ├── art/
    └── decisions/
```

# 6. Required Systems and Suggested Scripts

Build small, testable modules. Suggested names:

``` text
GameManager.gd
PlayerController.gd
InteractionManager.gd
WorldClock.gd
WeatherManager.gd
SeasonManager.gd
JobGenerator.gd
CustomerManager.gd
RugDefinition.gd
RugInstance.gd
StainDefinition.gd
CleaningSimulation.gd
CleaningTool.gd
CleaningScore.gd
CurrencyWallet.gd
CashLedger.gd
BusinessManager.gd
ShopInventory.gd
SupplierManager.gd
EquipmentManager.gd
StaffManager.gd
ReputationManager.gd
SaveManager.gd
```

Use typed GDScript where practical. Avoid one monolithic script. Use
signals for decoupled communication and Resources for reusable game
data.

# 7. Visual Quality Requirements

## Lighting

-   Use a consistent world environment and exposure.
-   Create a warm daylight profile and a separate night profile.
-   Use contact shadows and soft directional shadows.
-   Use baked lighting for static interiors when appropriate.
-   Use reflection probes or suitable alternatives for interiors.
-   Avoid excessive bloom, oversaturated colour, and crushed shadows.

## Materials

-   Use physically plausible roughness values.
-   Differentiate wet and dry surfaces.
-   Ensure foam does not look like solid white plastic.
-   Make rug pile respond to lighting and viewing angle.
-   Avoid stretching patterns across rugs of different aspect ratios.

## Environment

-   Use modular building pieces and consistent scale.
-   Build a small polished neighbourhood before expanding.
-   Add visual landmarks to aid navigation.
-   Use LODs and occlusion/culling where beneficial.
-   Keep props varied but avoid random asset styles.

## Characters

-   Use rigged, reusable characters.
-   Create a small animation library: idle, walk, carry rug, greet,
    inspect, brush, operate machine, count cash, and interact with shop
    displays.
-   Use consistent proportions and clothing style.
-   Ensure clothing is culturally respectful and not a costume
    caricature.

# 8. Performance and Engineering Rules

-   Profile before optimising.
-   Avoid per-frame allocations in frequently called systems.
-   Pool particles where necessary.
-   Limit transparent overlapping layers, especially foam.
-   Use LODs for city assets.
-   Use texture atlases where appropriate.
-   Keep rug simulation resolution adaptive to camera distance.
-   Separate simulation logic from visual effects.
-   Save only durable game state, not transient particle state.
-   Autosave after major business transactions and job completion.
-   Handle corrupted or older save versions safely.
-   Use deterministic job seeds where useful for reproducible bug
    reports.

# 9. Currency and Data Integrity

-   Use integer values for SDG balances; avoid floating-point money.
-   All transactions must pass through a central ledger.
-   Never directly change wallet balance from unrelated UI scripts.
-   Record transaction type, amount, date/time, job/order ID, and
    resulting balance.
-   Validate that a purchase cannot create negative stock or bypass
    funds.
-   Keep example game prices in a separate balance configuration file.
-   Label all fictional prices as game-economy values in design
    documentation.
-   Do not scrape or assume live exchange rates.

For paper banknotes, create original fictional game artwork marked as an
in-game prop. Do not trace or recreate real banknote security features
or produce a photorealistic counterfeit-like image.

# 10. Arabic and English Localisation

-   Support Arabic and English from the start.
-   Implement right-to-left layout properly.
-   Test Arabic shaping, punctuation, numbers, currency formatting, and
    mixed Arabic/Latin text.
-   Use a font with a suitable Arabic licence and glyph coverage.
-   Do not concatenate translated sentence fragments in code.
-   Keep all UI text in translation resources.
-   Allow the player to name the store in Arabic or English.
-   Provide a fallback font and test on the target platform.

# 11. Asset Licence and Attribution Workflow

Create `ASSET_CREDITS.md` and record every external asset: - Asset
name. - Creator/publisher. - Original source URL. - Exact download URL
or pack identifier. - Licence name and version. - Whether attribution is
required. - Date downloaded. - Modifications made. - File paths in the
project.

Important: - A free download is not automatically free for commercial
use. - A repository's licence may not cover assets bundled from third
parties. - Verify the licence of the exact asset pack, not only the
website. - Do not commit assets with unclear terms. - Keep a copy of
licence notices where required. - Re-check licences before commercial
release.

# 12. Claude Code Working Rules

Place these rules in `CLAUDE.md` at the repository root.

``` markdown
# Project Rules

1. Read the GDD and technical resource document before implementation.
2. Inspect the current repository before changing files.
3. Do not replace the selected engine or project architecture without approval.
4. Build a playable vertical slice before expanding the city.
5. Use modular, typed, maintainable GDScript.
6. Keep game content data-driven.
7. Do not use unlicensed assets or assets with unclear provenance.
8. Record every external asset in ASSET_CREDITS.md.
9. Never claim a feature works without running it and testing it.
10. Add or update tests for economy, scoring, inventory, and save/load.
11. Keep a clear TASKS.md with implemented, in-progress, planned, and blocked items.
12. Use placeholder assets only when clearly labelled and scheduled for replacement.
13. Do not fake cleaning: brush position, footprint, pressure, and material response must affect the rug.
14. Keep SDG transactions integer-based and centralised.
15. Support Arabic RTL and English localisation.
16. Optimise only after profiling.
17. Before each milestone, report changed files, tests run, known issues, and next steps.
```

# 13. Suggested Build Order

## Sprint 0 --- Repository Audit

-   Inspect engine version and project structure.
-   Confirm target platform and performance target.
-   Create technical architecture notes.
-   Create asset ledger and licence policy.
-   Produce a simple art direction board.

## Sprint 1 --- Rug Cleaning Vertical Slice

-   One rug mesh and material.
-   Dirt mask.
-   One brush tool.
-   Brush footprint and cleaning response.
-   Foam and wetness.
-   Basic scoring.
-   One test room.

## Sprint 2 --- Job and Payment Loop

-   Customer request.
-   Rug inspection.
-   Job quote.
-   Cleaning workflow.
-   Result screen.
-   SDG cash payment and ledger.
-   Save/load.

## Sprint 3 --- Home Visits and Progression

-   Small neighbourhood.
-   Player movement and interactions.
-   Customer homes.
-   Job scheduling.
-   Basic trolley.
-   Equipment upgrades.

## Sprint 4 --- Workshop and Economy

-   Rent and operating costs.
-   Workshop layout.
-   Equipment purchases.
-   Inventory and supplies.
-   Maintenance.
-   Reputation.

## Sprint 5 --- City Life and Weather

-   Day/night cycle.
-   Seasonal profiles.
-   Dust, rain, humidity, and temperature effects.
-   NPC schedules and ambient activity.

## Sprint 6 --- Rug Retail

-   Supplier catalogue.
-   Stock and display.
-   Sales and margins.
-   Store name and logo customisation.
-   Customer browsing and negotiation.

## Sprint 7 --- Polish and Release Preparation

-   Character animation.
-   Audio.
-   Visual effects.
-   UI localisation.
-   Performance pass.
-   Accessibility.
-   QA and packaging.

# 14. Definition of Done

A feature is complete only when: - It is implemented in the actual
project. - It has been tested in the engine. - It behaves correctly in
normal and edge cases. - It does not break save/load. - It has no
obvious performance regression. - Its external assets are licensed and
recorded. - Its UI works in Arabic and English where relevant. - Its
status is accurately reflected in `TASKS.md`.

# 15. Final Instruction to Claude Code

Do not attempt to generate the entire game in one pass. Start by
auditing the repository, then produce a concise architecture proposal
and a playable rug-cleaning prototype. The first prototype must
demonstrate a genuinely interactive rug surface: brush contact changes
dirt coverage, foam and wetness respond to treatment, and the final
score reflects cleaning quality and material safety.

Once that core loop is enjoyable and stable, expand into home visits,
the SDG economy, workshop rental, equipment progression,
Khartoum-inspired world simulation, and finally the rug retail business.

Prioritise craft, clarity, visual consistency, and tested functionality
over feature count.
