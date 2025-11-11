/**
 * Преобразует в нижний регистр первые две подряд идущие буквы в строке.
 *
 * @param str Входная строка.
 * @returns Строка с первыми двумя смежными буквами в нижнем регистре.
 */
export const toLowerCaseFirstTwoAdjacentLetters = (str: string): string => {
  // [^\\p{L}]* - ноль или более любых символов, перед первыми буквами.
  const regex = /^[^\p{L}]*(\p{L}{2})/u;

  return str.replace(regex, 
    (match, twoLetters) => ( twoLetters.toLowerCase() )
  )
}
