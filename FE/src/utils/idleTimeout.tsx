import { useEffect, useRef } from "react";


const useIdleTimeout = (timeout: number, onIdle: () => void) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      onIdle();
    }, timeout);
  };

  useEffect(() => {
    // Сбрасываем таймер при активности
    const events = ["mousemove", "keydown", "scroll", "click"];
    const reset = () => resetTimer();

    events.forEach((event) => window.addEventListener(event, reset));

    resetTimer(); // Устанавливаем таймер при монтировании

    return () => {
      // Очищаем таймер и события
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => window.removeEventListener(event, reset));
    };
  }, [timeout, onIdle]);

  return null;
};

export default useIdleTimeout;
