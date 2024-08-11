// import { DataTypes } from "sequelize";
// import sequelize from "../config/dbConnect.js";
// import {User} from "./user.js"

// export  const Book = sequelize.define(
//   "Book",
//   {

//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },

//     title: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },

//     image: {
//       type: DataTypes.STRING,
//       defaultValue:
//         "https://www.freepik.com/premium-ai-image/stack-books-with-green-blue-purple-book-top-them_271728489.htm#fromView=search&page=1&position=8&uuid=4e62e286-7283-402c-a0c4-7f16a65e524c",
//     },

//     price: {
//       type: DataTypes.DOUBLE,
//       defaultValue: 40,
//       allowNull: false,
//     },

//     author: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },

//     category: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },

//     quantity: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       defaultValue: 1,
//     },

//     availability: {
//       type: DataTypes.ENUM("FREE", "RENTED"),
//       defaultValue: "FREE",
//     },

//     ownerId: {
//       type: DataTypes.UUID,
//       allowNull: false,
//       references: {
//         model: User,
//         key: "id",
//       },
//     },

//     status: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false,
//     },

//   },

//   {
//     timestamps: true,
//   }
// );

// Book.belongsTo(User, { as: "owner", foreignKey: "ownerId" });

// User.hasMany(Book, { as: "books", foreignKey: "ownerId", onDelete: "CASCADE" });

// // User.hasMany(Book, { as: "books", foreignKey: "ownerId" , onDelete: "CASCADE",});

// // Get available books
// Book.getAvailableBooksForDashboard = async function () {
//   return await Book.findAll({
//     attributes: [
//       'category' ,
//       [sequelize.fn('COUNT', sequelize.col('id')), 'value']
//     ],
//     group: ['category']
//   });
// };

// Book.getAvailableBooks = async function () {
//   return await Book.findAll({
//     where: {
//       status: true,
//       availability: "FREE"
//     } ,
//     include: [
//       {
//         model:  User ,
//         as: 'owner',
//         where: {
//           status: true,
//         },
//         attributes:[],
//       },
//     ],
//   });
// };

// Book.getBookStatusDataForAdmin = async function () {
//   return await Book.findAll({
//     attributes: ["id","quantity", "title", "author", "status", "availability", "ownerId","price"],
//     include: [
//       {
//         model: User,
//         as: "owner",
//         attributes: ["id", "name","image","email"],
//       },
//     ],
//   });
// };

// // Book.getAvailableBooksByOwner = async function (ownerId) {
// //   return await Book.findAll({
// //     where: { ownerId },
// //   });
// // };

// Book.getBookStatusDataForOwner = async function (ownerId) {
//   return await Book.findAll({
//     where: { ownerId },
//     attributes: ["id", "title", "availability", "ownerId","price","quantity"],
//   });

// };

// Book.getAdminBookData = async function () {
//   return await Book.findAll({
//     attributes: [
//       "id",
//       "title",
//       "author",
//       "category",
//       "status",
//       "availability",
//       "ownerId",
//     ],
//     include: [
//       {
//         model: User,
//         as: "owner",
//         attributes: ["id", "email"],
//       },
//     ],
//   });
// };

// // export default Book;

import { DataTypes } from "sequelize";
import sequelize from "../config/dbConnect.js";

export const Book = sequelize.define(
  "Book",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    image: {
      type: DataTypes.STRING,
      defaultValue:
        "https://www.freepik.com/premium-ai-image/stack-books-with-green-blue-purple-book-top-them_271728489.htm#fromView=search&page=1&position=8&uuid=4e62e286-7283-402c-a0c4-7f16a65e524c",
    },

    price: {
      type: DataTypes.DOUBLE,
      defaultValue: 40,
      allowNull: false,
    },

    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },

    availability: {
      type: DataTypes.ENUM("FREE", "RENTED"),
      defaultValue: "FREE",
    },

    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    // hooks: {
    //   afterDefine: async (Book) => {
    //     const { User } = await import("./user.js");
    //     Book.belongsTo(User, { as: "owner", foreignKey: "ownerId" });
    //     User.hasMany(Book, { as: "books", foreignKey: "ownerId", onDelete: "CASCADE" });
    //   }
    // }
  }
);

(async () => {
  const { User } = await import("./user.js");

  Book.belongsTo(User, { as: "owner", foreignKey: "ownerId" });
  User.hasMany(Book, {
    as: "books",
    foreignKey: "ownerId",
    onDelete: "CASCADE",
  });

  Book.getAvailableBooksForDashboardForAdmin = async function () {
    return await Book.findAll({
      attributes: [
        "category",
        [sequelize.fn("COUNT", sequelize.col("id")), "value"],
      ],
      group: ["category"],
    });
  };

  Book.getAvailableBooksForDashboardForOwner = async function (ownerId) {
    return await Book.findAll({
      where: {
        id: ownerId,
      },
      attributes: [
        "category",
        [sequelize.fn("COUNT", sequelize.col("id")), "value"],
      ],
      group: ["category"],
    });
  };

  Book.getAvailableBooks = async function () {
    return await Book.findAll({
      where: {
        status: true,
        availability: "FREE",
      },
      include: [
        {
          model: User,
          as: "owner",
          where: {
            status: true,
          },
          attributes: [],
        },
      ],
    });
  };

  Book.getBookStatusDataForAdmin = async function () {
    return await Book.findAll({
      attributes: [
        "id",
        "quantity",
        "title",
        "author",
        "status",
        "availability",
        "ownerId",
        "price",
      ],
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "name", "image", "email"],
        },
      ],
    });
  };

  // Book.getAvailableBooksByOwner = async function (ownerId) {
  //   return await Book.findAll({
  //     where: { ownerId },
  //   });
  // };

  Book.getBookStatusDataForOwner = async function (ownerId) {
    return await Book.findAll({
      where: { ownerId },
      attributes: [
        "id",
        "title",
        "availability",
        "ownerId",
        "price",
        "quantity",
      ],
    });
  };

  Book.getAdminBookData = async function () {
    return await Book.findAll({
      attributes: [
        "id",
        "title",
        "author",
        "category",
        "status",
        "availability",
        "ownerId",
      ],
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "email", "name", "image"],
        },
      ],
    });
  };
})();

// Get available books

// export default Book;
