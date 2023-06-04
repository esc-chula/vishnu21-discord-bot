# Vishnu 21st Discord Bot

Discord bot (น้องปูน) for the Vishnu 21st Discord server.

## Features

-   Welcome message
-   Auto DM role adding by `studentId` from MongoDB
-   Music player powered by `Lavalink`
-   ExpressJS API for user data
    -   CRUD operations
    -   Discord ID linking
    -   MongoDB as database
    -   Google Sheets integration

### API Documentation

| Route                          | Description                                      | Body                                                                  |
| ------------------------------ | ------------------------------------------------ | --------------------------------------------------------------------- |
| `GET /user`                    | Get all users                                    |                                                                       |
| `GET /user/:studentId`         | Get user by `studentId`                          |                                                                       |
| `POST /user`                   | Create user                                      | `position`, `firstName`, `lastName`, `nickName`, `group`, `studentId` |
| `PUT /user/:studentId`         | Update user                                      | `position`, `firstName`, `lastName`, `nickName`, `group`, `studentId` |
| `DELETE /user/:studentId`      | Delete user                                      |                                                                       |
| `GET /user/discord/:discordId` | Get user by `discordId`                          |                                                                       |
| `POST /user/discord/link`      | Link `discordId` to user data                    | `studentId`, `discordId`                                              |
| `POST /user/discord/unlink`    | Remove `discordId` from user data                | `discordId`                                                           |
| `GET /user/sheets`             | Get user data from Google Sheets                 |                                                                       |
| `POST /user/sheets/register`   | Get user data and register it from Google Sheets |

Yes, I'm too lazy for Swagger ;)

## Getting Started

### Prerequisites

-   Node.js
-   MongoDB
-   Lavalink

### Installation

1. Install NPM packages
    ```
    npm install
    ```
2. Create `.env` file
    ```
    cp .env.example .env
    ```
3. Fill in the `.env` file
4. Run the application
    ```
    npm run start
    ```
