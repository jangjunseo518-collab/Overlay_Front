import { useState, useRef, useEffect } from 'react'
import { authFetch, BASE_URL } from '../utils/api'

const MAX_CONTENT_LENGTH = 1000

function CreatePostPage({ onSuccess, onClose }) {
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [myAvatar, setMyAvatar] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    authFetch(`${BASE_URL}/api/users/me/active-avatar`)
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => setMyAvatar(data))
    .catch((err) => console.error(err))
  }, [])

  useEffect(() => {
    if (!image) {
      setImagePreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(image)
    setImagePreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [image])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append('content', content)
    if (image) {
      formData.append('image', image)
    }

    try {
      const response = await authFetch(`${BASE_URL}/api/posts`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.message)
        return
      }

      alert('포스트가 작성되었습니다!')
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
            {/* 실제 PostCard와 동일한 프레임 */}
            <div className="relative overflow-hidden rounded-xl bg-white shadow-sm">
              {/* 캐릭터 프로필 */}
              <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50 px-4 py-3">
                {myAvatar?.profileImageUrl ? (
                    <img
                        src={myAvatar.profileImageUrl}
                        alt={myAvatar.name}
                        className="h-9 w-9 rounded-full object-cover"
                    />
                ) : (
                    <div className="h-9 w-9 rounded-full bg-gray-200" />
                )}
                <span className="font-semibold text-gray-800">
                  {myAvatar?.name || '캐릭터'}
                </span>
              </div>

              {/* 이미지 (있을 때만, 실제 포스트와 동일하게 정사각형) */}
              {imagePreviewUrl && (
                  <img
                      src={imagePreviewUrl}
                      alt="미리보기"
                      className="aspect-square w-full object-cover"
                  />
              )}

              {/* 본문 입력 (p 태그 자리에 textarea) */}
              <div className="p-4">
                <textarea
                    placeholder="무슨 일이 있었나요?"
                    value={content}
                    onChange={(e) => {
                      if (e.target.value.length <= MAX_CONTENT_LENGTH) {
                        setContent(e.target.value)
                      }
                    }}
                    rows={3}
                    className="w-full resize-none text-gray-800 outline-none placeholder:text-gray-400"
                />
                <div className="mt-1 text-right text-xs text-gray-400">
                  {content.length}/{MAX_CONTENT_LENGTH}
                </div>

                {/* 사진 선택/제거 - 댓글 입력창 자리 */}
                <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      {image ? '사진 변경' : '사진 추가'}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="hidden"
                    />
                    {image && (
                        <button
                            type="button"
                            onClick={() => setImage(null)}
                            className="text-xs text-gray-400 hover:text-red-500"
                        >
                          제거
                        </button>
                    )}
                  </div>

                  {/* 댓글 입력창 자리 -> 게시 버튼 */}
                  <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center justify-center gap-1 rounded-lg bg-blue-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
                  >
                    {isSubmitting && (
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    )}
                    {isSubmitting ? '게시 중...' : '게시'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
  )
}

export default CreatePostPage