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

import {NavigationTarget} from '/_menhera/modules/NavigationTarget.mjs';

const CACHE_NAME = 'menhera-assets-v1';


export const menhera = Object.freeze ({
	get path ()
	{
		const url = new URL (location.href);
		const pathname = ['http:', 'https:'].includes (url.protocol)
			? url.pathname
			: url.hash.substr (1).split ('?')[0];
		
		return '/' +
			pathname.split ('/')
			.filter (token => !!token)
			.join ('/');
	},
	
	get search ()
	{
		const url = new URL (location.href);
		return ['http:', 'https:'].includes (url.protocol)
			? url.search
			: url.hash.substr (1).split ('?').slice (1).join ('?');
	},
	
	get searchParams ()
	{
		return new URLSearchParams (this.search);
	},
	
	/**
		Broadcasts a navigation event.
	*/
	triggerNavigation (aTarget, aView, aRewrite)
	{
		if (!(aTarget instanceof NavigationTarget)) {
			throw new TypeError ('Not a NavigationTarget');
		}
		
		const canceled = !top.dispatchEvent (new CustomEvent ('MenheraNavigate', {
			detail: Object.freeze ({
				target: aTarget,
				view: aView,
			})
		}));
		
		if (!canceled) {
			if (aRewrite) {
				this.redirectTo (aTarget.path, aTarget.search);
			} else {
				this.navigateTo (aTarget.path, aTarget.search);
			}
		}
		
		return !canceled;
	},
	
	/**
		Navigates the history to a new target.
	*/
	navigateTo (aPath, aSearch)
	{
		const target = new NavigationTarget (aPath, aSearch);
		history.pushState (target, '', target.href);
	},
	
	/**
		Rewrites the current history target.
	*/
	redirectTo (aPath, aSearch)
	{
		const target = new NavigationTarget (aPath, aSearch);
		history.replaceState (target, '', target.href);
	},
	
	/**
		Add assets to the cache.
		This may reject if ServiceWorkers are not supported.
	*/
	async addToCache (... aAssets)
	{
		if ('object' !== typeof caches) {
			return false;
		}
		const cache = await caches.open (CACHE_NAME);
		await Promise.all (aAssets.map (path => cache.add (path)));
	},
});


