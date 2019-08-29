export default class Input {
  constructor(element) {
    this.el = element;
    this.input = null;
    this.label = null;
    this.globalObserver = null;

    this.init();
  }

  static initHtmlApi() {
    this.initDOMLoadedElements = this.initDOMLoadedElements.bind(this);

    // MutationObserver is IE11+
    if (typeof MutationObserver !== 'undefined') {
      // Mutation observer to observe dynamically added elements
      this.globalObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          Array.prototype.forEach.call(mutation.addedNodes, (addedNode) => {
            if (addedNode.nodeType === 1) {
              if (addedNode.classList.contains('input-field')) {
                !addedNode.Input && new Input(addedNode);
              } else {
                Array.prototype.forEach.call(
                  addedNode.querySelectorAll('.input-field'),
                  (el) => {
                    !el.Input && new Input(el);
                  },
                );
              }
            }
          });

          Array.prototype.forEach.call(mutation.removedNodes, (removedNode) => {
            if (removedNode.nodeType === 1) {
              if (removedNode.classList.contains('input-field')) {
                removedNode.Input && removedNode.Input.unMount();
              } else {
                Array.prototype.forEach.call(
                  removedNode.querySelectorAll('.input-field'),
                  (el) => {
                    el.Input && el.Input.unMount();
                  },
                );
              }
            }
          });
        });
      });

      this.globalObserver.observe(document, { childList: true, subtree: true });
    }

    // Taken from jQuery `ready` function
    // Instantiate elements already present on the page
    if (
      document.readyState === 'complete'
      || (document.readyState !== 'loading' && !document.documentElement.doScroll)
    ) {
      // Handle it asynchronously to allow scripts the opportunity to delay init
      window.setTimeout(this.initDOMLoadedElements);
    } else {
      document.addEventListener('DOMContentLoaded', this.initDOMLoadedElements);
      window.addEventListener('load', this.initDOMLoadedElements);
    }
  }

  static initDOMLoadedElements() {
    document.removeEventListener(
      'DOMContentLoaded',
      this.initDOMLoadedElements,
    );
    window.removeEventListener('load', this.initDOMLoadedElements);

    Array.prototype.forEach.call(
      document.querySelectorAll('.input-field'),
      (el) => {
        if (!el.Input) new Input(el);
      },
    );
  }

  init() {
    this.el.Input = this;

    this.input = this.el.querySelector('.input-field__input');
    this.label = this.el.querySelector('.input-field__label');

    if (!this.input || !this.input) {
      return;
    }

    if (this.input.value !== '') {
      this.label.classList.add('input-field__label_active');
    }

    this.input.addEventListener('focus', this.onFocus);
    this.input.addEventListener('blur', this.onBlur);
  }

  onFocus = () => {
    this.el.classList.add('input-field_focused');
    this.label.classList.add('input-field__label_active');
  };

  onBlur = () => {
    this.el.classList.remove('input-field_focused');
    if (this.input.value === '') {
      this.label.classList.remove('input-field__label_active');
    }
  };

  unMount() {
    this.input.removeEventListener('focus', this.onFocus);
    this.input.removeEventListener('blur', this.onBlur);
    this.el.Input = null;
  }
}


Input.initHtmlApi();
