import { useState, useEffect } from 'react'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import FeedPage from './pages/FeedPage'
import CreateWorldPage from './pages/CreateWorldPage'
import CreateAvatarPage from './pages/CreateAvatarPage'
import CreatePostPage from './pages/CreatePostPage'
import AvatarProfilePage from './pages/AvatarProfilePage'
import WorldFeedPage from './pages/WorldFeedPage'
import WorldListPage from './pages/WorldListPage'
import TutorialModal from './components/TutorialModal'

function App() {
  const [page, setPage] = useState('feed')
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('accessToken'))
  const [selectedAvatarId, setSelectedAvatarId] = useState(null)
  const [selectedWorldId, setSelectedWorldId] = useState(null)
  const [signUpEmail, setSignUpEmail] = useState('')
  const [showTutorial, setShowTutorial] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem('tutorialSeen')
    if (!seen) {
      setShowTutorial(true)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userId')
    setIsLoggedIn(false)
    setPage('feed')
  }

  return (
      <>
        {showTutorial && (
            <TutorialModal onClose={() => setShowTutorial(false)} />
        )}

        {page === 'feed' && (
            <FeedPage
                isLoggedIn={isLoggedIn}
                onLoginClick={() => setPage('login')}
                onCreateWorldClick={() => setPage('createWorld')}
                onCreateAvatarClick={() => setPage('createAvatar')}
                onCreatePostClick={() => setPage('createPost')}
                onAvatarClick={(avatarId) => {
                  setSelectedAvatarId(avatarId)
                  setPage('avatarProfile')
                }}
                onLogoutClick={handleLogout}
                onWorldClick={(worldId) => {
                  setSelectedWorldId(worldId)
                  setPage('worldFeed')
                }}
                onWorldListClick={() => setPage('worldList')}
                onShowTutorial={() => setShowTutorial(true)}
            />
        )}

        {page === 'login' && (
            <LoginPage
                onSwitchToSignUp={() => setPage('signup')}
                onLoginSuccess={() => {
                  setIsLoggedIn(true)
                  setPage('feed')
                }}
                onClose={() => setPage('feed')}
            />
        )}

        {page === 'signup' && (
            <SignUpPage
                onSwitchToLogin={() => setPage('login')}
                onClose={() => setPage('feed')}
                onSignUpSuccess={(email) => {
                  setSignUpEmail(email)
                  setPage('verifyEmail')
                }}
            />
        )}

        {page === 'verifyEmail' && (
            <VerifyEmailPage
                email={signUpEmail}
                onVerifySuccess={() => {
                  setIsLoggedIn(true)
                  setPage('feed')
                }}
                onClose={() => setPage('feed')}
            />
        )}

        {page === 'createWorld' && (
            <CreateWorldPage
                onSuccess={() => setPage('feed')}
                onClose={() => setPage('feed')}
            />
        )}

        {page === 'createAvatar' && (
            <CreateAvatarPage
                onSuccess={() => setPage('feed')}
                onClose={() => setPage('feed')}
            />
        )}

        {page === 'createPost' && (
            <CreatePostPage
                onSuccess={() => setPage('feed')}
                onClose={() => setPage('feed')}
            />
        )}

        {page === 'avatarProfile' && (
            <AvatarProfilePage
                avatarId={selectedAvatarId}
                onClose={() => setPage('feed')}
                onSwitchAvatar={(newAvatarId) => setSelectedAvatarId(newAvatarId)}
                onCreatePostClick={() => setPage('createPost')}
                onWorldClick={(worldId) => {
                  setSelectedWorldId(worldId)
                  setPage('worldFeed')
                }}
                onAvatarClick={(avatarId) => setSelectedAvatarId(avatarId)}
            />
        )}

        {page === 'worldFeed' && (
            <WorldFeedPage
                worldId={selectedWorldId}
                isLoggedIn={isLoggedIn}
                onClose={() => setPage('feed')}
                onAvatarClick={(avatarId) => {
                  setSelectedAvatarId(avatarId)
                  setPage('avatarProfile')
                }}
            />
        )}

        {page === 'worldList' && (
            <WorldListPage
                onClose={() => setPage('feed')}
                onWorldClick={(worldId) => {
                  setSelectedWorldId(worldId)
                  setPage('worldFeed')
                }}
            />
        )}
      </>
  )
}

export default App