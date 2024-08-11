import { DataTypes, Op } from "sequelize";
import sequelize from "../config/dbConnect.js";
import {User} from "./user.js";


const Income = sequelize.define(
  "Income",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

Income.belongsTo(User, { as: "user", foreignKey: "userId" });
User.hasMany(Income, { as: "incomes", foreignKey: "userId" });

async function getUserRole(userId) {
  const user = await User.findByPk(userId);
  return user ? user.role : null;
}


Income.getCurrentMonthIncome = async function (userId) {
  const role = await getUserRole(userId);
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const whereCondition = role === "admin" ? {} : { userId };

  return await Income.sum('amount', {
    where: {
      ...whereCondition,
      [Op.and]: [
        sequelize.where(sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM "date"')), currentMonth),
        sequelize.where(sequelize.fn('EXTRACT', sequelize.literal('YEAR FROM "date"')), currentYear)
      ],
    },
  });
};


Income.getLastMonthIncome = async function (userId) {
  const role = await getUserRole(userId);
  const lastMonth = new Date().getMonth(); 
  const currentYear = new Date().getFullYear();

  const whereCondition = role === "admin" ? {} : { userId };

  return await Income.sum('amount', {
    where: {
      ...whereCondition,
      [Op.and]: [
        sequelize.where(sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM "date"')), lastMonth),
        sequelize.where(sequelize.fn('EXTRACT', sequelize.literal('YEAR FROM "date"')), currentYear)
      ],
    },
  });
};


Income.getLast6MonthsIncome = async function (userId) {
  const role = await getUserRole(userId);
  const date = new Date();
  date.setMonth(date.getMonth() - 6);

  const whereCondition = role === "admin" ? {} : { userId };

  return await Income.findAll({
    where: {
      ...whereCondition,
      date: {
        [Op.gte]: date,
      },
    },
    attributes: [
      [sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM "date"')), 'month'],
      [sequelize.fn('SUM', sequelize.col('amount')), 'totalIncome'],
    ],
    group: [sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM "date"'))],
  });
};


Income.getSamePeriodLastYearIncome = async function (userId) {
  const role = await getUserRole(userId);
  const date = new Date();
  const lastYearDate = new Date(date);
  lastYearDate.setFullYear(date.getFullYear() - 1);
  date.setMonth(date.getMonth() - 6);

  const whereCondition = role === "admin" ? {} : { userId };

  return await Income.findAll({
    where: {
      ...whereCondition,
      date: {
        [Op.between]: [lastYearDate, date],
      },
    },
    attributes: [
      [sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM "date"')), 'month'],
      [sequelize.fn('SUM', sequelize.col('amount')), 'totalIncome'],
    ],
    group: [sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM "date"'))],
  });
};

export default Income;
