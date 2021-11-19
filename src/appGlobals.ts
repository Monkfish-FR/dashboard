import Bus from './utils/bus';
import { FlashMessageUI } from './components/FlashMessage/interfaces';
import { ModalUI } from './components/Modal/interfaces';

declare global {
  interface Window {
    flashMessage: (message: FlashMessageUI) => boolean;

    openModal: (modal: ModalUI) => boolean;
    closeModal: () => boolean;
  }
}

window.flashMessage = (message) => Bus.emit('flash', message);

window.openModal = (modal) => Bus.emit('modal:open', modal);
window.closeModal = () => Bus.emit('modal:close');
