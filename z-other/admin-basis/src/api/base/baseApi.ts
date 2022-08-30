import api from '@/plugins/tzAxios'
import { CargoListItem } from './types'


export const saveContactInfo = (data: Record<string, any>) => {
    const option = {
        // ....
    }
    return api.post(option)
}
// ......