import { useState, useEffect, useRef } from 'react'
import PostCard from '../components/PostCard'
import AvatarListModal from '../components/AvatarListModal'
import { authFetch } from '../utils/api'

function AvatarProfilePage({ avatarId, onClose, onSwitchAvatar,
  onCreatePostClick, onWorldClick, onAvatarClick }) {
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

  const myUserId = localStorage.getItem('userId')

  const loadFollowers = () => {
    fetch(`http://localhost:8080/api/avatars/${avatarId}/followers`)
    .then((res) => res.json())
    .then((data) => setFollowers(data))
    .catch((err) => console.error(err))
  }

  const loadFollowings = () => {
    fetch(`http://localhost:8080/api/avatars/${avatarId}/followings`)
    .then((res) => res.json())
    .then((data) => setFollowings(data))
    .catch((err) => console.error(err))
  }

  const loadAvatar = () => {
    const token = localStorage.getItem('accessToken')

    fetch(`http://localhost:8080/api/avatars/${avatarId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    .then((res) => res.json())
    .then((data) => {
      setAvatar(data)
      setName(data.name)
      setBio(data.bio || '')

      return fetch(`http://localhost:8080/api/worlds/${data.worldId}`)
    })
    .then((res) => res.json())
    .then((worldData) => setWorld(worldData))
    .catch((err) => console.error(err))
  }

  const loadPosts = () => {
    fetch(`http://localhost:8080/api/avatars/${avatarId}/posts`)
    .then((res) => res.json())
    .then((data) => setPosts(data))
    .catch((err) => console.error(err))
  }

  const loadMyAvatars = () => {
    authFetch('http://localhost:8080/api/avatars/me')
    .then((res) => res.json())
    .then((data) => setMyAvatars(data))
    .catch((err) => console.error(err))
  }

  const loadActiveAvatarId = () => {
    authFetch('http://localhost:8080/api/users/me/active-avatar')
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (data) setActiveAvatarId(data.avatarId)
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

    try {
      const response = await authFetch(`http://localhost:8080/api/avatars/${avatarId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, bio }),
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
    }
  }

  const handleDeleteImage = async () => {
    if (!window.confirm('프로필 이미지를 삭제하시겠습니까?')) return

    try {
      const response = await authFetch(`http://localhost:8080/api/avatars/${avatarId}/image`, {
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
    }
  }

  const handleDeleteAvatar = async () => {
    if (!window.confirm('이 캐릭터를 삭제하시겠습니까? 작성한 게시글도 함께 삭제됩니다.')) return

    try {
      const response = await authFetch(`http://localhost:8080/api/avatars/${avatarId}`, {
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
    }
  }

  const handleToggleFollow = async () => {
    const token = localStorage.getItem('accessToken')

    if (!token) {
      alert('로그인 또는 회원가입이 필요합니다.')
      return
    }

    try {
      const response = await authFetch(
          `http://localhost:8080/api/avatars/${avatarId}/follow`,
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
    }
  }

  const handleUpdateImage = async () => {
    if (!profileImage) return

    const formData = new FormData()
    formData.append('profileImage', profileImage)

    try {
      const response = await authFetch(
          `http://localhost:8080/api/avatars/${avatarId}/image`,
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
    }
  }

  const handleSwitchAvatar = async (newAvatarId) => {
    try {
      const response = await authFetch(
          `http://localhost:8080/api/users/me/active-avatar?avatarId=${newAvatarId}`,
          {
            method: 'PATCH',
          }
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
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {avatar.profileImageUrl ? (
                    <img
                        src={avatar.profileImageUrl}
                        alt={avatar.name}
                        className="h-20 w-20 shrink-0 rounded-full object-cover"
                    />
                ) : (
                    <div className="h-20 w-20 shrink-0 rounded-full bg-gray-200" />
                )}
                <div>
                  <h1 className="text-xl font-bold text-gray-800">{avatar.name}</h1>
                  {world && (
                      <p
                          onClick={() => onWorldClick(world.worldId)}
                          className="cursor-pointer text-sm text-gray-400 hover:text-gray-600 hover:underline"
                      >
                        {world.name}
                      </p>
                  )}
                  <p className="text-sm text-gray-500">{avatar.bio}</p>

                  <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
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
                          className={`mt-2 rounded-lg px-4 py-1.5 text-sm font-semibold ${
                              avatar.isFollowing
                                  ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                  : 'bg-blue-500 text-white hover:bg-blue-600'
                          }`}
                      >
                        {avatar.isFollowing ? '팔로잉' : '팔로우'}
                      </button>
                  )}
                </div>
              </div>

              {Number(avatarId) === Number(activeAvatarId) && (
                  <button
                      onClick={onCreatePostClick}
                      className="shrink-0 rounded-lg bg-blue-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-600"
                  >
                    새 포스트 작성
                  </button>
              )}
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
                              if (!showAvatarSwitch) loadMyAvatars()
                            }}
                            className="rounded-lg border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          캐릭터 변경
                        </button>
                    )}

                    <button
                        onClick={handleDeleteAvatar}
                        className="rounded-lg border border-red-300 px-4 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50"
                    >
                      캐릭터 삭제
                    </button>
                  </div>

                  {showAvatarSwitch && (
                      <div className="flex flex-col gap-1 rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
                        {myAvatars.map((a) => (
                            <button
                                key={a.avatarId}
                                onClick={() => handleSwitchAvatar(a.avatarId)}
                                className="flex items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-gray-50"
                            >
                              <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-gray-200">
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
                <div className="mt-4 flex flex-col gap-3 border-t border-gray-200 pt-4">
                  <form onSubmit={handleUpdateInfo} className="flex flex-col gap-2">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                    />
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={2}
                        className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        className="rounded-lg bg-blue-500 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                    >
                      정보 저장
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
                    <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-500">
                      {profileImage ? profileImage.name : '선택한 파일 없음'}
                    </div>
                    <button
                        onClick={handleUpdateImage}
                        className="rounded-lg bg-gray-800 py-2 text-sm font-semibold text-white hover:bg-gray-700"
                    >
                      사진 변경 적용
                    </button>
                    <button
                        onClick={handleDeleteImage}
                        className="rounded-lg border border-red-300 py-2 text-sm font-semibold text-red-500 hover:bg-red-50"
                    >
                      프로필 사진 삭제
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