// @ts-check

class Counter extends HTMLElement {
    /** @type {string} */
    name = ""

    /** @type {number} */
    value = 0

    /** @type {number | null} */
    min = null

    /** @type {number | null} */
    max = null

    constructor() {
        super()
        this.attachShadow({ mode: "open" })
        if (!this.shadowRoot) return

        this.value = parseInt(this.getAttribute("value") ?? "0")
        const min = this.getAttribute("min")
        if (min) {
            this.min = parseInt(min)
        }

        const max = this.getAttribute("max")
        if (max) {
            this.max = parseInt(max)
        }

        this.shadowRoot.innerHTML = `
            <style>
                .x-counter {
                    display: inline-flex;
                    border: var(--x-border-size) hsl(var(--x-gray-5)) solid;
                    border-radius: var(--x-border-radius);
                    font-family: var(--x-font);
                    font-size: var(--x-text-sm);                

                    .increment, .decrement, .value {
                        padding: 0.3rem 0.5rem; 
                    }

                    .increment, .decrement {
                        border: none;
                        background-color: transparent;
                        cursor: pointer;
                        font-weight: var(--x-font-bold);
                        &:hover {
                            background-color: hsl(var(--x-gray-1));
                        }
                    }
                    
                    .value {
                        margin: auto 0;                    
                    }
                }
            </style>
            <span class="x-counter">
                <button data-decrement class="decrement">-</button>
                <span data-value class="value">${this.value}</span>
                <button data-increment class="increment">+</button>
                <input type="hidden" id="${this.name}" name="${this.name}" value="${this.value}"  />
            </span>
        `;
    }

    /**  @param {number} value */
    updateValue(value) {
        this.value = value
        const v = this.shadowRoot?.querySelector("[data-value]")
        if (!v) return
        v.innerHTML = this.value.toString()
    }

    handleInc = () => {
        if (this.max != null && ((this.value + 1) > this.max)) return
        this.updateValue(this.value + 1)
        this.dispatchEvent(new CustomEvent("increment", { detail: this.value }))
    }

    handleDec = () => {
        if (this.min != null && ((this.value - 1) < this.min)) return
        this.updateValue(this.value - 1)
        this.dispatchEvent(new CustomEvent("decrement", { detail: this.value }))
    }

    connectedCallback() {
        this
            .shadowRoot
            ?.querySelector("[data-increment]")
            ?.addEventListener("click", this.handleInc)

        this
            .shadowRoot
            ?.querySelector("[data-decrement]")
            ?.addEventListener("click", this.handleDec)
    }

    disconnectedCallback() {
        this
            .shadowRoot
            ?.querySelector("[data-increment]")
            ?.removeEventListener("click", this.handleInc)

        this
            .shadowRoot
            ?.querySelector("[data-decrement]")
            ?.removeEventListener("click", this.handleDec)
    }
}

customElements.define('x-counter', Counter)

/*
<x-counter value="3" max="5" min="0" />
*/