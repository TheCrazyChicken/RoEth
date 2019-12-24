module.exports = {
    name: "skip",
    description: "Permet de sauter une chanson dans la queue",
    execute(message) {
        if (!message.member.voiceChannel) return message.reply("Vous devez être dans un salon vocal pour sauter la musique!");
        if (!serveurQueue) return message.reply("Il y a pas de chanson que je puisse sauter");
        serveurQueue.connection.dispatcher.end();
    }
}
