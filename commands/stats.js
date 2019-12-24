const moment = require("moment")

module.exports = {
    name: "stats",
    description: "Montre le statistiques d’un membre ou vous même",
    execute(message) {
        const membre = message.mentions.members.first() || message.member;
        message.channel.send({
            embed: {
                color: 0x001fe2,
                title: `Statistiques de l'utilisateur **${membre.user.username}**`,
                thumbnail: {
                    url: membre.user.displayAvatarURL
                },
                fields: [
                    {
                        name: 'ID :',
                        value: membre.id 
                    },
                    {
                        name: 'Crée le :',
                        value: moment.utc(membre.user.createdAt).format("LL")
                    },
                    {
                        name: 'Jeu :',
                        value: membre.user.presence.game ? membre.user.presence.game.name : 'Aucun jeu'
                    },
                    {
                        name: 'Rejoin le :',
                        value: moment.utc(membre.joinedAt).format('LL')
                    }
                ],
                footer: {
                    text: `Informations de l'utilisateur ${membre.user.username}`
                }
            }
        });
    }
}
