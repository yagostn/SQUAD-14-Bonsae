"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { TemplateList } from "@/components/template-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Search, Filter } from "lucide-react"
import { templatesIniciais } from "@/lib/store"
import Link from "next/link"

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const categorias = Array.from(
    new Set(templatesIniciais.map((t) => t.categoria).filter(Boolean))
  )

  const filteredTemplates = templatesIniciais.filter((template) => {
    const matchesSearch = template.nome_template
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesCategory =
      categoryFilter === "all" || template.categoria === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <DashboardLayout
      title="Templates"
      subtitle="Gerencie seus modelos de documentos"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-3 w-full sm:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar templates..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                {categorias.map((cat) => (
                  <SelectItem key={cat} value={cat || ""}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button asChild>
            <Link href="/templates/novo">
              <Plus className="h-4 w-4 mr-2" />
              Novo Template
            </Link>
          </Button>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <TemplateList templates={filteredTemplates} />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhum template encontrado.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/templates/novo">
                <Plus className="h-4 w-4 mr-2" />
                Criar primeiro template
              </Link>
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
