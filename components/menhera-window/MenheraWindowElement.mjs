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
import {MenheraAnchorElement} from '/_menhera/components/menhera-anchor/MenheraAnchorElement.mjs';

const shadowObjects = new ShadowObjects;

export class MenheraWindowElement extends HTMLElement
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
				href: '/_menhera/components/menhera-window/menhera-window.css',
			}
		);
		
		shadow.frame = appendNewElement (
			shadow.root, 'div', {
				id: 'frame',
			}
		);
		
		shadow.menubar = appendNewElement (
			shadow.root, 'div', {
				id: 'menubar',
				hidden: true,
			}
		);
		
		shadow.drawer = appendNewElement (
			shadow.root, 'div', {
				id: 'drawer',
				hidden: true,
			}
		);
		
		shadow.hiddenActivities = appendNewElement (
			shadow.root, 'div', {
				id: 'hidden-activities',
				hidden: true,
			}
		);
		
		shadow.slotVisible = appendNewElement (
			shadow.frame, 'slot', {
				name: 'visible-activity',
			}
		);
		
		shadow.slotInvisible = appendNewElement (
			shadow.hiddenActivities, 'slot'
		);
		
		shadow.frameSplash = appendNewElement (
			shadow.slotVisible, 'div', {
				id: 'frame-splash',
				hidden: true,
			}
		);
		
		shadow.frameSplash.innerHTML = `<svg id='loading-logo' viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'><circle cx='128' cy='128' fill='none' r='96' stroke='#5eaf00' stroke-width='16'/><path d='M84,96 l8,8 l-16,64 m16,-64 h96 l-16,64 m-32,-64 l-16,64' fill='none' stroke='#5eaf00' stroke-linecap='round' stroke-linejoin='round' stroke-width='16'/></svg>`;
		
		shadow.toggleDrawer = appendNewElement (
			shadow.menubar, 'button', {
				id: 'toggle-drawer',
			}
		);
		
		shadow.menuHeading = appendNewElement (
			shadow.menubar, 'h1', {
				id: 'menu-heading',
			}
		);
		
		shadow.menuHeading.textContent = 'Loading...';
		
		shadow.menuAccount = appendNewElement (
			shadow.menubar, 'menhera-anchor', {
				id: 'menu-account',
				path: '/login',
				search: '',
			}
		);
		
		shadow.menuAccount.textContent = 'Account / Sign in';
		
		shadow.drawerHeading = appendNewElement (
			shadow.drawer, 'h2', {
				id: 'drawer-heading',
			}
		);
		
		shadow.drawerSubheading = appendNewElement (
			shadow.drawer, 'h3', {
				id: 'drawer-subheading',
			}
		);
		
		shadow.drawerMenu = appendNewElement (
			shadow.drawer, 'nav', {
				id: 'drawer-menu',
			}
		);
		
		shadow.drawerMenuGroups = appendNewElement (
			shadow.drawerMenu, 'ul', {
				id: 'drawer-menu-groups',
			}
		);
		
		shadow.drawerMenuGroupsMap = Object.create (null);
		
		shadow.toggleDrawer.addEventListener ('click'
			, ev => this.toggleDrawer ());
	}
	
	/**
		Opens or closes the drawer.
	*/
	toggleDrawer ()
	{
		if (this.classList.contains ('drawer-toggled')) {
			this.classList.remove ('drawer-toggled');
		} else {
			this.classList.add ('drawer-toggled');
		}
	}
	
	connectedCallback ()
	{
		// Safeguard
		if (!this.isConnected) return;
		
		const shadow = shadowObjects.get (this);
		
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
	
	hasActivity (aElement)
	{
		return [... this.children].includes (aElement);
	}
	
	setActivity (aElement)
	{
		if (!(aElement instanceof HTMLElement)) {
			throw new TypeError ('Not an HTMLElement');
		}
		if (!this.hasActivity (aElement)) {
			this.append (aElement);
		}
		
		[... this.children]
			.filter (element => element.slot == 'visible-activity')
			.forEach (element => void (element.slot = ''));
		
		aElement.slot = 'visible-activity';
	}
	
	removeActivity (aElement)
	{
		if (!this.hasActivity (aElement)) {
			return false;
		}
		
		aElement.remove ();
		return true;
	}
	
	cleanupActivities ()
	{
		[... this.childNodes].forEach (node =>
			{
				if (node instanceof HTMLElement && node.slot == 'visible-activity') {
					// do nothing.
				} else {
					node.remove ();
				}
			}
		);
	}
	
	addMenuGroup (aGroupName)
	{
		const shadow = shadowObjects.get (this);
		if (aGroupName in shadow.drawerMenuGroupsMap) {
			return;
		}
		
		const group = {};
		
		group.wrapperElement = appendNewElement (
			shadow.drawerMenuGroups, 'li'
		);
		
		group.labelElement = appendNewElement (
			group.wrapperElement, 'div', {
				className: 'label'
			}
		);
		
		group.listContainer = appendNewElement (
			group.wrapperElement, 'ul'
		);
		
		group.itemsMap = Object.create (null);
		
		shadow.drawerMenuGroupsMap[aGroupName] = group;
	}
	
	setMenuGroupLabel (aGroupName, aGroupLabel)
	{
		const shadow = shadowObjects.get (this);
		if (!(aGroupName in shadow.drawerMenuGroupsMap)) {
			return false;
		}
		
		const group = shadow.drawerMenuGroupsMap[aGroupName];
		group.labelElement.textContent = aGroupLabel;
		return true;
	}
	
	removeMenuGroup (aGroupName)
	{
		const shadow = shadowObjects.get (this);
		if (!(aGroupName in shadow.drawerMenuGroupsMap)) {
			return;
		}
		
		const group = shadow.drawerMenuGroupsMap[aGroupName];
		group.wrapperElement.remove ();
		delete shadow.drawerMenuGroupsMap[aGroupName];
	}
	
	/**
		Add or modify a menu item.
	*/
	addMenuItem (aGroupName, aItemName, aItemLabel, aPath, aSearch)
	{
		const shadow = shadowObjects.get (this);
		if (!(aGroupName in shadow.drawerMenuGroupsMap)) {
			return false;
		}
		
		const group = shadow.drawerMenuGroupsMap[aGroupName];
		const groupItem = {};
		
		groupItem.wrapperElement = appendNewElement (
			group.listContainer, 'li'
		);
		
		groupItem.anchorElement = appendNewElement (
			groupItem.wrapperElement, 'menhera-anchor', {
				path: aPath,
				search: aSearch,
			}
		);
		
		groupItem.anchorElement.textContent = aItemLabel;
		
		group.itemsMap[aItemName] = groupItem;
		return true;
	}
	
	removeMenuItem (aGroupName, aItemName)
	{
		const shadow = shadowObjects.get (this);
		if (!(aGroupName in shadow.drawerMenuGroupsMap)) {
			return;
		}
		
		const group = shadow.drawerMenuGroupsMap[aGroupName];
		
		if (!(aItemName in group.itemsMap)) {
			return;
		}
		
		const groupItem = group.itemsMap[aItemName];
		groupItem.wrapperElement.remove ();
		delete group.itemsMap[aItemName];
	}
	
	get siteName ()
	{
		const shadow = shadowObjects.get (this);
		return shadow.drawerHeading.textContent;
	}
	
	set siteName (aSiteName)
	{
		const shadow = shadowObjects.get (this);
		shadow.drawerHeading.textContent = aSiteName;
		return true;
	}
	
	get siteSlogan ()
	{
		const shadow = shadowObjects.get (this);
		return shadow.drawerSubheading.textContent;
	}
	
	set siteSlogan (aSiteSlogan)
	{
		const shadow = shadowObjects.get (this);
		shadow.drawerSubheading.textContent = aSiteSlogan;
		return true;
	}
}

customElements.define ('menhera-window', MenheraWindowElement);

