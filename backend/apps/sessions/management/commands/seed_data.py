from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.sessions.models import Session, Category
from django.utils import timezone
from datetime import timedelta
import random

User = get_user_model()

CATEGORIES = [
    ('Technology', '💻'),
    ('Design', '🎨'),
    ('Business', '💼'),
    ('Health', '🏃'),
    ('Music', '🎵'),
    ('Photography', '📸'),
    ('Writing', '✍️'),
    ('Marketing', '📣'),
]

SESSIONS_DATA = [
    # Technology (💻)
    {
        'title': 'Advanced React Patterns',
        'description': 'Master hooks, context, custom middleware, and performance optimization in React 18 & 19.',
        'price': 999.00,
        'duration_minutes': 90,
        'max_participants': 15,
        'category_name': 'Technology',
        'tags': ['advanced', 'react', 'frontend'],
        'benefits': [
            'Master Compound Components and Render Props patterns.',
            'Optimize rendering performance with useMemo, useCallback, and Transition APIs.',
            'Implement clean, custom hook libraries for large-scale production code.'
        ],
        'requirements': [
            'Solid knowledge of JavaScript ES6+.',
            'Basic experience building components in React.'
        ],
        'curriculum': [
            {'title': 'Module 1: Advanced Component Design Patterns', 'duration': '30 mins', 'topics': ['Compound Components', 'Control Props Pattern', 'State Reducer Pattern']},
            {'title': 'Module 2: Under the Hood of React 18 & 19', 'duration': '30 mins', 'topics': ['Concurrent Rendering', 'Automatic Batching', 'Transition APIs & Suspense']},
            {'title': 'Module 3: Production Performance Optimization', 'duration': '30 mins', 'topics': ['Profiling component renders', 'Avoiding virtual DOM thrashing', 'Virtualization strategies']}
        ]
    },
    {
        'title': 'Docker & Kubernetes for Developers',
        'description': 'Learn containerization from scratch and deploy high-availability clusters.',
        'price': 1499.00,
        'duration_minutes': 120,
        'max_participants': 20,
        'category_name': 'Technology',
        'tags': ['devops', 'docker', 'kubernetes'],
        'benefits': [
            'Build, run, and scale Docker containers locally.',
            'Understand Kubernetes Pods, Deployments, and Services.',
            'Set up a fully automated multi-service local environment with docker-compose.'
        ],
        'requirements': [
            'Basic understanding of Command Line Interface (CLI).',
            'Familiarity with networking concepts (ports, HTTP).'
        ],
        'curriculum': [
            {'title': 'Module 1: Docker Essentials', 'duration': '40 mins', 'topics': ['Images & Containers', 'Writing optimal Dockerfiles', 'Volumes and Persisting Data']},
            {'title': 'Module 2: Orchestration with Compose', 'duration': '35 mins', 'topics': ['Multi-container networking', 'Environment variables config', 'Docker-compose up/down']},
            {'title': 'Module 3: Introduction to Kubernetes', 'duration': '45 mins', 'topics': ['K8s Architecture', 'Writing YAML manifests', 'Pods, Services, and Deployments']}
        ]
    },
    {
        'title': 'Python & Django REST Framework Masterclass',
        'description': 'Build enterprise-grade RESTful APIs with automated test suites, rate-limiting, and Swagger docs.',
        'price': 1199.00,
        'duration_minutes': 180,
        'max_participants': 25,
        'category_name': 'Technology',
        'tags': ['backend', 'python', 'django', 'api'],
        'benefits': [
            'Build custom serializers, viewsets, and custom permissions.',
            'Implement secure JWT authentication and token refreshment.',
            'Integrate automated OpenAPI Swagger documentation generation.'
        ],
        'requirements': [
            'Intermediate Python knowledge.',
            'Basic understanding of relational databases.'
        ],
        'curriculum': [
            {'title': 'Module 1: Django REST Framework Foundations', 'duration': '60 mins', 'topics': ['Serializers and ModelSerializers', 'Generic Views and ViewSets', 'Routing']},
            {'title': 'Module 2: Security & Authentication', 'duration': '60 mins', 'topics': ['JWT Authentication flow', 'Custom Permission classes', 'Rate Limiting & Throttling']},
            {'title': 'Module 3: Testing & Documentation', 'duration': '60 mins', 'topics': ['Writing APITestCases', 'Generating OpenAPI Schema', 'Customizing Swagger layouts']}
        ]
    },
    {
        'title': 'Next.js 14 App Router Deep Dive',
        'description': 'Unlock the power of Server Components, Server Actions, and incremental static regeneration.',
        'price': 899.00,
        'duration_minutes': 90,
        'max_participants': 18,
        'category_name': 'Technology',
        'tags': ['nextjs', 'frontend', 'server-components'],
        'benefits': [
            'Fluency in React Server Components (RSC) and Client Components.',
            'Handle form submissions seamlessly with modern Server Actions.',
            'Optimized data fetching with parallel and intercepted routes.'
        ],
        'requirements': [
            'Good understanding of React basics (props, hooks).'
        ],
        'curriculum': [
            {'title': 'Module 1: Next.js Layout Architecture', 'duration': '30 mins', 'topics': ['App Router overview', 'Nested Layouts & Templates', 'Dynamic Routing']},
            {'title': 'Module 2: Server Components & Actions', 'duration': '30 mins', 'topics': ['RSC vs Client Components', 'Fetching data with fetch()', 'Handling mutations with Server Actions']},
            {'title': 'Module 3: Advanced UX routing', 'duration': '30 mins', 'topics': ['Parallel Routes (@)', 'Intercepting Routes (.)', 'Static & Dynamic rendering optimization']}
        ]
    },
    {
        'title': 'TypeScript and Modern JavaScript Concepts',
        'description': 'Transition from plain JavaScript to statically-typed TypeScript without the headaches.',
        'price': 0.00,
        'duration_minutes': 60,
        'max_participants': 50,
        'category_name': 'Technology',
        'tags': ['beginner', 'typescript', 'javascript'],
        'benefits': [
            'Write safer code with TypeScript compilation.',
            'Understand Interfaces, Types, Generics, and Utility types.',
            'Configure any project using tsconfig.json.'
        ],
        'requirements': [
            'Basic knowledge of variables, loops, and functions in JS.'
        ],
        'curriculum': [
            {'title': 'Module 1: TypeScript Foundations', 'duration': '20 mins', 'topics': ['Type inference', 'Primitive & object types', 'Interfaces vs Type aliases']},
            {'title': 'Module 2: Advanced Typing', 'duration': '20 mins', 'topics': ['Union and Intersection types', 'Generics & generic constraints', 'Enums']},
            {'title': 'Module 3: Compiling & Tooling', 'duration': '20 mins', 'topics': ['Configuring tsconfig.json', 'Integrating with build tools', 'Strict mode settings']}
        ]
    },

    # Design (🎨)
    {
        'title': 'UI/UX Design Fundamentals',
        'description': 'Learn the principles of great digital product design from typography and grids to wireframing.',
        'price': 0.00,
        'duration_minutes': 60,
        'max_participants': 30,
        'category_name': 'Design',
        'tags': ['beginner', 'uiux', 'design'],
        'benefits': [
            'Master visual hierarchy, typography pairings, and layout grids.',
            'Construct functional wireframes and high-fidelity mockups.',
            'Understand and implement modern UI design systems.'
        ],
        'requirements': [
            'No prior design experience required.'
        ],
        'curriculum': [
            {'title': 'Module 1: Vision & Visual Hierarchy', 'duration': '20 mins', 'topics': ['The 8pt Grid System', 'Contrast and Gestalt principles', 'F & Z Reading Patterns']},
            {'title': 'Module 2: Typography & Color Science', 'duration': '20 mins', 'topics': ['Font pairing strategies', '60-30-10 Color Rule', 'Aesthetic dark mode palette creation']},
            {'title': 'Module 3: Design Process workflow', 'duration': '20 mins', 'topics': ['Wireframing steps', 'Figma introduction', 'Component-driven workflows']}
        ]
    },
    {
        'title': 'Mastering Figma: From Wireframe to Interactive Prototype',
        'description': 'Elevate your UI design game with auto-layouts, variants, variables, and high-fidelity prototyping.',
        'price': 799.00,
        'duration_minutes': 90,
        'max_participants': 12,
        'category_name': 'Design',
        'tags': ['figma', 'prototyping', 'advanced'],
        'benefits': [
            'Master Figma Auto Layout 5.0 for fully responsive designs.',
            'Build robust component libraries with Variants and Component Properties.',
            'Produce realistic micro-interactions and high-fidelity smart animations.'
        ],
        'requirements': [
            'Basic familiarity with Figma interface.'
        ],
        'curriculum': [
            {'title': 'Module 1: Advanced Auto Layout', 'duration': '30 mins', 'topics': ['Wrap layouts', 'Min/Max sizing rules', 'Absolute positioning within Auto Layout']},
            {'title': 'Module 2: Component Libraries & Design Tokens', 'duration': '30 mins', 'topics': ['Figma variables setup', 'Component variants', 'Interactive components']},
            {'title': 'Module 3: Prototyping Masterclass', 'duration': '30 mins', 'topics': ['Smart Animate keys', 'Page transitions', 'Simulating web app logic state']}
        ]
    },
    {
        'title': 'Typography and Color Theory for Mobile Apps',
        'description': 'Deepen your knowledge of layout composition and colors tailored strictly for iOS & Android screens.',
        'price': 499.00,
        'duration_minutes': 75,
        'max_participants': 15,
        'category_name': 'Design',
        'tags': ['mobile', 'design', 'typography'],
        'benefits': [
            'Design accessible interfaces compliant with WCAG guidelines.',
            'Create semantic type scales that scale elegantly across devices.',
            'Build responsive dark and light color systems.'
        ],
        'requirements': [
            'Basic knowledge of design tools (Figma, Sketch, or XD).'
        ],
        'curriculum': [
            {'title': 'Module 1: Accessibility & Contrast (WCAG)', 'duration': '25 mins', 'topics': ['A/AA/AAA standards', 'Designing for low-vision users', 'Contrast check tools']},
            {'title': 'Module 2: Typographic Systems', 'duration': '25 mins', 'topics': ['Font sizing math', 'Line height settings for mobile', 'System fonts vs web fonts']},
            {'title': 'Module 3: Multi-Theme Color Systems', 'duration': '25 mins', 'topics': ['Semantic naming colors', 'Designing a rich dark mode theme', 'Testing designs on device screens']}
        ]
    },
    {
        'title': '3D Modeling with Blender: A Beginner\'s Guide',
        'description': 'Step into the 3D world! Model, texture, light, and render your first low-poly game asset.',
        'price': 1299.00,
        'duration_minutes': 150,
        'max_participants': 10,
        'category_name': 'Design',
        'tags': ['blender', '3d', 'modeling'],
        'benefits': [
            'Navigate the Blender viewport with ease.',
            'Model 3D environments using basic geometric meshes.',
            'Apply procedural materials and set up beautiful Cycles/Eevee render scenes.'
        ],
        'requirements': [
            'A computer with a 3-button mouse.',
            'Blender installed (completely free).'
        ],
        'curriculum': [
            {'title': 'Module 1: Navigation & Low-Poly Modeling', 'duration': '50 mins', 'topics': ['Viewport controls', 'Extruding & Beveling', 'Box modeling practice']},
            {'title': 'Module 2: Materials & Textures', 'duration': '50 mins', 'topics': ['Blender Shader Editor', 'Creating procedural steel/wood', 'UV unwrapping basics']},
            {'title': 'Module 3: Lighting & Rendering', 'duration': '50 mins', 'topics': ['Three-point lighting setup', 'Cycles engine settings', 'Post-processing renders']}
        ]
    },

    # Business (💼)
    {
        'title': 'Build Your SaaS in 30 Days',
        'description': 'From idea and validated prototype to paying customers — a step-by-step startup handbook.',
        'price': 1499.00,
        'duration_minutes': 120,
        'max_participants': 12,
        'category_name': 'Business',
        'tags': ['saas', 'startup', 'monetization'],
        'benefits': [
            'Validate startup ideas quickly without writing code.',
            'Architect a lean MVP using serverless and modern SaaS templates.',
            'Gain your first 10 paying customers with cold outreach and SEO.'
        ],
        'requirements': [
            'A keen business/tech interest.'
        ],
        'curriculum': [
            {'title': 'Module 1: Ideation & Validation', 'duration': '40 mins', 'topics': ['Finding micro-SaaS gaps', 'Pre-selling ideas with landing pages', 'Customer interviews']},
            {'title': 'Module 2: Fast-Track MVP Architecture', 'duration': '40 mins', 'topics': ['Boilerplates (Next.js/SupaBase/SaaS)', 'Integrating payments (Stripe/Razorpay)', 'Transactional emails']},
            {'title': 'Module 3: Go-To-Market & Growth', 'duration': '40 mins', 'topics': ['Cold email campaigns', 'Building in public on Twitter/Reddit', 'Initial pricing plans strategies']}
        ]
    },
    {
        'title': 'Product Management: From Zero to Product Launch',
        'description': 'Learn how to write PRDs, manage backlogs, run agile ceremonies, and lead engineering teams.',
        'price': 1999.00,
        'duration_minutes': 180,
        'max_participants': 20,
        'category_name': 'Business',
        'tags': ['product-management', 'agile', 'scrum'],
        'benefits': [
            'Write clean Product Requirement Documents (PRDs) that engineers love.',
            'Prioritize backlogs using RICE and MoSCoW frameworks.',
            'Track product metrics (MAU, LTV, Churn) and run A/B tests.'
        ],
        'requirements': [
            'Familiarity with digital software concepts.'
        ],
        'curriculum': [
            {'title': 'Module 1: The Role & Writing PRDs', 'duration': '60 mins', 'topics': ['Who is a PM?', 'Drafting comprehensive PRDs', 'Wireframing for PMs']},
            {'title': 'Module 2: Backlog Grooming & Agile', 'duration': '60 mins', 'topics': ['Jira/Linear ticket writing', 'RICE prioritization model', 'Sprint planning & retrospectives']},
            {'title': 'Module 3: Analytics & Post-Launch', 'duration': '60 mins', 'topics': ['Tracking retention cohorts', 'Setting up Mixpanel events', 'Iterating based on product reviews']}
        ]
    },
    {
        'title': 'Pitching to VCs: Master the Startup Pitch',
        'description': 'Create an outstanding pitch deck and learn how to negotiate seed and Series A valuation term sheets.',
        'price': 0.00,
        'duration_minutes': 60,
        'max_participants': 40,
        'category_name': 'Business',
        'tags': ['fundraising', 'pitching', 'seed-funding'],
        'benefits': [
            'Structure a perfect 10-slide startup pitch deck.',
            'Confidently present financials and scale metrics.',
            'Navigate VC negotiations and term sheets smoothly.'
        ],
        'requirements': [
            'A startup idea or active company.'
        ],
        'curriculum': [
            {'title': 'Module 1: Pitch Deck Anatomy', 'duration': '20 mins', 'topics': ['The Hook slide', 'Problem & Solution mapping', 'The Competitive Landscape matrix']},
            {'title': 'Module 2: Presenting the Numbers', 'duration': '20 mins', 'topics': ['LTV/CAC ratios', 'Projected revenues mapping', 'Explaining the use of funds']},
            {'title': 'Module 3: The Term Sheet Demystified', 'duration': '20 mins', 'topics': ['Valuation (Pre-money vs Post-money)', 'Liquidation preferences', 'Board seat configurations']}
        ]
    },
    {
        'title': 'Financial Modeling & Valuation for Entrepreneurs',
        'description': 'Build your dynamic three-statement financial model in Excel or Google Sheets to project your revenue.',
        'price': 2499.00,
        'duration_minutes': 240,
        'max_participants': 15,
        'category_name': 'Business',
        'tags': ['finance', 'excel', 'valuation'],
        'benefits': [
            'Construct dynamic Profit & Loss, Balance Sheet, and Cash Flow tables.',
            'Forecast revenue using unit economics and driver-based assumptions.',
            'Perform Discounted Cash Flow (DCF) valuation calculations.'
        ],
        'requirements': [
            'Basic experience using Excel (sum, product formulas).'
        ],
        'curriculum': [
            {'title': 'Module 1: Financial Statement Integration', 'duration': '80 mins', 'topics': ['The Income Statement structure', 'Balance Sheet assets/liabilities', 'Deriving the Cash Flow Statement']},
            {'title': 'Module 2: Forecasting Revenues & Expenses', 'duration': '80 mins', 'topics': ['Driver-based forecasting', 'Hiring roadmap expenses', 'Working capital projections']},
            {'title': 'Module 3: Valuation Methodologies', 'duration': '80 mins', 'topics': ['DCF modeling step-by-step', 'Comparable company analysis', 'Sensitivity analysis matrices']}
        ]
    },

    # Health (🏃)
    {
        'title': 'Yoga for Developers',
        'description': 'A tailored yoga flow to open tight hips, correct rounded shoulders, and relieve desk strain.',
        'price': 0.00,
        'duration_minutes': 30,
        'max_participants': 50,
        'category_name': 'Health',
        'tags': ['beginner', 'health', 'yoga', 'stretching'],
        'benefits': [
            'Alleviate chronic lower-back and neck fatigue.',
            'Improve full-body mobility and posture alignment.',
            'Incorporate easy 5-minute desktop breathing routines.'
        ],
        'requirements': [
            'Comfortable clothing.',
            'A yoga mat or a soft floor surface.'
        ],
        'curriculum': [
            {'title': 'Module 1: Neck & Shoulder Release', 'duration': '10 mins', 'topics': ['Seated twists', 'Chest opener stretches', 'Wrist rotations']},
            {'title': 'Module 2: Hips & Spine Re-alignment', 'duration': '10 mins', 'topics': ['Cat-cow flows', 'Pigeon pose variations', 'Forward folds']},
            {'title': 'Module 3: Mindful Breathing (Pranayama)', 'duration': '10 mins', 'topics': ['Box breathing strategy', 'Alternate nostril breathing', 'Savasana meditation']}
        ]
    },
    {
        'title': 'Mindfulness and Stress Management at Work',
        'description': 'Learn actionable meditation techniques to prevent burnout and handle high-pressure deadlines.',
        'price': 399.00,
        'duration_minutes': 45,
        'max_participants': 25,
        'category_name': 'Health',
        'tags': ['meditation', 'stress-relief', 'mindfulness'],
        'benefits': [
            'Develop a consistent daily meditation practice.',
            'Manage acute stress responses using vagus nerve stimulation.',
            'Set healthy workspace boundaries to protect mental energy.'
        ],
        'requirements': [
            'A quiet room to sit peacefully.'
        ],
        'curriculum': [
            {'title': 'Module 1: The Physiology of Stress', 'duration': '15 mins', 'topics': ['Cortisol and the sympathetic nervous system', 'Calming the mind', 'Body-scan meditation']},
            {'title': 'Module 2: Practical Micro-habits', 'duration': '15 mins', 'topics': ['The 4-7-8 breathing method', 'Mindful eating', 'Reframing negative work triggers']},
            {'title': 'Module 3: Long-Term Burnout Prevention', 'duration': '15 mins', 'topics': ['Digital detox techniques', 'Sleep hygiene guidelines', 'Daily reflection routines']}
        ]
    },
    {
        'title': 'Home Workout Essentials & Posture Correction',
        'description': 'Build an effective bodyweight training routine and cure your text-neck posture without any gym equipment.',
        'price': 0.00,
        'duration_minutes': 60,
        'max_participants': 30,
        'category_name': 'Health',
        'tags': ['fitness', 'workout', 'posture'],
        'benefits': [
            'Perform core exercises with correct, biomechanically sound form.',
            'Construct a balanced weekly home workout calendar.',
            'Activate weak glutes and upper back muscles to stand taller.'
        ],
        'requirements': [
            'No specialized equipment needed.'
        ],
        'curriculum': [
            {'title': 'Module 1: Posture Assessment & Correction', 'duration': '20 mins', 'topics': ['Identifying anterior pelvic tilt', 'Correcting forward head posture', 'Wall angel exercises']},
            {'title': 'Module 2: Biomechanics of Bodyweight Moves', 'duration': '20 mins', 'topics': ['Squat depth and knee safety', 'Perfect pushup scaling', 'Glute bridge activation']},
            {'title': 'Module 3: Programming Your Routines', 'duration': '20 mins', 'topics': ['Progressive overload principles', 'Structuring warmup/cooldown flows', 'Custom fitness planning']}
        ]
    },

    # Music (🎵)
    {
        'title': 'Music Production Basics with Ableton Live',
        'description': 'Master the digital audio workstation (DAW) and write your very first electronic beat.',
        'price': 499.00,
        'duration_minutes': 90,
        'max_participants': 15,
        'category_name': 'Music',
        'tags': ['music', 'production', 'ableton', 'edm'],
        'benefits': [
            'Navigate Ableton Session View and Arrangement View.',
            'Program drums and basslines using MIDI tools.',
            'Apply EQ, delay, and reverb effects to polish your tracks.'
        ],
        'requirements': [
            'Ableton Live (trial or full version) installed.',
            'Any pair of headphones.'
        ],
        'curriculum': [
            {'title': 'Module 1: DAW Layout & Audio Setup', 'duration': '30 mins', 'topics': ['Session vs Arrangement layouts', 'Importing audio loops', 'Understanding the master track']},
            {'title': 'Module 2: Writing Beats & Melodies with MIDI', 'duration': '30 mins', 'topics': ['MIDI Editor keys', 'Writing a 4-to-the-floor kick pattern', 'Creating basic synth chords']},
            {'title': 'Module 3: FX and Exporting', 'duration': '30 mins', 'topics': ['EQ Eight equalization basics', 'Adding delay and ambient space', 'Rendering high-quality WAV files']}
        ]
    },
    {
        'title': 'Piano Essentials: Play Your First Song in 1 Hour',
        'description': 'Skip the boring sheet-music drills! Learn chords and play simple pop songs on your keyboard immediately.',
        'price': 799.00,
        'duration_minutes': 60,
        'max_participants': 12,
        'category_name': 'Music',
        'tags': ['piano', 'music-theory', 'chords'],
        'benefits': [
            'Locate all notes on the piano keyboard quickly.',
            'Form major and minor triads using simple interval patterns.',
            'Accompany yourself playing popular 4-chord songs.'
        ],
        'requirements': [
            'An electronic keyboard or piano (at least 32 keys).'
        ],
        'curriculum': [
            {'title': 'Module 1: Key Navigation & Triads', 'duration': '20 mins', 'topics': ['Black and white keys naming', 'Building C Major and A Minor chords', 'Correct hand posture']},
            {'title': 'Module 2: The Magic 4-Chord Progression', 'duration': '20 mins', 'topics': ['I-V-vi-IV chord sequences', 'Easy left-hand bass notes companion', 'Timing and rhythm basics']},
            {'title': 'Module 3: Playing Pop Classics', 'duration': '20 mins', 'topics': ['Integrating chords and melodies', 'Common rhythm accompaniment templates', 'Free resources for future learning']}
        ]
    },
    {
        'title': 'Vocal Warmups and Classical Breath Control',
        'description': 'Expand your vocal range, control pitch, and protect your voice with time-tested opera singer warmups.',
        'price': 0.00,
        'duration_minutes': 45,
        'max_participants': 30,
        'category_name': 'Music',
        'tags': ['vocals', 'singing', 'breath-control'],
        'benefits': [
            'Sing with maximum breath support using diaphragmatic control.',
            'Remove vocal throat tension and reach high notes comfortably.',
            'Maintain a safe daily vocal health warm-up routine.'
        ],
        'requirements': [
            'A glass of room-temperature water.'
        ],
        'curriculum': [
            {'title': 'Module 1: Diaphragmatic Breath Foundations', 'duration': '15 mins', 'topics': ['Understanding posture & posture scales', 'Sibilant breathing exercises', 'The appoggio technique']},
            {'title': 'Module 2: Resonance & Tension Release', 'duration': '15 mins', 'topics': ['Lip trills and sirens', 'Yawn-sigh exercises to open throat space', 'Humming for forward resonance']},
            {'title': 'Module 3: Expanding Pitch and Range', 'duration': '15 mins', 'topics': ['Five-note scale drills', 'Arpeggio exercises', 'Vocal cooldown best practices']}
        ]
    },

    # Photography (📸)
    {
        'title': 'Street Photography Masterclass',
        'description': 'Master the art of storytelling on the streets. Overcome fear and capture gorgeous candid moments.',
        'price': 799.00,
        'duration_minutes': 75,
        'max_participants': 10,
        'category_name': 'Photography',
        'tags': ['photography', 'candid', 'street'],
        'benefits': [
            'Configure camera settings (aperture priority, zone focusing) for swift capture.',
            'Use shadows, reflections, and frames-within-frames to compose stunning images.',
            'Confidently approach street environments and photograph candidly.'
        ],
        'requirements': [
            'Any camera (even a smartphone works!).'
        ],
        'curriculum': [
            {'title': 'Module 1: Camera Setup & Mechanics', 'duration': '25 mins', 'topics': ['Aperture vs Shutter speed for action', 'Zone focusing techniques', 'Discrete framing methods']},
            {'title': 'Module 2: Visual Composition Principles', 'duration': '25 mins', 'topics': ['The rule of thirds in dynamic settings', 'Leading lines on city streets', 'Chiaroscuro: High contrast shadow play']},
            {'title': 'Module 3: The Psychology of Street Shooters', 'duration': '25 mins', 'topics': ['Overcoming shooting anxiety', 'Street etiquette and legal rights', 'Waiting for "The Decisive Moment"']}
        ]
    },
    {
        'title': 'Adobe Lightroom Classic: Professional Editing Workflow',
        'description': 'Take your raw photos from flat to spectacular. Master color grading, masking, and batch exporting.',
        'price': 999.00,
        'duration_minutes': 120,
        'max_participants': 15,
        'category_name': 'Photography',
        'tags': ['editing', 'lightroom', 'color-grading'],
        'benefits': [
            'Organize large photo catalogs cleanly with tagging systems.',
            'Perfect basic exposures, tone curves, and split-toning effects.',
            'Execute selective local edits using state-of-the-art AI masking brushes.'
        ],
        'requirements': [
            'Adobe Lightroom Classic installed (free trial available).'
        ],
        'curriculum': [
            {'title': 'Module 1: Catalog Import & Library Mastery', 'duration': '40 mins', 'topics': ['Setting up catalogs, smart previews', 'Filtering and rating photos', 'Metadata tags']},
            {'title': 'Module 2: The Develop Engine and Colors', 'duration': '40 mins', 'topics': ['Temperature & Tone sliders', 'Mastering the Tone Curve', 'HSL & Color Grading wheels']},
            {'title': 'Module 3: Advanced AI Masking & Exporting', 'duration': '40 mins', 'topics': ['AI Subject/Sky selection', 'Linear & Radial gradients', 'Batch export setups and presets']}
        ]
    },

    # Writing (✍️)
    {
        'title': 'Creative Writing 101: Crafting Compelling Characters',
        'description': 'Break through writer\'s block and construct characters with realistic flaws, motives, and dialogue.',
        'price': 599.00,
        'duration_minutes': 90,
        'max_participants': 12,
        'category_name': 'Writing',
        'tags': ['writing', 'creative', 'storytelling'],
        'benefits': [
            'Formulate deep character backstories with clear internal/external conflicts.',
            'Write distinct, natural dialogue that drives storylines forward.',
            'Map solid story outlines using the three-act narrative structure.'
        ],
        'requirements': [
            'A notebook or text editor.'
        ],
        'curriculum': [
            {'title': 'Module 1: Character Desires & Flaws', 'duration': '30 mins', 'topics': ['The Lie your character believes', 'Internal vs External stakes', 'Character sheets setup']},
            {'title': 'Module 2: Dialogue Subtext and Mechanics', 'duration': '30 mins', 'topics': ['Writing dialogue without exposition', 'Action beats vs dialogue tags', 'Pacing verbal arguments']},
            {'title': 'Module 3: Plot Architecture', 'duration': '30 mins', 'topics': ['The Inciting Incident', 'Midpoints & Climax planning', 'Revision and polishing guidelines']}
        ]
    },
    {
        'title': 'Copywriting Secrets: Writing Headlines That Convert',
        'description': 'Learn the psychological triggers and copywriting frameworks that persuade users to click, read, and buy.',
        'price': 899.00,
        'duration_minutes': 75,
        'max_participants': 20,
        'category_name': 'Writing',
        'tags': ['copywriting', 'marketing', 'conversion'],
        'benefits': [
            'Apply proven structures like AIDA and PAS to landing page copy.',
            'Compose attention-grabbing headlines that double conversion rates.',
            'Draft compelling call-to-actions (CTAs) that generate clicks.'
        ],
        'requirements': [
            'Basic interest in marketing or writing.'
        ],
        'curriculum': [
            {'title': 'Module 1: The Psychology of Persuasion', 'duration': '25 mins', 'topics': ['Understanding buyer objections', 'Emotional hooks vs logical benefits', 'Scarcity and social proof']},
            {'title': 'Module 2: Copywriting Frameworks', 'duration': '25 mins', 'topics': ['AIDA (Attention, Interest, Desire, Action)', 'PAS (Problem, Agitate, Solve)', 'Feature-to-Benefit translation']},
            {'title': 'Module 3: Headline Exercises', 'duration': '25 mins', 'topics': ['The 4 U\'s formula', 'Subject line testing', 'CTA placement optimization']}
        ]
    },
    {
        'title': 'Academic Writing and Research Methodology',
        'description': 'Master the structure of research papers, write persuasive theses, and learn reference management.',
        'price': 0.00,
        'duration_minutes': 120,
        'max_participants': 40,
        'category_name': 'Writing',
        'tags': ['academic', 'research', 'referencing'],
        'benefits': [
            'Construct clear, logical, and formal academic thesis arguments.',
            'Synthesize complex literature smoothly into well-referenced reviews.',
            'Format citations in APA, MLA, and Chicago styles instantly.'
        ],
        'requirements': [
            'No specialized writing experience required.'
        ],
        'curriculum': [
            {'title': 'Module 1: Research Questions & Theses', 'duration': '40 mins', 'topics': ['Formulating valid hypotheses', 'Designing research outlines', 'Writing strong introductions']},
            {'title': 'Module 2: Literature Review Mastery', 'duration': '40 mins', 'topics': ['Finding peer-reviewed journals', 'Avoiding plagiarism & paraphrasing techniques', 'Synthesizing evidence grids']},
            {'title': 'Module 3: Citations & Tooling', 'duration': '40 mins', 'topics': ['Reference managers (Zotero/Mendeley)', 'APA 7th edition checklist', 'Drafting methodologies and abstracts']}
        ]
    },

    # Marketing (📣)
    {
        'title': 'Social Media Growth Hacking in 2026',
        'description': 'Unlock viral distribution algorithms on TikTok, Instagram Reels, and YouTube Shorts for quick brand building.',
        'price': 1199.00,
        'duration_minutes': 90,
        'max_participants': 30,
        'category_name': 'Marketing',
        'tags': ['growth-hacking', 'social-media', 'tiktok', 'instagram'],
        'benefits': [
            'Reverse engineer modern video recommendation algorithms.',
            'Script 3-second hooks that spike user retention rates.',
            'Create a 30-day viral content batch-production pipeline.'
        ],
        'requirements': [
            'A smartphone.'
        ],
        'curriculum': [
            {'title': 'Module 1: The Recommendation Algorithms', 'duration': '30 mins', 'topics': ['Watch time vs completion ratios', 'SEO tags on TikTok/Reels', 'How platforms distribute micro-content']},
            {'title': 'Module 2: Hooking Your Audience', 'duration': '30 mins', 'topics': ['Visual hooks and audio trends', 'The 3-act story arc in short videos', 'Creating dynamic subtitle overlays']},
            {'title': 'Module 3: Production Pipeline Scaling', 'duration': '30 mins', 'topics': ['Batch filming 10 videos in 1 hour', 'CapCut mobile editing hacks', 'Content calendar templates']}
        ]
    },
    {
        'title': 'Google Ads & SEO Masterclass for Small Businesses',
        'description': 'Drive search traffic with high intent. Set up conversion campaigns and rank on page one of Google.',
        'price': 1499.00,
        'duration_minutes': 150,
        'max_participants': 15,
        'category_name': 'Marketing',
        'tags': ['seo', 'google-ads', 'ppc'],
        'benefits': [
            'Perform deep keyword research identifying commercial intent queries.',
            'Build profitable Google Search ad groups and bidding campaigns.',
            'Optimize on-page HTML code to boost organic Google ranks.'
        ],
        'requirements': [
            'A website or web landing page (optional but recommended).'
        ],
        'curriculum': [
            {'title': 'Module 1: Strategic Keyword Research', 'duration': '50 mins', 'topics': ['Short-tail vs Long-tail keywords', 'Google Keyword Planner', 'Evaluating keyword difficulty']},
            {'title': 'Module 2: Profitable Google Search Campaigns', 'duration': '50 mins', 'topics': ['Setting up Google Ads dashboards', 'Drafting text ads, ad extensions', 'Bid strategies (Manual CPC vs Max Conversions)']},
            {'title': 'Module 3: Technical & On-Page SEO', 'duration': '50 mins', 'topics': ['Title & meta description optimizations', 'Heading hierarchies', 'Page speed and mobile-friendly audits']}
        ]
    }
]


import os
import urllib.request
from django.conf import settings
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage

COURSE_IMAGE_IDS = [
    '1517694712202-14dd9538aa97', '1561070791-2526d30994b5', '1486406146926-c627a92ad1ab',
    '1544367567-0f2fcb009e0b', '1511671782779-c97d3d27a1d4', '1516035069371-29a1b244cc32',
    '1455390582262-044cdead277a', '1460925895917-afdab827c52f', '1522202176988-66273c2fd55f',
    '1504384308090-c894fdcc538d', '1498050108023-c5249f4df085', '1555099962-4199c345e5dd',
    '1499951360447-b19be8fe80f5', '1484417894907-623942c8ee29', '1503676260728-1c00da094a0b',
    '1493612278159-444ea3eb80c1', '1488998427799-e3362cec87c3', '1526304640581-d334cdbbf45e',
    '1551288049-bebda4e38f71', '1524178232363-1fb2b075b655', '1552664730-d307ca884978',
    '1542744173-8e7e53415bb0', '1501504905252-473c47e087f8', '1481481365942-0f5f560e224e',
    '1454165804606-c3d57bc86b40', '1526040652367-ac003a0475b2', '1432888506048-8df0df9491d9'
]

class Command(BaseCommand):
    help = 'Seed the database with 26+ diverse, high-quality sample courses (Udemy-like scale)'

    def handle(self, *args, **options):
        # 1. Clear existing sessions and categories to allow fresh seed
        self.stdout.write("Clearing existing sessions and categories for a clean re-seed...")
        from apps.bookings.models import Booking
        Booking.objects.all().delete()
        Session.objects.all().delete()
        Category.objects.all().delete()

        # 4. Create categories
        categories_dict = {}
        for name, icon in CATEGORIES:
            cat, _ = Category.objects.get_or_create(name=name, defaults={'icon': icon})
            categories_dict[name] = cat

        # 5. Create a demo creator (instructor)
        creator, created = User.objects.get_or_create(
            email='creator@demo.com',
            defaults={
                'username': 'democreator',
                'first_name': 'John',
                'last_name': 'Doe',
                'role': 'creator',
                'bio': 'Industry veteran and professional instructor with 15+ years of digital education experience.',
            }
        )
        if created:
            creator.set_password('demo1234')
            creator.save()

        # 6. Create a demo attendee (student)
        attendee, attendee_created = User.objects.get_or_create(
            email='attendee@demo.com',
            defaults={
                'username': 'demoattendee',
                'first_name': 'Jane',
                'last_name': 'Smith',
                'role': 'attendee',
                'bio': 'Avid learner exploring technologies, design, and business models.',
            }
        )
        if attendee_created:
            attendee.set_password('demo1234')
            attendee.save()

        # 7. Seed the rich sessions with Unsplash cover images
        seeded_count = 0
        for i, session_info in enumerate(SESSIONS_DATA):
            category = categories_dict.get(session_info['category_name'])
            
            # Start times spaced randomly between 3 to 30 days in the future
            start_date = timezone.now() + timedelta(days=random.randint(3, 30), hours=random.randint(8, 18))
            
            # Fetch individual image from Picsum using seed for distinct real-world images
            img_url = f"https://picsum.photos/seed/session_{i+100}/800/600"
            filename = f"sessions/session_{i}.jpg"
            
            try:
                self.stdout.write(f"Downloading image for session {i}...")
                response = urllib.request.urlopen(img_url)
                if default_storage.exists(filename):
                    default_storage.delete(filename)
                default_storage.save(filename, ContentFile(response.read()))
                self.stdout.write(self.style.SUCCESS(f"Saved {filename} to default storage."))
            except Exception as e:
                self.stdout.write(self.style.WARNING(f"Failed to download image: {e}"))
                filename = None

            # Create session
            Session.objects.create(
                title=session_info['title'],
                description=session_info['description'],
                creator=creator,
                category=category,
                price=session_info['price'],
                duration_minutes=session_info['duration_minutes'],
                max_participants=session_info['max_participants'],
                start_time=start_date,
                status='published',
                tags=session_info['tags'],
                benefits=session_info['benefits'],
                requirements=session_info['requirements'],
                curriculum=session_info['curriculum'],
                image=filename,
            )
            seeded_count += 1

        self.stdout.write(self.style.SUCCESS(
            f'Successfully seeded {seeded_count} diverse, immersive courses with real-world Unsplash covers!\n'
            f'Demo Accounts:\n'
            f' - Instructor/Creator: creator@demo.com / demo1234\n'
            f' - Attendee/Student  : attendee@demo.com / demo1234'
        ))
