// Personal projects. Only public repositories get a source link.
module.exports = [
  {
    name: "Line by Line",
    kind: "iOS · Web game",
    blurb:
      "A story game that teaches you to read code: Git, diffs, SQL, APIs, auth, Docker, and error messages. The web and iOS versions share one JavaScript engine.",
    stack: ["SwiftUI", "JavaScriptCore", "JavaScript"],
    links: [{ label: "Support", href: "/line-by-line/support/" }],
    featured: true,
  },
  {
    name: "GomiQuest",
    kind: "iOS app",
    blurb:
      "A litter-pickup game. Log what you collect, map your cleanup routes, and level up. Data stays on the phone.",
    stack: ["SwiftUI", "SwiftData", "MapKit"],
    links: [{ label: "Support", href: "/gomiquest/support/" }],
    featured: true,
  },
  {
    name: "Mecha Kit Tracker",
    kind: "iOS app",
    blurb:
      "Tracks Gunpla and other model kits: in the box, on the bench, or built. Includes a catalog of about 1,900 kits.",
    stack: ["SwiftUI"],
    links: [],
  },
  {
    name: "Cursor Story",
    kind: "macOS menu bar",
    blurb:
      "Draws your mouse movements over the day as a light trail on the desktop. Export it as an image.",
    stack: ["Swift"],
    links: [{ label: "Source", href: "https://github.com/mattkhovis/cursor-story" }],
  },
  {
    name: "Horological Heartbeat",
    kind: "macOS menu bar",
    blurb:
      "A menu bar clock that ticks like a mechanical watch. Syncs over NTP and shows clock drift.",
    stack: ["Swift", "NTP"],
    links: [{ label: "Source", href: "https://github.com/mattkhovis/Horological-Heartbeat" }],
  },
  {
    name: "Hand-Cranked Scrolling",
    kind: "Browser extension",
    blurb:
      "A joke extension. Turn a crank to scroll down. Stop turning and the page slides back up.",
    stack: ["JavaScript"],
    links: [{ label: "Source", href: "https://github.com/mattkhovis/hand-cranked-scrolling" }],
  },
  {
    name: "Manual File Shredder",
    kind: "Desktop widget",
    blurb:
      "A joke app. To delete a file, drop it in a paper shredder and turn the handle.",
    stack: ["Electron"],
    links: [],
  },
  {
    name: "ProcrastinAI",
    kind: "Web app",
    blurb:
      "A joke app. Enter a task and get an endless tree of side quests, with XP and achievements.",
    stack: ["Next.js", "React", "Tailwind"],
    links: [],
  },
];
