import React, { useState, useEffect, useMemo } from "react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from "recharts";
import {
  Heart, TrendingUp, Users, Wallet, Sparkle,
  MapPin, Check, ArrowRight, ArrowLeft, Languages, RotateCcw,
  X, Compass, GraduationCap, MoveRight, Sparkles, TrendingDown,
  Linkedin, Instagram, Youtube, Send,
} from "lucide-react";

// Bilingual pairs are [uz, en]. Five tracks, each a 4-rung maturity ladder.
// `needs` = the skills / self-study a step requires.
const TRACKS = [
  {
    id: "health", icon: Heart, hue: "#F2776B", name: ["Quvvat", "Vitality"], short: ["Quvvat", "Vitality"], tagline: ["Salomatlik & energiya", "Health & energy"],
    stages: [
      { name: ["Sog'lom asoslar", "Healthy foundations"],
        choice: ["Sog'liqning asoslariga e'tibor qarata boshladim (uyqu, suv)", "I'm starting with the basics of health (sleep, water)"],
        what: ["Tana va ruhning poydevori: uyqu, suv, ovqat.", "The foundation of body and mind: sleep, water, food."],
        needs: ["Oddiy intizom va uyqu gigiyenasi. O'z-o'rganish: uyqu, suv va dam olish asoslari.", "Basic discipline and sleep hygiene. Self-study: the basics of sleep, hydration and recovery."] },
      { name: ["Barqaror odatlar", "Steady habits"],
        choice: ["Sog'lom odatlarim muntazam (ovqat, tartib)", "My healthy habits are consistent (food, routine)"],
        what: ["Har kuni takrorlanadigan sog'lom tanlovlar.", "Healthy choices repeated every day."],
        needs: ["Odat shakllantirish va ovqatlanish asoslari. O'z-o'rganish: sog'lom ovqatlanish va kun tartibi.", "Habit formation and nutrition basics. Self-study: healthy eating and daily routines."] },
      { name: ["Jismoniy chiniqish", "Physical conditioning"],
        choice: ["Muntazam mashq qilaman, jismonan faolman", "I train regularly and stay physically active"],
        what: ["Tanani ataylab kuchaytirish va chiniqtirish.", "Deliberately building and conditioning your body."],
        needs: ["Mashq texnikasi va tana mexanikasi bilimi. O'z-o'rganish: kuch va kardio asoslari.", "Training technique and body mechanics. Self-study: strength and cardio fundamentals."] },
      { name: ["To'liq quvvat", "Full vitality"],
        choice: ["Kun bo'yi yuqori energiya va formani saqlayman", "I keep high energy and form all day"],
        what: ["Salomatlik — hayot uslubingizning tabiiy qismi.", "Health as a natural part of your lifestyle."],
        needs: ["Tiklanish va stressni boshqarish ko'nikmasi. O'z-o'rganish: uyqu optimizatsiyasi va energiya boshqaruvi.", "Recovery and stress management. Self-study: sleep optimization and energy management."] },
    ],
  },
  {
    id: "growth", icon: TrendingUp, hue: "#7CA8F2", name: ["Kamolot", "Mastery"], short: ["Kamolot", "Mastery"], tagline: ["O'sish & mahorat", "Growth & skill"],
    stages: [
      { name: ["O'zni anglash", "Self-awareness"],
        choice: ["O'zimni — kuchli va kuchsiz tomonlarimni anglayapman", "I'm learning who I am — my strengths and weaknesses"],
        what: ["O'z qadriyat, kuch va chegaralaringizni bilish.", "Knowing your values, strengths and limits."],
        needs: ["O'z-o'zini tahlil va hissiy xabardorlik. O'z-o'rganish: kundalik va shaxsiyat testlari.", "Self-reflection and emotional awareness. Self-study: journaling and personality assessments."] },
      { name: ["Bilim & ko'nikma", "Knowledge & skills"],
        choice: ["Muntazam o'rganaman va yangi ko'nikma egallayman", "I learn regularly and pick up new skills"],
        what: ["Bilim, odat va ko'nikmalarni ongli o'stirish.", "Deliberately growing knowledge, habits and skills."],
        needs: ["O'rganish odati va maqsad qo'yish. O'z-o'rganish: kitobxonlik, vaqtni boshqarish, odatlar.", "A learning habit and goal-setting. Self-study: reading, time management, habits."] },
      { name: ["Kasbiy mahorat", "Professional mastery"],
        choice: ["Kasbim bo'yicha chuqur mahoratga erishyapman", "I'm building deep mastery in my profession"],
        what: ["Ish sohangizda yuqori malaka va qiymat.", "High skill and value in your field."],
        needs: ["Sohaviy chuqur bilim va maqsadli amaliyot. O'z-o'rganish: kurslar, mentorlik, portfolio.", "Deep expertise and deliberate practice. Self-study: courses, mentorship, a portfolio."] },
      { name: ["Donolik & yetuklik", "Wisdom & maturity"],
        choice: ["Ichki barqarorlik, donolik va ma'noga e'tibor beraman", "I focus on inner stability, wisdom and meaning"],
        what: ["Xarakter, qadriyat va donolikning yetukligi.", "Maturity of character, values and wisdom."],
        needs: ["Mulohaza va qadriyatlarni anglash. O'z-o'rganish: falsafa, biografiyalar, ma'naviy adabiyot.", "Reflection and clarity of values. Self-study: philosophy, biographies, reflective reading."] },
    ],
  },
  {
    id: "finance", icon: Wallet, hue: "#46C8A0", name: ["Erkinlik", "Freedom"], short: ["Erkinlik", "Freedom"], tagline: ["Moliya & boylik", "Money & wealth"],
    stages: [
      { name: ["Moliyaviy savodxonlik", "Financial literacy"],
        choice: ["Pulni nazorat qilaman (byudjet, jamg'arma)", "I control my money (budget, savings)"],
        what: ["Pulni boshqarish: byudjet, jamg'arma, qarz nazorati.", "Managing money: budget, savings, debt control."],
        needs: ["Byudjet va moliyaviy savodxonlik. O'z-o'rganish: shaxsiy moliya asoslari va jamg'arma.", "Budgeting and financial literacy. Self-study: personal finance and saving."] },
      { name: ["Barqaror daromad", "Stable income"],
        choice: ["Barqaror daromadim bor va uni oshirayapman", "I have stable income and I'm growing it"],
        what: ["Ishonchli, o'sib boruvchi daromad manbai.", "A reliable, growing source of income."],
        needs: ["Ko'nikmani daromadga aylantirish. O'z-o'rganish: bozor qiymati, malaka, muzokara.", "Turning skills into income. Self-study: market value, upskilling, negotiation."] },
      { name: ["Biznes", "Business"],
        choice: ["O'z biznesim yoki qo'shimcha loyiham bor", "I run a business or side venture"],
        what: ["Qiymat yaratib, vaqtdan ozod daromad olish.", "Earning by creating value, beyond hourly work."],
        needs: ["Tadbirkorlik, sotuv va boshqaruv. O'z-o'rganish: biznes modeli, marketing, mijozlar.", "Entrepreneurship, sales and management. Self-study: business models, marketing, customers."] },
      { name: ["Investitsiya & boylik", "Investment & wealth"],
        choice: ["Investitsiya qilaman — pul men uchun ishlaydi", "I invest — my money works for me"],
        what: ["Pulni o'stiruvchi aktivlarga joylash va boylik qurish.", "Putting money into growing assets and building wealth."],
        needs: ["Investitsiya bilimi va xavfni boshqarish. O'z-o'rganish: aktivlar, diversifikatsiya, murakkab foiz.", "Investing knowledge and risk management. Self-study: asset classes, diversification, compounding."] },
    ],
  },
  {
    id: "relations", icon: Users, hue: "#A98DF1", name: ["Davra", "Circle"], short: ["Davra", "Circle"], tagline: ["Munosabat & ta'sir", "Bonds & influence"],
    stages: [
      { name: ["Oila", "Family"],
        choice: ["Asosan oilamga vaqt va e'tibor beraman", "I focus my time and care on family"],
        what: ["Eng yaqin doirangiz — oila.", "Your closest circle — family."],
        needs: ["Muloqot va empatiya ko'nikmasi. O'z-o'rganish: faol tinglash va oilaviy munosabatlar.", "Communication and empathy. Self-study: active listening and family relationships."] },
      { name: ["Do'stlik", "Friendship"],
        choice: ["Yaxshi do'stlarim bor va aloqani saqlayman", "I have good friends and keep those bonds"],
        what: ["Oiladan tashqari samimiy do'stlik.", "Genuine friendship beyond family."],
        needs: ["Ijtimoiy ko'nikma va ishonchlilik. O'z-o'rganish: do'stlik qurish va muloqot.", "Social skills and reliability. Self-study: building friendships and conversation."] },
      { name: ["Ishonchli doira", "Trusted circle"],
        choice: ["Chuqur ishonadigan yaqin insonlarim bor", "I have a few people I deeply trust"],
        what: ["Siz tanlagan, chin dildan ishonadigan doira.", "A chosen circle you truly trust."],
        needs: ["Chuqur ishonch va nizolarni hal qilish. O'z-o'rganish: hissiy yaqinlik va ochiq muloqot.", "Deep trust and conflict resolution. Self-study: emotional intimacy and honest communication."] },
      { name: ["Tarmoq & ta'sir", "Network & influence"],
        choice: ["Keng tarmog'im bor va boshqalarga ta'sir o'tkazaman", "I have a wide network and influence others"],
        what: ["Shaxsiy doiradan tashqari keng aloqa va ta'sir.", "Wide connections and influence beyond your personal circle."],
        needs: ["Tarmoq qurish, ko'rinarlilik va yetakchilik. O'z-o'rganish: networking, shaxsiy brend, ommaviy nutq.", "Network-building, visibility and leadership. Self-study: networking, personal branding, public speaking."] },
    ],
  },
  {
    id: "meaning", icon: Sparkle, hue: "#E889B8", name: ["Ma'no", "Meaning"], short: ["Ma'no", "Meaning"], tagline: ["Zavq, ijod & hissa", "Joy, creativity & contribution"],
    stages: [
      { name: ["Dam & tiklanish", "Rest & recovery"],
        choice: ["O'zimga dam olish va tiklanishga vaqt ajrataman", "I make time to rest and recover"],
        what: ["Quvvatni tiklash va muvozanat saqlash.", "Recovering energy and keeping balance."],
        needs: ["Chegaralar va dam olish intizomi. O'z-o'rganish: tiklanish, ekran detoksi, uyqu.", "Boundaries and rest discipline. Self-study: recovery, screen detox, sleep."] },
      { name: ["Sevimli mashg'ulot", "Passion"],
        choice: ["Meni quvontiradigan sevimli mashg'ulotim bor", "I have a hobby that brings me joy"],
        what: ["Faqat zavq uchun qilinadigan ish.", "Something done purely for joy."],
        needs: ["Qiziqish va vaqt ajratish. O'z-o'rganish: yangi mashg'ulot yoki hunar asoslari.", "Curiosity and time-blocking. Self-study: the basics of a new hobby or craft."] },
      { name: ["Ijod & tajriba", "Creativity & experiences"],
        choice: ["Yangi narsa yarataman yoki tajriba qidiraman", "I create or seek out new experiences"],
        what: ["Yaratish, sayohat va yangi tajribalar orqali o'sish.", "Growing through creating, travel and new experiences."],
        needs: ["Ijodkorlik va yangilikka ochiqlik. O'z-o'rganish: ijodiy ko'nikmalar, sayohat, san'at.", "Creativity and openness. Self-study: creative skills, travel, the arts."] },
      { name: ["Hissa & meros", "Contribution & legacy"],
        choice: ["Jamiyatga hissa qo'shaman, ortimdan iz qoldiraman", "I give back and build something lasting"],
        what: ["O'zingizdan tashqari, abadiy qiymatga hissa.", "Contributing to something lasting, beyond yourself."],
        needs: ["Empatiya va tashkilotchilik. O'z-o'rganish: ko'ngillilik, ijtimoiy loyihalar, meros.", "Empathy and organizing. Self-study: volunteering, social projects, legacy."] },
    ],
  },
];

const UI = {
  kicker: ["HAYOT XARITASI", "LIFE MAP"],
  title: ["Qayerdasiz?", "Where are you?"],
  introLead: ["Besh yo'nalish bo'yicha bir nechta savol — joriy o'rningizni aniqlaymiz, muvozanatingizni ko'rsatamiz va keyingi qadamni beramiz.",
              "A few questions across five tracks place you, reveal your balance, and point to your next step."],
  start: ["Sayohatni boshlash", "Begin the journey"],
  of: ["/", "of"],
  back: ["Orqaga", "Back"],
  next: ["Keyingi", "Next"],
  seeMap: ["Xaritani ochish", "Reveal my map"],
  pickHint: ["Sizga eng mosini tanlang:", "Pick the one that fits you best:"],
  youAreHere: ["Shu yerdasiz", "You are here"],
  nextLabel: ["Keyingi", "Next"],
  tapHint: ["Kerakli ko'nikmalarni ko'rish uchun bekatni bosing", "Tap a stop to see the skills it needs"],
  nextSteps: ["Keyingi qadamlaringiz", "Your next steps"],
  mastered: ["Yakunlandi", "Mastered"],
  retake: ["Qayta", "Retake"],
  whatIs: ["Bu nima", "What it is"],
  needs: ["Bu bosqich uchun kerak", "What this step needs"],
  done: ["Bajarilgan", "Done"],
  current: ["Joriy", "Current"],
  upcoming: ["Oldinda", "Upcoming"],
  balance: ["Hayot muvozanati", "Life balance"],
  strongest: ["Eng kuchli", "Strongest"],
  focusArea: ["E'tibor talab qiladi", "Needs focus"],
  overall: ["Umumiy yo'l bosib o'tilgan", "Overall journey traveled"],
  fbTitle: ["Fikringiz bormi?", "Have feedback?"],
  fbLead: ["Taklif yoki fikringizni qoldiring — faqat menga yetib boradi.", "Leave a suggestion or comment — it goes straight to me."],
  fbPlaceholder: ["Fikringizni yozing...", "Write your feedback..."],
  fbContact: ["Email yoki Telegram (ixtiyoriy)", "Email or Telegram (optional)"],
  fbSend: ["Yuborish", "Send"],
  fbSending: ["Yuborilmoqda...", "Sending..."],
  fbThanks: ["Rahmat! Fikringiz yuborildi.", "Thank you! Your feedback was sent."],
  fbThanksSub: ["Vaqt ajratganingiz uchun minnatdorman.", "I appreciate you taking the time."],
  fbError: ["Xatolik yuz berdi. Qayta urinib ko'ring.", "Something went wrong. Please try again."],
  madeBy: ["Muallif", "Made by"],
};

// Web3Forms access key — PUBLIC by design, safe to commit. Submissions are emailed to
// the address you registered. Get a free key in ~30s at https://web3forms.com
// (enter the email where you want feedback delivered), then paste it below.
const WEB3FORMS_KEY = "9ba751f2-84ca-4924-919e-08ee3614eb07";

// Nautical-chart palette
const C = {
  bg: "#0A1218", panel: "#0F1C24", panelHi: "#14262F", line: "#1E3540",
  current: "#E7B24C", next: "#46D2C0", done: "#5A7A82", text: "#E9F1F2", dim: "#82999F",
};

export default function App() {
  const [lang, setLang] = useState("uz");
  const [screen, setScreen] = useState("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [openNode, setOpenNode] = useState(null);

  const L = (pair) => (pair ? pair[lang === "uz" ? 0 : 1] : "");

  const stats = useMemo(() => {
    const per = TRACKS.map((tr) => {
      const cur = answers[tr.id] ?? 0;
      const max = tr.stages.length - 1;
      return { tr, cur, max, pct: Math.round((cur / max) * 100) };
    });
    const totalDone = per.reduce((s, p) => s + p.cur, 0);
    const totalMax = per.reduce((s, p) => s + p.max, 0);
    const overall = Math.round((totalDone / totalMax) * 100);
    const sorted = [...per].sort((a, b) => b.pct - a.pct);
    return { per, overall, strongest: sorted[0], focus: sorted[sorted.length - 1] };
  }, [answers]);

  const choose = (trackId, i) => setAnswers((a) => ({ ...a, [trackId]: i }));
  const restart = () => { setAnswers({}); setStep(0); setScreen("intro"); };

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", position: "relative", overflow: "hidden" }} className="rm-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Space+Mono:wght@400;700&family=Inter:wght@400;500;600&display=swap');
        .rm-root { font-family:'Inter',system-ui,sans-serif }
        .rm-display { font-family:'Space Grotesk',sans-serif; letter-spacing:-0.02em }
        .rm-mono { font-family:'Space Mono',monospace }
        @keyframes rm-ping { 0%{transform:scale(1);opacity:.55} 70%,100%{transform:scale(2.1);opacity:0} }
        @keyframes rm-rise { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rm-bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
        @keyframes rm-sheet { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rm-spin { to{transform:rotate(360deg)} }
        .rm-rise{ animation:rm-rise .5s ease both } .rm-pin{ animation:rm-bob 2.4s ease-in-out infinite }
        .rm-lane::-webkit-scrollbar{height:6px} .rm-lane::-webkit-scrollbar-thumb{background:${C.line};border-radius:99px}
        .rm-btn{transition:transform .15s ease,background .15s ease,border-color .15s ease} .rm-btn:hover{transform:translateY(-1px)}
        .rm-opt{transition:border-color .15s ease,background .15s ease,transform .15s ease} .rm-opt:hover{transform:translateY(-1px);border-color:${C.dim}}
        .rm-node{transition:transform .15s ease} .rm-node:hover{transform:translateY(-2px)}
        .rm-soc{transition:color .15s ease,border-color .15s ease,transform .15s ease;color:${C.dim}} .rm-soc:hover{color:${C.current};border-color:${C.current};transform:translateY(-2px)}
        :focus-visible{outline:2px solid ${C.next};outline-offset:2px}
        @media (prefers-reduced-motion:reduce){ .rm-rise,.rm-pin,.rm-sheet{animation:none!important} }
      `}</style>

      <Contours />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 940, margin: "0 auto", padding: "26px 18px 60px" }}>
        <TopBar L={L} lang={lang} setLang={setLang} screen={screen} onRestart={restart} />

        {screen === "intro" && <Intro L={L} onStart={() => { setScreen("quiz"); setStep(0); }} />}

        {screen === "quiz" && (
          <Quiz L={L} step={step} answers={answers} onChoose={choose}
            onBack={() => (step === 0 ? setScreen("intro") : setStep(step - 1))}
            onNext={() => (step === TRACKS.length - 1 ? setScreen("result") : setStep(step + 1))} />
        )}

        {screen === "result" && <Result L={L} answers={answers} stats={stats} onOpen={setOpenNode} />}

        <Feedback L={L} />
        <Footer L={L} />
      </div>

      {openNode && <NodeSheet L={L} node={openNode} answers={answers} onClose={() => setOpenNode(null)} />}
    </div>
  );
}

function Contours() {
  return (
    <svg width="100%" height="100%" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.5 }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="rmglow" cx="50%" cy="0%" r="80%">
          <stop offset="0%" stopColor="#16323C" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#0A1218" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#rmglow)" />
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse key={i} cx="80%" cy="22%" rx={90 + i * 70} ry={60 + i * 46} fill="none" stroke="#1A2E37" strokeWidth="1" />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <ellipse key={"b" + i} cx="8%" cy="92%" rx={70 + i * 80} ry={50 + i * 52} fill="none" stroke="#16282F" strokeWidth="1" />
      ))}
    </svg>
  );
}

function CompassRose({ size = 30, color = "#E7B24C" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" stroke={color} strokeOpacity="0.4" strokeWidth="1.2" />
      <path d="M20 3 L23 20 L20 37 L17 20 Z" fill={color} fillOpacity="0.9" />
      <path d="M3 20 L20 17 L37 20 L20 23 Z" fill={color} fillOpacity="0.35" />
      <circle cx="20" cy="20" r="2" fill={color} />
    </svg>
  );
}

function TopBar({ L, lang, setLang, screen, onRestart }) {
  return (
    <header className="rm-rise" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, marginBottom: 22 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
        <CompassRose />
        <div>
          <div className="rm-mono" style={{ color: C.current, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.22em" }}>{L(UI.kicker)}</div>
          <h1 className="rm-display" style={{ fontSize: "clamp(22px,5.5vw,30px)", fontWeight: 700, margin: "2px 0 0", lineHeight: 1 }}>{L(UI.title)}</h1>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={() => setLang(lang === "uz" ? "en" : "uz")} className="rm-btn" style={btn(C)}>
          <Languages size={14} /> {lang === "uz" ? "EN" : "UZ"}
        </button>
        {screen !== "intro" && (
          <button onClick={onRestart} className="rm-btn" style={btn(C)}><RotateCcw size={14} /> {L(UI.retake)}</button>
        )}
      </div>
    </header>
  );
}

function Intro({ L, onStart }) {
  return (
    <div className="rm-rise" style={{ position: "relative", background: C.panel, border: `1px solid ${C.line}`, borderRadius: 22, padding: "40px 24px 34px", textAlign: "center", overflow: "hidden" }}>
      <div style={{ display: "grid", placeItems: "center", marginBottom: 20 }}>
        <div style={{ animation: "rm-spin 40s linear infinite" }}><CompassRose size={66} /></div>
      </div>
      <p style={{ color: C.text, fontSize: 17, lineHeight: 1.55, maxWidth: 500, margin: "0 auto 26px" }}>{L(UI.introLead)}</p>
      <button onClick={onStart} className="rm-btn" style={{ ...btn(C), background: C.current, color: C.bg, borderColor: C.current, fontSize: 14.5, fontWeight: 700, padding: "12px 24px" }}>
        {L(UI.start)} <ArrowRight size={16} />
      </button>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 26, flexWrap: "wrap" }}>
        {TRACKS.map((tr) => {
          const Icon = tr.icon;
          return (
            <span key={tr.id} className="rm-mono" style={{ display: "inline-flex", alignItems: "center", gap: 5, color: C.dim, fontSize: 11.5 }}>
              <Icon size={13} color={tr.hue} /> {L(tr.short)}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function Quiz({ L, step, answers, onChoose, onBack, onNext }) {
  const tr = TRACKS[step];
  const Icon = tr.icon;
  const picked = answers[tr.id];
  const pct = Math.round(((step + 1) / TRACKS.length) * 100);
  return (
    <div className="rm-rise" key={tr.id}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <div style={{ flex: 1, height: 5, background: C.panelHi, borderRadius: 99, overflow: "hidden", position: "relative" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: C.current, borderRadius: 99, transition: "width .35s ease" }} />
        </div>
        <span className="rm-mono" style={{ color: C.dim, fontSize: 12, whiteSpace: "nowrap" }}>{String(step + 1).padStart(2, "0")} {L(UI.of)} {String(TRACKS.length).padStart(2, "0")}</span>
      </div>

      <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 20, padding: "22px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <span style={{ width: 42, height: 42, borderRadius: 12, background: C.panelHi, display: "grid", placeItems: "center" }}><Icon size={20} color={tr.hue} /></span>
          <div>
            <h2 className="rm-display" style={{ fontSize: 23, fontWeight: 700, margin: 0 }}>{L(tr.name)}</h2>
            <div className="rm-mono" style={{ fontSize: 10, color: C.dim, letterSpacing: "0.04em", marginTop: 2 }}>{L(tr.tagline)}</div>
          </div>
        </div>
        <p style={{ color: C.dim, fontSize: 13.5, margin: "8px 0 16px" }}>{L(UI.pickHint)}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {tr.stages.map((st, i) => {
            const on = picked === i;
            return (
              <button key={i} className="rm-opt" onClick={() => onChoose(tr.id, i)}
                style={{ textAlign: "left", display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
                  background: on ? C.panelHi : C.bg, border: `1.5px solid ${on ? C.current : C.line}`, borderRadius: 13, padding: "13px 14px", color: C.text, fontFamily: "inherit" }}>
                <span style={{ width: 22, height: 22, borderRadius: 99, flexShrink: 0, display: "grid", placeItems: "center", border: `2px solid ${on ? C.current : C.dim}`, background: on ? C.current : "transparent" }}>
                  {on && <Check size={13} color={C.bg} strokeWidth={3.5} />}
                </span>
                <span style={{ fontSize: 14.5, fontWeight: on ? 600 : 500, lineHeight: 1.35 }}>{L(st.choice)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
        <button onClick={onBack} className="rm-btn" style={btn(C)}><ArrowLeft size={14} /> {L(UI.back)}</button>
        <button onClick={onNext} disabled={picked === undefined} className="rm-btn"
          style={{ ...btn(C), background: picked === undefined ? C.panelHi : C.current, color: picked === undefined ? C.dim : C.bg, borderColor: picked === undefined ? C.line : C.current, cursor: picked === undefined ? "not-allowed" : "pointer", fontSize: 13.5, fontWeight: 700, padding: "9px 18px" }}>
          {step === TRACKS.length - 1 ? L(UI.seeMap) : L(UI.next)} <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

function Result({ L, answers, stats, onOpen }) {
  const radarData = stats.per.map((p) => ({ area: L(p.tr.short), value: p.pct }));
  return (
    <div className="rm-rise">
      <div className="rm-hero" style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 20, padding: 18, marginBottom: 18, display: "grid", gridTemplateColumns: "minmax(220px, 1fr) minmax(200px, 1fr)", gap: 14, alignItems: "center" }}>
        <div style={{ height: 250, minWidth: 0 }}>
          <div className="rm-mono" style={{ color: C.dim, fontSize: 10.5, letterSpacing: "0.18em", marginBottom: 2 }}>{L(UI.balance).toUpperCase()}</div>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} outerRadius="74%">
              <PolarGrid stroke={C.line} />
              <PolarAngleAxis dataKey="area" tick={{ fill: C.dim, fontSize: 11, fontFamily: "Space Mono, monospace" }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar dataKey="value" stroke={C.current} fill={C.current} fillOpacity={0.32} strokeWidth={2} dot />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span className="rm-display" style={{ fontSize: 44, fontWeight: 700, color: C.current, lineHeight: 1 }}>{stats.overall}%</span>
            <span style={{ color: C.dim, fontSize: 12.5 }}>{L(UI.overall)}</span>
          </div>
          <InsightChip L={L} kind="up" item={stats.strongest} />
          <InsightChip L={L} kind="down" item={stats.focus} />
        </div>
      </div>

      <p style={{ color: C.dim, fontSize: 12.5, margin: "0 0 14px", display: "flex", alignItems: "center", gap: 6 }}>
        <Sparkles size={13} color={C.next} /> {L(UI.tapHint)}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {TRACKS.map((tr, idx) => <Lane key={tr.id} tr={tr} cur={answers[tr.id] ?? 0} L={L} onOpen={onOpen} delay={idx * 0.05} />)}
      </div>

      <section style={{ marginTop: 28 }}>
        <h2 className="rm-display" style={{ fontSize: 21, fontWeight: 700, margin: "0 0 13px", display: "flex", alignItems: "center", gap: 8 }}>
          <ArrowRight size={19} color={C.next} /> {L(UI.nextSteps)}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(248px, 1fr))", gap: 10 }}>
          {TRACKS.map((tr) => {
            const cur = answers[tr.id] ?? 0;
            const atEnd = cur >= tr.stages.length - 1;
            const Icon = tr.icon;
            const nextStage = atEnd ? null : tr.stages[cur + 1];
            return (
              <button key={tr.id} className="rm-opt" onClick={() => onOpen({ trackId: tr.id, stageIndex: Math.min(cur + 1, tr.stages.length - 1) })}
                style={{ textAlign: "left", cursor: "pointer", background: C.panel, border: `1px solid ${C.line}`, borderRadius: 14, padding: "13px 15px", color: C.text, fontFamily: "inherit" }}>
                <div className="rm-mono" style={{ display: "flex", alignItems: "center", gap: 8, color: C.dim, fontSize: 10.5, letterSpacing: "0.04em" }}>
                  <Icon size={14} color={tr.hue} /> {L(tr.name).toUpperCase()}
                </div>
                {atEnd ? (
                  <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 7, color: C.next, fontWeight: 600, fontSize: 15 }}><Check size={16} /> {L(UI.mastered)}</div>
                ) : (
                  <>
                    <div style={{ marginTop: 7, fontSize: 15, fontWeight: 600, color: C.next, display: "flex", alignItems: "center", gap: 6 }}>{L(nextStage.name)} <MoveRight size={14} /></div>
                    <div style={{ marginTop: 8, display: "flex", gap: 7, color: C.dim }}>
                      <GraduationCap size={13} style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: 12.5, lineHeight: 1.45 }}>{L(nextStage.needs)}</span>
                    </div>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <style>{`@media (max-width:560px){ .rm-hero{ grid-template-columns:1fr !important } }`}</style>
    </div>
  );
}

function InsightChip({ L, kind, item }) {
  const up = kind === "up";
  const Icon = up ? TrendingUp : TrendingDown;
  const color = up ? C.next : C.current;
  return (
    <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ width: 30, height: 30, borderRadius: 9, background: `${color}1c`, display: "grid", placeItems: "center", flexShrink: 0 }}>
        <Icon size={15} color={color} />
      </span>
      <div>
        <div className="rm-mono" style={{ fontSize: 10, color: C.dim, letterSpacing: "0.1em" }}>{(up ? L(UI.strongest) : L(UI.focusArea)).toUpperCase()}</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{L(item.tr.name)}</div>
      </div>
    </div>
  );
}

function Lane({ tr, cur, L, onOpen, delay }) {
  const Icon = tr.icon;
  return (
    <div className="rm-rise" style={{ animationDelay: `${delay}s`, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 18, padding: "16px 16px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6 }}>
        <span style={{ width: 30, height: 30, borderRadius: 9, background: C.panelHi, display: "grid", placeItems: "center", flexShrink: 0 }}><Icon size={16} color={tr.hue} /></span>
        <div style={{ lineHeight: 1.1 }}>
          <span className="rm-display" style={{ fontSize: 16.5, fontWeight: 700 }}>{L(tr.name)}</span>
          <div className="rm-mono" style={{ fontSize: 9.5, color: C.dim, letterSpacing: "0.04em", marginTop: 2 }}>{L(tr.tagline)}</div>
        </div>
      </div>
      <div className="rm-lane" style={{ overflowX: "auto", paddingTop: 26, paddingBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "flex-start", minWidth: "min-content" }}>
          {tr.stages.map((st, i) => {
            const state = i < cur ? "done" : i === cur ? "current" : i === cur + 1 ? "next" : "future";
            return (
              <React.Fragment key={i}>
                {i > 0 && <Connector traveled={i <= cur} next={i === cur + 1} />}
                <Node st={st} state={state} L={L} onClick={() => onOpen({ trackId: tr.id, stageIndex: i })} />
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Node({ st, state, L, onClick }) {
  const m = {
    done: { ring: C.done, fill: C.done, glow: "none", label: C.dim },
    current: { ring: C.current, fill: C.current, glow: `0 0 0 4px rgba(231,178,76,.16)`, label: C.text },
    next: { ring: C.next, fill: "transparent", glow: `0 0 0 4px rgba(70,210,192,.14)`, label: C.text },
    future: { ring: C.line, fill: "transparent", glow: "none", label: C.dim },
  }[state];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 96, flexShrink: 0, position: "relative" }}>
      {state === "current" && (
        <div className="rm-pin" style={{ position: "absolute", top: -26, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span className="rm-mono" style={{ fontSize: 9, fontWeight: 700, color: C.current, whiteSpace: "nowrap", marginBottom: 1, letterSpacing: "0.03em" }}>{L(UI.youAreHere)}</span>
          <MapPin size={16} color={C.current} fill={C.current} />
        </div>
      )}
      <button onClick={onClick} className="rm-node" aria-label={L(st.name)}
        style={{ width: 26, height: 26, borderRadius: 99, cursor: "pointer", padding: 0, position: "relative", border: `2.5px solid ${m.ring}`, background: m.fill, boxShadow: m.glow, display: "grid", placeItems: "center" }}>
        {state === "current" && <span style={{ position: "absolute", inset: -2, borderRadius: 99, border: `2px solid ${C.current}`, animation: "rm-ping 2s ease-out infinite" }} />}
        {state === "done" && <Check size={13} color={C.bg} strokeWidth={3.5} />}
      </button>
      <span style={{ marginTop: 9, fontSize: 11.5, lineHeight: 1.25, textAlign: "center", color: m.label, fontWeight: state === "current" || state === "next" ? 600 : 500, maxWidth: 90 }}>{L(st.name)}</span>
      {state === "next" && <span className="rm-mono" style={{ marginTop: 4, fontSize: 9, fontWeight: 700, color: C.next, letterSpacing: "0.06em" }}>{L(UI.nextLabel).toUpperCase()}</span>}
    </div>
  );
}

function Connector({ traveled, next }) {
  return (
    <div style={{ flexShrink: 0, width: 34, height: 26, display: "flex", alignItems: "center" }}>
      <div style={{ width: "100%", height: 0, borderTop: traveled ? `2.5px solid ${C.current}` : next ? `2.5px dashed ${C.next}` : `2px solid ${C.line}`, opacity: traveled ? 0.85 : next ? 0.9 : 1 }} />
    </div>
  );
}

function NodeSheet({ L, node, answers, onClose }) {
  const tr = TRACKS.find((t) => t.id === node.trackId);
  const st = tr.stages[node.stageIndex];
  const cur = answers[tr.id] ?? 0;
  const Icon = tr.icon;
  const state = node.stageIndex < cur ? "done" : node.stageIndex === cur ? "current" : node.stageIndex === cur + 1 ? "next" : "future";
  const tag = { done: [UI.done, C.done], current: [UI.current, C.current], next: [UI.nextLabel, C.next], future: [UI.upcoming, C.dim] }[state];

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div onClick={onClose} role="dialog" aria-modal="true" style={{ position: "fixed", inset: 0, background: "rgba(5,10,14,.7)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 50 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ animation: "rm-sheet .28s ease both", width: "100%", maxWidth: 560, maxHeight: "86vh", overflowY: "auto", background: C.panel, border: `1px solid ${C.line}`, borderRadius: "22px 22px 0 0", padding: "20px 20px 26px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <span style={{ width: 42, height: 42, borderRadius: 12, background: C.panelHi, display: "grid", placeItems: "center" }}><Icon size={20} color={tr.hue} /></span>
            <div>
              <div className="rm-mono" style={{ fontSize: 10.5, color: C.dim, letterSpacing: "0.06em" }}>{L(tr.name).toUpperCase()}</div>
              <div className="rm-display" style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.1 }}>{L(st.name)}</div>
            </div>
          </div>
          <button onClick={onClose} className="rm-btn" style={{ ...btn(C), padding: 8 }} aria-label="Close"><X size={16} /></button>
        </div>

        <span className="rm-mono" style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 12, padding: "3px 10px", borderRadius: 99, background: `${tag[1]}22`, color: tag[1], fontSize: 11, fontWeight: 700, letterSpacing: "0.04em" }}>
          {state === "current" && <MapPin size={12} />}{state === "done" && <Check size={12} />}{L(tag[0]).toUpperCase()}
        </span>

        <div style={{ marginTop: 14 }}>
          <div className="rm-mono" style={{ display: "flex", alignItems: "center", gap: 7, color: C.dim, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 4 }}>
            <Compass size={13} /> {L(UI.whatIs).toUpperCase()}
          </div>
          <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.5, color: C.text }}>{L(st.what)}</p>
        </div>

        <div style={{ marginTop: 16, padding: "14px 15px", background: C.bg, border: `1px solid ${C.line}`, borderRadius: 13 }}>
          <div className="rm-mono" style={{ display: "flex", alignItems: "center", gap: 7, color: C.next, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 5 }}>
            <GraduationCap size={14} /> {L(UI.needs).toUpperCase()}
          </div>
          <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: C.text }}>{L(st.needs)}</p>
        </div>
      </div>
    </div>
  );
}

function Feedback({ L }) {
  const [msg, setMsg] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | done | error

  const submit = async (e) => {
    e.preventDefault();
    if (!msg.trim() || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: "New Life Map feedback",
          from_name: "Life Map",
          botcheck: "",
          message: msg.trim(),
          contact: contact.trim() || "—",
        }),
      });
      const data = await res.json();
      setStatus(data.success ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="rm-rise" style={{ marginTop: 30, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 18, padding: "26px 20px", textAlign: "center" }}>
        <span style={{ width: 44, height: 44, borderRadius: 99, background: `${C.next}1f`, display: "inline-grid", placeItems: "center", marginBottom: 12 }}>
          <Check size={22} color={C.next} strokeWidth={3} />
        </span>
        <div style={{ fontSize: 16, fontWeight: 600, color: C.text }}>{L(UI.fbThanks)}</div>
        <div style={{ fontSize: 13, color: C.dim, marginTop: 5 }}>{L(UI.fbThanksSub)}</div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rm-rise" style={{ marginTop: 30, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 18, padding: "20px 18px" }}>
      <div className="rm-display" style={{ fontSize: 17, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
        <Heart size={16} color={C.current} /> {L(UI.fbTitle)}
      </div>
      <p style={{ color: C.dim, fontSize: 13, margin: "6px 0 14px" }}>{L(UI.fbLead)}</p>

      <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={3} required placeholder={L(UI.fbPlaceholder)}
        style={{ width: "100%", boxSizing: "border-box", resize: "vertical", background: C.bg, color: C.text, border: `1.5px solid ${C.line}`, borderRadius: 12, padding: "11px 13px", fontSize: 14, fontFamily: "inherit", lineHeight: 1.5, outline: "none" }} />

      <input value={contact} onChange={(e) => setContact(e.target.value)} type="text" placeholder={L(UI.fbContact)}
        style={{ width: "100%", boxSizing: "border-box", marginTop: 10, background: C.bg, color: C.text, border: `1.5px solid ${C.line}`, borderRadius: 12, padding: "11px 13px", fontSize: 14, fontFamily: "inherit", outline: "none" }} />

      {status === "error" && (
        <div style={{ marginTop: 10, fontSize: 13, color: "#F2776B" }}>{L(UI.fbError)}</div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
        <button type="submit" disabled={!msg.trim() || status === "sending"} className="rm-btn"
          style={{ ...btn(C), background: !msg.trim() ? C.panelHi : C.current, color: !msg.trim() ? C.dim : C.bg, borderColor: !msg.trim() ? C.line : C.current, cursor: !msg.trim() ? "not-allowed" : "pointer", fontSize: 13.5, fontWeight: 700, padding: "9px 20px" }}>
          {status === "sending" ? L(UI.fbSending) : L(UI.fbSend)} {status !== "sending" && <ArrowRight size={15} />}
        </button>
      </div>
    </form>
  );
}

function Footer({ L }) {
  const socials = [
    { Icon: Linkedin, url: "https://www.linkedin.com/in/iamdiyorjon/", label: "LinkedIn" },
    { Icon: Instagram, url: "https://www.instagram.com/diyorjon.allanazarov", label: "Instagram" },
    { Icon: Youtube, url: "https://www.youtube.com/@diyorjonallanazarov", label: "YouTube" },
    { Icon: Send, url: "https://t.me/diyorjonblogs", label: "Telegram" },
  ];
  return (
    <footer style={{ marginTop: 28, paddingTop: 22, borderTop: `1px solid ${C.line}`, textAlign: "center" }}>
      <div className="rm-mono" style={{ fontSize: 10, color: C.dim, letterSpacing: "0.2em" }}>{L(UI.madeBy).toUpperCase()}</div>
      <div className="rm-display" style={{ fontSize: 16.5, fontWeight: 700, color: C.text, margin: "5px 0 13px" }}>Diyorjon Allanazarov</div>
      <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
        {socials.map(({ Icon, url, label }) => (
          <a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} className="rm-soc"
            style={{ width: 38, height: 38, borderRadius: 10, display: "grid", placeItems: "center", background: C.panelHi, border: `1px solid ${C.line}` }}>
            <Icon size={17} />
          </a>
        ))}
      </div>
    </footer>
  );
}

function btn(C) {
  return { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: C.text, background: C.panelHi, border: `1px solid ${C.line}`, borderRadius: 10, padding: "7px 11px", cursor: "pointer" };
}
