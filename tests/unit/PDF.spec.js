import { shallowMount } from '@vue/test-utils'
import TextEditor from '../../src/components/TextEditor.vue'
import Vue from 'vue';

describe('TextEditor.vue', () => {
    Vue.prototype.$currentdoc = Vue.observable({
        _id: "",
        documentText: "",
        documentHeading: "",
        userId: "",
        sharedWith: [],
        ownerName: ""
    });
    it('Användaren kan trycka på pdf knappen', async () => {
        const wrapper = shallowMount(TextEditor)
        await wrapper.find('#pdf').trigger('click')
    })
})
