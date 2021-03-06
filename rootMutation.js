const { CategoryType, ImageType, UserType } = require("./schema");
const BigInt = require("graphql-bigint");
const { db } = require("./db");
const {
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString
} = require("graphql");

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "root mutation",
  fields: () => ({
    addUser: {
      type: UserType,
      description: "Add a user",
      args: {
        username: { type: GraphQLNonNull(GraphQLString) },
        fullname: { type: GraphQLNonNull(GraphQLString) },
        email_address: { type: GraphQLNonNull(GraphQLString) },
        location: { type: GraphQLNonNull(GraphQLString) },
        owns_printer: { type: GraphQLBoolean },
        designer_tag: { type: GraphQLBoolean },
        avatar: { type: GraphQLString },
        rating: { type: GraphQLInt }
      },
      resolve(parent, args) {
        return db
          .one(
            "INSERT INTO users(username, fullname, email_address, location, owns_printer, designer_tag, avatar, rating) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
            [
              args.username,
              args.fullname,
              args.email_address,
              args.date_joined,
              args.location,
              args.owns_printer,
              args.designer_tag,
              args.avatar,
              args.rating
            ]
          )
          .then(data => {
            return data;
          })
          .catch(error => {
            console.log("ERROR:", error); // print error;
          });
      }
    },
    addCategory: {
      type: CategoryType,
      description: "Add a category",
      args: {
        slug: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        return db
          .one(
            "INSERT INTO categories(slug, description) VALUES($1, $2) RETURNING *",
            [args.slug, args.description]
          )
          .then(data => {
            return data;
          })
          .catch(error => {
            console.log("ERROR:", error); // print error;
          });
      }
    },
    addImage: {
      type: ImageType,
      description: "Add an image",
      args: {
        title: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        display_name: { type: GraphQLNonNull(GraphQLString) },
        posted_by: { type: GraphQLNonNull(GraphQLString) },
        price: { type: GraphQLInt },
        thumbnail_url: { type: GraphQLNonNull(GraphQLString) },
        obj_image_url: { type: GraphQLNonNull(GraphQLString) },
        format: { type: GraphQLString },
        category: { type: GraphQLString }
      },
      resolve(parent, args) {
        return db
          .one(
            "INSERT INTO images(title, description, display_name, posted_by, price, thumbnail_url, obj_image_url, format, category) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
            [
              args.title,
              args.description,
              args.display_name,
              args.posted_by,
              args.date_uploaded,
              args.price,
              args.thumbnail_url,
              args.obj_image_url,
              args.format,
              args.category
            ]
          )
          .then(data => {
            return data;
          })
          .catch(error => {
            console.log("ERROR:", error); // print error;
          });
      }
    },
    deleteCategory: {
      type: CategoryType,
      description: "Delete a category",
      args: {
        slug: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        return db
          .one("DELETE FROM categories WHERE slug = $1 RETURNING *", [
            args.slug
          ])
          .then(res => {
            return res;
          })
          .catch(error => {
            console.log("ERROR:", error); // print error;
          });
      }
    },
    deleteUser: {
      type: UserType,
      description: "Delete a user",
      args: {
        username: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        return db
          .result("DELETE FROM users WHERE username = $1 RETURNING *", [
            args.username
          ])
          .then(res => {
            console.log(res);
            return res;
          })
          .catch(error => {
            console.log("ERROR:", error); // print error;
          });
      }
    },
    deleteImage: {
      type: ImageType,
      description: "Delete an image",
      args: {
        image_id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return db
          .one("DELETE FROM images WHERE image_id = $1 RETURNING *", [
            args.image_id
          ])
          .then(res => {
            return res;
          })
          .catch(error => {
            console.log("ERROR:", error); // print error;
          });
      }
    },
    updateImage: {
      type: ImageType,
      description: "Update an image",
      args: {
        valueToChange: { type: GraphQLNonNull(GraphQLString) },
        newValue: { type: GraphQLNonNull(GraphQLString) },
        image_id: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        return db
          .one(
            "UPDATE images SET $1:name = $2 WHERE image_id = $3 RETURNING *",
            [args.valueToChange, args.newValue, args.image_id]
          )
          .then(res => {
            return res;
          })
          .catch(error => {
            console.log("ERROR:", error); // print error;
          });
      }
    },
    updateCategory: {
      type: CategoryType,
      description: "Update a category",
      args: {
        valueToUpdate: { type: GraphQLNonNull(GraphQLString) },
        newValue: { type: GraphQLNonNull(GraphQLString) },
        topic_id: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        return db
          .one(
            "UPDATE categories SET $1:name = $2 WHERE topic_id = $3 RETURNING *",
            [args.valueToUpdate, args.newValue, args.topic_id]
          )
          .then(res => {
            return res;
          })
          .catch(error => {
            console.log("ERROR:", error);
          });
      }
    },
    updateUser: {
      type: UserType,
      description: "Update a user",
      args: {
        valueToUpdate: { type: GraphQLString },
        newValue: { type: GraphQLNonNull(GraphQLString) },
        user_id: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        return db
          .one("UPDATE users SET $1:name = $2 WHERE user_id = $3 RETURNING *", [
            args.valueToUpdate,
            args.newValue,
            args.user_id
          ])
          .then(res => {
            return res;
          })
          .catch(error => {
            console.log("ERROR:", error); // print error;
          });
      }
    },
    updateUserBools: {
      type: UserType,
      description: "Update a user",
      args: {
        valueToUpdate: { type: GraphQLString },
        newValue: { type: GraphQLNonNull(GraphQLBoolean) },
        user_id: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        return db
          .one("UPDATE users SET $1:name = $2 WHERE user_id = $3 RETURNING *", [
            args.valueToUpdate,
            args.newValue,
            args.user_id
          ])
          .then(res => {
            return res;
          })
          .catch(error => {
            console.log("ERROR:", error); // print error;
          });
      }
    }
  })
});
exports.RootMutationType = RootMutationType;
