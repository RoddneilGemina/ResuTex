"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { FormEditor } from "@/components/FormEditor";
import { LatexEditor } from "@/components/LatexEditor";
import { AITailorPanel } from "@/components/AITailorPanel";
import { CoverLetterEditor } from "@/components/CoverLetterEditor";
import { LivePreviewPane } from "@/components/LivePreviewPane";
import { ImportModal } from "@/components/ImportModal";
import { useResumeStore } from "@/lib/store";

export default function Home() {
  const [isImportOpen, setIsImportOpen] = useState(false);
  const { activeTab } = useResumeStore();

  return (
    <main className="min-h-screen flex flex-col bg-white text-black">
      {/* Studio Header: 56px Nav + 36px Marquee Ribbon */}
      <Header onOpenImport={() => setIsImportOpen(true)} />

      {/* Main Workspace: Two-Pane Studio Layout adhering to Figma Design System */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Pane: Interactive Editor / Tailor Suite */}
        <section className="lg:col-span-6 xl:col-span-6 flex flex-col h-[calc(100vh-112px)] overflow-y-auto pr-1">
          {activeTab === "form" && <FormEditor />}
          {activeTab === "latex" && <LatexEditor />}
          {activeTab === "tailor" && <AITailorPanel />}
          {activeTab === "cover_letter" && <CoverLetterEditor />}
        </section>

        {/* Right Pane: Live Paper & Compiled PDF Preview Studio */}
        <section className="lg:col-span-6 xl:col-span-6 flex flex-col h-[calc(100vh-112px)]">
          <LivePreviewPane />
        </section>
      </div>

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
      />
    </main>
  );
}
