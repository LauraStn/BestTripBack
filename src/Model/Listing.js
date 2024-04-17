class Listing {
    constructor(
        userId,
        title,
        description,
        image,
        participant,
        maxParticipant,
        eventDate,
        place
    ) {
        this.userId = userId
        this.title = title
        this.description = description
        this.image = image
        this.participant = participant
        this.maxParticipant = maxParticipant
        this.eventDate = eventDate
        this.place = place

    }
}
module.exports = { Listing }
