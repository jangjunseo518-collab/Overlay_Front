import { useState, useRef, useEffect } from 'react'

function FloatingActionMenu({ onCreateAvatarClick, onCreateWorldClick, onCreatePostClick, onWorldListClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
      <div className="relative z-50" ref={menuRef}>
        <div
            className={`absolute bottom-14 right-0 w-40 origin-bottom-right overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all duration-200 ${
                isMenuOpen
                    ? 'translate-y-0 scale-100 opacity-100'
                    : 'pointer-events-none translate-y-4 scale-95 opacity-0'
            }`}
        >
          <button
              onClick={() => {
                setIsMenuOpen(false)
                onCreateAvatarClick()
              }}
              className="block w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
          >
            캐릭터 만들기
          </button>
          <button
              onClick={() => {
                setIsMenuOpen(false)
                onCreateWorldClick()
              }}
              className="block w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
          >
            세계관 만들기
          </button>
          <button
              onClick={() => {
                setIsMenuOpen(false)
                onCreatePostClick()
              }}
              className="block w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
          >
            포스트 작성
          </button>
          <button
              onClick={() => {
                setIsMenuOpen(false)
                onWorldListClick()
              }}
              className="block w-full border-t border-gray-100 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
          >
            세계관 둘러보기
          </button>
        </div>

        <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className={`flex h-11 w-11 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg transition-transform duration-200 hover:bg-blue-600 ${
                isMenuOpen ? 'rotate-45' : 'rotate-0'
            }`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
  )
}

export default FloatingActionMenu