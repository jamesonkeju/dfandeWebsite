import React, { useState } from "react";
import { X, Eye, CheckCircle2 } from "lucide-react";

interface CmsPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  onSave?: () => void;
  isSaving?: boolean;
  saveButtonText?: string;
  children: React.ReactNode;
}

export function CmsPreviewModal({
  isOpen,
  onClose,
  title,
  subtitle = "Live viewport preview before publishing or saving changes",
  onSave,
  isSaving = false,
  saveButtonText = "Confirm & Save Changes",
  children,
}: CmsPreviewModalProps) {
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-void/80 backdrop-blur-md transition-opacity">
      {/* Top Header Bar */}
      <div className="flex h-16 items-center justify-between border-b border-line bg-void px-6 text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/20 text-gold border border-gold/40">
            <Eye size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight flex items-center gap-2">
              <span>{title}</span>
              <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-gold">
                Live Draft Preview
              </span>
            </h2>
            <p className="text-[11px] text-steel">{subtitle}</p>
          </div>
        </div>

        {/* Viewport Switcher */}
        <div className="hidden sm:flex items-center gap-1 rounded-full border border-line bg-void-raised p-1">
          <button
            type="button"
            onClick={() => setViewport("desktop")}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
              viewport === "desktop" ? "bg-gold text-gold-ink shadow-sm" : "text-steel hover:text-white"
            }`}
          >
            <span>Desktop (100%)</span>
          </button>
          <button
            type="button"
            onClick={() => setViewport("tablet")}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
              viewport === "tablet" ? "bg-gold text-gold-ink shadow-sm" : "text-steel hover:text-white"
            }`}
          >
            <span>Tablet (768px)</span>
          </button>
          <button
            type="button"
            onClick={() => setViewport("mobile")}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
              viewport === "mobile" ? "bg-gold text-gold-ink shadow-sm" : "text-steel hover:text-white"
            }`}
          >
            <span>Mobile (375px)</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-steel hover:border-steel hover:text-white transition-colors"
          >
            Back to Editor
          </button>

          {onSave && (
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-full bg-gold px-5 py-2 text-xs font-bold text-gold-ink shadow-md hover:bg-gold-light transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gold-ink border-t-transparent" />
                  <span>Saving…</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} />
                  <span>{saveButtonText}</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-steel hover:bg-void-raised hover:text-white transition-colors"
            title="Close Preview"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Preview Frame Container */}
      <div className="flex-1 overflow-y-auto bg-paper p-4 md:p-8 flex justify-center items-start">
        <div
          className={`transition-all duration-300 overflow-hidden rounded-2xl bg-white shadow-2xl border border-line ${
            viewport === "desktop"
              ? "w-full max-w-6xl"
              : viewport === "tablet"
              ? "w-[768px] max-w-full"
              : "w-[375px] max-w-full"
          }`}
        >
          {/* Simulated Browser Bar for Tablet / Mobile */}
          {viewport !== "desktop" && (
            <div className="flex items-center justify-between border-b border-line bg-paper-raised px-4 py-2 text-[11px] text-steel">
              <span className="font-mono">Viewport: {viewport === "tablet" ? "768 x 1024" : "375 x 812"}</span>
              <span className="truncate max-w-[200px] text-ink font-semibold">https://dfande.com/preview</span>
            </div>
          )}

          {/* Rendered Live Content */}
          <div className="p-6 md:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
