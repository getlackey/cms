/*jslint node:true, unparam:true*/
'use strict';
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