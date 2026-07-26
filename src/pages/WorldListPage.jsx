import { useState, useEffect } from 'react'
import { BASE_URL } from '../utils/api'

function WorldListPage({ onClose, onWorldClick }) {
  const [worlds, setWorlds] = useState([])

  useEffect(() => {
    fetch(`${BASE_URL}/api/worlds?page=0&size=50`)
    .then((res) => res.json())
    .then((data) => setWorlds(data.worlds))
    .catch((err) => console.error(err))
  }, [])

  return (
      <div className="min-h-screen bg-gray-100">
        <div className="mx-auto max-w-xl px-4 py-6">
          <button
              onClick={onClose}
              className="mb-4 text-sm text-gray-500 hover:text-gray-700"
          >
            ← 피드로 돌아가기
          </button>

          <h1 className="mb-4 text-xl font-bold text-gray-800">세계관 둘러보기</h1>

          <div className="flex flex-col gap-3">
            {worlds.map((world) => (
                <div
                    key={world.worldId}
                    onClick={() => onWorldClick(world.worldId)}
                    className="flex cursor-pointer items-center gap-4 rounded-xl bg-white p-4 shadow-sm hover:bg-gray-50"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-gray-200">
                    {world.profileImageUrl && (
                        <img
                            src={world.profileImageUrl}
                            alt={world.name}
                            className="h-full w-full object-cover"
                        />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-800">{world.name}</p>
                    <p className="truncate text-sm text-gray-500">
                      {world.description || '소개글이 없습니다.'}
                    </p>
                    <p className="text-xs text-gray-400">
                      주민 {world.population}명
                    </p>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
  )
}

export default WorldListPage