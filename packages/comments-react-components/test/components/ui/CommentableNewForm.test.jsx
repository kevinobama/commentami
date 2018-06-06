import { mount } from 'enzyme'
import React from 'react'
import { CommentableContext } from '../../../src/components/core/CommentableProvider'
import { CommentableNewForm } from '../../../src/components/ui/CommentableNewForm'

describe('CommentableNewForm', () => {
  describe('.render', () => {
    test('should render the core elements', () => {
      const wrapper = mount(
        <div>
          <CommentableContext.Provider value={{}}>
            <CommentableNewForm reference="REFERENCE" />
          </CommentableContext.Provider>
        </div>
      )

      expect(wrapper.find('form').hasClass('nf-comments-new-form')).toBeTruthy()
      expect(wrapper.find('textarea.nf-comments-new-form__textarea').prop('placeholder')).toEqual('Enter some text ...')
      expect(wrapper.find('button.nf-comments-new-form__button--secondary').text()).toEqual('Cancel')
      expect(wrapper.find('button.nf-comments-new-form__button--primary').text()).toEqual('Add')
    })

    test('should allow class, title and labels overriding', () => {
      const wrapper = mount(
        <div>
          <CommentableContext.Provider value={{}}>
            <CommentableNewForm className="CLS" title="TITLE" placeholder="PLACEHOLDER" cancelLabel="CANCEL" submitLabel="SUBMIT" />
          </CommentableContext.Provider>
        </div>
      )

      expect(wrapper.find('form').hasClass('CLS')).toBeTruthy()
      expect(wrapper.find('h2.nf-comments-new-form__title').text()).toEqual('TITLE')
      expect(wrapper.find('textarea.nf-comments-new-form__textarea').prop('placeholder')).toEqual('PLACEHOLDER')
      expect(wrapper.find('button.nf-comments-new-form__button--secondary').text()).toEqual('CANCEL')
      expect(wrapper.find('button.nf-comments-new-form__button--primary').text()).toEqual('SUBMIT')
    })
  })

  describe('submitting', () => {
    test('should submit when clicking on the button', () => {
      const addComment = jest.fn()

      const wrapper = mount(
        <div>
          <CommentableContext.Provider value={{}}>
            <CommentableNewForm reference="REFERENCE" addComment={addComment} />
          </CommentableContext.Provider>
        </div>
      )

      wrapper.find('textarea').instance().value = 'VALUE'
      wrapper.find('button.nf-comments-new-form__button--primary').simulate('click')

      expect(addComment).toHaveBeenCalledWith('REFERENCE', 'VALUE')
    })

    test('should submit when typing enter', async () => {
      const addComment = jest.fn()

      const wrapper = mount(
        <div>
          <CommentableContext.Provider value={{}}>
            <CommentableNewForm reference="REFERENCE" addComment={addComment} />
          </CommentableContext.Provider>
        </div>
      )

      wrapper.find('textarea').instance().value = 'VALUE'
      wrapper.find('textarea').simulate('keyPress', { key: 'enter' })
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(addComment).toHaveBeenCalledWith('REFERENCE', 'VALUE')
    })

    test('should NOT submit when there is no value', () => {
      const addComment = jest.fn()

      const wrapper = mount(
        <div>
          <CommentableContext.Provider value={{}}>
            <CommentableNewForm reference="REFERENCE" addComment={addComment} />
          </CommentableContext.Provider>
        </div>
      )

      wrapper.find('button.nf-comments-new-form__button--primary').simulate('click')

      expect(addComment).not.toHaveBeenCalled()
    })

    test('should submit when typing shift+enter', async () => {
      const addComment = jest.fn()

      const wrapper = mount(
        <div>
          <CommentableContext.Provider value={{}}>
            <CommentableNewForm reference="REFERENCE" addComment={addComment} />
          </CommentableContext.Provider>
        </div>
      )

      wrapper.find('textarea').instance().value = 'VALUE'
      wrapper.find('textarea').simulate('keyPress', { key: 'enter', shiftKey: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(addComment).not.toHaveBeenCalled()
    })
  })

  describe('resetting', () => {
    test('should clear input when clicking on the button', () => {
      const wrapper = mount(
        <div>
          <CommentableContext.Provider value={{}}>
            <CommentableNewForm reference="REFERENCE" />
          </CommentableContext.Provider>
        </div>
      )

      const element = wrapper.find('textarea').instance()

      element.value = 'VALUE'

      expect(element.value).toEqual('VALUE')
      wrapper.find('button.nf-comments-new-form__button--secondary').simulate('click')
      expect(element.value).toEqual('')
    })
  })
})
