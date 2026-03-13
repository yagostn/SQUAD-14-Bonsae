"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCard } from "@/components/stats-card"
import { RecentDocuments } from "@/components/recent-documents"
import { TemplateList } from "@/components/template-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, FolderOpen, Users, TrendingUp, Plus, ArrowRight } from "lucide-react"
import { templatesIniciais, documentosIniciais } from "@/lib/store"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle="Bem-vindo ao sistema de templates"
    >
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/templates/novo">
              <Plus className="h-4 w-4 mr-2" />
              Novo Template
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/templates">
              Ver Templates
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Templates Ativos"
            value={templatesIniciais.length}
            description="Templates disponíveis"
            icon={FileText}
            trend={{ value: 12, positive: true }}
          />
          <StatsCard
            title="Documentos Gerados"
            value={documentosIniciais.length}
            description="Este mês"
            icon={FolderOpen}
            trend={{ value: 8, positive: true }}
          />
          <StatsCard
            title="Clientes Ativos"
            value={15}
            description="Usando o sistema"
            icon={Users}
            trend={{ value: 5, positive: true }}
          />
          <StatsCard
            title="Taxa de Uso"
            value="94%"
            description="Satisfação do cliente"
            icon={TrendingUp}
            trend={{ value: 2, positive: true }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentDocuments documentos={documentosIniciais} />
          </div>
          <div>
            <TemplateList templates={templatesIniciais} compact />
          </div>
        </div>

        {/* Activity Card */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Template criado", item: "Declaração de Residência", time: "Há 2 horas" },
                { action: "Documento gerado", item: "Comprovante - Maria Santos", time: "Há 5 horas" },
                { action: "Template editado", item: "Autorização de Uso de Dados", time: "Há 1 dia" },
                { action: "Novo cliente", item: "Empresa ABC", time: "Há 2 dias" },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.item}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
