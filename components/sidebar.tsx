"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  FilePlus,
  FolderOpen,
  Settings,
  Variable,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const menuItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Templates",
    href: "/templates",
    icon: FileText,
  },
  {
    title: "Criar Template",
    href: "/templates/novo",
    icon: FilePlus,
  },
  {
    title: "Documentos",
    href: "/documentos",
    icon: FolderOpen,
  },
  {
    title: "Variáveis",
    href: "/variaveis",
    icon: Variable,
  },
  {
    title: "Clientes",
    href: "/clientes",
    icon: Users,
  },
  {
    title: "Configurações",
    href: "/configuracoes",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/OIP-1394759429-removebg-preview-SPUtfSyh0TcTKnInySYr4XwGxdPegj.png"
              alt="Bonsae"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </Link>
        )}
        {collapsed && (
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/OIP-1394759429-removebg-preview-SPUtfSyh0TcTKnInySYr4XwGxdPegj.png"
            alt="Bonsae"
            width={32}
            height={32}
            className="h-8 w-8 object-contain mx-auto"
          />
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                "text-sidebar-foreground hover:bg-sidebar-accent",
                isActive && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.title : undefined}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-sidebar-primary-foreground")} />
              {!collapsed && (
                <span className="text-sm font-medium">{item.title}</span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="h-8 w-8 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-medium text-sm">
            U
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                Usuário Demo
              </p>
              <p className="text-xs text-sidebar-muted truncate">
                usuario@bonsae.com
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
