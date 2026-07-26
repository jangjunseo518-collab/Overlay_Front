import { useState, useEffect } from 'react'
import { authFetch } from '../utils/api'

function DeleteAccountModal({ onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    authFetch('http://localhost:8080/api/auth/me')
    .then((res) => res.json())
    .then((data) => setEmail(data.email))
    .catch((err) => console.error(err))
  }, [])

  const handleDelete = async () => {
    if (!password) {
      alert('비밀번호를 입력해주세요.')
      return
    }

    if (!window.confirm('정말 탈퇴하시겠습니까? 모든 데이터가 삭제되며 되돌릴 수 없습니다.')) return

    try {
      const response = await authFetch('http://localhost:8080/api/auth/me', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.message)
        return
      }

      alert('회원 탈퇴가 완료되었습니다.')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userId')
      window.location.reload()
    } catch (error) {
      alert('오류가 발생했습니다.')
      console.error(error)
    }
  }

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
          <h2 className="mb-2 text-lg font-bold text-gray-800">회원 탈퇴</h2>
          <p className="mb-4 text-sm text-gray-500">
            <span className="font-semibold text-gray-700">{email}</span> 계정을
            탈퇴합니다.
          </p>

          <input
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-red-400"
          />

          <div className="flex justify-end gap-2">
            <button
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              취소
            </button>
            <button
                onClick={handleDelete}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
            >
              탈퇴하기
            </button>
          </div>
        </div>
      </div>
  )
}

export default DeleteAccountModal