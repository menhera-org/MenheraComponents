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
import {NavigationTarget} from '/_menhera/modules/NavigationTarget.mjs';

const shadowObjects = new ShadowObjects;

export class MenheraAnchorElement extends HTMLElement
{
	static get observedAttributes ()
	{
		return [];
	}
	
	constructor (aPath, aSearch)
	{
		super ();
		const shadow = shadowObjects.get (this);
		shadow.target = new NavigationTarget (aPath, aSearch);
		
		shadow.isDuringClick = false;
		this.addEventListener ('click', ev => {
			if (shadow.isDuringClick) {
				shadow.isDuringClick = false;
				return;
			}
			
			ev.preventDefault ();
			ev.stopImmediatePropagation ();
			
			const innerEvent = new MouseEvent ('click', {
				view: this.ownerDocument.defaultView,
				bubbles: true,
				cancelable: true
			});
			
			shadow.isDuringClick = true;
			const canceled = !this.dispatchEvent (innerEvent);
			if (canceled) {
				return;
			}
			
			shadow.click ();
		});
		
		import ('/_menhera/modules/menhera.mjs').then (({menhera}) => {
			shadow.click = () => menhera.triggerNavigation (
				shadow.target, this.ownerDocument.defaultView);
		});
	}
	
	/**
		Navigate to a new activity.
	*/
	click ()
	{
		const innerEvent = new MouseEvent ('click', {
			view: this.ownerDocument.defaultView,
			bubbles: true,
			cancelable: true
		});
		
		return !!this.dispatchEvent (innerEvent);
	}
	
	connectedCallback ()
	{
		// Safeguard
		if (!this.isConnected) return;
		
		const shadow = shadowObjects.get (this);
		
		// do something
		
	}
	
	disconnectedCallback ()
	{
		
	}
	
	adoptedCallback ()
	{
		
	}
	
	attributeChangedCallback (aName, aOldValue, aNewValue)
	{
		
	}
	
	get path ()
	{
		const shadow = shadowObjects.get (this);
		return shadow.target.path;
	}
	
	set path (aPath)
	{
		const shadow = shadowObjects.get (this);
		const search = shadow.target.search;
		shadow.target = new NavigationTarget (aPath, search);
		return true;
	}
	
	get search ()
	{
		const shadow = shadowObjects.get (this);
		return shadow.target.search;
	}
	
	set search (aSearch)
	{
		const shadow = shadowObjects.get (this);
		const path = shadow.target.path;
		shadow.target = new NavigationTarget (path, aSearch);
		return true;
	}
}

customElements.define ('menhera-anchor', MenheraAnchorElement);

