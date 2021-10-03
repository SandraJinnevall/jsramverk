import { shallowMount } from '@vue/test-utils'
import savedDocuments from '../../src/components/savedDocuments.vue'


describe('TextEditor.vue', () => {
    it('Användaren kan trycka på edit bland de sparade dokumenten', async () => {
        const wrapper = shallowMount(savedDocuments)
        await wrapper.setData({mydoc: [{_id:123, documentHeading:"hej", documentText:"text", userId: "123", ownerName: "användare1" }]})
        await wrapper.find('#edit').trigger('click')
    })
    it('Användaren kan logga ut genom att trycka på logga ut', async () => {
        const wrapper = shallowMount(savedDocuments)
        await wrapper.find('#logout').trigger('click')
    }),
    it('Användaren kan gå tillbaka till texteditorn', async () => {
        const wrapper = shallowMount(savedDocuments)
        await wrapper.find('#goHome').trigger('click')
    }) 
})
