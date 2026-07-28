import { useState, useEffect } from 'react'
import CommentItem from './CommentItem'
import { authFetch, BASE_URL } from '../utils/api'

function CommentSection({ postId }) {
  const [comments, setComments] = useState([])
  const [showAll, setShowAll] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadComments = () => {
    const token = localStorage.getItem('accessToken')

    fetch(`${BASE_URL}/api/posts/${postId}/comments`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    .then((res) => res.json())
    .then((data) => setComments(data))
    .catch((err) => console.error(err))
  }

  useEffect(() => {
    loadComments()
  }, [postId])

  const postComment = async (parentCommentId, content) => {
    const token = localStorage.getItem('accessToken')

    if (!token) {
      alert('로그인 또는 회원가입이 필요합니다.')
      return
    }

    try {
      const response = await authFetch(
          `${BASE_URL}/api/posts/${postId}/comments`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ parentCommentId, content }),
          }
      )

      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.message)
        return
      }

      loadComments()
    } catch (error) {
      alert('오류가 발생했습니다.')
      console.error(error)
    }
  }

  const handleNewCommentSubmit = async () => {
    if (!newComment.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      await postComment(null, newComment)
      setNewComment('')
      setShowAll(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const visibleComments = showAll ? comments : comments.slice(0, 2)

  return (
      <div className="border-t border-gray-100 px-4 py-3">
        {visibleComments.map((comment) => (
            <CommentItem
                key={comment.commentId}
                comment={comment}
                isReply={false}
                onReplySubmit={postComment}
                onCommentChanged={loadComments}
            />
        ))}

        {comments.length > 2 && (
            <button
                onClick={() => setShowAll((prev) => !prev)}
                className="mt-2 text-sm text-gray-400 hover:text-gray-600"
            >
              {showAll ? '댓글 접기' : `댓글 ${comments.length}개 모두 보기`}
            </button>
        )}

        <div className="mt-3 flex gap-2">
          <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글 달기..."
              className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-base outline-none focus:border-blue-500"
          />
          <button
              onClick={handleNewCommentSubmit}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-1 rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {isSubmitting && (
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            게시
          </button>
        </div>
      </div>
  )
}

export default CommentSection