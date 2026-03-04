// seedOffers.js
require('dotenv').config();
const mongoose = require('mongoose');
const FestivalOffer = require('./models/FestivalOffer');
const User = require('./models/User');

const OFFERS = [
  { name: "🎇 Happy New Year 2026!", subtitle: "Start the year with amazing deals — Up to 50% OFF", code: "NEW2026", discount: 50, gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", accent: "#e94560", emoji: ["✨","🎆","🎇","🥂","🎊"], season: "January" },
  { name: "💝 Happy Valentine's Day!", subtitle: "Share the love — Romantic gifts & sweet deals", code: "LOVE25", discount: 25, gradient: "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)", accent: "#fff", emoji: ["💝","💖","🌹","💌","🍫"], season: "February" },
  { name: "🌈 Happy Holi!", subtitle: "Play with colors, shop with joy!", code: "HOLI30", discount: 30, gradient: "linear-gradient(135deg, #ff6b6b 0%, #feca57 30%, #48dbfb 60%, #ff9ff3 100%)", accent: "#1a1a2e", emoji: ["🌈","🎨","💦","🌸","🥳"], season: "March" },
  { name: "🌸 Spring Sale!", subtitle: "Fresh season, fresh deals", code: "SPRING20", discount: 20, gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #fda085 100%)", accent: "#fff", emoji: ["🌸","🌷","🦋","🌼","🌿"], season: "April" },
  { name: "🌙 Eid Mubarak!", subtitle: "Double celebration — Extra special gifts", code: "EID30", discount: 30, gradient: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)", accent: "#ffd700", emoji: ["🌙","⭐","🌹","💐","🎁"], season: "May" },
  { name: "☀️ Summer Mega Sale!", subtitle: "Hot deals for hot days", code: "SUMMER60", discount: 60, gradient: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)", accent: "#1a1a2e", emoji: ["☀️","🏖️","🌊","🍦","🕶️"], season: "June" },
  { name: "🇮🇳 Happy Independence Day!", subtitle: "Celebrate freedom with patriotic deals", code: "INDIA75", discount: 75, gradient: "linear-gradient(135deg, #ff9933 0%, #ffffff 50%, #138808 100%)", accent: "#000080", emoji: ["🇮🇳","🎉","✨","🥳","🎊"], season: "July" },
  { name: "🎀 Happy Raksha Bandhan!", subtitle: "Celebrate bonds — Festive gifts galore", code: "RAKHI25", discount: 25, gradient: "linear-gradient(135deg, #f953c6 0%, #b91d73 100%)", accent: "#ffd700", emoji: ["🎀","💛","🌺","🎁","🥥"], season: "August" },
  { name: "🐘 Happy Ganesh Chaturthi!", subtitle: "Blessings & Big Deals", code: "GANPATI20", discount: 20, gradient: "linear-gradient(135deg, #f7971e 0%, #ffd200 50%, #f7971e 100%)", accent: "#8b0000", emoji: ["🐘","🪔","🌺","🍬","✨"], season: "September" },
  { name: "🎃 Navratri & Halloween Deals!", subtitle: "Garba nights & spooky savings", code: "SPOOKY40", discount: 40, gradient: "linear-gradient(135deg, #eb5757 0%, #000000 100%)", accent: "#ff8c00", emoji: ["🎃","🕷️","🪔","💃","🌙"], season: "October" },
  { name: "🪔 Happy Diwali & Black Friday!", subtitle: "Festival of lights meets biggest sale!", code: "DIWALI50", discount: 50, gradient: "linear-gradient(135deg, #7c3700 0%, #c85000 50%, #ff8c00 100%)", accent: "#ffd700", emoji: ["🪔","✨","🎆","🌟","🪅"], season: "November" },
  { name: "🎄 Merry Christmas!", subtitle: "Season's greetings — Biggest holiday deals", code: "XMAS50", discount: 50, gradient: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #40916c 100%)", accent: "#ff6b6b", emoji: ["🎄","🎅","⭐","🎁","❄️"], season: "December" },
  { name: "🎉 Mega Sale is LIVE!", subtitle: "Shop your favorites — Limited time offers", code: "MEGA40", discount: 40, gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", accent: "#ffd700", emoji: ["🎉","🛍️","💥","🔥","⚡"], season: "All Year" },
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  // Use first seller as createdBy
  const seller = await User.findOne({ role: 'seller' });
  if (!seller) { console.log('No seller found'); mongoose.disconnect(); return; }

  for (const offer of OFFERS) {
    const exists = await FestivalOffer.findOne({ code: offer.code });
    if (!exists) {
      await FestivalOffer.create({ ...offer, createdBy: seller._id });
      console.log(`✅ Created: ${offer.code}`);
    } else {
      console.log(`⏭️  Skipped (exists): ${offer.code}`);
    }
  }

  console.log('Seeding complete!');
  mongoose.disconnect();
});