# 聊天数据对接模块

这个模块提供了与 Hono 后端（OpenAI 格式）对接的纯前端实现。

## 功能特性

1. **消息格式转换**
   - `toOpenAIFormat()` - 将前端消息格式转换为 OpenAI 格式
   - `fromOpenAIFormat()` - 将 OpenAI 响应转换为前端格式

2. **流式响应处理**
   - `parseOpenAIStream()` - 解析 SSE 格式的流式响应
   - `parseOpenAIJSONStream()` - 解析 JSON 流格式的响应

3. **错误处理**
   - `ChatSDKError` - 统一的错误类
   - `fetchWithErrorHandlers()` - 带错误处理的 fetch 函数

4. **React Hook**
   - `useChatStream()` - 处理流式对话的 Hook

## 使用示例

### 基本使用

```typescript
import { useChatStream } from "@/hooks/use-chat-stream"
import type { ChatMessage } from "@/lib/future-lens/chat/types"

function ChatComponent() {
  const { sendMessage, isStreaming, currentMessage, stop } = useChatStream({
    apiEndpoint: "/api/chat", // Hono 后端端点
    onError: (error) => {
      console.error("Chat error:", error)
    },
    onFinish: (message) => {
      console.log("Message finished:", message)
    },
  })

  const handleSend = async () => {
    const messages: ChatMessage[] = [
      {
        id: "1",
        role: "user",
        parts: [{ type: "text", text: "Hello!" }],
      },
    ]

    await sendMessage(messages)
  }

  return (
    <div>
      <button onClick={handleSend} disabled={isStreaming}>
        Send
      </button>
      {currentMessage && (
        <div>
          {currentMessage.parts.map((part, i) => (
            <div key={i}>
              {part.type === "text" && <p>{part.text}</p>}
              {part.type === "reasoning" && (
                <details>
                  <summary>思维链</summary>
                  <pre>{part.text}</pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

### 消息格式转换

```typescript
import { toOpenAIFormat, fromOpenAIFormat } from "@/lib/future-lens/chat/utils"

// 前端消息格式
const frontendMessages: ChatMessage[] = [
  {
    id: "1",
    role: "user",
    parts: [{ type: "text", text: "Hello!" }],
  },
]

// 转换为 OpenAI 格式
const openAIMessages = toOpenAIFormat(frontendMessages)
// [{ role: "user", content: "Hello!" }]

// 从 OpenAI 响应转换回前端格式
const frontendMessage = fromOpenAIFormat(
  {
    role: "assistant",
    content: "Hi there!",
    reasoning: "User greeted me, I should respond friendly.",
  },
  "msg-2",
  new Date().toISOString(),
)
```

### 错误处理

```typescript
import { fetchWithErrorHandlers, ChatSDKError } from "@/lib/future-lens/chat"

try {
  const response = await fetchWithErrorHandlers("/api/chat", {
    method: "POST",
    body: JSON.stringify({ messages: [] }),
  })
} catch (error) {
  if (error instanceof ChatSDKError) {
    console.error("Chat error:", error.message)
    // 错误码格式: "error_type:surface"
    // 例如: "offline:chat", "rate_limit:chat"
  }
}
```

## 后端接口要求

### 请求格式

```typescript
POST /api/chat
Content-Type: application/json

{
  "messages": [
    { "role": "user", "content": "Hello!" }
  ],
  "stream": true,
  "model": "gpt-4", // 可选
  "temperature": 0.7, // 可选
  "max_tokens": 1000 // 可选
}
```

### 响应格式（流式）

#### SSE 格式（推荐）

```
Content-Type: text/event-stream

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1234567890,"model":"gpt-4","choices":[{"index":0,"delta":{"role":"assistant","content":"Hi"}}]}
data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1234567890,"model":"gpt-4","choices":[{"index":0,"delta":{"content":" there"}}]}
data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1234567890,"model":"gpt-4","choices":[{"index":0,"delta":{"reasoning":"Thinking..."}}]}
data: [DONE]
```

#### JSON 流格式

```
Content-Type: application/x-ndjson

{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1234567890,"model":"gpt-4","choices":[{"index":0,"delta":{"role":"assistant","content":"Hi"}}]}
{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1234567890,"model":"gpt-4","choices":[{"index":0,"delta":{"content":" there"}}]}
{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1234567890,"model":"gpt-4","choices":[{"index":0,"delta":{"reasoning":"Thinking..."}}]}
```

### 响应格式（非流式）

```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "gpt-4",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hi there!",
        "reasoning": "User greeted me, I should respond friendly."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 5,
    "total_tokens": 15
  }
}
```

## 思维链支持

如果后端支持思维链（reasoning），可以在 `delta` 或 `message` 中包含 `reasoning` 字段：

```typescript
{
  "delta": {
    "content": "回答内容",
    "reasoning": "思维链内容"
  }
}
```

前端会自动提取并显示在 `MessageReasoning` 组件中。

## 注意事项

1. **后端未就绪时**：可以继续使用模拟数据，等后端准备好后只需更改 `apiEndpoint` 即可
2. **错误处理**：所有网络错误都会被转换为 `ChatSDKError`，便于统一处理
3. **流式响应**：支持 SSE 和 JSON 流两种格式，自动检测
4. **思维链**：如果后端不支持，`reasoning` 字段会被忽略，不影响正常使用

