import { ResponseType } from 'axios'
declare global {
    interface TzBaseListResp {
        total: number,
        size: number,
        current: number,
        pages: number,
        searchCount: boolean
    }
}