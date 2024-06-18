import { URL_STORAGE_KEY } from '@/constants'
import { Url, UrlInput, urlInput } from '@/types'
import { request } from '@/utils/request'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import classNames from 'classnames'
import { isEmpty, uniqBy } from 'lodash'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useLocalStorage } from 'usehooks-ts'

export default function Form() {
  const [, set] = useLocalStorage<Url[]>(URL_STORAGE_KEY, [])

  const {
    getValues,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UrlInput>({
    resolver: zodResolver(urlInput),
  })

  if (!isEmpty(errors)) {
    console.log(getValues())
  }
  const { mutate } = useMutation({
    mutationKey: ['catUrl'],
    mutationFn: (data: UrlInput) => request.post('/url', { json: data }).json<Url>(),
    onSuccess(data) {
      set(prev => uniqBy([data, ...prev], 'id'))
    },
    onSettled() {
      reset()
    },
  })

  const onSubmit = useCallback((data: UrlInput) => mutate(data), [mutate])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={classNames(
        'mx-auto flex w-5/6 min-w-max items-center space-x-2 rounded-md p-2 shadow-md lg:w-3/6 xl:w-1/3',
        'border border-sky-300',
      )}
    >
      <input
        {...register('url')}
        className={classNames(
          'h-9 flex-1 bg-transparent px-2.5',
          'text-base leading-none',
          'text-gray-900 shadow-sky-400 outline-none dark:text-sky-400',
        )}
        type="text"
        placeholder="Enter a URL"
      />
      {errors.url && <span className="text-xs text-red-400">{errors.url.message}</span>}
      <button
        disabled={isSubmitting}
        type="submit"
        className={classNames(
          'inline-flex h-6 items-center justify-center rounded px-2.5 outline-none focus:relative',
          'bg-sky-500 text-white hover:bg-sky-700 focus:shadow-[0_0_0_2px] focus:shadow-sky-600',
          'text-sm leading-none transition-all',
        )}
      >
        Cat
      </button>
    </form>
  )
}
