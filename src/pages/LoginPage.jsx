import { useState } from 'react'
import { BASE_URL } from '../utils/api'

function LoginPage({ onSwitchToSignUp, onLoginSuccess, onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
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
      onLoginSuccess()
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
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
            로그인
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
            />
            <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
            />
            <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-blue-500 py-2 font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              {isSubmitting ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            계정이 없으신가요?{' '}
            <span
                onClick={onSwitchToSignUp}
                className="cursor-pointer text-blue-500 hover:underline"
            >
            회원가입
          </span>
          </p>
        </div>
      </div>
  )
}

export default LoginPage