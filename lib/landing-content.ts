export const LANDING_HOSTS = [
  {
    name: "Andy Acton",
    role: "Director",
    image: "/images/hosts/andy-acton.png",
    imageWidth: 400,
    imageHeight: 400,
    bio: "Director at Frank Taylor & Associates. Regular speaker at FTA seminars on practice ownership and the business of dentistry.",
  },
  {
    name: "Chris Strevens",
    role: "Director",
    image: "/images/hosts/chris-strevens.png",
    imageWidth: 400,
    imageHeight: 400,
    bio: "Director at Frank Taylor & Associates. Advises practice owners on sales, acquisitions, and valuations with a seller-first approach.",
  },
] as const;

export const LANDING_VALUE_TABS = [
  {
    id: "sell",
    label: "Selling",
    title: "Plan your exit with clarity",
    body: "Understand timing, valuation drivers, and how to prepare your practice — without pressure from buyers.",
    image: "/images/stock/value-meeting.webp",
    imageWidth: 1000,
    imageHeight: 667,
    alt: "Professional business discussion in a modern office",
  },
  {
    id: "buy",
    label: "Buying",
    title: "Buy with confidence",
    body: "Learn how to assess opportunities, reduce risk, and structure a purchase that works for your career goals.",
    image: "/images/stock/how-webinar.webp",
    imageWidth: 1200,
    imageHeight: 800,
    alt: "Team collaborating during an online presentation",
  },
  {
    id: "value",
    label: "Valuation",
    title: "Know what your practice is worth",
    body: "Practical guidance on what drives value in today's market — NHS, private, and mixed models.",
    image: "/images/stock/trust-dental.webp",
    imageWidth: 1200,
    imageHeight: 800,
    alt: "Modern dental clinic interior",
  },
] as const;

export const LANDING_HOW_IT_WORKS = [
  {
    step: "01",
    title: "Register in seconds",
    body: "Name and email only. No login — return on this device when the session starts.",
  },
  {
    step: "02",
    title: "Join at the scheduled time",
    body: "Enter the live room when the countdown ends. Late joiners start mid-stream, just like a real broadcast.",
  },
  {
    step: "03",
    title: "Watch, learn, act",
    body: "Expert-led sessions with practical takeaways. Follow the CTA when you're ready for the next step with FTA.",
  },
] as const;
