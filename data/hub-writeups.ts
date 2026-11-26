// Write-ups for the live apps on the Project Hub. Every statement comes from
// the app's own public README (github.com/Knarf24/<repo>). An app on the hub
// without an entry here still gets a page, built from its GitHub description.

export type HubWriteup = {
  category: string;
  // Month the app went live, shown as a chip on its card.
  date: string;
  builtWith: string;
  problem: string;
  overview: string;
  features: string[];
  howItWorks?: string[];
  // GeeksforGeeks Python projects that were combined into this app.
  combines: string[];
  note?: string;
};

export const hubWriteups: Record<string, HubWriteup> = {
  "brain-games-arcade": {
    category: "Python · Games",
    date: "Nov 2026",
    builtWith: "Python (standard library) running in the browser with Pyodide",
    problem:
      "Most free puzzle apps are full of ads, ask you to sign up and need a connection. Families and schools want short, healthy screen time that actually trains thinking.",
    overview:
      "Four classic brain games in one page, free, with no ads and no sign-up. It works on a phone and keeps working offline after the first visit.",
    features: [
      "2048 with one-step undo, Mastermind, Hangman (75 words in 5 topics) and Cows and Bulls",
      "Daily puzzles: everyone gets the same four puzzles each day, with a shareable result",
      "A coach in Mastermind and Cows and Bulls that counts the codes still possible and suggests the most useful guess (Knuth's minimax idea)",
      "Daily streak, wins and best scores, saved only on your device",
    ],
    combines: ["2048 Game", "Mastermind Game", "Hangman Game", "Cows and Bulls game"],
  },
  "brand-monitor": {
    category: "Python · NLP",
    date: "Nov 2026",
    builtWith: "Python and VADER sentiment, in the browser with Pyodide and in a scheduled GitHub Actions job",
    problem:
      "Small businesses rarely know what people say about them online, and checking every news site and forum by hand takes hours.",
    overview:
      "Type a brand, product or name and the app gathers what news sites, Reddit, Hacker News, Bluesky and Mastodon said about it, then scores every mention by mood.",
    features: [
      "Mood score from 0 to 100, with the share of positive, neutral and negative mentions",
      "Mood per source and per day, plus what people praise and complain about",
      "Early warning when complaints rise or mentions suddenly spike",
      "Tracked brands are checked twice a day so the mood can be followed over weeks",
      "Paste your own reviews to score text from sites the app can't read, and download every mention as CSV",
    ],
    combines: ["Twitter Sentiment Analysis", "Scraping Reddit", "Scrape Most Reviewed News"],
    note: "X (Twitter) is not included because its API is paid. Mood scoring is English only.",
  },
  "business-card-scanner": {
    category: "Python · OCR",
    date: "Nov 2026",
    builtWith: "Python (NumPy) in the browser with Pyodide, and Tesseract.js for reading text",
    problem:
      "After a meeting or an expo you come home with a pile of business cards, and typing each one into your phone takes ages.",
    overview:
      "Snap a card or upload a picture. The app reads it and fills in the name, title, company, phone numbers, email, website and address for you to check.",
    features: [
      "Add to phone: download a vCard that opens straight in Contacts on iPhone and Android",
      "Save to a searchable list and export everything as vCard or a CSV spreadsheet",
      "Works with dark cards, coloured cards and photos of a card lying on a table",
      "Nothing is uploaded: pictures and contacts stay on your device",
    ],
    howItWorks: [
      "Clean up the photo: best-contrast channel, dark cards flipped, shadows evened out, card cut from the background",
      "Read the text with Tesseract",
      "Find the details by pattern and keyword: emails, phones (mobile, office, fax), address, title, company and name",
    ],
    combines: ["Visiting Card Scanner GUI", "Text Detection and Extraction using OpenCV and OCR", "Email Id Extractor"],
  },
  "driver-drowsiness-alert": {
    category: "JavaScript · Computer vision",
    date: "Nov 2026",
    builtWith: "JavaScript and MediaPipe Face Landmarker, entirely in the browser",
    problem:
      "Tired drivers cause crashes, and the warning signs (long blinks, a nodding head, yawning) show up before it is too late.",
    overview:
      "A webcam co-pilot that watches for those signs and wakes the driver with a siren and a spoken warning. No install, no server, and no video leaves the device.",
    features: [
      "Face tracking with 478 landmarks from the webcam",
      "Eye closure and blink detection, calibrated to your own eyes in the first 3 seconds",
      "Head drop, tilt and yawn detection, and a warning when you look away from the road",
      "Siren, spoken warning and a flashing screen, plus an alertness score and PERCLOS",
    ],
    combines: ["Face Detection with Webcam", "Eye Blink Detection", "Determine Face Tilt", "Convert Text to Speech"],
    note: "A demo and a safety aid, not a substitute for rest.",
  },
  "face-attendance": {
    category: "Python · Computer vision",
    date: "Nov 2026",
    builtWith: "Python (OpenCV and NumPy) in the browser with Pyodide",
    problem: "Roll call wastes class time and is easy to fake.",
    overview:
      "Snap the classroom: the app counts the faces, recognises each enrolled student and marks the register for the day. A class list can be built from a few group photos.",
    features: [
      "Face detection and headcount with OpenCV's YuNet detector",
      "Recognition with SFace face fingerprints, each student matched at most once per photo",
      "Grouping of unknown faces across photos so names are typed only once",
      "Dated register, attendance rate per student and CSV export",
      "Photos and face data never leave the device",
    ],
    combines: ["Face Detection with Webcam", "Count Number of Faces", "Unsupervised Face Clustering Pipeline", "Simple Attendance Tracker"],
  },
  "gesture-kiosk": {
    category: "Python · Computer vision",
    date: "Nov 2026",
    builtWith: "Python (NumPy) in the browser with Pyodide, and MediaPipe hand landmarks",
    problem:
      "Shared touchscreens in clinics, offices and shops are touched by everyone all day, and they are hard to use with gloves, wet hands or limited grip.",
    overview:
      "A self-service kiosk you control without touching it. Animated demo hands are built in, so it works without a camera.",
    features: [
      "Hold up 1 to 5 fingers for a second to choose, make a fist to go back",
      "Pinch with your other hand to change brightness; two open hands call staff",
      "Hold-to-press, so a hand passing by never presses anything",
      "The menu is a simple JSON file anyone can edit",
    ],
    combines: ["Right and Left Hand Detection", "Finger Counter", "Brightness Control With Hand Detection"],
  },
  "safe-entry-checkpoint": {
    category: "Python · Computer vision",
    date: "Nov 2026",
    builtWith: "Python (OpenCV) in the browser with Pyodide",
    problem:
      "Staff at the door of a clinic, shop or office can't check masks and keep an occupancy count at the same time.",
    overview:
      "A door camera that finds every face, checks each one for a mask, keeps count of how many people are inside and says the result out loud.",
    features: [
      "Face detection with OpenCV's YuNet detector",
      "Mask check with MobileNetV2 and a small classifier trained on about 4,000 photos",
      "Occupancy count, with a button for when someone leaves",
      "Spoken result for every person at the door",
    ],
    combines: ["Face Mask Detection", "Face Detection with Webcam", "Count Number of Faces", "Convert Text to Speech"],
  },
  "security-watch": {
    category: "Python · Computer vision",
    date: "Nov 2026",
    builtWith: "Python (OpenCV and NumPy) in a background thread in the browser with Pyodide",
    problem: "Small shops can't watch CCTV all day.",
    overview:
      "Point a camera at the room. The app notices movement, spots people while the shop is closed and knives or bats at any time, records the clip and pings your phone on Telegram.",
    features: [
      "Background subtraction (MOG2) so detection only runs when something moves",
      "People, knife and bat detection with NanoDet-Plus",
      "Alarm rules: always, only outside opening hours, or off",
      "Clip recording and a Telegram alert with a snapshot and the clip",
      "Video is analysed on the device and never uploaded",
    ],
    combines: ["Background subtraction", "Pedestrian Detection", "Gun Detection", "Saving Operated Video from a Webcam", "Send Message to Telegram User"],
    note: "The detector is trained on everyday objects that include knives and baseball bats but not guns.",
  },
  "smart-crosswalk-monitor": {
    category: "JavaScript · Computer vision",
    date: "Nov 2026",
    builtWith: "JavaScript, MediaPipe Object Detector and Tesseract.js, entirely in the browser",
    problem:
      "Pedestrians are hit at busy crossings, and nobody has data on how often drivers fail to stop.",
    overview:
      "Upload traffic footage, mark the crosswalk, and get a report of every vehicle that did not stop for a pedestrian, with a snapshot of each one.",
    features: [
      "Pedestrian and vehicle detection and tracking, so each is counted once",
      "Draw your own crosswalk on any video",
      "Did-not-yield, yielded and passed-clear rules, with an evidence log",
      "Number plate reading you can correct, a yield rate and a CSV report",
    ],
    combines: ["Pedestrian Detection", "Vehicle Detection in a Video frame", "Detect and Recognize Car License Plate", "Background subtraction", "Extract Frames"],
    note: "A data-gathering tool: detections can be wrong, so its output should not be used on its own to accuse anyone.",
  },
  "voice-helper": {
    category: "Python · Speech",
    date: "Nov 2026",
    builtWith: "Python in the browser with Pyodide, and the browser's Web Speech API",
    problem:
      "Many people can't easily type, read small print or search in English, and most voice assistants only work well in a few big languages.",
    overview:
      "Ask a question out loud in your own language (isiZulu, isiXhosa, Afrikaans, Sesotho, Swahili, Shona, French, Portuguese and more) and hear the answer in that language.",
    features: [
      "Facts from Wikipedia and weather with an umbrella tip",
      "Sums said in words, worked out with a safe calculator",
      "Translations, time and date, and switching language by voice",
      "No API keys and nothing saved",
    ],
    combines: ["Speech Recognition using Google Speech API", "Voice Search Wikipedia", "Language Translator using Google API", "Text To Speech with pyttsx3"],
  },
  "weather-brief": {
    category: "Python · Data",
    date: "Nov 2026",
    builtWith: "Python in the browser with Pyodide, and a daily GitHub Actions job",
    problem: "Weather apps show a wall of numbers when you only need a few answers before leaving home.",
    overview:
      "A short brief for your city: umbrella or not, what to wear, how clean the air is and the best time to be outside, sent every morning on Telegram or WhatsApp if you want.",
    features: [
      "Rain window, e.g. when the chance of rain peaks today",
      "Air Quality Index worked out in Python from forecast pollutant levels",
      "Warnings for strong sun, wind and heat, and a one-line look at tomorrow",
      "Free daily message on Telegram or WhatsApp through GitHub Actions",
    ],
    combines: ["Scraping Weather Data for an Umbrella Reminder", "Predicting Air Quality Index", "Automate WhatsApp Messages"],
  },
};
