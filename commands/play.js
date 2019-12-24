const ytdl = require("ytdl-core");

module.exports = {
    name: "play",
    description: "Jouer de la musique en mettant un url",
    async execute(message) {
        const args = message.content.split(' ');
        const queue = message.client.queue;
        const serveurQueue = message.client.queue.get(message.guild.id);

        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) return message.reply("Vous devez être dans un salon vocal!");
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            return message.reply("J’ai besoin des permissions pour rejoindre et parler dans le salon vocal!");
        }
    
        const songInfo = await ytdl.getInfo(args[1]);
        const song = {
            title: songInfo.title,
            url: songInfo.video_url,
        };
    
        if (!serveurQueue) {
            const queueContruct = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true,
            };
    
            queue.set(message.guild.id, queueContruct);
    
            queueContruct.songs.push(song);
    
            try {
                var connection = await voiceChannel.join();
                queueContruct.connection = connection;
                this.play(message, queueContruct.songs[0]);
            } catch (err) {
                console.log(err);
                queue.delete(message.guild.id);
                return message.channel.send(err);
            }
        } else {
            serveurQueue.songs.push(song);
            console.log(serveurQueue.songs);
            return message.channel.send(`${song.title} a été rajouté dans la queue`);
        }
    },
    play(message, song) {
        const queue = message.client.queue;
        const guild = message.guild;
        const serveurQueue = queue.get(guild.id);

        if (!song) {
            serveurQueue.voiceChannel.leave();
            queue.delete(guild.id);
            return;
        }
    
        const dispatcher = serveurQueue.connection.playStream(ytdl(song.url))
            .on("end", () => {
                console.log("Fin de la musique!");
                serveurQueue.songs.shift();
                play(guild, serveurQueue.songs[0]);
            })
            .on("error", erreur => {
                console.error(erreur);
            });
        dispatcher.setVolumeLogarithmic(serveurQueue.volume / 5);
    },
}
