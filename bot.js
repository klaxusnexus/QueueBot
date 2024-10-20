const tmi = require('tmi.js');
const fs = require('fs');

const opts = {
    identity: {
        username: '<username>',
        password: 'oauth:<token>'
    },
    channels: [
        'channelname1',
        'channelname2',
        'channelname3'
    ]
};

const client = new tmi.Client(opts);

let queue = [];
let blacklist = [];

function isModOrBroadcaster(tags) {
    return tags.mod || tags.badges?.broadcaster === '1';
}

function isPrivilegedUser(tags) {
    return tags.mod || tags.badges?.broadcaster === '1' || tags.badges?.vip === '1';
}

function loadBlacklist() {
    try {
        const data = fs.readFileSync('blacklist.json', 'utf8');
        blacklist = JSON.parse(data);
    } catch (err) {
        console.error('Error reading blacklist file:', err);
        blacklist = [];
        fs.writeFileSync('blacklist.json', JSON.stringify([]), 'utf8');
    }
}

function saveBlacklist() {
    try {
        fs.writeFileSync('blacklist.json', JSON.stringify(blacklist), 'utf8');
    } catch (err) {
        console.error('Error writing to blacklist file:', err);
    }
}

function displayQueue(channel) {
    if (queue.length === 0) {
        client.say(channel, "The queue is currently empty!");
    } else {
        const queueList = queue.join(', ');
        client.say(channel, `Current queue: ${queueList}`);
    }
}

client.on('message', (channel, tags, message, self) => {
    try {
        if (self) return;

        const command = message.trim().toLowerCase();

        if (command === '!qjoin') {
            if (blacklist.includes(tags.username)) {
                client.say(channel, `${tags.username}, you are blacklisted from the queue!`);
                return;
            }
            if (queue.includes(tags.username)) {
                client.say(channel, `${tags.username}, you are already in the queue!`);
            } else {
                queue.push(tags.username);
                client.say(channel, `${tags.username} has joined the queue!`);
                displayQueue(channel);
            }
        } 
        
        else if (command === '!qleave') {
            const index = queue.indexOf(tags.username);
            if (index > -1) {
                queue.splice(index, 1);
                client.say(channel, `${tags.username} has left the queue!`);
                displayQueue(channel);
            } else {
                client.say(channel, `${tags.username}, you are not in the queue!`);
            }
        } 
        
        else if (command === '!queue') {
            displayQueue(channel);
        } 
        
        else if (command.startsWith('!qskipuser ')) {
            const username = command.split(' ')[1];
            const index = queue.indexOf(username);
            
            if (isPrivilegedUser(tags)) {
                if (index > -1) {
                    queue.push(queue.splice(index, 1)[0]);
                    client.say(channel, `${username} has been skipped to the back of the queue!`);
                    displayQueue(channel);
                } else {
                    client.say(channel, `${username} is not in the queue!`);
                }
            } else {
                client.say(channel, `${tags.username}, you do not have permission to use this command!`);
            }
        } 
        
        else if (command.startsWith('!qblacklistuser ')) {
            if (!isModOrBroadcaster(tags)) {
                client.say(channel, `${tags.username}, you do not have permission to use this command!`);
                return;
            }
            const username = command.split(' ')[1];
            if (!blacklist.includes(username)) {
                blacklist.push(username);
                const index = queue.indexOf(username);
                if (index > -1) {
                    queue.splice(index, 1);
                }
                saveBlacklist();
                client.say(channel, `${username} has been blacklisted and removed from the queue!`);
            } else {
                client.say(channel, `${username} is already blacklisted!`);
            }
        } 
        
        else if (command.startsWith('!qunblacklistuser ')) {
            if (!isModOrBroadcaster(tags)) {
                client.say(channel, `${tags.username}, you do not have permission to use this command!`);
                return;
            }
            const username = command.split(' ')[1];
            const index = blacklist.indexOf(username);
            if (index > -1) {
                blacklist.splice(index, 1);
                saveBlacklist();
                client.say(channel, `${username} has been unblacklisted!`);
            } else {
                client.say(channel, `${username} is not in the blacklist!`);
            }
        }

        else if (command === '!qclear') {
            if (isPrivilegedUser(tags)) {
                queue = []; 
                client.say(channel, "The queue has been cleared!");
            } else {
                client.say(channel, `${tags.username}, you do not have permission to use this command!`);
            }
        }

        else if (command === '!qcreator') {
            const creatorName = 'klaxusnexus';
            client.say(channel, `The person who made this bot is ${creatorName}!`);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
});

loadBlacklist();

client.connect()
    .then(() => console.log('Connected to Twitch!'))
    .catch(err => console.error('Error connecting to Twitch:', err));

process.on('uncaughtException', (err) => {
    console.error('There was an uncaught error', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});