'use client'

import { useCallback, useState } from 'react'

import clsx from 'clsx'
import Link from 'next/link'
import {
  Model,
  ListModelsResponse,
  CreateChatCompletionResponse,
  CreateChatCompletionRequest,
  ChatCompletionRequestMessage,
} from 'openai'

import { OPENAI_HOST, OPENAI_API_KEY } from '@/constants'
import { get, post } from '@/utils/fetch'

export default function Home() {
  const [ models, setModels ] = useState<Model[]>([])
  const [ messages, setMessages ] = useState<ChatCompletionRequestMessage[]>([])
  const [ selectedModel, setSelectedModel ] = useState<Model>()
  const [ text, setText ] = useState('')

  const getModels = useCallback(async () => {
    const result = await get<ListModelsResponse>(`${OPENAI_HOST}/models`, OPENAI_API_KEY, {})
    if ('error' in result) {
      alert(result.error)
      return
    }
    setModels(result.data)
  }, [])

  const addMessage = useCallback(async () => {
    const newMessage: ChatCompletionRequestMessage = { role: 'user', content: text}
    setMessages((cur) => ([...cur, newMessage ]))
    const options: Partial<CreateChatCompletionRequest> = {
      model: selectedModel?.id || 'gpt-3.5-turbo',
      messages: [ ...messages, newMessage]
    }

    const result = await post<CreateChatCompletionResponse>(
      `${OPENAI_HOST}/chat/completions`,
      OPENAI_API_KEY,
      options,
    )
    if ('error' in result) {
      alert(JSON.stringify(result.error, undefined, 2))
      return
    }
    setText('')
    setMessages((cur) => (!cur || !result.choices[0].message ? cur : [...cur, result.choices[0].message]))
  }, [messages, selectedModel, text])

  return (
    <main className="mx-6 my-4">
      <Link href="/image">
        <p className="text-lg underline">
          画像生成
        </p>
      </Link>
        <p className="row text-3xl font-bold">
          CHAT GPT TEST
        </p>

        <div className="md:flex">
          <div className="flex-1">
            <button type="button" onClick={getModels}>
              GET MODELS
            </button>
            <ul>
              {
                models.map((model) => (
                  <li key={model.id}>
                    <button type="button" onClick={() => setSelectedModel(model)} className={clsx('', model.id === selectedModel?.id ? 'bg-red-400' : 'bg-red-50')}>
                      <p className="text-sm">{model.id}</p>
                    </button>
                  </li>
                ))
              }
            </ul>
          </div>
          <div className="flex-1">
            <ol>
              {
                messages.map((message, i) => (
                  <li key={`message-${i}`} className="mb-4">
                    <p className="text-sm whitespace-pre-wrap">{message.role}: {message.content}</p>
                  </li>
                ))
              }
            </ol>
            <form>
              <input
                type="text"
                value={text}
                className="border-black border mr-4"
                onChange={(e) => {
                  e.preventDefault()
                  setText(e.target.value)
                }}
              />
              <button type="button" onClick={addMessage}>
                <p>送信</p>
              </button>
            </form>
          </div>
        </div>
    </main>
  )
}
