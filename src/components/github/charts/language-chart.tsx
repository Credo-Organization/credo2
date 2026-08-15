"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2 } from "lucide-react";

interface LanguageChartProps {
  languages: { language: string; bytes: number; percentage: number | null }[];
}

// Colors for popular languages
const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  "C#": "#178600",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Go: "#00ADD8",
  Rust: "#dea584",
  HTML: "#e34c26",
  CSS: "#563d7c",
};

export function LanguageChart({ languages }: LanguageChartProps) {
  // Aggregate bytes by language across all repos
  const aggregatedData = useMemo(() => {
    const map = new Map<string, number>();
    let totalBytes = 0;

    languages.forEach((lang) => {
      const current = map.get(lang.language) || 0;
      map.set(lang.language, current + lang.bytes);
      totalBytes += lang.bytes;
    });

    return Array.from(map.entries())
      .map(([name, value]) => ({
        name,
        value,
        percentage: ((value / totalBytes) * 100).toFixed(1),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6); // Keep only top 6 to avoid clutter
  }, [languages]);

  if (aggregatedData.length === 0) {
    return null;
  }

  return (
    <Card className="h-full bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Code2 className="w-4 h-4 text-primary" />
          Top Languages
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={aggregatedData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {aggregatedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={LANG_COLORS[entry.name] || `hsl(var(--primary) / ${1 - index * 0.15})`}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any, name: any, props: any) => [
                  `${props.payload.percentage}%`,
                  name,
                ]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
