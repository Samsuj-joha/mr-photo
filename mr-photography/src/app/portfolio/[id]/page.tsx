// File: src/app/portfolio/[id]/page.tsx
// Dynamic portfolio detail page

import PortfolioDetailContainer from "@/components/portfolio/PortfolioDetailContainer"

interface PortfolioDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const { id } = await params
  return <PortfolioDetailContainer id={id} />
}