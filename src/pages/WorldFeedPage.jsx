import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import PostCard from '../components/PostCard'
import AvatarListModal from '../components/AvatarListModal'
import { authFetch, BASE_URL } from '../utils/api'
import FloatingActionMenu from '../components/FloatingActionMenu'

function WorldFeedPage({ isLoggedIn, onClose, onAvatarClick,
  onCreatePostClick, onCreateAvatarClick, onCreateWorldClick, onWorldListClick }) {
  const { worldId } = useParams()
  const [world, setWorld] = useState(null)
  const [posts, setPosts] = useState([])
  const fileInputRef = useRef(null)
  const coverFileInputRef = useRef(null)
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [myActiveWorldId, setMyActiveWorldId] = useState(null)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [showResidents, setShowResidents] = useState(false)
  const [residents, setResidents] = useState([])

  // 연타 방지용 상태 관리
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false)
  const [isMigrating, setIsMigrating] = useState(false)
  const [isDeletingWorld, setIsDeletingWorld] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  const loadResidents = () => {
    fetch(`${BASE_URL}/api/avatars/world/${worldId}`)
    .then((res) => res.json())
    .then((data) => setResidents(data))
    .catch((err) => console.error(err))
  }

  const myUserId = localStorage.getItem('userId')

  const loadWorld = () => {
    const token = localStorage.getItem('accessToken')

    fetch(`${BASE_URL}/api/worlds/${worldId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    .then((res) => res.json())
    .then((data) => {
      setWorld(data)
      setName(data.name)
      setDescription(data.description || '')
      setLiked(data.liked)
      setLikeCount(data.likeCount)
    })
    .catch((err) => console.error(err))
  }

  const handleToggleLike = async () => {
    const token = localStorage.getItem('accessToken')

    if (!token) {
      alert('로그인 또는 회원가입이 필요합니다.')
      return
    }

    if (isLiking) return
    setIsLiking(true)

    try {
      const response = await authFetch(`${BASE_URL}/api/worlds/${worldId}/like`, {
        method: 'POST',
      })

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
    } finally {
      setIsLiking(false)
    }
  }

  const handleUpdateInfo = async (e) => {
    e.preventDefault()
    if (isUpdatingInfo) return
    setIsUpdatingInfo(true)

    try {
      const response = await authFetch(`${BASE_URL}/api/worlds/${worldId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.message)
        return
      }

      alert('세계관 정보가 수정되었습니다.')
      setIsEditing(false)
      loadWorld()
    } catch (error) {
      alert('오류가 발생했습니다.')
      console.error(error)
    } finally {
      setIsUpdatingInfo(false)
    }
  }

  const handleMigrate = async () => {
    if (isMigrating) return
    setIsMigrating(true)

    try {
      const response = await authFetch(
          `${BASE_URL}/api/avatars/world?worldId=${worldId}`,
          { method: 'PATCH' }
      )
      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.message)
        return
      }
      alert('세계관 이주가 완료되었습니다!')
      setMyActiveWorldId(worldId)
      loadWorld()
    } catch (error) {
      alert('오류가 발생했습니다.')
      console.error(error)
    } finally {
      setIsMigrating(false)
    }
  }

  const handleDeleteWorld = async () => {
    if (isDeletingWorld) return
    if (!window.confirm('이 세계관을 삭제하시겠습니까? 되돌릴 수 없습니다.')) return

    setIsDeletingWorld(true)
    try {
      const response = await authFetch(`${BASE_URL}/api/worlds/${worldId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.message)
        return
      }

      alert('세계관이 삭제되었습니다.')
      onClose()
    } catch (error) {
      alert('오류가 발생했습니다.')
      console.error(error)
    } finally {
      setIsDeletingWorld(false)
    }
  }

  const uploadImage = async (file, endpoint, fieldName, successMessage) => {
    if (isUploadingImage) return
    setIsUploadingImage(true)

    const formData = new FormData()
    formData.append(fieldName, file)

    try {
      const response = await authFetch(
          `${BASE_URL}/api/worlds/${worldId}/${endpoint}`,
          {
            method: 'PATCH',
            body: formData,
          }
      )

      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.message)
        return
      }

      alert(successMessage)
      loadWorld()
    } catch (error) {
      alert('오류가 발생했습니다.')
      console.error(error)
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleProfileImageSelected = (e) => {
    const file = e.target.files[0]
    if (!file) return
    uploadImage(file, 'profile-image', 'profileImage', '프로필 이미지가 변경되었습니다.')
  }

  const handleCoverImageSelected = (e) => {
    const file = e.target.files[0]
    if (!file) return
    uploadImage(file, 'image', 'coverImage', '배경 이미지가 변경되었습니다.')
  }

  useEffect(() => {
    loadWorld()

    const token = localStorage.getItem('accessToken')
    fetch(`${BASE_URL}/api/posts/feed/worlds/${worldId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    .then((res) => res.json())
    .then((data) => setPosts(data))
    .catch((err) => console.error(err))

    if (isLoggedIn) {
      authFetch(`${BASE_URL}/api/users/me/active-avatar`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setMyActiveWorldId(data.worldId)
      })
      .catch((err) => console.error(err))
    }
  }, [worldId, isLoggedIn])

  const isMine = world && String(world.creatorId) === myUserId

  if (!world) {
    return <div className="p-6 text-center text-gray-400">불러오는 중...</div>
  }

  return (
      <div className="min-h-screen bg-gray-100">
        <div className="mx-auto max-w-xl px-4 py-6">
          <button
              onClick={onClose}
              className="mb-4 text-sm text-gray-500 hover:text-gray-700"
          >
            ← 피드로 돌아가기
          </button>

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div
                onClick={() => isMine && !isUploadingImage && coverFileInputRef.current.click()}
                className={`flex h-40 w-full items-center justify-center bg-gray-200 ${
                    isMine ? 'cursor-pointer hover:bg-gray-300' : ''
                }`}
            >
              {world.coverImageUrl ? (
                  <img
                      src={world.coverImageUrl}
                      alt={world.name}
                      className="h-full w-full object-cover"
                  />
              ) : (
                  isMine && <span className="text-sm text-gray-500">이미지 추가</span>
              )}
            </div>
            {isMine && (
                <input
                    ref={coverFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageSelected}
                    className="hidden"
                />
            )}

            <div className="px-6">
              <div
                  onClick={() => isMine && !isUploadingImage && fileInputRef.current.click()}
                  className={`-mt-10 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-200 ${
                      isMine ? 'cursor-pointer hover:bg-gray-300' : ''
                  }`}
              >
                {world.profileImageUrl ? (
                    <img
                        src={world.profileImageUrl}
                        alt={world.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    isMine && (
                        <span className="text-center text-[10px] text-gray-500">
                    이미지 추가
                  </span>
                    )
                )}
              </div>
              {isMine && (
                  <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageSelected}
                      className="hidden"
                  />
              )}

              <div className="py-4">
                <h1 className="text-xl font-bold text-gray-800">{world.name}</h1>
                <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                  <button
                      onClick={() => {
                        loadResidents()
                        setShowResidents(true)
                      }}
                      className="hover:underline"
                  >
                    주민 {world.population}명
                  </button>
                  <button
                      onClick={handleToggleLike}
                      disabled={isLiking}
                      className="flex items-center gap-1 text-sm"
                  >
                  <span className={liked ? 'text-red-500' : 'text-gray-400'}>
                    {liked ? '♥' : '♡'}
                  </span>
                    <span className="text-gray-500">{likeCount}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-500">소개</h2>
                {isMine && !isEditing && (
                    <div className="flex gap-2">
                      <button
                          onClick={() => setIsEditing(true)}
                          className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        수정
                      </button>
                      <button
                          onClick={handleDeleteWorld}
                          disabled={isDeletingWorld}
                          className="text-xs text-red-400 hover:text-red-600 disabled:opacity-50"
                      >
                        {isDeletingWorld ? '삭제 중...' : '삭제'}
                      </button>
                    </div>
                )}
              </div>

              {!isEditing && (
                  <p className="whitespace-pre-wrap break-words text-sm text-gray-700">
                    {world.description || '아직 소개글이 없습니다.'}
                  </p>
              )}

              {isEditing && (
                  <form onSubmit={handleUpdateInfo} className="flex flex-col gap-2">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                    <div className="flex gap-2">
                      <button
                          type="submit"
                          disabled={isUpdatingInfo}
                          className="flex items-center gap-1.5 rounded-lg bg-blue-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
                      >
                        {isUpdatingInfo && (
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        )}
                        {isUpdatingInfo ? '저장 중...' : '저장'}
                      </button>
                      <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="text-sm text-gray-400 hover:text-gray-600"
                      >
                        취소
                      </button>
                    </div>
                  </form>
              )}
            </div>

            {isLoggedIn && myActiveWorldId !== world.worldId && (
                <div className="border-t border-gray-200 px-6 py-4">
                  <button
                      onClick={handleMigrate}
                      disabled={isMigrating}
                      className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    {isMigrating && (
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-700 border-t-transparent" />
                    )}
                    {isMigrating ? '이주 처리 중...' : '이 세계관으로 이주하기'}
                  </button>
                </div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-4">
            {posts.map((post) => (
                <PostCard
                    key={post.postId}
                    post={post}
                    onAvatarClick={onAvatarClick}
                    showWorldBadge={false}
                />
            ))}
          </div>

          <div className="sticky bottom-16 flex justify-end pr-2">
            <FloatingActionMenu
                onCreateAvatarClick={onCreateAvatarClick}
                onCreateWorldClick={onCreateWorldClick}
                onCreatePostClick={onCreatePostClick}
                onWorldListClick={onWorldListClick}
            />
          </div>
        </div>
        {showResidents && (
            <AvatarListModal
                title="주민 목록"
                avatars={residents}
                onClose={() => setShowResidents(false)}
                onAvatarClick={onAvatarClick}
            />
        )}

       </div>
  )
}

export default WorldFeedPage