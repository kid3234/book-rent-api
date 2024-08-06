import { DataTypes ,Op} from "sequelize";
import sequelize from "../config/dbConnect.js";
import User from "./User.js";

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

// Static methods for fetching data

// Get admin current month income
Income.getAdminCurrentMonthIncome = async function () {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    return await Income.sum('amount', {
      where: sequelize.and(
        sequelize.where(sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM "date"')), currentMonth),
        sequelize.where(sequelize.fn('EXTRACT', sequelize.literal('YEAR FROM "date"')), currentYear)
      ),
    });
  };
  

// Get admin last month income
Income.getAdminLastMonthIncome = async function () {
    const lastMonth = new Date().getMonth(); // This should be `getMonth() - 1` if using Date object
    const currentYear = new Date().getFullYear();
    return await Income.sum('amount', {
      where: sequelize.and(
        sequelize.where(sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM "date"')), lastMonth),
        sequelize.where(sequelize.fn('EXTRACT', sequelize.literal('YEAR FROM "date"')), currentYear)
      ),
    });
  };
  

// Get admin last 6 months income
Income.getAdminLast6MonthsIncome = async function () {
    const date = new Date();
    date.setMonth(date.getMonth() - 6);
    return await Income.findAll({
      where: {
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
  

// Get admin same period last year income
Income.getAdminSamePeriodLastYearIncome = async function () {
    const date = new Date();
    const lastYearDate = new Date(date);
    lastYearDate.setFullYear(date.getFullYear() - 1);
    date.setMonth(date.getMonth() - 6);
    return await Income.findAll({
      where: {
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
