/* -*- tab-width: 4; indent-tabs-mode: t -*- */
/**
	MenheraComponents

	Copyright (C) 2020  Menhera.org

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import {ShadowObjects} from '/_menhera/modules/ShadowObjects.mjs';
import {appendNewElement} from '/_menhera/modules/DOMUtils.mjs';
import '/_menhera/dependencies/markdown-it_10.0.0.min.js';

const shadowObjects = new ShadowObjects;
const md = markdownit ();

export class MenheraMarkdownElement extends HTMLElement
{
	static get observedAttributes ()
	{
		return [];
	}
	
	constructor ()
	{
		super ();
		const shadow = shadowObjects.get (this);
		
		shadow.root = this.attachShadow ({mode: 'closed'});
		
		appendNewElement (
			shadow.root, 'link', {
				rel: 'stylesheet',
				href: '/_menhera/common/common.css',
			}
		);
		
		appendNewElement (
			shadow.root, 'link', {
				rel: 'stylesheet',
				href: '/_menhera/components/menhera-markdown/menhera-markdown.css',
			}
		);
		
		shadow.container = appendNewElement (
			shadow.root, 'div', {
				id: 'container',
			}
		);
	}
	
	render ()
	{
		const shadow = shadowObjects.get (this);
		
		const html = `<!doctype html><meta charset='utf-8'/><body>`
			+ md.render(this.textContent) + '</body>';
		
		[... shadow.container.childNodes]
			.forEach (node => node.remove ());
		
		[... new DOMParser ().parseFromString (html, 'text/html').body.childNodes]
			.forEach (node =>
				shadow.container.append (this.ownerDocument.adoptNode (node)));
	}
	
	connectedCallback ()
	{
		// Safeguard
		if (!this.isConnected) return;
		
		const shadow = shadowObjects.get (this);
		shadow.observer = new MutationObserver (mutations => {
			this.render ();
		});
		
		shadow.observer.observe (this, {
			characterData: true,
			childList: true,
			subtree: true,
		});
	}
	
	disconnectedCallback ()
	{
		const shadow = shadowObjects.get (this);
		shadow.observer && shadow.observer.disconnect ();
	}
	
	adoptedCallback ()
	{
		
	}
	
	attributeChangedCallback (aName, aOldValue, aNewValue)
	{
		
	}
}

customElements.define ('menhera-markdown', MenheraMarkdownElement);

