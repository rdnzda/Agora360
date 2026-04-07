"use client"

import dynamic from "next/dynamic"

const BarometreChart = dynamic(
  () => import("./barometre-chart").then((m) => m.BarometreChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
        Chargement du graphique…
      </div>
    ),
  }
)

type DataPoint = {
  weekLabel: string
  avgMood: number | null
  avgWellbeing: number | null
}

export function BarometreChartWrapper({ data }: { data: DataPoint[] }) {
  return <BarometreChart data={data} />
}
