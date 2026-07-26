import { useState } from 'react'
import { BASE_URL } from '../utils/api'

function SignUpPage({ onSwitchToLogin, onClose, onSignUpSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, nickname }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.message)
        return
      }

      alert('인증 코드가 이메일로 발송되었습니다.')
      onSignUpSuccess(email)
    } catch (error) {
      alert('오류가 발생했습니다.')
      console.error(error)
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
            회원가입
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
            <input
                type="text"
                placeholder="닉네임"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
            />
            <button
                type="submit"
                className="mt-2 rounded-lg bg-blue-500 py-2 font-semibold text-white hover:bg-blue-600"
            >
              가입하기
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            이미 계정이 있으신가요?{' '}
            <span
                onClick={onSwitchToLogin}
                className="cursor-pointer text-blue-500 hover:underline"
            >
            로그인
          </span>
          </p>
        </div>
      </div>
  )
}

export default SignUpPage