export const reformatString = (input: string): string => {
  return input
    .split('_') // Split the string by underscores
    .map(word => 
        word
            .split('-') // Split the string by hyphens
            .map(subWord => 
                /^[A-Z]+$/.test(subWord) ? subWord : subWord.charAt(0).toUpperCase() + subWord.slice(1).toLowerCase()
            )
            .join('-') // Rejoin the hyphenated parts
    )
    .join(' ') // Rejoin the parts with spaces
}

export const formatThaiID = (value: string) => {
  return value.replace(
    /(\d{1})(\d{0,4})?(\d{0,5})?(\d{0,2})?(\d{0,1})?/,
    (_, p1, p2, p3, p4, p5) => [p1, p2, p3, p4, p5].filter(Boolean).join('-')
  )
}

export const formatPhone = (value: string) => {
  return value.replace(
    /(\d{0,3})?(\d{0,3})?(\d{0,4})?/,
    (_, p1, p2, p3) => [p1, p2, p3].filter(Boolean).join('-')
  )
}

export const isEquals = (a: any, b: any) => {
  return JSON.stringify(a) === JSON.stringify(b)
}