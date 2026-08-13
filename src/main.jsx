import React, { useState } from "react";
import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  FileSearch,
  Gavel,
  Handshake,
  Menu,
  Scale,
  Target,
  Users,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useLessonAudio } from "../../shared/useLessonAudio";
import "./styles.css";

const files = import.meta.glob("./assets/illustrations/*.png", {
  eager: true,
  query: "?url",
  import: "default",
});
const img = (n) => files[`./assets/illustrations/${n}.png`];
const tabs = [
  "The inspection",
  "The SLA",
  "KPIs & closeout",
  "ADR ladder",
  "PM discipline",
  "Exam lens",
];
const modalData = {
  hook: {
    image: "vendor-oversight-modal",
    title: "Vendor management works the same way.",
    text: "Signing an agreement isn't the point where oversight stops — it's the point where oversight against measurable, agreed expectations actually begins. This lesson covers how those expectations get made measurable, how performance gets tracked against them, and what happens — through a structured ladder of options — when a disagreement over performance can't be resolved through ordinary conversation.",
  },
  kpi: {
    image: "kpi-closeout-modal",
    title: "Monitoring, KPIs, and closeout",
    text: "Monitoring and controlling procurements means actively managing the relationship, tracking contract performance against the agreed standards, and correcting problems promptly rather than letting them accumulate. PMBOK® 8's Appendix X4 specifically names robust KPI monitoring as good practice here — not an occasional check-in, but an ongoing discipline with a defined cadence. KPIs are what turn vendor evaluation from a subjective impression into evidence. Rather than “the vendor seems to be doing fine,” a project manager tracking on-time delivery rate, defect rate, and SLA compliance percentage can point to actual numbers when confirming a vendor met its obligations — or when raising a concern that it didn't. Closeout completes this stage — but only once every obligation has genuinely been fulfilled and nothing remains outstanding. A contract doesn't close simply because the delivery date has passed; it closes when the final deliverable has been formally verified against the agreed standards and accepted.",
  },
  pm: {
    image: "pm-dispute-discipline-modal",
    title: "The project manager's role in managing disputes",
    text: "Navigating this well requires several disciplines held simultaneously: understanding the contract thoroughly enough to know exactly what was actually agreed to, keeping detailed records of activities, changes, and communications throughout the relationship, fostering open communication before small friction becomes a formal dispute, recognizing conflict early rather than hoping it resolves itself, and sharpening negotiation skills continuously rather than treating them as a one-time competency. PMBOK® 8 also notes that AI now assists with contract analysis, dispute prediction, and clause-risk assessment — surfacing patterns in contract language or vendor behavior that might otherwise only become visible once a dispute has already escalated. Throughout all of this, several sensitivities govern conduct: written communication needs to be handled carefully, because emails become evidence in any formal dispute; clear escalation protocols need to exist before they're needed; strict confidentiality has to be maintained; and impartiality — facts over emotions — has to guide every step, especially when the relationship itself feels strained.",
  },
  exam: {
    image: "exam-vendor-performance-modal",
    title: "Evaluate performance. Verify every objective.",
    text: "Evaluating vendor performance and verifying agreement objectives depends on turning expectations into something measurable — through SLAs that convert hope into commitment, and KPIs that convert impression into evidence. Closeout only happens once every obligation is genuinely fulfilled, not simply once the calendar date has passed. When disputes arise — and in procurement, they often do — the ADR ladder offers a structured path from negotiation through mediation, arbitration, dispute review boards, and expert determination, with litigation reserved as the true last resort. Throughout all of it, careful records, early recognition of conflict, nuanced communication, confidentiality, and impartiality are what keep a difficult vendor relationship manageable — and, wherever possible, salvageable.",
    bullets: [
      "SLAs turn vague commitments into measurable, enforceable ones — with remedies agreed before any breach occurs",
      "KPIs (on-time delivery, defect rate, SLA compliance %) turn vendor evaluation from impression into evidence",
      "Closeout requires genuine fulfillment of every obligation, not just a passed calendar date",
      "ADR ladder, low to high conflict: negotiation → mediation → arbitration → dispute review boards → expert determination → litigation (last resort)",
      "Expert determination fits narrow technical/financial questions; dispute review boards are a standing presence, not a reactive step",
    ],
  },
};
const adr = [
  {
    title: "Negotiation",
    image: "negotiation-detail",
    icon: Handshake,
    text: "Direct discussion between the parties, no third party involved. The fastest, least adversarial option, and the first one that should always be attempted.",
  },
  {
    title: "Mediation",
    image: "mediation-detail",
    icon: Users,
    text: "A neutral facilitator helps the parties reach their own agreement, without imposing a decision on either side.",
  },
  {
    title: "Arbitration",
    image: "arbitration-detail",
    icon: Gavel,
    text: "A binding decision made by a neutral third party, faster than litigation but with real, enforceable consequences.",
  },
  {
    title: "Dispute Review Boards",
    image: "review-board-detail",
    icon: Users,
    text: "Standing panels of neutral experts, kept in place throughout the project specifically for ongoing dispute avoidance, catching disagreements early rather than waiting for them to escalate into formal claims.",
  },
  {
    title: "Expert Determination",
    image: "expert-determination-detail",
    icon: FileSearch,
    text: "An independent ruling on a specific technical or financial point, useful when the dispute hinges on a narrow factual question rather than the whole relationship.",
  },
  {
    title: "Litigation",
    image: "litigation-detail",
    icon: Scale,
    text: "The last resort, reserved for disputes that genuinely can't be resolved through any of the above.",
  },
];
const quiz = {
  q: "Scenario: A vendor and buyer disagree over whether a specific technical deliverable meets a narrow, precisely defined performance specification in the contract. Both sides have already tried discussing it directly without resolving the disagreement. Which next step on the ADR ladder is most appropriate for this specific kind of disagreement?",
  answers: [
    "Litigation, since the disagreement has already failed to resolve through direct discussion",
    "Expert determination, since the dispute centers on a narrow, well-defined technical question rather than the broader relationship",
    "A dispute review board, since standing panels are the appropriate next step after failed negotiation",
    "Mediation, since a neutral facilitator is always the correct next step after direct negotiation fails",
  ],
  correct: 1,
  good: "Correct! Expert determination is specifically suited to a narrow technical or financial question like this one — an independent expert can rule on whether the deliverable meets the defined specification, without escalating the entire relationship into arbitration or litigation.",
  bad: "Reconsider — litigation is the true last resort; dispute review boards are typically a standing presence set up in advance, not assembled reactively; and mediation suits broader relational disputes better than a narrow, well-defined technical question.",
};

function Modal({ data, close, read }) {
  const [step, setStep] = useState(0);
  const sequence = data.sequence;
  const current = sequence ? sequence[step] : data;
  const showMemory = data.bullets && step === 1;
  return createPortal(
    <div className="modal-backdrop" onClick={close}>
      <section className="focus-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-x" onClick={close} aria-label="Close">
          <X />
        </button>
        {!showMemory && (
          <>
            <img
              className="modal-illustration"
              src={img(current.image)}
              alt=""
            />
            <h3>{current.title}</h3>
            <div className="modal-copy">
              <p>{current.text}</p>
            </div>
          </>
        )}
        {showMemory && (
          <div className="memory-step">
            <p className="eyebrow">EXAM-RELEVANT ENABLERS TO REMEMBER</p>
            <ul>
              {data.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        )}
        {(sequence && step < sequence.length - 1) ||
        (data.bullets && step === 0) ? (
          <button className="modal-action" onClick={() => setStep(step + 1)}>
            Next <ArrowRight />
          </button>
        ) : (
          <button
            className="modal-action"
            onClick={() => {
              read();
              close();
            }}
          >
            Mark as read <Check />
          </button>
        )}
      </section>
    </div>,
    document.body,
  );
}
function Quiz({ finish }) {
  const [p, setP] = useState(null);
  return createPortal(
    <div className="knowledge-backdrop">
      <section className="knowledge-modal">
        <p className="quiz-label">
          <Target /> MICRO KNOWLEDGE CHECK
        </p>
        <h3>{quiz.q}</h3>
        <div className="answers">
          {quiz.answers.map((a, i) => (
            <button
              key={a}
              onClick={() => setP(i)}
              className={
                p === i ? (i === quiz.correct ? "correct" : "wrong") : ""
              }
            >
              <span>{String.fromCharCode(65 + i)}</span>
              {a}
            </button>
          ))}
        </div>
        {p !== null && (
          <>
            <p className={`feedback ${p === quiz.correct ? "good" : "bad"}`}>
              {p === quiz.correct ? quiz.good : quiz.bad}
            </p>
            <button className="finish-check" onClick={finish}>
              Finish check <ArrowRight />
            </button>
          </>
        )}
      </section>
    </div>,
    document.body,
  );
}

function App() {
  const [s, setS] = useState(0),
    [done, setDone] = useState(Array(6).fill(false)),
    [modal, setModal] = useState(null),
    [seen, setSeen] = useState([]),
    [exampleRead, setExampleRead] = useState(false),
    [quizOpen, setQuizOpen] = useState(false),
    [sound, setSound] = useState(true),
    [outline, setOutline] = useState(false);
  useLessonAudio(sound);
  const mark = (i) => setDone((v) => v.map((x, n) => (n === i ? true : x)));
  const visit = (i) => setSeen((v) => (v.includes(i) ? v : [...v, i]));
  const go = (i) => {
    if (i >= 0 && i < 6 && (i === 0 || done[i - 1])) setS(i);
  };
  const sla = {
    sequence: [
      {
        image: "enabler-performance-modal",
        title: "The enabler",
        text: (
          <>
            This lesson combines two enablers from ECO Process Task 5 —
            evaluating vendor performance, and verifying that agreement
            objectives were actually met. Together, they cover PMBOK® 8's
            Monitor and Control Procurements, focused on service-level
            agreements, key performance indicators, formal statements of
            compliance, and closeout only once every contractual obligation has
            genuinely been fulfilled. Procurement management develops and
            administers several types of agreements — contracts, purchase
            orders, memoranda of agreement, and service-level agreements (SLAs).
          </>
        ),
      },
      {
        image: "sla-commitment-modal",
        title: "The SLA",
        text: (
          <>
            The SLA deserves particular attention, because it's where
            performance expectations stop being hopes and become measurable
            commitments. A contract might state that a vendor will provide
            “reliable support” — an SLA states that support tickets will be
            acknowledged within four hours and resolved within 48, with a
            specified remedy if that threshold is missed. The difference isn't
            semantic. One is an aspiration nobody can verify; the other is a
            standard either met or not met, with consequences already agreed in
            advance.{" "}
            <i>
              Example: a cloud hosting SLA might guarantee 99.9% uptime, with
              service credits automatically applied to the buyer's next invoice
              for every hour that threshold isn't met. When an outage happens,
              there's no negotiation required about whether a remedy is owed —
              the SLA already answered that question before the outage ever
              occurred.
            </i>
          </>
        ),
      },
    ],
  };
  let c;
  if (s === 0)
    c = (
      <div className="hero-layout">
        <div>
          <p className="eyebrow">LESSON 4.7.7</p>
          <h1 className="lesson-title-compact">
            Evaluate Vendor Performance and Verify Agreement Objectives Met
          </h1>
          <p className="lead">
            A landlord who never inspects a rental property has no real idea
            whether the tenant is maintaining it — they just find out, all at
            once, at the end of the lease, when it's often too late to fix
            anything cheaply. A landlord who checks in periodically, against
            clear expectations set in the lease itself, catches problems early
            and has the standing to actually enforce a fix.
          </p>
          <button
            className="primary-cta"
            onClick={() => setModal(modalData.hook)}
          >
            Reveal the vendor-management parallel <ArrowRight />
          </button>
        </div>
        <img className="lesson-art" src={img("landlord-checkin-hero")} alt="" />
      </div>
    );
  if (s === 1)
    c = (
      <div className="hero-layout">
        <div>
          <p className="eyebrow">WHAT THIS ENABLER MEANS, AND THE SLA</p>
          <h2>Evaluate vendor performance against measurable agreements.</h2>
          <p className="lead">
            This is where a contract's vague good intentions turn into something
            that either got met or didn't — no room left for interpretation.
          </p>
          <button className="primary-cta" onClick={() => setModal(sla)}>
            Reveal the enabler and SLA <ArrowRight />
          </button>
        </div>
        <img className="lesson-art" src={img("sla-precision-screen")} alt="" />
      </div>
    );
  if (s === 2)
    c = (
      <div className="hero-layout">
        <div>
          <p className="eyebrow">MONITORING, KPIS, AND CLOSEOUT</p>
          <h2>Monitoring, KPIs, and closeout</h2>
          <p className="lead">
            “The vendor seems to be doing fine” isn't evidence — it's a feeling.
            Here's what actually replaces it.
          </p>
          <button
            className="primary-cta"
            onClick={() => setModal(modalData.kpi)}
          >
            Reveal the evidence <ArrowRight />
          </button>
        </div>
        <img className="lesson-art" src={img("kpi-evidence-screen")} alt="" />
      </div>
    );
  if (s === 3)
    c = (
      <div className="wide-page">
        <p className="eyebrow">CLAIMS ADMINISTRATION AND THE ADR LADDER</p>
        <h2>Claims administration and the ADR ladder</h2>
        <p className="lead">
          Disputes are common enough in procurement to require real fluency —
          direct dispute costs run between 0.5% and 5% of total contract value
          in construction alone. PMBOK® 8 organizes the response as a ladder,
          running from low-conflict to high-conflict. Click each rung to
          explore.
        </p>
        <img
          className="section-illustration"
          src={img("adr-ladder-screen")}
          alt=""
        />
        <div className="direct-card-grid three">
          {adr.map((d, i) => {
            const Icon = d.icon;
            return (
              <button
                key={d.title}
                className={`direct-detail-card ${seen.includes(i) ? "visited" : ""}`}
                onClick={() => {
                  visit(i);
                  setModal({ ...d, role: "adr" });
                }}
              >
                <span className="major-icon">
                  <Icon />
                </span>
                <span className="direct-card-copy">
                  <small>{i + 1}</small>
                  <strong>{d.title}</strong>
                </span>
                <ArrowRight />
              </button>
            );
          })}
        </div>
        {seen.length === 6 && (
          <button
            className="primary-cta centered"
            onClick={() =>
              setModal({
                role: "example",
                image: "change-order-example-modal",
                title: "Worked example",
                text: "A disagreement over whether a change order genuinely added 15% to project cost, as the vendor claims, or only 8%, as the buyer maintains, might be resolved through expert determination — a narrow, technical question well-suited to an independent expert's ruling, without escalating the entire relationship into arbitration or litigation.",
              })
            }
          >
            {exampleRead ? "Example revealed" : "Reveal the worked example"}
            <ArrowRight />
          </button>
        )}
        {exampleRead && (
          <button className="knowledge-cta" onClick={() => setQuizOpen(true)}>
            <Target /> Start knowledge check <ArrowRight />
          </button>
        )}
      </div>
    );
  if (s === 4)
    c = (
      <div className="hero-layout">
        <div>
          <p className="eyebrow">
            THE PROJECT MANAGER'S ROLE IN MANAGING DISPUTES
          </p>
          <h2>The project manager's role in managing disputes</h2>
          <p className="lead">
            Climbing the ADR ladder well isn't just picking the right rung. It
            rests on habits held simultaneously, all the way through the
            relationship.
          </p>
          <button
            className="primary-cta"
            onClick={() => setModal(modalData.pm)}
          >
            Reveal the disciplines <ArrowRight />
          </button>
        </div>
        <img
          className="lesson-art"
          src={img("pm-dispute-role-screen")}
          alt=""
        />
      </div>
    );
  if (s === 5)
    c = (
      <div className="exam-layout">
        <div>
          <p className="eyebrow">SYNTHESIS · EXAM LENS</p>
          <h2>
            Evaluating Vendor Performance and Verifying Agreement Objectives
          </h2>
          <p className="lead">
            Back to the landlord one more time — because the whole value of
            checking in periodically is catching the small problem while it's
            still cheap to fix.
          </p>
          <button
            className="primary-cta"
            onClick={() => setModal(modalData.exam)}
          >
            Reveal the exam lens <ArrowRight />
          </button>
        </div>
        <div className="exam-visual">
          <img src={img("landlord-closeout-exam")} alt="" />
        </div>
      </div>
    );
  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="course-select">
          <FileSearch />
          <span>Project Management Professional</span>
          <ChevronDown />
        </button>
        <div className="module-progress">
          <div>
            {Array(10)
              .fill(0)
              .map((_, i) => (
                <span
                  key={i}
                  className={`progress-dot ${i < 9 ? "done" : i === 9 ? "active" : ""}`}
                >
                  {i < 9 ? <Check /> : <span />}
                </span>
              ))}
          </div>
        </div>
        <div className="top-actions">
          <button className="ghost-button" onClick={() => setSound(!sound)}>
            {sound ? <Volume2 /> : <VolumeX />}
            <span>{sound ? "Sound on" : "Sound off"}</span>
          </button>
          <button className="ghost-button">Quit</button>
        </div>
      </header>
      <main className="workspace">
        <section className="lesson-stage">
          <div className="outline">
            <button
              className="menu-button"
              onClick={() => setOutline(!outline)}
            >
              <Menu />
            </button>
            {outline && (
              <div className="outline-panel">
                <div className="outline-summary">
                  <b>Lesson 4.7.7</b>
                </div>
                <div className="lesson-list">
                  {tabs.map((t, i) => (
                    <button
                      key={t}
                      className={`lesson ${s === i ? "current" : ""}`}
                      disabled={i > 0 && !done[i - 1]}
                      onClick={() => go(i)}
                    >
                      <span>{done[i] ? <Check /> : i + 1}</span>
                      <span>{t}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <article className="lesson-card">
            <nav className="section-tabs">
              <p>SECTION {s + 1} OF 6</p>
              <div>
                {tabs.map((t, i) => (
                  <button
                    key={t}
                    disabled={i > 0 && !done[i - 1]}
                    className={`${done[i] ? "done" : ""} ${s === i ? "active" : ""}`}
                    onClick={() => go(i)}
                  >
                    {done[i] && <Check />}
                    {t}
                  </button>
                ))}
              </div>
            </nav>
            <div className="lesson-content">{c}</div>
            {done[s] && (
              <p className="completion">
                <Check /> Interaction complete — continue when ready.
              </p>
            )}
            <footer className="nav-footer">
              <button
                className="secondary-button"
                disabled={s === 0}
                onClick={() => setS(s - 1)}
              >
                <ArrowLeft /> Previous
              </button>
              <button
                className="primary-button"
                disabled={!done[s]}
                onClick={() => s < 5 && setS(s + 1)}
              >
                {s === 5 ? "Complete" : "Continue"}
                <ArrowRight />
              </button>
            </footer>
          </article>
        </section>
      </main>
      {modal && (
        <Modal
          data={modal}
          close={() => setModal(null)}
          read={() => {
            if (modal.role === "example") setExampleRead(true);
            else if (modal.role !== "adr") mark(s);
          }}
        />
      )}
      {quizOpen && (
        <Quiz
          finish={() => {
            setQuizOpen(false);
            mark(3);
          }}
        />
      )}
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
