import React, { useEffect } from "react";

const studyLevels = ["Diploma", "Bachelor's (BSc)", "Master's (MSc)", "PhD"];

const malaysiaAdmissionDocuments = [
  ["Valid passport", "✓", "✓", "✓", "✓"],
  ["Passport-size photograph", "✓", "✓", "✓", "✓"],
  ["SSC certificate & transcript", "✓", "✓", "✓", "✓"],
  ["HSC certificate & transcript", "✓", "✓", "✓", "✓"],
  ["Bachelor's certificate", "–", "–", "✓", "✓"],
  ["Bachelor's transcript", "–", "–", "✓", "✓"],
  ["Master's certificate", "–", "–", "–", "✓"],
  ["Master's transcript", "–", "–", "–", "✓"],
  ["IELTS / English proficiency", "✓*", "✓*", "✓*", "✓*"],
  ["Updated CV / Resume", "–", "–", "✓*", "✓"],
  ["Research proposal", "–", "–", "✓*", "✓"],
  ["Recommendation letters", "–", "–", "✓*", "✓*"],
  ["Work experience certificate", "–", "–", "✓*", "✓*"],
  ["Bank statement / financial proof", "As requested", "As requested", "As requested", "As requested"],
  ["Application form", "✓", "✓", "✓", "✓"],
];

const malaysiaVisaDocuments = [
  ["University offer letter", "Required"],
  ["Passport copy", "Required"],
  ["Passport-size photograph (white background)", "Required"],
  ["Academic certificates and transcripts", "Required"],
  ["English proficiency certificate", "Required for applicable applicants"],
  ["Health declaration / medical examination", "Required as applicable"],
  ["Student visa application documents", "Required"],
  ["Personal Bond", "Required through institution"],
  ["Health insurance", "Required"],
  ["Bank statement", "Not a universal EMGS requirement; may be requested by university or for sponsorship purposes"],
];

const australiaAdmissionDocuments = [
  ["Valid passport", "✓", "✓", "✓", "✓"],
  ["Passport-size photograph", "✓", "✓", "✓", "✓"],
  ["SSC certificate & transcript", "✓", "✓", "✓", "✓"],
  ["HSC certificate & transcript", "✓", "✓", "✓", "✓"],
  ["Bachelor's certificate", "–", "–", "✓", "✓"],
  ["Bachelor's transcript", "–", "–", "✓", "✓"],
  ["Master's certificate", "–", "–", "–", "✓"],
  ["Master's transcript", "–", "–", "–", "✓"],
  ["IELTS / PTE / accepted English test", "✓*", "✓*", "✓*", "✓*"],
  ["Updated CV / Resume", "–", "–", "✓*", "✓"],
  ["Statement of Purpose / Personal Statement", "✓*", "✓*", "✓*", "✓*"],
  ["Research proposal", "–", "–", "✓*", "✓"],
  ["Recommendation letters", "–", "–", "✓*", "✓"],
  ["Work experience certificate", "–", "–", "✓*", "✓*"],
  ["Portfolio (if applicable)", "✓*", "✓*", "✓*", "–"],
  ["Bank statement / financial documents", "Visa stage", "Visa stage", "Visa stage", "Visa stage"],
];

const australiaVisaDocuments = [
  ["Valid passport", "Required"],
  ["Confirmation of Enrolment (CoE)", "Required"],
  ["University offer letter", "Needed before CoE"],
  ["Academic certificates and transcripts", "As requested"],
  ["English proficiency evidence", "If required"],
  ["Genuine Student (GS) responses", "Required"],
  ["Bank statement / financial capacity evidence", "If required by checklist"],
  ["Sponsor's financial documents", "If relying on sponsor"],
  ["Sponsor's income evidence", "If applicable"],
  ["Overseas Student Health Cover (OSHC)", "Required"],
  ["Health examination", "If requested"],
  ["Police clearance / character documents", "If requested"],
  ["Family relationship documents", "If dependants are included"],
];

const preparationDocuments = [
  "National ID card or birth certificate.",
  "All academic certificates and transcripts.",
  "English translations of documents, if necessary.",
  "Updated CV.",
  "Passport (preferably with sufficient validity).",
  "IELTS / PTE / TOEFL result, if applicable.",
  "Sponsor's NID and passport copy, if applicable.",
  "Sponsor's bank statement and bank solvency certificate, if applicable.",
  "Sponsor's income certificate or employment documents.",
  "Passport-size photographs.",
];

function Table({ headers, rows, label }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <caption className="sr-only">{label}</caption>
        <thead className="bg-[#0B1F3A] text-white">
          <tr>
            {headers.map((header) => (
              <th className="px-4 py-3 font-semibold" key={header} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {rows.map((row) => (
            <tr className="even:bg-slate-50" key={row[0]}>
              {row.map((cell, index) => (
                <td
                  className={`px-4 py-3 align-top ${index === 0 ? "font-medium text-slate-900" : "text-slate-700"}`}
                  key={`${row[0]}-${index}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdmissionTable({ rows, label }) {
  return (
    <Table
      headers={["Documents", ...studyLevels]}
      rows={rows}
      label={label}
    />
  );
}

function RequirementTable({ rows, label }) {
  return <Table headers={["Documents", "Requirement"]} rows={rows} label={label} />;
}

function SectionHeading({ children, id }) {
  return (
    <h2 id={id} className="mb-5 text-2xl font-bold text-[#0B1F3A] sm:text-3xl">
      {children}
    </h2>
  );
}

const Research = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 rounded-2xl bg-[#0B1F3A] px-6 py-10 text-white sm:px-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#FFC15E]">
            Study Fusion Resources
          </p>
          <h1 className="mb-4 text-3xl font-bold sm:text-4xl">
            Required Documents for International Students – Malaysia &amp; Australia
          </h1>
          <p className="max-w-4xl text-base leading-7 text-slate-200 sm:text-lg">
            Below is a document checklist for Bangladeshi students planning to study in
            Malaysia or Australia, covering Diploma, Bachelor&apos;s, Master&apos;s and PhD
            programmes. University admission documents are listed separately from student
            visa documents because they are not always the same.
          </p>
        </header>

        <div className="space-y-14">
          <section aria-labelledby="malaysia-heading">
            <SectionHeading id="malaysia-heading">1. Malaysia – Required documents</SectionHeading>
            <div className="space-y-10">
              <div>
                <h3 className="mb-4 text-xl font-semibold text-[#0B1F3A]">
                  International student admission
                </h3>
                <AdmissionTable
                  rows={malaysiaAdmissionDocuments}
                  label="Malaysia international student admission documents by study level"
                />
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Note: ✓ means required depending on the university, programme or admission
                  conditions. For PhD applications, a research proposal, academic references
                  and previous research experience can be particularly important.
                </p>
              </div>

              <div>
                <h3 className="mb-4 text-xl font-semibold text-[#0B1F3A]">
                  Malaysia student visa (EMGS) documents
                </h3>
                <RequirementTable
                  rows={malaysiaVisaDocuments}
                  label="Malaysia student visa (EMGS) documents and requirements"
                />
                <p className="mt-3 text-sm text-slate-600">
                  Sources:{" "}
                  <a
                    className="font-medium text-blue-700 underline underline-offset-2"
                    href="https://visa.educationmalaysia.gov.my/guidelines/required-documents"
                    target="_blank"
                    rel="noreferrer"
                  >
                    EMGS – Required Documents
                  </a>{" "}
                  and{" "}
                  <a
                    className="font-medium text-blue-700 underline underline-offset-2"
                    href="https://www.imi.gov.my/index.php/en/main-services/pass/student-pass/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Malaysia Immigration – Student Pass
                  </a>
                  .
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="australia-heading">
            <SectionHeading id="australia-heading">2. Australia – Required documents</SectionHeading>
            <div className="space-y-10">
              <div>
                <h3 className="mb-4 text-xl font-semibold text-[#0B1F3A]">
                  International student admission
                </h3>
                <AdmissionTable
                  rows={australiaAdmissionDocuments}
                  label="Australia international student admission documents by study level"
                />
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  *Admission requirements vary by institution and programme. Some universities
                  may accept alternative English qualifications or grant exemptions.
                </p>
              </div>

              <div>
                <h3 className="mb-4 text-xl font-semibold text-[#0B1F3A]">
                  Australia student visa (Subclass 500) documents
                </h3>
                <RequirementTable
                  rows={australiaVisaDocuments}
                  label="Australia student visa Subclass 500 documents and requirements"
                />
                <p className="mt-3 text-sm text-slate-600">
                  Sources:{" "}
                  <a
                    className="font-medium text-blue-700 underline underline-offset-2"
                    href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Australian Department of Home Affairs – Student Visa Subclass 500
                  </a>{" "}
                  and{" "}
                  <a
                    className="font-medium text-blue-700 underline underline-offset-2"
                    href="https://immi.homeaffairs.gov.au/visas/web-evidentiary-tool"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Document Checklist Tool
                  </a>
                  .
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="additional-heading">
            <SectionHeading id="additional-heading">
              3. Additional documents students should prepare
            </SectionHeading>
            <p className="mb-5 leading-7 text-slate-700">
              For Bangladeshi applicants, we recommend preparing these documents in advance:
            </p>
            <ol className="list-decimal space-y-3 rounded-xl border border-slate-200 bg-white p-6 pl-12 text-slate-700 shadow-sm sm:p-8 sm:pl-14">
              {preparationDocuments.map((document) => (
                <li className="pl-1 leading-6" key={document}>
                  {document}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Research;
