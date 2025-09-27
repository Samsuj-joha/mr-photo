// File: src/components/portfolio/PortfolioHeader.tsx
// Header component for portfolio page

export default function PortfolioHeader() {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-4">
        Portfolio
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Explore our photography collection across different styles and moments
      </p>
    </div>
  )
}