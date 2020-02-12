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

export {MenheraWindowElement} from '/_menhera/components/menhera-window/MenheraWindowElement.mjs';

export {MenheraAnchorElement} from '/_menhera/components/menhera-anchor/MenheraAnchorElement.mjs';

export {MenheraMarkdownElement} from '/_menhera/components/menhera-markdown/MenheraMarkdownElement.mjs';

import {NavigationTarget} from '/_menhera/modules/NavigationTarget.mjs';
import {menhera} from '/_menhera/modules/menhera.mjs';

export {NavigationTarget, menhera};


window.addEventListener ('popstate'
	, ev => void (
		(ev.state instanceof NavigationTarget)
		&& top.dispatchEvent (new CustomEvent ('MenheraNavigate', {
			detail: Object.freeze ({
				target: ev.state,
				view: window,
			})
		}))
	)
);

window.addEventListener ('DOMContentLoaded'
	, ev => {
		const target = new NavigationTarget (menhera.path, menhera.search);
		history.replaceState (target, '', target.href);
		
		top.dispatchEvent (new CustomEvent ('MenheraNavigate', {
			detail: Object.freeze ({
				target,
				view: window,
			})
		}))
	}
);


