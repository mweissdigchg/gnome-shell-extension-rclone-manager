/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const St = imports.gi.St
const GObject = imports.gi.GObject
const ModalDialog = imports.ui.modalDialog
const CheckBox = imports.ui.checkBox
const Clutter = imports.gi.Clutter

let _openDialog

function openConfirmDialog (title, message, subMessage, okLabel, cancelLabel, callback) {
  log('dlg.openConfirmDialog')
  if (!_openDialog) {
    _openDialog = new ConfirmDialog()
      .setContentLayout(title, message + '\n' + subMessage)
      .setActionButtons(okLabel, cancelLabel, callback)
      .open()
  }
}

const ConfirmDialog = GObject.registerClass(
  class ConfirmDialog extends ModalDialog.ModalDialog {
    setContentLayout (title, desc) {
      const mainBox = new St.BoxLayout({
        vertical: false
      })
      const messageBox = new St.BoxLayout({
        vertical: true
      })
      const subjectLabel = new St.Label({
        style: 'font-weight: bold;',
        x_align: Clutter.ActorAlign.CENTER,
        text: title
      })
      const descLabel = new St.Label({
        style: 'padding-top: 12px;',
        x_align: Clutter.ActorAlign.CENTER,
        text: desc
      })
      descLabel.clutter_text.line_wrap = true
      const descScroll = new St.ScrollView()
      const descBox = new St.BoxLayout({ vertical: true })

      descBox.add_actor(descLabel)
      descScroll.add_actor(descBox)
      messageBox.add_child(subjectLabel)
      messageBox.add_actor(descScroll)
      mainBox.add_child(messageBox)
      this.contentLayout.add_child(mainBox)
      return this
    }

    setActionButtons (okLabel, cancelLabel, callback) {
      const buttons = [{
        label: okLabel,
        action: () => {
          this.close()
          callback && callback()
          _openDialog = null
        }
      }]
      if (cancelLabel) {
        buttons.push({
          label: cancelLabel,
          action: () => {
            this.close()
            _openDialog = null
          },
          key: Clutter.Escape
        })
      }
      this.setButtons(buttons)
      return this
    }
  }
)
