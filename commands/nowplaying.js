module.exports = {
    name: "nowplaying",
    description: "Affiche la musique que set jouer si il y en a une",
    execute(message) {
        const serveurQueue = message.client.queue.get(message.guild.id);
        if (!serveurQueue) return message.channel.send("Aucune musique n’es jouer");
        return message.channel.send(`Lecture en cours: ${serveurQueue.songs[0].title}`);
    }
}
