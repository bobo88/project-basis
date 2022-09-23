import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import TopSwipe from '../TopSwipe.vue'

describe('TopSwipe', () => {
  it('renders properly', () => {
    const wrapper = mount(TopSwipe)
    expect(wrapper.vm.testData).toBe(123)
  })
})
