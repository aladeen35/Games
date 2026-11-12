# KHARTOUM RUG TYCOON

## Full 3D Game Design Document (GDD)

**Working title:** KHARTOUM RUG TYCOON\
**Arabic title option:** غسيل وسجاد الخرطوم\
**Genre:** 3D business simulation + hands-on cleaning + light life
simulation + shop management\
**Primary platform target:** PC first, with a scalable mobile control
layout as a later milestone\
**Setting:** A fictionalised, carefully researched version of Khartoum,
Sudan\
**Core fantasy:** Start with a small rug-cleaning service that visits
customers' homes, build a trusted local business, rent a workshop, buy
professional equipment, open a rug shop, and eventually operate a
complete rug-cleaning and rug-retail company.

------------------------------------------------------------------------

# 1. High Concept

The player begins with almost no capital, a basic cleaning kit, and a
small home base. Customers book rug cleaning at their homes. The player
travels through neighbourhood streets, inspects rugs, chooses the
correct treatment, performs a tactile cleaning minigame, delivers the
rug or completes the job on site, and receives payment in Sudanese
pounds (SDG).

Every successful job builds more than money: - Customer trust and
business reputation. - Cleaning skill and specialist knowledge. - Access
to better equipment and more complex rug types. - Relationships with
suppliers, landlords, transport providers, and repeat customers. - A
business portfolio that gradually expands from home visits to a
workshop, then a showroom and full rug-care operation.

The game must feel like a living business simulation, not a repetitive
"hold a button until the dirt disappears" game.

# 2. Design Pillars

1.  **Satisfying rug cleaning:** Visible, material-aware cleaning with
    convincing foam, water, dirt release, brush contact, extraction, and
    drying.
2.  **A living Khartoum:** Distinct neighbourhoods, Sudanese
    architecture, realistic clothing, local transport, weather,
    day/night cycles, and seasonal changes.
3.  **A believable business:** Costs, cash flow, rent, wages, stock,
    suppliers, customer expectations, maintenance, and risk.
4.  **Varied decisions:** Each rug, customer, stain, location, and
    weather condition creates a different problem.
5.  **Progress with purpose:** Every upgrade unlocks a new capability or
    business opportunity, not merely a larger number.
6.  **Warm visual identity:** Beautiful colour, tactile materials,
    readable interfaces, and an inviting art direction inspired by
    Sudanese craft and urban life.

# 3. Core Gameplay Loop

1.  Receive a booking, walk-in request, phone call, or neighbourhood
    referral.
2.  Review the customer's location, rug type, size, condition, deadline,
    and budget.
3.  Decide whether to accept, negotiate, decline, or schedule the job.
4.  Travel to the customer or arrange collection.
5.  Inspect the rug: identify fibre, construction, colourfastness risk,
    stains, odour, and damage.
6.  Select a treatment plan and estimate time, water, detergent, labour,
    and cost.
7.  Prepare the work area and equipment.
8.  Perform the cleaning stages using skill-based interactions.
9.  Extract moisture, dry the rug, and inspect the result.
10. Return the rug, collect payment, and request a review.
11. Pay expenses, maintain equipment, restock supplies, and reinvest
    profits.
12. Unlock more demanding customers, larger jobs, contracts, and new
    business premises.

The player should make meaningful choices at every stage. A perfect
score should not be achieved by simply repeating the same movement
pattern.

# 4. The Cleaning Simulation

## 4.1 Rug Construction and Material Types

Create distinct rug profiles with different physical and cleaning
behaviour: - Synthetic polypropylene rug. - Polyester rug. - Cotton
flatweave. - Wool rug. - Handwoven traditional rug. - Thick pile rug. -
Delicate decorative rug. - Large family-room rug. - Small prayer rug. -
Runner and hallway rug.

Each rug has data fields: - Width, length, pile height, and approximate
weight. - Fibre/material category. - Dirt load by surface region. -
Stain types and severity. - Odour level. - Moisture absorption and
drying rate. - Colourfastness and shrinkage risk. - Existing damage,
fraying, or weak backing. - Customer-declared value and sentimental
value.

Do not make all rugs behave identically. Delicate wool and handwoven
rugs should require gentler chemistry and lower mechanical force than
robust synthetic rugs.

## 4.2 Dirt and Stain System

Use multiple stain classes with different removal behaviour: - Dry dust
and sand. - Mud and dried soil. - Tea and coffee. - Food grease and
cooking oil. - Juice and coloured drinks. - Pet hair and odour. - Ink or
dye transfer. - Unknown old stains.

Each stain should have: - A stain mask or material layer. - A
depth/penetration value. - A chemical compatibility value. - A response
to agitation, dwell time, rinsing, and extraction. - A risk of spreading
or setting if treated incorrectly.

Some stains should remain partially visible if the player chooses an
unsuitable process. This creates authentic trade-offs and makes
inspection important.

## 4.3 Cleaning Stages

A standard job can include: 1. Inspection and photography. 2. Dry soil
removal / vacuuming. 3. Spot testing on a hidden area. 4. Pre-treatment
of selected stains. 5. Controlled detergent application. 6. Rotary
brushing, hand brushing, or low-agitation treatment. 7. Rinsing. 8.
Water extraction. 9. Controlled drying. 10. Final grooming, inspection,
packaging, and delivery.

Not every rug needs every stage. A small lightly soiled rug may need a
quick process; a valuable wool rug may need a careful multi-stage
treatment.

## 4.4 Interactive Cleaning Controls

Use a clear, skill-based control system: - Brush pressure. - Machine
speed. - Movement direction. - Overlap coverage. - Chemical dosage. -
Water flow. - Dwell time. - Extraction passes. - Drying airflow.

The player receives live feedback: - Coverage heatmap. - Remaining dirt
by region. - Excess moisture warning. - Chemical overuse warning. -
Fibre stress warning. - Missed-edge indicator. - Uneven-cleaning
indicator.

Do not reward frantic movement. Reward controlled, complete,
material-appropriate work.

## 4.5 Physical and Visual Feedback

-   Dirt gradually lifts from the rug rather than disappearing
    instantly.
-   Foam density responds to detergent amount and water.
-   Wet fibres become darker and slightly heavier-looking.
-   Brush contact visibly changes pile direction.
-   Extractor passes reduce visible moisture.
-   Drying changes the material from wet to damp to dry.
-   Cleaned and uncleaned regions should be easy to compare.
-   Use decals, masks, shader parameters, or tiled material layers
    instead of creating a new full mesh for every stain.

# 5. Anti-Repetition System

The game must prevent cleaning jobs from becoming identical.

## 5.1 Job Variation

Generate each contract from a combination of: - Rug size, shape, fibre,
age, and pattern. - Dirt distribution and stain combinations. - Customer
budget and deadline. - Room layout and available working space. - Water
and electricity availability. - Customer instructions and special
requests. - Weather and drying conditions. - Access difficulty: stairs,
narrow corridors, distance from parking. - Time of day and neighbourhood
activity.

## 5.2 Natural Challenges

Examples: - A sudden dust storm delays outdoor work. - High humidity
slows drying. - A water interruption forces the player to use stored
water or reschedule. - A power cut disables powered equipment until
backup power is available. - A customer has an urgent family visit and
needs a rush service. - A narrow staircase makes a large rug difficult
to move. - A delicate rug has unstable dye and requires a spot test. - A
supplier delivers the wrong detergent. - A machine overheats after
prolonged use. - A customer disputes an unexpected extra charge. - A
vehicle tyre puncture delays a delivery. - A neighbour recommends the
business after seeing a good result. - A high-value rug arrives with
pre-existing damage that must be documented. - A customer asks for a
repair that the player is not yet qualified to perform.

Challenges must be fair, explainable, and solvable through planning.
Avoid random punishment without player agency.

## 5.3 Rotating Activities

-   Weekly neighbourhood cleaning campaign.
-   Seasonal deep-cleaning rush.
-   School, office, mosque, or hospitality contracts.
-   Rug market day.
-   Supplier discount week.
-   Customer referral challenge.
-   Equipment maintenance day.
-   Community event requiring fast service.

# 6. Khartoum World Simulation

## 6.1 World Layout

Build a fictionalised, respectful and recognisable Khartoum-inspired
city. Use distinct districts rather than one repetitive street.

Potential districts: - Residential neighbourhood with family homes and
courtyards. - Busy commercial street with small shops and workshops. -
Traditional market-inspired district. - Modern apartment area. -
Workshop and light-industrial area. - Riverfront-inspired public
space. - Outer neighbourhood with dusty roads and lower-cost premises.

Use fictional business names and fictional street addresses unless
specific real places are intentionally researched and licensed.

## 6.2 Architecture and Props

Create a coherent visual kit: - Flat-roofed buildings, balconies, shaded
verandas, metal gates, plaster walls, tiled floors, courtyards, water
tanks, rooftop structures, and shop shutters. - Small groceries, tea
stalls, repair shops, tailoring shops, transport stops, and rug
merchants. - Realistic street furniture, power poles, signs, bins, water
containers, and delivery loading areas. - Interior layouts with sofas,
fans, curtains, shelves, rugs, and family living spaces.

Avoid treating the whole city as a generic desert. Khartoum should have
varied streets, vegetation, river influence, built-up districts, and
everyday life.

## 6.3 People, Clothing, and Behaviour

Use varied adult NPCs and family-safe character designs: - Customers in
believable everyday Sudanese clothing. - Men in jalabiyas, shirts,
trousers, and locally appropriate casual wear. - Women in varied modest
everyday clothing and toub-inspired outfits. - Workers in practical
workwear, gloves, aprons, and protective footwear. - Different ages,
body shapes, and personal styles. - Natural walking, waiting,
bargaining, carrying, greeting, and working animations.

Research clothing references and avoid reducing all Sudanese people to
one costume. Do not caricature accents, appearance, poverty, or social
class.

## 6.4 Transport

Possible vehicles and transport: - Walking and hand-carrying small
rugs. - Hand trolley for medium rugs. - Small delivery three-wheeler or
cargo vehicle. - Pickup or small van for larger contracts. - Public
transport as moving background ambience, not necessarily
player-controlled in the first release.

Vehicle ownership should be an expensive milestone with fuel,
maintenance, and repair costs.

# 7. Day, Night, and Seasonal Calendar

## 7.1 Full Day/Night Cycle

Use a continuous clock: - Dawn: warm, low-angle sunlight and quiet
streets. - Morning: customer visits and deliveries. - Midday: strong
sunlight and heat management. - Afternoon: long shadows and busy
neighbourhood activity. - Sunset: warm sky and evening routines. -
Night: shop lighting, quieter streets, security considerations, and
different customer availability.

NPC schedules should vary by occupation and day. The player may choose
to work late, but fatigue, safety, and operating costs should matter.

## 7.2 Khartoum-Inspired Seasons

Use a simplified local climate calendar, with research-based tuning: -
Hot dry period. - Hotter pre-rainy period. - Rainy season. - Cooler dry
period.

Weather effects: - Temperature changes drying speed and worker
fatigue. - Humidity affects drying time and odour risk. - Rain can
prevent outdoor drying. - Dust and wind increase dry-soil
accumulation. - Seasonal demand changes the number and type of bookings.

Do not present the simulation as a precise meteorological forecast. It
is a game system inspired by Khartoum's broad seasonal patterns.

# 8. Sudanese Currency and Business Economy

## 8.1 Currency

The in-game currency is the **Sudanese pound (SDG)**.

Use a cash wallet interface and physical paper banknotes as collectible
visual objects: - Notes should be stylised game props with clear
fictional design, not photorealistic reproductions of legal tender. -
Show the denomination clearly and include an unmistakable fictional-game
marking. - Support configurable denominations and prices. Confirm the
currently valid real-world banknote series and denominations from
official Central Bank references before using real-world visual
references. - Use SDG formatting consistently in UI, receipts, invoices,
price labels, and shop ledgers.

The game economy should be internally consistent. Avoid tying game
prices to volatile real-world exchange rates.

## 8.2 Example Starting Economy

These are **game-balance placeholders**, not claims about current market
prices. Tune them through playtesting.

  Item / service                       Example game price
  ---------------------------------- --------------------
  Small rug home-cleaning job                   8,000 SDG
  Medium rug cleaning                          15,000 SDG
  Large rug cleaning                           25,000 SDG
  Delicate-fibre surcharge                      5,000 SDG
  Rush-service surcharge                              30%
  Basic cleaning kit                           45,000 SDG
  Used entry-level rotary machine             180,000 SDG
  First workshop deposit and setup            500,000 SDG

The player starts with a modest amount of cash, a basic manual kit, and
no rented shop. Adjust the initial balance so the first few jobs are
achievable without grinding.

## 8.3 Cash Flow

Track: - Revenue by job. - Deposits and outstanding balances. -
Detergent, water, electricity, and fuel. - Rent and security deposit. -
Equipment purchase and maintenance. - Vehicle purchase, fuel, and
repairs. - Staff wages and training. - Stock purchases and unsold
inventory. - Refunds, rework, and customer compensation. - Taxes or
licence fees only if the game chooses to model them with researched,
clearly fictional rules.

Profit is not the same as cash in hand. The player must reserve money
for upcoming rent, wages, and supplies.

## 8.4 Physical Cash

When a customer pays cash: - Show a short hand-to-hand payment
interaction. - Display stylised paper notes being counted. - Give a
receipt with job number, service, date, and total SDG. - Allow
change-making and cash drawer management. - Add optional digital payment
later, without replacing the requested paper-currency identity.

# 9. Business Progression

## Phase 1 --- Home-Visit Cleaner

-   Work from a small home base.
-   Accept jobs by phone or neighbourhood referrals.
-   Use manual brushes, buckets, and a basic vacuum.
-   Carry equipment by hand or trolley.
-   Build reputation and save for the first premises.

**Milestone:** Earn enough for a workshop deposit, initial rent, and a
small emergency reserve.

## Phase 2 --- Rented Cleaning Workshop

-   Rent a compact commercial unit.
-   Install a wash area, drainage, drying racks, storage, and a customer
    counter.
-   Buy a rotary brush machine and wet vacuum/extractor.
-   Process more rugs safely and efficiently.
-   Manage water storage, power, noise, and operating hours.

**Milestone:** Complete a set number of jobs with a stable reputation
and positive cash flow.

## Phase 3 --- Professional Rug-Care Centre

-   Buy specialist tools for delicate fibres.
-   Add a dedicated stain-treatment station.
-   Install improved extraction and drying systems.
-   Hire a helper and later a trained cleaner.
-   Introduce pickup and delivery scheduling.
-   Offer premium services and commercial contracts.

## Phase 4 --- Rug Retail and Showroom

Open a combined rug-care and rug-sales store: - Buy rugs from suppliers
and artisans. - Display rugs on shelves, racks, hanging rails, and floor
stands. - Rotate display stock and create room-style displays. - Sell
new, used, repaired, and cleaned rugs. - Offer custom orders and
delivery. - Buy damaged/used rugs, restore them, and resell them where
appropriate.

## Phase 5 --- Full Business

-   Multiple service teams.
-   Multiple neighbourhood coverage.
-   Workshop expansion.
-   Wholesale supply relationships.
-   Commercial cleaning contracts.
-   Rug repair and restoration.
-   Branded delivery vehicles.
-   Staff schedules, payroll, quality audits, and customer service.
-   A second branch or a larger showroom.

# 10. Rug Shop and Inventory System

Each rug product has: - SKU and product name. - Size, material, weave,
pattern, and colour palette. - Supplier and purchase cost. - Retail
price and expected margin. - Stock quantity and storage location. -
Condition grade. - Cleaning/repair history if second-hand. - Display
position and customer interest.

Shop interactions: - Browse and inspect rugs. - Unroll a rug in a
preview area. - Compare dimensions and materials. - Rotate or reposition
display stock. - Negotiate with customers. - Offer delivery and cleaning
bundles. - Apply discounts without selling below cost unless
intentionally clearing stock.

The player should be able to create product collections, such as
traditional patterns, modern geometric designs, small prayer rugs,
runners, and premium handwoven pieces.

# 11. Store Name and Brand Builder

At the start of the business, allow the player to: - Enter a shop name
in Arabic or English. - Select a logo concept. - Choose a colour
palette. - Choose a signboard style. - Choose a uniform/apron style. -
Choose a receipt and packaging design.

Suggested default brand: - **Name:** نسيج الخرطوم \| Khartoum Weave -
**Tagline:** Clean Rugs. Fresh Homes. \| سجاد نظيف... وبيت أجمل - **Logo
concept:** A geometric rug motif folded into a water droplet, with a
small sparkle indicating cleanliness. - **Palette:** Deep indigo, warm
sand, turquoise, and a restrained copper accent. - **Shop sign:** Clear
bilingual lettering with a simple illuminated icon.

The default brand is only a starting option. The player must be able to
rename and redesign it at any time for an affordable fee.

# 12. Progression, Skills, and Scoring

## 12.1 Skill Trees

**Cleaning Craft** - Fibre identification. - Stain diagnosis. - Brush
control. - Chemical dosing. - Rinsing and extraction. - Delicate-rug
handling.

**Business** - Negotiation. - Pricing. - Scheduling. - Supplier
relationships. - Marketing. - Staff management.

**Operations** - Equipment maintenance. - Water efficiency. - Drying
optimisation. - Route planning. - Workshop layout. - Quality control.

Skills should unlock options and reduce risk, not simply add arbitrary
percentage bonuses.

## 12.2 Job Score (0--100)

Suggested weighted scoring: - Cleaning result: 30 points. - Material
safety: 20 points. - Coverage and consistency: 15 points. -
Moisture/extraction control: 10 points. - Time management: 10 points. -
Customer instructions: 10 points. - Work-area care and professionalism:
5 points.

Suggested result bands: - 95--100: Masterpiece. - 85--94: Excellent. -
70--84: Good. - 55--69: Needs improvement. - Below 55: Failed / rework
may be required.

A rug that looks clean but has been damaged by harsh treatment must not
receive a high score. Material safety is essential.

## 12.3 Reputation

Separate reputation tracks: - Household customers. - Premium rug
owners. - Commercial clients. - Rug suppliers and artisans. -
Neighbourhood community.

Reputation changes customer volume, job difficulty, contract access, and
price tolerance.

# 13. Customer and NPC Systems

Customer archetypes: - Budget-conscious household. - Busy
professional. - Family preparing for a gathering. - Collector with a
delicate rug. - Small office manager. - Hotel or guesthouse manager. -
Rug merchant. - Repeat customer who values reliability.

Each customer has: - Budget. - Preferred service time. - Patience. -
Quality expectations. - Communication style. - Rug ownership details. -
Likelihood of returning or recommending the business.

Dialogue should be concise, natural, and culturally respectful. Include
Arabic first, with optional English localisation.

# 14. Interface and User Experience

Main screens: - Main menu. - Character and business setup. - City map
and route planner. - Booking inbox. - Customer/rug inspection. -
Cleaning workbench. - Job results and payment. - Cash ledger. -
Equipment store. - Supplier catalogue. - Workshop management. - Rug
showroom. - Staff and schedule management. - Brand customisation. -
Save/load and settings.

Use large readable typography, high contrast, clear icons, and minimal
clutter. The cleaning view should prioritise the rug and tools. Keep
business data on compact panels that can be opened when needed.

# 15. Camera and Controls

Recommended default: - Third-person exploration camera for streets and
customer homes. - Close, adjustable work camera for rug cleaning. -
Optional overhead camera for workshop layout. - Smooth camera
transitions, no abrupt forced cuts.

PC: - WASD movement, mouse camera, contextual interaction, tool
shortcuts. - Hold-and-drag or guided cursor movement for brush control.

Mobile adaptation: - Left virtual stick, right camera area, contextual
tool buttons. - Adjustable sensitivity and simplified brush path
controls. - Avoid tiny controls and excessive HUD.

# 16. Audio and Atmosphere

Use an original, location-inspired soundscape: - Brush motor and bristle
contact. - Water spray, foam, suction, and dripping. - Footsteps on
tile, concrete, and dusty ground. - Distant traffic and neighbourhood
ambience. - Shop bell, cash counting, receipt printer, and tools. -
Day/night ambience variations. - Original or properly licensed
Sudanese-inspired instrumental music.

Do not use unlicensed commercial recordings or imitate a specific living
artist.

# 17. Visual Art Direction

Recommended direction: **high-quality stylised realism**.

-   Realistic proportions and readable silhouettes.
-   PBR materials with carefully controlled roughness.
-   Rich but restrained colour grading.
-   Warm sunlight and soft shadows.
-   Detailed rugs as hero assets.
-   Strong material differentiation: wool, cotton, synthetic fibres, wet
    pile, foam, metal, plastic, tile, and concrete.
-   Carefully designed signage and shop interiors.
-   Dense visual storytelling without excessive clutter.

Avoid generic mobile-game visuals, plastic-looking materials, flat
lighting, and random asset mixing. Use one consistent asset style and
harmonise imported models through shared materials, scale, and lighting.

# 18. Technical Scope and Production Roadmap

## Milestone 1 --- Playable Cleaning Prototype

-   One small workshop.
-   One rug with a dirt mask.
-   One rotary brush.
-   Foam/water visual feedback.
-   Basic scoring.
-   One customer job.

## Milestone 2 --- First Business Loop

-   Home visits.
-   Three rug types.
-   Five stain types.
-   Cash payment in SDG.
-   Basic inventory and equipment upgrades.
-   Customer reputation.

## Milestone 3 --- City and Simulation

-   Several neighbourhood blocks.
-   Day/night cycle.
-   Weather and seasonal modifiers.
-   NPC schedules.
-   Vehicle/trolley delivery.

## Milestone 4 --- Workshop and Retail

-   Rentable premises.
-   Workshop equipment.
-   Rug stock and display.
-   Sales, suppliers, and business finances.

## Milestone 5 --- Polish

-   Character animation.
-   Better foam, water, and drying effects.
-   Audio pass.
-   UI/UX refinement.
-   Save/load.
-   Performance optimisation.
-   Accessibility and localisation.

Build a vertical slice before expanding the world. Do not build a huge
city before the core cleaning loop is fun.

# 19. Save Data and Systems Architecture

Separate systems into modules: - `PlayerProfile` - `BusinessProfile` -
`CurrencyWallet` - `JobGenerator` - `CustomerManager` - `RugData` -
`StainSystem` - `CleaningSimulation` - `EquipmentInventory` -
`ShopInventory` - `SupplierSystem` - `WorldClock` - `WeatherManager` -
`SeasonManager` - `NPCSchedule` - `ReputationManager` -
`ScoringSystem` - `SaveManager`

Use data-driven resources for rugs, stains, equipment, customers, and
products. Avoid hard-coding all content into one giant script.

# 20. Quality and Acceptance Criteria

A build is not ready for release unless: - The rug visibly changes as it
is cleaned. - Different rug materials respond differently. - Incorrect
treatment can cause understandable consequences. - Every job has at
least two meaningful decisions. - The economy can be completed without
exploitative grinding. - The player can save and reload business
progress. - Day/night and weather affect gameplay in visible,
understandable ways. - Shop inventory, purchase cost, and sale price
reconcile correctly. - UI uses SDG consistently. - Paper currency is
clearly fictionalised and not a deceptive reproduction of legal
tender. - The game runs at a stable frame rate on the target hardware. -
Imported assets have documented licences and credits.

# 21. Claude Code Implementation Directive

Treat this document as the product specification. Before coding: 1.
Inspect the repository and identify the engine, existing scenes,
scripts, and assets. 2. Propose a modular architecture and a milestone
plan. 3. Build the smallest playable cleaning prototype first. 4. Use
placeholder assets only temporarily; replace them with a coherent,
licensed art set. 5. Keep a `README.md`, `ASSET_CREDITS.md`,
`CHANGELOG.md`, and `TASKS.md`. 6. Never claim a feature is complete
unless it runs and has been tested. 7. Do not silently omit systems.
Mark each as `Implemented`, `Prototype`, `Planned`, or `Blocked`. 8.
Prioritise a polished cleaning experience over a large but empty map.
