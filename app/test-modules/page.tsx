"use client"

/**
 * 测试页面：显示所有模块
 */

import { useEffect, useState } from "react"
import { apiRequest } from "@/lib/aino-sdk/sdk-instance"
import { getAINOConfig } from "@/lib/aino-sdk/config"

export default function TestModulesPage() {
  const [modules, setModules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadModules = async () => {
      try {
        setLoading(true)
        setError(null)

        const config = getAINOConfig()
        const applicationId = config.applicationId

        if (!applicationId) {
          throw new Error("应用ID未配置")
        }

        console.log(`[TestModules] 开始获取模块，应用ID: ${applicationId}`)

        const response = await apiRequest(`/api/modules/installed?applicationId=${applicationId}`)
        
        console.log(`[TestModules] API响应:`, response)

        if (!response.success) {
          throw new Error(response.error || "获取模块列表失败")
        }

        // 后端返回格式：{ success: true, data: { modules: [...], pagination: {...} } }
        const modulesList = response.data?.modules || response.data || []
        
        console.log(`[TestModules] 解析后的模块列表:`, modulesList)
        setModules(modulesList)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "加载失败"
        setError(errorMessage)
        console.error("[TestModules] 加载模块失败:", err)
      } finally {
        setLoading(false)
      }
    }

    loadModules()
  }, [])

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">测试模块列表</h1>
        <p>加载中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">测试模块列表</h1>
        <div className="text-red-600">错误: {error}</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">测试模块列表</h1>
      <p className="mb-4 text-gray-600">共找到 {modules.length} 个模块</p>

      {modules.length === 0 ? (
        <div className="text-yellow-600">⚠️ 没有找到任何模块</div>
      ) : (
        <div className="space-y-4">
          {modules.map((module: any, index: number) => (
            <div key={module.id || index} className="border p-4 rounded-lg">
              <h2 className="font-semibold text-lg mb-2">模块 #{index + 1}</h2>
              <div className="space-y-1 text-sm">
                <div><strong>ID:</strong> {module.id || "N/A"}</div>
                <div><strong>moduleKey:</strong> {module.moduleKey || "N/A"}</div>
                <div><strong>key:</strong> {module.key || "N/A"}</div>
                <div><strong>name:</strong> {module.name || "N/A"}</div>
                <div><strong>moduleName:</strong> {module.moduleName || "N/A"}</div>
                <div><strong>type:</strong> {module.type || "N/A"}</div>
                <div><strong>moduleType:</strong> {module.moduleType || "N/A"}</div>
                <div><strong>installStatus:</strong> {module.installStatus || "N/A"}</div>
                <details className="mt-2">
                  <summary className="cursor-pointer text-blue-600">查看完整对象</summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                    {JSON.stringify(module, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">所有模块的标识符列表：</h3>
        <ul className="list-disc list-inside space-y-1">
          {modules.map((module: any, index: number) => {
            const identifiers = [
              module.moduleKey && `moduleKey: "${module.moduleKey}"`,
              module.key && `key: "${module.key}"`,
              module.name && `name: "${module.name}"`,
              module.moduleName && `moduleName: "${module.moduleName}"`,
            ].filter(Boolean)
            return (
              <li key={index}>
                模块 #{index + 1}: {identifiers.length > 0 ? identifiers.join(", ") : "无标识符"}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}



