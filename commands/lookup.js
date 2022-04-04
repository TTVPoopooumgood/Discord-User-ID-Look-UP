const { default: axios } = require("axios");
const { MessageEmbed } = require("discord.js");
const config = require("../config.json")

module.exports = {
    name: "lookup",
    description: "Look up a user with the id",
    options: [
        {
            name: "id",
            description: "Enter the User ID here",
            type: 3,
            required: true
        }
    ],
    async execute(interaction) {
        

        const user_ID = interaction.options.getString("id");

        if(!user_ID) {
            return;
        }

        axios.get(`https://discord.com/api/users/${user_ID}`, {
            method: "GET",
            headers: {
                "Authorization": `Bot ${config.client_token}`
            }
        }).then(res => {
            

            const embed = new MessageEmbed()
            embed.setTitle(`User Look Up [${res.data.username}#${res.data.discriminator}]`)
            embed.setColor(res.data.banner_color ? res.data.accent_color : 'RANDOM')
            embed.setThumbnail(`https://cdn.discordapp.com/avatars/${user_ID}/${res.data.avatar}`)
            embed.addField(`ID:`, `${res.data.id}`)
            embed.addField(`Username:`, `${res.data.username}`)
            embed.addField(`Bot:`, `${res.data.bot ? true : false}`)

            let receive = '';

            receive = res.data.banner;

            if(receive !== null) {
                let format = 'png';
                if(receive.substring(0, 2) === 'a_') {
                    format = 'gif';
                }

                const banner = `https://cdn.discordapp.com/banners/${user_ID}/${receive}.${format}?=size=1028` || null;
                
                embed.setImage(banner || null)
            }

            interaction.reply({embeds: [embed]});
        }).catch(() => {
            return interaction.reply({content: "I don't find informations"})
        })
    }
}
