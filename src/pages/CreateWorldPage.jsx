import { useState } from 'react'
import { authFetch } from '../utils/api'

function CreateWorldPage({ onSuccess, onClose }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [genre, setGenre] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await authFetch('http://localhost:8080/api/worlds', {
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
            세계관 만들기
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
                type="text"
                placeholder="세계관 이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
            />
            <textarea
                placeholder="설명 (선택)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
            />
            <input
                type="text"
                placeholder="장르 (선택)"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
            />
            <button
                type="submit"
                className="mt-2 rounded-lg bg-blue-500 py-2 font-semibold text-white hover:bg-blue-600"
            >
              만들기
            </button>
          </form>
        </div>
      </div>
  )
}

export default CreateWorldPage