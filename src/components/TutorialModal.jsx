import { useState } from 'react'
import T0 from '../assets/tutorial/T_0.png'
import T1 from '../assets/tutorial/T_1.png'
import T2 from '../assets/tutorial/T_2.png'
import T3 from '../assets/tutorial/T_3.png'
import T4 from '../assets/tutorial/T_4.png'
import T5 from '../assets/tutorial/T_5.png'
import T6 from '../assets/tutorial/T_6.png'
import T7 from '../assets/tutorial/T_7.png'
import T8 from '../assets/tutorial/T_8.png'

const SLIDES = [
  {
    image: T0,
    title: '어서오세요 여행자 님, 여행자 님이 원하는 무엇이든 될 수 있는 곳 Overlay입니다. ',
    description: '원하는 세계관을 만들고, 여행자 님 만의 세계에서 \n일어난 일상을 공유해 주세요.',
  },
  {
    image: T1,
    title: '+ 버튼을 눌러보세요! \n메뉴바가 보이시나요?',
    description: '메뉴바에서는 캐릭터와 세계관 그리고 \n일상을 공유할 수 있는 피드를 만들 수 있어요.',
  },
  {
    image: T2,
    title: '캐릭터를 먼저 만들어 주세요.',
    description: '캐릭터는 두개 까지 만들 수있고, 처음 만들어진 캐릭터는 Crossing Lane 세계관에 속해요.',
  },
  {
    image: T3,
    title: '캐릭터 프로필이 나타났나요?',
    description: '캐릭터를 만들면 캐릭터의 프로필 아이콘이 \n상단 헤더에 나타나요. \n그 앞에 세계관 둘러보기를 눌러주세요.',
  },
  {
    image: T4,
    title: '세계관을 바꿔 볼까요?',
    description: 'Crossing Lane도 정말 아늑한 세계지만, \n여행자 님이 원한다면 어떤 세계든 \n그 세상에 살 수 있어요. \n원하는 세계를 선택해주세요.',
  },
  {
    image: T5,
    title: '새로운 세계로 떠날 준비가 되셨나요?',
    description: '이 세계로 이주하기 버튼을 누르면 \n해당 세계의 주민이 될 수 있어요. \n여행자 님이 올린 게시글은 캐릭터가 속한 세계관 피드와 \n모든 세계관의 일상이 공유되는 홈 화면에서 볼 수 있어요.',
  },
  {
    image: T6,
    title: '정해진 선택지가 싫다면, \n여행자 님만의 세계를 만들어 보세요!',
    description: '세계관을 만들고 다른 여행자 분들이 \n이주하기를 기다려보세요. \n매력적인 세계가 만들어지는 과정을 \n직접 볼 수 있겠죠?',
  },
  {
    image: T7,
    title: '원하는 세계에서 특별한 일상을 \n공유해 주세요.',
    description: '기억해주세요, 캐릭터가 있어야 피드를 작성할 수 있어요! \n어제는 탐험가였다가, 오늘은 우주를 지키는 경찰, \n내일은 거액의 현상금이 걸린 악인이 될 수도 있어요. \n물론 유유자적한 농부가 될 수도 있죠.',
  },
  {
    image: T8,
    title: '준비되셨나요, 여행자 님?',
    description: '이곳에서는 무엇이든 될 수 있고, 무엇이든 할 수 있어요. \n여행자 님만의 특별한 일상을 공유해주세요.',
  },
]

function TutorialModal({ onClose }) {
  const [step, setStep] = useState(0)
  const isLast = step === SLIDES.length - 1
  const isFirst = step === 0

  const handleClose = () => {
    localStorage.setItem('tutorialSeen', 'true')
    onClose()
  }

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl">
          <button
              onClick={handleClose}
              className="absolute right-4 top-4 z-10 text-xl text-white drop-shadow hover:text-gray-200"
          >
            &times;
          </button>

          <img
              src={SLIDES[step].image}
              alt={SLIDES[step].title}
              className="aspect-[4/5] w-full object-cover"
          />

          <div className="p-6 pt-8">
            <div className="mb-6 min-h-[100px] text-center">
              <h2 className="mb-2 text-xl font-bold text-gray-800 whitespace-pre-line">
                {SLIDES[step].title}
              </h2>
              <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line">
                {SLIDES[step].description}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <button
                  onClick={() => setStep((s) => s - 1)}
                  disabled={isFirst}
                  className="text-sm text-gray-400 hover:text-gray-600 disabled:invisible"
              >
                이전
              </button>

              <div className="flex items-center gap-2">
                {SLIDES.map((_, i) => (
                    <div
                        key={i}
                        className={`h-2 w-2 rounded-full ${
                            i === step ? 'bg-blue-500' : 'bg-gray-200'
                        }`}
                    />
                ))}
              </div>

              {isLast ? (
                  <button
                      onClick={handleClose}
                      className="rounded-lg bg-blue-500 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                  >
                    시작하기
                  </button>
              ) : (
                  <button
                      onClick={() => setStep((s) => s + 1)}
                      className="rounded-lg bg-blue-500 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                  >
                    다음
                  </button>
              )}
            </div>
          </div>
        </div>
      </div>
  )
}

export default TutorialModal