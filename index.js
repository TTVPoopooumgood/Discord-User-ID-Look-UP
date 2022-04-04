const { Client, Intents } = require("discord.js");
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});
const fs = require("fs");
const config = require("./config.json");

const cmd = new Map();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

client.on("ready", () => {
    console.log("User id lookup is online");
    client.user.setActivity({name: 'I Search for Users', type: "PLAYING"});
});

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    cmd.set(command.name, command);
}

const rest = new REST({ version: '9' }).setToken(config.client_token);

const data = Array.from(cmd, ([name, value]) => value).map((c) => ({
    name: c.name,
    description: c.description,
    options: c.options,
}));

(async () => {
    try {
        await rest.put(
            Routes.applicationCommands(config.client_id),
            {body: data}
        )
        
    } catch (error) {
        console.log("Error", error)
    }
})();


client.on("interactionCreate", async (interaction) => {
    if(interaction.isCommand()) {
        
        const command = cmd.get(interaction.commandName);
        if(command) {
            command.execute(interaction, client);
        }
    }
});

client.login(config.client_token)
