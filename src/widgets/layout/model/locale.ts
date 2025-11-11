

export interface ValidLocale {
  locales: string[]
}


/**
 * Валидирует неизвестный объект как ValidLocale.
 * Возвращает true, если объект соответствует типу (type guard).
 * Проверяет структуру и типы свойств на runtime.
 */
export function validateLocale(obj: unknown): obj is ValidLocale {
  // Шаг 1: Базовая проверка — obj должен быть объектом (не null, не примитив)
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  
  // Приводим к Record<string, unknown> для безопасной индексации строковыми ключами
  // Это эквивалентно { [key: string]: unknown } — позволяет доступ к typedObj.locales
  const typedObj = obj as Record<string, unknown>;

  // Шаг 2: Проверка locales (должно быть не пустым массивом)
  const locales = typedObj.locales; // Тип: unknown
  if (!(Array.isArray(locales)) || locales.length < 1) {
    return false;
  }
  
  // Шаг 3: Проверка содержимого массива (все значения должны соответствовать строковому типу)
  for (const item of locales) {
    if (typeof item !== 'string') return false
  }
  
  // Все проверки пройдены — объект валиден и соответствует ValidLocale
  return true;
}