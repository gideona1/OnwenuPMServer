import dotenv from "dotenv";
dotenv.config();

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import cors from "cors";
import bodyParser from "body-parser";
import express from "express";

import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import { typeDefs } from "./src/core/typeDefs.js";
import { resolvers } from "./src/core/resolvers.js";
import { verifyToken } from "./src/methods/Utils/VerifyToken.js";

const startServer = async () => {
    const app = express();

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        // plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        csrfPrevention: false
    });

    await server.start();

    // app.use("/uploads", express.static("uploads"));
    app.use("/graphql",
        // graphqlUploadExpress({
        //     maxFileSize: 10000000,
        //     maxFiles: 20,
        // }),
        cors(),
        bodyParser.json(),
        expressMiddleware(server, {
            context: async ({ req }) => {
                const token = req.headers.authorization || "";

                // throw new GraphQLError('User is not authenticated', {
                //     extensions: {
                //         code: 'UNAUTHENTICATED',
                //         http: { status: 401 },
                //     },
                // });

                return verifyToken(token);
            }
        }
        )
    );

    await mongoose.connect(process.env.DB_CONNECTION);
    app.listen({ port: process.env.PORT }, () => console.log(`Server ready at http://localhost:${process.env.PORT}/graphql 🚀 `));
};

startServer();

// const customer = await stripe.customers.create({
//     email: 'customer@example.com',
// });

// console.log(customer.id);