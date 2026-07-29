import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('accessToken'))
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
    navigate('/')
  }

  return (
      <>
        {showTutorial && (
            <TutorialModal onClose={() => setShowTutorial(false)} />
        )}

        <Routes>
          <Route
              path="/"
              element={
                <FeedPage
                    isLoggedIn={isLoggedIn}
                    onLoginClick={() => navigate('/login')}
                    onCreateWorldClick={() => navigate('/create-world')}
                    onCreateAvatarClick={() => navigate('/create-avatar')}
                    onCreatePostClick={() => navigate('/create-post')}
                    onAvatarClick={(avatarId) => navigate(`/avatar/${avatarId}`)}
                    onLogoutClick={handleLogout}
                    onWorldClick={(worldId) => navigate(`/world/${worldId}`)}
                    onWorldListClick={() => navigate('/worlds')}
                    onShowTutorial={() => setShowTutorial(true)}
                />
              }
          />

          <Route
              path="/login"
              element={
                <LoginPage
                    onSwitchToSignUp={() => navigate('/signup')}
                    onLoginSuccess={() => {
                      setIsLoggedIn(true)
                      navigate('/')
                    }}
                    onClose={() => navigate('/')}
                    onNeedVerification={(email) => {
                      setSignUpEmail(email)
                      navigate('/verify')
                    }}
                />
              }
          />

          <Route
              path="/signup"
              element={
                <SignUpPage
                    onSwitchToLogin={() => navigate('/login')}
                    onClose={() => navigate('/')}
                    onSignUpSuccess={(email) => {
                      setSignUpEmail(email)
                      navigate('/verify')
                    }}
                />
              }
          />

          <Route
              path="/verify"
              element={
                <VerifyEmailPage
                    email={signUpEmail}
                    onVerifySuccess={() => {
                      setIsLoggedIn(true)
                      navigate('/')
                    }}
                    onClose={() => navigate('/')}
                />
              }
          />

          <Route
              path="/create-world"
              element={
                <CreateWorldPage
                    onSuccess={() => navigate('/')}
                    onClose={() => navigate('/')}
                />
              }
          />

          <Route
              path="/create-avatar"
              element={
                <CreateAvatarPage
                    onSuccess={() => navigate('/')}
                    onClose={() => navigate('/')}
                />
              }
          />

          <Route
              path="/create-post"
              element={
                <CreatePostPage
                    onSuccess={() => navigate('/')}
                    onClose={() => navigate('/')}
                />
              }
          />

          <Route
              path="/avatar/:avatarId"
              element={
                <AvatarProfilePage
                    onClose={() => navigate('/')}
                    onSwitchAvatar={(newAvatarId) => navigate(`/avatar/${newAvatarId}`)}
                    onCreatePostClick={() => navigate('/create-post')}
                    onWorldClick={(worldId) => navigate(`/world/${worldId}`)}
                    onAvatarClick={(avatarId) => navigate(`/avatar/${avatarId}`)}
                />
              }
          />

          <Route
              path="/world/:worldId"
              element={
                <WorldFeedPage
                    isLoggedIn={isLoggedIn}
                    onClose={() => navigate('/')}
                    onAvatarClick={(avatarId) => navigate(`/avatar/${avatarId}`)}
                />
              }
          />

          <Route
              path="/worlds"
              element={
                <WorldListPage
                    onClose={() => navigate('/')}
                    onWorldClick={(worldId) => navigate(`/world/${worldId}`)}
                />
              }
          />
        </Routes>
      </>
  )
}

export default App