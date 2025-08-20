import bcrypt from 'bcryptjs';

// Types
import { Option } from '../features/api/types';

// Constants
const SALT_ROUNDS = 10;

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

export const isNumber = (value: string) => {
  return /^[0-9]*$/.test(value)
}

export const getFileNameWithoutExtension = (filePath: string): string => {
  const fileName = filePath.split('/').pop()?.split('\\').pop() || ""
  return fileName.split('.').slice(0, -1).join('.') || fileName 
}

export const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US').format(value)
}

export const makeRandomText = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => 
    characters[Math.floor(Math.random() * characters.length)]
  ).join('');
};

export const hashPassword = async (plainPassword: string): Promise<string> => {
  const hashed = await bcrypt.hash(plainPassword, SALT_ROUNDS);
  return hashed;
};

export const getId = (val: number | Option) => {
  return typeof val === "number" ? val : val.value;
};