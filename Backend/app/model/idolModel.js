module.exports = app => {
    const { STRING, INTEGER, BIGINT } = app.Sequelize;

    const IdolModel = app.model.define('idol', {
        TokenId: { type: BIGINT, primaryKey: true },
        UserId: BIGINT,
        NickName: STRING,
        Genes: STRING,
        BirthTime: INTEGER,
        Bio: STRING,
        Pic: STRING,
        Generation: INTEGER,
        CooldownIndex: INTEGER,
        CooldownEndBlock: INTEGER,
        HairColor: STRING,
        EyeColor: STRING,
        HairStyle: STRING,
        MatronId: BIGINT,
        SireId: BIGINT,
        LikeCount: INTEGER,
        IsForSale: INTEGER,
        IsRental: INTEGER,
        StartedAt: INTEGER,
        StartingPrice: INTEGER,
        EndingPrice: INTEGER,
        Duration: INTEGER,
        IsPregnant: INTEGER,
    },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: 'idols',
        }
    );

    return IdolModel;
}