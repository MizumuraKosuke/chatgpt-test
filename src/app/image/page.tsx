'use client'

import { useCallback, useState } from 'react'

import Image from 'next/image'
import { CreateImageRequest, ImagesResponse } from 'openai'

import Spinner from '@/components/spinner'
import { OPENAI_API_KEY, OPENAI_HOST } from '@/constants'
import { get, post } from '@/utils/fetch'

const ImagePage = () => {
  const [ isLoading, setIsLoading ] = useState(false)
  const [ prompt, setPrompt ] = useState('')
  const [ imageUrl, setImageUrl ] = useState('')
  const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true)
    e.preventDefault()
    const options: Partial<CreateImageRequest> = {
      prompt,
      n: 1,
      size: '512x512',
      response_format: 'url',
    }
    const result = await post<ImagesResponse>(`${OPENAI_HOST}/images/generations`, OPENAI_API_KEY, options)
    setIsLoading(false)
    if ('error' in result) {
      alert(JSON.stringify(result.error, undefined, 2))
      return
    }
    setImageUrl(result.data[0].url ?? '')
  }, [prompt])

  return (
    <div className="pt-20 flex flex-col h-screen">
      <form className="flex flex-col items-center pb-8 px-10" onSubmit={onSubmit}>
        <label className="mb-2 text-4xl font-bold">CHAT-GPT 画像生成</label>
        <input
          type="text"
          value={prompt}
          className="border-black border rounded-lg px-4 py-2 w-full"
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          type="submit"
          className="bg-red-400 text-white rounded-lg px-4 py-2 mt-4"
        >
          生成
        </button>
      </form>
      <div className="flex-1 relative">
        {
          isLoading ? (
            <div className="flex h-full justify-center items-center">
              <Spinner />
            </div>
        ) : (
          <>
            {
              imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="placehold"
                  className="object-contain"
                  fill
                />
                ) : (
                  <div className="flex h-full justify-center items-center">
                    <p>画像が生成されるとここに表示されます</p>
                  </div>
                )
            }
          </>
        )
      }
      </div>
    </div>
  )
}

export default ImagePage
