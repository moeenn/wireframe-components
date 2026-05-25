// @ts-check

class Modal extends HTMLElement {
    /** @type {boolean} */
    open = false

    /** @type {string} */
    width = "40rem"

    /** @type {string | null} */
    height = null

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })

        const open = this.getAttribute("open")
        if (open && open == "true") {
            this.open = true
        }

        const width = this.getAttribute("width")
        if (width != null) {
            this.width = width
        }

        const height = this.getAttribute("height")
        if (height != null) {
            this.height = height
        }

        if (!this.shadowRoot) return
        this.shadowRoot.innerHTML = `
            <style>
                .x-modal {
                    color: hsl(var(--x-font-color));
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: var(--x-layer-3);
                    width: 100vw;
                    height: 100vh;
                    background: hsla(var(--x-gray-5), 40%);
                    display: flex;

                    .window {
                        margin: auto;
                        background-color: white;
                        border-radius: var(--x-border-radius);
                        width: ${this.width};
                        height: ${this.height ? this.height : "auto"};
                        box-shadow: var(--x-shadow-sm);
                        border: var(--x-border-size) solid hsl(var(--x-gray-4));

                        .modal-header {
                            padding: 1rem;
                            display: flex;
                            justify-content: space-between;
                            font-family: var(--x-font);

                            h2 {                            
                                font-size: var(--x-text-lg);
                                font-weight: normal;
                                margin: 0;
                            }

                            .close {
                                cursor: pointer;
                            }
                        }

                        .modal-footer {
                            background-color: hsla(var(--x-gray-1), 50%);
                            padding: 1rem;
                        }
                    }
                }
            </style>    
        `

        if (this.open) {
            this.shadowRoot.innerHTML += this.#modalContent()
        }
    }

    #modalContent() {
        return `
            <div class="x-modal">
                <div class="window">
                    <div class="modal-header">
                        <h2>${this.title}</h2>
                        <button id="close" class="close">x</button>
                    </div>
                    <slot></slot>
                    
                    <div class="modal-footer">
                        <slot id="footer-slot" name="footer"></slot>
                    </div>
                </div>
            </div>        
        `
    }

    setOpen() {
        if (!this.shadowRoot) return
        this.shadowRoot.innerHTML += this.#modalContent()
        this.shadowRoot
            ?.querySelector("#close")
            ?.addEventListener("click", this.handleClose)

        this.open = true
        this.dispatchEvent(new CustomEvent("open"))
    }

    handleClose = () => {
        /** @type {HTMLElement} */ (this.shadowRoot?.querySelector(".x-modal")).remove()
        this.open = false;
        this.dispatchEvent(new CustomEvent("close"))
    }
}

customElements.define('x-modal', Modal)

/*
<button id="open">Open</button>

<x-modal title="Add User" width="30rem">
    <form style="padding: 1rem">
        <fieldset>
            <label for="name">Name</label>
            <input id="name" name="name" />
        </fieldset>

        <fieldset>
            <label for="password">Password</label>
            <input id="password" name="password" />
        </fieldset>

        <fieldset>
            <label for="confirmPassword">Confirm Password</label>
            <input id="confirmPassword" name="confirmPassword" />
        </fieldset>
    </form>

    <div slot="footer">
        <button>Save</button>
    </div>
</x-modal>

<script>
    document.addEventListener("DOMContentLoaded", () => {
        const open = document.querySelector("#open")
        const modal = document.querySelector("x-modal")

        open.addEventListener("click", () => {
            modal.setOpen()
        })
    })
</script>
*/