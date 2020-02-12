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


// For non-module scripts
'use strict';

const CACHE_NAME = 'menhera-assets-v1';

const OFFLINE_DEFAULT = '/index.html';


self.addEventListener ('install', ev => {
	console.log ('[ServiceWorker] install');
	ev.waitUntil ((async () => {
		const cache = await caches.open (CACHE_NAME);
		await cache.add (OFFLINE_DEFAULT);
	}) ());
});

self.addEventListener ('message', ev =>
	console.log ('[ServiceWorker] message:', ev));

self.addEventListener ('fetch', ev => {
	ev.respondWith (fromCache (ev.request));
	ev.waitUntil (update (ev.request));
});


const fromCache = async request => {
	const cache = await caches.open (CACHE_NAME);
	let response = await cache.match (request);
	console.log ('[ServiceWorker] Matched response:', response);
	
	if (!response) {
		// not included in cache, ignoring
		try {
			response = await fetch (request);
		} catch (e) {
			console.warn ('[ServiceWorker] Fetch failed:', e);
			response = await cache.match (OFFLINE_DEFAULT);
			if (!response) {
				console.warn ('[ServiceWorker] OFFLINE_DEFAULT failed');
				throw e;
			}
		}
	}
	
	console.log ('[ServiceWorker] returning response:', response);
	return response;
};

const update = async request => {
	const cache = await caches.open (CACHE_NAME);
	let response = await cache.match (request);
	try {
		if (!response) {
			console.log ('[ServiceWorker] skipping update:', request);
			return;
		}
		response = await fetch (request);
		return cache.put (request, response);
	} catch (err) {
		console.log ('[ServiceWorker] update() failed:', err);
	}
};



