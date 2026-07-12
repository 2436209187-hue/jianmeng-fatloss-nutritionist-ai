import React from "react";
import { Bot } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description: string;
}

export function FastGPTComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-brand-red-light rounded-2xl flex items-center justify-center mb-4 border border-brand-red-border">
        <Bot className="w-8 h-8 text-brand-red" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-red-light border border-brand-red-border rounded-full text-brand-red text-xs font-semibold mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
        功能即将上线
      </div>
      <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
