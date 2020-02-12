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


/**
	(Immutable)
*/
export class NavigationTarget
{
	constructor (aPath, aSearch)
	{
		const url = new URL (location.href);
		const path = String (aPath || '')
			.split ('/')
			.filter (token => !!token)
			.join ('/');
		
		if (['http:', 'https:'].includes (url.protocol)) {
			if (aPath) {
				url.pathname = path;
			}
			
			Reflect.defineProperty (this, 'path', {value: url.pathname});
			
			if (aSearch) {
				const search = aSearch instanceof URLSearchParams
					? aSearch : new URLSearchParams (aSearch);
				url.search = search;
			}
			
			Reflect.defineProperty (this, 'searchParams', {
				get ()
				{
					return new URLSearchParams (url.search);
				}
			});
		} else {
			const hash = url.hash.substr (1).split ('?');
			const tmp = new URL ('https://example.org/');
			if (aPath) {
				tmp.pathname = path;
			} else {
				tmp.pathname = hash[0];
			}
			
			Reflect.defineProperty (this, 'path', {value: tmp.pathname});
			
			if (aSearch) {
				const search = aSearch instanceof URLSearchParams
					? aSearch : new URLSearchParams (aSearch);
				tmp.search = search;
			} else {
				tmp.search = hash.slice (1).join ('?');
			}
			
			Reflect.defineProperty (this, 'searchParams', {
				get ()
				{
					return new URLSearchParams (tmp.search);
				}
			});
			
			if (tmp.pathname === '/' && tmp.search === '') {
				url.hash = '';
			} else if (tmp.pathname === '/') {
				url.hash = tmp.search;
			} else if (tmp.search === '') {
				url.hash = tmp.pathname.substr (1);
			} else {
				url.hash = tmp.pathname.substr (1) + tmp.search;
			}
		}
		
		Reflect.defineProperty (this, 'search', {
			value: '?' + this.searchParams
		});
		
		Reflect.defineProperty (this, 'tokens', {
			value: this.path.split ('/').filter (token => token)
		});
		
		Reflect.defineProperty (this, 'href', {value: url.href});
	}
	
	toString ()
	{
		return this.href;
	}
}

