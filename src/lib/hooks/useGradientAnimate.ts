import { useEffect, useRef, useState, useCallback } from 'react';
import { RefObject } from 'react';

// Типы для цветов: Uint8Array с stride 4 (RGBA, flat для всех stops)
type ColorArray = Uint8Array; // Например, для 2 цветов: [r1,g1,b1,a1, r2,g2,b2,a2] (8 bytes)

interface Template {
  type: string;
  descriptor: string;
  stops: string[];
}

interface ParsedGradient {
  template: Template;
  colors: ColorArray;
}

// Интерфейс для возврата хука (если нужно expose)
interface UseThemeGradientAnimationReturn {
  beforeColors: ColorArray | null;
  afterColors: ColorArray | null;
  isAnimating: boolean;
}

// Хук: useThemeGradientAnimation
// - elementRef: RefObject<HTMLElement> — элемент с --local-gradient
// - duration: number — длительность анимации в секундах
// Предполагает CSS: --local-gradient на элементе (resolved rgb), --local-animated-gradient для анимации
// Реагирует ТОЛЬКО на data-theme на :root
// Парсит resolved градиент (rgb()), напрямую в Uint8Array (RGBA bytes, alpha=255)
// Анимирует: lerp bytes, формирует новый градиент, setProperty('--local-animated-gradient')
export const useThemeGradientAnimation = (
  elementRef: RefObject<HTMLElement>,
  duration: number = 0.5
): UseThemeGradientAnimationReturn => {
  const [beforeColors, setBeforeColors] = useState<ColorArray | null>(null);
  const [afterColors, setAfterColors] = useState<ColorArray | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const cachedGradientRef = useRef<ParsedGradient | null>(null);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  // Функция парсинга resolved градиентной строки в ParsedGradient
  // Поддержка linear/radial/conic, descriptor, color stops с позициями
  const parseGradientToParsed = useCallback((gradientString: string): ParsedGradient | null => {
    gradientString = gradientString.trim();
    if (!gradientString) return null;

    // Матчим тип градиента и содержимое
    const match = gradientString.match(/^([a-z]+)-gradient\s*\((.*)\)$/);
    if (!match) return null;

    const [, gradType, inner] = match;

    // Разделяем descriptor и stop-строки по запятым (descriptor без запятой)
    const parts = inner.split(',').map((p) => p.trim());
    if (parts.length < 2) return null; // Минимум descriptor + один цвет

    const descriptor = parts[0];
    const stopStrings = parts.slice(1);

    // Парсим каждый stop: цвет + опциональная позиция
    const flatColors: number[] = [];
    const stops: string[] = [];
    const stopRegex = /rgb[a]?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)\s*(.*)/;

    for (const stopStr of stopStrings) {
      const stopMatch = stopStr.match(stopRegex);
      if (!stopMatch) return null;

      const [, rStr, gStr, bStr, aStr, positionStr] = stopMatch;
      const r = Math.min(255, Math.max(0, Math.round(parseInt(rStr, 10))));
      const g = Math.min(255, Math.max(0, Math.round(parseInt(gStr, 10))));
      const b = Math.min(255, Math.max(0, Math.round(parseInt(bStr, 10))));
      const a = aStr ? Math.min(255, Math.max(0, Math.round(parseFloat(aStr) * 255))) : 255;

      flatColors.push(r, g, b, a);
      stops.push(positionStr.trim() || '');
    }

    if (flatColors.length === 0 || flatColors.length % 4 !== 0) return null;

    const colors = new Uint8Array(flatColors);

    return {
      template: { type: gradType, descriptor, stops },
      colors,
    };
  }, []);

  // Функция получения resolved градиента
  const getResolvedGradient = useCallback((): string => {
    if (!elementRef.current) return '';
    const computed = window.getComputedStyle(elementRef.current);
    return computed.getPropertyValue('--local-gradient').trim();
  }, [elementRef]);

  // Функция запуска анимации
  const startAnimation = useCallback(
    (before: ColorArray, after: ColorArray, template: Template, finalString: string) => {
      if (!elementRef.current || before.length !== after.length) return;
      alert('animation')

      setIsAnimating(true);
      startTimeRef.current = performance.now();
      const numColors = before.length / 4;

      const animate = (currentTime: number) => {
        const elapsed = (currentTime - startTimeRef.current) / 1000; // ms -> s
        const t = Math.min(elapsed / duration, 1); // 0 to 1

        // Lerp каждый byte (включая alpha, если варьируется)
        const interpolated = new Uint8Array(before.length);
        for (let i = 0; i < before.length; i++) {
          interpolated[i] = Math.round(before[i] + t * (after[i] - before[i]));
        }

        // Формируем новый градиент из interpolated, используя template
        let gradientParts = `${template.type}-gradient(${template.descriptor}, `;
        for (let i = 0; i < numColors; i++) {
          const offset = i * 4;
          const r = interpolated[offset];
          const g = interpolated[offset + 1];
          const b = interpolated[offset + 2];
          const a = interpolated[offset + 3];
          const colorStr = a < 255 ? `rgba(${r}, ${g}, ${b}, ${a / 255})` : `rgb(${r}, ${g}, ${b})`;
          const stopStr = template.stops[i] ? ` ${template.stops[i]}` : '';
          gradientParts += `${colorStr}${stopStr}${i < numColors - 1 ? ', ' : ''}`;
        }
        gradientParts += ')';

        // Записываем в --local-animated-gradient
        elementRef.current.style.setProperty('--local-animated-gradient', gradientParts);

        if (t < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
          // Финальный: установить exact resolved строку after
          elementRef.current.style.setProperty('--local-animated-gradient', finalString);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    },
    [duration, elementRef]
  );

  // Проверка совместимости для анимации (одинаковый template)
  const isCompatible = useCallback((before: ParsedGradient, after: ParsedGradient): boolean => {
    return (
      before.template.type === after.template.type &&
      before.template.descriptor === after.template.descriptor &&
      before.template.stops.length === after.template.stops.length &&
      before.template.stops.every((stop, i) => stop === after.template.stops[i]) &&
      before.colors.length === after.colors.length
    );
  }, []);

  // Обработчик изменения data-theme
  const handleThemeChange = useCallback(() => {
    const currentGradient = getResolvedGradient();
    if (!currentGradient) return;

    const currentParsed = parseGradientToParsed(currentGradient);
    if (!currentParsed) return;

    const beforeParsed = cachedGradientRef.current;
    if (!beforeParsed) {
      cachedGradientRef.current = currentParsed;
      return;
    }

    if (isCompatible(beforeParsed, currentParsed)) {
      setBeforeColors(beforeParsed.colors);
      setAfterColors(currentParsed.colors);
      startAnimation(beforeParsed.colors, currentParsed.colors, beforeParsed.template, currentGradient);
    }
    // Всегда обновляем кэш
    cachedGradientRef.current = currentParsed;
  }, [getResolvedGradient, parseGradientToParsed, startAnimation, isCompatible]);

  // MutationObserver для data-theme на :root
  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver((mutations) => {
      const hasThemeChange = mutations.some(
        (mutation) => mutation.type === 'attributes' && mutation.attributeName === 'data-theme'
      );
      if (hasThemeChange) {
        // Force layout flush для updated computed styles
        elementRef.current?.offsetHeight;
        handleThemeChange();
      }
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // Инициализация кэша
    cachedGradientRef.current = parseGradientToParsed(getResolvedGradient());

    return () => {
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleThemeChange, getResolvedGradient, elementRef, parseGradientToParsed]);

  return { beforeColors, afterColors, isAnimating };
};