/**
 * 混合存储策略
 * 根据完整方案文档实现：数据库 + OSS 混合存储
 * 
 * 存储原则：
 * - 小配置（<100KB）→ 数据库 JSONB（实时查询、关联查询）
 * - 大文件（>100KB）→ OSS（存储成本低、扩展性好）
 * - 元数据 → 数据库（支持查询、关联）
 * - 实际文件 → OSS（数据库只存URL引用）
 */

const SIZE_THRESHOLD = 100 * 1024 // 100KB

/**
 * 计算数据大小（字节）
 */
function calculateSize(data: any): number {
  try {
    const jsonString = JSON.stringify(data)
    return new Blob([jsonString]).size
  } catch (error) {
    console.error("[StorageStrategy] 计算数据大小失败:", error)
    return 0
  }
}

/**
 * 判断是否应该使用OSS存储
 */
export function shouldUseOSS(data: any): boolean {
  const size = calculateSize(data)
  return size >= SIZE_THRESHOLD
}

/**
 * 存储卡片数据（自动选择存储方式）
 * 
 * @param data 卡片数据
 * @param metadata 元数据
 * @returns 存储结果（包含data或data_oss_url）
 */
export async function storeCardData(
  data: Record<string, any>,
  metadata?: Record<string, any>
): Promise<{
  data?: Record<string, any>
  data_oss_url?: string
  metadata: Record<string, any>
}> {
  const size = calculateSize(data)
  const useOSS = size >= SIZE_THRESHOLD

  if (useOSS) {
    // 大文件：上传到OSS，数据库只存URL
    try {
      const ossUrl = await uploadToOSS(data, metadata)
      return {
        data_oss_url: ossUrl,
        metadata: {
          ...metadata,
          size,
          storage_type: "oss",
          stored_at: new Date().toISOString(),
        },
      }
    } catch (error) {
      console.error("[StorageStrategy] OSS上传失败，降级到数据库存储:", error)
      // 降级：即使超过阈值，也存数据库（但记录警告）
      return {
        data,
        metadata: {
          ...metadata,
          size,
          storage_type: "database_fallback",
          warning: "数据超过100KB，但OSS上传失败，已降级到数据库存储",
          stored_at: new Date().toISOString(),
        },
      }
    }
  } else {
    // 小配置：直接存数据库
    return {
      data,
      metadata: {
        ...metadata,
        size,
        storage_type: "database",
        stored_at: new Date().toISOString(),
      },
    }
  }
}

/**
 * 从存储中读取卡片数据
 */
export async function loadCardData(
  storedData: {
    data?: Record<string, any>
    data_oss_url?: string
    metadata?: Record<string, any>
  }
): Promise<Record<string, any> | null> {
  // 优先从数据库读取（小数据）
  if (storedData.data) {
    return storedData.data
  }

  // 从OSS读取（大数据）
  if (storedData.data_oss_url) {
    try {
      return await downloadFromOSS(storedData.data_oss_url)
    } catch (error) {
      console.error("[StorageStrategy] OSS下载失败:", error)
      return null
    }
  }

  return null
}

/**
 * 上传到OSS（占位实现，需要实际OSS服务）
 */
async function uploadToOSS(
  data: Record<string, any>,
  metadata?: Record<string, any>
): Promise<string> {
  // TODO: 实现实际的OSS上传逻辑
  // 这里返回一个占位URL
  console.warn("[StorageStrategy] OSS上传功能未实现，返回占位URL")
  return `oss://aino-storage/cards/${Date.now()}.json`
}

/**
 * 从OSS下载（占位实现，需要实际OSS服务）
 */
async function downloadFromOSS(url: string): Promise<Record<string, any>> {
  // TODO: 实现实际的OSS下载逻辑
  // 这里返回空对象
  console.warn("[StorageStrategy] OSS下载功能未实现，返回空数据")
  return {}
}

/**
 * 存储策略配置
 */
export interface StorageConfig {
  /** OSS配置 */
  oss?: {
    endpoint: string
    accessKeyId: string
    accessKeySecret: string
    bucket: string
  }
  /** 大小阈值（字节） */
  sizeThreshold: number
}

let storageConfig: StorageConfig = {
  sizeThreshold: SIZE_THRESHOLD,
}

/**
 * 设置存储配置
 */
export function setStorageConfig(config: Partial<StorageConfig>) {
  storageConfig = { ...storageConfig, ...config }
}

/**
 * 获取存储配置
 */
export function getStorageConfig(): StorageConfig {
  return storageConfig
}

