"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileDown, Eye, Save, Printer } from "lucide-react"
import Link from "next/link"
import { templatesIniciais, extrairVariaveis, variaveisDisponiveis, substituirVariaveis } from "@/lib/store"
import type { Template } from "@/lib/types"

export default function GerarDocumentoPage() {
  const params = useParams()
  const router = useRouter()
  const previewRef = useRef<HTMLDivElement>(null)
  const [template, setTemplate] = useState<Template | null>(null)
  const [dados, setDados] = useState<Record<string, string>>({})
  const [variaveis, setVariaveis] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const templateId = params.id as string
    const foundTemplate = templatesIniciais.find((t) => t.id === templateId)
    if (foundTemplate) {
      setTemplate(foundTemplate)
      const extractedVars = extrairVariaveis(foundTemplate.conteudo)
      setVariaveis(extractedVars)
      
      // Initialize with current date
      const initialData: Record<string, string> = {
        data_atual: new Date().toLocaleDateString("pt-BR"),
      }
      setDados(initialData)
    }
  }, [params.id])

  const getVariableInfo = (varName: string) => {
    return variaveisDisponiveis.find((v) => v.nome_variavel === varName)
  }

  const handleInputChange = (varName: string, value: string) => {
    setDados((prev) => ({ ...prev, [varName]: value }))
  }

  const handleGeneratePDF = async () => {
    setIsGenerating(true)
    
    // Use browser print functionality
    if (previewRef.current) {
      const printContent = previewRef.current.innerHTML
      const printWindow = window.open("", "_blank")
      
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${template?.nome_template || "Documento"}</title>
            <style>
              @page {
                size: A4;
                margin: 20mm;
              }
              body {
                font-family: "Times New Roman", serif;
                font-size: 12pt;
                line-height: 1.6;
                color: #000;
                margin: 0;
                padding: 0;
              }
              h1, h2, h3 {
                margin-top: 0;
              }
              .document-content {
                max-width: 170mm;
                margin: 0 auto;
              }
              @media print {
                body {
                  print-color-adjust: exact;
                  -webkit-print-color-adjust: exact;
                }
              }
            </style>
          </head>
          <body>
            <div class="document-content">
              ${printContent}
            </div>
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                }
              }
            </script>
          </body>
          </html>
        `)
        printWindow.document.close()
      }
    }
    
    setTimeout(() => setIsGenerating(false), 1000)
  }

  const processedContent = template
    ? substituirVariaveis(template.conteudo, dados)
    : ""

  if (!template) {
    return (
      <DashboardLayout title="Template não encontrado" subtitle="">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Template não encontrado.</p>
          <Button className="mt-4" asChild>
            <Link href="/templates">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos templates
            </Link>
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Gerar Documento"
      subtitle={template.nome_template}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button variant="ghost" asChild>
            <Link href="/templates">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleGeneratePDF} disabled={isGenerating}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button onClick={handleGeneratePDF} disabled={isGenerating}>
              <FileDown className="h-4 w-4 mr-2" />
              {isGenerating ? "Gerando..." : "Exportar PDF"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Preencher Dados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {variaveis.map((varName) => {
                  const info = getVariableInfo(varName)
                  return (
                    <div key={varName} className="space-y-2">
                      <Label htmlFor={varName} className="flex items-center gap-2">
                        <span className="font-mono text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                          {`{{${varName}}}`}
                        </span>
                        <span>{info?.descricao || varName}</span>
                      </Label>
                      <Input
                        id={varName}
                        placeholder={info?.exemplo || `Informe ${varName}`}
                        value={dados[varName] || ""}
                        onChange={(e) => handleInputChange(varName, e.target.value)}
                      />
                    </div>
                  )
                })}
                {variaveis.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Este template não possui variáveis.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                Preview do Documento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="relative mx-auto bg-white shadow-lg rounded-sm overflow-hidden border border-border"
                style={{
                  width: "100%",
                  maxHeight: "600px",
                  overflowY: "auto",
                }}
              >
                {template.imagem_fundo && (
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
                    style={{
                      backgroundImage: `url(${template.imagem_fundo})`,
                    }}
                  />
                )}
                <div
                  ref={previewRef}
                  className="relative p-6 prose prose-sm max-w-none"
                  style={{
                    fontFamily: "Times New Roman, serif",
                    fontSize: "11pt",
                    lineHeight: "1.6",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: processedContent
                      .replace(
                        /{{(\w+)}}/g,
                        '<span style="background-color: #fee2e2; color: #991b1b; padding: 0 4px; border-radius: 4px; font-family: monospace; font-size: 0.75rem;">{{$1}}</span>'
                      ),
                  }}
                />
              </div>
              
              {/* Unfilled variables warning */}
              {variaveis.some((v) => !dados[v]) && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    Existem variáveis não preenchidas. Preencha todos os campos
                    para gerar o documento completo.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
