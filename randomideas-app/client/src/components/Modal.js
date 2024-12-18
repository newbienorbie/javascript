class Modal {
  constructor() {
    this._modal = document.querySelector("#modal");
    this._modalBtn = document.querySelector("#modal-btn");
    this.addEventListeners();
  }

  addEventListeners() {
    this._modalBtn.addEventListener("click", this.open.bind(this)); // when we use the "this" keyword inside of a class method and it's on an eventListener, "this" is going to pertain to the element that the event was called on. we need to use bind, so now "this" pertains to the class rather than the element

    window.addEventListener("click", this.outsideClick.bind(this));
    document.addEventListener("closemodal", () => this.close());
  }

  open() {
    this._modal.style.display = "block";
  }

  close() {
    this._modal.style.display = "none";
  }

  outsideClick(e) {
    if (e.target === this._modal) {
      this.close();
    }
  }
}

export default Modal;
