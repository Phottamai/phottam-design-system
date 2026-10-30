export type Meridiem = 'AM' | 'PM'

export interface Time12HourParts {
  hour: string
  minute: string
  meridiem: Meridiem
}

export function to12HourParts(value: string): Time12HourParts {
  const [hourString = '00', minuteString = '00'] = value ? value.split(':') : ['00', '00']
  let hour = parseInt(hourString, 10)
  const minute = minuteString.padStart(2, '0')
  const meridiem: Meridiem = hour >= 12 ? 'PM' : 'AM'
  hour = hour % 12 || 12

  return {
    hour: String(hour).padStart(2, '0'),
    minute,
    meridiem
  }
}

export function to24HourFormat(hour: string, minute: string, meridiem: Meridiem): string {
  let hour24 = parseInt(hour, 10)
  if (meridiem === 'PM' && hour24 !== 12) hour24 += 12
  if (meridiem === 'AM' && hour24 === 12) hour24 = 0
  return `${String(hour24).padStart(2, '0')}:${minute.padStart(2, '0')}`
}

export function formatTime12Hour(value: string): string {
  if (!value?.trim()) return ''
  const { hour, minute, meridiem } = to12HourParts(value)
  return `${hour}:${minute} ${meridiem}`
}

export const TIME_PICKER_HOURS = Array.from({ length: 12 }, (_, index) =>
  String(index + 1).padStart(2, '0')
)

export const TIME_PICKER_MINUTES = Array.from({ length: 60 }, (_, index) =>
  String(index).padStart(2, '0')
)

export const TIME_PICKER_MERIDIEMS: Meridiem[] = ['AM', 'PM']

export function addMinutesToTime(time: string, minutesToAdd = 30): string {
  if (!time?.trim()) return ''
  const [hourString = '0', minuteString = '0'] = time.split(':')
  const hour = parseInt(hourString, 10)
  const minute = parseInt(minuteString, 10)
  if (Number.isNaN(hour) || Number.isNaN(minute)) return ''

  const totalMinutes = hour * 60 + minute + minutesToAdd
  const normalizedMinutes = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60)
  const nextHour = Math.floor(normalizedMinutes / 60)
  const nextMinute = normalizedMinutes % 60

  return `${String(nextHour).padStart(2, '0')}:${String(nextMinute).padStart(2, '0')}`
}
