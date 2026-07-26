function AvatarListModal({ title, avatars, onClose, onAvatarClick }) {
  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div className="max-h-[70vh] w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-base font-bold text-gray-800">{title}</h2>
            <button
                onClick={onClose}
                className="text-xl text-gray-400 hover:text-gray-600"
            >
              &times;
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-2">
            {avatars.length === 0 && (
                <p className="py-8 text-center text-sm text-gray-400">
                  아직 아무도 없어요.
                </p>
            )}

            {avatars.map((avatar) => (
                <button
                    key={avatar.avatarId}
                    onClick={() => {
                      onAvatarClick(avatar.avatarId)
                      onClose()
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-gray-50"
                >
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200">
                    {avatar.profileImageUrl && (
                        <img
                            src={avatar.profileImageUrl}
                            alt={avatar.name}
                            className="h-full w-full object-cover"
                        />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-800">{avatar.name}</p>
                    <p className="truncate text-xs text-gray-400">{avatar.worldName}</p>
                  </div>
                </button>
            ))}
          </div>
        </div>
      </div>
  )
}

export default AvatarListModal