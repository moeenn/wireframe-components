// @ts-check

import { CustomElement } from "./customElement.mjs";

class Modal extends CustomElement {
	/** @type {boolean} */
	open = false;

	/** @type {string} */
	width = "40rem";

	/** @type {string | null} */
	height = null;

	#styles() {
		return `
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

	                .window-container {
	                    margin: auto;
	                    padding: 1rem;
	                    width: ${this.width};

			           .window {
			               background-color: white;
			               border-radius: var(--x-border-radius);
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
			                   background-color: hsla(var(--x-gray-2), 50%);
			                   padding: 1.3rem 1rem;
			               }
			           }
                    }
                }
            </style>
		`;
	}

	constructor() {
		super();
		const open = this.getAttribute("open");
		if (open && open == "true") {
			this.open = true;
		}

		const width = this.getAttribute("width");
		if (width != null) {
			this.width = width;
		}

		const height = this.getAttribute("height");
		if (height != null) {
			this.height = height;
		}

		this.$add(this.#styles());
		if (this.open) {
			this.$add(this.#modalContent());
		}
	}

	#modalContent() {
		return `
            <div class="x-modal">
            	<div class="window-container">
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
            </div>
        `;
	}

	setOpen() {
		this.$add(this.#modalContent());
		this.$("#close").addEventListener("click", this.handleClose);
		this.open = true;
		this.$emit("open");
	}

	handleClose = () => {
		this.$(".x-modal").remove();
		this.open = false;
		this.$emit("close");
	};
}

customElements.define("x-modal", Modal);

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
