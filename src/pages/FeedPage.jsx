import { useState, useEffect, useRef } from 'react'
import PostCard from '../components/PostCard'
import DeleteAccountModal from '../components/DeleteAccountModal'
import { authFetch, BASE_URL } from '../utils/api'

function FeedPage({ isLoggedIn, onLoginClick, onCreateWorldClick,
  onCreateAvatarClick, onCreatePostClick, onAvatarClick, onLogoutClick,
  onWorldClick, onWorldListClick, onShowTutorial }) {
  const [posts, setPosts] = useState([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const [myActiveAvatar, setMyActiveAvatar] = useState(null)
  const [myActiveWorld, setMyActiveWorld] = useState(null)
  const [showDeleteAccount, setShowDeleteAccount] = useState(false)

  const loadGlobalFeed = () => {
    const token = localStorage.getItem('accessToken')

    fetch(`${BASE_URL}/api/posts/feed/global`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    .then((res) => res.json())
    .then((data) => setPosts(data))
    .catch((err) => console.error(err))
  }

  useEffect(() => {
    if (!isLoggedIn) {
      setMyActiveAvatar(null)
      setMyActiveWorld(null)
      return
    }

    authFetch(`${BASE_URL}/api/users/me/active-avatar`)
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      setMyActiveAvatar(data)
      if (data) {
        return fetch(`${BASE_URL}/api/worlds/${data.worldId}`)
      }
      return null
    })
    .then((res) => (res ? res.json() : null))
    .then((worldData) => {
      if (worldData) setMyActiveWorld(worldData)
    })
    .catch((err) => console.error(err))
  }, [isLoggedIn])

  useEffect(() => {
    loadGlobalFeed()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const requireLogin = (action) => {
    if (isLoggedIn) {
      action()
    } else {
      alert('로그인 또는 회원가입이 필요합니다.')
      onLoginClick()
    }
    setIsMenuOpen(false)
  }

  return (
      <div className="min-h-screen bg-gray-100">
        <div className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
            <h1 className="text-xl font-bold text-gray-800">Overlay</h1>

            <div className="flex items-center gap-2">
              <button
                  onClick={onWorldListClick}
                  className="rounded-lg border border-gray-300 px-4 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                세계관 둘러보기
              </button>

              {isLoggedIn && myActiveWorld && (
                  <button
                      onClick={() => onWorldClick(myActiveWorld.worldId)}
                      className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-gray-200"
                  >
                    {myActiveWorld.profileImageUrl && (
                        <img
                            src={myActiveWorld.profileImageUrl}
                            alt={myActiveWorld.name}
                            className="h-full w-full object-cover"
                        />
                    )}
                  </button>
              )}

              {isLoggedIn && myActiveAvatar && (
                  <button
                      onClick={() => onAvatarClick(myActiveAvatar.avatarId)}
                      className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-gray-200"
                  >
                    {myActiveAvatar.profileImageUrl && (
                        <img
                            src={myActiveAvatar.profileImageUrl}
                            alt={myActiveAvatar.name}
                            className="h-full w-full object-cover"
                        />
                    )}
                  </button>
              )}

              <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-xl font-bold text-white hover:bg-blue-600"
                >
                  +
                </button>

                {isMenuOpen && (
                    <div className="absolute right-0 top-11 z-50 w-40 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
                      <button
                          onClick={() => requireLogin(onCreateWorldClick)}
                          className="block w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                      >
                        세계관 만들기
                      </button>
                      <button
                          onClick={() => requireLogin(onCreateAvatarClick)}
                          className="block w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                      >
                        캐릭터 만들기
                      </button>
                      <button
                          onClick={() => requireLogin(onCreatePostClick)}
                          className="block w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                      >
                        포스트 작성
                      </button>
                      <button
                          onClick={() => {
                            setIsMenuOpen(false)
                            onShowTutorial()
                          }}
                          className="block w-full border-t border-gray-100 px-4 py-2.5 text-left text-sm text-gray-500 hover:bg-gray-50"
                      >
                        튜토리얼 다시 보기
                      </button>
                      {isLoggedIn && (
                          <button
                              onClick={() => {
                                setIsMenuOpen(false)
                                setShowDeleteAccount(true)
                              }}
                              className="block w-full border-t border-gray-100 px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50"
                          >
                            회원 탈퇴
                          </button>
                      )}
                    </div>
                )}
              </div>

              {!isLoggedIn && (
                  <button
                      onClick={onLoginClick}
                      className="rounded-lg bg-blue-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-600"
                  >
                    로그인
                  </button>
              )}
              {isLoggedIn && (
                  <button
                      onClick={onLogoutClick}
                      className="rounded-lg px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700"
                  >
                    로그아웃
                  </button>
              )}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-xl px-4 py-6">
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
                <PostCard
                    key={post.postId}
                    post={post}
                    onAvatarClick={onAvatarClick}
                    onWorldClick={onWorldClick}
                    onPostChanged={loadGlobalFeed}
                />
            ))}
          </div>
        </div>

        {showDeleteAccount && (
            <DeleteAccountModal onClose={() => setShowDeleteAccount(false)} />
        )}
      </div>
  )
}

export default FeedPage