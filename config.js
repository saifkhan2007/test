/* =====================================================================
   EDIT HERE: this is the only part you need to touch.

   Add a link:    copy one { name, url, desc } line inside a section's
                  "links" list and change the text.
                  Optional NEW badge: add added: "YYYY-MM-DD" (for example
                  { name: "My Tool", url: "tool.html", desc: "Cool app", added: "2026-10-24" }).
                  If the date is within the last 7 days, a yellow NEW badge
                  appears automatically on the card and in Quick Launch.

   Add a section: 1) copy a whole { id, title, blurb, img, links: [ ... ] }
                     block in SECTIONS below.
                  2) drop an image named <id>.jpg (or whatever you set in img)
                     into the repo root for the hub title card background.
                  3) copy section-template.html, rename the copy to <id>.html
                     (exact same case as id), and set data-section="<id>" on
                     its <body> tag.
                  It gets its own hub tile, section chip, and ticker entry
                  automatically.
   ===================================================================== */
const SITE = {
  title: "COOL GLITCH EFFECT",
  messages: [
    "Connected to node #381",
    "last analog outputs: 1.10,2.30,2.00,4.22,4.00",
    "All systems nominal",
    "Im once again asking for your financial support",
    "Connected to node #420",
"last analog outputs:6.90,4.20,3.14,1.11,9.99",
"All systems nominal",
"we live in a society",
"Connected to node #069",
"last analog outputs:1.21,3.33,5.55,7.77,8.88",
"All systems nominal",
"Never gonna give you up",
"Connected to node #901",
"last analog outputs:8.00,8.08,1.35,4.56,7.89",
"All systems nominal",
"Press F to pay respects",
"Connected to node #512",
"last analog outputs:1.11,2.22,3.33,4.44,5.55",
"All systems nominal",
"you picked the wrong house fool",
"Connected to node #314",
"last analog outputs:9.81,2.71,1.61,4.66,6.28",
"All systems nominal",
"This is fine",
"Connected to node #777",
"last analog outputs:7.77,7.77,7.77,7.77,7.77",
"All systems nominal",
"It's over 9000!",
"Connected to node #404",
"last analog outputs:4.04,0.00,4.04,0.00,4.04",
"All systems nominal",
"Stonks only go up",
"Connected to node #123",
"last analog outputs:1.23,4.56,7.89,0.12,3.45",
"All systems nominal",
"Always has been",
"Connected to node #888",
"last analog outputs:8.88,1.01,2.02,3.03,4.04",
"All systems nominal",
"All your base are belong to us",
"Connected to node #999",
"last analog outputs:9.99,8.88,7.77,6.66,5.55",
"All systems nominal",
"Feels good man",
"Connected to node #360",
"last analog outputs:3.60,1.80,0.90,7.20,1.44",
"All systems nominal",
"Do a barrel roll!",
"Connected to node #256",
"last analog outputs:2.56,1.28,0.64,5.12,1.02",
"All systems nominal",
"Leroy Jenkins!!!",
"Connected to node #111",
"last analog outputs:1.11,1.11,1.11,1.11,1.11",
"All systems nominal",
"We live in a society",
"Connected to node #555",
"last analog outputs:5.55,4.44,3.33,2.22,1.11",
"All systems nominal",
"Is this a pigeon?",
"Connected to node #808",
"last analog outputs:8.08,9.09,1.01,2.02,3.03",
"All systems nominal",
"Change my mind",
"Connected to node #303",
"last analog outputs:3.03,6.06,9.09,1.21,2.42",
"All systems nominal",
"Sir, this is a Wendy's",
"Connected to node #707",
"last analog outputs:7.07,5.05,3.03,1.01,0.00",
"All systems nominal",
"They did surgery on a grape",
"Connected to node #606",
"last analog outputs:6.06,7.07,8.08,9.09,0.10",
"All systems nominal",
"Here come dat boi",
"Connected to node #202",
"last analog outputs:2.02,4.04,6.06,8.08,1.00",
"All systems nominal",
"Cash me outside, how bout dah",
"Connected to node #101",
"last analog outputs:1.01,0.10,1.10,0.01,1.11",
"All systems nominal",
"I can has cheezburger?",
"Connected to node #414",
"last analog outputs:4.14,5.15,6.16,7.17,8.18",
"All systems nominal",
"You know I had to do it to em",
"Connected to node #525",
"last analog outputs:5.25,2.52,5.55,2.22,0.52",
"All systems nominal",
"Ain't nobody got time for that",
"Connected to node #636",
"last analog outputs:6.36,3.63,6.66,3.33,0.63",
"All systems nominal",
"Hide your kids, hide your wife",
"Connected to node #747",
"last analog outputs:7.47,4.74,7.77,4.44,0.74",
"All systems nominal",
"Shiba Inu intensifies",
"Connected to node #858",
"last analog outputs:8.58,5.85,8.88,5.55,0.85",
"All systems nominal",
"One does not simply walk into Mordor",
"Connected to node #969",
"last analog outputs:9.69,6.96,9.99,6.66,0.96",
"All systems nominal",
"Ermahgerd gersberms",
"Connected to node #131",
"last analog outputs:1.31,3.13,1.11,3.33,0.13",
"All systems nominal",
"Look at me, I'm the captain now",
"Connected to node #242",
"last analog outputs:2.42,4.24,2.22,4.44,0.24",
"All systems nominal",
"I'ma head out",
"Connected to node #353",
"last analog outputs:3.53,5.35,3.33,5.55,0.35",
"All systems nominal",
"Ah shit, here we go again",
"Connected to node #464",
"last analog outputs:4.64,6.46,4.44,6.66,0.46",
"All systems nominal",
"Women yelling at cat",
  ]
};

/* Forum: comments powered by giscus + GitHub Discussions (works on GitHub Pages).
   Fill in the four values from https://giscus.app (type your repo there, then
   copy them from the script it generates). Leave them empty and the page shows
   the setup steps instead. */
const FORUM = {
  repo: "saifkhan2007/test",
  repoId: "R_kgDOQivAAw",
  category: "Announcements",
  categoryId: "DIC_kwDOQivAA84DJee1",
  term: "Forum",    // name of the thread; change it to start a fresh board
  theme: "transparent_dark"
};

/* Photos: visitors attach a photo on GitHub (an Issue in this repo) and it shows up
   here. Remove a photo by closing or deleting its Issue on github.com. */
const PHOTOS = {
  repo: FORUM.repo,   // same repo as the forum; change it to use a different one
  perPage: 24         // how many photos to show before the "Show more" button
};

const SECTIONS = [
  { id: "forum", title: "Forum", blurb: "Leave a post. Text and links both work.", img: "forum.jpg", forum: true },
  { id: "photos", title: "Photos", blurb: "shitpost.Takes a min to update", img: "photos.jpg", photos: true },
  {
    id: "games",
    title: "Games",
    blurb: "Vibe coded. disregard creativity, establish incompetence",
    img: "games.jpg",
    links: [
      { name: "Ludo", url: "Ludo.html", desc: "lmao idk what is this it was made in 3am with like gemini 2.5" },
      { name: "Minecraft 1.8", url: "minecraft1.8.html", desc: "Minecraft 1.8. made by real devs" }  ,
      { name: "Bad Piggies", url: "bad-piggies.html", desc: "vibe codeed game" },
      { name: "Angry Birds Space", url: "angry-birds-space.html", desc: "incompetence at its finest" }
    ]
  },
   {
    id: "Terminal",
    title: "Terminal",
    blurb: "Linix environment in webvm.",
    img: "hacker.jpg",
    links: [
      { name: "Webvm: Linux ", url: "terminal.html", desc: "work in progress. a small local linux environment that fully runs on client side." }
    ]
  },
  {
    id: "tools",
    title: "Tools",
    blurb: "Real reason i made this website.These stuff are hella useful to me.",
    img: "tools.jpg",
    links: [
      { name: "HTML to EPUB", url: "htmltoepub.html", desc: "Turn HTML pages into an EPUB ebook you can read anywhere." }
    ]
  },
  {
    id: "files",
    title: "Everything related to modding android",
    blurb: "Running Linux distros and rooting.",
    img: "files.jpg",
    links: [

      { name: "Xiaomi pad 6 fix for bootloop by partition messup", url: "https://drive.google.com/file/d/1LbX7-Nut8g5t8qD-gPd7-R9KCPDxDq1b/view?usp=sharing", desc: "Use it to recover from a bad qbootctl" }
    ]
  },
  {
    id: "random",
    title: "Random",
    blurb: "Whatever does not fit anywhere else.",
    img: "random.jpg",
    links: [

      { name: "RUDE AI", url: "ai.html", desc: "offensive rude gay ai" }
    ]
  }
];
/* ================== end of the editable part ================== */
