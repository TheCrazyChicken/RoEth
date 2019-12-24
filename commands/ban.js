module.exports = {
    name: "ban",
    description: "Bannir un membre",
    execute(message) {
        if (!message.guild) return;
        const utilisateur = message.mentions.users.first();
        if (utilisateur) {
            const membre = message.guild.member(utilisateur);
            if (membre) {
                membre.ban({
                    reason: "C’est pas bien!",
                }).then(() => {
                    message.reply(`${utilisateur.tag} a été banni`);
                 }).catch(err => {
                    message.reply("L’utilisateur ne peut pas être banni!");
                    console.error(err);
                });
            } else {
                message.reply("Cet utilisateur n’est pas dans le salon;");
            }
        } else {
            message.reply("Vous devez mentionnez l’utilisateur pour le ban!");
        }
    },
}
