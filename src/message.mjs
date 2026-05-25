// @ts-check

class Message extends HTMLElement {
    /** @type {boolean} */
    open = true
    text = ""
    type = "info"

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })

        const text = this.getAttribute("text");
        if (text) {
            this.text = text
        }

        const show = this.getAttribute("show")
        if (show && show == "false") {
            this.open = false
        }

        const type = this.getAttribute("type")
        if (type) {
            this.type = type
        }

        if (!this.shadowRoot) return
        this.shadowRoot.innerHTML = `
            <style>
                #x-message {
                    background-color: hsla(var(${this.#getBoxColor()}), 100%);
                    padding: 1rem;
                    font-size: var(--x-text-sm);
                    display: flex;
                    justify-content: space-between;

                    p {
                        margin: auto 0;
                    }

                    button {
                        cursor: pointer;
                    }
                }
            </style>
        `

        if (this.open) {
            this.shadowRoot.innerHTML += this.#boxContent()
        }
    }

    #getBoxColor() {
        switch (this.type) {
            case "success":
                return "--x-blue-1"

            case "error":
                return "--x-red-1"

            default:
                return "--x-gray-1"
        }
    }

    #boxContent() {
        return `
            <div data-root id="x-message">
                <p>${this.text}</p>
                <button id="close">x</>
            </div>        
        `
    }

    show = () => {
        if (!this.shadowRoot) return
        this.shadowRoot.innerHTML += this.#boxContent()
        this.connectedCallback()
        this.open = true
    }

    dismiss = () => {
        const msg = this.shadowRoot?.getElementById("x-message")
        msg?.remove()
        this.open = false
    }

    connectedCallback() {
        const close = this.shadowRoot?.getElementById("close")
        if (close) {
            close.addEventListener("click", this.dismiss)
        }
    }
}

customElements.define("x-message", Message)