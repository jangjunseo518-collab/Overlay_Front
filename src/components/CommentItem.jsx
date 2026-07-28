import { useState } from 'react'
import { authFetch, BASE_URL } from '../utils/api'

function CommentItem({ comment, isReply, onReplySubmit, onCommentChanged }) {
  const [liked, setLiked] = useState(comment.liked)
  const [likeCount, setLikeCount] = useState(comment.likeCount)
  const [showReplies, setShowReplies] = useState(false)
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)

  const myUserId = localStorage.getItem('userId')
  const isMine = String(comment.userId) === myUserId

  const handleToggleLike = async () => {
    const token = localStorage.getItem('accessToken')

    if (!token) {
      alert('로그인 또는 회원가입이 필요합니다.')
      return
    }

    try {
      const response = await authFetch(
          `${BASE_URL}/api/posts/comments/${comment.commentId}/like`,
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

  const handleReplySubmit = async () => {
    if (!replyContent.trim() || isSubmittingReply) return

    setIsSubmittingReply(true)
    try {
      await onReplySubmit(comment.commentId, replyContent)
      setReplyContent('')
      setShowReplyInput(false)
      setShowReplies(true)
    } finally {
      setIsSubmittingReply(false)
    }
  }

  const handleUpdate = async () => {
    if (!editContent.trim()) return

    try {
      const response = await authFetch(
          `${BASE_URL}/api/posts/comments/${comment.commentId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: editContent }),
          }
      )

      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.message)
        return
      }

      setIsEditing(false)
      onCommentChanged()
    } catch (error) {
      alert('오류가 발생했습니다.')
      console.error(error)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('이 댓글을 삭제하시겠습니까?')) return

    try {
      const response = await authFetch(
          `${BASE_URL}/api/posts/comments/${comment.commentId}`,
          {
            method: 'DELETE',
          }
      )

      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.message)
        return
      }

      onCommentChanged()
    } catch (error) {
      alert('오류가 발생했습니다.')
      console.error(error)
    }
  }

  return (
      <div className={isReply ? 'ml-10 mt-2' : 'mt-3'}>
        <div className="flex items-start gap-2">
          {comment.avatarProfileImageUrl ? (
              <img
                  src={comment.avatarProfileImageUrl}
                  alt={comment.avatarName}
                  className="h-7 w-7 shrink-0 rounded-full object-cover"
              />
          ) : (
              <div className="h-7 w-7 shrink-0 rounded-full bg-gray-200" />
          )}

          <div className="min-w-0 flex-1">
            {!isEditing && (
                <p className="text-sm">
                  <span className="font-semibold text-gray-800">{comment.avatarName}</span>{' '}
                  <span className="break-words text-gray-700">{comment.content}</span>
                </p>
            )}

            {isEditing && (
                <div className="flex gap-2">
                  <input
                      type="text"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-base outline-none focus:border-blue-500"
                  />
                  <button
                      onClick={handleUpdate}
                      className="rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-600"
                  >
                    저장
                  </button>
                  <button
                      onClick={() => {
                        setIsEditing(false)
                        setEditContent(comment.content)
                      }}
                      className="text-sm text-gray-400 hover:text-gray-600"
                  >
                    취소
                  </button>
                </div>
            )}

            {!isEditing && (
                <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
                  {!isReply && (
                      <button
                          onClick={() => setShowReplyInput((prev) => !prev)}
                          className="hover:text-gray-600"
                      >
                        답글쓰기
                      </button>
                  )}

                  {!isReply && comment.replies.length > 0 && (
                      <button
                          onClick={() => setShowReplies((prev) => !prev)}
                          className="hover:text-gray-600"
                      >
                        {showReplies ? '답글 숨기기' : `답글보기(${comment.replies.length})`}
                      </button>
                  )}

                  <button
                      onClick={handleToggleLike}
                      className="flex items-center gap-1 hover:text-gray-600"
                  >
                <span className={liked ? 'text-red-500' : 'text-gray-400'}>
                  {liked ? '♥' : '♡'}
                </span>
                    {likeCount > 0 && <span>{likeCount}</span>}
                  </button>

                  {isMine && (
                      <>
                        <button onClick={() => setIsEditing(true)} className="hover:text-gray-600">
                          수정
                        </button>
                        <button onClick={handleDelete} className="hover:text-red-500">
                          삭제
                        </button>
                      </>
                  )}
                </div>
            )}

            {showReplyInput && (
                <div className="mt-2 flex gap-2">
                  <input
                      type="text"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="답글 달기..."
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-base outline-none focus:border-blue-500"
                  />
                  <button
                      onClick={handleReplySubmit}
                      disabled={isSubmittingReply}
                      className="flex items-center justify-center gap-1 rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
                  >
                    {isSubmittingReply && (
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    )}
                    게시
                  </button>
                </div>
            )}
          </div>
        </div>

        {!isReply && showReplies && (
            <div>
              {comment.replies.map((reply) => (
                  <CommentItem
                      key={reply.commentId}
                      comment={reply}
                      isReply={true}
                      onReplySubmit={onReplySubmit}
                      onCommentChanged={onCommentChanged}
                  />
              ))}
            </div>
        )}
      </div>
  )
}

export default CommentItem