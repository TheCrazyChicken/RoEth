module.exports = {
    name: "help",
    description: "Affiche les commandes",
    execute(message) {
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
                        name: "shutdown (Ne fonctionne pas pour l’instant)",
                        value: "Éteint le bot"
                    },
                    {
                        name: "restart (Ne fonctionne pas pour l’instant)",
                        value: "Redémarre le bot"
                    }
                ]
            }
        });
    }
}
