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


export class ShadowObjects extends WeakMap
{
	constructor ()
	{
		super ();
		Reflect.preventExtensions (this);
	}
	
	get (obj)
	{
		if (!super.has (obj)) {
			super.set (obj, Object.create (null));
		}
		
		return super.get (obj);
	}
	
	set (obj, value)
	{
		return false;
	}
	
	has (obj)
	{
		return true;
	}
}
