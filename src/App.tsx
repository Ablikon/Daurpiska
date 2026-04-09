import { useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

const ACTUAL_REASONS = [
  "За твою невероятную улыбку, которая освещает всё вокруг", 
  "За то, как ты смеешься над моими самыми глупыми шутками",
  "За то, что с тобой я могу быть полностью собой", 
  "За твои теплые объятия после долгого дня",
  "За твои глубокие глаза, в которых можно утонуть", 
  "За твою искреннюю заботу и нежность ко мне",
  "За то, что ты всегда веришь в меня и поддерживаешь", 
  "За твои мягкие прикосновения",
  "За то, что ты мой самый лучший друг на свете", 
  "За то, как ты смотришь на меня, когда думаешь, что я не вижу"
];

const FULL_REASONS = Array.from({ length: 101 }, (_, i) => {
  return ACTUAL_REASONS[i % ACTUAL_REASONS.length];
}).reverse();

// Компонент карточки с 3D анимациями и физикой смахивания
const SwipeableCard = ({ reason, index, isTop, onSwipe, total }: any) => {
  const dragX = useMotionValue(0);
  const rotate = useTransform(dragX, [-200, 200], [-8, 8]);
  const opacity = useTransform(dragX, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const indexFromTop = total - 1 - index;
  const isSecond = indexFromTop === 1;

  // Рассчитываем эффекты перспективы для карточек под верхней
  const scale = isTop ? 1 : 1 - indexFromTop * 0.05;
  const yOffset = isTop ? 0 : indexFromTop * 14;

  return (
    <motion.div
      key={index}
      initial={false}
      animate={{
        scale,
        y: yOffset,
        zIndex: index,
        rotateX: isTop ? 0 : 5, // Легкий наклон назад для карточек внизу
      }}
      style={{
        x: isTop ? dragX : 0,
        rotate: isTop ? rotate : (index % 2 === 0 ? -2 : 2), // Легкий хаос наклона вне свайпа
        opacity: isTop ? opacity : (indexFromTop > 3 ? 0 : 1 - indexFromTop * 0.2), // Прячем совсем глубокие
        transformOrigin: "bottom center"
      }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(e, { offset, velocity }) => {
        if (Math.abs(offset.x) > 80 || Math.abs(velocity.x) > 500) {
          // Если потянули достаточно далеко или быстро - смахиваем
          onSwipe();
        }
      }}
      onClick={() => isTop && onSwipe()}
      className={`absolute w-[82%] max-w-[320px] aspect-[3/4] bg-white rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 text-center border overflow-hidden cursor-grab active:cursor-grabbing ${isTop ? 'border-rose-100 shadow-[0_20px_50px_rgba(225,29,72,0.15)]' : 'border-gray-100'}`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-3xl opacity-50 -mr-10 -mt-10" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-100 rounded-full blur-2xl opacity-50 -ml-10 -mb-10" />

      <h2 className="text-8xl font-black text-rose-50 absolute -top-2 select-none -z-10">
        #{101 - index}
      </h2>
      
      <div className="z-10 w-full flex flex-col items-center h-full pt-10 pb-4">
        <Sparkles className="text-rose-300 w-8 h-8 mb-6" />
        <p className="text-2xl md:text-3xl font-serif text-rose-950 leading-relaxed font-medium">
          {reason}
        </p>
      </div>

      <div className="absolute bottom-6 flex flex-col items-center opacity-40">
        <span className="text-xs uppercase tracking-widest text-rose-500 font-bold">Смахни в сторону</span>
        <div className="w-8 h-1 bg-rose-200 rounded-full mt-2" />
      </div>
    </motion.div>
  );
};

export default function App() {
  const [stage, setStage] = useState<'intro' | 'cards' | 'outro'>('intro');
  const [cards, setCards] = useState(FULL_REASONS);

  const handleNextCard = () => {
    if (cards.length > 1) {
      setCards((prev) => prev.slice(0, -1));
    } else {
      setStage('outro');
    }
  };

  return (
    <div className="w-full h-[100dvh] flex items-center justify-center relative overflow-hidden perspective-[1200px]">
      
      {/* Декоративные плавающие сердца для атмосферы */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute text-rose-500/20 floating-heart"
            style={{
              left: `${Math.random() * 100}vw`,
              top: `${Math.random() * 100}vh`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 4 + 4}s`,
              transform: `scale(${Math.random() * 1 + 0.5})`
            }}
          >
            <Heart className="w-10 h-10 fill-current blur-[1px]" />
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {stage === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center p-6 text-center z-10 w-full h-full max-w-md"
          >
            <motion.div
              initial={{ rotate: -5, opacity: 0, scale: 0.8 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
              className="polaroid-card w-64 h-80 flex flex-col items-center justify-center relative mb-12 shadow-2xl"
            >
              {/* === МЕСТО ДЛЯ ПЕРВОГО ФОТО === */}
              {/* Замените div ниже на тег <img src="/ваше-фото.jpg" className="w-full h-full object-cover" /> */}
              <div className="w-full h-full bg-gray-100 flex items-center justify-center p-4 border border-gray-200">
                <span className="text-gray-400 text-sm font-medium text-center leading-relaxed max-w-[150px]">
                  /* ВСТАВЬ<br/>ПЕРВОЕ ФОТО<br/>СЮДА */
                </span>
              </div>
              <div className="absolute bottom-4 font-serif text-lg text-gray-800 italic">Начало истории</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="space-y-3 glass-panel p-8 rounded-3xl w-full"
            >
              <h1 className="text-5xl font-serif font-black text-gradient leading-tight tracking-tight">101 причина</h1>
              <p className="text-xl font-medium text-rose-100/80 uppercase tracking-[0.2em] pt-2">
                почему я тебя люблю
              </p>

              <button
                onClick={() => setStage('cards')}
                className="mt-8 px-10 py-4 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full text-white font-bold text-lg shadow-[0_0_40px_rgba(225,29,72,0.4)] hover:shadow-[0_0_60px_rgba(225,29,72,0.6)] hover:scale-105 transition-all duration-300 active:scale-95 flex items-center gap-3 mx-auto"
              >
                Открыть сердце <Heart className="w-5 h-5 fill-white animate-pulse" />
              </button>
            </motion.div>
          </motion.div>
        )}

        {stage === 'cards' && (
          <motion.div
            key="cards"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col w-full max-w-md h-full items-center justify-center transform-gpu"
          >
            <div className="absolute top-12 glass-panel px-6 py-2 rounded-full text-rose-200 font-semibold tracking-widest text-xs uppercase shadow-lg border border-white/10 z-50">
              Осталось: <span className="text-white ml-2 text-sm">{cards.length}</span>
            </div>

            <div className="relative w-full h-[500px] flex items-center justify-center transform-style-3d">
              <AnimatePresence>
                {cards.map((reason, index) => {
                  const isTop = index === cards.length - 1;
                  return (
                    <SwipeableCard
                      key={index}
                      reason={reason}
                      index={index}
                      total={cards.length}
                      isTop={isTop}
                      onSwipe={handleNextCard}
                    />
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {stage === 'outro' && (
          <motion.div
            key="outro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col items-center justify-center p-6 text-center z-10 w-full h-full max-w-md"
          >
            <motion.div
              initial={{ rotate: 5, opacity: 0, y: 50 }}
              animate={{ rotate: 0, opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1, type: "spring" }}
              className="polaroid-card w-72 h-[350px] flex flex-col items-center justify-center relative mb-12"
            >
              {/* === МЕСТО ДЛЯ ВТОРОГО ФОТО === */}
              {/* Замените div ниже на тег <img src="/ваше-фото.jpg" className="w-full h-full object-cover" /> */}
              <div className="w-full h-full bg-gray-100 flex items-center justify-center p-4 border border-gray-200">
                <span className="text-gray-400 text-sm font-medium text-center leading-relaxed">
                  /* ВСТАВЬ<br/>ФИНАЛЬНОЕ ФОТО<br/>СЮДА */
                </span>
              </div>
              <Heart className="absolute bottom-4 w-6 h-6 text-rose-500 fill-rose-500" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="glass-panel p-8 rounded-3xl w-full"
            >
              <h1 className="text-4xl font-serif font-bold text-gradient-gold leading-tight">
                И еще миллион причин...
              </h1>
              <p className="text-2xl mt-4 font-black text-rose-400">
                Я люблю тебя! ❤️
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
