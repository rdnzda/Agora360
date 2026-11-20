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
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[0, 5]}
          ticks={[1, 2, 3, 4, 5]}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "4px",
            fontSize: "12px",
          }}
        />
        <Legend wrapperStyle={{ fontSize: "12px" }} />
        <Bar dataKey="Humeur" fill="var(--chart-1)" radius={[2, 2, 0, 0]} />
        <Bar dataKey="Bien-être" fill="var(--chart-2)" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
