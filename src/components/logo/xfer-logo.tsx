"use client"

import { HTMLAttributes } from "react"

export interface XferLogoProps extends HTMLAttributes<SVGSVGElement> {
  /** Width of the logo (default: "100%") */
  width?: string | number
  /** Height of the logo (default: "auto") */
  height?: string | number
  /** Main text color (default gradient will be used if not provided) */
  textColor?: string
  /** Subtitle text (default: "CRYPTO • FIAT • TRANSFER") */
  subtitle?: string
  /** Show/hide the subtitle (default: true) */
  showSubtitle?: boolean
  /** Show/hide the animated arrows (default: true) */
  showArrows?: boolean
}

export default function XferLogo({
  width = "100%",
  height = "auto",
  textColor,
  subtitle = "CRYPTO • FIAT • TRANSFER",
  showSubtitle = true,
  showArrows = true,
  className = "",
  ...props
}: XferLogoProps) {
  return (
        <svg
          width={width}
          height={height}
          viewBox="0 0 300 120"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-lg ${className}`}
          {...props}
        >
          <defs>
            {/* Gradient definitions */}
            <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1f2937" />
              <stop offset="50%" stopColor="#4b5563" />
              <stop offset="100%" stopColor="#1f2937" />
            </linearGradient>

            <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6b7280" />
              <stop offset="100%" stopColor="#374151" />
            </linearGradient>

            {/* Filter for glow effect */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Animated transfer arrows */}
          {showArrows && (
            <g>
              {/* Left to right arrow */}
              <path
                d="M 70 50 L 110 50 L 105 45 M 110 50 L 105 55"
                stroke="url(#arrowGradient)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
              >
                <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0,0;-9,0;0,0"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </path>

              {/* Right to left arrow */}
              <path
                d="M 230 70 L 190 70 L 195 65 M 190 70 L 195 75"
                stroke="url(#arrowGradient)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
              >
                <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0,0;-9,0;0,0"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </path>
            </g>
          )}

          {/* Main "Xfer" text */}
          <text
            x="150"
            y="70"
            textAnchor="middle"
            fontSize="36"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            fill={textColor || "url(#textGradient)"}
            filter="url(#glow)"
          >
            Xfer
            <animate attributeName="opacity" values="0.8;1;0.8" dur="4s" repeatCount="indefinite" />
          </text>

          {/* Subtitle */}
          {showSubtitle && (
            <text
              x="150"
              y="95"
              textAnchor="middle"
              fontSize="12"
              fontFamily="Arial, sans-serif"
              fill="#6b7280"
              opacity="0.8"
            >
              {subtitle}
              <animate attributeName="opacity" values="0.6;0.9;0.6" dur="3s" repeatCount="indefinite" />
            </text>
          )}
        </svg>
  )
}
