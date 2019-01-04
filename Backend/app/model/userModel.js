module.exports = app => {
    const { STRING, INTEGER, TINYINT, BIGINT } = app.Sequelize;

    // const User = app.model.define([
    //     'require',
    //     'dependency'
    // ], function(require, factory) {
    //     'use strict';

    // });

    const UserModel = app.model.define('user', {
        UserId: { type: BIGINT, primaryKey: true },
        UserName: { type: STRING },
        Address: { type: STRING },
    },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: 'users',
        }
    );

    return UserModel;
}