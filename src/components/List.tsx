import { URL_STORAGE_KEY } from '@/constants'
import { Url } from '@/types'
import { useLocalStorage } from 'usehooks-ts'
import Card from './Card'

export default function List() {
  const [list] = useLocalStorage<Url[]>(URL_STORAGE_KEY, [])

  return (
    <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
      {list.map(i => (
        <Card key={i.id} {...i} />
      ))}
    </div>
  )
}
