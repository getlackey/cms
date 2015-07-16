/*jslint node:true, unparam:true*/
'use strict';
/*
    Copyright 2015 Enigma Marketing Services Limited

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

/*
    Usage eg.
    <h1>{@user is="groupaName"}OK{/user}</h1>

    or: 
    <h1>{@user isAny="groupaName1 groupaName2"}OK{/user}</h1>

*/
module.exports = function (dust) {
    if (!dust) {
        throw new Error('Parameter "dust" is not defined.');
    }

    dust.helpers = dust.helpers || {};

    dust.helpers.user = function (chunk, context, bodies, params) {
        var group = dust.helpers.tap(params.is, chunk, context),
            groups = dust.helpers.tap(params.isAny, chunk, context),
            user = context.get('user');

        function renderOK() {
            return chunk.render(bodies.block, context);
        }

        function renderKO() {
            if (bodies.else) {
                return chunk.render(bodies.else, context);
            }
            return chunk;
        }

        if (!user) {
            return renderKO();
        }

        if (group) {
            if (user.is(group)) {
                return renderOK();
            }
            return renderKO();
        }

        if (groups) {
            if (user.isAny(groups)) {
                return renderOK();
            }
            return renderKO();
        }

        return chunk.end();
    };
};