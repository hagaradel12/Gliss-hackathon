"use client"

import { useState, useEffect } from "react"

interface Product {
  name: string
  image: string
}

interface ProductCarouselProps {
  products: Product[]
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [products.length])

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length)
  }

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Carousel Container */}
      <div className="relative w-full max-w-md h-96 flex items-center justify-center">
        {/* Product Image */}
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={products[currentIndex].image || "/placeholder.svg"}
            alt={products[currentIndex].name}
            className="h-full object-contain transition-opacity duration-500"
          />
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrevious}
          className="absolute left-0 w-12 h-12 rounded-full bg-accent/20 hover:bg-accent/40 text-accent flex items-center justify-center transition-all duration-300 -translate-x-6"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={handleNext}
          className="absolute right-0 w-12 h-12 rounded-full bg-accent/20 hover:bg-accent/40 text-accent flex items-center justify-center transition-all duration-300 translate-x-6"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Product Name */}
      <h4 className="text-2xl font-light text-foreground">{products[currentIndex].name}</h4>

      {/* Dots Indicator */}
      <div className="flex gap-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-accent w-8" : "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
