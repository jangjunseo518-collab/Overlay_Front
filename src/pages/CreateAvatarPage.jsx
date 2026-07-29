import { useState, useRef, useEffect } from 'react'
import { authFetch, BASE_URL } from '../utils/api'

const MAX_NAME_LENGTH = 30
const MAX_BIO_LENGTH = 500

function CreateAvatarPage({ onSuccess, onClose }) {
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!profileImage) {
      setImagePreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(profileImage)
    setImagePreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [profileImage])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append('name', name)
    formData.append('bio', bio)
    if (profileImage) {
      formData.append('profileImage', profileImage)
    }

    try {
      const response = await authFetch(`${BASE_URL}/api/avatars`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.message)
        return
      }

      alert('캐릭터가 생성되었습니다!')
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
        <div className="mx-auto max-w-sm px-4 py-6">
          <button
              onClick={onClose}
              className="mb-4 text-sm text-gray-500 hover:text-gray-700"
          >
            ← 취소하고 돌아가기
          </button>

          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
              캐릭터 만들기
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* 프로필 이미지 - 클릭하면 바로 파일 선택 */}
              <div className="flex justify-center">
                <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-gray-100 ring-1 ring-gray-200"
                >
                  {imagePreviewUrl ? (
                      <img
                          src={imagePreviewUrl}
                          alt="프로필 미리보기"
                          className="h-full w-full object-cover"
                      />
                  ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                        사진 추가
                      </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 text-xs font-medium text-white opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
                    변경
                  </div>
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfileImage(e.target.files[0])}
                    className="hidden"
                />
              </div>

              <div>
                <input
                    type="text"
                    placeholder="캐릭터 이름"
                    value={name}
                    onChange={(e) => {
                      if (e.target.value.length <= MAX_NAME_LENGTH) {
                        setName(e.target.value)
                      }
                    }}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                />
                <div className="mt-1 text-right text-xs text-gray-400">
                  {name.length}/{MAX_NAME_LENGTH}
                </div>
              </div>

              <div>
                <textarea
                    placeholder="소개글 (선택)"
                    value={bio}
                    onChange={(e) => {
                      if (e.target.value.length <= MAX_BIO_LENGTH) {
                        setBio(e.target.value)
                      }
                    }}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                />
                <div className="mt-1 text-right text-xs text-gray-400">
                  {bio.length}/{MAX_BIO_LENGTH}
                </div>
              </div>

              <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-blue-500 py-2 font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
              >
                {isSubmitting && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                {isSubmitting ? '만드는 중...' : '만들기'}
              </button>
            </form>
          </div>
        </div>
      </div>
  )
}

export default CreateAvatarPage