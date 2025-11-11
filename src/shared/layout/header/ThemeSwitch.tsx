'use client'
import { FC, useState, useEffect, useCallback } from 'react';
import styles from './styles/general.module.css';

const numberOfRays = 5

// Если ThemeSwitchProps не определён, вот пример:
interface ThemeSwitchProps<TTheme extends string> {
  currentState: TTheme;
  onToggle: (nextTheme: TTheme) => void;
  themeList: readonly TTheme[]; // readonly для иммутабельности
}

const ThemeSwitch = <TTheme extends string>(
  {
    currentState,
    onToggle,
    themeList,
  }: ThemeSwitchProps<TTheme>
) => {
  const [rayList, setRayList] = useState<number[]>([])
  
  useEffect(() => {
    // Расчитываем угол наклона каждого луча солнца
    const newRayList: number[] = []
    const baseAngel = 360 / numberOfRays
    for (let i = 0; i < numberOfRays; i++) {
      newRayList.push(i * baseAngel)
    }
    setRayList( newRayList )
  }, [])
  

  // useCallback для оптимизации: хендлер не пересоздаётся при каждом рендере
  const handlerSwitch = useCallback(
    () => {
      const currentIndex = themeList.indexOf(currentState);
      
      // Безопасная проверка: если не найден, fallback на первый элемент
      if (currentIndex === -1) {
        console.error('Текущее состояние не найдено в themeList.');
        onToggle(themeList[0] as TTheme); // Fallback на первый theme
        return;
      }
      
      const nextIndex = (currentIndex + 1) % themeList.length;
      const nextTheme = themeList[nextIndex];
      onToggle(nextTheme as TTheme);
    },
    [currentState, onToggle, themeList]
  );

  return (
    <button
      className={`${styles.theme_switch} ${styles[currentState]}`}
      onClick={handlerSwitch}
      type="button"
      aria-label={`Переключить тему на ${currentState}`}
    >
      <span className={`${styles.moon} ${styles[currentState]}`}>
        <span className={`${styles.blackout} ${styles[currentState]}`}></span>
        <span className={`${styles.sun} ${styles[currentState]}`}></span>
      </span>
      <span className={`${styles.sun_ray_wrap} ${styles[currentState]}`}>
        {rayList.map((rotateAngel, index) => (
          <span 
            className={`${styles.sun_ray} ${styles[currentState]}`}
            style={{ transform: `rotate(${rotateAngel}deg)`}}
            key={index}
          >
            <span className={`${styles.sun_ray_core} ${styles[currentState]}`}></span>
          </span>
        ))}
      </span>
    </button>
  );
};

export default ThemeSwitch;