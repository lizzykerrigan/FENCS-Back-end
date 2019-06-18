const express = require("express");
const expressGraphQl = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLID,
  GraphQLBoolean
} = require("graphql");
const { GraphQLDate } = require("graphql-iso-date");
const app = express();
const categories = require("./data/categories");
const images = require("./data/images");
const users = require("./data/users");

const CategoryType = new GraphQLObjectType({
  name: "Categories",
  description: "This represents the category of an image file",
  fields: () => ({
    topic_id: { type: GraphQLID },
    slug: { type: GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLNonNull(GraphQLString) },
    images: {
      type: new GraphQLList(ImageType),
      resolve: category => {
        return images.filter(image => image.category === category.slug);
      }
    }
  })
});

const ImageType = new GraphQLObjectType({
  name: "Images",
  description: "This represents an image",
  fields: () => ({
    image_id: { type: GraphQLID },
    title: { type: GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLNonNull(GraphQLString) },
    display_name: { type: GraphQLNonNull(GraphQLString) },
    posted_by: { type: GraphQLNonNull(GraphQLString) },
    date_uploaded: { type: GraphQLInt },
    price: { type: GraphQLInt },
    thumbnail_url: { type: GraphQLNonNull(GraphQLString) },
    obj_image_url: { type: GraphQLNonNull(GraphQLString) },
    format: { type: GraphQLString },
    likes: { type: GraphQLInt },
    category: {
      type: CategoryType,
      resolve: image => {
        return categories.find(category => category.slug === image.category);
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: "Users",
  description: "This represents an user",
  fields: () => ({
    user_id: { type: GraphQLID },
    username: { type: GraphQLNonNull(GraphQLString) },
    forename: { type: GraphQLNonNull(GraphQLString) },
    email_address: { type: GraphQLNonNull(GraphQLString) },
    date_joined: { type: GraphQLInt },
    location: { type: GraphQLNonNull(GraphQLString) },
    owns_printer: { type: GraphQLBoolean },
    designer_tag: { type: GraphQLBoolean },
    avatar: { type: GraphQLString },
    rating: { type: GraphQLInt }
  })
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    // book: {
    //   type: BookType,
    //   decription: "A single book",
    //   args: {
    //     id: { type: GraphQLInt }
    //   },
    //   resolve: (parent, args) => books.find(book => book.id === args.id)
    // },
    categories: {
      type: new GraphQLList(CategoryType),
      decription: "List of all categories",
      resolve: () => categories
    },
    images: {
      type: new GraphQLList(ImageType),
      decription: "List of all images",
      resolve: () => images
    },
    users: {
      type: new GraphQLList(UserType),
      decription: "List of all users",
      resolve: () => users
    }
    // author: {
    //   type: AuthorType,
    //   decription: "A single author",
    //   args: {
    //     id: { type: GraphQLInt }
    //   },
    //   resolve: (parent, args) => authors.find(author => author.id === args.id)
    // }
  })
});

// const RootMutationType = new GraphQLObjectType({
//   name: "Mutation",
//   description: "root mutation",
//   fields: () => ({
//     addUser: {
//       type: UserType,
//       description: "Add a user",
//       args: {
//         username: { type: GraphQLNonNull(GraphQLString) },
//         forename: { type: GraphQLNonNull(GraphQLString) },
//         email_address: { type: GraphQLNonNull(GraphQLString) },
//         date_joined: { type: GraphQLDate },
//         location: { type: GraphQLNonNull(GraphQLString) },
//         owns_printer: { type: GraphQLBoolean },
//         designer_tag: { type: GraphQLBoolean },
//         avatar: { type: GraphQLString },
//         rating: { type: GraphQLInt },
//         images: {
//           type: images,
//           resolve: user => {
//             return images.find(image => image.posted_by === user.username);
//           }
//         }
//       },
//       resolve: (parent, args) => {
//         const user = {
//           name: args.username,
//           forename: args.forename,
//           email_address: args.email_address

//         };
//         books.push(book);
//         return book;
//       }
//     }
//   })
// });

const schema = new GraphQLSchema({
  query: RootQueryType
  // mutation: RootMutationType
});

app.use(
  "/",
  expressGraphQl({
    schema: schema,
    graphiql: true
  })
);
app.listen(4000, () => {
  console.log("listening for requests on port 4000...");
});
