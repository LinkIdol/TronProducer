module.exports = app => {
    const { STRING, INTEGER, TINYINT, BIGINT } = app.Sequelize;

    // const User = app.model.define([
    //     'require',
    //     'dependency'
    // ], function(require, factory) {
    //     'use strict';

    // });

    const UserLikeModel = app.model.define('userlike', {
        Id: { type: INTEGER, primaryKey: true },
        UserId: { type: BIGINT },
        TokenId: { type: STRING },
        CreateDate: { type: STRING },
    },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: 'userlikes',
        }
    );

    return UserLikeModel;
}