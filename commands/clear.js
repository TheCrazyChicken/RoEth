module.exports = {
    name: "clear",
    description: "Supprime les messages les plus récents entre 2 et 1000",
    async execute(message) {
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
}
