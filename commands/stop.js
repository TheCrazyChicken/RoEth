const ytdl = require("ytdl-core");

module.exports = {
    name: "stop",
    description: "Permet d’arrêter la musique et supprimer la queue",
    execute(message) {
        if (!message.member.voiceChannel) return message.reply("Vous devez être dans un salon vocal pour stopper la musique!");
        serveurQueue.songs = [];
        serveurQueue.connection.dispatcher.end();
    },
}
