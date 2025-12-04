#!/bin/bash

# Future Lens 一键启动脚本
# 功能：检查并清理端口占用，然后启动开发服务器

PORT=3000
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🚀 启动 Future Lens 开发服务器..."
echo "📁 项目目录: $PROJECT_DIR"
echo ""

# 检查端口是否被占用
check_port() {
  local pid=$(lsof -ti:$PORT 2>/dev/null)
  if [ -n "$pid" ]; then
    echo "⚠️  端口 $PORT 已被占用"
    return 0
  else
    echo "✅ 端口 $PORT 可用"
    return 1
  fi
}

# 清理端口占用
clean_port() {
  local pid=$(lsof -ti:$PORT 2>/dev/null)
  if [ -n "$pid" ]; then
    echo "🧹 正在清理端口 $PORT 的占用进程..."
    
    # 获取进程信息
    local process_info=$(ps -p $pid -o comm= 2>/dev/null)
    
    if [[ "$process_info" == *"node"* ]] || [[ "$process_info" == *"next"* ]]; then
      echo "   发现进程: $process_info (PID: $pid)"
      kill -9 $pid 2>/dev/null
      sleep 1
      
      # 再次检查
      if lsof -ti:$PORT >/dev/null 2>&1; then
        echo "   ❌ 清理失败，请手动检查"
        return 1
      else
        echo "   ✅ 端口已清理"
        return 0
      fi
    else
      echo "   ⚠️  进程不是 Node.js，跳过清理"
      return 1
    fi
  fi
  return 0
}

# 检查 Node.js 和 pnpm
check_dependencies() {
  if ! command -v node &> /dev/null; then
    echo "❌ 未找到 Node.js，请先安装 Node.js"
    exit 1
  fi
  
  if ! command -v pnpm &> /dev/null; then
    echo "❌ 未找到 pnpm，请先安装 pnpm"
    exit 1
  fi
  
  echo "✅ 依赖检查通过"
}

# 主流程
main() {
  cd "$PROJECT_DIR" || exit 1
  
  # 检查依赖
  check_dependencies
  echo ""
  
  # 检查并清理端口
  if check_port; then
    if clean_port; then
      echo ""
    else
      echo "❌ 无法清理端口占用，请手动处理"
      exit 1
    fi
  fi
  
  echo ""
  echo "🎯 启动开发服务器..."
  echo "📍 访问地址: http://localhost:$PORT"
  echo "💡 按 Ctrl+C 停止服务器"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  
  # 启动服务器
  pnpm dev
}

# 运行主流程
main

