import { shallowMount } from '@vue/test-utils'
import login from '../../src/components/login.vue'


describe('login.vue', () => {
    it('Användaren kan trycka på login', async () => {
        const wrapper = shallowMount(login)
        await wrapper.find('#login').trigger('click')
    }) 
})
