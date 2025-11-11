interface ExpectedMetadata {
  title: string;
  description: string;
  ogDescription: string;
  twitterDescription: string;
  keywords: string;
}

interface Header {
  title: string;
  lang: { [key: string]: string };
}

interface AppData {
  header: Header;
}

type ValidAppData = {
  metadata: ExpectedMetadata;
  app: AppData;
};

/**
 * Валидирует неизвестный объект как ValidAppData.
 * Возвращает true, если объект соответствует типу (type guard).
 * Проверяет структуру и типы свойств на runtime.
 */
export function validateMessage(obj: unknown): obj is ValidAppData {
  // Шаг 1: Базовая проверка — obj должен быть объектом (не null, не примитив)
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  // Приводим к Record<string, unknown> для безопасной индексации строковыми ключами
  // Это эквивалентно { [key: string]: unknown } — позволяет доступ к typedObj.metadata и т.д.
  const typedObj = obj as Record<string, unknown>;

  // Шаг 2: Проверка metadata (должно быть объектом с ожидаемыми строковыми свойствами)
  const metadata = typedObj.metadata; // Тип: unknown
  if (typeof metadata !== 'object' || metadata === null) {
    return false;
  }
  // Сужаем тип metadata для индексации: теперь можно использовать metadata[key]
  const typedMetadata = metadata as Record<string, unknown>;

  // Проверяем наличие и тип каждого ожидаемого ключа в metadata
  const expectedMetadataKeys = ['title', 'description', 'ogDescription', 'twitterDescription', 'keywords'];
  for (const key of expectedMetadataKeys) {
    // 'key in typedMetadata' — runtime-проверка наличия свойства
    // typedMetadata[key] — теперь безопасно, тип unknown, но typeof работает
    if (!(key in typedMetadata) || typeof typedMetadata[key] !== 'string') {
      return false;
    }
  }

  // Шаг 3: Проверка app (должно быть объектом с вложенным header)
  const app = typedObj.app; // Тип: unknown
  if (typeof app !== 'object' || app === null) {
    return false;
  }
  // Сужаем тип app для доступа к свойству 'header' (теперь app.header валиден)
  const typedApp = app as Record<string, unknown>;

  // Шаг 4: Проверка header внутри app (должно быть объектом с title и lang)
  const header = typedApp.header; // Теперь тип unknown, но доступ разрешён
  if (typeof header !== 'object' || header === null) {
    return false;
  }
  // Сужаем тип header для дальнейшей индексации (title и lang)
  const typedHeader = header as Record<string, unknown>;

  // Проверяем title — должно быть строкой
  if (typeof typedHeader.title !== 'string') {
    return false;
  }

  // Шаг 5: Проверка lang внутри header (объект с произвольными строковыми ключами-значениями)
  const lang = typedHeader.lang; // Тип: unknown
  if (typeof lang !== 'object' || lang === null) {
    return false;
  }
  // Сужаем тип lang для Object.entries (нужен Record для итерации)
  const typedLang = lang as Record<string, unknown>;

  // Итерация по парам [key, value] в lang
  // Object.entries возвращает [string, unknown][], так что key всегда string
  for (const [key, value] of Object.entries(typedLang)) {
    // Проверяем только value (ключ всегда string, избыточная проверка убрана)
    if (typeof value !== 'string') {
      return false;
    }
  }

  // Все проверки пройдены — объект валиден и соответствует ValidAppData
  return true;
}