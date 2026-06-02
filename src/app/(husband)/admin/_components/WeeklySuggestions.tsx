"use client";

import { useState } from "react";
import Link from "next/link";
import { Lightbulb, RefreshCw, Loader2, ExternalLink } from "lucide-react";

interface Suggestion {
  name: string;
  description: string;
  difficulty: string;
  cooking_time: number;
  reason: string;
}

const DIFF_LABELS: Record<string, string> = { easy: "简单", medium: "中等", hard: "困难" };

export function WeeklySuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false);

  async function fetchSuggestions() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai-suggest-new");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuggestions(data.suggestions || []);
      setLoaded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg text-text-primary flex items-center gap-2" style={{ fontFamily: "var(--font-serif)" }}>
          <Lightbulb className="w-5 h-5 text-wood" />
          本周推荐新菜
        </h2>
        <button
          onClick={fetchSuggestions}
          disabled={loading}
          className="flex items-center gap-1 text-xs text-text-muted hover:text-accent transition-colors"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          {loaded ? "换一批" : "查看推荐"}
        </button>
      </div>

      {error && <p className="text-danger text-sm mb-3">{error}</p>}

      {!loaded && !loading && (
        <button
          onClick={() => { fetchSuggestions(); setExpanded(true); }}
          className="w-full py-3 rounded-xl border border-dashed border-wood/30 bg-wood/5 text-wood-dark hover:bg-wood/10 transition-colors text-sm flex items-center justify-center gap-2"
        >
          <Lightbulb className="w-4 h-4" />
          点击查看 AI 推荐的新菜品
        </button>
      )}

      {loading && (
        <div className="flex items-center justify-center py-4 text-text-muted text-sm">
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          AI 思考中...
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full text-xs text-text-muted hover:text-text-secondary transition-colors py-1"
          >
            {expanded ? "收起 ▲" : `展开 ${suggestions.length} 道推荐菜 ▼`}
          </button>
          {expanded && (<div className="space-y-2">
          {suggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-bg-surface border border-border-subtle rounded-xl">
              <span className="text-2xl shrink-0">🍳</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm text-text-primary">{s.name}</h3>
                <p className="text-xs text-text-muted mt-0.5">{s.description}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-wood/10 text-wood-dark">
                    {DIFF_LABELS[s.difficulty] || s.difficulty}
                  </span>
                  <span className="text-[10px] text-text-muted">⏱ {s.cooking_time}分钟</span>
                  <span className="text-[10px] text-text-muted">💡 {s.reason}</span>
                </div>
              </div>
              <Link
                href="/admin/import"
                className="shrink-0 flex items-center gap-1 text-[10px] text-accent hover:text-accent-hover transition-colors px-2 py-1 rounded-lg bg-accent/5"
              >
                <ExternalLink className="w-3 h-3" />
                搜视频
              </Link>
            </div>
          ))}
        </div>
          )}
        </div>
      )}
    </div>
  );
}
