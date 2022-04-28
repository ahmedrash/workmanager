import { VueRenderer } from '@tiptap/vue-2'
import tippy from 'tippy.js'
import MentionList from './MentionList.vue'
export default {
  items: ({ query }) => {
    let userarray = JSON.parse(localStorage.getItem('userlist'))
    console.log(userarray)
    return userarray.filter(item => item.label.toLowerCase().startsWith(query.toLowerCase()))
  },
  render: () => {
    let component
    let popup

    return {
      onStart: props => {
        component = new VueRenderer(MentionList, {
          // using vue 2:
          parent: this,
          propsData: props,
          // props,
          // editor: this.editor,
        })

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },

      onUpdate(props) {
        component.updateProps(props)

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide()

          return true
        }

        return component.ref?.onKeyDown(props)
      },

      onExit() {
        popup[0].destroy()
        component.destroy()
      },
    }
  },
}