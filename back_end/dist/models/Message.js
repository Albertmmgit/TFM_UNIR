"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/Message.ts
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Message extends sequelize_1.Model {
}
Message.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    chatId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'chatId',
    },
    senderId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'senderId',
    },
    content: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        field: 'content',
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        field: 'createdAt',
        defaultValue: database_1.default.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: database_1.default.literal('CURRENT_TIMESTAMP'),
    },
    isRead: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
        field: 'isRead',
        defaultValue: false,
    },
}, {
    sequelize: database_1.default,
    modelName: 'Message',
    tableName: 'message',
    timestamps: true,
});
exports.default = Message;
