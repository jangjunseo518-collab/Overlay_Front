import { useState } from 'react'
import { BASE_URL } from '../utils/api'

function VerifyEmailPage({ email, onVerifySuccess, onClose }) {
  const [code, setCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const response = await fetch(`${BASE_URL}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.message)
        return
      }

      const data = await response.json()
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('userId', data.userId)

      alert('인증이 완료되었습니다!')
      onVerifySuccess()
    } catch (error) {
      alert('오류가 발생했습니다.')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
      <div className="relative flex min-h-screen items-center justify-center bg-gray-50">
        <button
            onClick={onClose}
            className="absolute left-4 top-4 text-2xl text-gray-400 hover:text-gray-600"
        >
          &times;
        </button>

        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-md">
          <h1 className="mb-2 text-center text-2xl font-bold text-gray-800">
            이메일 인증
          </h1>
          <p className="mb-6 text-center text-sm text-gray-500">
            {email}로 발송된 6자리 코드를 입력해주세요.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
                type="text"
                placeholder="인증 코드 6자리"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                className="rounded-lg border border-gray-300 px-4 py-2 text-center text-lg tracking-widest outline-none focus:border-blue-500"
            />
            <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-blue-500 py-2 font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              {isSubmitting ? '인증 중...' : '인증하기'}
            </button>
          </form>
        </div>
      </div>
  )
}

export default VerifyEmailPage