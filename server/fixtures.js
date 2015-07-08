if (Posts.find().count() === 0) {

    Posts.insert({
        title: 'Marine',
        user: 'Bobby99',
        imageName: 'marine.jpg'
    })

    Posts.insert({
        title: 'Elf',
        user: 'SexyPistol33',
        imageName: 'night_elf.jpg'
    })

    Posts.insert({
        title: 'Har-har Pirate',
        user: 'SkyISPSuck69',
        imageName: 'pirate.jpg'
    })
}