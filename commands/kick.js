module.exports = {
    name: "kick",
    description: "Kick un membre du serveur",
    execute(message) {
        if (!message.guild) return;
        const utilisateur = message.mentions.users.first();
        if (utilisateur) {
            const membre = message.guild.member(utilisateur);
            if (membre) {
                membre.kick("Raison facultative à afficher dans les journaux d'audit").then(() => {
                    message.reply(`${utilisateur.tag} a été kick`);
                }).catch(erreur => {
                    message.reply("Je ne peux pas kick l’utilisateur");
                    console.error(erreur);
                });
            } else {
                message.reply("Cet utilisateur n’est pas dans le salon;");
            }
        } else {
            message.reply("Vous devez mentionnez l’utilisateur pour le kick!");
        }
    },
}
