import { useState, useRef } from 'react'
import { authFetch, BASE_URL } from '../utils/api'

function CreatePostPage({ onSuccess, onClose }) {
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)

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
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="relative w-full max-w-sm rounded-2xl bg-white p-8 shadow-md">
          <button
              onClick={onClose}
              className="absolute left-4 top-4 text-2xl font-bold text-red-400 hover:text-red-600"
          >
            &times;
          </button>

          <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
            포스트 작성
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
              placeholder="무슨 일이 있었나요?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
          />

            <div className="flex flex-col gap-2">
              <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="w-fit rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                사진 선택
              </button>
              <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="hidden"
              />
              <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-500">
                {image ? image.name : '선택한 파일 없음'}
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
              {isSubmitting ? '게시 중...' : '게시하기'}
            </button>
          </form>
        </div>
      </div>
  )
}

export default CreatePostPage