const Discord = require("discord.js");
const moment = require("moment")
const ytdl = require("ytdl-core");
const { prefix, token, ownerid } = require("./config.json")

const client = new Discord.Client();
const queue = new Map();


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
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    let args = message.content.slice(prefix.length).trim().split(" ");
    const serveurQueue = queue.get(message.guild.id);

    if (message.content.startsWith(`${prefix}play`)) {
        execute(message, serveurQueue);
        return;
    } else if (message.content.startsWith(`${prefix}skip`)) {
        skip(message, serveurQueue);
        return;
    } else if (message.content.startsWith(`${prefix}stop`)) {
        stop(message, serveurQueue);
        return;
    } else if (message.content.startsWith(`${prefix}nowplaying`)) {
        nowplaying(message, serveurQueue);
        return;
    } else if (message.content.startsWith(`${prefix}kick`)) {
        kick(message)
        return;
    } else if (message.content.startsWith(`${prefix}ban`)) {
        ban(message)
        return;
    } else if (message.content.startsWith(`${prefix}help`)) {
        help(message)
        return;
    } else if (message.content.startsWith(`${prefix}stats`)) {
        stats(message)
        return; 
    } else if (message.content.startsWith(`${prefix}clear`)) {
        clear(message)
        return;
    } else if (message.content.startsWith(`${prefix}shutdown`)) {
        shutdown(message)
        return;
    } else if (message.content.startsWith(`${prefix}restart`)) {
        restart(message)
        return
    } else {
        message.reply("Vous devez entrer une commande valide!")
    }
});

async function execute(message, serveurQueue) {
    const args = message.content.split(' ');

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
            play(message.guild, queueContruct.songs[0]);
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
}

function skip(message, serveurQueue) {
    if (!message.member.voiceChannel) return message.reply("Vous devez être dans un salon vocal pour sauter la musique!");
    if (!serveurQueue) return message.reply("Il y a pas de chanson que je puisse sauter");
    serveurQueue.connection.dispatcher.end();
}

function stop(message, serveurQueue) {
    if (!message.member.voiceChannel) return message.reply("Vous devez être dans un salon vocal pour stopper la musique!");
    serveurQueue.songs = [];
    serveurQueue.connection.dispatcher.end();
}

function play(guild, song) {
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
}

function nowplaying(message, serveurQueue) {
    if (!serveurQueue) return message.channel.send("Aucune musique n’es jouer");
    return message.channel.send(`Lecture en cours: ${serveurQueue.songs[0].title}`);
}

function kick(message) {
    if (!message.guild) return;
    if (message.content.startsWith(`${prefix}kick`)) {
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
    }
}

function ban(message) {
    if (!message.guild) return;
    if (message.content.startsWith(`${prefix}ban`)) {
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
    }
}

function help(message) {
    message.channel.send({
        embed: {
            color: 0x11b4db,
            title: "Les commandes de musique du bot",
            fields: [
                {
                    name: 'play',
                    value: "Permet de jouer de la musique en mettant un \n url youtube"
                },
                {
                    name: 'skip',
                    value: "Permet de sauter la musique qui passe si il \n y a une musique dans la file d’attente"
                },
                {
                    name: 'stop',
                    value: "Permet d’arrêter la musique"
                },
                {
                    name: "nowplaying",
                    value: "Affiche ce qui est jouer"
                }
            ],
        }
    });
    message.channel.send({
        embed: {
            color: 0x11b4db,
            title: "Les commandes pour les administrateurs",
            fields: [
                {
                    name: "kick",
                    value: "Permet de virer un membre du serveur"
                },
                {
                    name: "ban",
                    value: "Permet de bannir un membre du serveur"
                },
                {
                    name: "clear",
                    value: "Permet de supprimmer le nombre de message \n voulue"
                },
                {
                    name: "shutdown",
                    value: "Éteint le bot"
                },
                {
                    name: "restart",
                    value: "Redémarre le bot"
                }
            ]
        }
    });
}

function stats(message) {
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

async function clear(message) {
    const args = message.content.split(' ');
		let deleteCount = 0;
		try {
			deleteCount = parseInt(args[1], 10);
		} catch(err) {
            return message.reply('Veuillez indiquer le nombre de messages à supprimer. (max 1000)')
		}
        

		if (!deleteCount || deleteCount < 2 || deleteCount > 1000)
			return message.reply('Veuillez choisir un nombre entre 2 et 1000 de message à supprimer');

		const fetched = await message.channel.fetchMessages({
			limit: deleteCount,
		});
		message.channel.bulkDelete(fetched)
			.catch(error => message.reply(`Je ne peux pas supprimer les messages car : ${error}`));
}

function restart(message) {
    if (message.author.id = ownerid) {
        message.channel.send('Redémarage').then(m => {
            client.destroy().then(() => {
                client.login(token);
            });
        });
    }
}

function shutdown(message) {
    if (message.author.id = ownerid) {
        message.channel.send("Le bot s’éteint...").then(m => {
            client.destroy()
        });
    }
}

client.login(token);

