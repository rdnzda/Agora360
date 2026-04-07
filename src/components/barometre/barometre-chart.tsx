"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

type DataPoint = {
  weekLabel: string
  avgMood: number | null
  avgWellbeing: number | null
}

type Props = {
  data: DataPoint[]
}

export function BarometreChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
        Pas encore de données à afficher.
      </div>
    )
  }

  const chartData = data.map((d) => ({
    name: d.weekLabel.replace(/^Semaine du /, ""),
    Humeur: d.avgMood !== null ? +d.avgMood.toFixed(1) : null,
    "Bien-être": d.avgWellbeing !== null ? +d.avgWellbeing.toFixed(1) : null,
  }))

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[0, 5]}
          ticks={[1, 2, 3, 4, 5]}
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        />
        <Legend wrapperStyle={{ fontSize: "12px" }} />
        <Bar dataKey="Humeur" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Bien-être" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
