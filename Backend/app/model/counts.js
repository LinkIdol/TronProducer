module.exports = app => {
    const { STRING, INTEGER, BIGINT } = app.Sequelize;

    const Counts = app.model.define('Counts', {
        Counts:INTEGER,
    },
        {
            timestamps: false,
            freezeTableName: true,
            //tableName: 'idols',
        }
    );

    return Counts;
}