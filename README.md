# QueueBot

Queue Bot is a Twitch chat bot designed to manage a user queue for various activities. The bot allows users to join and leave the queue and provides commands for moderators to manage user interactions effectively.

## Features

- Users can join and leave a queue with commands.
- Moderators can manage the queue by skipping users, blacklisting, and unblacklisting users.
- Broadcasters and VIPs can perform additional queue management tasks.
- Creator information can be displayed.

## Commands

| Command                     | Description                                                                                   | Permissions                         |
|-----------------------------|-----------------------------------------------------------------------------------------------|-------------------------------------|
| `!qjoin`                    | Adds the user to the queue.                                                                  | Anyone (not blacklisted)            |
| `!qleave`                   | Removes the user from the queue.                                                              | Anyone in the queue                 |
| `!queue`                    | Displays the current queue.                                                                   | Anyone                              |
| `!qskipuser <username>`     | Skips a specified user and moves them to the back of the queue.                             | Mods, VIPs, and the broadcaster     |
| `!qblacklistuser <username>`| Blacklists a user from the queue, removing them if they are in the queue.                   | Moderators only                     |
| `!qunblacklistuser <username>` | Removes a user from the blacklist, allowing them to join the queue again.                | Moderators only                     |
| `!qclear`                   | Clears the entire queue, removing all users.                                                 | Mods, VIPs, and the broadcaster     |
| `!qcreator`                 | Displays the name of the bot's creator.                                                      | Anyone                              |

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/klaxusnexus/QueueBot.git
   cd QueueBot
   ```

2. Install the depencies:
   ```bash
   npm install
   ```

3. Create a blacklist.json with the following content:
  ```json
  []
  ```

4. Update the bots credentials in the code.
Change the username and password in the opts object in index.js to your bot's Twitch account credentials.
You can use https://twitchtokengenerator.com to get your oauth code.

# Usage
1. Start the bot.
  ```bash
  node bot.js
  ```
2. The bot will connect to your Twitch channel specified in the channels array within the opts object.
