module.exports = function (sequelize, DataTypes) {
    const Event = sequelize.define("Event", {
        name: {
            type: DataTypes.STRING,
            allowNull: { msg: 'Please enter a name.' },
            validate: {
                len: {
                    args: [1, 255],
                    msg: 'The name can only be 255 characters long.'
                }
            }
        },
        founderID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: true,
            validate: {
                isDate: { msg: 'Please enter a valid date.' }
            }
        }
    });

    Event.associate = function (models) {
        Event.belongsTo(models.Community, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    Event.associate = function (models) {
        Event.hasMany(models.Post, {
            foreignKey: {
                allowNull: true
            }
        });
    };

    return Event;
};