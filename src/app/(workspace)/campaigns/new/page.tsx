import {
  ArrowRight,
  Bot,
  FileSpreadsheet,
  GraduationCap,
  MessageSquareText,
  SlidersHorizontal,
} from "lucide-react";

const templateQuestions = [
  "Are you the student or a parent?",
  "Which undergraduate direction are you exploring?",
  "Which class are you in right now?",
  "Have you shortlisted other colleges?",
  "Would you like a counselor callback?",
];

const scoringRules = [
  "+20 asks for admissions process",
  "+18 agrees to counselor callback",
  "+12 requests WhatsApp brochure",
  "-20 says not interested",
  "-35 asks not to call again",
];

export default function CreateCampaignPage() {
  return (
    <form action="/api/campaigns" method="post" className="space-y-6">
      <section>
        <p className="text-sm font-semibold uppercase tracking-normal text-cyan-800">
          Create campaign
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-zinc-950">
          UG 2027 qualification flow
        </h2>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.72fr_0.28fr]">
        <div className="space-y-5">
          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-cyan-800" />
              <h3 className="font-semibold text-zinc-950">Campaign basics</h3>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                ["Campaign name", "campaignName", "UG 2027 Inbound Lead Qualification"],
                ["Objective", "objective", "Lead qualification"],
                ["Target industry", "targetIndustry", "Education - undergraduate admissions"],
                ["Language", "language", "Hinglish"],
              ].map(([label, name, value]) => (
                <label key={label} className="block">
                  <span className="text-sm font-medium text-zinc-800">
                    {label}
                  </span>
                  <input
                    name={name}
                    defaultValue={value}
                    className="mt-2 h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-cyan-700"
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-cyan-800" />
              <h3 className="font-semibold text-zinc-950">AI voice agent</h3>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {[
                ["Voice", "Indian neutral male"],
                ["Tone", "Consultative"],
                ["Disclosure", "Client controlled"],
              ].map(([label, value]) => (
                <label key={label} className="block">
                  <span className="text-sm font-medium text-zinc-800">
                    {label}
                  </span>
                  <select
                    defaultValue={value}
                    className="mt-2 h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-cyan-700"
                  >
                    <option>{value}</option>
                    <option>Friendly</option>
                    <option>Formal</option>
                    <option>Always disclose</option>
                  </select>
                </label>
              ))}
            </div>
            <label className="mt-4 block">
              <span className="text-sm font-medium text-zinc-800">
                Opening pitch
              </span>
              <textarea
                name="script"
                defaultValue="Hi {{lead_name}}, I am calling from the Masters' Union admissions team about your interest in the undergraduate programmes. Is this a good time?"
                className="mt-2 min-h-24 w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-cyan-700"
              />
            </label>
          </section>

          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <MessageSquareText className="h-5 w-5 text-emerald-700" />
              <h3 className="font-semibold text-zinc-950">
                Qualification template
              </h3>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {templateQuestions.map((question, index) => (
                <label key={question} className="block">
                  <span className="text-sm font-medium text-zinc-800">
                    Question {index + 1}
                  </span>
                  <input
                    defaultValue={question}
                    className="mt-2 h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-cyan-700"
                  />
                </label>
              ))}
            </div>
            <textarea
              name="qualificationQuestions"
              defaultValue={templateQuestions.join("\n")}
              className="hidden"
              aria-hidden="true"
            />
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-amber-700" />
              <h3 className="font-semibold text-zinc-950">Scoring rules</h3>
            </div>
            <div className="mt-4 space-y-2">
              {scoringRules.map((rule) => (
                <div
                  key={rule}
                  className="rounded-md border border-line bg-panel-muted px-3 py-2 text-sm text-zinc-700"
                >
                  {rule}
                </div>
              ))}
            </div>
            <textarea
              name="scoringRules"
              defaultValue={scoringRules.join("\n")}
              className="hidden"
              aria-hidden="true"
            />
            <textarea
              name="handoffRules"
              defaultValue={[
                "Score above 75",
                "Parent asks fee or scholarship question",
                "Student wants counselor callback",
                "Prospect requests WhatsApp follow-up",
              ].join("\n")}
              className="hidden"
              aria-hidden="true"
            />
          </section>

          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-cyan-800" />
              <h3 className="font-semibold text-zinc-950">Lead upload</h3>
            </div>
            <div className="mt-4 rounded-lg border border-dashed border-cyan-300 bg-cyan-50 p-5 text-sm text-cyan-900">
              CSV/XLSX with name, phone, city, source, campaign, notes, and
              custom fields.
            </div>
          </section>

          <button
            className="focus-ring inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            Save campaign
            <ArrowRight className="h-4 w-4" />
          </button>
        </aside>
      </section>
    </form>
  );
}
