import { shallowMount } from '@vue/test-utils'
import savedDocuments from '../../src/components/savedDocuments.vue'


describe('TextEditor.vue', () => {
    it('Användaren kan trycka på edit bland de sparade dokumenten', async () => {
        const wrapper = shallowMount(savedDocuments)
        await wrapper.setData({items: [{_id:123, documentHeading:"hej", documentText:"text"}]})
        await wrapper.find('#edit').trigger('click')
    })
})
