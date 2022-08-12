import dayjs from 'dayjs'

export function format(time: any, f = 'YYYY-MM-DD') {
    return dayjs(time).format(f)
}