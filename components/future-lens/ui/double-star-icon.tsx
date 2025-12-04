import React from "react"

interface DoubleStarIconProps {
  size?: number
  className?: string
  style?: React.CSSProperties
}

/**
 * Double Star Icon - 两个四角星图标
 * 一个大星和一个小星，支持渐变颜色
 * 四角星形状：十字形，四个尖角（sparkle/glint）
 */
export function DoubleStarIcon({ size = 24, className, style }: DoubleStarIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 大星 - 右上位置，更大更明显 */}
      <g transform="translate(16, 4)">
        <path
          d="M0 0 L2 4 L6 5 L2 6 L0 10 L-2 6 L-6 5 L-2 4 Z"
          fill="currentColor"
        />
      </g>
      {/* 小星 - 左下位置，稍小但更明显 */}
      <g transform="translate(4, 16)">
        <path
          d="M0 0 L1.5 3 L4 3.5 L1.5 4 L0 7 L-1.5 4 L-4 3.5 L-1.5 3 Z"
          fill="currentColor"
        />
      </g>
    </svg>
  )
}

