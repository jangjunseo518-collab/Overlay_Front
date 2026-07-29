import { useState } from 'react'
import { authFetch, BASE_URL } from '../utils/api'

const MAX_NAME_LENGTH = 28
const MAX_DESCRIPTION_LENGTH = 1000
const MAX_GENRE_LENGTH = 30

function CreateWorldPage({ onSuccess, onClose }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [genre, setGenre] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const response = await authFetch(`${BASE_URL}/api/worlds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, genre }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.message)
        return
      }

      alert('세계관이 생성되었습니다!')
      onSuccess()
    } catch (error) {
      alert('오류가 발생했습니다.')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
      <div className="min-h-screen bg-gray-100">
        <div className="mx-auto max-w-xl px-4 py-6">
          <button
              onClick={onClose}
              className="mb-4 text-sm text-gray-500 hover:text-gray-700"
          >
            ← 취소하고 돌아가기
          </button>

          <form onSubmit={handleSubmit}>
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              {/* 커버 이미지 자리 (생성 시점엔 이미지 없음, 안내만) */}
              <div className="flex h-40 w-full items-center justify-center bg-gray-200">
                <span className="text-sm text-gray-500">
                  커버 이미지는 생성 후 추가할 수 있어요
                </span>
              </div>

              <div className="px-6">
                {/* 프로필 이미지 자리 */}
                <div className="-mt-10 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-200">
                  <span className="text-center text-[10px] text-gray-500">
                    이미지 추가
                  </span>
                </div>

                <div className="py-4">
                  <input
                      type="text"
                      placeholder="세계관 이름"
                      value={name}
                      onChange={(e) => {
                        if (e.target.value.length <= MAX_NAME_LENGTH) {
                          setName(e.target.value)
                        }
                      }}
                      className="w-full text-xl font-bold text-gray-800 outline-none placeholder:text-gray-400"
                  />
                  <div className="text-right text-xs text-gray-400">
                    {name.length}/{MAX_NAME_LENGTH}
                  </div>

                  <input
                      type="text"
                      placeholder="장르 (선택)"
                      value={genre}
                      onChange={(e) => {
                        if (e.target.value.length <= MAX_GENRE_LENGTH) {
                          setGenre(e.target.value)
                        }
                      }}
                      className="mt-2 w-full text-sm text-gray-500 outline-none placeholder:text-gray-400"
                  />
                  <div className="text-right text-xs text-gray-400">
                    {genre.length}/{MAX_GENRE_LENGTH}
                  </div>
                </div>
              </div>

              {/* 소개글 영역 */}
              <div className="border-t border-gray-200 px-6 py-4">
                <h2 className="mb-2 text-sm font-semibold text-gray-500">소개</h2>
                <textarea
                    placeholder="이 세계관을 소개해주세요 (선택)"
                    value={description}
                    onChange={(e) => {
                      if (e.target.value.length <= MAX_DESCRIPTION_LENGTH) {
                        setDescription(e.target.value)
                      }
                    }}
                    rows={4}
                    className="w-full resize-none text-sm text-gray-700 outline-none placeholder:text-gray-400"
                />
                <div className="text-right text-xs text-gray-400">
                  {description.length}/{MAX_DESCRIPTION_LENGTH}
                </div>
              </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 py-2 font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              {isSubmitting ? '만드는 중...' : '만들기'}
            </button>
          </form>
        </div>
      </div>
  )
}

export default CreateWorldPage