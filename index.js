const fs = require("fs")
const Discord = require("discord.js");
const Client = require("./client/Client");
const { prefix, token } = require("./config.json");

const client = new Client();
client.commands = new Discord.Collection();

const queue = new Map();

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

console.log(client.commands);

client.once("ready", () => {
    console.log("Lancement du bot");
});

client.once("reconnecting", () => {
    console.log("Reconnection!");
});

client.once("disconnect", () => {
    console.log("Deconnection!");
});

client.on("message", async message => {
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);

    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    try {
        command.execute(message);
    } catch (erreur) {
        console.error(erreur);
        message.reply("Une erreur s'est produite lors de l'exécution de cette commande!");
    }
});

client.login(token)
