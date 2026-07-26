import { useState, useRef, useEffect } from 'react'
import CommentSection from './CommentSection'
import { authFetch } from '../utils/api'

function PostCard({ post, onAvatarClick, onWorldClick, showWorldBadge = true, onPostChanged }) {
  const [liked, setLiked] = useState(post.liked)
  const [likeCount, setLikeCount] = useState(post.likeCount)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(post.content)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const myUserId = localStorage.getItem('userId')
  const isMine = String(post.userId) === myUserId

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggleLike = async () => {
    const token = localStorage.getItem('accessToken')

    if (!token) {
      alert('로그인 또는 회원가입이 필요합니다.')
      return
    }

    try {
      const response = await authFetch(
          `http://localhost:8080/api/posts/${post.postId}/like`,
          {
            method: 'POST',
          }
      )

      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.message)
        return
      }

      const data = await response.json()
      setLiked(data.liked)
      setLikeCount(data.likeCount)
    } catch (error) {
      alert('오류가 발생했습니다.')
      console.error(error)
    }
  }

  const handleUpdate = async () => {
    if (!editContent.trim()) return

    try {
      const response = await authFetch(`http://localhost:8080/api/posts/${post.postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: editContent }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.message)
        return
      }

      setIsEditing(false)
      if (onPostChanged) onPostChanged()
    } catch (error) {
      alert('오류가 발생했습니다.')
      console.error(error)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('이 게시글을 삭제하시겠습니까?')) return

    try {
      const response = await authFetch(`http://localhost:8080/api/posts/${post.postId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.message)
        return
      }

      if (onPostChanged) onPostChanged()
    } catch (error) {
      alert('오류가 발생했습니다.')
      console.error(error)
    }
  }

  const handleReport = async () => {
    const reason = window.prompt('신고 사유를 입력해주세요.')
    if (!reason || !reason.trim()) return

    const token = localStorage.getItem('accessToken')

    if (!token) {
      alert('로그인 또는 회원가입이 필요합니다.')
      return
    }

    try {
      const response = await authFetch('http://localhost:8080/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetType: 'POST',
          targetId: post.postId,
          reason,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.message)
        return
      }

      alert('신고가 접수되었습니다.')
    } catch (error) {
      alert('오류가 발생했습니다.')
      console.error(error)
    }
  }

  return (
      <div className="relative overflow-hidden rounded-xl bg-white shadow-sm">
        {showWorldBadge && (
            <span
                onClick={() => onWorldClick(post.worldId)}
                className="absolute right-3 top-3 cursor-pointer rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white"
            >
          {post.worldName}
        </span>
        )}

        <div className="flex items-center gap-3 px-4 py-3">
          <div
              className="flex cursor-pointer items-center gap-3"
              onClick={() => onAvatarClick(post.characterId)}
          >
            {post.characterProfileImageUrl ? (
                <img
                    src={post.characterProfileImageUrl}
                    alt={post.characterName}
                    className="h-9 w-9 rounded-full object-cover"
                />
            ) : (
                <div className="h-9 w-9 rounded-full bg-gray-200" />
            )}
            <span className="font-semibold text-gray-800">{post.characterName}</span>
          </div>
        </div>

        {post.imageUrl && (
            <img
                src={post.imageUrl}
                alt="post"
                className="aspect-square w-full object-cover"
            />
        )}

        <div className="p-4">
          {!isEditing && <p className="break-words text-gray-800">{post.content}</p>}

          {isEditing && (
              <div className="flex flex-col gap-2">
            <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
                <div className="flex gap-2">
                  <button
                      onClick={handleUpdate}
                      className="rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-600"
                  >
                    저장
                  </button>
                  <button
                      onClick={() => {
                        setIsEditing(false)
                        setEditContent(post.content)
                      }}
                      className="text-sm text-gray-400 hover:text-gray-600"
                  >
                    취소
                  </button>
                </div>
              </div>
          )}

          <div className="mt-3 flex items-center justify-between">
            <button onClick={handleToggleLike} className="flex items-center gap-1.5 text-sm">
            <span className={liked ? 'text-red-500' : 'text-gray-400'}>
              {liked ? '♥' : '♡'}
            </span>
              <span className="text-gray-500">{likeCount}</span>
            </button>

            {!isEditing && (
                <div className="relative" ref={menuRef}>
                  <button
                      onClick={() => setIsMenuOpen((prev) => !prev)}
                      className="px-2 py-1 text-2xl leading-none text-gray-300 hover:text-black"
                  >
                    ⋯
                  </button>

                  {isMenuOpen && (
                      <div className="absolute right-0 top-8 z-10 flex w-24 flex-col gap-1 rounded-lg border border-gray-200 bg-white p-1.5 shadow-md">
                        {isMine && (
                            <>
                              <button
                                  onClick={() => {
                                    setIsEditing(true)
                                    setIsMenuOpen(false)
                                  }}
                                  className="rounded-md bg-blue-500 py-1.5 text-sm font-semibold text-white hover:bg-blue-600"
                              >
                                수정
                              </button>
                              <button
                                  onClick={() => {
                                    setIsMenuOpen(false)
                                    handleDelete()
                                  }}
                                  className="rounded-md bg-red-500 py-1.5 text-sm font-semibold text-white hover:bg-red-600"
                              >
                                삭제
                              </button>
                            </>
                        )}

                        {!isMine && (
                            <button
                                onClick={() => {
                                  setIsMenuOpen(false)
                                  handleReport()
                                }}
                                className="rounded-md bg-gray-500 py-1.5 text-sm font-semibold text-white hover:bg-gray-600"
                            >
                              신고하기
                            </button>
                        )}
                      </div>
                  )}
                </div>
            )}
          </div>
        </div>

        <CommentSection postId={post.postId} />
      </div>
  )
}

export default PostCard