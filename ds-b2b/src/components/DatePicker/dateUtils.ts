import { format, isValid, parse, startOfDay } from 'date-fns'

export const parseDateValue = (value?: string): Date | null => {
  if (!value?.trim()) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const parsed = parse(value, 'yyyy-MM-dd', new Date())
    return isValid(parsed) ? startOfDay(parsed) : null
  }
  const parsed = new Date(value)
  return isValid(parsed) ? startOfDay(parsed) : null
}

export const parseFlexibleDateInput = (text: string): Date | null => {
  const trimmed = text.trim()
  if (!trimmed) return null

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const parsed = parse(trimmed, 'yyyy-MM-dd', new Date())
    return isValid(parsed) ? startOfDay(parsed) : null
  }
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
    const parsed = parse(trimmed, 'dd/MM/yyyy', new Date())
    return isValid(parsed) ? startOfDay(parsed) : null
  }
  if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) {
    const parsed = parse(trimmed, 'dd-MM-yyyy', new Date())
    return isValid(parsed) ? startOfDay(parsed) : null
  }

  return null
}

export const formatDateInputDisplay = (value?: string): string => {
  const parsed = parseDateValue(value)
  if (parsed) return format(parsed, 'yyyy-MM-dd')
  return value?.trim() || ''
}

export const toDateInputValue = (date: Date): string => format(startOfDay(date), 'yyyy-MM-dd')

export const splitDateTimeLocal = (value?: string): { date: string; time: string } => {
  if (!value?.trim()) return { date: '', time: '' }
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) {
    const [date, time] = value.split('T')
    return { date, time: time.slice(0, 5) }
  }
  const parsed = parseDateValue(value)
  if (parsed) {
    return { date: toDateInputValue(parsed), time: '09:00' }
  }
  return { date: '', time: '' }
}

export const mergeDateTimeLocal = (date: string, time: string): string => {
  if (!date.trim()) return ''
  return `${date}T${time.trim() || '00:00'}`
}
