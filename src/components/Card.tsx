/* eslint-disable @next/next/no-img-element */
import { URL_STORAGE_KEY } from '@/constants'
import { Url } from '@/types'
import classNames from 'classnames'
import { useCallback } from 'react'
import { useLocalStorage } from 'usehooks-ts'

interface Props extends Url {
  className?: string
}

export default function Card(props: Props) {
  const [, set] = useLocalStorage<Url[]>(URL_STORAGE_KEY, [])
  const handleRemove = useCallback(() => {
    set(prev => prev.filter(i => i.id !== props.id))
  }, [props.id, set])
  return (
    <div
      className={classNames(
        'inline-flex w-full cursor-pointer space-x-2 rounded-lg border border-gray-200 p-6',
        'transition-all duration-150 hover:shadow-lg',
        'group relative',
        props.className,
      )}
    >
      {props.icon && <img className="h-12 w-12" src={props.icon} alt="favicon" />}
      <a
        href={props.url}
        target="_blank"
        rel="noreferrer"
        className={classNames(
          'flex flex-1 flex-col overflow-hidden',
          props.description ? 'justify-around text-left' : 'justify-center text-center',
        )}
      >
        <h3 title={props.title} className="truncate text-gray-700">
          {props.title}
        </h3>
        <p title={props.description} className="truncate text-sm text-gray-400">
          {props.description}
        </p>
      </a>

      <button
        onClick={handleRemove}
        className={classNames(
          'absolute right-0 top-0',
          'flex h-8 w-8 items-center justify-center text-lg',
          'opacity-0 transition-opacity group-hover:opacity-90',
        )}
      >
        &times;
      </button>
    </div>
  )
}
