const { MongoClient } = require('mongodb');
const MONGODB_URI = process.env.MONGODB_URI;

const events = [
  // Week 1 - Mon Apr 6
  {
    eventId:"0-0-0", weekIdx:0, dayIdx:0, name:"RiceFest", time:"All fest · Apr 7-17", cat:"FOSS", mode:"online",
    startDate:"2026-04-06", endDate:"2026-04-17", startTime:null, endTime:null,
    description:"• The Challenge: Customize and 'rice' your system (Linux, macOS, or Windows) to create a unique, visually appealing, and highly functional desktop setup.\n\n• The Twist: It's not just about looks - your setup will be judged on aesthetics, usability, accessibility, performance, and overall user experience.\n\n• The Goal: Deliver a polished, optimized system configuration that balances style and practicality, and effectively demonstrate your setup to stand out.",
    comments:[{id:"1774523257999",author:"Arham Kachhara",role:"admin",text:"how can I win this??",time:"26/03/2026",replies:[{id:"1774523319721",author:"Vaidik Saxena",role:"admin",text:"believe",time:"3/26/2026"}]}],
  },
  {
    eventId:"0-0-1", weekIdx:0, dayIdx:0, name:"Contract Battle", time:"Apr 6 · 48 hrs", cat:"Blockchain", mode:"online",
    startDate:"2026-04-06", endDate:"2026-04-08", startTime:null, endTime:null,
    description:"Join us and participate! No detailed description provided yet.", comments:[],
  },
  {
    eventId:"0-0-2", weekIdx:0, dayIdx:0, name:"Appophilia", time:"Apr 6 · 7 days", cat:"App", mode:"online",
    startDate:"2026-04-06", endDate:"2026-04-13", startTime:null, endTime:null,
    description:"* The Challenge: Build a fully functional mobile application (individually or in a duo) that seamlessly integrates one of five provided APIs (like Codeforces, Weather, or Free Games).\n* The Twist: You are strictly limited to using only the specified APIs. Your success depends entirely on how creatively and efficiently you utilize that specific data.\n* The Goal: Create an impactful, bug-free app with clean code architecture, smooth performance, and an intuitive user interface before the submission window closes.",
    comments:[],
  },
  {
    eventId:"0-0-3", weekIdx:0, dayIdx:0, name:"GDG UserRush", time:"Apr 6 · 7 days", cat:"GDG Web", mode:"online",
    startDate:"2026-04-06", endDate:"2026-04-13", startTime:null, endTime:null,
    description:"Join us and participate! No detailed description provided yet.", comments:[],
  },
  {
    eventId:"0-0-4", weekIdx:0, dayIdx:0, name:"Dev Stakes", time:"Apr 6 · 84 hrs", cat:"Web", mode:"online",
    startDate:"2026-04-06", endDate:"2026-04-10", startTime:null, endTime:null,
    description:"• The Challenge: Build and deploy a complete project (team-based) within 4 days using either provided ideas or an approved custom idea.\n\n• The Twist: You can use AI tools, but scoring depends on implementation quality, clean code, Git practices, performance, and your ability to explain the project.\n\n• The Goal: Deliver a fully functional, well-structured, and deployed project, maximizing points through features, execution quality, and optional bonus innovations (e.g., ML, backend).",
    comments:[],
  },
  {
    eventId:"0-0-5", weekIdx:0, dayIdx:0, name:"SpeedForces", time:"6:00 PM – 8:30 PM · 2.5 hrs", cat:"CP", mode:"offline",
    startDate:"2026-04-06", endDate:"2026-04-06", startTime:"18:00", endTime:"20:30",
    description:"SpeedForces is an offline competitive programming contest held on the Codeforces platform, focused on testing speed, accuracy, and problem-solving under time pressure.\n\nThe contest lasts 2 to 2.5 hours and includes 8–12 easy-level questions.\n\nParticipants aim to solve the maximum number of problems, requiring quick thinking and efficient coding.",
    comments:[],
  },
  {
    eventId:"0-0-6", weekIdx:0, dayIdx:0, name:"Camazotz – Day 1", time:"9:30 PM – 12:30 AM · 3 hrs", cat:"App", mode:"offline",
    startDate:"2026-04-06", endDate:"2026-04-07", startTime:"21:30", endTime:"00:30",
    description:"* The Challenge: Compete in an intense 8-hour, two-phase UX survival challenge. First, intentionally build a functionally flawed, frustrating UI (Phase 1), then swap projects to fix another team's disaster (Phase 2).\n* The Twist: You cannot rewrite the code from scratch in Phase 2! You must refactor the existing broken structure to improve usability without destroying the core.\n* The Goal: Prove your deep understanding of user psychology by transforming a cognitive-load nightmare into an accessible, optimized interface, backed by solid design documentation.",
    comments:[],
  },
  // Week 1 - Tue Apr 7
  {
    eventId:"0-1-0", weekIdx:0, dayIdx:1, name:"CodeUI.apk – App UI Sprint", time:"Apr 7 · 72 hrs", cat:"App", mode:"online",
    startDate:"2026-04-07", endDate:"2026-04-10", startTime:null, endTime:null,
    description:"* The Challenge: Design a visually stunning, non-functional mobile UI from scratch using Kotlin (XML/Compose) or SwiftUI, based on a provided component checklist or app idea.\n* The Twist: It's purely about aesthetics and UX—no backend required! However, your design must be entirely original; no direct copying from Dribbble or Pinterest allowed.\n* The Goal: Deliver a polished, responsive, and highly intuitive layout that maximizes visual appeal and proves your grasp of UI/UX principles.",
    comments:[],
  },
  {
    eventId:"0-1-1", weekIdx:0, dayIdx:1, name:"Freshers Cup – R1", time:"Apr 7 · 3 hrs online", cat:"CP", mode:"online",
    startDate:"2026-04-07", endDate:"2026-04-07", startTime:null, endTime:null,
    description:"It is an online team contest conducted on the Codeforces platform for 3 hours, where each team has exactly 3 members and must be formed on Codeforces. \n\nThe contest tests coordination, teamwork, problem-solving skills, and speed.\n\nThe top 10–15 teams qualify for Round 2.",
    comments:[],
  },
  {
    eventId:"0-1-2", weekIdx:0, dayIdx:1, name:"Design Finish", time:"10:30 PM – 11:30 PM · 1 hr", cat:"Design", mode:"offline",
    startDate:"2026-04-07", endDate:"2026-04-07", startTime:"22:30", endTime:"23:30",
    description:"Design Finish is a design challenge where participants must complete a half-designed poster within a limited time. Each team will be provided with a partially designed poster layout containing some elements such as shapes, colors, images, or typography.\n\nUsing their creativity and design sense, participants must complete the remaining design while maintaining visual balance, theme consistency, and overall aesthetics. The goal is to transform the incomplete layout into a fully finished and visually appealing poster.\n\nThis event tests participants' creativity, design thinking, and ability to quickly build a cohesive design.\n\nTeam Size:\n2–3 participants per team\n\nDuration:\n30–45 minutes\n\nTask:\nTeams will receive a half-designed poster.\nThey must complete the design and create a final visually appealing poster within the given time.\n\nTools Allowed:\n* Canva\n* Other related design tools\n\nJudging Criteria:\n* Creativity and originality\n* Visual balance and composition\n* Color and typography usage\n* Overall design quality and finishing.",
    comments:[],
  },
  // Week 1 - Wed Apr 8
  {
    eventId:"0-2-0", weekIdx:0, dayIdx:2, name:"Incognito 7.0", time:"Apr 8 · 48 hrs", cat:"InfoSec", mode:"online",
    startDate:"2026-04-08", endDate:"2026-04-10", startTime:null, endTime:null,
    description:"Step into the world of cybersecurity with INCOGNITO 7.0, the flagship 24 hour Capture The Flag (CTF) event of Equinox!\n\nBreak codes, bypass security, and hunt for hidden \"flags\" in this fast paced, jeopardy style competition.\n\nThe Domains: Test your skills in Web, Crypto, Forensics, Reverse Engineering, Pwn, and OSINT.\n\nThe Vibe: A 24-hour adrenaline rush fueled by teamwork and out-of-the-box thinking.\n\nFor Everyone: Whether you're a total beginner or a seasoned pro, we have challenges designed for your skill level.",
    comments:[],
  },
  {
    eventId:"0-2-1", weekIdx:0, dayIdx:2, name:"Silent Poster", time:"10:00 PM – 11:00 PM · 1 hr", cat:"Design", mode:"offline",
    startDate:"2026-04-08", endDate:"2026-04-08", startTime:"22:00", endTime:"23:00",
    description:"Silent Poster is a creative design challenge where teams must create a powerful poster using only visuals. Each team will be given a theme or concept, and their task is to communicate the message clearly through images, symbols, colors, and visual elements.\n\nThe challenge tests participants' ability to convey ideas through pure visual storytelling. Teams must focus on creativity, symbolism, composition, and emotional impact to make the message understandable without any written explanation.\n\n\nTeam Size:\n2–3 participants per team\n\nDuration:\n45–60 minutes\n\nTask:\nTeams must design a poster based on the given theme, using only visuals.\n\nTools:\nCanva and related tools\n\nJudging Criteria:\n* Creativity and originality\n* Clarity of message through visuals\n* Visual composition and design balance\n* Emotional or conceptual impact of the poster.",
    comments:[],
  },
  {
    eventId:"0-2-2", weekIdx:0, dayIdx:2, name:"Camazotz – Day 2", time:"6:00 PM – 9:00 PM · 3 hrs", cat:"App", mode:"offline",
    startDate:"2026-04-08", endDate:"2026-04-08", startTime:"18:00", endTime:"21:00",
    description:"* The Challenge: Compete in an intense 8-hour, two-phase UX survival challenge. First, intentionally build a functionally flawed, frustrating UI (Phase 1), then swap projects to fix another team's disaster (Phase 2).\n* The Twist: You cannot rewrite the code from scratch in Phase 2! You must refactor the existing broken structure to improve usability without destroying the core.\n* The Goal: Prove your deep understanding of user psychology by transforming a cognitive-load nightmare into an accessible, optimized interface, backed by solid design documentation.",
    comments:[],
  },
  // Week 1 - Thu Apr 9
  {
    eventId:"0-3-0", weekIdx:0, dayIdx:3, name:"Freshers Cup – R2", time:"6:00 PM – 11:00 PM · 5 hrs", cat:"CP", mode:"offline",
    startDate:"2026-04-09", endDate:"2026-04-09", startTime:"18:00", endTime:"23:00",
    description:"The top teams from Freshers Cup Round 1 compete in Round 2, which is an offline team contest conducted on the Codeforces platform for 5 hours. \n\nEach team consists of 3 members, and the contest tests advanced logical thinking, problem-solving skills, coordination, and teamwork.\n\n Only one laptop allowed per team.",
    comments:[],
  },
  {
    eventId:"0-3-1", weekIdx:0, dayIdx:3, name:"PixelForge", time:"11:30 PM – 12:30 AM · 1 hr", cat:"Design", mode:"offline",
    startDate:"2026-04-09", endDate:"2026-04-10", startTime:"23:30", endTime:"00:30",
    description:"PixelForge is a group-based UI/UX design event where participants will design a modern website interface using Figma and AI tools. Teams will create either a landing page or a 3-page micro-site based on a given theme or problem statement.\n\nParticipants must focus on creative design, user experience, and visual aesthetics while building the interface. The final design should include a Figma prototype showing basic navigation and interactions.\n\nThe event encourages teams to combine design thinking with AI assistance to create engaging and user-friendly web experiences.\n\n\nTeam Size:\n\n2–3 participants per team\n\n\nDuration:\n1 hour\n\nTask:\nDesign either:\n* A Landing Page, or\n* A 3-Page Micro-Site (example: Home, Features, Contact)\n\nParticipants must submit a Figma design with a working prototype.\n\n\nTools Allowed:\n* Figma (mandatory)\n* AI tools\n\nNo other tools are allowed.\n\nJudging Criteria:\n* Creativity and originality\n* UI design and visual aesthetics\n* User experience (UX)\n* Prototype interaction\n* Effective use of AI",
    comments:[],
  },
  // Week 1 - Fri Apr 10
  {
    eventId:"0-4-0", weekIdx:0, dayIdx:4, name:"FOSS Weekend", time:"Apr 10-12 · 72 hrs", cat:"FOSS", mode:"online",
    startDate:"2026-04-10", endDate:"2026-04-12", startTime:null, endTime:null,
    description:"• The Challenge: Contribute to open-source projects over 3 days by solving issues and submitting pull requests across provided and external repositories.\n\n• The Twist: Points are awarded based on issue complexity, PR difficulty, PR quality (clarity, structure, testing), and additional weight for meaningful contributions to high-star external repositories.\n\n• The Goal: Maximize your score by making impactful, well-documented, and high-quality contributions while following best practices (clean commits, proper PRs, reviews, and collaboration).",
    comments:[],
  },
  // Week 2 - Mon Apr 13
  {
    eventId:"1-0-0", weekIdx:1, dayIdx:0, name:"Kaggle Cup", time:"Apr 13 · 168 hrs", cat:"ML", mode:"online",
    startDate:"2026-04-13", endDate:"2026-04-16", startTime:null, endTime:null,
    description:"The Axios ML Kaggle Cup is the flagship competition of the Machine Learning Wing, designed as a hands-on, hackathon-style challenge centered around CNNs. Participants are given a real-world image dataset and are tasked with building, training, and optimizing deep learning models to achieve the best possible performance on a hidden test set.",
    comments:[],
  },
  {
    eventId:"1-0-1", weekIdx:1, dayIdx:0, name:"GDG Fossology", time:"Apr 13 · 36 hrs online", cat:"GDG FoSS", mode:"online",
    startDate:"2026-04-13", endDate:"2026-04-15", startTime:null, endTime:null,
    description:"Join us and participate! No detailed description provided yet.", comments:[],
  },
  {
    eventId:"1-0-2", weekIdx:1, dayIdx:0, name:"Code Arena", time:"6:00 PM – 9:00 PM · 3 hrs", cat:"CP", mode:"offline",
    startDate:"2026-04-13", endDate:"2026-04-13", startTime:"18:00", endTime:"21:00",
    description:"Qualifier Round: A 30-minute contest with 2 easy questions is conducted to shortlist participants. Based on performance, the top 64 participants are selected for the knockout stage.\n\nKnockout Rounds: This stage follows a 1v1 battle format, where participants compete head-to-head. In each match, both participants are given one very easy question.\n\nWinning Criteria: The participant who solves the problem faster advances to the next round. No penalty is considered—only the first correct submission determines the winner.",
    comments:[],
  },
  {
    eventId:"1-0-3", weekIdx:1, dayIdx:0, name:"Frontend Sprint", time:"10:00 PM – 11:00 PM", cat:"Web", mode:"offline",
    startDate:"2026-04-13", endDate:"2026-04-13", startTime:"22:00", endTime:"23:00",
    description:"Think you can build, connect, and deploy a fully functional web app in just one hour? Prove it at our AI-Assisted Frontend Sprint! This is not just a standard design challenge—you are tasked with building and deploying a fully functional frontend application from scratch and connecting it to a live backend API. Your primary objective is to successfully integrate either FreeAPI or DummyJSON into your project and implement core CRUD operations (GET, POST, PUT, and DELETE) to manage dynamic data on the screen. To help you beat the ticking clock, you are highly encouraged to leverage AI tools like ChatGPT, Gemini, or GitHub Copilot. Use them strategically to rapidly generate boilerplate code, structure your UI components, and debug tricky network or CORS errors on the fly. By the end of the 60 minutes, you must submit a live deployed project link along with a GitHub repository demonstrating a clear, step-by-step commit history. Bring your laptops fully charged, set up your favourite frontend framework, and get ready to build a portfolio-ready web application in just one hour!",
    comments:[],
  },
  // Week 2 - Tue Apr 14
  {
    eventId:"1-1-0", weekIdx:1, dayIdx:1, name:"Language Wars – Session 1", time:"5:30 PM – 8:30 PM · 3 hrs", cat:"FOSS", mode:"offline",
    startDate:"2026-04-14", endDate:"2026-04-14", startTime:"17:30", endTime:"20:30",
    description:"Optimisation Wars\n\nThe Multilingual Arena: Step into a coding battlefield spanning five distinct programming languages, testing your adaptability and deep understanding of how different compilers and interpreters handle execution.\n\nRuthless Efficiency: It is not enough to simply pass the test cases. Tackle grueling algorithmic puzzles where the true victory lies in stripping away bloat, minimizing time complexity, and achieving the lowest possible memory footprint.\n\nProve Your Dominance: Push your problem-solving limits and go head-to-head against fellow developers to see who can engineer the most blazingly fast, highly optimized code.",
    comments:[],
  },
  {
    eventId:"1-1-1", weekIdx:1, dayIdx:1, name:"GDG DevSphere", time:"9:30 PM – 12:30 AM · 3 hrs", cat:"GDG", mode:"offline",
    startDate:"2026-04-14", endDate:"2026-04-15", startTime:"21:30", endTime:"00:30",
    description:"Join us and participate! No detailed description provided yet.", comments:[],
  },
  // Week 2 - Wed Apr 15
  {
    eventId:"1-2-0", weekIdx:1, dayIdx:2, name:"PersonaLLM", time:"Apr 15 · 36 hrs", cat:"ML", mode:"online",
    startDate:"2026-04-15", endDate:"2026-04-17", startTime:null, endTime:null,
    description:"PersonaLLM is a creative Generative AI event where participants design and fine-tune Large Language Model outputs to mimic specific personalities. Teams are given a character persona—such as a fictional character, celebrity, or public figure—and must engineer prompts and responses so that the model consistently behaves in that style.\n\nParticipants are evaluated on how well their model captures the tone, language, humor, and behavioral traits of the assigned persona while completing specific tasks or challenges.\n\nThe event focuses on prompt engineering, creativity, and control over LLM behavior, making it both fun and technically engaging.",
    comments:[],
  },
  {
    eventId:"1-2-1", weekIdx:1, dayIdx:2, name:"Language Wars – Session 2", time:"6:00 PM – 9:00 PM · 3 hrs", cat:"FOSS", mode:"offline",
    startDate:"2026-04-15", endDate:"2026-04-15", startTime:"18:00", endTime:"21:00",
    description:"Language Wars\n\nChoose Your Weapon: Whether you swear by the bare-metal performance of C++, the fearless concurrency of Rust, or the elegant simplicity of Python, bring your preferred programming language to the battlefield.\n\nOne Problem, Infinite Approaches: Face off against a unified algorithmic challenge. The true battle lies in how your specific language and logic handle the pressure under the hood.\n\nThe Ultimate Benchmark: Solutions aren't just graded—they are strictly profiled. Prove your technical dominance as submissions are ruthlessly ranked on raw execution speed and the lowest possible memory footprint.",
    comments:[],
  },
  {
    eventId:"1-2-2", weekIdx:1, dayIdx:2, name:"Debug Duels", time:"10:00 PM – 11:30 PM · 1.5 hrs", cat:"Web", mode:"offline",
    startDate:"2026-04-15", endDate:"2026-04-15", startTime:"22:00", endTime:"23:30",
    description:"• The Challenge: Compete in fast-paced 1v1 bug-fixing battles where participants solve progressively harder coding bugs under time pressure.\n\n• The Twist: Qualification happens through a speed-based JS quiz, and only the fastest and most accurate participants advance to a bracket-style elimination.\n\n• The Goal: Outperform opponents by fixing bugs faster and more accurately across multiple knockout rounds to secure a top position.",
    comments:[],
  },
  // Week 2 - Thu Apr 16
  {
    eventId:"1-3-0", weekIdx:1, dayIdx:3, name:"Breach Battle", time:"6:00 PM – 9:00 PM · 3 hrs", cat:"InfoSec", mode:"offline",
    startDate:"2026-04-16", endDate:"2026-04-16", startTime:"18:00", endTime:"21:00",
    description:"Breach Battle is a fast paced, bracket style elimination tournament designed to test your team's skills and speed under pressure.\n\nThe Setup: Teams are paired off into direct team vs team matchups.\n\nThe Challenge: Both teams in a matchup are given the exact same problem simultaneously.\n\nThe Advancement: It's a race against the clock, the first team to successfully solve the challenge knocks out their opponent and advances to the next round.\n\nThe Climax: Advancing teams will face new, increasingly difficult challenges in each round until only one team remains to be crowned the champions.",
    comments:[],
  },
  // Week 2 - Fri Apr 17
  {
    eventId:"1-4-0", weekIdx:1, dayIdx:4, name:"Global Contest", time:"Evening · 3 hrs", cat:"CP", mode:"online",
    startDate:"2026-04-17", endDate:"2026-04-17", startTime:"18:00", endTime:"21:00",
    description:"It is an open contest where participants from all around the world can compete on the Codeforces platform.\n\nDuration: The contest lasts for 3 hours, providing a standard competitive programming experience.\n\nObjective: Participants compete globally to test their problem-solving skills, speed, and accuracy against a diverse set of coders.",
    comments:[],
  },
  {
    eventId:"1-4-1", weekIdx:1, dayIdx:4, name:"GDG Fossology – Round 2", time:"10:00 PM – 12:00 AM", cat:"GDG FoSS", mode:"offline",
    startDate:"2026-04-17", endDate:"2026-04-18", startTime:"22:00", endTime:"00:00",
    description:"Join us and participate! No detailed description provided yet.", comments:[],
  },
  // Week 2 - Sat Apr 18
  {
    eventId:"1-5-0", weekIdx:1, dayIdx:5, name:"Code Surgery", time:"11:00 AM – 2:00 PM · 3 hrs", cat:"Web", mode:"offline",
    startDate:"2026-04-18", endDate:"2026-04-18", startTime:"11:00", endTime:"14:00",
    description:"Join us and participate! No detailed description provided yet.", comments:[],
  },
  {
    eventId:"1-5-1", weekIdx:1, dayIdx:5, name:"BlindForces", time:"4:00 PM – 6:00 PM · 2 hrs", cat:"CP", mode:"offline",
    startDate:"2026-04-18", endDate:"2026-04-18", startTime:"16:00", endTime:"18:00",
    description:"It is a Codeforces contest of 2 hours where initially only a limited set of test cases is visible to participants.\n\nUnique Format: After the contest ends, full test cases are added and all submissions are rejudged, which may change the final standings.\n\nObjective: This format tests accuracy and robustness of solutions, as some submissions that pass during the contest may fail after rejudging.",
    comments:[],
  },
  {
    eventId:"1-5-2", weekIdx:1, dayIdx:5, name:"Hackofiesta", time:"Starts 9:00 PM · 36 hrs · Team of 4", cat:"Blockchain", mode:"offline",
    startDate:"2026-04-18", endDate:"2026-04-20", startTime:"21:00", endTime:null,
    description:"Join us and participate! No detailed description provided yet.", comments:[],
  },
  // Custom events
  {
    eventId:"custom-1774636590925", weekIdx:0, dayIdx:1, name:"RAGathon", time:"Apr 7 . 72 hours", cat:"FOSS", mode:"online",
    startDate:null, endDate:null, startTime:null, endTime:null,
    description:"No description provided.", comments:[],
  },
  {
    eventId:"custom-1774718721744", weekIdx:0, dayIdx:1, name:"GDG Ragathon", time:"120 hrs", cat:"GDG ML Wing", mode:"online",
    startDate:null, endDate:null, startTime:null, endTime:null,
    description:"No description provided.", comments:[],
  },
  {
    eventId:"custom-1774864247033", weekIdx:1, dayIdx:3, name:"Code Surgery", time:"6:00 PM - 9:00 PM - 3 Hour", cat:"Web", mode:"offline",
    startDate:null, endDate:null, startTime:null, endTime:null,
    description:"Participants will be given a large pre-existing codebase containing:\n\n- intentional bugs\n- logical errors\n- performance inefficiencies\n- bad coding practices\n- hidden edge-case failures\n\nTheir goal is to improve the codebase so that it:\n\n- runs correctly\n- passes all test cases\n- performs efficiently\n- remains maintainable\n\nWill have 2 rounds:\n\n- Round 1 - Screening round\n    - smaller codebase with obvious bugs\n    - 60 minutes deadline\n    - online\n- Round 2 - Main event\n    - big codebase\n    - 4 hours in duration\n    - in addition to bugs will also contain inefficiencies and there are points for resolving those",
    comments:[],
  },
  {
    eventId:"custom-1774872135370", weekIdx:0, dayIdx:1, name:"Hackathon", time:"04/07 · 10:00 AM – 12:00 PM · 2 hrs", cat:"FOSS", mode:"offline",
    startDate:null, endDate:null, startTime:null, endTime:null,
    description:"No description provided.", comments:[],
  },
];

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db();
  await db.collection('events_v2').drop().catch(() => {});
  const result = await db.collection('events_v2').insertMany(events);
  console.log(`Inserted ${result.insertedCount} events into events_v2`);
  await client.close();
}

seed().catch(console.error);
