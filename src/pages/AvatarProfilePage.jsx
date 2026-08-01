import {useState, useEffect, useRef} from 'react'
import PostCard from '../components/PostCard'
import AvatarListModal from '../components/AvatarListModal'
import {authFetch, BASE_URL} from '../utils/api'
import {useParams} from 'react-router-dom'
import FloatingActionMenu from '../components/FloatingActionMenu'

function AvatarProfilePage({
  onClose, onSwitchAvatar,
  onCreatePostClick, onWorldClick, onAvatarClick,
  onCreateAvatarClick, onCreateWorldClick, onWorldListClick
}) {
  const {avatarId} = useParams()
  const [avatar, setAvatar] = useState(null)
  const [posts, setPosts] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [profileImage, setProfileImage] = useState(null)
  const fileInputRef = useRef(null)

  const [world, setWorld] = useState(null)
  const [myAvatars, setMyAvatars] = useState([])
  const [showAvatarSwitch, setShowAvatarSwitch] = useState(false)
  const [activeAvatarId, setActiveAvatarId] = useState(null)

  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowings, setShowFollowings] = useState(false)
  const [followers, setFollowers] = useState([])
  const [followings, setFollowings] = useState([])

  // 연타 방지를 위한 로딩 상태값들
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false)
  const [isUpdatingImage, setIsUpdatingImage] = useState(false)
  const [isDeletingImage, setIsDeletingImage] = useState(false)
  const [isTogglingFollow, setIsTogglingFollow] = useState(false)
  const [isDeletingAvatar, setIsDeletingAvatar] = useState(false)
  const [isSwitchingAvatar, setIsSwitchingAvatar] = useState(false)

  const myUserId = localStorage.getItem('userId')

  const loadFollowers = () => {
    fetch(`${BASE_URL}/api/avatars/${avatarId}/followers`)
    .then((res) => res.json())
    .then((data) => setFollowers(data))
    .catch((err) => console.error(err))
  }

  const loadFollowings = () => {
    fetch(`${BASE_URL}/api/avatars/${avatarId}/followings`)
    .then((res) => res.json())
    .then((data) => setFollowings(data))
    .catch((err) => console.error(err))
  }

  const loadAvatar = () => {
    const token = localStorage.getItem('accessToken')

    fetch(`${BASE_URL}/api/avatars/${avatarId}`, {
      headers: token ? {Authorization: `Bearer ${token}`} : {},
    })
    .then((res) => res.json())
    .then((data) => {
      setAvatar(data)
      setName(data.name)
      setBio(data.bio || '')

      return fetch(`${BASE_URL}/api/worlds/${data.worldId}`)
    })
    .then((res) => res.json())
    .then((worldData) => setWorld(worldData))
    .catch((err) => console.error(err))
  }

  const loadPosts = () => {
    fetch(`${BASE_URL}/api/avatars/${avatarId}/posts`)
    .then((res) => res.json())
    .then((data) => setPosts(data))
    .catch((err) => console.error(err))
  }

  const loadMyAvatars = () => {
    authFetch(`${BASE_URL}/api/avatars/me`)
    .then((res) => res.json())
    .then((data) => setMyAvatars(data))
    .catch((err) => console.error(err))
  }

  const loadActiveAvatarId = () => {
    authFetch(`${BASE_URL}/api/users/me/active-avatar`)
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (data) {
        setActiveAvatarId(data.avatarId)
      }
    })
    .catch((err) => console.error(err))
  }

  useEffect(() => {
    loadAvatar()
    loadActiveAvatarId()
    loadPosts()
  }, [avatarId])

  const isMine = avatar && String(avatar.userId) === myUserId

  const handleUpdateInfo = async (e) => {
    e.preventDefault()
    if (isUpdatingInfo) {
      return
    }
    setIsUpdatingInfo(true)

    try {
      const response = await authFetch(`${BASE_URL}/api/avatars/${avatarId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name, bio}),
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.message)
        return
      }

      alert('정보가 수정되었습니다.')
      setIsEditing(false)
      loadAvatar()
    } catch (error) {
      alert('오류가 발생했습니다.')
      console.error(error)
    } finally {
      setIsUpdatingInfo(false)
    }
  }

  const handleDeleteImage = async () => {
    if (isDeletingImage) {
      return
    }
    if (!window.confirm('프로필 이미지를 삭제하시겠습니까?')) {
      return
    }

    setIsDeletingImage(true)
    try {
      const response = await authFetch(
          `${BASE_URL}/api/avatars/${avatarId}/image`, {
            method: 'DELETE',
          })

      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.message)
        return
      }

      alert('프로필 이미지가 삭제되었습니다.')
      loadAvatar()
    } catch (error) {
      alert('오류가 발생했습니다.')
      console.error(error)
    } finally {
      setIsDeletingImage(false)
    }
  }

  const handleToggleFollow = async () => {
    const token = localStorage.getItem('accessToken')

    if (!token) {
      alert('로그인 또는 회원가입이 필요합니다.')
      return
    }

    if (isTogglingFollow) {
      return
    }
    setIsTogglingFollow(true)

    try {
      const response = await authFetch(
          `${BASE_URL}/api/avatars/${avatarId}/follow`,
          {
            method: 'POST',
          }
      )

      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.message)
        return
      }

      loadAvatar()
    } catch (error) {
      alert('오류가 발생했습니다.')
      console.error(error)
    } finally {
      setIsTogglingFollow(false)
    }
  }

  const handleUpdateImage = async () => {
    if (!profileImage) {
      return
    }
    if (isUpdatingImage) {
      return
    }
    setIsUpdatingImage(true)

    const formData = new FormData()
    formData.append('profileImage', profileImage)

    try {
      const response = await authFetch(
          `${BASE_URL}/api/avatars/${avatarId}/image`,
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

      alert('프로필 이미지가 변경되었습니다.')
      setProfileImage(null)
      loadAvatar()
    } catch (error) {
      alert('오류가 발생했습니다.')
      console.error(error)
    } finally {
      setIsUpdatingImage(false)
    }
  }

  const handleSwitchAvatar = async (newAvatarId) => {
    if (isSwitchingAvatar) {
      return
    }
    setIsSwitchingAvatar(true)

    try {
      const response = await authFetch(
          `${BASE_URL}/api/users/me/active-avatar?avatarId=${newAvatarId}`,
          {method: 'PATCH'}
      )

      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.message)
        return
      }

      alert('캐릭터가 전환되었습니다.')
      setShowAvatarSwitch(false)
      onSwitchAvatar(newAvatarId)
    } catch (error) {
      alert('오류가 발생했습니다.')
      console.error(error)
    } finally {
      setIsSwitchingAvatar(false)
    }
  }

  const handleDeleteAvatar = async () => {
    if (isDeletingAvatar) {
      return
    }
    if (!window.confirm('이 캐릭터를 삭제하시겠습니까? 작성한 게시글도 함께 삭제됩니다.')) {
      return
    }

    setIsDeletingAvatar(true)
    try {
      const response = await authFetch(`${BASE_URL}/api/avatars/${avatarId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.message)
        return
      }

      alert('캐릭터가 삭제되었습니다.')
      onClose()
    } catch (error) {
      alert('오류가 발생했습니다.')
      console.error(error)
    } finally {
      setIsDeletingAvatar(false)
    }
  }

  if (!avatar) {
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

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              {avatar.profileImageUrl ? (
                  <img
                      src={avatar.profileImageUrl}
                      alt={avatar.name}
                      className="h-20 w-20 shrink-0 rounded-full object-cover"
                  />
              ) : (
                  <div className="h-20 w-20 shrink-0 rounded-full bg-gray-200"/>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h1 className="truncate text-xl font-bold text-gray-800">{avatar.name}</h1>

                  {Number(avatarId) === Number(activeAvatarId) && (
                      <button
                          onClick={onCreatePostClick}
                          className="shrink-0 rounded-lg bg-blue-500 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-600 sm:px-4 sm:py-1.5 sm:text-sm"
                      >
                        새 포스트 작성
                      </button>
                  )}
                </div>

                {world && (
                    <p
                        onClick={() => onWorldClick(world.worldId)}
                        className="cursor-pointer text-sm text-gray-400 hover:text-gray-600 hover:underline"
                    >
                      {world.name}
                    </p>
                )}
                <p className="whitespace-pre-wrap break-words text-sm text-gray-500">
                  {avatar.bio}
                </p>

                <div
                    className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                  <button
                      onClick={() => {
                        loadFollowers()
                        setShowFollowers(true)
                      }}
                      className="hover:underline"
                  >
                    팔로워 {avatar.followerCount}
                  </button>
                  <button
                      onClick={() => {
                        loadFollowings()
                        setShowFollowings(true)
                      }}
                      className="hover:underline"
                  >
                    팔로잉 {avatar.followingCount}
                  </button>
                </div>

                {!isMine && (
                    <button
                        onClick={handleToggleFollow}
                        disabled={isTogglingFollow}
                        className={`mt-2 inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-semibold disabled:opacity-50 ${
                            avatar.isFollowing
                                ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                    >
                      {isTogglingFollow && (
                          <span
                              className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"/>
                      )}
                      {avatar.isFollowing ? '팔로잉' : '팔로우'}
                    </button>
                )}
              </div>
            </div>

            {isMine && !isEditing && (
                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="rounded-lg border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      프로필 수정
                    </button>

                    {Number(avatarId) === Number(activeAvatarId) && (
                        <button
                            onClick={() => {
                              setShowAvatarSwitch((prev) => !prev)
                              if (!showAvatarSwitch) {
                                loadMyAvatars()
                              }
                            }}
                            className="rounded-lg border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          캐릭터 변경
                        </button>
                    )}

                    <button
                        onClick={handleDeleteAvatar}
                        disabled={isDeletingAvatar}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 px-4 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 disabled:opacity-50"
                    >
                      {isDeletingAvatar && (
                          <span
                              className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-500 border-t-transparent"/>
                      )}
                      {isDeletingAvatar ? '삭제 중...' : '캐릭터 삭제'}
                    </button>
                  </div>

                  {showAvatarSwitch && (
                      <div
                          className="flex flex-col gap-1 rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
                        {myAvatars.map((a) => (
                            <button
                                key={a.avatarId}
                                onClick={() => handleSwitchAvatar(a.avatarId)}
                                disabled={isSwitchingAvatar}
                                className="flex items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-gray-50 disabled:opacity-50"
                            >
                              <div
                                  className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-gray-200">
                                {a.profileImageUrl && (
                                    <img
                                        src={a.profileImageUrl}
                                        alt={a.name}
                                        className="h-full w-full object-cover"
                                    />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-gray-800">
                                  {a.name}
                                </p>
                                <p className="truncate text-xs text-gray-400">
                                  {a.worldName}
                                </p>
                              </div>
                            </button>
                        ))}
                      </div>
                  )}
                </div>
            )}

            {isMine && isEditing && (
                <div
                    className="mt-4 flex flex-col gap-3 border-t border-gray-200 pt-4">
                  <form onSubmit={handleUpdateInfo}
                        className="flex flex-col gap-2">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-base outline-none focus:border-blue-500"
                    />
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={2}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-base outline-none focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={isUpdatingInfo}
                        className="flex items-center justify-center gap-2 rounded-lg bg-blue-500 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
                    >
                      {isUpdatingInfo && (
                          <span
                              className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"/>
                      )}
                      {isUpdatingInfo ? '저장 중...' : '정보 저장'}
                    </button>
                  </form>

                  <div className="flex flex-col gap-2">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="w-fit rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      새 프로필 사진 선택
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProfileImage(e.target.files[0])}
                        className="hidden"
                    />
                    <div
                        className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-500">
                      {profileImage ? profileImage.name : '선택한 파일 없음'}
                    </div>
                    <button
                        onClick={handleUpdateImage}
                        disabled={isUpdatingImage || !profileImage}
                        className="flex items-center justify-center gap-2 rounded-lg bg-gray-800 py-2 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-50"
                    >
                      {isUpdatingImage && (
                          <span
                              className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"/>
                      )}
                      {isUpdatingImage ? '적용 중...' : '사진 변경 적용'}
                    </button>
                    <button
                        onClick={handleDeleteImage}
                        disabled={isDeletingImage}
                        className="flex items-center justify-center gap-2 rounded-lg border border-red-300 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50"
                    >
                      {isDeletingImage && (
                          <span
                              className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"/>
                      )}
                      {isDeletingImage ? '삭제 중...' : '프로필 사진 삭제'}
                    </button>
                  </div>

                  <button
                      onClick={() => setIsEditing(false)}
                      className="text-sm text-gray-400 hover:text-gray-600"
                  >
                    수정 취소
                  </button>
                </div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-4">
            {posts.map((post) => (
                <PostCard
                    key={post.postId}
                    post={post}
                    onAvatarClick={() => {}}
                    onWorldClick={onWorldClick}
                    showWorldBadge={true}
                    onPostChanged={loadPosts}
                />
            ))}
          </div>

          <div className="sticky bottom-16 flex justify-end pr-2">
            <FloatingActionMenu
                onCreateAvatarClick={onCreateAvatarClick}
                onCreateWorldClick={onCreateWorldClick}
                onCreatePostClick={onCreatePostClick}
                onWorldListClick={onWorldListClick}
                onAvatarClick={onAvatarClick}
            />
          </div>
        </div>

        {showFollowers && (
            <AvatarListModal
                title="팔로워"
                avatars={followers}
                onClose={() => setShowFollowers(false)}
                onAvatarClick={onAvatarClick}
            />
        )}

        {showFollowings && (
            <AvatarListModal
                title="팔로잉"
                avatars={followings}
                onClose={() => setShowFollowings(false)}
                onAvatarClick={onAvatarClick}
            />
        )}
      </div>
  )
}

export default AvatarProfilePage