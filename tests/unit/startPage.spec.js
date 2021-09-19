import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import StartPage from '../../src/components/StartPage.vue'
import App from '@/App.vue'



describe('StartPage.vue', () => {
  it('Användaren kommer in på första sidan och ser rubriken Welcome!', () => {
    const wrapper = shallowMount(StartPage)
    const h3 = wrapper.find("h3")
    expect(h3.text()).to.equal("Welcome!")
  })

  it('Användaren kan trycka på Try me!', async () => {
    const wrapper = shallowMount(App)
    await wrapper.find('.firstpagebutton').trigger('click')
    expect(wrapper.text()).to.equal("Try me!")
  })
})
