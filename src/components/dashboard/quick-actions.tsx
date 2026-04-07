"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, BarChart2, Wallet } from "lucide-react"

export function QuickActions({ isAdmin }: { isAdmin: boolean }) {
  return (
    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
      {!isAdmin && (
        <Link href="/dashboard/tickets/new" className="col-span-2 sm:col-span-1">
          <Button size="sm" className="gap-2 w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            Nouveau ticket
          </Button>
        </Link>
      )}
      <Link href="/dashboard/barometre">
        <Button size="sm" variant="outline" className="gap-2 w-full sm:w-auto">
          <BarChart2 className="w-4 h-4" />
          Baromètre
        </Button>
      </Link>
      <Link href="/dashboard/budget">
        <Button size="sm" variant="outline" className="gap-2 w-full sm:w-auto">
          <Wallet className="w-4 h-4" />
          Budget
        </Button>
      </Link>
    </div>
  )
}
