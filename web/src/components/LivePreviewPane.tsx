"use client";

import React, { useState } from "react";
import { useResumeStore } from "@/lib/store";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Printer,
  FileText,
  FileCheck2,
  ShieldCheck,
  Download,
  Check,
} from "lucide-react";

export const LivePreviewPane: React.FC = () => {
  const { resume, previewMode, setPreviewMode, pdfBlobUrl, isCompiling } =
    useResumeStore();
  const [zoom, setZoom] = useState<number>(95);

  const p = resume.personal;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#0c121e] rounded-3xl overflow-hidden border border-[#e6e6e6] dark:border-[#1e293b] shadow-sm transition-colors">
      {/* 52px Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white dark:bg-[#0c121e] border-b border-[#e6e6e6] dark:border-[#1e293b] transition-colors">
        <div className="flex items-center gap-2.5">
          {/* Pill Mode Switcher */}
          <div className="flex items-center bg-[#f7f7f5] dark:bg-[#131b2b] p-1 rounded-full border border-[#e6e6e6] dark:border-[#1e293b]">
            <button
              onClick={() => setPreviewMode("visual")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition ${
                previewMode === "visual"
                  ? "bg-black dark:bg-white text-white dark:text-black shadow-sm"
                  : "text-black dark:text-neutral-300 hover:text-neutral-700 dark:hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Visual Sheet</span>
            </button>
            <button
              onClick={() => setPreviewMode("pdf")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition ${
                previewMode === "pdf"
                  ? "bg-black dark:bg-white text-white dark:text-black shadow-sm"
                  : "text-black dark:text-neutral-300 hover:text-neutral-700 dark:hover:text-white"
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Compiled PDF</span>
            </button>
          </div>

          {/* Document Health Badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f7f7f5] dark:bg-[#131b2b] border border-[#e6e6e6] dark:border-[#1e293b] text-[11px] font-mono text-black dark:text-white">
            <span className="w-3.5 h-3.5 rounded-full bg-[#1ea64a] text-white flex items-center justify-center text-[9px] font-bold">
              ✓
            </span>
            <span className="figma-caption text-[10px]">1-PAGE BUDGET: OPTIMAL</span>
          </div>
        </div>

        {/* Zoom & Print Circular Icon Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom((z) => Math.max(60, z - 10))}
            className="w-8 h-8 figma-btn-icon text-black dark:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="figma-caption text-[11px] text-neutral-600 dark:text-neutral-300 w-10 text-center select-none">
            {zoom}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(130, z + 10))}
            className="w-8 h-8 figma-btn-icon text-black dark:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(95)}
            className="w-8 h-8 figma-btn-icon text-black dark:text-white"
            title="Reset Zoom"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handlePrint}
            className="w-8 h-8 figma-btn-icon text-black dark:text-white ml-1"
            title="Print Document (Ctrl+P)"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Desk Backdrop Canvas */}
      <div className="flex-1 overflow-auto bg-[#f7f7f5] dark:bg-[#060911] p-4 sm:p-8 flex justify-center items-start relative select-text transition-colors">
        {previewMode === "pdf" && pdfBlobUrl ? (
          <div
            className="w-full h-full min-h-[900px] bg-white rounded-xl overflow-hidden border border-[#e6e6e6] dark:border-[#1e293b] shadow-md"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
          >
            <iframe
              src={pdfBlobUrl}
              className="w-full h-full min-h-[900px] border-0"
              title="Compiled ATS PDF"
            />
          </div>
        ) : previewMode === "pdf" && !pdfBlobUrl ? (
          <div className="my-auto text-center space-y-3 py-20 max-w-sm mx-auto p-6 bg-white dark:bg-[#0f172a] rounded-2xl border border-[#e6e6e6] dark:border-[#1e293b] shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#f4ecd6] dark:bg-[#282419] text-black dark:text-white flex items-center justify-center mx-auto">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h4 className="figma-headline text-lg font-bold text-black dark:text-white">
              No PDF Buffer Generated Yet
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Click &quot;Compile PDF&quot; in the header bar to generate an authentic ReportLab ATS PDF file.
            </p>
          </div>
        ) : (
          /* Live Visual Paper View */
          <div
            className="resume-paper latex-font transition-transform duration-150 origin-top text-black"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
          >
            {/* Header */}
            <div className="text-center mb-3">
              <h1 className="text-2xl font-bold tracking-tight text-black mb-1">
                {p.name || "Candidate Name"}
              </h1>
              <div className="text-[12px] text-neutral-800">
                {p.email && <span>{p.email}</span>}
                {p.phone && <span> &nbsp;·&nbsp; {p.phone}</span>}
                {p.location && <span> &nbsp;·&nbsp; {p.location}</span>}
              </div>
              <div className="text-[12px] text-neutral-900 font-medium mt-0.5">
                {p.portfolio && (
                  <a href={p.portfolio} target="_blank" rel="noreferrer" className="underline hover:text-black">
                    {p.portfolio.replace(/^https?:\/\//, "")}
                  </a>
                )}
                {p.github && (
                  <span>
                    {" "}
                    &nbsp;·&nbsp;{" "}
                    <a href={p.github} target="_blank" rel="noreferrer" className="underline hover:text-black">
                      {p.github.replace(/^https?:\/\//, "")}
                    </a>
                  </span>
                )}
                {p.linkedin && (
                  <span>
                    {" "}
                    &nbsp;·&nbsp;{" "}
                    <a href={p.linkedin} target="_blank" rel="noreferrer" className="underline hover:text-black">
                      {p.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
                    </a>
                  </span>
                )}
              </div>
            </div>

            {/* Section: Professional Experience */}
            {resume.experience && resume.experience.length > 0 && (
              <div className="mb-3.5">
                <h2 className="text-[13px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
                  Professional Experience
                </h2>
                <div className="space-y-2">
                  {resume.experience.map((exp, idx) => (
                    <div key={idx} className="text-[11.5px]">
                      <div className="flex justify-between font-bold text-black">
                        <span>
                          {exp.company} – {exp.role}
                        </span>
                        <span className="font-normal text-neutral-700">
                          {exp.location}
                        </span>
                      </div>
                      <div className="italic text-neutral-700 text-[11px] mb-1">
                        {exp.period}
                      </div>
                      <ul className="list-none space-y-0.5 pl-3">
                        {exp.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="relative pl-3.5 leading-snug">
                            <span className="absolute left-0 top-1 text-[8px]">■</span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section: Relevant Projects */}
            {resume.projects && resume.projects.length > 0 && (
              <div className="mb-3.5">
                <h2 className="text-[13px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
                  Relevant Projects
                </h2>
                <div className="space-y-2">
                  {resume.projects.map((proj, idx) => (
                    <div key={idx} className="text-[11.5px]">
                      <div className="font-bold text-black">
                        {proj.name} – {proj.role || "Developer"} |{" "}
                        <span className="italic font-normal text-neutral-700">
                          {(proj.tech || []).join(", ")}
                        </span>
                      </div>
                      <ul className="list-none space-y-0.5 pl-3 mt-0.5">
                        {proj.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="relative pl-3.5 leading-snug">
                            <span className="absolute left-0 top-1 text-[8px]">■</span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section: Technical Skills */}
            {resume.skills && Object.keys(resume.skills).length > 0 && (
              <div className="mb-3.5">
                <h2 className="text-[13px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
                  Technical Skills
                </h2>
                <div className="text-[11.5px] space-y-0.5">
                  {Object.entries(resume.skills).map(([catKey, skillList], idx) => {
                    const title = catKey
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase());
                    return (
                      <div key={idx}>
                        <span className="font-bold">{title}:</span>{" "}
                        <span>{(skillList || []).join(", ")}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Section: Education */}
            {resume.education && resume.education.length > 0 && (
              <div className="mb-3.5">
                <h2 className="text-[13px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
                  Education
                </h2>
                <div className="space-y-1 text-[11.5px]">
                  {resume.education.map((edu, idx) => (
                    <div key={idx} className="flex justify-between">
                      <div>
                        <span className="font-bold">{edu.institution}</span> –{" "}
                        <span>{edu.degree}</span>
                      </div>
                      <div className="font-bold">{edu.period}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section: Research Conferences */}
            {resume.research && resume.research.length > 0 && (
              <div className="mb-3.5">
                <h2 className="text-[13px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
                  Research Conferences & Competitions
                </h2>
                <div className="space-y-1.5 text-[11.5px]">
                  {resume.research.map((res, idx) => (
                    <div key={idx}>
                      <div className="font-bold">
                        {res.title}
                        {res.location && ` | ${res.location}`}
                      </div>
                      <div className="leading-snug">{res.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section: Certifications */}
            {resume.certifications && resume.certifications.length > 0 && (
              <div className="mb-3.5">
                <h2 className="text-[13px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
                  Certifications
                </h2>
                <div className="space-y-0.5 text-[11.5px]">
                  {resume.certifications.map((cert, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{cert.title}</span>
                      <span className="font-bold">{cert.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section: Volunteering */}
            {resume.volunteering && resume.volunteering.length > 0 && (
              <div className="mb-3.5">
                <h2 className="text-[13px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
                  Volunteering and Leadership Experience
                </h2>
                <div className="space-y-1.5 text-[11.5px]">
                  {resume.volunteering.map((vol, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between font-bold">
                        <span>{vol.organization}</span>
                        <span>{vol.period}</span>
                      </div>
                      {vol.bullets && (
                        <ul className="list-none space-y-0.5 pl-3 mt-0.5">
                          {vol.bullets.map((b, bIdx) => (
                            <li key={bIdx} className="relative pl-3.5 leading-snug">
                              <span className="absolute left-0 top-1 text-[8px]">■</span>
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
