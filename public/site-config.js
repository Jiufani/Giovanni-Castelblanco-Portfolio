/* YOUR PORTFOLIO CONTENT
   Add contact details before launch.
   Put your actual files under public/assets/work and add entries to projects[].files.
   Image, video, and document examples are in ADD-YOUR-WORK.md.
   Files automatically appear in All Work and their discipline filters.
   Never publish private information or claims that misrepresent your contribution. */
window.PORTFOLIO = {
  "name": "Giovanni Castelblanco",
  "firstName": "Giovanni",
  "email": "giocastel19@gmail.com",
  "linkedin": "https://www.linkedin.com/in/giovanni-castelblanco-aaa17b386/",
  "github": "",
  "resumeUrl": "",
  "siteUrl": "",
  "projects": [
    {
      "id": "rabbithole",
      "title": "RabbitHole",
      "subtitle": "A different way to explore the music you love.",
      "category": "Web application / music discovery",
      "image": "assets/rabbithole-screenshot.png",
      "imageAlt": "Screenshot of the RabbitHole music discovery homepage in its dark green theme",
      "previewNote": "RabbitHole — built in 36 hours for KnightHacks.",
      "tags": [
        "JavaScript",
        "HTML / CSS",
        "Node.js / Express",
        "Cytoscape.js",
        "MusicBrainz"
      ],
      "liveUrl": "https://rabbitv6.vercel.app/#home",
      "liveLabel": "Visit RabbitHole",
      "sourceUrl": "https://github.com/Jiufani/rabbitv6",
      "sections": [
        {
          "title": "The idea",
          "text": "Music discovery often starts with a name. RabbitHole turns that starting point into an interactive map of artists, records, producers, and featured performers, using open music credits."
        },
        {
          "title": "The experience",
          "text": "Search for an artist, open a featured map, and follow a person or record. Map and list views make the same connections available in different ways. Artist and producer recommendations offer another route into the collection."
        },
        {
          "title": "Under the surface",
          "text": "The supplied project uses a JavaScript interface, Cytoscape.js graphs, and a Node.js/Express API. MusicBrainz relationships and recording credits supply the connections. Request budgets, rate limiting, and prepared featured maps help manage external data access."
        },
        {
          "title": "What this brings together",
          "text": "Interface design, data visualization, API integration, and deployment. The key product decision is to make exploration feel inviting while keeping the graph grounded in actual music credits."
        }
      ],
      "kind": "project",
      "filters": [
        "development"
      ],
      "cardSubtitle": "Music discovery, built in 36 hours for KnightHacks.",
      "workLabel": "Web application",
      "coverLabel": "Project",
      "tone": "rabbit",
      "files": [],
      "showTypeLabel": false
    },
    {
      "id": "nebula-navigator",
      "title": "Nebula Navigator",
      "subtitle": "A 2D arcade survival game built for the browser.",
      "category": "Project / Desktop Web Game",
      "image": "assets/nebula-navigator.png",
      "imageAlt": "Nebula Navigator start screen with a cyan and violet title, asteroid-field survival prompt, and Initialize Engine button.",
      "previewNote": "Nebula Navigator start-screen screenshot.",
      "tags": [
        "JavaScript (ES6+)",
        "Canvas API",
        "HTML5 / CSS3",
        "Web Storage API"
      ],
      "liveUrl": "https://jiufani.github.io/Nebula-navigator-final/",
      "sourceUrl": "",
      "sections": [
        {
          "title": "The project",
          "text": "I built Nebula Navigator, a responsive 2D arcade survival game, using HTML5, JavaScript (ES6+), the Canvas API, and CSS3. A custom requestAnimationFrame game loop coordinates rendering, player movement, and real-time gameplay updates. The project brings together browser graphics programming and hands-on gameplay UX."
        },
        {
          "title": "Rendering & collision",
          "text": "I developed a custom canvas rendering engine with particle systems for propulsion and explosion effects. Real-time bounding-box collision detection handles interactions during play, connecting the game state with visible feedback on the canvas."
        },
        {
          "title": "Controls & persistence",
          "text": "I implemented shared keyboard and touch control handlers, with adaptive viewport scaling to keep the play area responsive across screen sizes. The Web Storage API stores state locally through localStorage, preserving information between browser sessions."
        },
        {
          "title": "Testing & iteration",
          "text": "I refined the core gameplay experience through iterative peer usability testing. Feedback informed UI bounds constraints and visual feedback systems, helping keep interactions within the play area and make game events easier to understand."
        }
      ],
      "kind": "project",
      "filters": [
        "development"
      ],
      "cardSubtitle": "An arcade survival game with a custom canvas engine.",
      "workLabel": "Desktop Web Game",
      "coverLabel": "Project",
      "tone": "nebula",
      "files": [],
      "liveLabel": "Play Nebula Navigator"
    },
    {
      "id": "starr-wellness",
      "title": "Starr Wellness Collective",
      "subtitle": "Website Optimization & Developer Intern · August 2026–Present",
      "category": "Experience / Website Optimization & Developer Intern",
      "image": "assets/starr-wellness-cover.jpg",
      "imageAlt": "Join SWC.org logo in navy, turquoise, and green, with the words Learn. Nourish. Move. Thrive.",
      "previewNote": "Starr Wellness Collective cover art.",
      "tags": [
        "Frontend performance",
        "Technical SEO",
        "Accessibility"
      ],
      "liveUrl": "https://joinswc.org/",
      "liveLabel": "Visit Starr Wellness Collective",
      "sourceUrl": "",
      "sections": [
        {
          "title": "The role",
          "text": "Since August 2026, I have worked as a Website Optimization & Developer Intern at Starr Wellness Collective, improving frontend performance, accessibility, and technical SEO across multiple web properties. My work connects the code that runs in the browser with how the sites are rendered, found, and measured.\n\nThe reported desktop PageSpeed Insights audit recorded 98/100 Performance, 100/100 Accessibility, 100/100 SEO, and 0 Cumulative Layout Shift. Total Blocking Time fell from 540 ms to 60 ms, an approximately 89% reduction."
        },
        {
          "title": "Critical rendering & resource priorities",
          "text": "I reworked the critical rendering path by deferring non-critical Google Fonts, adding modulepreload hints, and prioritizing above-the-fold hero assets with eager loading and fetchpriority=\"high\". The goal was to bring the first useful content onto the screen sooner and give important resources priority during startup."
        },
        {
          "title": "Script execution & blocking time",
          "text": "I refactored Google Tag Manager initialization and asynchronous JavaScript execution to reduce work competing with the first render. Total Blocking Time dropped from 540 ms to 60 ms, with roughly 500 KiB of early script evaluation work removed from the startup path.\n\nThis work focused on when code runs as well as how much work the page asks the browser to do before it becomes responsive."
        },
        {
          "title": "Accessibility & stable layouts",
          "text": "I resolved contrast issues and improved semantic HTML landmarks and heading hierarchy. I also enforced explicit intrinsic image dimensions to reserve space for assets, maintaining 0 CLS in the reported audit.\n\nFor dynamic image grids, I used asynchronous image decoding and responsive sizing to improve scrolling and reduce visible frame drops and jitter. Accessibility and SEO each reached 100/100 in the reported PageSpeed Insights results."
        },
        {
          "title": "Technical SEO across web properties",
          "text": "I audited XML sitemaps and JSON-LD structured data across properties including joinswc.org and thesvacationhomes.com. In Google Search Console, I addressed Soft 404s, canonical issues, and unindexed URLs to support better indexing coverage.\n\nThe work connected on-page structure, crawlability, and Search Console diagnostics rather than treating SEO as a separate layer of copy changes."
        },
        {
          "title": "Automated analytics & reporting",
          "text": "I built an automated reporting workflow using Claude AI and Porter Metrics MCP connectors to track Search Console analytics, rankings, and performance metrics for executive stakeholders. The workflow brought recurring measurements into a repeatable reporting process so that technical changes could be followed alongside search performance."
        }
      ],
      "kind": "experience",
      "filters": [
        "development"
      ],
      "cardSubtitle": "Website Optimization & Developer Intern",
      "workLabel": "Website Optimization & Developer Intern",
      "coverLabel": "Internship experience",
      "tone": "starr",
      "files": [],
      "caseStudy": true,
      "resultsTitle": "Desktop audit results",
      "results": [
        {
          "value": "60 ms",
          "label": "TBT · down from 540 ms"
        },
        {
          "value": "98/100",
          "label": "Desktop performance"
        },
        {
          "value": "100/100",
          "label": "Accessibility & SEO, each"
        },
        {
          "value": "0",
          "label": "Cumulative Layout Shift"
        }
      ],
      "resultsNote": "Reported desktop PageSpeed Insights audit. TBT changed from 540 ms to 60 ms; Accessibility and SEO each scored 100/100."
    },
    {
      "id": "thoughtgps",
      "title": "ThoughtGPS",
      "subtitle": "Media & Marketing Intern · Summer 2026",
      "category": "Experience / Media & Marketing Internship",
      "image": "assets/thoughtgps-cover.jpg",
      "imageAlt": "ThoughtGPS cover art: a bright blue location pin containing a brain on a deep navy background",
      "previewNote": "ThoughtGPS cover art.",
      "tags": [
        "Content strategy",
        "Short-form video",
        "Brand storytelling",
        "CapCut",
        "Adobe Premiere Pro"
      ],
      "liveUrl": "",
      "sourceUrl": "",
      "sections": [
        {
          "title": "The role",
          "text": "During Summer 2026, I worked as a Media & Marketing Intern for ThoughtGPS, an interactive, location-based audio tour app for exploring local history, hidden spots, and guided stories. My focus was to support user acquisition, brand awareness, and app downloads through short-form content for TikTok and Instagram Reels."
        },
        {
          "title": "End-to-end video production",
          "text": "I conceptualized, scripted, filmed, and edited promotional videos that connected app features with local tour routes. I managed the work from the initial idea through production and editing, using file-transfer and media-management workflows that preserved video and audio quality."
        },
        {
          "title": "Creative campaign concepts",
          "text": "I developed the POV “Invisible Guide” series: immersive walkthroughs of local spots and historic locations paired with app narration. I also wrote “What Are You Listening To?” concepts that placed ThoughtGPS audio tours in unexpected everyday settings.\n\nFor man-on-the-street content, I used humor and authentic interviews in community spaces, including skateparks and neighborhood clubhouses. These formats gave Gen Z and millennial travelers a relatable introduction to the app."
        },
        {
          "title": "Hooks, pacing & brand storytelling",
          "text": "I used social trends, humor, and hook-driven storytelling to present location-based audio tours as an approachable lifestyle experience. I analyzed content-performance strategies to refine opening hooks, pacing, and visual calls to action that directed viewers to the iOS and Android apps."
        },
        {
          "title": "Skills & tools",
          "text": "The internship brought together content strategy, scriptwriting, video editing, on-camera work, street interviews, and social media marketing. I used CapCut, Adobe Premiere Pro, and Google Docs alongside high-resolution file-delivery workflows to move ideas from script to finished content."
        }
      ],
      "kind": "experience",
      "filters": [
        "design"
      ],
      "cardSubtitle": "Media & Marketing Intern · Summer 2026",
      "workLabel": "Media & marketing",
      "coverLabel": "Internship experience",
      "tone": "thought",
      "files": []
    },
    {
      "id": "bereal",
      "title": "Bereal",
      "subtitle": "Product Manager Externship",
      "category": "Experience / Product Manager Externship",
      "image": "assets/bereal-extern-cover.png",
      "imageAlt": "Extern cover art with a black wordmark and green accent on a white background",
      "previewNote": "Extern cover art · Product Manager Externship.",
      "tags": [
        "Product strategy",
        "User research",
        "Coded prototyping"
      ],
      "liveUrl": "https://be-real-catch-up-pass-experimental.vercel.app/",
      "sourceUrl": "",
      "sections": [
        {
          "title": "Overview",
          "text": "During my Product Manager Externship, I developed Catch-Up Pass: a feature concept addressing the friction users described when they missed the app's spontaneous posting window. I owned the work from problem framing and competitive research through product requirements, user flows, wireframing, a hand-coded interactive prototype, and usability testing.\n\nThe central product question was how to support continued participation while protecting the spontaneity and authenticity that made the experience valuable. My proposal combined a controlled catch-up experience with clear safeguards and visible posting context. The linked Visual Summary records my product and competitive research. The seven-slide “BeReal Catch-Up Pass Proposal final” brings together the research, concept, interaction flow, validation, and recommended refinements. The live prototype makes the proposed experience available to try."
        },
        {
          "title": "The Problem & Retention Friction",
          "text": "My research surfaced a mismatch between a time-sensitive notification and the realities of users' days. Interviewees described being in meetings or driving when an alert arrived. Missing the two-minute window interrupted their ability to participate; broken streaks and feelings of guilt then made returning to the app less appealing. I treated this sequence as a retention hypothesis grounded in user feedback.\n\nI mapped the end-to-end experience to connect the trigger, the missed opportunity, and the decision to return or disengage. This reframed the problem around the cost of a missed moment. The design challenge became: how might a user recover from an unavoidable interruption while keeping participation meaningful? The research established a concrete opportunity for a prototype; it did not establish a measured production DAU uplift or a quantified causal effect on churn."
        },
        {
          "title": "UX Strategy & Product Vision",
          "text": "I benchmarked Instagram, TikTok, Snapchat, and Threads to compare participation mechanics, feature gaps, and the ways social platforms encourage people to return. The aim was to identify an approach that fit BeReal's uncurated appeal. Catch-Up Pass emerged as a controlled exception: users would redeem limited, earned passes under strict weekly caps. Those boundaries were intended to preserve the value of showing up in the moment.\n\nI balanced two needs: making participation more forgiving and maintaining trust in what people were seeing. Tester feedback informed my recommendation for a Transparency Badge reading “Posted with Catch-Up Pass,” giving peers context about how a post was shared. I paired that proposed disclosure with the weekly limits around catch-up behavior. The design principle was controlled flexibility, with authenticity treated as a product requirement throughout the feature."
        },
        {
          "title": "Technical Execution & Prototyping",
          "text": "I translated the research into product specifications, user stories, and multi-step user journeys, then developed wireframes to organize the interaction. Those artifacts connected the user problem to the behavior the feature needed to support. The proposal describes a three-step flow: encounter a missed alert, redeem an available pass within the weekly limit, then capture and share the late moment with friends.\n\nI hand-coded a functional, multi-page interactive Catch-Up Pass prototype from scratch. Building the interactions made the concept tangible for testing and connected my product decisions to a working experience. My contribution covered the product logic, interface structure, and technical execution of the prototype. The final seven-slide proposal explained the problem, the proposed experience, the research findings, and the safeguards that supported the recommendation."
        },
        {
          "title": "Validation & Data",
          "text": "I designed and deployed the “BeReal Experimental Feature” usability testing survey to evaluate the proposed experience across usability, authenticity, and behavioral impact. The reported results were a 4.4/5 intent-to-use score and an 80% recommendation rate. These measures gave me evidence of stated interest in the concept and a basis for assessing whether the direction deserved further iteration.\n\nI also used qualitative feedback to refine the strategy, including the Transparency Badge as a response to peer-trust concerns. Together, the quantitative signals and tester comments connected feature appeal with the conditions under which the experience would feel acceptable. The scores describe responses to a prototype. Production retention, posting behavior, and long-term changes in DAU remain unmeasured."
        },
        {
          "title": "Strategic Impact",
          "text": "The outcome was a research-backed feature proposal supported by product specifications, user flows, wireframes, a working coded prototype, usability feedback, and a seven-slide presentation. The Visual Summary and final proposal are available below alongside the live prototype. Together, they show how I connected product strategy, UX reasoning, and implementation.\n\nMy final recommendation was to refine the concept before a wider beta: add the Transparency Badge, improve screen three so remaining weekly limits are immediately clear, and test long-term monthly active usage and retention. The strategic goal was to reduce the participation cost of a missed alert while preserving authenticity and peer trust. The survey establishes evidence of prototype appeal; a controlled live experiment would evaluate the business impact."
        }
      ],
      "kind": "experience",
      "filters": [
        "product"
      ],
      "cardSubtitle": "Product Manager Externship",
      "workLabel": "Product Manager Externship",
      "coverLabel": "Externship experience",
      "tone": "bereal",
      "files": [
        {
          "id": "visual-summary",
          "title": "BeReal — Visual Summary",
          "type": "document",
          "src": "assets/work/bereal-visual-summary.pdf",
          "thumbnail": "assets/work/bereal-visual-summary-cover.webp",
          "alt": "First page of Giovanni’s BeReal Visual Summary, showing the title and BeReal brand context",
          "thumbnailNote": "First page preview · 7-page PDF. Open the PDF to read the full document.",
          "description": "A seven-page research overview of BeReal’s positioning, competitors, business model, and growth strategy.",
          "context": "This research grounds the Catch-Up Pass proposal in the product’s context. I compared Instagram, Snapchat, TikTok, and Threads and considered how growth opportunities fit BeReal’s focus on authenticity.",
          "tags": [
            "Competitive research",
            "Product strategy",
            "BeReal"
          ],
          "pageCount": 7,
          "showInOverview": true,
          "actionLabel": "Visual summary (PDF)"
        },
        {
          "id": "catch-up-pass-proposal",
          "title": "Catch-Up Pass — Proposal",
          "type": "document",
          "src": "assets/work/bereal-catch-up-pass-proposal.pdf",
          "thumbnail": "assets/work/bereal-catch-up-pass-proposal-cover.webp",
          "alt": "First slide of the Catch-Up Pass proposal, with a lime title on a dark background",
          "thumbnailNote": "First page preview · 7-slide PDF. Open the PDF to read the full proposal.",
          "description": "The seven-slide proposal: retention friction, user insight, earned weekly passes, the posting flow, validation, and a refine-and-beta recommendation.",
          "context": "The proposal connects a missed-alert problem to a controlled catch-up experience. It records the 4.4/5 intent-to-use score and 80% recommendation rate, then recommends a transparency badge, clearer remaining-pass limits on screen three, and a wider beta to evaluate long-term retention.",
          "tags": [
            "Feature proposal",
            "UX strategy",
            "Prototype validation"
          ],
          "pageCount": 7,
          "showInOverview": true,
          "actionLabel": "Proposal (PDF)"
        }
      ],
      "caseStudy": true,
      "resultsTitle": "Prototype validation",
      "results": [
        {
          "value": "4.4/5",
          "label": "Intent to use"
        },
        {
          "value": "80%",
          "label": "Recommendation rate"
        }
      ],
      "resultsNote": "BeReal Experimental Feature usability survey. These measures describe reported intent and recommendation for the prototype.",
      "liveLabel": "Try Catch-Up Pass",
      "galleryTitle": "Visual summary & proposal",
      "groupFiles": true
    },
    {
      "id": "bobaloo",
      "title": "Bobaloo Tea",
      "subtitle": "Building a recognizable presence for a growing tea brand.",
      "category": "Brand identity / digital design",
      "image": "assets/bobaloo-brand-banner.png",
      "imageAlt": "Bobaloo Tea brand banner with a colorful illustrated drink character and the words Bobaloo Tea: Refresh Your Day! Explore New Flavors!",
      "previewNote": "Bobaloo Tea brand artwork.",
      "tags": [
        "Visual identity",
        "Brand assets",
        "Social media",
        "Digital design"
      ],
      "liveUrl": "",
      "sourceUrl": "",
      "sections": [
        {
          "title": "The context",
          "text": "My Bobaloo Tea work includes creating social accounts, a logo, and supporting brand assets. I connected visual design with the practical needs of a small business establishing its public presence."
        },
        {
          "title": "A recognizable visual identity",
          "text": "The brand combines a playful illustrated character, bright color, and clear promotional messaging. The supplied banner brings those elements together around “Refresh Your Day!” and “Explore New Flavors!” to communicate the personality of Bobaloo Tea."
        },
        {
          "title": "Design & communication",
          "text": "I approached the logo, social accounts, and supporting assets as parts of the same brand. The work focused on making the business recognizable and giving its digital presence a consistent direction."
        }
      ],
      "kind": "project",
      "filters": [
        "design"
      ],
      "cardSubtitle": "A small brand with a lot of personality.",
      "workLabel": "Brand & digital",
      "coverLabel": "Brand artwork",
      "tone": "bobaloo",
      "files": [],
      "showInProjects": false
    }
  ]
};
